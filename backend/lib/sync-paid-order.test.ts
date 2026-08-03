import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  recordPaidOrder: vi.fn(),
  sendConfirmation: vi.fn(),
}));

vi.mock('@/lib/supabase-admin', () => ({
  isSupabaseConfigured: true,
  supabaseAdmin: { from: mocks.from },
}));
vi.mock('@/lib/record-payment-interaction', () => ({
  recordPaidOrderToSheet: mocks.recordPaidOrder,
}));
vi.mock('@/lib/order-confirmation-email', () => ({
  sendOrderConfirmationEmail: mocks.sendConfirmation,
}));

import { syncPaidOrderFromStripeSession } from './sync-paid-order';

type DbResult = { data?: unknown; error: null | { message: string } };

function configureOrdersTable(
  rows: Array<Record<string, unknown>>,
  claimResults: DbResult[],
) {
  const updates: Array<Record<string, unknown>> = [];
  let rowIndex = 0;

  function updateChain(payload: Record<string, unknown>) {
    updates.push(payload);
    const chain = {
      eq: vi.fn(),
      select: vi.fn(),
      then: <TResult1 = DbResult, TResult2 = never>(
        onFulfilled?: ((value: DbResult) => TResult1 | PromiseLike<TResult1>) | null,
        onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
      ) =>
        Promise.resolve<DbResult>({ error: null }).then(
          onFulfilled ?? undefined,
          onRejected ?? undefined,
        ),
    };
    chain.eq.mockImplementation(() => chain);
    chain.select.mockImplementation(() => ({
      maybeSingle: vi.fn(async () => claimResults.shift() ?? { data: null, error: null }),
    }));
    return chain;
  }

  mocks.from.mockImplementation(() => {
    const selectChain: {
      eq: ReturnType<typeof vi.fn>;
      maybeSingle: ReturnType<typeof vi.fn>;
    } = {
      eq: vi.fn(),
      maybeSingle: vi.fn(async () => ({
        data: rows[Math.min(rowIndex++, rows.length - 1)] ?? null,
        error: null,
      })),
    };
    selectChain.eq.mockImplementation(() => selectChain);
    return {
      select: vi.fn(() => selectChain),
      update: vi.fn(updateChain),
    };
  });

  return updates;
}

function pendingOrder(overrides: Record<string, unknown> = {}) {
  return {
    id: 'order-1',
    offering_id: 'membership_professional',
    email: 'pending@checkout.local',
    metadata: {
      paymentType: 'membership',
      checkoutDisplay: '$19.00',
    },
    status: 'pending',
    updated_at: '2026-07-26T12:00:00.000Z',
    ...overrides,
  };
}

const paidParams = {
  sessionId: 'cs_paid_1',
  paymentStatus: 'paid',
  customerEmail: 'buyer@example.com',
  verifiedVia: 'webhook' as const,
  idempotencyKey: 'evt_paid_1',
};

describe('paid-order fulfillment claim', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.recordPaidOrder.mockResolvedValue(true);
    mocks.sendConfirmation.mockResolvedValue(true);
  });

  it('atomically claims the row before invoking external effects and records completion', async () => {
    const updates = configureOrdersTable(
      [pendingOrder()],
      [{ data: { id: 'order-1' }, error: null }],
    );

    const identity = await syncPaidOrderFromStripeSession(paidParams);

    expect(mocks.recordPaidOrder).toHaveBeenCalledOnce();
    expect(mocks.sendConfirmation).toHaveBeenCalledOnce();
    expect(updates[0]).toMatchObject({
      status: 'paid',
      email: 'buyer@example.com',
      metadata: {
        purchaseAnalyticsEventId: 'pms_purchase_order-1',
        stripeFulfillmentClaimKey: 'evt_paid_1',
        stripeFulfillmentState: 'processing',
      },
    });
    expect(updates.at(-1)).toMatchObject({
      metadata: {
        stripeFulfillmentClaimKey: 'evt_paid_1',
        stripeFulfillmentState: 'completed',
      },
    });
    expect(
      (updates.at(-1)?.metadata as Record<string, unknown>).stripeFulfillmentCompletedAt,
    ).toEqual(expect.any(String));
    expect(identity).toEqual({
      durableTransactionId: 'order-1',
      durablePurchaseEventId: 'pms_purchase_order-1',
    });
  });

  it('allows only the winner of a concurrent optimistic claim to invoke external effects', async () => {
    configureOrdersTable(
      [pendingOrder(), pendingOrder()],
      [
        { data: { id: 'order-1' }, error: null },
        { data: null, error: null },
      ],
    );

    await Promise.all([
      syncPaidOrderFromStripeSession(paidParams),
      syncPaidOrderFromStripeSession({ ...paidParams, idempotencyKey: 'session_poll:cs_paid_1' }),
    ]);

    expect(mocks.recordPaidOrder).toHaveBeenCalledOnce();
    expect(mocks.sendConfirmation).toHaveBeenCalledOnce();
  });

  it('does not retry a claimed or completed fulfillment automatically', async () => {
    configureOrdersTable(
      [
        pendingOrder({
          status: 'paid',
          metadata: {
            purchaseAnalyticsEventId: 'paid_stored_order_1',
            stripeFulfillmentClaimedAt: '2026-07-26T12:01:00.000Z',
            stripeFulfillmentClaimKey: 'evt_prior',
          },
        }),
      ],
      [],
    );

    const identity = await syncPaidOrderFromStripeSession(paidParams);

    expect(mocks.recordPaidOrder).not.toHaveBeenCalled();
    expect(mocks.sendConfirmation).not.toHaveBeenCalled();
    expect(identity).toEqual({
      durableTransactionId: 'order-1',
      durablePurchaseEventId: 'paid_stored_order_1',
    });
  });

  it('marks payment paid but defers fulfillment when no usable recipient exists', async () => {
    const updates = configureOrdersTable(
      [pendingOrder()],
      [],
    );

    await syncPaidOrderFromStripeSession({
      ...paidParams,
      customerEmail: null,
    });

    expect(mocks.recordPaidOrder).not.toHaveBeenCalled();
    expect(mocks.sendConfirmation).not.toHaveBeenCalled();
    expect(updates).toHaveLength(1);
    expect(updates[0]).toMatchObject({
      status: 'paid',
      metadata: {
        stripePaymentStatus: 'paid',
      },
    });
    expect(updates[0].metadata).not.toHaveProperty('stripeFulfillmentClaimedAt');
  });

  it('persists a reconciliation state if confirmation delivery throws', async () => {
    const updates = configureOrdersTable(
      [pendingOrder()],
      [{ data: { id: 'order-1' }, error: null }],
    );
    mocks.sendConfirmation.mockRejectedValueOnce(new Error('smtp unavailable'));

    await expect(syncPaidOrderFromStripeSession(paidParams)).rejects.toThrow('smtp unavailable');

    expect(updates.at(-1)).toMatchObject({
      metadata: {
        stripeFulfillmentState: 'needs_reconciliation',
        stripeFulfillmentFailure: 'confirmation_email_failed',
      },
    });
  });
});
