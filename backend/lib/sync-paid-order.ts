import { sendOrderConfirmationEmail } from '@/lib/order-confirmation-email';
import { recordPaidOrderToSheet } from '@/lib/record-payment-interaction';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';

type OrderRow = {
  id: string;
  offering_id: string;
  email: string;
  metadata: unknown;
  status: string;
  updated_at: string;
};

export type VerifiedPaidOrderIdentity = {
  /** Opaque internal order identity; never a Stripe object ID. */
  durableTransactionId: string;
  /** Stable provider-dedupe identity derived from the internal order. */
  durablePurchaseEventId: string;
};

function paidOrderIdentity(
  orderId: string,
  metadata: Record<string, unknown>,
): VerifiedPaidOrderIdentity {
  const storedEventId =
    typeof metadata.purchaseAnalyticsEventId === 'string' &&
    metadata.purchaseAnalyticsEventId.trim()
      ? metadata.purchaseAnalyticsEventId.trim()
      : null;
  return {
    durableTransactionId: orderId,
    durablePurchaseEventId: storedEventId ?? `pms_purchase_${orderId}`,
  };
}

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
  idempotencyKey: string;
}): Promise<VerifiedPaidOrderIdentity | null> {
  if (!isSupabaseConfigured) return null;
  if (params.paymentStatus !== 'paid' && params.paymentStatus !== 'no_payment_required') {
    return null;
  }

  const { data: row, error: fetchError } = await supabaseAdmin
    .from('orders')
    .select('id, offering_id, email, metadata, status, updated_at')
    .eq('stripe_session_id', params.sessionId)
    .maybeSingle();

  if (fetchError) {
    console.error('[sync-paid-order] order lookup failed:', fetchError.message);
    throw fetchError;
  }
  if (!row) return null;

  const order = row as OrderRow;
  const priorMetadata = asMetadataRecord(order.metadata);
  const purchaseIdentity = paidOrderIdentity(order.id, priorMetadata);
  const recipientEmail = resolveRecipientEmail(params.customerEmail, order.email);
  if (
    typeof priorMetadata.stripeFulfillmentCompletedAt === 'string' ||
    typeof priorMetadata.stripeFulfillmentClaimedAt === 'string'
  ) {
    return purchaseIdentity;
  }

  const paidMetadata: Record<string, unknown> = {
    ...priorMetadata,
    purchaseAnalyticsEventId: purchaseIdentity.durablePurchaseEventId,
    stripePaymentStatus: params.paymentStatus,
    stripeCustomerEmail: params.customerEmail,
    verifiedVia: params.verifiedVia,
  };

  if (!recipientEmail) {
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'paid',
        updated_at: new Date().toISOString(),
        metadata: paidMetadata,
      })
      .eq('id', order.id)
      .eq('updated_at', order.updated_at);
    if (updateError) {
      console.error('[sync-paid-order] order update failed:', updateError.message);
      throw updateError;
    }
    console.warn('[sync-paid-order] paid order missing customer email; fulfillment deferred', {
      orderId: order.id,
      sessionId: params.sessionId,
    });
    return purchaseIdentity;
  }

  const claimedAt = new Date().toISOString();
  const claimedMetadata: Record<string, unknown> = {
    ...paidMetadata,
    stripeFulfillmentClaimedAt: claimedAt,
    stripeFulfillmentClaimKey: params.idempotencyKey,
    stripeFulfillmentState: 'processing',
  };
  const {
    data: claimedRow,
    error: claimError,
  } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'paid',
      email: recipientEmail,
      updated_at: claimedAt,
      metadata: claimedMetadata,
    })
    .eq('id', order.id)
    .eq('updated_at', order.updated_at)
    .select('id')
    .maybeSingle();

  if (claimError) {
    console.error('[sync-paid-order] fulfillment claim failed:', claimError.message);
    throw claimError;
  }
  if (!claimedRow) return purchaseIdentity;

  const latestMetadata = claimedMetadata;

  // Record the paid order into the forms → Google Sheets pipeline (once per order).
  if (!latestMetadata.sheetRecordedAt) {
    const recorded = await recordPaidOrderToSheet({
      email: recipientEmail,
      offeringId: order.offering_id,
      sessionId: params.sessionId,
      metadata: latestMetadata,
    });
    if (recorded) {
      latestMetadata.sheetRecordedAt = new Date().toISOString();
    }
  }

  const paymentType =
    typeof latestMetadata.paymentType === 'string' ? latestMetadata.paymentType : null;
  const customerName =
    typeof latestMetadata.customerName === 'string' ? latestMetadata.customerName : null;
  const amountDisplay =
    typeof latestMetadata.checkoutDisplay === 'string' ? latestMetadata.checkoutDisplay : null;

  let sent = false;
  try {
    sent = await sendOrderConfirmationEmail({
      to: recipientEmail,
      offeringId: order.offering_id,
      paymentType,
      customerName,
      amountDisplay,
    });
  } catch (error) {
    const failedMetadata: Record<string, unknown> = {
      ...latestMetadata,
      stripeFulfillmentState: 'needs_reconciliation',
      stripeFulfillmentFailure: 'confirmation_email_failed',
    };
    await supabaseAdmin
      .from('orders')
      .update({
        updated_at: new Date().toISOString(),
        metadata: failedMetadata,
      })
      .eq('id', order.id);
    throw error;
  }

  const confirmationPatch: Record<string, unknown> = {
    ...latestMetadata,
    confirmationEmailRecipient: recipientEmail,
  };

  if (sent) {
    confirmationPatch.confirmationEmailSentAt = new Date().toISOString();
  } else {
    confirmationPatch.confirmationEmailSkippedAt = new Date().toISOString();
    confirmationPatch.confirmationEmailSkipReason = 'email_not_configured';
  }
  confirmationPatch.stripeFulfillmentState =
    confirmationPatch.sheetRecordedAt && confirmationPatch.confirmationEmailSentAt
      ? 'completed'
      : 'needs_reconciliation';
  if (confirmationPatch.stripeFulfillmentState === 'completed') {
    confirmationPatch.stripeFulfillmentCompletedAt = new Date().toISOString();
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

  return purchaseIdentity;
}
