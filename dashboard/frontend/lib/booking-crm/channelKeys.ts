/** Platform channel ids — keep in sync with X1 ALL_CHANNELS / Section 28 catalog. */
export const BOOKING_CRM_CHANNEL_IDS = [
  'website',
  'webinar',
  'medium',
  'substack',
  'beehiiv',
  'ghost',
  'hashnode',
  'notion-public',
  'linkedin',
  'twitter',
  'instagram',
  'facebook',
  'reddit',
  'threads',
  'quora',
  'bluesky',
  'mastodon',
  'pinterest',
  'vk',
  'youtube',
  'tiktok',
  'snapchat',
  'vimeo',
  'spotify',
  'apple-podcasts',
  'amazon-audible',
  'google-podcasts',
  'podbean',
  'soundcloud',
  'email',
  'whatsapp',
  'telegram',
  'discord',
  'slack',
  'google-search',
  'youtube-search',
  'podcast-directories',
  'bing-search',
  'ai-visibility',
  'rss-feeds',
  'content-aggregators',
  'api-ai-fed',
] as const;

const CHANNEL_ID_SET = new Set<string>(BOOKING_CRM_CHANNEL_IDS);

/** Legacy type/slug keys → platform channel id (minimal set; extend when porting ctaPlatformButtons). */
const LEGACY_CHANNEL_ALIASES: Record<string, string> = {
  x: 'twitter',
  notion: 'notion-public',
};

export function resolveChannelIdFromLegacyKey(key: string): string | null {
  const trimmed = key.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  if (CHANNEL_ID_SET.has(lower)) return lower;
  if (LEGACY_CHANNEL_ALIASES[lower]) return LEGACY_CHANNEL_ALIASES[lower];
  return null;
}
