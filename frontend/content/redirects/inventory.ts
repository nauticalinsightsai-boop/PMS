import { buildLegacyGoSlugRedirects } from '@pms/booking-crm';
import { PMS_SITE_URL } from '@/config/pms-site';

export type RedirectMapRow = {
  sourceUrl: string;
  sourcePath: string;
  currentTarget: string;
  recommendedTarget: string;
  currentStatus: string;
  recommendedStatus: string;
  redirectType: string;
  priority: string;
  dataSource: string;
  reason: string;
  ownerApproval: string;
  implementationStatus: string;
  notes?: string;
};

export type Redirect302AuditRow = {
  sourceUrl: string;
  sourcePath: string;
  currentDestination: string;
  finalTarget: string;
  currentStatus: string;
  recommendedStatus: string;
  redirectType: string;
  keepTemporary: string;
  priority: string;
  reason: string;
  dataSource: string;
  ownerApproval: string;
  implementationStatus: string;
  notes?: string;
};

export type Redirect410ReviewRow = {
  url: string;
  path: string;
  currentStatus: string;
  trafficStatus: string;
  backlinkStatus: string;
  replacementTarget: string;
  recommendedAction: string;
  reason: string;
  dataSource: string;
  ownerApproval: string;
  implementationStatus: string;
  notes?: string;
};

type StaticRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
  priority: string;
  reason: string;
  redirectType: string;
};

const STATIC_NEXT_CONFIG_REDIRECTS: StaticRedirect[] = [
  {
    source: '/store',
    destination: '/community?view=store',
    permanent: true,
    priority: 'P1',
    reason: 'Store tab consolidated under community',
    redirectType: 'Legacy slug redirect',
  },
  {
    source: '/compare',
    destination: '/certifications/compare',
    permanent: true,
    priority: 'P1',
    reason: 'Stable permanent slug move',
    redirectType: 'Legacy slug redirect',
  },
  {
    source: '/privacy',
    destination: '/legal/privacy',
    permanent: true,
    priority: 'P1',
    reason: 'Privacy moved under /legal',
    redirectType: 'Legacy slug redirect',
  },
  {
    source: '/terms',
    destination: '/legal/terms',
    permanent: true,
    priority: 'P1',
    reason: 'Terms moved under /legal',
    redirectType: 'Legacy slug redirect',
  },
  {
    source: '/legalhub',
    destination: '/legal',
    permanent: true,
    priority: 'P1',
    reason: 'Legal hub rename',
    redirectType: 'Legacy slug redirect',
  },
  {
    source: '/legalhub/:path*',
    destination: '/legal/:path*',
    permanent: true,
    priority: 'P1',
    reason: 'Legal hub rename',
    redirectType: 'Legacy slug redirect',
  },
  {
    source: '/legal/pricing',
    destination: '/legal/pricing-disclaimers',
    permanent: true,
    priority: 'P2',
    reason: 'Legal slug correction',
    redirectType: 'Legacy slug redirect',
  },
  {
    source: '/admin',
    destination: '/admin/login',
    permanent: false,
    priority: 'P1',
    reason: 'Unauthenticated admin entry may vary by session',
    redirectType: 'Auth entry redirect',
  },
  {
    source: '/login',
    destination: '/admin/login',
    permanent: true,
    priority: 'P2',
    reason: 'Legacy /login path to bundled admin',
    redirectType: 'Admin URL migration',
  },
  {
    source: '/login/:path*',
    destination: '/admin/login/:path*',
    permanent: true,
    priority: 'P2',
    reason: 'Legacy /login path to bundled admin',
    redirectType: 'Admin URL migration',
  },
  {
    source: '/dashboard',
    destination: '/admin/dashboard',
    permanent: true,
    priority: 'P2',
    reason: 'Legacy /dashboard path to bundled admin',
    redirectType: 'Admin URL migration',
  },
  {
    source: '/dashboard/:path*',
    destination: '/admin/dashboard/:path*',
    permanent: true,
    priority: 'P2',
    reason: 'Legacy /dashboard path to bundled admin',
    redirectType: 'Admin URL migration',
  },
  {
    source: '/answers/is-pm-structure-a-pmi-authorized-training-partner',
    destination: '/answers/is-pm-structure-an-official-pmi-atp',
    permanent: true,
    priority: 'P2',
    reason: 'Permanent content rename',
    redirectType: 'Answer slug rename',
  },
  {
    source: '/answers/does-pm-structure-guarantee-a-pmp-pass',
    destination: '/answers/does-pm-structure-guarantee-pmp-success',
    permanent: true,
    priority: 'P2',
    reason: 'Permanent content rename',
    redirectType: 'Answer slug rename',
  },
  {
    source: '/go',
    destination: '/go/website',
    permanent: true,
    priority: 'P0',
    reason: 'Default portal entry is stable',
    redirectType: 'Default portal entry',
  },
];

const CANONICAL_HOST_ROWS: Redirect302AuditRow[] = [
  {
    sourceUrl: 'http://pmstructure.com/',
    sourcePath: '/',
    currentDestination: `${PMS_SITE_URL}/`,
    finalTarget: `${PMS_SITE_URL}/`,
    currentStatus: '301',
    recommendedStatus: '301',
    redirectType: 'Canonical host redirect',
    keepTemporary: 'No',
    priority: 'P0',
    reason: 'HTTP to HTTPS apex should be permanent',
    dataSource: 'Code: frontend/lib/canonical-host.ts + middleware',
    ownerApproval: 'Not required',
    implementationStatus: 'Implemented',
    notes: 'middleware returns 301',
  },
  {
    sourceUrl: 'https://www.pmstructure.com/:path*',
    sourcePath: '/:path*',
    currentDestination: `${PMS_SITE_URL}/:path*`,
    finalTarget: `${PMS_SITE_URL}/:path*`,
    currentStatus: '308',
    recommendedStatus: '308',
    redirectType: 'Canonical host redirect',
    keepTemporary: 'No',
    priority: 'P0',
    reason: 'www to non-www apex should be permanent',
    dataSource: 'Code: frontend/next.config.ts',
    ownerApproval: 'Not required',
    implementationStatus: 'Implemented',
    notes: 'Vercel domain alias should mirror this',
  },
];

const SESSION_REDIRECT_ROWS: Redirect302AuditRow[] = [
  {
    sourceUrl: `${PMS_SITE_URL}/checkout`,
    sourcePath: '/checkout',
    currentDestination: 'Stripe/session URLs',
    finalTarget: 'Dynamic',
    currentStatus: '302/303',
    recommendedStatus: '302',
    redirectType: 'Payment session redirect',
    keepTemporary: 'Yes',
    priority: 'P0',
    reason: 'Checkout depends on cart/session state',
    dataSource: 'Stripe/API',
    ownerApproval: 'Not required',
    implementationStatus: 'N/A',
    notes: 'Do not convert to 301',
  },
  {
    sourceUrl: `${PMS_SITE_URL}/admin`,
    sourcePath: '/admin',
    currentDestination: '/admin/login',
    finalTarget: '/admin/login',
    currentStatus: '307',
    recommendedStatus: '307',
    redirectType: 'Auth entry redirect',
    keepTemporary: 'Yes',
    priority: 'P1',
    reason: 'Unauthenticated admin entry may vary by session',
    dataSource: 'Code: next.config.ts permanent:false',
    ownerApproval: 'Not required',
    implementationStatus: 'Implemented',
    notes: 'Keep temporary',
  },
];

const EXAMPLE_ONLY_DEAD_URLS: RedirectMapRow[] = [
  {
    sourceUrl: `${PMS_SITE_URL}/pmp`,
    sourcePath: '/pmp',
    currentTarget: 'TBD',
    recommendedTarget: `${PMS_SITE_URL}/certifications/pmp`,
    currentStatus: 'TBD',
    recommendedStatus: '301',
    redirectType: 'Old PMP URL',
    priority: 'P1',
    dataSource: 'Example only',
    reason: 'Would map to commercial page ONLY if GSC proves separate dead legacy URL: /pmp is a LIVE indexed hub',
    ownerApproval: 'Required',
    implementationStatus: 'Not implemented',
    notes: 'Do not implement: /pmp is live (T-032 pillar)',
  },
  {
    sourceUrl: `${PMS_SITE_URL}/pmp-exam-2026`,
    sourcePath: '/pmp-exam-2026',
    currentTarget: 'TBD',
    recommendedTarget: `${PMS_SITE_URL}/pmp-exam-2026`,
    currentStatus: 'TBD',
    recommendedStatus: '301',
    redirectType: 'Old PMP 2026 URL',
    priority: 'P1',
    dataSource: 'Example only',
    reason: 'Would map to topic hub ONLY if GSC proves separate dead URL: page is LIVE indexed cluster guide',
    ownerApproval: 'Required',
    implementationStatus: 'Not implemented',
    notes: 'Do not implement: /pmp-exam-2026 is live',
  },
  {
    sourceUrl: `${PMS_SITE_URL}/pmp-certification`,
    sourcePath: '/pmp-certification',
    currentTarget: 'TBD',
    recommendedTarget: `${PMS_SITE_URL}/certifications/pmp`,
    currentStatus: 'TBD',
    recommendedStatus: '301',
    redirectType: 'Old SEO URL',
    priority: 'P1',
    dataSource: 'Example only',
    reason: 'Route not in repo: owner decision if GSC/crawl shows traffic',
    ownerApproval: 'Required',
    implementationStatus: 'Not implemented',
    notes: 'Do not implement until found in GSC/crawl/logs or approved',
  },
  {
    sourceUrl: `${PMS_SITE_URL}/prince2`,
    sourcePath: '/prince2',
    currentTarget: 'TBD',
    recommendedTarget: `${PMS_SITE_URL}/certifications/prince2-practitioner`,
    currentStatus: 'TBD',
    recommendedStatus: '301',
    redirectType: 'Old cert slug',
    priority: 'P2',
    dataSource: 'Example only',
    reason: 'Route not in repo',
    ownerApproval: 'Required',
    implementationStatus: 'Not implemented',
    notes: 'Map only if approved from crawl data',
  },
  {
    sourceUrl: `${PMS_SITE_URL}/pmi-rmp`,
    sourcePath: '/pmi-rmp',
    currentTarget: 'TBD',
    recommendedTarget: `${PMS_SITE_URL}/certifications/pmi-rmp`,
    currentStatus: 'TBD',
    recommendedStatus: '301',
    redirectType: 'Old cert slug',
    priority: 'P2',
    dataSource: 'Example only',
    reason: 'Route not in repo',
    ownerApproval: 'Required',
    implementationStatus: 'Not implemented',
    notes: 'Map only if approved from crawl data',
  },
];

const PLACEHOLDER_410_ROWS: Redirect410ReviewRow[] = [
  {
    url: 'TBD',
    path: 'TBD',
    currentStatus: '404',
    trafficStatus: 'Unknown',
    backlinkStatus: 'Unknown',
    replacementTarget: '',
    recommendedAction: 'Needs Review',
    reason: 'Fill after GSC Not found / crawl export',
    dataSource: 'Pending GSC export',
    ownerApproval: 'Required',
    implementationStatus: 'Not implemented',
    notes: 'Do not 410 without evidence and approval',
  },
  {
    url: `${PMS_SITE_URL}/wp-content/uploads/example`,
    path: '/wp-content/uploads/example',
    currentStatus: 'N/A',
    trafficStatus: 'N/A',
    backlinkStatus: 'N/A',
    replacementTarget: '',
    recommendedAction: 'Needs Review',
    reason: 'WordPress attachment pattern: project is not WordPress (T-076 N/A)',
    dataSource: 'Example only',
    ownerApproval: 'N/A',
    implementationStatus: 'Not applicable',
    notes: 'Mark T-076 N/A unless WordPress routes appear in crawl',
  },
];

function statusForPermanent(permanent: boolean): string {
  return permanent ? '308' : '307';
}

function apexUrl(path: string): string {
  if (path.includes(':path*') || path.includes(':legacy')) return `${PMS_SITE_URL}${path.replace(':path*', '')}`;
  return `${PMS_SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function escapeCsv(v: string): string {
  return `"${v.replace(/"/g, '""')}"`;
}

export function getImplementedRedirectMapRows(): RedirectMapRow[] {
  const rows: RedirectMapRow[] = [];

  for (const r of STATIC_NEXT_CONFIG_REDIRECTS) {
    const status = statusForPermanent(r.permanent);
    rows.push({
      sourceUrl: apexUrl(r.source.replace('/:path*', '')),
      sourcePath: r.source,
      currentTarget: r.destination,
      recommendedTarget: r.destination,
      currentStatus: status,
      recommendedStatus: status,
      redirectType: r.redirectType,
      priority: r.priority,
      dataSource: 'Code: next.config.ts + page fallbacks',
      reason: r.reason,
      ownerApproval: r.permanent ? 'Not required' : 'Not required',
      implementationStatus: 'Implemented',
    });
  }

  for (const r of buildLegacyGoSlugRedirects()) {
    rows.push({
      sourceUrl: apexUrl(r.source),
      sourcePath: r.source,
      currentTarget: r.destination,
      recommendedTarget: r.destination,
      currentStatus: '308',
      recommendedStatus: '308',
      redirectType: 'Legacy /go slug alias',
      priority: 'P2',
      dataSource: 'Code: go-slug-redirects.ts',
      reason: 'Legacy portal slug consolidation',
      ownerApproval: 'Not required',
      implementationStatus: 'Implemented',
      notes: 'Do not mass-change',
    });
  }

  return rows.sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));
}

export function getRedirectMapRows(): RedirectMapRow[] {
  return [...getImplementedRedirectMapRows(), ...EXAMPLE_ONLY_DEAD_URLS];
}

export function get302AuditRows(): Redirect302AuditRow[] {
  const fromConfig: Redirect302AuditRow[] = getImplementedRedirectMapRows().map((r) => ({
    sourceUrl: r.sourceUrl,
    sourcePath: r.sourcePath,
    currentDestination: r.currentTarget,
    finalTarget: r.recommendedTarget,
    currentStatus: r.currentStatus,
    recommendedStatus: r.recommendedStatus,
    redirectType: r.redirectType,
    keepTemporary: r.sourcePath === '/admin' ? 'Yes' : 'No',
    priority: r.priority,
    reason: r.reason,
    dataSource: r.dataSource,
    ownerApproval: r.ownerApproval,
    implementationStatus: r.implementationStatus,
    notes: r.notes,
  }));

  return [
    ...CANONICAL_HOST_ROWS,
    ...fromConfig,
    ...SESSION_REDIRECT_ROWS,
    {
      sourceUrl: `${PMS_SITE_URL}/go/meeting`,
      sourcePath: '/go/meeting',
      currentDestination: 'External booking (in-page CTA)',
      finalTarget: 'External URL',
      currentStatus: 'N/A',
      recommendedStatus: 'N/A',
      redirectType: 'Marketing portal page',
      keepTemporary: 'Yes',
      priority: 'P2',
      reason: '/go/{channel} renders portal; external links are client CTAs not HTTP redirects',
      dataSource: 'Example only',
      ownerApproval: 'Required',
      implementationStatus: 'Not applicable',
      notes: 'Do not HTTP-convert without owner approval',
    },
  ];
}

export function get410ReviewRows(): Redirect410ReviewRow[] {
  return PLACEHOLDER_410_ROWS;
}

export const REDIRECT_MAP_CSV_HEADER =
  'Source_URL,Source_Path,Current_Target,Recommended_Target,Current_Status,Recommended_Status,Redirect_Type,Priority,Data_Source,Reason,Owner_Approval,Implementation_Status,Notes';

export const REDIRECT_302_AUDIT_CSV_HEADER =
  'Source_URL,Source_Path,Current_Destination,Final_Target,Current_Status,Recommended_Status,Redirect_Type,Keep_Temporary,Priority,Reason,Data_Source,Owner_Approval,Implementation_Status,Notes';

export const REDIRECT_410_REVIEW_CSV_HEADER =
  'URL,Path,Current_Status,Traffic_Status,Backlink_Status,Replacement_Target,Recommended_Action,Reason,Data_Source,Owner_Approval,Implementation_Status,Notes';

export function formatRedirectMapCsv(): string {
  return [
    REDIRECT_MAP_CSV_HEADER,
    ...getRedirectMapRows().map((r) =>
      [
        r.sourceUrl,
        r.sourcePath,
        r.currentTarget,
        r.recommendedTarget,
        r.currentStatus,
        r.recommendedStatus,
        r.redirectType,
        r.priority,
        r.dataSource,
        r.reason,
        r.ownerApproval,
        r.implementationStatus,
        r.notes ?? '',
      ]
        .map(escapeCsv)
        .join(','),
    ),
  ].join('\n');
}

export function format302AuditCsv(): string {
  return [
    REDIRECT_302_AUDIT_CSV_HEADER,
    ...get302AuditRows().map((r) =>
      [
        r.sourceUrl,
        r.sourcePath,
        r.currentDestination,
        r.finalTarget,
        r.currentStatus,
        r.recommendedStatus,
        r.redirectType,
        r.keepTemporary,
        r.priority,
        r.reason,
        r.dataSource,
        r.ownerApproval,
        r.implementationStatus,
        r.notes ?? '',
      ]
        .map(escapeCsv)
        .join(','),
    ),
  ].join('\n');
}

export function format410ReviewCsv(): string {
  return [
    REDIRECT_410_REVIEW_CSV_HEADER,
    ...get410ReviewRows().map((r) =>
      [
        r.url,
        r.path,
        r.currentStatus,
        r.trafficStatus,
        r.backlinkStatus,
        r.replacementTarget,
        r.recommendedAction,
        r.reason,
        r.dataSource,
        r.ownerApproval,
        r.implementationStatus,
        r.notes ?? '',
      ]
        .map(escapeCsv)
        .join(','),
    ),
  ].join('\n');
}

/** Paths to verify in live redirect audit (implemented SEO redirects). */
export function getLiveAuditRedirectPaths(): string[] {
  return [
    '/go',
    '/compare',
    '/store',
    '/privacy',
    '/terms',
    '/legalhub',
    '/login',
    '/dashboard',
    '/admin',
    '/go/website-pages',
    '/answers/is-pm-structure-a-pmi-authorized-training-partner',
  ];
}
