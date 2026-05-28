import { ALL_CHANNEL_TYPES } from '../constants/channelTypes';
import { CHANNEL_PUBLIC_SLUG, slugifyChannelKey } from '../types/channelLandingPage';
import { getPublishedPortalSitemapPaths } from './portalSitemap';

export type GoSlugRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

/** Legacy per-type slugs and storage-key aliases → canonical `/go/{channel}` slug. */
export function buildLegacyGoSlugRedirects(): GoSlugRedirect[] {
  const redirects: GoSlugRedirect[] = [];
  const seen = new Set<string>();

  const add = (from: string, to: string) => {
    const fromSlug = slugifyChannelKey(from);
    const toSlug = slugifyChannelKey(to);
    if (!fromSlug || !toSlug || fromSlug === toSlug) return;
    const key = `${fromSlug}→${toSlug}`;
    if (seen.has(key)) return;
    seen.add(key);
    redirects.push({
      source: `/go/${fromSlug}`,
      destination: `/go/${toSlug}`,
      permanent: true,
    });
  };

  for (const ct of ALL_CHANNEL_TYPES) {
    add(ct.id, ct.channelId);
  }

  for (const [channelId, publicSlug] of Object.entries(CHANNEL_PUBLIC_SLUG)) {
    add(channelId, publicSlug);
  }

  return redirects;
}

export function getPublishedGoChannelSlugs(): string[] {
  return getPublishedPortalSitemapPaths().map((p) => p.replace(/^\/go\//, ''));
}
