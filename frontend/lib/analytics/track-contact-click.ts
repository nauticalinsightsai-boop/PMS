import {
  ContactContext,
  ContactMethod,
  PMS_EVENTS,
} from '@/lib/analytics/pms-events';
import { pushAnalyticsEvent } from '@/lib/analytics/push-event';
import { createAnalyticsEventId } from '@/lib/analytics/event-id';

export function trackContactClick(opts: {
  contactMethod: ContactMethod;
  contactContext: ContactContext;
  ctaText?: string;
  pagePath?: string;
}): void {
  const eventId = createAnalyticsEventId('contact');
  pushAnalyticsEvent(PMS_EVENTS.CONTACT_CLICK, {
    event_id: eventId,
    contact_method: opts.contactMethod,
    contact_context: opts.contactContext,
    page_path: opts.pagePath ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
    ...(opts.ctaText ? { cta_text: opts.ctaText } : {}),
  });
}
