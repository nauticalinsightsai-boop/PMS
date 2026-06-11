/**
 * Custom PNG marks for /go/{slug} portal channels.
 * Files live in frontend/public/images/logo/ (served as /images/logo/*).
 */

export const CHANNEL_MARK_ASSET_VERSION = '1';

export type ChannelMarkFileSpec =
  | { kind: 'brand' }
  | { kind: 'single'; fileBase: string }
  | { kind: 'light-dark'; fileBase: string };

/** Channels with a custom PNG (or owned brand mark). Others use Lucide via PlatformChannelIcon. */
export const CHANNEL_MARK_FILES: Record<string, ChannelMarkFileSpec> = {
  website: { kind: 'brand' },
  medium: { kind: 'light-dark', fileBase: 'medium' },
  substack: { kind: 'single', fileBase: 'substack' },
  beehiiv: { kind: 'light-dark', fileBase: 'beehiiv' },
  hashnode: { kind: 'single', fileBase: 'hashnode' },
  'notion-public': { kind: 'light-dark', fileBase: 'notion' },
  linkedin: { kind: 'single', fileBase: 'linkedin' },
  twitter: { kind: 'light-dark', fileBase: 'x' },
  instagram: { kind: 'single', fileBase: 'instagram' },
  reddit: { kind: 'single', fileBase: 'reddit' },
  quora: { kind: 'single', fileBase: 'quora' },
  bluesky: { kind: 'single', fileBase: 'bluesky' },
  mastodon: { kind: 'single', fileBase: 'mastodon' },
  pinterest: { kind: 'single', fileBase: 'pinterest' },
  vk: { kind: 'single', fileBase: 'vk' },
  tiktok: { kind: 'single', fileBase: 'tiktok' },
  snapchat: { kind: 'single', fileBase: 'snapchat' },
  vimeo: { kind: 'single', fileBase: 'vimeo' },
  spotify: { kind: 'single', fileBase: 'spotify' },
  'apple-podcasts': { kind: 'single', fileBase: 'apple-podcasts' },
  'amazon-audible': { kind: 'single', fileBase: 'amazon-audible' },
  'google-podcasts': { kind: 'single', fileBase: 'google-podcasts' },
  podbean: { kind: 'single', fileBase: 'podbean' },
  soundcloud: { kind: 'single', fileBase: 'soundcloud' },
  whatsapp: { kind: 'single', fileBase: 'whatsapp' },
  telegram: { kind: 'single', fileBase: 'telegram' },
  discord: { kind: 'single', fileBase: 'discord' },
  slack: { kind: 'single', fileBase: 'slack' },
  'google-search': { kind: 'single', fileBase: 'google-search' },
  'bing-search': { kind: 'single', fileBase: 'bing-search' },
  'ai-visibility': { kind: 'single', fileBase: 'ai-visibility' },
  'api-ai-fed': { kind: 'light-dark', fileBase: 'api-ai-fed' },
};

const BRAND_MARK_PATHS = {
  light: '/brand/pms-icon.png',
  dark: '/brand/pms-icon-dark.png',
} as const;

export function hasChannelMark(channelId: string): boolean {
  return Boolean(CHANNEL_MARK_FILES[channelId]);
}

export function getChannelMarkPath(
  channelId: string,
  colorScheme: 'light' | 'dark' = 'light',
): string | null {
  const spec = CHANNEL_MARK_FILES[channelId];
  if (!spec) return null;

  if (spec.kind === 'brand') {
    const path = colorScheme === 'dark' ? BRAND_MARK_PATHS.dark : BRAND_MARK_PATHS.light;
    return `${path}?v=${CHANNEL_MARK_ASSET_VERSION}`;
  }

  const suffix =
    spec.kind === 'light-dark'
      ? colorScheme === 'dark'
        ? '-mark-dark'
        : '-mark-light'
      : '-mark';

  return `/images/logo/${spec.fileBase}${suffix}.png?v=${CHANNEL_MARK_ASSET_VERSION}`;
}
