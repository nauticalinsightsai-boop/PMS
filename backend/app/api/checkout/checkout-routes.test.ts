import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createSession: vi.fn(),
  expireSession: vi.fn(),
  insertOrder: vi.fn(),
  resolveMembershipPrice: vi.fn(),
  resolveStorePrice: vi.fn(),
}));

vi.mock('@/lib/request-origin', () => ({
  requestOrigin: () => 'https://pmstructure.com',
}));
vi.mock('@/lib/checkout-session', () => ({
  createStripeEmbeddedCheckoutSession: mocks.createSession,
  expireStripeCheckoutSessionBestEffort: mocks.expireSession,
}));
vi.mock('@/lib/membership-cms-pricing', () => ({
  getCmsMembershipUsd: vi.fn(async () => null),
}));
vi.mock('@/lib/membership-checkout-price', () => ({
  resolveMembershipCheckoutPrice: mocks.resolveMembershipPrice,
}));
vi.mock('@/lib/store-checkout', () => ({
  resolveStoreCheckoutPrice: mocks.resolveStorePrice,
}));
vi.mock('@/lib/supabase-admin', () => ({
  isSupabaseConfigured: true,
  supabaseAdmin: {
    from: vi.fn(() => ({ insert: mocks.insertOrder })),
  },
}));
vi.mock('@/lib/safe-redirect-url', () => ({
  safeRedirectUrl: (_origin: string, _candidate: string | undefined, fallback: string) => fallback,
}));
vi.mock('@/lib/stripe', () => ({
  isStripeConfigured: () => true,
}));

import { POST as membershipPost } from './membership/route';
import { POST as storePost } from './store/route';

function membershipRequest() {
  return new Request('https://pmstructure.com/api/checkout/membership', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://pmstructure.com' },
    body: JSON.stringify({
      tier: 'professional',
      billing: 'monthly',
      regionId: 'global',
    }),
  });
}

function storeRequest() {
  return new Request('https://pmstructure.com/api/checkout/store', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://pmstructure.com' },
    body: JSON.stringify({
      productId: 'pmp-guide',
      regionId: 'global',
    }),
  });
}

describe('membership and store checkout durability boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createSession.mockResolvedValue({
      sessionId: 'cs_test_recovery',
      clientSecret: 'secret_test_recovery',
      url: null,
      unitAmount: 1900,
      currency: 'usd',
      usdCents: 1900,
      offeringId: 'test',
    });
    mocks.resolveMembershipPrice.mockReturnValue({
      currency: 'usd',
      unitAmount: 1900,
      display: '$19.00',
      usdReference: 1900,
    });
    mocks.resolveStorePrice.mockReturnValue({
      currency: 'usd',
      unitAmount: 2900,
      display: '$29.00',
      product: {
        id: 'pmp-guide',
        title: 'PMP Guide',
        description: 'A study guide',
        price: 29,
      },
    });
  });

  it.each([
    ['membership', membershipPost, membershipRequest],
    ['store', storePost, storeRequest],
  ])(
    '%s returns 503, expires the orphan session, and exposes no success payload when order insert fails',
    async (_name, handler, requestFactory) => {
      mocks.insertOrder.mockResolvedValueOnce({ error: { message: 'insert failed' } });

      const response = await handler(requestFactory());
      const json = await response.json();

      expect(response.status).toBe(503);
      expect(json).toEqual({
        error: expect.stringContaining('Could not record checkout'),
      });
      expect(json).not.toHaveProperty('session');
      expect(json).not.toHaveProperty('clientSecret');
      expect(mocks.expireSession).toHaveBeenCalledOnce();
      expect(mocks.expireSession).toHaveBeenCalledWith('cs_test_recovery');
    },
  );

  it.each([
    ['membership', membershipPost, membershipRequest],
    ['store', storePost, storeRequest],
  ])('%s returns its durable session only after order insert succeeds', async (_name, handler, requestFactory) => {
    mocks.insertOrder.mockResolvedValueOnce({ error: null });

    const response = await handler(requestFactory());
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.session).toEqual({
      sessionId: 'cs_test_recovery',
      clientSecret: 'secret_test_recovery',
    });
    expect(mocks.expireSession).not.toHaveBeenCalled();
  });
});
