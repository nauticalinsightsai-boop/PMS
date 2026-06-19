/**
 * Thin Calendly scheduling URL helpers for nav CTAs and href fallbacks.
 * Does not import embed-url.ts (~1.3k LOC theme/embed builder).
 */
import { LIVE_SITE_CALENDLY } from '@pms/booking-crm/calendly/live-scheduling-urls';
import { assertCalendlySchedulingUrl } from '@/lib/calendly/host-allowlist';
import type { CalendlyUtmParams } from '@/lib/calendly/embed-types';

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

export function sanitizeCalendlySchedulingUrl(raw: string): string {
  return assertCalendlySchedulingUrl(raw) ?? raw.trim();
}

export function getWebsiteCalendlyUrl(tier: WebsiteCalendlyTier): string {
  const fromEnv = envOverrideForTier(tier);
  if (fromEnv) {
    return sanitizeCalendlySchedulingUrl(fromEnv) || fromEnv;
  }
  return DEFAULT_BY_TIER[tier];
}

/** Direct scheduling URL (with optional UTM) for href fallbacks and middle-click. */
export function buildWebsiteCalendlySchedulingHref(
  tier: WebsiteCalendlyTier,
  utm?: CalendlyUtmParams,
): string {
  const base = getWebsiteCalendlyUrl(tier);
  try {
    const u = new URL(base);
    if (utm?.utm_source?.trim()) u.searchParams.set('utm_source', utm.utm_source.trim());
    if (utm?.utm_medium?.trim()) u.searchParams.set('utm_medium', utm.utm_medium.trim());
    if (utm?.utm_campaign?.trim()) u.searchParams.set('utm_campaign', utm.utm_campaign.trim());
    if (utm?.utm_content?.trim()) u.searchParams.set('utm_content', utm.utm_content.trim());
    return u.toString();
  } catch {
    return base;
  }
}

/** @deprecated Site CTAs no longer use manifest slugs; kept for imports that read live defaults. */
export const WEBSITE_CALENDLY_LIVE_URLS = { ...DEFAULT_BY_TIER };

/** Pathway tier → site Calendly (live talk-to-* events). */
export function pathwayTierToWebsiteCalendlyTier(tierId: string): WebsiteCalendlyTier {
  if (tierId === 'foundation') return 'discovery';
  if (tierId === 'professional') return 'executive';
  return 'services';
}

export const ENGAGEMENT_SERVICE_TO_WEBSITE_TIER: Record<string, WebsiteCalendlyTier> = {
  'guide-download': 'discovery',
  'project-review': 'executive',
  'strategy-advisory': 'executive',
  consulting: 'services',
};
