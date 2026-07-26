import type { MetadataRoute } from 'next';
import { PMS_SITE_URL } from '@/config/pms-site';
import { isIndexablePath, normalizePath } from '@/lib/indexing-metadata';
import { buildCanonicalPath } from '@/lib/canonical';

export { NOINDEX_PATH_PREFIXES, NOINDEX_PATH_PATTERNS, NOINDEX_EXACT_PATHS } from '@/lib/indexing-metadata';

export function assertIndexable(path: string): void {
  if (!isIndexablePath(path)) {
    throw new Error(`Sitemap entry blocked for noindex path: ${path}`);
  }
}

export type SitemapLastModified = Date | string;

/**
 * Build a sitemap entry. Include `lastModified` only when a reliable page-specific
 * date exists; omit rather than inventing a build-time stamp.
 */
export function buildSitemapEntry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'] = 'weekly',
  lastModified?: SitemapLastModified,
): MetadataRoute.Sitemap[0] {
  const canonicalPath = buildCanonicalPath(path);
  assertIndexable(canonicalPath);
  const entry: MetadataRoute.Sitemap[0] = {
    url: `${PMS_SITE_URL}${canonicalPath}`,
    changeFrequency,
    priority,
  };
  if (lastModified != null && lastModified !== '') {
    const parsed = lastModified instanceof Date ? lastModified : new Date(lastModified);
    if (!Number.isNaN(parsed.getTime())) {
      entry.lastModified = parsed;
    }
  }
  return entry;
}

export function filterIndexablePaths(paths: string[]): string[] {
  return paths.map(normalizePath).filter(isIndexablePath);
}
