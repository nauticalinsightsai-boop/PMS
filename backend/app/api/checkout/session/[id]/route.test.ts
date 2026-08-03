import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  retrieve: vi.fn(),
  syncPaidOrder: vi.fn(),
  stripeConfigured: vi.fn(() => true),
}));

vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({
    checkout: {
      sessions: {
        retrieve: mocks.retrieve,
      },
    },
  }),
  isStripeConfigured: mocks.stripeConfigured,
}));
vi.mock('@/lib/sync-paid-order', () => ({
  syncPaidOrderFromStripeSession: mocks.syncPaidOrder,
}));

import { GET } from './route';

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('checkout session verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.stripeConfigured.mockReturnValue(true);
  });

  it('rejects an invalid session id before contacting Stripe', async () => {
    const response = await GET(
      new Request('https://pmstructure.com/api/checkout/session/not-stripe'),
      params('not-stripe'),
    );

    expect(response.status).toBe(400);
    expect(mocks.retrieve).not.toHaveBeenCalled();
  });

  it('hands a server-verified paid session to fulfillment with a stable poll claim key', async () => {
    mocks.retrieve.mockResolvedValueOnce({
      id: 'cs_paid_1',
      payment_status: 'paid',
      customer_details: { email: 'buyer@example.com' },
      customer_email: null,
      amount_total: 1900,
      currency: 'usd',
      metadata: {
        offeringId: 'membership_professional',
        paymentType: 'membership',
      },
    });
    mocks.syncPaidOrder.mockResolvedValueOnce({
      durableTransactionId: 'order-internal-1',
      durablePurchaseEventId: 'pms_purchase_order-internal-1',
    });

    const response = await GET(
      new Request('https://pmstructure.com/api/checkout/session/cs_paid_1'),
      params('cs_paid_1'),
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toMatchObject({
      sessionId: 'cs_paid_1',
      status: 'paid',
      paid: true,
      offeringId: 'membership_professional',
      paymentType: 'membership',
      currency: 'USD',
      value: 19,
      durableTransactionId: 'order-internal-1',
      durablePurchaseEventId: 'pms_purchase_order-internal-1',
    });
    expect(mocks.syncPaidOrder).toHaveBeenCalledWith({
      sessionId: 'cs_paid_1',
      paymentStatus: 'paid',
      customerEmail: 'buyer@example.com',
      verifiedVia: 'session_poll',
      idempotencyKey: 'session_poll:cs_paid_1',
    });
  });

  it('does not fulfill a server-verified unpaid session', async () => {
    mocks.retrieve.mockResolvedValueOnce({
      id: 'cs_unpaid_1',
      payment_status: 'unpaid',
      customer_details: null,
      customer_email: null,
      metadata: {},
    });

    const response = await GET(
      new Request('https://pmstructure.com/api/checkout/session/cs_unpaid_1'),
      params('cs_unpaid_1'),
    );

    expect(response.status).toBe(200);
    expect(mocks.syncPaidOrder).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toMatchObject({
      paid: false,
      durableTransactionId: null,
      durablePurchaseEventId: null,
    });
  });
});
