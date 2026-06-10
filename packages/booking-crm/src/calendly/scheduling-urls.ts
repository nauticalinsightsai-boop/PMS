/**
 * Default public Calendly scheduling links.
 * Legacy keys map to website manifest events (go-website-*); live URLs resolve via event-registry.
 */
import { resolveCalendlyEventUrl } from './event-registry';

export const CALENDLY_BOOKING_HANDLE = 'booking-sh3ikhmabz';

const base = `https://calendly.com/${CALENDLY_BOOKING_HANDLE}`;

/** Engagement tiers + Home hero — aliases for website manifest slugs. */
export const CALENDLY_DEFAULT_SCHEDULING_URLS = {
 /** @deprecated Use resolveCalendlyEventUrl('go-website-discovery') */
 guideDownload: resolveCalendlyEventUrl('go-website-discovery') || `${base}/go-website-discovery`,
 /** @deprecated Use resolveCalendlyEventUrl('go-website-executive') */
 projectReview: resolveCalendlyEventUrl('go-website-executive') || `${base}/go-website-executive`,
 /** @deprecated Use resolveCalendlyEventUrl('go-website-executive') */
 strategyAdvisory: resolveCalendlyEventUrl('go-website-executive') || `${base}/go-website-executive`,
 /** @deprecated Use resolveCalendlyEventUrl('go-website-services') */
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

const SERVICE_SLUG: Record<CalendlySoloModalServiceId, string> = {
  'guide-download': 'go-website-discovery',
  'project-review': 'go-website-executive',
  'strategy-advisory': 'go-website-executive',
  consulting: 'go-website-services',
};

export function getDefaultCalendlySchedulingUrlForService(
 serviceId: CalendlySoloModalServiceId
): string {
 return resolveCalendlyEventUrl(SERVICE_SLUG[serviceId]) || '';
}
