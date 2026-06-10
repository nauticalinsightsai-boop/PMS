import type { MetadataRoute } from 'next';
import { PMS_SITE_URL } from '@/config/pms-site';
import { isIndexablePath, normalizePath } from '@/lib/indexing-metadata';
import { buildCanonicalPath } from '@/lib/canonical';

export { NOINDEX_PATH_PREFIXES, NOINDEX_PATH_PATTERNS } from '@/lib/indexing-metadata';

export function assertIndexable(path: string): void {
  if (!isIndexablePath(path)) {
    throw new Error(`Sitemap entry blocked for noindex path: ${path}`);
  }
}

export function buildSitemapEntry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'] = 'weekly',
): MetadataRoute.Sitemap[0] {
  const canonicalPath = buildCanonicalPath(path);
  assertIndexable(canonicalPath);
  return {
    url: `${PMS_SITE_URL}${canonicalPath}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export function filterIndexablePaths(paths: string[]): string[] {
  return paths.map(normalizePath).filter(isIndexablePath);
}
