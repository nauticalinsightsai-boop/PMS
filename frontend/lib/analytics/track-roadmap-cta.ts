import {
  CtaLocation,
  PMP_2026_OFFER,
  PMS_EVENTS,
} from '@/lib/analytics/pms-events';
import { pushAnalyticsEvent } from '@/lib/analytics/push-event';

export function trackRoadmapCtaClick(opts: {
  ctaText: string;
  ctaLocation: CtaLocation;
  pagePath?: string;
}): void {
  pushAnalyticsEvent(PMS_EVENTS.ROADMAP_CTA_CLICK, {
    ...PMP_2026_OFFER,
    page_path: opts.pagePath ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
    cta_text: opts.ctaText,
    cta_location: opts.ctaLocation,
  });
}
