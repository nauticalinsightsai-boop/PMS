'use client';

import { PackageType, PMS_EVENTS } from '@/lib/analytics/pms-events';
import { pushAnalyticsEvent } from '@/lib/analytics/push-event';
import { createAnalyticsEventId } from '@/lib/analytics/event-id';
import { trackMetaPurchase } from '@/lib/analytics/meta-browser';
import { hasAnalyticsConsent } from '@/lib/legal/consent';

const STORAGE_PREFIX = 'pms_purchase_tracked_';
const pendingConsentListeners = new Map<string, () => void>();

function alreadyFired(transactionId: string): boolean {
  try {
    if (sessionStorage.getItem(`${STORAGE_PREFIX}${transactionId}`) === '1') return true;
  } catch {
    // fall through
  }
  return false;
}

function markFired(transactionId: string): void {
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${transactionId}`, '1');
  } catch {
    // ignore
  }
}

function queueUntilConsent(opts: Parameters<typeof trackPurchaseOnce>[0]): void {
  if (typeof window === 'undefined' || pendingConsentListeners.has(opts.transactionId)) return;
  const handler = () => {
    if (!hasAnalyticsConsent()) return;
    window.removeEventListener('legal-consent-updated', handler);
    pendingConsentListeners.delete(opts.transactionId);
    window.setTimeout(() => trackPurchaseOnce(opts), 250);
  };
  pendingConsentListeners.set(opts.transactionId, handler);
  window.addEventListener('legal-consent-updated', handler);
}

/** Fire GA4 + Meta Purchase only after server-confirmed payment; refresh-safe. */
export function trackPurchaseOnce(opts: {
  transactionId: string;
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
}): void {
  if (!opts.transactionId || alreadyFired(opts.transactionId)) return;
  if (!hasAnalyticsConsent()) {
    queueUntilConsent(opts);
    return;
  }

  const eventId = createAnalyticsEventId('purchase');
  const gaSent = pushAnalyticsEvent(PMS_EVENTS.PURCHASE, {
    transaction_id: opts.transactionId,
    event_id: eventId,
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
          content_ids: opts.items?.map((i) => i.item_id) ?? [opts.transactionId],
        },
        eventId,
      )
    : null;

  if (gaSent || metaEventId) markFired(opts.transactionId);
}
