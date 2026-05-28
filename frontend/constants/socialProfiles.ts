/**
 * Social profile URLs and footer/media grids — derived from @/config/site.
 */
import {
  SITE_BRAND_ECOSYSTEM,
  SITE_CANONICAL_ORIGIN,
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_MAILTO,
  SITE_DISPLAY_NAME,
  SITE_EMAIL_DOMAIN,
  SITE_HANDLE,
  SITE_LEGACY_BRAND_ORIGIN,
  SITE_ORGANIZATION_SAME_AS,
  SITE_SOCIAL_PROFILE_URLS,
  SITE_USERNAME,
} from '@/config/site';

/** Syndication + social — single grid on Media (Digital Presence & Syndication). */
export type MediaSocialGridItem =
  | {
      name: string;
      url: string;
      ariaLabel?: string;
      channelId?: string;
      iconFamily: 'platform';
      platformIcon: string;
    }
  | {
      name: string;
      url: string;
      ariaLabel?: string;
      channelId?: string;
      iconFamily: 'lucide';
      lucideIcon: 'linkedin' | 'file-text' | 'mail' | 'youtube' | 'video';
    }
  | {
      name: string;
      url: string;
      ariaLabel?: string;
      channelId?: string;
      iconFamily: 'fa';
      faIcon: 'facebook' | 'x' | 'instagram' | 'pinterest';
    };

/** @deprecated Prefer SITE_USERNAME from @/config/site */
export const SOCIAL_HANDLE = SITE_USERNAME;

/** Canonical site origin (SEO, sitemap, redirects). */
export const SITE_ORIGIN = SITE_CANONICAL_ORIGIN;

/** Legacy public brand domain (redirects to canonical). */
export const PUBLIC_BRAND_ORIGIN = SITE_LEGACY_BRAND_ORIGIN;

export const BRAND_EMAIL_DOMAIN = SITE_EMAIL_DOMAIN;

export const CONTACT_EMAIL = SITE_CONTACT_EMAIL;

export const CONTACT_MAILTO = SITE_CONTACT_MAILTO;

const h = SITE_USERNAME;

const LEGACY_SOCIAL_HANDLE = 'sheikhmabdullah';

/** Named platform profile URLs (Media grid, site footer, Contact). */
export const SOCIAL_PROFILE_URLS = SITE_SOCIAL_PROFILE_URLS;

/** Accessible labels for primary public profiles. */
export const SOCIAL_ARIA_LABELS = {
  linkedin: 'LinkedIn profile of Sheikh M. Abdullah',
  x: 'X profile of Sheikh M. Abdullah',
} as const;

/** Primary verified profiles surfaced in contact and profile sections. */
export const PRIMARY_SOCIAL_PROFILES = [
  {
    id: 'linkedin' as const,
    label: 'LinkedIn',
    url: SOCIAL_PROFILE_URLS.linkedin,
    displayHandle: `/in/${SITE_USERNAME}`,
    ariaLabel: SOCIAL_ARIA_LABELS.linkedin,
  },
  {
    id: 'x' as const,
    label: 'X',
    url: SOCIAL_PROFILE_URLS.x,
    displayHandle: SITE_HANDLE,
    ariaLabel: SOCIAL_ARIA_LABELS.x,
  },
] as const;

export function getMediaSocialAriaLabel(name: string): string | undefined {
  const normalized = name.trim().toLowerCase();
  if (normalized === 'linkedin') return SOCIAL_ARIA_LABELS.linkedin;
  if (normalized === 'x' || normalized === 'x (twitter)' || normalized === 'twitter') {
    return SOCIAL_ARIA_LABELS.x;
  }
  return undefined;
}

/** Default Media page + portal footer syndication grid. */
export const MEDIA_SOCIAL_GRID: MediaSocialGridItem[] = [
  { name: 'LinkedIn', url: SOCIAL_PROFILE_URLS.linkedin, iconFamily: 'lucide', lucideIcon: 'linkedin', ariaLabel: SOCIAL_ARIA_LABELS.linkedin },
  { name: 'Medium', url: SOCIAL_PROFILE_URLS.medium, iconFamily: 'lucide', lucideIcon: 'file-text' },
  { name: 'Substack', url: SOCIAL_PROFILE_URLS.substack, iconFamily: 'lucide', lucideIcon: 'mail' },
  { name: 'YouTube', url: SOCIAL_PROFILE_URLS.youtube, iconFamily: 'lucide', lucideIcon: 'youtube' },
  { name: 'TikTok', url: SOCIAL_PROFILE_URLS.tiktok, iconFamily: 'lucide', lucideIcon: 'video' },
  { name: 'Facebook', url: SOCIAL_PROFILE_URLS.facebook, iconFamily: 'fa', faIcon: 'facebook' },
  { name: 'X', url: SOCIAL_PROFILE_URLS.x, iconFamily: 'fa', faIcon: 'x', ariaLabel: SOCIAL_ARIA_LABELS.x },
  { name: 'Instagram', url: SOCIAL_PROFILE_URLS.instagram, iconFamily: 'fa', faIcon: 'instagram' },
  { name: 'Pinterest', url: SOCIAL_PROFILE_URLS.pinterest, iconFamily: 'fa', faIcon: 'pinterest' },
];

/** Site-wide footer icon row (main Layout). */
export const FOOTER_SOCIAL_LINKS = [
  { id: 'linkedin' as const, url: SOCIAL_PROFILE_URLS.linkedin, ariaLabel: SOCIAL_ARIA_LABELS.linkedin },
  { id: 'x' as const, url: SOCIAL_PROFILE_URLS.x, ariaLabel: SOCIAL_ARIA_LABELS.x },
  { id: 'facebook' as const, url: SOCIAL_PROFILE_URLS.facebook, ariaLabel: 'Facebook profile of Sheikh M. Abdullah' },
  { id: 'instagram' as const, url: SOCIAL_PROFILE_URLS.instagram, ariaLabel: 'Instagram profile of Sheikh M. Abdullah' },
];

/** SEO schema.org sameAs */
export const ORGANIZATION_SAME_AS = [...SITE_ORGANIZATION_SAME_AS];

export { SITE_BRAND_ECOSYSTEM, SITE_DISPLAY_NAME, SITE_HANDLE };

/** Rewrite old CMS/localStorage URLs that still use the legacy social handle. */
export function normalizeSocialProfileUrl(url: string): string {
  if (!url || typeof url !== 'string') return url;
  let next = url;
  const legacy = LEGACY_SOCIAL_HANDLE;
  if (!next.toLowerCase().includes(legacy)) return next;

  next = next
    .replace(new RegExp(`/in/${legacy}(?=/|$|\\?)`, 'gi'), `/in/${h}`)
    .replace(new RegExp(`/@${legacy}(?=/|$|\\?)`, 'gi'), `@${h}`)
    .replace(new RegExp(`facebook\\.com/${legacy}`, 'gi'), `facebook.com/${h}`)
    .replace(new RegExp(`instagram\\.com/${legacy}`, 'gi'), `instagram.com/${h}`)
    .replace(new RegExp(`pinterest\\.com/${legacy}`, 'gi'), `pinterest.com/${h}`)
    .replace(new RegExp(`x\\.com/${legacy}`, 'gi'), `x.com/${h}`)
    .replace(new RegExp(`twitter\\.com/${legacy}`, 'gi'), `x.com/${h}`)
    .replace(new RegExp(`tiktok\\.com/@${legacy}`, 'gi'), `tiktok.com/@${h}`)
    .replace(new RegExp(`youtube\\.com/@${legacy}`, 'gi'), `youtube.com/@${h}`)
    .replace(new RegExp(`${legacy}\\.substack\\.com`, 'gi'), `${h}.substack.com`);

  return next;
}

export {
  normalizeMediaSocialGrid,
  resolveMediaSocialGrid,
} from '@/lib/media/media-social-grid';

/** Channel id → public profile or brand site fallback (all /go/* presence strip links). */
export const CHANNEL_PROFILE_URLS: Record<string, string> = {
  website: SITE_CANONICAL_ORIGIN,
  webinar: SITE_CANONICAL_ORIGIN,

  medium: SOCIAL_PROFILE_URLS.medium,
  substack: SOCIAL_PROFILE_URLS.substack,
  beehiiv: `https://www.beehiiv.com/@${h}`,
  ghost: SITE_CANONICAL_ORIGIN,
  hashnode: `https://hashnode.com/@${h}`,
  'notion-public': SITE_CANONICAL_ORIGIN,

  linkedin: SOCIAL_PROFILE_URLS.linkedin,
  twitter: SOCIAL_PROFILE_URLS.x,
  instagram: SOCIAL_PROFILE_URLS.instagram,
  facebook: SOCIAL_PROFILE_URLS.facebook,
  reddit: `https://www.reddit.com/user/${h}`,
  threads: `https://www.threads.net/@${h}`,
  quora: `https://www.quora.com/profile/${h}`,
  bluesky: `https://bsky.app/profile/${h}.bsky.social`,
  mastodon: SITE_CANONICAL_ORIGIN,
  pinterest: SOCIAL_PROFILE_URLS.pinterest,
  vk: `https://vk.com/${h}`,

  youtube: SOCIAL_PROFILE_URLS.youtube,
  tiktok: SOCIAL_PROFILE_URLS.tiktok,
  snapchat: `https://www.snapchat.com/add/${h}`,
  vimeo: `https://vimeo.com/${h}`,

  spotify: SITE_CANONICAL_ORIGIN,
  'apple-podcasts': SITE_CANONICAL_ORIGIN,
  'amazon-audible': SITE_CANONICAL_ORIGIN,
  'google-podcasts': SITE_CANONICAL_ORIGIN,
  podbean: SITE_CANONICAL_ORIGIN,
  soundcloud: `https://soundcloud.com/${h}`,

  email: CONTACT_MAILTO,
  whatsapp: SITE_CANONICAL_ORIGIN,
  telegram: SITE_CANONICAL_ORIGIN,
  discord: SITE_CANONICAL_ORIGIN,
  slack: SITE_CANONICAL_ORIGIN,

  'google-search': SITE_CANONICAL_ORIGIN,
  'youtube-search': SOCIAL_PROFILE_URLS.youtube,
  'podcast-directories': SITE_CANONICAL_ORIGIN,
  'bing-search': SITE_CANONICAL_ORIGIN,
  'ai-visibility': SITE_CANONICAL_ORIGIN,

  'rss-feeds': SITE_CANONICAL_ORIGIN,
  'content-aggregators': SITE_CANONICAL_ORIGIN,
  'api-ai-fed': SITE_CANONICAL_ORIGIN,
};

export function getChannelProfileUrl(channelId: string): string {
  return CHANNEL_PROFILE_URLS[channelId] ?? SITE_CANONICAL_ORIGIN;
}

export const DIGITAL_PRESENCE = [
  { name: 'LinkedIn', url: SOCIAL_PROFILE_URLS.linkedin, icon: 'linkedin' as const, ariaLabel: SOCIAL_ARIA_LABELS.linkedin },
  { name: 'Medium', url: SOCIAL_PROFILE_URLS.medium, icon: 'file-text' as const },
  { name: 'Substack', url: SOCIAL_PROFILE_URLS.substack, icon: 'mail' as const },
];
