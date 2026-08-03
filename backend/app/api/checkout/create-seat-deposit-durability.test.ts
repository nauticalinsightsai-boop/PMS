import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createEmbeddedSession: vi.fn(),
  createPaymentSession: vi.fn(),
  expireSession: vi.fn(),
  insertOrder: vi.fn(),
  consultationApproved: vi.fn(),
}));

vi.mock('@/lib/request-origin', () => ({
  requestOrigin: () => 'https://pmstructure.com',
}));
vi.mock('@/lib/regional-catalogue', () => ({
  getOfferingById: vi.fn(() => ({
    offeringId: 'pmp-preparation-mastery',
    courseName: 'PMP Preparation',
    tierId: 'mastery',
    regional: {
      global: { status: 'open' },
    },
    prices: {
      global: { usdCents: 149900 },
    },
  })),
  resolveCheckoutUsdCents: vi.fn(() => 149900),
}));
vi.mock('@/lib/consultation-approval', () => ({
  isConsultationApproved: mocks.consultationApproved,
}));
vi.mock('@/lib/checkout-session', () => ({
  createStripeEmbeddedCheckoutSession: mocks.createEmbeddedSession,
  createStripePaymentSession: mocks.createPaymentSession,
  expireStripeCheckoutSessionBestEffort: mocks.expireSession,
}));
vi.mock('@/lib/membership-pricing', () => ({
  membershipPriceUsdCents: vi.fn((value: number) => value),
}));
vi.mock('@/lib/regional-checkout-price', () => ({
  formatRegionalDepositDisplay: vi.fn(() => '$374.75'),
  resolveRegionalCheckoutPrice: vi.fn(() => ({
    currency: 'usd',
    unitAmount: 149900,
    display: '$1,499',
    usdCents: 149900,
  })),
  resolveRegionalDepositPrice: vi.fn(() => ({
    currency: 'usd',
    unitAmount: 37475,
    display: '$374.75',
    usdCents: 149900,
  })),
}));
vi.mock('@/lib/safe-redirect-url', () => ({
  safeRedirectUrl: (_origin: string, _candidate: string | undefined, fallback: string) => fallback,
}));
vi.mock('@/lib/stripe', () => ({
  getStripeSecretKeyIssue: () => null,
  isStripeConfigured: () => true,
  isStripeTestMode: () => false,
}));
vi.mock('@/lib/supabase-admin', () => ({
  isSupabaseConfigured: true,
  supabaseAdmin: {
    from: vi.fn(() => ({ insert: mocks.insertOrder })),
  },
}));

import { POST as createCheckout } from './create/route';
import { POST as createSeatCheckout } from './seat-deposit/route';

function createRequest() {
  return new Request('https://pmstructure.com/api/checkout/create', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://pmstructure.com' },
    body: JSON.stringify({
      offeringId: 'pmp-preparation-mastery',
      regionId: 'global',
      email: 'buyer@example.com',
    }),
  });
}

function seatRequest() {
  return new Request('https://pmstructure.com/api/checkout/seat-deposit', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://pmstructure.com' },
    body: JSON.stringify({
      offeringId: 'pmp-preparation-mastery',
      siteCertId: 'pmp',
      tierSlug: 'mastery',
      regionId: 'global',
      email: 'buyer@example.com',
      paymentMode: 'seat_deposit',
      uiMode: 'redirect',
    }),
  });
}

describe('create and seat-deposit order-insert durability boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.consultationApproved.mockResolvedValue(true);
    mocks.createPaymentSession.mockResolvedValue({
      sessionId: 'cs_orphan_create',
      url: 'https://checkout.stripe.test/cs_orphan_create',
      clientSecret: null,
      unitAmount: 149900,
      currency: 'usd',
      usdCents: 149900,
      offeringId: 'pmp-preparation-mastery',
    });
    mocks.createEmbeddedSession.mockResolvedValue({
      sessionId: 'cs_orphan_seat',
      url: null,
      clientSecret: 'cs_orphan_seat_secret',
      unitAmount: 37475,
      currency: 'usd',
      usdCents: 149900,
      offeringId: 'pmp-preparation-mastery',
    });
  });

  it('create expires the orphan Stripe session before returning 503 with no success payload', async () => {
    mocks.insertOrder.mockResolvedValueOnce({ error: { message: 'insert failed' } });

    const response = await createCheckout(createRequest());
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json).toEqual({ error: 'Could not create order record' });
    expect(json).not.toHaveProperty('session');
    expect(json).not.toHaveProperty('url');
    expect(mocks.expireSession).toHaveBeenCalledOnce();
    expect(mocks.expireSession).toHaveBeenCalledWith('cs_orphan_create');
  });

  it('seat-deposit expires the orphan Stripe session before returning 503 with no success payload', async () => {
    mocks.insertOrder.mockResolvedValueOnce({ error: { message: 'insert failed' } });

    const response = await createSeatCheckout(seatRequest());
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json).toEqual({ error: 'Could not create order record' });
    expect(json).not.toHaveProperty('session');
    expect(json).not.toHaveProperty('clientSecret');
    expect(mocks.expireSession).toHaveBeenCalledOnce();
    expect(mocks.expireSession).toHaveBeenCalledWith('cs_orphan_create');
  });

  it('create returns durable success only after order insert succeeds', async () => {
    mocks.insertOrder.mockResolvedValueOnce({ error: null });

    const response = await createCheckout(createRequest());
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.session?.sessionId).toBe('cs_orphan_create');
    expect(mocks.expireSession).not.toHaveBeenCalled();
  });
});
