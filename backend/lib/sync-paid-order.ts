import { sendOrderConfirmationEmail } from '@/lib/order-confirmation-email';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';

type OrderRow = {
  id: string;
  offering_id: string;
  email: string;
  metadata: unknown;
  status: string;
};

function asMetadataRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function resolveRecipientEmail(
  stripeEmail: string | null | undefined,
  orderEmail: string | null | undefined,
): string | null {
  const candidate = (stripeEmail ?? orderEmail ?? '').trim();
  if (!candidate || candidate === 'pending@checkout.local') return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate)) return null;
  return candidate;
}

export async function syncPaidOrderFromStripeSession(params: {
  sessionId: string;
  paymentStatus: string;
  customerEmail: string | null;
  verifiedVia: 'webhook' | 'session_poll';
}): Promise<void> {
  if (!isSupabaseConfigured) return;
  if (params.paymentStatus !== 'paid' && params.paymentStatus !== 'no_payment_required') return;

  const { data: row, error: fetchError } = await supabaseAdmin
    .from('orders')
    .select('id, offering_id, email, metadata, status')
    .eq('stripe_session_id', params.sessionId)
    .maybeSingle();

  if (fetchError) {
    console.error('[sync-paid-order] order lookup failed:', fetchError.message);
    throw fetchError;
  }
  if (!row) return;

  const order = row as OrderRow;
  const priorMetadata = asMetadataRecord(order.metadata);
  const recipientEmail = resolveRecipientEmail(params.customerEmail, order.email);

  const paidMetadata: Record<string, unknown> = {
    ...priorMetadata,
    stripePaymentStatus: params.paymentStatus,
    stripeCustomerEmail: params.customerEmail,
    verifiedVia: params.verifiedVia,
  };

  if (order.status !== 'paid') {
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'paid',
        updated_at: new Date().toISOString(),
        ...(recipientEmail ? { email: recipientEmail } : {}),
        metadata: paidMetadata,
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('[sync-paid-order] order update failed:', updateError.message);
      throw updateError;
    }
  } else if (recipientEmail && recipientEmail !== order.email) {
    await supabaseAdmin
      .from('orders')
      .update({
        email: recipientEmail,
        updated_at: new Date().toISOString(),
        metadata: paidMetadata,
      })
      .eq('id', order.id);
  }

  const { data: freshRow } = await supabaseAdmin
    .from('orders')
    .select('metadata')
    .eq('id', order.id)
    .maybeSingle();

  const latestMetadata = asMetadataRecord(freshRow?.metadata ?? paidMetadata);
  if (latestMetadata.confirmationEmailSentAt) return;

  if (!recipientEmail) {
    console.warn('[sync-paid-order] paid order missing customer email; skipping confirmation email', {
      orderId: order.id,
      sessionId: params.sessionId,
    });
    return;
  }

  const paymentType =
    typeof latestMetadata.paymentType === 'string' ? latestMetadata.paymentType : null;
  const customerName =
    typeof latestMetadata.customerName === 'string' ? latestMetadata.customerName : null;
  const amountDisplay =
    typeof latestMetadata.checkoutDisplay === 'string' ? latestMetadata.checkoutDisplay : null;

  const sent = await sendOrderConfirmationEmail({
    to: recipientEmail,
    offeringId: order.offering_id,
    paymentType,
    customerName,
    amountDisplay,
  });

  const confirmationPatch: Record<string, unknown> = {
    ...latestMetadata,
    ...paidMetadata,
    confirmationEmailRecipient: recipientEmail,
  };

  if (sent) {
    confirmationPatch.confirmationEmailSentAt = new Date().toISOString();
  } else {
    confirmationPatch.confirmationEmailSkippedAt = new Date().toISOString();
    confirmationPatch.confirmationEmailSkipReason = 'email_not_configured';
  }

  const { error: confirmError } = await supabaseAdmin
    .from('orders')
    .update({
      updated_at: new Date().toISOString(),
      metadata: confirmationPatch,
    })
    .eq('id', order.id);

  if (confirmError) {
    console.error('[sync-paid-order] confirmation metadata update failed:', confirmError.message);
    throw confirmError;
  }
}
