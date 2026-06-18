import {
  BookingDestination,
  BookingType,
  PMP_2026_OFFER,
  PMS_EVENTS,
} from '@/lib/analytics/pms-events';
import { pushAnalyticsEvent } from '@/lib/analytics/push-event';

export function trackBookingClick(opts: {
  bookingType: BookingType;
  destination?: BookingDestination;
  ctaText?: string;
  pagePath?: string;
  includePmpOffer?: boolean;
}): void {
  pushAnalyticsEvent(PMS_EVENTS.BOOKING_CLICK, {
    ...(opts.includePmpOffer !== false ? PMP_2026_OFFER : {}),
    booking_type: opts.bookingType,
    destination: opts.destination ?? 'calendly',
    page_path: opts.pagePath ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
    ...(opts.ctaText ? { cta_text: opts.ctaText } : {}),
  });
}
