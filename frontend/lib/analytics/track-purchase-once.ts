'use client';

import { PackageType, PMS_EVENTS } from '@/lib/analytics/pms-events';
import { pushAnalyticsEvent } from '@/lib/analytics/push-event';
import { stableAnalyticsEventId } from '@/lib/analytics/event-id';
import { trackMetaPurchase } from '@/lib/analytics/meta-browser';
import { hasAnalyticsConsent, hasMarketingConsent } from '@/lib/legal/consent';

const STORAGE_PREFIX = 'pms_purchase_tracked_';
const pendingConsentListeners = new Map<string, () => void>();

type PurchaseChannel = 'ga' | 'meta';

function alreadyFired(transactionId: string, channel: PurchaseChannel): boolean {
  try {
    if (sessionStorage.getItem(`${STORAGE_PREFIX}${channel}_${transactionId}`) === '1') return true;
  } catch {
    // fall through
  }
  return false;
}

function markFired(transactionId: string, channel: PurchaseChannel): void {
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${channel}_${transactionId}`, '1');
  } catch {
    // ignore
  }
}

function queueUntilConsent(opts: Parameters<typeof trackPurchaseOnce>[0]): void {
  if (typeof window === 'undefined' || pendingConsentListeners.has(opts.transactionId)) return;
  const handler = () => {
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
  if (!opts.transactionId) return;
  const eventId = stableAnalyticsEventId('purchase', opts.transactionId);

  if (hasAnalyticsConsent() && !alreadyFired(opts.transactionId, 'ga')) {
    const gaSent = pushAnalyticsEvent(PMS_EVENTS.PURCHASE, {
      transaction_id: opts.transactionId,
      event_id: eventId,
      ...(opts.packageType ? { package_type: opts.packageType } : {}),
      ...(opts.currency ? { currency: opts.currency } : {}),
      ...(typeof opts.value === 'number' ? { value: opts.value } : {}),
      ...(opts.items?.length ? { items: opts.items } : {}),
    });
    if (gaSent) markFired(opts.transactionId, 'ga');
  }

  const hasMonetaryValue =
    Boolean(opts.currency) &&
    typeof opts.value === 'number' &&
    Number.isFinite(opts.value) &&
    opts.value >= 0;
  const metaEventId =
    hasMarketingConsent() &&
    !alreadyFired(opts.transactionId, 'meta') &&
    hasMonetaryValue
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
  if (metaEventId) markFired(opts.transactionId, 'meta');

  const gaDone = alreadyFired(opts.transactionId, 'ga');
  const metaDone = !hasMonetaryValue || alreadyFired(opts.transactionId, 'meta');
  if (gaDone && metaDone) {
    const handler = pendingConsentListeners.get(opts.transactionId);
    if (handler && typeof window !== 'undefined') {
      window.removeEventListener('legal-consent-updated', handler);
      pendingConsentListeners.delete(opts.transactionId);
    }
  } else {
    queueUntilConsent(opts);
  }
}
