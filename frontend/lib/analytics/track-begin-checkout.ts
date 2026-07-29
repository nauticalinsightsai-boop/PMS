import { stableAnalyticsEventId } from '@/lib/analytics/event-id';
import { trackMetaInitiateCheckout } from '@/lib/analytics/meta-browser';
import { PMS_EVENTS } from '@/lib/analytics/pms-events';
import {
  pushAnalyticsEvent,
  type AnalyticsEventParams,
  type AnalyticsItem,
} from '@/lib/analytics/push-event';

function itemsFrom(params: AnalyticsEventParams): AnalyticsItem[] {
  return Array.isArray(params.items) ? params.items : [];
}

/** GA4 + Meta InitiateCheckout with a shared event ID and no customer PII. */
export function trackBeginCheckout(
  params: AnalyticsEventParams = {},
  checkoutSessionId: string,
): void {
  if (!checkoutSessionId) return;
  const eventId = stableAnalyticsEventId('checkout', checkoutSessionId);
  pushAnalyticsEvent(PMS_EVENTS.BEGIN_CHECKOUT, {
    ...params,
    event_id: eventId,
  });

  const items = itemsFrom(params);
  const contentIds = items
    .map((item) => item.item_id)
    .filter((itemId): itemId is string => typeof itemId === 'string' && Boolean(itemId));
  const numItems = items.reduce(
    (total, item) =>
      total + (typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1),
    0,
  );

  trackMetaInitiateCheckout(
    {
      content_type: 'product',
      ...(contentIds.length > 0 ? { content_ids: contentIds } : {}),
      ...(numItems > 0 ? { num_items: numItems } : {}),
      ...(typeof params.currency === 'string' ? { currency: params.currency } : {}),
      ...(typeof params.value === 'number' ? { value: params.value } : {}),
    },
    eventId,
  );
}
