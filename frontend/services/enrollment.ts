import type { EnrollmentPaymentMode } from '@/lib/enrollment/seat-reservation';
import { apiUrl } from '@/lib/api-url';
import {
  pickStripePublishableKey,
} from '@/lib/stripe-key-mode';
import { readStripePublishableKeyFromEnv } from '@/lib/stripe-publishable-key';
import { currencyMinorUnit } from '@/lib/scholarship';

async function fetchPublishableKeyFromApi(): Promise<string> {
  const urls = ['/config/stripe', '/api/config/public'];

  for (const path of urls) {
    try {
      const res = await fetch(apiUrl(path), { cache: 'no-store' });
      if (!res.ok) continue;
      const body = (await res.json()) as { publishableKey?: string; stripePublishableKey?: string };
      const key = (body.publishableKey ?? body.stripePublishableKey)?.trim() ?? '';
      if (key.startsWith('pk_')) return key;
    } catch {
      /* try next source */
    }
  }

  return '';
}

async function parseApi<T>(res: Response): Promise<{ data?: T; error?: string }> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) return { error: (body as { error?: string }).error ?? res.statusText };
  return { data: body as T };
}

type EnrollmentCheckoutPayload = {
  offeringId: string;
  siteCertId: string;
  tierSlug: string;
  regionId: string;
  paymentMode?: EnrollmentPaymentMode;
  gccCountry?: string | null;
  email?: string;
  name?: string;
  colorScheme?: 'light' | 'dark';
  /** Invite scholarship pages only. */
  offerType?: 'scholarship_invite';
};

type EnrollmentCheckoutResponse = {
  session: {
    url: string | null;
    sessionId: string;
    clientSecret: string | null;
  };
  usdCents: number;
  depositUsd: number;
  fullUsdCents: number;
  paymentMode: EnrollmentPaymentMode;
};

export async function fetchStripePublishableKey(hint?: string | null): Promise<string> {
  const fromApi = await fetchPublishableKeyFromApi();
  return pickStripePublishableKey({
    hint: hint?.trim() ?? '',
    env: readStripePublishableKeyFromEnv(),
    api: fromApi,
  });
}

export async function createEnrollmentEmbeddedCheckout(payload: EnrollmentCheckoutPayload) {
  const res = await fetch(apiUrl('/api/checkout/seat-deposit'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, uiMode: 'embedded' }),
  });
  return parseApi<EnrollmentCheckoutResponse>(res);
}

/** @deprecated Use createEnrollmentEmbeddedCheckout */
export async function createSeatDepositEmbeddedCheckout(payload: EnrollmentCheckoutPayload) {
  return createEnrollmentEmbeddedCheckout({
    ...payload,
    paymentMode: payload.paymentMode ?? 'mentor_led',
  });
}

export async function createSeatDepositCheckout(
  payload: EnrollmentCheckoutPayload & { email: string; name?: string },
) {
  const res = await fetch(apiUrl('/api/checkout/seat-deposit'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      uiMode: 'redirect',
      paymentMode: payload.paymentMode ?? 'seat_deposit',
    }),
  });
  return parseApi<EnrollmentCheckoutResponse>(res);
}

export async function verifyCheckoutSession(sessionId: string) {
  const res = await fetch(apiUrl(`/api/checkout/session/${encodeURIComponent(sessionId)}`));
  const result = await parseApi<{
    sessionId: string;
    status: string;
    paid: boolean;
    offeringId?: string | null;
    paymentType?: string | null;
    currency?: unknown;
    amountTotal?: unknown;
    value?: number | null;
    durableTransactionId?: string | null;
    durablePurchaseEventId?: string | null;
  }>(res);
  if (!result.data) return result;
  const { currency, amountTotal } = normalizeVerifiedStripeMoney(
    result.data.currency,
    result.data.amountTotal,
  );
  return {
    ...result,
    data: {
      ...result.data,
      currency,
      amountTotal,
    },
  };
}

export function normalizeVerifiedStripeMoney(
  currencyValue: unknown,
  amountValue: unknown,
): {
  currency?: string;
  amountTotal?: number;
} {
  const currency =
    typeof currencyValue === 'string' && /^[a-zA-Z]{3}$/.test(currencyValue.trim())
      ? currencyValue.trim().toLowerCase()
      : undefined;
  const amountTotal =
    typeof amountValue === 'number' &&
    Number.isSafeInteger(amountValue) &&
    amountValue >= 0
      ? amountValue
      : undefined;
  return { currency, amountTotal };
}

export function verifiedPurchaseMoney(
  data: {
    paid?: unknown;
    sessionId?: unknown;
    currency?: unknown;
    amountTotal?: unknown;
  } | null | undefined,
): { transactionId: string; currency: string; value: number } | null {
  if (data?.paid !== true || typeof data.sessionId !== 'string' || !data.sessionId.startsWith('cs_')) {
    return null;
  }
  const { currency, amountTotal } = normalizeVerifiedStripeMoney(data.currency, data.amountTotal);
  if (!currency || amountTotal === undefined) return null;
  return {
    transactionId: data.sessionId,
    currency,
    value: amountTotal / 10 ** currencyMinorUnit(currency),
  };
}
