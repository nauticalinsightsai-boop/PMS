import { apiUrl } from '@/lib/api-url';
import { trackBeginCheckout } from '@/lib/analytics/track-begin-checkout';

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
  const result = await parseApi<EmbeddedCheckoutResponse>(res);
  const sessionId = result.data?.session.sessionId;
  if (sessionId) {
    trackBeginCheckout(
      {
        package_type: 'membership',
        items: [{
          item_id: `membership_${payload.tier}_${payload.billing}`,
          item_name: `${payload.tier} membership`,
          item_category: 'membership',
          quantity: 1,
        }],
      },
      sessionId,
    );
  }
  return result;
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
  const result = await parseApi<EmbeddedCheckoutResponse>(res);
  const sessionId = result.data?.session.sessionId;
  if (sessionId) {
    trackBeginCheckout(
      {
        package_type: 'store_resource',
        items: [{
          item_id: payload.productId,
          item_name: result.data?.productTitle ?? payload.productId,
          item_category: 'store',
          quantity: 1,
        }],
      },
      sessionId,
    );
  }
  return result;
}

export {
  fetchStripePublishableKey,
  verifiedPurchaseMoney,
  verifyCheckoutSession,
} from '@/services/enrollment';
