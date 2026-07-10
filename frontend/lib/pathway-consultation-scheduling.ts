import { openCalendlyThemedPopup } from '@/lib/calendly/open-themed-popup';
import {
  getWebsiteCalendlyUrl,
  pathwayTierToWebsiteCalendlyTier,
} from '@/lib/calendly/website-events';

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
    getWebsiteCalendlyUrl(pathwayTierToWebsiteCalendlyTier(tierId))
  );
}

export function openPathwayConsultationCalendly(
  siteCertId: string,
  tierId: string,
  offeringId: string,
): void {
  const url = getPathwayConsultationCalendlyUrl(siteCertId, tierId);
  void (async () => {
    const [{ getCalendlyEmbedTheme }, { resolvePortalTheme }] = await Promise.all([
      import('@/lib/calendly/embed-url'),
      import('@/lib/channel-landing-pages/resolvePortalTheme'),
    ]);
    const mode = getCalendlyEmbedTheme();
    void openCalendlyThemedPopup(url, {
      utm: {
        utm_source: 'pathway',
        utm_medium: 'certification',
        utm_campaign: siteCertId,
        utm_content: offeringId,
      },
      funnelLabel: `pathway:${siteCertId}:${tierId}`,
      theme: mode,
      channelId: 'website',
      portalTheme: resolvePortalTheme('website', mode),
      useProxy: true,
    });
  })();
}
