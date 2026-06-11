import { resolveCalendlyEventUrl } from '@/lib/calendly/event-registry';
import { sanitizeCalendlySchedulingUrl, type CalendlyUtmParams } from '@/lib/calendly/embed-url';
import { openCalendlyThemedPopup } from '@/lib/calendly/open-themed-popup';

/** Website-scoped Calendly events from the 29-event manifest (001-004). */
export type WebsiteCalendlyTier = 'hero' | 'discovery' | 'executive' | 'services';

export const WEBSITE_CALENDLY_SLUGS: Record<WebsiteCalendlyTier, string> = {
  hero: 'go-website-hero-consultation',
  discovery: 'go-website-discovery',
  executive: 'go-website-executive',
  services: 'go-website-services',
};

export function getWebsiteCalendlyUrl(tier: WebsiteCalendlyTier): string {
  const url = resolveCalendlyEventUrl(WEBSITE_CALENDLY_SLUGS[tier]);
  return sanitizeCalendlySchedulingUrl(url) || url;
}

/** Pathway tier → website Calendly event (foundation / professional / mastery). */
export function pathwayTierToWebsiteCalendlyTier(tierId: string): WebsiteCalendlyTier {
  if (tierId === 'foundation') return 'discovery';
  if (tierId === 'professional') return 'executive';
  return 'services';
}

export function openWebsiteCalendly(
  tier: WebsiteCalendlyTier,
  opts?: { utm?: CalendlyUtmParams; funnelLabel?: string },
): void {
  void openCalendlyThemedPopup(getWebsiteCalendlyUrl(tier), opts ?? {});
}

/** Legacy engagement service ids → website manifest tier. */
export const ENGAGEMENT_SERVICE_TO_WEBSITE_TIER: Record<string, WebsiteCalendlyTier> = {
  'guide-download': 'discovery',
  'project-review': 'executive',
  'strategy-advisory': 'executive',
  consulting: 'services',
};