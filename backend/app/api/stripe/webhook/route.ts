import Stripe from 'stripe';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { syncPaidOrderFromStripeSession } from '@/lib/sync-paid-order';
import { jsonError, jsonOk } from '@/lib/response-helpers.js';
import {
  ScholarshipWebhookMismatchError,
  validateScholarshipPaidSession,
} from '@/lib/scholarship-webhook';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return jsonError('Payment webhooks are not enabled on this site.', 410);
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    return jsonError('STRIPE_WEBHOOK_SECRET is not configured', 503);
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return jsonError('Missing stripe-signature header', 400);
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    console.error('[stripe/webhook] signature verification failed:', message);
    return jsonError(`Webhook signature verification failed: ${message}`, 400);
  }

  try {
    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      const eventSession = event.data.object as Stripe.Checkout.Session;
      const session = eventSession.metadata?.scholarshipReservationId
        ? await getStripe().checkout.sessions.retrieve(eventSession.id, {
            expand: ['discounts.coupon'],
          })
        : eventSession;
      if (session.payment_status === 'paid' || session.payment_status === 'no_payment_required') {
        await validateScholarshipPaidSession({
          session,
          completedAtMs: event.created * 1000,
        });
        await syncPaidOrderFromStripeSession({
          sessionId: session.id,
          paymentStatus: session.payment_status,
          customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
          verifiedVia: 'webhook',
          idempotencyKey: event.id,
        });
      }
    }
  } catch (err) {
    console.error('[stripe/webhook] handler error:', err);
    if (err instanceof ScholarshipWebhookMismatchError) {
      return jsonError(err.message, 400);
    }
    return jsonError('Webhook handler failed', 500);
  }

  return jsonOk({ received: true });
}
