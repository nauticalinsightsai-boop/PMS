import { getAllChannelLandingPages } from './repository';
import { buildGoPagePath } from './shareUrl';

export function getPublishedPortalSitemapPaths(): string[] {
  const pages = getAllChannelLandingPages();
  const paths = new Set<string>();
  for (const page of Object.values(pages)) {
    if (page.status !== 'published') continue;
    const p = buildGoPagePath(page);
    if (p) paths.add(p);
  }
  return [...paths].sort();
}
