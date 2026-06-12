import { LIVE_SITE_CALENDLY } from '@pms/booking-crm/calendly/live-scheduling-urls';
import { sanitizeCalendlySchedulingUrl, getCalendlyEmbedTheme, isGoPortalCalendlyPath, type CalendlyUtmParams } from '@/lib/calendly/embed-url';
import { openCalendlyThemedPopup } from '@/lib/calendly/open-themed-popup';
import { resolvePortalTheme } from '@/lib/channel-landing-pages/resolvePortalTheme';

/** Main-site Calendly tiers — only live pm-structure events (no go-website-* slugs). */
export type WebsiteCalendlyTier =
  | 'mentor'
  | 'advisor'
  | 'hero'
  | 'discovery'
  | 'executive'
  | 'services';

const DEFAULT_BY_TIER: Record<WebsiteCalendlyTier, string> = {
  mentor: LIVE_SITE_CALENDLY.talkToMentor,
  advisor: LIVE_SITE_CALENDLY.talkToAdvisor,
  hero: LIVE_SITE_CALENDLY.talkToMentor,
  discovery: LIVE_SITE_CALENDLY.talkToMentor,
  executive: LIVE_SITE_CALENDLY.talkToAdvisor,
  services: LIVE_SITE_CALENDLY.talkToAdvisor,
};

function envOverrideForTier(tier: WebsiteCalendlyTier): string | undefined {
  if (typeof process === 'undefined' || !process.env) return undefined;
  if (tier === 'mentor' || tier === 'discovery' || tier === 'hero') {
    return (
      process.env.NEXT_PUBLIC_TALK_TO_MENTOR_CALENDLY_URL?.trim() ||
      process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL_WEBSITE_HERO?.trim() ||
      undefined
    );
  }
  if (tier === 'advisor' || tier === 'executive' || tier === 'services') {
    return process.env.NEXT_PUBLIC_TALK_TO_ADVISOR_CALENDLY_URL?.trim() || undefined;
  }
  return undefined;
}

export function getWebsiteCalendlyUrl(tier: WebsiteCalendlyTier): string {
  const fromEnv = envOverrideForTier(tier);
  if (fromEnv) {
    return sanitizeCalendlySchedulingUrl(fromEnv) || fromEnv;
  }
  return DEFAULT_BY_TIER[tier];
}

/** @deprecated Site CTAs no longer use manifest slugs; kept for imports that read live defaults. */
export const WEBSITE_CALENDLY_LIVE_URLS = { ...DEFAULT_BY_TIER };

/** Pathway tier → site Calendly (live talk-to-* events). */
export function pathwayTierToWebsiteCalendlyTier(tierId: string): WebsiteCalendlyTier {
  if (tierId === 'foundation') return 'discovery';
  if (tierId === 'professional') return 'executive';
  return 'services';
}

export function openWebsiteCalendly(
  tier: WebsiteCalendlyTier,
  opts?: { utm?: CalendlyUtmParams; funnelLabel?: string },
): void {
  const mode = getCalendlyEmbedTheme();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const onWebsitePortal = isGoPortalCalendlyPath(pathname) && /^\/go\/website\/?$/i.test(pathname);
  void openCalendlyThemedPopup(getWebsiteCalendlyUrl(tier), {
    ...opts,
    theme: mode,
    ...(onWebsitePortal ? { portalTheme: resolvePortalTheme('website', mode) } : {}),
  });
}

export const ENGAGEMENT_SERVICE_TO_WEBSITE_TIER: Record<string, WebsiteCalendlyTier> = {
  'guide-download': 'discovery',
  'project-review': 'executive',
  'strategy-advisory': 'executive',
  consulting: 'services',
};
