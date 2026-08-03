import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  expire: vi.fn(),
  stripeConfigured: vi.fn(() => true),
}));

vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({
    checkout: {
      sessions: {
        expire: mocks.expire,
      },
    },
  }),
  isStripeConfigured: mocks.stripeConfigured,
}));

import { expireStripeCheckoutSessionBestEffort } from './checkout-session';

describe('orphan checkout session containment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.stripeConfigured.mockReturnValue(true);
  });

  it('expires a Stripe Checkout Session when durable order creation fails', async () => {
    mocks.expire.mockResolvedValueOnce({ id: 'cs_orphan_1', status: 'expired' });

    await expireStripeCheckoutSessionBestEffort('cs_orphan_1');

    expect(mocks.expire).toHaveBeenCalledOnce();
    expect(mocks.expire).toHaveBeenCalledWith('cs_orphan_1');
  });

  it('contains provider expiration failure without exposing a route success path', async () => {
    mocks.expire.mockRejectedValueOnce(new Error('Stripe unavailable'));

    await expect(expireStripeCheckoutSessionBestEffort('cs_orphan_1')).resolves.toBeUndefined();
  });
});
