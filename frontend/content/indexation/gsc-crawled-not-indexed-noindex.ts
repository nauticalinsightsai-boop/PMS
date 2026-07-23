/**
 * Paths from GSC “Crawled – currently not indexed” (2026-07-24 drilldown)
 * that should emit noindex,nofollow and stay out of the XML sitemap.
 *
 * Marketing hubs / P0 commercial URLs from the same export are intentionally
 * kept indexable (request indexing instead of hiding them).
 */
export const GSC_CRAWLED_NOT_INDEXED_NOINDEX_PATHS = [
  '/answers/should-i-prepare-for-new-pmp-after-9-july-2026',
  '/answers/should-i-take-pmp-before-8-july-2026',
  '/answers/what-is-lean-six-sigma-green-belt',
  '/answers/what-is-the-pmp-exam-content-outline',
  '/certifications/gpm-b',
  '/certifications/lss-black',
  '/certifications/lss-white',
  '/certifications/p3o',
  '/certifications/pfmp',
  '/certifications/pmi-acp',
  '/certifications/pmi-rmp',
  '/certifications/prince2',
  '/go/beehiiv',
  '/go/facebook',
  '/go/google-search',
  '/go/hashnode',
  '/go/slack',
  '/go/tiktok',
  '/go/youtube',
  '/go/youtube-search',
  '/legal/ai',
  '/legal/complaints',
  '/legal/marketing',
  '/legal/privacy/gcc/bh',
  '/legal/privacy/gcc/kw',
  '/legal/subprocessors',
  '/newsletter/2026-pmp-exam-changes',
  '/newsletter/building-high-performance-pmo',
  '/newsletter/hybrid-methodologies-enterprise',
  '/pmp-business-environment-domain',
  '/pmp-mock-exam',
  '/pmp-readiness-diagnostic',
  '/pmp-study-plan-2026',
  '/topics/ai-in-project-management',
  '/topics/hybrid-project-management',
] as const;

export const GSC_CRAWLED_NOT_INDEXED_NOINDEX_PATH_SET = new Set<string>(
  GSC_CRAWLED_NOT_INDEXED_NOINDEX_PATHS,
);

export function isGscSoftNoindexPath(path: string): boolean {
  return GSC_CRAWLED_NOT_INDEXED_NOINDEX_PATH_SET.has(path);
}
