/**
 * Keyword Plan SEO URL → hub soft landers (70 workbook rows).
 * KEEP rows are live pages. All others soft-rewrite to hubs via middleware
 * (pretty slug stays in the address bar; canonical remains the hub).
 * Destination hubs show KeywordLeadPopup when arrival cookie/header/`?from=` is present.
 */

export type KeywordIntent =
  | 'Commercial'
  | 'Transactional'
  | 'Informational'
  | 'Lead Magnet'
  | 'B2B Transactional'
  | 'B2B Commercial'
  | 'Commercial Investigation'
  | 'Commercial + Transactional';

export type KeywordRedirectRow = {
  source: string;
  destination: string;
  contentType: string;
  intent: KeywordIntent;
  keyword: string;
  /** Live page - do not 301 away */
  keep?: boolean;
};

export const KEYWORD_LEAD_HUB_PATHS = [
  '/certifications/pmp',
  '/certifications',
  '/pm-service',
  '/pmp-mock-exam',
  '/pmp-study-plan-2026',
] as const;

export type KeywordLeadHubPath = (typeof KEYWORD_LEAD_HUB_PATHS)[number];

export const KEYWORD_REDIRECT_ROWS: readonly KeywordRedirectRow[] = [
  {
    source: '/pmp-certification-uae',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Commercial',
    keyword: 'pmp certification uae',
  },
  {
    source: '/online-pmp-course',
    destination: '/certifications/pmp',
    contentType: 'Online course page',
    intent: 'Transactional',
    keyword: 'online pmp course',
  },
  {
    source: '/pmp-training-uae',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Transactional',
    keyword: 'pmp training uae',
  },
  {
    source: '/pmp-training-egypt',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Transactional',
    keyword: 'pmp training egypt',
  },
  {
    source: '/online-pmp-certification-course',
    destination: '/certifications/pmp',
    contentType: 'Online course page',
    intent: 'Transactional',
    keyword: 'online pmp certification course',
  },
  {
    source: '/how-to-get-pmp-certification',
    destination: '/certifications/pmp',
    contentType: 'Guide',
    intent: 'Informational',
    keyword: 'how to get pmp certification',
  },
  {
    source: '/pmp-certification-saudi-arabia',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Commercial',
    keyword: 'pmp certification saudi arabia',
  },
  {
    source: '/pmp-certification-egypt',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Commercial',
    keyword: 'pmp certification egypt',
  },
  {
    source: '/pmp-course-egypt',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Transactional',
    keyword: 'pmp course egypt',
  },
  {
    source: '/pmp-training-saudi-arabia',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Transactional',
    keyword: 'pmp training saudi arabia',
  },
  {
    source: '/pmp-exam-prep-course',
    destination: '/certifications/pmp',
    contentType: 'Exam prep page',
    intent: 'Transactional',
    keyword: 'pmp exam prep course',
  },
  {
    source: '/pmp-exam-preparation',
    destination: '/certifications/pmp',
    contentType: 'Exam prep page',
    intent: 'Transactional',
    keyword: 'pmp exam preparation',
  },
  {
    source: '/pmp-syllabus',
    destination: '/certifications/pmp',
    contentType: 'Blog/FAQ',
    intent: 'Informational',
    keyword: 'pmp syllabus',
  },
  {
    source: '/scrum-master-certification-training',
    destination: '/certifications',
    contentType: 'Course page',
    intent: 'Transactional',
    keyword: 'scrum master certification training',
  },
  {
    source: '/project-management-course-uae',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Transactional',
    keyword: 'project management course uae',
  },
  {
    source: '/pmp-course-saudi-arabia',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Transactional',
    keyword: 'pmp course saudi arabia',
  },
  {
    source: '/pmp-course-uae',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Transactional',
    keyword: 'pmp course uae',
  },
  {
    source: '/pmp-mock-exam',
    destination: '/pmp-mock-exam',
    contentType: 'Lead magnet page',
    intent: 'Lead Magnet',
    keyword: 'pmp mock exam',
    keep: true,
  },
  {
    source: '/pmp-practice-questions',
    destination: '/pmp-mock-exam',
    contentType: 'Lead magnet/blog',
    intent: 'Lead Magnet',
    keyword: 'pmp practice questions',
  },
  {
    source: '/pmp-eligibility-requirements',
    destination: '/certifications/pmp',
    contentType: 'Blog/FAQ',
    intent: 'Informational',
    keyword: 'pmp eligibility requirements',
  },
  {
    source: '/corporate-project-management-training',
    destination: '/pm-service',
    contentType: 'Corporate service page',
    intent: 'B2B Transactional',
    keyword: 'corporate project management training',
  },
  {
    source: '/project-management-course-egypt',
    destination: '/certifications/pmp',
    contentType: 'Course page',
    intent: 'Transactional',
    keyword: 'project management course egypt',
  },
  {
    source: '/pmp-study-plan',
    destination: '/pmp-study-plan-2026',
    contentType: 'Blog',
    intent: 'Informational',
    keyword: 'pmp study plan',
  },
  {
    source: '/primavera-p6-training',
    destination: '/certifications',
    contentType: 'Course page',
    intent: 'Transactional',
    keyword: 'primavera p6 training',
  },
  {
    source: '/pmp-bootcamp',
    destination: '/certifications/pmp',
    contentType: 'Bootcamp page',
    intent: 'Transactional',
    keyword: 'pmp bootcamp',
  },
  {
    source: '/agile-project-management-course',
    destination: '/certifications',
    contentType: 'Course page',
    intent: 'Transactional',
    keyword: 'agile project management course',
  },
  {
    source: '/microsoft-project-training',
    destination: '/certifications',
    contentType: 'Course page',
    intent: 'Transactional',
    keyword: 'microsoft project training',
  },
  {
    source: '/pmp-exam-dates-2026',
    destination: '/certifications/pmp',
    contentType: 'Blog/FAQ',
    intent: 'Informational',
    keyword: 'pmp exam dates 2026',
  },
  {
    source: '/pmp-training-qatar',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Transactional',
    keyword: 'pmp training qatar',
  },
  {
    source: '/pmp-certification-cost-egypt',
    destination: '/certifications/pmp',
    contentType: 'FAQ/blog',
    intent: 'Commercial Investigation',
    keyword: 'pmp certification cost egypt',
  },
  {
    source: '/pmp-certification-cost-uae',
    destination: '/certifications/pmp',
    contentType: 'FAQ/blog',
    intent: 'Commercial Investigation',
    keyword: 'pmp certification cost uae',
  },
  {
    source: '/project-management-training-for-companies',
    destination: '/pm-service',
    contentType: 'Corporate service',
    intent: 'B2B Transactional',
    keyword: 'project management training for companies',
  },
  {
    source: '/pmp-certification-qatar',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Commercial',
    keyword: 'pmp certification qatar',
  },
  {
    source: '/pmp-certification-online-egypt',
    destination: '/certifications/pmp',
    contentType: 'Online page',
    intent: 'Transactional',
    keyword: 'pmp certification online egypt',
  },
  {
    source: '/pmp-exam-fees-egypt',
    destination: '/certifications/pmp',
    contentType: 'FAQ/blog',
    intent: 'Commercial Investigation',
    keyword: 'pmp exam fees egypt',
  },
  {
    source: '/pmp-certification-cost-saudi-arabia',
    destination: '/certifications/pmp',
    contentType: 'FAQ/blog',
    intent: 'Commercial Investigation',
    keyword: 'pmp certification cost saudi arabia',
  },
  {
    source: '/pmp-exam-fees-uae',
    destination: '/certifications/pmp',
    contentType: 'FAQ/blog',
    intent: 'Commercial Investigation',
    keyword: 'pmp exam fees uae',
  },
  {
    source: '/risk-management-course',
    destination: '/certifications',
    contentType: 'Course page',
    intent: 'Transactional',
    keyword: 'risk management course',
  },
  {
    source: '/pmp-course-qatar',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Transactional',
    keyword: 'pmp course qatar',
  },
  {
    source: '/pmp-training-oman',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Transactional',
    keyword: 'pmp training oman',
  },
  {
    source: '/corporate-pmp-training',
    destination: '/pm-service',
    contentType: 'Corporate service',
    intent: 'B2B Transactional',
    keyword: 'corporate pmp training',
  },
  {
    source: '/pmp-exam-fees-saudi-arabia',
    destination: '/certifications/pmp',
    contentType: 'FAQ/blog',
    intent: 'Commercial Investigation',
    keyword: 'pmp exam fees saudi arabia',
  },
  {
    source: '/pmp-training-online-uae',
    destination: '/certifications/pmp',
    contentType: 'Online course page',
    intent: 'Transactional',
    keyword: 'pmp training online uae',
  },
  {
    source: '/pmp-for-project-managers',
    destination: '/certifications/pmp',
    contentType: 'Segment page',
    intent: 'Commercial',
    keyword: 'pmp for project managers',
  },
  {
    source: '/pmp-renewal-pdu-courses',
    destination: '/certifications',
    contentType: 'PDU page',
    intent: 'Transactional',
    keyword: 'pmp renewal pdu courses',
  },
  {
    source: '/project-management-certification-saudi-arabia',
    destination: '/certifications/pmp',
    contentType: 'Course page',
    intent: 'Commercial',
    keyword: 'project management certification saudi arabia',
  },
  {
    source: '/pmp-certification-requirements-uae',
    destination: '/certifications/pmp',
    contentType: 'FAQ/blog',
    intent: 'Informational',
    keyword: 'pmp certification requirements uae',
  },
  {
    source: '/pmp-course-oman',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Transactional',
    keyword: 'pmp course oman',
  },
  {
    source: '/pmp-certification-oman',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Commercial',
    keyword: 'pmp certification oman',
  },
  {
    source: '/pmp-training-online-saudi-arabia',
    destination: '/certifications/pmp',
    contentType: 'Online page',
    intent: 'Transactional',
    keyword: 'pmp training online saudi arabia',
  },
  {
    source: '/pmp-course-fees-uae',
    destination: '/certifications/pmp',
    contentType: 'FAQ/blog',
    intent: 'Commercial Investigation',
    keyword: 'pmp course fees uae',
  },
  {
    source: '/pdu-courses-for-pmp',
    destination: '/certifications',
    contentType: 'PDU page',
    intent: 'Transactional',
    keyword: 'pdu courses for pmp',
  },
  {
    source: '/pmp-certification-for-engineers',
    destination: '/certifications/pmp',
    contentType: 'Blog/segment page',
    intent: 'Commercial',
    keyword: 'pmp certification for engineers',
  },
  {
    source: '/project-management-workshops',
    destination: '/pm-service',
    contentType: 'Corporate service',
    intent: 'B2B Commercial',
    keyword: 'project management workshops',
  },
  {
    source: '/pmp-certification-kuwait',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Commercial',
    keyword: 'pmp certification kuwait',
  },
  {
    source: '/pmp-certification-requirements-saudi-arabia',
    destination: '/certifications/pmp',
    contentType: 'FAQ/blog',
    intent: 'Informational',
    keyword: 'pmp certification requirements saudi arabia',
  },
  {
    source: '/pmp-classes-uae',
    destination: '/certifications/pmp',
    contentType: 'Country page',
    intent: 'Transactional',
    keyword: 'pmp classes uae',
  },
  {
    source: '/pmp-course-fees-in-saudi-arabia',
    destination: '/certifications/pmp',
    contentType: 'FAQ/blog',
    intent: 'Commercial Investigation',
    keyword: 'pmp course fees in saudi arabia',
  },
  {
    source: '/pmp-training-kuwait',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Transactional',
    keyword: 'pmp training kuwait',
  },
  {
    source: '/project-management-course-qatar',
    destination: '/certifications/pmp',
    contentType: 'Course page',
    intent: 'Transactional',
    keyword: 'project management course qatar',
  },
  {
    source: '/project-management-professional-certification-uae',
    destination: '/certifications/pmp',
    contentType: 'Course page',
    intent: 'Commercial',
    keyword: 'project management professional certification uae',
  },
  {
    source: '/best-pmp-training-institute-uae',
    destination: '/certifications/pmp',
    contentType: 'Comparison page',
    intent: 'Commercial Investigation',
    keyword: 'best pmp training institute uae',
  },
  {
    source: '/pmp-certification-bahrain',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Commercial',
    keyword: 'pmp certification bahrain',
  },
  {
    source: '/pmp-certification-for-construction-professionals',
    destination: '/certifications/pmp',
    contentType: 'Industry page',
    intent: 'Commercial',
    keyword: 'pmp certification for construction professionals',
  },
  {
    source: '/pmp-certification-cost-qatar',
    destination: '/certifications/pmp',
    contentType: 'FAQ/blog',
    intent: 'Commercial Investigation',
    keyword: 'pmp certification cost qatar',
  },
  {
    source: '/pmp-training-bahrain',
    destination: '/certifications/pmp',
    contentType: 'Course landing page',
    intent: 'Transactional',
    keyword: 'pmp training bahrain',
  },
  {
    source: '/project-management-course-oman',
    destination: '/certifications/pmp',
    contentType: 'Course page',
    intent: 'Transactional',
    keyword: 'project management course oman',
  },
  {
    source: '/pmp-certification-cost-oman',
    destination: '/certifications/pmp',
    contentType: 'FAQ/blog',
    intent: 'Commercial Investigation',
    keyword: 'pmp certification cost oman',
  },
  {
    source: '/pmp-exam-fees-qatar',
    destination: '/certifications/pmp',
    contentType: 'FAQ/blog',
    intent: 'Commercial Investigation',
    keyword: 'pmp exam fees qatar',
  },
  {
    source: '/all-courses',
    destination: '/certifications',
    contentType: 'All courses / course hub page',
    intent: 'Commercial + Transactional',
    keyword: 'project management courses',
  },
] as const;

/** Ads / legacy aliases that are not in the 70-row Keyword Plan but soft-rewrite to hubs. */
export const KEYWORD_ALIAS_REDIRECT_ROWS: readonly KeywordRedirectRow[] = [
  {
    source: '/project-management-services',
    destination: '/pm-service',
    contentType: 'Legacy services slug',
    intent: 'B2B Transactional',
    keyword: 'project management services',
  },
  {
    source: '/pmp-certification-training',
    destination: '/certifications/pmp',
    contentType: 'Ads landing alias',
    intent: 'Transactional',
    keyword: 'pmp certification training',
  },
  {
    source: '/corporate-training',
    destination: '/pm-service',
    contentType: 'Ads landing alias',
    intent: 'B2B Transactional',
    keyword: 'corporate training',
  },
] as const;

const ALL_REDIRECT_ROWS: readonly KeywordRedirectRow[] = [
  ...KEYWORD_REDIRECT_ROWS,
  ...KEYWORD_ALIAS_REDIRECT_ROWS,
];

const BY_SOURCE = new Map(ALL_REDIRECT_ROWS.map((row) => [row.source, row]));
const BY_FROM_SLUG = new Map(
  ALL_REDIRECT_ROWS.map((row) => [row.source.replace(/^\//, ''), row]),
);

export function getKeywordRedirectRowBySource(path: string): KeywordRedirectRow | undefined {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return BY_SOURCE.get(normalized);
}

export function getKeywordRedirectRowByFromSlug(slug: string): KeywordRedirectRow | undefined {
  return BY_FROM_SLUG.get(slug.replace(/^\//, ''));
}

/**
 * Hard 301s for next.config - intentionally empty.
 * Soft landers are handled by middleware rewrites (see getKeywordSeoRewrites).
 */
export function getKeywordSeoRedirects(): Array<{
  source: string;
  destination: string;
  permanent: true;
}> {
  return [];
}

/** Soft-rewrite map for middleware: keyword/alias source → hub (excludes KEEP). */
export function getKeywordSeoRewrites(): Array<{
  source: string;
  destination: string;
  slug: string;
}> {
  return ALL_REDIRECT_ROWS.filter((row) => !row.keep).map((row) => ({
    source: row.source,
    destination: row.destination.split('?')[0] || row.destination,
    slug: row.source.replace(/^\//, ''),
  }));
}

const KEYWORD_REWRITE_BY_SOURCE = new Map(
  getKeywordSeoRewrites().map((row) => [row.source, row]),
);

export function getKeywordRewriteByPath(pathname: string): {
  source: string;
  destination: string;
  slug: string;
} | undefined {
  const normalized = pathname.replace(/\/$/, '') || '/';
  const withSlash = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return KEYWORD_REWRITE_BY_SOURCE.get(withSlash);
}

/** Path → hub (no query) for indexation canonicalize targets. */
export function getKeywordRedirectPathMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const row of ALL_REDIRECT_ROWS) {
    if (row.keep) continue;
    map[row.source] = row.destination.split('?')[0] || row.destination;
  }
  return map;
}

/** Alias for soft-lander canonicalize map (same paths as redirect map historically). */
export function getKeywordCanonicalizePathMap(): Record<string, string> {
  return getKeywordRedirectPathMap();
}

export function isKeywordLeadHubPath(pathname: string): pathname is KeywordLeadHubPath {
  const path = pathname.split('?')[0]?.replace(/\/$/, '') || '/';
  return (KEYWORD_LEAD_HUB_PATHS as readonly string[]).includes(path);
}
