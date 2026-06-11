import type { EnrollmentPaymentMode } from '@/lib/enrollment/seat-reservation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

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

export async function fetchStripePublishableKey(): Promise<string> {
  const fromEnv = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? '';
  if (fromEnv.startsWith('pk_')) return fromEnv;

  const urls =
    typeof window !== 'undefined'
      ? ['/api/config/public', '/config/stripe']
      : [`${API_BASE}/api/config/public`];

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
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

export async function createEnrollmentEmbeddedCheckout(payload: EnrollmentCheckoutPayload) {
  const res = await fetch(`${API_BASE}/api/checkout/seat-deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, uiMode: 'embedded' }),
  });
  return parseApi<EnrollmentCheckoutResponse>(res);
}

/** @deprecated Use createEnrollmentEmbeddedCheckout */
export async function createSeatDepositEmbeddedCheckout(payload: EnrollmentCheckoutPayload) {
  return createEnrollmentEmbeddedCheckout({ ...payload, paymentMode: payload.paymentMode ?? 'seat_deposit' });
}

export async function createSeatDepositCheckout(
  payload: EnrollmentCheckoutPayload & { email: string; name?: string },
) {
  const res = await fetch(`${API_BASE}/api/checkout/seat-deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, uiMode: 'redirect', paymentMode: 'seat_deposit' }),
  });
  return parseApi<EnrollmentCheckoutResponse>(res);
}

export async function verifyCheckoutSession(sessionId: string) {
  const res = await fetch(`${API_BASE}/api/checkout/session/${encodeURIComponent(sessionId)}`);
  return parseApi<{
    sessionId: string;
    status: string;
    paid: boolean;
    offeringId?: string | null;
    paymentType?: string | null;
  }>(res);
}
