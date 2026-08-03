'use client';

import { PackageType, PMS_EVENTS } from '@/lib/analytics/pms-events';
import { pushAnalyticsEvent } from '@/lib/analytics/push-event';
import { trackMetaPurchase } from '@/lib/analytics/meta-browser';
import { hasAnalyticsConsent } from '@/lib/legal/consent';

const STORAGE_PREFIX = 'pms_purchase_tracked_';
const pendingConsentListeners = new Map<string, () => void>();

export type VerifiedPurchaseMeasurement = {
  /** Opaque PM Structure order/transaction identity, never a Stripe object ID. */
  durableTransactionId: string;
  /** Stable opaque event identity persisted with the paid order. */
  durablePurchaseEventId: string;
  /** Must be supplied only from a server-verified paid outcome. */
  serverVerifiedPaid: boolean;
  packageType?: PackageType;
  currency?: string;
  value?: number;
  items?: Array<{
    item_id: string;
    item_name: string;
    item_category: string;
    price?: number;
    quantity?: number;
  }>;
};

function looksLikeStripeObjectId(value: string): boolean {
  return /^(cs|pi|evt|ch|in|sub)_/i.test(value);
}

function alreadyFired(transactionId: string): boolean {
  try {
    if (localStorage.getItem(`${STORAGE_PREFIX}${transactionId}`) === '1') return true;
  } catch {
    // fall through
  }
  return false;
}

function markFired(transactionId: string): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${transactionId}`, '1');
  } catch {
    // ignore
  }
}

function queueUntilConsent(opts: VerifiedPurchaseMeasurement): void {
  if (
    typeof window === 'undefined' ||
    pendingConsentListeners.has(opts.durableTransactionId)
  ) {
    return;
  }
  const handler = () => {
    if (!hasAnalyticsConsent()) return;
    window.removeEventListener('legal-consent-updated', handler);
    pendingConsentListeners.delete(opts.durableTransactionId);
    window.setTimeout(() => trackPurchaseOnce(opts), 250);
  };
  pendingConsentListeners.set(opts.durableTransactionId, handler);
  window.addEventListener('legal-consent-updated', handler);
}

/**
 * Fire GA4 + Meta Purchase only with server-paid, durable internal identities.
 * Raw Stripe IDs are rejected; callers may not substitute a client callback.
 */
export function trackPurchaseOnce(opts: VerifiedPurchaseMeasurement): void {
  if (
    opts.serverVerifiedPaid !== true ||
    !opts.durableTransactionId ||
    !opts.durablePurchaseEventId ||
    looksLikeStripeObjectId(opts.durableTransactionId) ||
    looksLikeStripeObjectId(opts.durablePurchaseEventId) ||
    alreadyFired(opts.durableTransactionId)
  ) {
    return;
  }
  if (!hasAnalyticsConsent()) {
    queueUntilConsent(opts);
    return;
  }

  const gaSent = pushAnalyticsEvent(PMS_EVENTS.PURCHASE, {
    transaction_id: opts.durableTransactionId,
    event_id: opts.durablePurchaseEventId,
    ...(opts.packageType ? { package_type: opts.packageType } : {}),
    ...(opts.currency ? { currency: opts.currency } : {}),
    ...(typeof opts.value === 'number' ? { value: opts.value } : {}),
    ...(opts.items?.length ? { items: opts.items } : {}),
  });

  const hasMonetaryValue =
    Boolean(opts.currency) &&
    typeof opts.value === 'number' &&
    Number.isFinite(opts.value) &&
    opts.value >= 0;
  const metaEventId = hasMonetaryValue
    ? trackMetaPurchase(
        {
          currency: opts.currency!,
          value: opts.value!,
          content_type: 'product',
          ...(opts.items?.length ? { content_ids: opts.items.map((i) => i.item_id) } : {}),
        },
        opts.durablePurchaseEventId,
      )
    : null;

  if (gaSent || metaEventId) markFired(opts.durableTransactionId);
}
