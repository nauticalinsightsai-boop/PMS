import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { syncPaidOrderFromStripeSession } from '@/lib/sync-paid-order';
import { jsonError, jsonOk } from '@/lib/response-helpers.js';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id?.startsWith('cs_')) {
    return jsonError('Invalid checkout session id', 400);
  }

  if (!isStripeConfigured()) {
    return jsonOk({
      sessionId: id,
      status: 'unconfigured',
      paid: false,
      message: 'Stripe is not configured on this server.',
    });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(id);
    const customerEmail = session.customer_details?.email ?? session.customer_email ?? null;
    const paid = session.payment_status === 'paid';
    const paidOrderIdentity = paid
      ? await syncPaidOrderFromStripeSession({
          sessionId: id,
          paymentStatus: session.payment_status,
          customerEmail,
          verifiedVia: 'session_poll',
          idempotencyKey: `session_poll:${id}`,
        })
      : null;

    const value =
      typeof session.amount_total === 'number'
        ? session.amount_total / 100
        : null;

    return jsonOk({
      sessionId: id,
      status: session.payment_status,
      paid,
      offeringId: session.metadata?.offeringId ?? null,
      paymentType: session.metadata?.paymentType ?? null,
      currency: session.currency?.toUpperCase() ?? null,
      value,
      durableTransactionId: paidOrderIdentity?.durableTransactionId ?? null,
      durablePurchaseEventId: paidOrderIdentity?.durablePurchaseEventId ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not verify checkout session';
    return jsonError(message, 502);
  }
}
