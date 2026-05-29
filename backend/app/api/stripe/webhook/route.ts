import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { jsonError, jsonOk } from '@/lib/response-helpers.js';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const rawBody = await request.text();

  let event: Stripe.Event;
  if (webhookSecret && stripeSecret) {
    const stripe = new Stripe(stripeSecret);
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return jsonError('Missing stripe-signature header', 400);
    }
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid signature';
      return jsonError(message, 400);
    }
  } else if (process.env.NODE_ENV === 'production') {
    return jsonError('Stripe webhook not configured', 503);
  } else {
    // Local dev without secrets: accept JSON body (mock checkout tests only).
    try {
      event = JSON.parse(rawBody) as Stripe.Event;
    } catch {
      return jsonError('Invalid JSON body', 400);
    }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.id;
    if (isSupabaseConfigured && sessionId) {
      await supabaseAdmin
        .from('orders')
        .update({ status: 'paid', updated_at: new Date().toISOString() })
        .eq('stripe_session_id', sessionId);
    }
  }

  return jsonOk({ received: true });
}
