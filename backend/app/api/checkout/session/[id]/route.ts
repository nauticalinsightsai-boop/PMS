import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { jsonError, jsonOk } from '@/lib/response-helpers.js';

async function syncPaidOrderFromSession(sessionId: string, paymentStatus: string, customerEmail: string | null) {
  if (!isSupabaseConfigured || paymentStatus !== 'paid') return;

  const { data: row } = await supabaseAdmin
    .from('orders')
    .select('id, metadata')
    .eq('stripe_session_id', sessionId)
    .maybeSingle();

  if (!row) return;

  const priorMetadata =
    row.metadata && typeof row.metadata === 'object' && !Array.isArray(row.metadata)
      ? (row.metadata as Record<string, unknown>)
      : {};

  await supabaseAdmin
    .from('orders')
    .update({
      status: 'paid',
      updated_at: new Date().toISOString(),
      ...(customerEmail ? { email: customerEmail } : {}),
      metadata: {
        ...priorMetadata,
        stripePaymentStatus: paymentStatus,
        stripeCustomerEmail: customerEmail,
        verifiedVia: 'session_poll',
      },
    })
    .eq('id', row.id);
}

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

    if (paid) {
      await syncPaidOrderFromSession(id, session.payment_status, customerEmail);
    }

    return jsonOk({
      sessionId: id,
      status: session.payment_status,
      paid,
      offeringId: session.metadata?.offeringId ?? null,
      paymentType: session.metadata?.paymentType ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not verify checkout session';
    return jsonError(message, 502);
  }
}
