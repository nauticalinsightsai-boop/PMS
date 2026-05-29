import { openCalendlyThemedPopup } from '@/lib/calendly/open-themed-popup';
import { CALENDLY_DEFAULT_SCHEDULING_URLS } from '@/lib/calendly/scheduling-urls';

const TIER_CALENDLY_FALLBACKS: Record<string, string> = {
  foundation: CALENDLY_DEFAULT_SCHEDULING_URLS.guideDownload,
  professional: CALENDLY_DEFAULT_SCHEDULING_URLS.projectReview,
  mastery: CALENDLY_DEFAULT_SCHEDULING_URLS.strategyAdvisory,
  mastery_corporate: CALENDLY_DEFAULT_SCHEDULING_URLS.premiumConsulting,
  mastery_advisory: CALENDLY_DEFAULT_SCHEDULING_URLS.premiumConsulting,
};

/**
 * Env var name for a pathway consultation Calendly URL.
 * @see docs/PATHWAY_ENROLLMENT_ENV.md
 */
export function pathwayCalendlyEnvVarName(siteCertId: string, tierId: string): string {
  const token = `PATHWAY_${siteCertId}_${tierId}`.replace(/-/g, '_').toUpperCase();
  return `NEXT_PUBLIC_CALENDLY_${token}`;
}

function readPathwayCalendlyEnv(siteCertId: string, tierId: string): string | undefined {
  const key = pathwayCalendlyEnvVarName(siteCertId, tierId);
  const value = process.env[key]?.trim();
  return value || undefined;
}

export function getPathwayConsultationCalendlyUrl(siteCertId: string, tierId: string): string {
  return (
    readPathwayCalendlyEnv(siteCertId, tierId) ??
    TIER_CALENDLY_FALLBACKS[tierId] ??
    CALENDLY_DEFAULT_SCHEDULING_URLS.projectReview
  );
}

export function openPathwayConsultationCalendly(
  siteCertId: string,
  tierId: string,
  offeringId: string,
): void {
  const url = getPathwayConsultationCalendlyUrl(siteCertId, tierId);
  void openCalendlyThemedPopup(url, {
    utm: {
      utm_source: 'pathway',
      utm_medium: 'certification',
      utm_campaign: siteCertId,
      utm_content: offeringId,
    },
    funnelLabel: `pathway:${siteCertId}:${tierId}`,
  });
}
