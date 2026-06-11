import Stripe from 'stripe';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { jsonError, jsonOk } from '@/lib/response-helpers.js';

export const runtime = 'nodejs';

async function markOrderPaid(session: Stripe.Checkout.Session): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { data: row, error: fetchError } = await supabaseAdmin
    .from('orders')
    .select('id, metadata')
    .eq('stripe_session_id', session.id)
    .eq('status', 'pending')
    .maybeSingle();

  if (fetchError) {
    console.error('[stripe/webhook] order lookup failed:', fetchError.message);
    throw fetchError;
  }
  if (!row) return;

  const priorMetadata =
    row.metadata && typeof row.metadata === 'object' && !Array.isArray(row.metadata)
      ? (row.metadata as Record<string, unknown>)
      : {};

  const customerEmail = session.customer_details?.email ?? session.customer_email ?? null;

  const { error } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'paid',
      updated_at: new Date().toISOString(),
      ...(customerEmail ? { email: customerEmail } : {}),
      metadata: {
        ...priorMetadata,
        stripePaymentStatus: session.payment_status,
        stripeCustomerEmail: customerEmail,
      },
    })
    .eq('id', row.id);

  if (error) {
    console.error('[stripe/webhook] order update failed:', error.message);
    throw error;
  }
}

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
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === 'paid' || session.payment_status === 'no_payment_required') {
        await markOrderPaid(session);
      }
    }
  } catch (err) {
    console.error('[stripe/webhook] handler error:', err);
    return jsonError('Webhook handler failed', 500);
  }

  return jsonOk({ received: true });
}
