import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  tierId: 'professional' as string,
  createEmbeddedSession: vi.fn(),
  insertOrder: vi.fn(),
}));

vi.mock('@/lib/request-origin', () => ({
  requestOrigin: () => 'https://pmstructure.com',
}));
vi.mock('@/lib/regional-catalogue', () => ({
  getOfferingById: vi.fn(() => ({
    offeringId: 'pmp-professional',
    courseName: 'PMP Preparation',
    tierId: mocks.tierId,
    regional: {
      global: { status: 'open' },
      gcc: { status: 'open' },
      india: { status: 'open' },
      pakistan: { status: 'open' },
    },
    prices: {
      global: { usdCents: 99900 },
    },
  })),
  resolveCheckoutUsdCents: vi.fn(() => 99900),
}));
vi.mock('@/lib/consultation-approval', () => ({
  isConsultationApproved: vi.fn(async () => true),
}));
vi.mock('@/lib/checkout-session', () => ({
  createStripeEmbeddedCheckoutSession: mocks.createEmbeddedSession,
  createStripePaymentSession: vi.fn(),
  expireStripeCheckoutSessionBestEffort: vi.fn(),
}));
vi.mock('@/lib/regional-checkout-price', async () => {
  const actual = await vi.importActual<typeof import('@/lib/regional-checkout-price')>(
    '@/lib/regional-checkout-price',
  );
  return {
    ...actual,
    resolveRegionalCheckoutPrice: vi.fn(() => ({
      currency: 'usd',
      unitAmount: 100000,
      display: '$1,000',
      majorAmount: 1000,
      currencyCode: 'USD',
      usdCents: 100000,
    })),
    resolveRegionalDepositPrice: vi.fn((full: { unitAmount: number }) => ({
      currency: 'usd',
      unitAmount: Math.round(full.unitAmount * 0.25),
      display: '$250',
      majorAmount: 250,
      currencyCode: 'USD',
      usdCents: 100000,
    })),
  };
});
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

import { POST as createSeatCheckout } from './seat-deposit/route';

function scholarshipRequest(overrides: Record<string, unknown> = {}) {
  return new Request('https://pmstructure.com/api/checkout/seat-deposit', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://pmstructure.com' },
    body: JSON.stringify({
      offeringId: 'pmp-professional',
      siteCertId: 'pmp',
      tierSlug: 'professional',
      regionId: 'global',
      paymentMode: 'self_paced',
      offerType: 'scholarship_invite',
      uiMode: 'embedded',
      ...overrides,
    }),
  });
}

describe('seat-deposit scholarship_invite branch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.tierId = 'professional';
    mocks.createEmbeddedSession.mockResolvedValue({
      sessionId: 'cs_test_scholarship',
      url: null,
      clientSecret: 'cs_test_scholarship_secret',
      unitAmount: 85000,
      currency: 'usd',
      usdCents: 100000,
      offeringId: 'pmp-professional',
    });
  });

  it('forces mentor book and charges 85% of Global mentor unit amount', async () => {
    const res = await createSeatCheckout(scholarshipRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.unitAmount).toBe(85000);
    expect(body.paymentMode).toBe('mentor_led');
    expect(body.offerType).toBe('scholarship_invite');
    expect(body.discountPct).toBe(15);
    expect(body.originalMentorUnitAmount).toBe(100000);

    const sessionArg = mocks.createEmbeddedSession.mock.calls[0][0];
    expect(sessionArg.unitAmount).toBe(85000);
    expect(sessionArg.metadata.offerType).toBe('scholarship_invite');
    expect(sessionArg.metadata.discountPct).toBe('15');
    expect(sessionArg.metadata.deliveryMode).toBe('mentor_led');
  });

  it('charges 35% off Global mentor amount for GCC Elite invites', async () => {
    const res = await createSeatCheckout(scholarshipRequest({ regionId: 'gcc' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.unitAmount).toBe(65000);
    expect(body.discountPct).toBe(35);
    expect(body.originalMentorUnitAmount).toBe(100000);
  });

  it('rejects India and Pakistan scholarship checkouts', async () => {
    const india = await createSeatCheckout(scholarshipRequest({ regionId: 'india' }));
    expect(india.status).toBe(400);
    expect((await india.json()).error).toMatch(/Global and GCC/i);

    const pakistan = await createSeatCheckout(scholarshipRequest({ regionId: 'pakistan' }));
    expect(pakistan.status).toBe(400);
  });

  it('rejects foundation scholarship checkouts', async () => {
    mocks.tierId = 'foundation';
    const res = await createSeatCheckout(
      scholarshipRequest({ tierSlug: 'foundation', offeringId: 'pmp-foundation' }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/Professional and Mastery/i);
  });

  it('rejects spoofed client unitAmount', async () => {
    const res = await createSeatCheckout(scholarshipRequest({ unitAmount: 1 }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/mismatch/i);
  });
});
