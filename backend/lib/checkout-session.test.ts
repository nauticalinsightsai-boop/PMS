import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  expire: vi.fn(),
  stripeConfigured: vi.fn(() => true),
}));

vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({
    checkout: {
      sessions: {
        create: mocks.create,
        expire: mocks.expire,
      },
    },
  }),
  isStripeConfigured: mocks.stripeConfigured,
}));

import {
  createScholarshipStripeEmbeddedCheckoutSession,
  expireStripeCheckoutSessionBestEffort,
} from './checkout-session';

describe('orphan checkout session containment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.stripeConfigured.mockReturnValue(true);
  });

  it('binds SCH15 server-side, exposes no promotion field, and uses Stripe idempotency', async () => {
    mocks.create.mockResolvedValueOnce({ id: 'cs_live_scholarship', client_secret: 'cs_secret_live' });
    const result = await createScholarshipStripeEmbeddedCheckoutSession({
      offeringId: 'pmp-preparation-professional',
      currency: 'usd',
      unitAmount: 89_900,
      referenceUsdCents: 89_900,
      returnUrl: 'https://pmstructure.com/certifications/pmp/professional/enroll/success',
      expiresAt: 4_102_446_600,
      idempotencyKey: 'scholarship:reservation-id',
      productName: 'PMP Professional Mentor-led scholarship',
      metadata: { scholarshipFinalUnitAmount: '76415' },
    });

    expect(mocks.create).toHaveBeenCalledOnce();
    expect(mocks.create).toHaveBeenCalledWith(
      expect.objectContaining({
        allow_promotion_codes: false,
        discounts: [{ coupon: 'SCH15' }],
        expires_at: 4_102_446_600,
        line_items: [expect.objectContaining({ quantity: 1 })],
      }),
      { idempotencyKey: 'scholarship:reservation-id' },
    );
    expect(result).toMatchObject({ sessionId: 'cs_live_scholarship', unitAmount: 89_900 });
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
