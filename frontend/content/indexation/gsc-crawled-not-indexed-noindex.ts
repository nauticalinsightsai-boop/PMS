/**
 * Paths from GSC "Crawled – currently not indexed"
 * (URL drilldown 2026-07-24; Coverage overview count still 49 on 2026-07-25)
 * that should emit noindex,nofollow and stay out of the XML sitemap.
 *
 * KEEP INDEXABLE (request indexing / strengthen - do not hide):
 * marketing hubs, P0 commercial URLs, /membership, /pm-service, /about,
 * /contact, /legal/privacy (trust),
 * /pmp-study-plan-2026 (P1 guide - removed from soft-noindex 2026-07-25).
 *
 * Soft-noindex = thin secondary content that wastes crawl budget when Google
 * already crawled and declined to index.
 */
export const GSC_CRAWLED_NOT_INDEXED_NOINDEX_PATHS = [
  '/answers/should-i-prepare-for-new-pmp-after-9-july-2026',
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
  '/legal',
  '/legal/ai',
  '/legal/complaints',
  '/legal/cookies',
  '/legal/marketing',
  '/legal/privacy/gcc/bh',
  '/legal/privacy/gcc/kw',
  '/legal/subprocessors',
  '/newsletter/2026-pmp-exam-changes',
  '/newsletter/ai-augmented-project-manager',
  '/newsletter/building-high-performance-pmo',
  '/newsletter/hybrid-methodologies-enterprise',
  '/newsletter/prince2-7th-edition-practitioner',
  '/newsletter/risk-beyond-probability-matrix',
  '/pmp-business-environment-domain',
  '/pmp-mock-exam',
  '/pmp-readiness-diagnostic',
  '/topics/ai-in-project-management',
  '/topics/hybrid-project-management',
] as const;

export const GSC_CRAWLED_NOT_INDEXED_NOINDEX_PATH_SET = new Set<string>(
  GSC_CRAWLED_NOT_INDEXED_NOINDEX_PATHS,
);

export function isGscSoftNoindexPath(path: string): boolean {
  return GSC_CRAWLED_NOT_INDEXED_NOINDEX_PATH_SET.has(path);
}
