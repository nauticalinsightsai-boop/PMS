/**
 * Default public Calendly scheduling links (live pm-structure events only).
 */
import { LIVE_SITE_CALENDLY } from '@pms/booking-crm/calendly/live-scheduling-urls';

const { talkToMentor, talkToAdvisor } = LIVE_SITE_CALENDLY;

/** Engagement tiers + Home hero → live talk-to-* events. */
export const CALENDLY_DEFAULT_SCHEDULING_URLS = {
  guideDownload: talkToMentor,
  projectReview: talkToAdvisor,
  strategyAdvisory: talkToAdvisor,
  premiumConsulting: talkToAdvisor,
  homeHeroArchitectingMarine: talkToAdvisor,
  homeHeroGovernanceMegaProject: talkToAdvisor,
  homeHeroDefiningInfrastructure: talkToAdvisor,
  websiteHeroConsultation: talkToMentor,
} as const;

export type CalendlySoloModalServiceId =
  | 'guide-download'
  | 'project-review'
  | 'strategy-advisory'
  | 'consulting';

export function getDefaultCalendlySchedulingUrlForService(
  serviceId: CalendlySoloModalServiceId,
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
