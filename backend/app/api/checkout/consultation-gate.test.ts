import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  status: 'consultation_required',
  consultationApproved: vi.fn(),
  createEmbeddedSession: vi.fn(),
  createPaymentSession: vi.fn(),
  insertOrder: vi.fn(),
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
      global: { status: mocks.status },
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
  isSupabaseConfigured: false,
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
      email: 'approved@example.com',
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
      email: 'approved@example.com',
      paymentMode: 'full_tuition',
    }),
  });
}

describe('consultation-required Stripe gate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.status = 'consultation_required';
    mocks.consultationApproved.mockResolvedValue(false);
    mocks.createPaymentSession.mockResolvedValue({
      sessionId: 'cs_test_mastery',
      url: 'https://checkout.stripe.test/cs_test_mastery',
      clientSecret: null,
      unitAmount: 149900,
      currency: 'usd',
      usdCents: 149900,
      offeringId: 'pmp-preparation-mastery',
    });
    mocks.createEmbeddedSession.mockResolvedValue({
      sessionId: 'cs_test_mastery',
      url: null,
      clientSecret: 'cs_test_mastery_secret',
      unitAmount: 149900,
      currency: 'usd',
      usdCents: 149900,
      offeringId: 'pmp-preparation-mastery',
    });
  });

  it.each([
    ['legacy checkout', createCheckout, createRequest],
    ['pathway checkout', createSeatCheckout, seatRequest],
  ])('%s rejects an unapproved consultation before creating a Stripe session', async (
    _name,
    handler,
    requestFactory,
  ) => {
    const response = await handler(requestFactory());
    const json = await response.json();

    expect(response.status).toBe(403);
    expect(json.error).toBe(
      'Consultation approval is required before checkout for this pathway.',
    );
    expect(mocks.consultationApproved).toHaveBeenCalledWith(
      'approved@example.com',
      'pmp-preparation-mastery',
    );
    expect(mocks.createPaymentSession).not.toHaveBeenCalled();
    expect(mocks.createEmbeddedSession).not.toHaveBeenCalled();
  });

  it.each([
    ['legacy checkout', createCheckout, createRequest],
    ['pathway checkout', createSeatCheckout, seatRequest],
  ])('%s permits an approved consultation to reach Stripe session creation', async (
    _name,
    handler,
    requestFactory,
  ) => {
    mocks.consultationApproved.mockResolvedValue(true);

    const response = await handler(requestFactory());

    expect(response.status).toBe(200);
    expect(
      mocks.createPaymentSession.mock.calls.length +
        mocks.createEmbeddedSession.mock.calls.length,
    ).toBe(1);
  });

  it('does not require consultation approval for direct checkout', async () => {
    mocks.status = 'direct_checkout';

    const response = await createCheckout(createRequest());

    expect(response.status).toBe(200);
    expect(mocks.consultationApproved).not.toHaveBeenCalled();
    expect(mocks.createPaymentSession).toHaveBeenCalledOnce();
  });
});
