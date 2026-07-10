import type { CalendlyUtmParams } from '@/lib/calendly/embed-types';
import {
  buildWebsiteCalendlySchedulingHref,
  ENGAGEMENT_SERVICE_TO_WEBSITE_TIER,
  getWebsiteCalendlyUrl,
  pathwayTierToWebsiteCalendlyTier,
  WEBSITE_CALENDLY_LIVE_URLS,
  type WebsiteCalendlyTier,
} from '@/lib/calendly/scheduling-href';

export type { WebsiteCalendlyTier, CalendlyUtmParams };
export {
  buildWebsiteCalendlySchedulingHref,
  ENGAGEMENT_SERVICE_TO_WEBSITE_TIER,
  getWebsiteCalendlyUrl,
  pathwayTierToWebsiteCalendlyTier,
  WEBSITE_CALENDLY_LIVE_URLS,
};

/** Opens themed Calendly popup; heavy embed-url loads only on first open. */
export function openWebsiteCalendly(
  tier: WebsiteCalendlyTier,
  opts?: { utm?: CalendlyUtmParams; funnelLabel?: string },
): void {
  void (async () => {
    const [{ getCalendlyEmbedTheme }, { openCalendlyThemedPopup }, { resolvePortalTheme }] =
      await Promise.all([
        import('@/lib/calendly/embed-url'),
        import('@/lib/calendly/open-themed-popup'),
        import('@/lib/channel-landing-pages/resolvePortalTheme'),
      ]);

    const mode = getCalendlyEmbedTheme();
    void openCalendlyThemedPopup(getWebsiteCalendlyUrl(tier), {
      ...opts,
      theme: mode,
      channelId: 'website',
      portalTheme: resolvePortalTheme('website', mode),
      useProxy: true,
    });
  })();
}
