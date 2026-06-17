import { apiUrl } from '@/lib/api-url';

async function parseApi<T>(res: Response): Promise<{ data?: T; error?: string }> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) return { error: (body as { error?: string }).error ?? res.statusText };
  return { data: body as T };
}

type EmbeddedCheckoutResponse = {
  session: {
    sessionId: string;
    clientSecret: string | null;
  };
  displayAmount?: string;
  productTitle?: string;
};

export async function createMembershipEmbeddedCheckout(payload: {
  tier: 'professional' | 'mastery';
  billing: 'monthly' | 'yearly';
  regionId: string;
  gccCountry?: string | null;
  colorScheme?: 'light' | 'dark';
}) {
  const res = await fetch(apiUrl('/api/checkout/membership'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseApi<EmbeddedCheckoutResponse>(res);
}

export async function createStoreEmbeddedCheckout(payload: {
  productId: string;
  regionId: string;
  gccCountry?: string | null;
  colorScheme?: 'light' | 'dark';
}) {
  const res = await fetch(apiUrl('/api/checkout/store'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseApi<EmbeddedCheckoutResponse>(res);
}

export { fetchStripePublishableKey, verifyCheckoutSession } from '@/services/enrollment';
