import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  constructEvent: vi.fn(),
  syncPaidOrder: vi.fn(),
  stripeConfigured: vi.fn(() => true),
}));

vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({
    webhooks: {
      constructEvent: mocks.constructEvent,
    },
  }),
  isStripeConfigured: mocks.stripeConfigured,
}));
vi.mock('@/lib/sync-paid-order', () => ({
  syncPaidOrderFromStripeSession: mocks.syncPaidOrder,
}));

import { POST } from './route';

function webhookRequest(signature = 'sig_test') {
  return new Request('https://pmstructure.com/api/stripe/webhook', {
    method: 'POST',
    headers: { 'stripe-signature': signature },
    body: '{"type":"checkout.session.completed"}',
  });
}

describe('Stripe webhook verification and fulfillment handoff', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.stripeConfigured.mockReturnValue(true);
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
  });

  it('rejects a missing signature before constructing an event', async () => {
    const response = await POST(
      new Request('https://pmstructure.com/api/stripe/webhook', {
        method: 'POST',
        body: '{}',
      }),
    );

    expect(response.status).toBe(400);
    expect(mocks.constructEvent).not.toHaveBeenCalled();
    expect(mocks.syncPaidOrder).not.toHaveBeenCalled();
  });

  it('rejects a signature that Stripe cannot verify', async () => {
    mocks.constructEvent.mockImplementationOnce(() => {
      throw new Error('bad signature');
    });

    const response = await POST(webhookRequest());

    expect(response.status).toBe(400);
    expect(mocks.syncPaidOrder).not.toHaveBeenCalled();
  });

  it('passes the stable Stripe event id as the fulfillment claim key for paid sessions', async () => {
    mocks.constructEvent.mockReturnValueOnce({
      id: 'evt_paid_1',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_paid_1',
          payment_status: 'paid',
          customer_details: { email: 'buyer@example.com' },
          customer_email: null,
        },
      },
    });
    mocks.syncPaidOrder.mockResolvedValueOnce(undefined);

    const response = await POST(webhookRequest());

    expect(response.status).toBe(200);
    expect(mocks.syncPaidOrder).toHaveBeenCalledOnce();
    expect(mocks.syncPaidOrder).toHaveBeenCalledWith({
      sessionId: 'cs_paid_1',
      paymentStatus: 'paid',
      customerEmail: 'buyer@example.com',
      verifiedVia: 'webhook',
      idempotencyKey: 'evt_paid_1',
    });
  });

  it('fulfills an asynchronously paid Checkout Session', async () => {
    mocks.constructEvent.mockReturnValueOnce({
      id: 'evt_async_paid_1',
      type: 'checkout.session.async_payment_succeeded',
      data: {
        object: {
          id: 'cs_async_paid_1',
          payment_status: 'paid',
          customer_details: { email: 'buyer@example.com' },
          customer_email: null,
        },
      },
    });

    const response = await POST(webhookRequest());

    expect(response.status).toBe(200);
    expect(mocks.syncPaidOrder).toHaveBeenCalledWith({
      sessionId: 'cs_async_paid_1',
      paymentStatus: 'paid',
      customerEmail: 'buyer@example.com',
      verifiedVia: 'webhook',
      idempotencyKey: 'evt_async_paid_1',
    });
  });

  it('acknowledges an unpaid completed session without fulfillment', async () => {
    mocks.constructEvent.mockReturnValueOnce({
      id: 'evt_unpaid_1',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_unpaid_1',
          payment_status: 'unpaid',
          customer_details: null,
          customer_email: null,
        },
      },
    });

    const response = await POST(webhookRequest());

    expect(response.status).toBe(200);
    expect(mocks.syncPaidOrder).not.toHaveBeenCalled();
  });
});
