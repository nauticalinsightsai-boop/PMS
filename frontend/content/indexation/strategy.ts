import { getPublishedGoChannelSlugs } from '@pms/booking-crm';
import { getPublishedAnswerPaths } from '@/content/answers';
import { DYNAMIC_LEGAL_SLUGS } from '@/content/legal/registry';
import { PRIVACY_REGION_OPTIONS, GCC_COUNTRY_SLUGS } from '@/content/legal';
import { PMP_COURSE_PATHS } from '@/content/pmp/courses';
import { PMP_CLUSTER_PATHS } from '@/content/pmp/pages';
import { PMP_SERVICE_PATHS } from '@/content/pmp/services';
import { getPublishedTopicPaths } from '@/content/topics';
import { getKeywordRedirectPathMap } from '@/content/seo/keyword-redirect-map';
import { PMS_SITE_URL } from '@/config/pms-site';
import { certifications } from '@/data/siteData';
import { isIndexablePath, normalizePath } from '@/lib/indexing-metadata';

export type IndexationDecision =
  | 'index'
  | 'noindex'
  | 'redirect'
  | 'merge'
  | 'canonicalize'
  | 'needs_review';

export type PageIndexationConfig = {
  path: string;
  pageType: string;
  decision: IndexationDecision;
  index: boolean;
  follow: boolean;
  includeInSitemap: boolean;
  canonicalPath?: string;
  redirectTarget?: string;
  mergeTarget?: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3' | 'Utility' | 'Owner';
  reason: string;
  dataSource: string;
  ownerApproval: string;
  implementationStatus: string;
  notes?: string;
};

export type IndexationStrategyRow = PageIndexationConfig & {
  url: string;
  currentStatus: string;
};

const MARKETING_HUB_PATHS = [
  '/',
  '/certifications',
  '/certifications/compare',
  '/answers',
  '/topics',
  '/faq',
  '/pmp-faq',
  '/community',
  '/membership',
  '/newsletter',
  '/pm-service',
  '/about',
  '/contact',
  '/sitemap',
] as const;

const LEGAL_STATIC_PATHS = [
  '/legal',
  '/legal/terms',
  '/legal/privacy',
  '/legal/cookies',
  '/legal/services',
  '/legal/pricing-disclaimers',
  ...DYNAMIC_LEGAL_SLUGS.map((s) => `/legal/${s}`),
  ...PRIVACY_REGION_OPTIONS.filter((r) => r.slug !== 'global').map((r) => r.href),
  '/legal/privacy/gcc',
  ...GCC_COUNTRY_SLUGS.map((c) => `/legal/privacy/gcc/${c}`),
] as const;

const HTML_SITEMAP_LEGAL_PATHS = new Set([
  '/legal',
  '/legal/terms',
  '/legal/privacy',
  '/legal/cookies',
  '/legal/services',
  '/legal/refunds',
]);

const HTML_SITEMAP_KEY_CERT_PATHS = new Set([
  '/certifications/pmi-rmp',
  '/certifications/pgmp',
  '/certifications/prince2-practitioner',
  '/certifications/lss-yellow',
  '/certifications/lss-black',
]);

const HTML_SITEMAP_PMP_CLUSTER_PATHS = new Set([
  '/pmp',
  '/pmp-exam-2026',
  '/pmp-2026-pathway',
  '/pmp-current-vs-new-exam',
  '/pmp-exam-timeline-2026',
  '/pmp-study-plan-2026',
  '/pmp-foundation',
  '/pmp-professional',
  '/pmp-mastery',
  '/pmp-readiness-diagnostic',
]);

const ENROLL_NOINDEX_PATTERN = /^\/certifications\/[^/]+\/[^/]+\/enroll(?:\/|$)/;

const P0_COMMERCIAL_PATHS = new Set([
  '/',
  '/certifications',
  '/certifications/pmp',
  '/certifications/compare',
  '/answers/is-the-pmp-exam-changing-in-2026',
  '/topics/pmp-exam-2026',
  '/faq',
]);

const REDIRECT_PATHS: Record<string, string> = {
  '/compare': '/certifications/compare',
  '/store': '/community?view=store',
  ...getKeywordRedirectPathMap(),
};

const NOT_IN_REPO_SPEC_PATHS = [
  '/payment',
  '/payments',
  '/thank-you',
  '/thanks',
  '/success',
  '/cancel',
  '/account',
  '/pmp-certification',
  '/pmp-exam',
  '/answers/should-i-take-pmp-before-july-2026',
  '/corporate/pmp-2026-readiness',
];

const UTILITY_NOINDEX_PATHS = [
  '/checkout',
  '/checkout/cancel',
  '/checkout/success',
  '/checkout/store',
  '/checkout/store/success',
  '/membership/checkout',
  '/membership/checkout/success',
  '/admin',
  '/api',
] as const;

function apexUrl(path: string): string {
  return `${PMS_SITE_URL}${normalizePath(path)}`;
}

function baseRow(
  partial: Omit<PageIndexationConfig, 'index' | 'follow' | 'includeInSitemap'> & {
    index?: boolean;
    follow?: boolean;
    includeInSitemap?: boolean;
  },
): PageIndexationConfig {
  const index =
    partial.index ?? (partial.decision === 'index' || partial.decision === 'canonicalize');
  const follow = partial.follow ?? index;
  const includeInSitemap =
    partial.includeInSitemap ??
    (index && partial.decision !== 'redirect' && partial.decision !== 'merge' && isIndexablePath(partial.path));
  return {
    index,
    follow,
    includeInSitemap,
    ...partial,
  };
}

function toStrategyRow(config: PageIndexationConfig): IndexationStrategyRow {
  return {
    ...config,
    url: apexUrl(config.path),
    currentStatus: 'Unknown',
  };
}

function priorityForPath(path: string): PageIndexationConfig['priority'] {
  if (P0_COMMERCIAL_PATHS.has(path)) return 'P0';
  if (path === '/certifications/pmp' || path.startsWith('/certifications/pmp')) return 'P0';
  if (path.startsWith('/certifications/')) return 'P1';
  if (path.startsWith('/answers/') || path.startsWith('/topics/')) return 'P1';
  if (PMP_CLUSTER_PATHS.includes(path as (typeof PMP_CLUSTER_PATHS)[number])) return 'P1';
  if (path.startsWith('/legal')) return 'P3';
  if (['/community', '/membership', '/pm-service', '/newsletter'].includes(path)) return 'P2';
  if (path.startsWith('/go/')) return 'P2';
  return 'P3';
}

function configForPublicPath(path: string, pageType: string, notes?: string): PageIndexationConfig {
  const normalized = normalizePath(path);
  let decision: IndexationDecision = 'index';
  let reason = 'Public canonical page';
  let ownerApproval = 'Not required';
  let implementationStatus = 'Implemented';

  if (!isIndexablePath(normalized) && !REDIRECT_PATHS[normalized]) {
    return baseRow({
      path: normalized,
      pageType,
      decision: 'noindex',
      index: false,
      follow: false,
      includeInSitemap: false,
      priority: priorityForPath(normalized),
      reason: 'GSC crawled-not-indexed drilldown: owner requested noindex/nofollow 2026-07-24',
      dataSource: 'GSC Coverage Drilldown 2026-07-24',
      ownerApproval: 'Owner approved noindex 2026-07-24',
      implementationStatus: 'Implemented',
      notes,
    });
  }

  if (REDIRECT_PATHS[normalized]) {
    return baseRow({
      path: normalized,
      pageType,
      decision: 'redirect',
      index: false,
      follow: false,
      includeInSitemap: false,
      redirectTarget: REDIRECT_PATHS[normalized],
      priority: 'Utility',
      reason: 'Legacy URL permanently redirects to final canonical target',
      dataSource: 'Route inventory + T-037',
      ownerApproval,
      implementationStatus,
      notes,
    });
  }

  if (normalized === '/community' || normalized.startsWith('/community?')) {
    return baseRow({
      path: '/community',
      pageType,
      decision: 'canonicalize',
      canonicalPath: '/community',
      priority: priorityForPath('/community'),
      reason: 'Query views (e.g. ?view=store) canonicalize to /community',
      dataSource: 'frontend/lib/canonical.ts STRIPPED_QUERY_PARAM_KEYS',
      ownerApproval: 'Owner review for content quality',
      implementationStatus,
      notes: notes ?? 'Parameter URLs should not be indexed separately',
    });
  }

  if (['/community', '/membership', '/pm-service'].includes(normalized)) {
    decision = 'needs_review';
    reason = 'Public marketing page: index if content quality confirmed';
    ownerApproval = 'Owner review';
  }

  if (normalized === '/pmp') {
    notes = notes ?? 'Supporting PMP hub: distinct from /certifications/pmp commercial page (T-032)';
  }

  if (normalized === '/certifications/pmp') {
    reason = 'Primary PMP 2026 commercial conversion page';
    decision = 'index';
  }

  return baseRow({
    path: normalized,
    pageType,
    decision,
    canonicalPath: normalized,
    priority: priorityForPath(normalized),
    reason,
    dataSource: 'Route inventory',
    ownerApproval,
    implementationStatus,
    notes,
  });
}

function configForPortalPath(slug: string): PageIndexationConfig {
  const path = `/go/${slug}`;
  if (!isIndexablePath(path)) {
    return baseRow({
      path,
      pageType: 'Portal page',
      decision: 'noindex',
      index: false,
      follow: false,
      includeInSitemap: false,
      priority: 'P2',
      reason: 'GSC crawled-not-indexed drilldown: owner requested noindex/nofollow 2026-07-24',
      dataSource: 'GSC Coverage Drilldown 2026-07-24',
      ownerApproval: 'Owner approved noindex 2026-07-24',
      implementationStatus: 'Implemented',
      notes: 'Omitted from XML sitemap',
    });
  }
  return baseRow({
    path,
    pageType: 'Portal page',
    decision: 'index',
    index: true,
    follow: true,
    includeInSitemap: true,
    priority: 'P2',
    reason: 'Published channel portal: indexable lead landing in XML sitemap',
    dataSource: 'Route inventory + owner request to index /go channels',
    ownerApproval: 'Owner approved index 2026-07-23',
    implementationStatus: 'Implemented',
    notes: 'Included in XML sitemap; HTML sitemap stays lean without full /go list',
  });
}

function configForUtilityPath(path: string, pageType: string): PageIndexationConfig {
  return baseRow({
    path: normalizePath(path),
    pageType,
    decision: 'noindex',
    index: false,
    follow: false,
    includeInSitemap: false,
    priority: 'P0',
    reason: 'Utility, payment, or private surface: must not rank',
    dataSource: 'Route inventory + indexing-metadata.ts',
    ownerApproval: 'Not required',
    implementationStatus: 'Implemented',
  });
}

function configForNotInRepo(path: string): PageIndexationConfig {
  return baseRow({
    path,
    pageType: 'Spec example: not in repo',
    decision: 'needs_review',
    index: false,
    follow: false,
    includeInSitemap: false,
    priority: 'Owner',
    reason: 'Route not found in codebase: owner decision if GSC/crawl shows traffic',
    dataSource: 'T-038 spec example',
    ownerApproval: 'Required',
    implementationStatus: 'Not in repo',
    notes: 'Do not publish or index until route exists and is approved',
  });
}

export function getIndexationDecisionForPath(path: string): IndexationDecision {
  const normalized = normalizePath(path);
  if (REDIRECT_PATHS[normalized]) return 'redirect';
  if (!isIndexablePath(normalized)) return 'noindex';
  if (NOT_IN_REPO_SPEC_PATHS.includes(normalized)) return 'needs_review';
  if (['/community', '/membership', '/pm-service'].includes(normalized)) return 'needs_review';
  return 'index';
}

export function getPriorityIndexationRows(): IndexationStrategyRow[] {
  return [...P0_COMMERCIAL_PATHS].map((path) => {
    const pageType =
      path === '/'
        ? 'Homepage'
        : path === '/certifications/pmp'
          ? 'PMP commercial page'
          : path.includes('/answers/')
            ? 'PMP answer page'
            : path.includes('/topics/')
              ? 'PMP topic hub'
              : path === '/faq'
                ? 'FAQ'
                : path === '/certifications/compare'
                  ? 'Comparison page'
                  : 'Certification hub';
    return toStrategyRow(configForPublicPath(path, pageType));
  });
}

export function getAllIndexationStrategyRows(): IndexationStrategyRow[] {
  const rows: IndexationStrategyRow[] = [];
  const seen = new Set<string>();

  const add = (config: PageIndexationConfig) => {
    const key = config.path;
    if (seen.has(key)) return;
    seen.add(key);
    rows.push(toStrategyRow(config));
  };

  for (const path of MARKETING_HUB_PATHS) {
    add(configForPublicPath(path, 'Marketing hub'));
  }

  for (const cert of certifications) {
    add(configForPublicPath(`/certifications/${cert.id}`, 'Certification page'));
  }

  for (const path of PMP_CLUSTER_PATHS) {
    add(
      configForPublicPath(
        path,
        path === '/pmp' ? 'PMP hub' : 'PMP cluster guide',
        path === '/pmp-exam-2026' ? 'Supporting deep guide: not primary nav target (T-032)' : undefined,
      ),
    );
  }

  for (const path of PMP_COURSE_PATHS) {
    add(configForPublicPath(path, 'PMP course pathway'));
  }

  for (const path of PMP_SERVICE_PATHS) {
    add(configForPublicPath(path, 'PMP service pathway'));
  }

  for (const path of getPublishedAnswerPaths()) {
    add(configForPublicPath(path, 'Answer page'));
  }

  for (const path of getPublishedTopicPaths()) {
    add(configForPublicPath(path, 'Topic hub'));
  }

  for (const path of LEGAL_STATIC_PATHS) {
    add(configForPublicPath(path, 'Legal page'));
  }

  for (const slug of getPublishedGoChannelSlugs()) {
    add(configForPortalPath(slug));
  }

  add(
    baseRow({
      path: '/go',
      pageType: 'Portal index',
      decision: 'redirect',
      index: false,
      follow: false,
      includeInSitemap: false,
      redirectTarget: '/go/website',
      priority: 'P2',
      reason: 'Default portal entry redirects to /go/website (T-037)',
      dataSource: 'Route inventory',
      ownerApproval: 'Not required',
      implementationStatus: 'Implemented',
    }),
  );

  for (const path of UTILITY_NOINDEX_PATHS) {
    add(configForUtilityPath(path, 'Checkout/utility'));
  }

  for (const path of Object.keys(REDIRECT_PATHS)) {
    add(configForPublicPath(path, 'Legacy redirect'));
  }

  for (const path of NOT_IN_REPO_SPEC_PATHS) {
    add(configForNotInRepo(path));
  }

  add(
    baseRow({
      path: '/login',
      pageType: 'Admin redirect',
      decision: 'redirect',
      index: false,
      follow: false,
      includeInSitemap: false,
      redirectTarget: '/admin/login',
      priority: 'Utility',
      reason: 'Legacy login path redirects to bundled admin',
      dataSource: 'next.config.ts',
      ownerApproval: 'Not required',
      implementationStatus: 'Implemented',
    }),
  );

  add(
    baseRow({
      path: '/dashboard',
      pageType: 'Admin redirect',
      decision: 'redirect',
      index: false,
      follow: false,
      includeInSitemap: false,
      redirectTarget: '/admin/dashboard',
      priority: 'Utility',
      reason: 'Legacy dashboard path redirects to bundled admin',
      dataSource: 'next.config.ts',
      ownerApproval: 'Not required',
      implementationStatus: 'Implemented',
    }),
  );

  return rows.sort((a, b) => a.path.localeCompare(b.path));
}

export const INDEXATION_CSV_HEADER =
  'URL,Page_Type,Current_Status,Indexation_Decision,Should_Index,Should_Follow,Should_Be_In_Sitemap,Canonical_URL,Redirect_Target,Merge_Target,Priority,Reason,Data_Source,Owner_Approval,Implementation_Status,Notes';

export function indexationRowToCsv(row: IndexationStrategyRow): string {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [
    row.url,
    row.pageType,
    row.currentStatus,
    row.decision,
    row.index ? 'Yes' : 'No',
    row.follow ? 'Yes' : 'No',
    row.includeInSitemap ? 'Yes' : 'No',
    row.canonicalPath ? apexUrl(row.canonicalPath) : apexUrl(row.path),
    row.redirectTarget ?? '',
    row.mergeTarget ?? '',
    row.priority,
    row.reason,
    row.dataSource,
    row.ownerApproval,
    row.implementationStatus,
    row.notes ?? '',
  ]
    .map((v) => escape(String(v)))
    .join(',');
}

export function formatIndexationStrategyCsv(): string {
  return [INDEXATION_CSV_HEADER, ...getAllIndexationStrategyRows().map(indexationRowToCsv)].join('\n');
}

export type IndexationControlMatrixRow = IndexationStrategyRow & {
  route: string;
  exists: string;
  shouldBeInXmlSitemap: boolean;
  shouldBeInHtmlSitemap: boolean;
  robotsRule: string;
};

export const INDEXATION_CONTROL_MATRIX_CSV_HEADER =
  'URL,Route,Page_Type,Exists,Current_Status,Indexation_Decision,Should_Index,Should_Follow,Should_Be_In_XML_Sitemap,Should_Be_In_HTML_Sitemap,Canonical_URL,Robots_Rule,Data_Source,Owner_Approval,Implementation_Status,Notes';

function routeExists(config: PageIndexationConfig): string {
  return config.implementationStatus === 'Not in repo' ? 'No' : 'Yes';
}

function robotsRuleFor(config: PageIndexationConfig): string {
  const path = normalizePath(config.path);
  if (path === '/admin' || path.startsWith('/admin/')) return 'protected';
  if (config.decision === 'redirect') return 'redirect';
  if (!config.index || config.decision === 'noindex') return 'noindex-nofollow';
  return 'index-follow';
}

export function shouldIncludeInHtmlSitemap(config: PageIndexationConfig): boolean {
  const path = normalizePath(config.path);
  if (!config.index || config.decision === 'redirect' || config.decision === 'noindex') return false;
  if (config.implementationStatus === 'Not in repo') return false;
  if (path.startsWith('/go/') || path === '/go') return false;
  if (path.startsWith('/checkout') || path.startsWith('/membership/checkout')) return false;
  if (path.startsWith('/admin') || path.startsWith('/api')) return false;
  if (ENROLL_NOINDEX_PATTERN.test(path)) return false;
  if (path.startsWith('/legal/privacy/') && path !== '/legal/privacy') return false;
  if (/^\/newsletter\/[^/]+$/.test(path)) return false;
  if (/^\/answers\/[^/]+$/.test(path) && !P0_COMMERCIAL_PATHS.has(path)) return false;
  if (/^\/topics\/[^/]+$/.test(path) && !P0_COMMERCIAL_PATHS.has(path)) return false;
  if (path.startsWith('/certifications/') && path !== '/certifications' && path !== '/certifications/compare') {
    if (path === '/certifications/pmp') return true;
    if (HTML_SITEMAP_KEY_CERT_PATHS.has(path)) return true;
    return false;
  }
  if (HTML_SITEMAP_LEGAL_PATHS.has(path)) return true;
  if (HTML_SITEMAP_PMP_CLUSTER_PATHS.has(path)) return true;
  if (P0_COMMERCIAL_PATHS.has(path)) return true;
  if ((MARKETING_HUB_PATHS as readonly string[]).includes(path)) return true;
  return false;
}

export function getAllIndexationControlMatrixRows(): IndexationControlMatrixRow[] {
  return getAllIndexationStrategyRows().map((row) => ({
    ...row,
    route: row.path,
    exists: routeExists(row),
    shouldBeInXmlSitemap: row.includeInSitemap,
    shouldBeInHtmlSitemap: shouldIncludeInHtmlSitemap(row),
    robotsRule: robotsRuleFor(row),
  }));
}

export function indexationControlMatrixRowToCsv(row: IndexationControlMatrixRow): string {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [
    row.url,
    row.route,
    row.pageType,
    row.exists,
    row.currentStatus,
    row.decision,
    row.index ? 'Yes' : 'No',
    row.follow ? 'Yes' : 'No',
    row.shouldBeInXmlSitemap ? 'Yes' : 'No',
    row.shouldBeInHtmlSitemap ? 'Yes' : 'No',
    row.canonicalPath ? apexUrl(row.canonicalPath) : apexUrl(row.path),
    row.robotsRule,
    row.dataSource,
    row.ownerApproval,
    row.implementationStatus,
    row.notes ?? '',
  ]
    .map((v) => escape(String(v)))
    .join(',');
}

export function formatIndexationControlMatrixCsv(): string {
  return [
    INDEXATION_CONTROL_MATRIX_CSV_HEADER,
    ...getAllIndexationControlMatrixRows().map(indexationControlMatrixRowToCsv),
  ].join('\n');
}
