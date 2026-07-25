import {
  BookingDestination,
  BookingType,
  PMP_2026_OFFER,
} from '@/lib/analytics/pms-events';
import { pushAnalyticsEvent } from '@/lib/analytics/push-event';

/** Booking CTA clicks are engagement (`select_content`), never leads. */
export function trackBookingClick(opts: {
  bookingType: BookingType;
  destination?: BookingDestination;
  ctaText?: string;
  pagePath?: string;
  includePmpOffer?: boolean;
}): void {
  pushAnalyticsEvent('select_content', {
    content_type: 'booking_cta',
    ...(opts.includePmpOffer !== false ? PMP_2026_OFFER : {}),
    booking_type: opts.bookingType,
    destination: opts.destination ?? 'calendly',
    page_path: opts.pagePath ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
    ...(opts.ctaText ? { item_id: opts.ctaText } : {}),
  });
}
