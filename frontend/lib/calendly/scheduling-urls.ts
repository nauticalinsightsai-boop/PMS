/**
 * Default public Calendly scheduling links for booking-sh3ikhmabz.
 * Legacy engagement keys map to website manifest events; live URLs resolve via event-registry.
 */
import { resolveCalendlyEventUrl } from '@pms/booking-crm/calendly/event-registry';

export const CALENDLY_BOOKING_HANDLE = 'booking-sh3ikhmabz';

const base = `https://calendly.com/${CALENDLY_BOOKING_HANDLE}`;

/** Engagement tiers + Home hero: aliases for website manifest slugs. */
export const CALENDLY_DEFAULT_SCHEDULING_URLS = {
 guideDownload: resolveCalendlyEventUrl('go-website-discovery') || `${base}/go-website-discovery`,
 projectReview: resolveCalendlyEventUrl('go-website-executive') || `${base}/go-website-executive`,
 strategyAdvisory: resolveCalendlyEventUrl('go-website-executive') || `${base}/go-website-executive`,
 premiumConsulting: resolveCalendlyEventUrl('go-website-services') || `${base}/go-website-services`,
 homeHeroArchitectingMarine: resolveCalendlyEventUrl('go-website-executive') || `${base}/go-website-executive`,
 homeHeroGovernanceMegaProject: resolveCalendlyEventUrl('go-website-executive') || `${base}/go-website-executive`,
 homeHeroDefiningInfrastructure: resolveCalendlyEventUrl('go-website-executive') || `${base}/go-website-executive`,
 websiteHeroConsultation:
  resolveCalendlyEventUrl('go-website-hero-consultation') || `${base}/go-website-hero-consultation`,
} as const;

export type CalendlySoloModalServiceId =
 | 'guide-download'
 | 'project-review'
 | 'strategy-advisory'
 | 'consulting';

export function getDefaultCalendlySchedulingUrlForService(
 serviceId: CalendlySoloModalServiceId
): string {
 switch (serviceId) {
  case 'guide-download':
   return CALENDLY_DEFAULT_SCHEDULING_URLS.guideDownload;
  case 'project-review':
   return CALENDLY_DEFAULT_SCHEDULING_URLS.projectReview;
  case 'strategy-advisory':
   return CALENDLY_DEFAULT_SCHEDULING_URLS.strategyAdvisory;
  case 'consulting':
   return CALENDLY_DEFAULT_SCHEDULING_URLS.premiumConsulting;
  default:
   return '';
 }
}