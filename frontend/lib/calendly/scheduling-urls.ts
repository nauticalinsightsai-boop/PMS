/**
 * Default public Calendly scheduling links for booking-sh3ikhmabz.
 * Env vars (NEXT_PUBLIC_CALENDLY_*) override these at build time; fallbacks keep
 * Home hero + Engagement popups working without .env.local.
 */
export const CALENDLY_BOOKING_HANDLE = 'booking-sh3ikhmabz';

const base = `https://calendly.com/${CALENDLY_BOOKING_HANDLE}`;

/** Engagement tiers + Home hero slides (verified event slugs on Calendly). */
export const CALENDLY_DEFAULT_SCHEDULING_URLS = {
 /** Strategic Awareness / guide-download — “Book Discovery Call” (30 min) */
 guideDownload: `${base}/strategic-awareness-99-30`,
 /** Project & Idea Review (60 min) */
 projectReview: `${base}/project-idea-review-199-60`,
 /** Strategy & Advisory Call (90 min) */
 strategyAdvisory: `${base}/strategy-advisory-call-299-90`,
 /** Premium Consulting (4 hr) */
 premiumConsulting: `${base}/premium-consulting-1199-4hr`,
 homeHeroArchitectingMarine: `${base}/strategy-advisory-call-299-90`,
 homeHeroGovernanceMegaProject: `${base}/project-idea-review-199-60`,
 homeHeroDefiningInfrastructure: `${base}/strategy-advisory-call-299-90`,
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
