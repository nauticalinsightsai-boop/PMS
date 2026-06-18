'use client';

import { PackageType, PMS_EVENTS } from '@/lib/analytics/pms-events';
import { pushAnalyticsEvent } from '@/lib/analytics/push-event';

const firedPurchaseSessions = new Set<string>();

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
  if (!opts.transactionId || firedPurchaseSessions.has(opts.transactionId)) return;
  firedPurchaseSessions.add(opts.transactionId);

  pushAnalyticsEvent(PMS_EVENTS.PURCHASE, {
    transaction_id: opts.transactionId,
    ...(opts.packageType ? { package_type: opts.packageType } : {}),
    ...(opts.currency ? { currency: opts.currency } : {}),
    ...(typeof opts.value === 'number' ? { value: opts.value } : {}),
    ...(opts.items?.length ? { items: opts.items } : {}),
  });
}
