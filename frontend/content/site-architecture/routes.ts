import type { BreadcrumbItem } from '@/components/navigation/breadcrumb-schema';
import type { AnswerPageContent } from '@/content/answers/types';
import type { TopicHubContent } from '@/content/topics/types';
import type { PmpPageContent } from '@/content/pmp/types';

export type SiteRouteRole =
  | 'homepage'
  | 'hub'
  | 'commercial'
  | 'comparison'
  | 'answer'
  | 'topic'
  | 'faq'
  | 'support'
  | 'legal'
  | 'deep-guide';

export type SiteRoute = {
  path: string;
  label: string;
  role: SiteRouteRole;
  breadcrumbs: BreadcrumbItem[];
  notes?: string;
};

const HOME_CRUMB: BreadcrumbItem = { label: 'Home', href: '/' };
const CERTS_CRUMB: BreadcrumbItem = { label: 'Certifications', href: '/certifications' };
const LEGAL_CRUMB: BreadcrumbItem = { label: 'Legal', href: '/legal' };

export const PMP_COMMERCIAL_PATH = '/certifications/pmp';
export const PMP_COMMERCIAL_LABEL = 'PMP 2026 Readiness Pathway';

const PRIORITY_ROUTES: SiteRoute[] = [
  {
    path: '/',
    label: 'Home',
    role: 'homepage',
    breadcrumbs: [{ label: 'Home' }],
  },
  {
    path: '/certifications',
    label: 'Certifications',
    role: 'hub',
    breadcrumbs: [HOME_CRUMB, { label: 'Certifications' }],
  },
  {
    path: PMP_COMMERCIAL_PATH,
    label: PMP_COMMERCIAL_LABEL,
    role: 'commercial',
    breadcrumbs: [HOME_CRUMB, CERTS_CRUMB, { label: PMP_COMMERCIAL_LABEL }],
  },
  {
    path: '/certifications/compare',
    label: 'Compare Project Management Certifications',
    role: 'comparison',
    breadcrumbs: [
      HOME_CRUMB,
      CERTS_CRUMB,
      { label: 'Compare Project Management Certifications' },
    ],
  },
  {
    path: '/faq',
    label: 'FAQ',
    role: 'faq',
    breadcrumbs: [HOME_CRUMB, { label: 'FAQ' }],
  },
  {
    path: '/pmp-2026-pathway',
    label: 'PMP 2026 Readiness Pathway',
    role: 'commercial',
    breadcrumbs: [HOME_CRUMB, { label: 'PMP', href: '/pmp' }],
    notes: 'Structured pathway landing; deep exam facts on /pmp-exam-2026.',
  },
  {
    path: '/pmp-exam-2026',
    label: 'PMP Exam 2026 Guide',
    role: 'deep-guide',
    breadcrumbs: [HOME_CRUMB, { label: 'PMP', href: '/pmp' }],
    notes: 'Supporting deep guide; primary nav targets commercial PMP page.',
  },
];

export function getArchitectureRow(path: string): SiteRoute | undefined {
  return PRIORITY_ROUTES.find((route) => route.path === path);
}

export function getBreadcrumbsForPath(path: string): BreadcrumbItem[] | null {
  const row = getArchitectureRow(path);
  if (row) return row.breadcrumbs;

  if (path.startsWith('/legal/') && path !== '/legal') {
    return null;
  }

  return null;
}

export function getCertBreadcrumbItems(certId: string, currentLabel: string): BreadcrumbItem[] {
  return [HOME_CRUMB, CERTS_CRUMB, { label: currentLabel }];
}

export function getAnswerPageBreadcrumbs(page: AnswerPageContent): BreadcrumbItem[] {
  return [
    HOME_CRUMB,
    { label: 'Answers', href: '/answers' },
    { label: page.question },
  ];
}

export function getTopicHubBreadcrumbs(hub: TopicHubContent): BreadcrumbItem[] {
  return [HOME_CRUMB, { label: 'Topics', href: '/topics' }, { label: hub.h1 }];
}

export function getPmpPageBreadcrumbs(page: PmpPageContent): BreadcrumbItem[] {
  return [HOME_CRUMB, { label: 'PMP', href: '/pmp' }, { label: page.h1 }];
}

export function getLegalPageBreadcrumbs(title: string): BreadcrumbItem[] {
  return [HOME_CRUMB, LEGAL_CRUMB, { label: title }];
}

export function getCompareBreadcrumbs(): BreadcrumbItem[] {
  return getBreadcrumbsForPath('/certifications/compare') ?? [
    HOME_CRUMB,
    CERTS_CRUMB,
    { label: 'Compare Project Management Certifications' },
  ];
}

export function getCommunityBreadcrumbs(): BreadcrumbItem[] {
  return [HOME_CRUMB, { label: 'Community' }];
}

export function getMembershipBreadcrumbs(): BreadcrumbItem[] {
  return [HOME_CRUMB, { label: 'Membership' }];
}

export function getFaqBreadcrumbs(): BreadcrumbItem[] {
  return getBreadcrumbsForPath('/faq') ?? [HOME_CRUMB, { label: 'FAQ' }];
}
