import { ALL_CHANNELS } from '@pms/booking-crm/constants/channelGroups';
import {
  getChannelProfileUrl,
  getMediaSocialAriaLabel,
  SOCIAL_ARIA_LABELS,
  type MediaSocialGridItem,
} from '@/constants/socialProfiles';

/**
 * Media page carousel order: most → least used for this brand (B2B professional + syndication).
 * Unknown channel ids (new in ALL_CHANNELS) sort after this list, alphabetically by label.
 */
/** Omitted from public /media “Digital Presence” carousel (still in dashboard CTA channels). */
export const MEDIA_SOCIAL_GRID_PUBLIC_EXCLUDED_IDS = new Set<string>([
  'website',
  'google-search',
  'apple-podcasts',
  'youtube-search',
  'webinar',
  'podcast-directories',
  'whatsapp',
  'bing-search',
  'rss-feeds',
  'google-podcasts',
  'ai-visibility',
  'amazon-audible',
  'content-aggregators',
  'api-ai-fed',
]);

/** Public carousel order: most → least used (excludes {@link MEDIA_SOCIAL_GRID_PUBLIC_EXCLUDED_IDS}). */
export const MEDIA_SOCIAL_GRID_USAGE_ORDER = [
  'linkedin',
  'youtube',
  'medium',
  'substack',
  'twitter',
  'instagram',
  'facebook',
  'email',
  'spotify',
  'tiktok',
  'beehiiv',
  'quora',
  'reddit',
  'telegram',
  'threads',
  'bluesky',
  'pinterest',
  'hashnode',
  'ghost',
  'notion-public',
  'discord',
  'vimeo',
  'soundcloud',
  'podbean',
  'snapchat',
  'mastodon',
  'slack',
] as const;

const USAGE_ORDER_INDEX = new Map<string, number>(
  MEDIA_SOCIAL_GRID_USAGE_ORDER.map((id, index) => [id, index]),
);

function usageSortIndex(channelId: string): number {
  return USAGE_ORDER_INDEX.get(channelId) ?? Number.MAX_SAFE_INTEGER;
}

function channelAriaLabel(channelId: string, label: string): string {
  if (channelId === 'linkedin') return SOCIAL_ARIA_LABELS.linkedin;
  if (channelId === 'twitter') return SOCIAL_ARIA_LABELS.x;
  return getMediaSocialAriaLabel(label) ?? `${label} — Sheikh M. Abdullah`;
}

function compareByUsageThenName(a: MediaSocialGridItem, b: MediaSocialGridItem): number {
  const orderDiff =
    usageSortIndex(a.channelId ?? '') - usageSortIndex(b.channelId ?? '');
  if (orderDiff !== 0) return orderDiff;
  return a.name.localeCompare(b.name);
}

/**
 * Full Digital Presence grid — one card per CTA Management channel (41 platforms).
 * URLs from {@link getChannelProfileUrl}; icons match dashboard channel definitions.
 */
export function buildCtaChannelsMediaSocialGrid(): MediaSocialGridItem[] {
  return ALL_CHANNELS.map((channel) => ({
    channelId: channel.id,
    name: channel.label,
    url: getChannelProfileUrl(channel.id),
    iconFamily: 'platform' as const,
    platformIcon: channel.icon ?? 'Share2',
    ariaLabel: channelAriaLabel(channel.id, channel.label),
  })).sort(compareByUsageThenName);
}

/** Public Media page grid — syndication platforms only (excludes owned site card). */
export function filterPublicMediaSocialGrid(items: MediaSocialGridItem[]): MediaSocialGridItem[] {
  return items.filter(
    (item) => !item.channelId || !MEDIA_SOCIAL_GRID_PUBLIC_EXCLUDED_IDS.has(item.channelId),
  );
}

export const CTA_CHANNEL_COUNT = ALL_CHANNELS.length;
