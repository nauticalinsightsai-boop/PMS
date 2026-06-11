const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function parseApi<T>(res: Response): Promise<{ data?: T; error?: string }> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) return { error: (body as { error?: string }).error ?? res.statusText };
  return { data: body as T };
}

type SeatDepositPayload = {
  offeringId: string;
  siteCertId: string;
  tierSlug: string;
  regionId: string;
  email?: string;
  name?: string;
};

type SeatDepositResponse = {
  session: {
    url: string | null;
    sessionId: string;
    clientSecret: string | null;
  };
  usdCents: number;
  depositUsd: number;
};

export async function fetchStripePublishableKey(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/config/public`, { cache: 'no-store' });
  const body = await res.json().catch(() => ({}));
  return (body as { stripePublishableKey?: string }).stripePublishableKey?.trim() ?? '';
}

export async function createSeatDepositEmbeddedCheckout(payload: SeatDepositPayload) {
  const res = await fetch(`${API_BASE}/api/checkout/seat-deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, uiMode: 'embedded' }),
  });
  return parseApi<SeatDepositResponse>(res);
}

export async function createSeatDepositCheckout(payload: SeatDepositPayload & { email: string; name?: string }) {
  const res = await fetch(`${API_BASE}/api/checkout/seat-deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, uiMode: 'redirect' }),
  });
  return parseApi<SeatDepositResponse>(res);
}

export async function verifyCheckoutSession(sessionId: string) {
  const res = await fetch(`${API_BASE}/api/checkout/session/${encodeURIComponent(sessionId)}`);
  return parseApi<{
    sessionId: string;
    status: string;
    paid: boolean;
    offeringId?: string | null;
  }>(res);
}
