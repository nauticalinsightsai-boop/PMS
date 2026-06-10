import manifest from '../../data/calendly-events.manifest.json';
import { getChannelById } from '../constants/channelGroups';

export type CalendlyTierKind = 'discovery' | 'executive' | 'services' | 'hero';

export type CalendlyEvent = {
  id: string;
  name: string;
  slug: string;
  family: string;
  tierKind: CalendlyTierKind;
  durationMinutes: number;
  ctaLabel: string;
  payment: 'free' | 'paid';
  guestsAllowed: boolean;
  dailyLimit: number;
  bufferBefore: number;
  bufferAfter: number;
  description: string;
  channelIds: string[];
  portalTierIds: string[];
  urls: {
    primary: string;
    fallback: string | null;
  };
};

const EVENTS = manifest.events as CalendlyEvent[];

const eventsBySlug = new Map(EVENTS.map((event) => [event.slug, event]));

const PORTAL_TIER_TO_KIND: Record<string, CalendlyTierKind> = {
  'mentor-intro': 'discovery',
  discovery: 'discovery',
  'career-pathway': 'executive',
  executive: 'executive',
  'services-detail': 'services',
  'design-review': 'services',
};

/** Slug env key: go-website-discovery → NEXT_PUBLIC_CALENDLY_EVENT_GO_WEBSITE_DISCOVERY */
export function calendlyEventEnvVarName(slug: string): string {
  const token = slug.replace(/^go-/, '').replace(/-/g, '_').toUpperCase();
  return `NEXT_PUBLIC_CALENDLY_EVENT_${token}`;
}

function readEnvOverride(slug: string): string | undefined {
  if (typeof process === 'undefined' || !process.env) return undefined;
  const key = calendlyEventEnvVarName(slug);
  const heroKey = 'NEXT_PUBLIC_CALENDLY_EVENT_URL_WEBSITE_HERO';
  if (slug === 'go-website-hero-consultation' && process.env[heroKey]?.trim()) {
    return process.env[heroKey]!.trim();
  }
  return process.env[key]?.trim() || undefined;
}

/** Resolve order: env override → pm-structure fallback → booking-sh3ikhmabz primary */
export function resolveCalendlyEventUrl(slug: string): string {
  const event = getEventBySlug(slug);
  const fromEnv = readEnvOverride(slug);
  if (fromEnv) return fromEnv;
  if (event?.urls.fallback) return event.urls.fallback;
  if (event?.urls.primary) return event.urls.primary;
  return '';
}

export function getEventBySlug(slug: string): CalendlyEvent | undefined {
  return eventsBySlug.get(slug);
}

export function getAllCalendlyEvents(): CalendlyEvent[] {
  return EVENTS;
}

export function getCalendlyManifestMeta() {
  return manifest.meta;
}

function tierKindForPortalTier(tierId: string): CalendlyTierKind {
  return PORTAL_TIER_TO_KIND[tierId] ?? 'discovery';
}

function eventMatchesChannel(event: CalendlyEvent, channelId: string): boolean {
  if (!event.channelIds.length) return false;
  return event.channelIds.includes(channelId);
}

/**
 * Prefer channel-specific events (single channelId) over family-wide events.
 */
export function getEventForChannelTier(
  channelId: string,
  tierId: string,
): CalendlyEvent | undefined {
  const tierKind = tierKindForPortalTier(tierId);
  const candidates = EVENTS.filter(
    (event) => event.tierKind === tierKind && eventMatchesChannel(event, channelId),
  );
  if (!candidates.length) return undefined;

  const specific = candidates.filter(
    (event) => event.channelIds.length === 1 && event.channelIds[0] === channelId,
  );
  if (specific.length) return specific[0];

  return candidates.sort((a, b) => a.channelIds.length - b.channelIds.length)[0];
}

export function getCalendlyUrlForChannelTier(channelId: string, tierId: string): string {
  const event = getEventForChannelTier(channelId, tierId);
  return event ? resolveCalendlyEventUrl(event.slug) : '';
}

export function getCalendlyCtaForChannelTier(channelId: string, tierId: string): string {
  const event = getEventForChannelTier(channelId, tierId);
  return event?.ctaLabel ?? '';
}

export function getWebsiteHeroConsultationEvent(): CalendlyEvent | undefined {
  return getEventBySlug('go-website-hero-consultation');
}

export function getWebsiteHeroConsultationUrl(): string {
  return resolveCalendlyEventUrl('go-website-hero-consultation');
}

/** Platform category fallback family slug prefix (go-{family}-{tierKind}). */
export function getPlatformFamilySlugPrefix(channelId: string): string {
  if (channelId === 'website') return 'go-website';
  if (channelId === 'webinar') return 'go-webinar';
  if (channelId === 'linkedin') return 'go-linkedin';
  if (channelId === 'youtube') return 'go-youtube';
  if (channelId === 'email') return 'go-email';
  if (channelId === 'rss-feeds') return 'go-rss-feeds';
  if (channelId === 'content-aggregators' || channelId === 'api-ai-fed') {
    return 'go-syndicated';
  }

  const channel = getChannelById(channelId);
  if (!channel) return 'go-website';

  switch (channel.platformCategory) {
    case 'Writing / Publishing':
      return 'go-writing';
    case 'Social Distribution':
      return 'go-social';
    case 'Video Platform':
      return 'go-video';
    case 'Audio / Podcast':
      return 'go-audio';
    case 'Community / Direct':
      return 'go-community';
    case 'Discovery / Search':
      return 'go-search';
    case 'Syndication / Automation':
      return 'go-syndicated';
    default:
      return 'go-website';
  }
}
