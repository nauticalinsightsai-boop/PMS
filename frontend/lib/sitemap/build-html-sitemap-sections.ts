import { getPublishedAnswerPages } from '@/content/answers';
import {
  GCC_COUNTRY_SLUGS,
  PRIVACY_REGION_OPTIONS,
  getGccCountryPrivacyDocument,
  getLegalDocumentBySlug,
  legalHubSections,
} from '@/content/legal';
import { PMP_COURSE_PAGES, PMP_COURSE_PATHS } from '@/content/pmp/courses';
import { PMP_CLUSTER_PATHS, PMP_HUB_CARDS } from '@/content/pmp/pages';
import { PMP_SERVICE_PAGES } from '@/content/pmp/services';
import { TOPIC_HUB_GROUPS, getPublishedTopicHubs } from '@/content/topics';
import type { HtmlSitemapLink, HtmlSitemapSection } from '@/content/sitemap/html-sitemap-sections';
import { getAllIndexationStrategyRows } from '@/content/indexation/strategy';
import { getPublishedNewsletterArticles } from '@/lib/newsletter/articles';
import { getPublishedNewsletterAuthors } from '@/lib/newsletter/authors';
import { certifications } from '@/data/siteData';
import { isIndexablePath, normalizePath } from '@/lib/indexing-metadata';
import { isConsolidatedSeoPath } from '@/content/seo/consolidated-paths';

function link(href: string, label: string): HtmlSitemapLink {
  return { href: normalizePath(href), label };
}

function humanizePath(path: string): string {
  const slug = path.replace(/^\//, '').split('/').pop() ?? path;
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const PMP_PATH_LABELS = new Map<string, string>([
  ...PMP_HUB_CARDS.map((card) => [card.path, card.title] as const),
  ...PMP_COURSE_PAGES.map((course) => [course.path, course.h1] as const),
  ...PMP_SERVICE_PAGES.map((service) => [service.path, service.h1] as const),
  ['/pmp', 'PMP hub'],
  ['/pmp-enrollment', 'PMP enrollment hub'],
  ['/pmp-faq', 'PMP FAQ'],
]);

function legalLabelForPath(path: string): string | null {
  for (const section of legalHubSections) {
    for (const card of section.cards) {
      const base = card.href.split('#')[0] ?? card.href;
      if (path === base) return card.title;
    }
  }

  for (const region of PRIVACY_REGION_OPTIONS) {
    if (path === region.href) return `${region.label} privacy`;
  }

  if (path === '/legal/privacy/gcc') return 'GCC privacy addendum';

  for (const slug of GCC_COUNTRY_SLUGS) {
    if (path === `/legal/privacy/gcc/${slug}`) {
      return getGccCountryPrivacyDocument(slug).title;
    }
  }

  const slug = path.replace(/^\/legal\//, '');
  const doc = getLegalDocumentBySlug(slug);
  return doc?.title ?? null;
}

function labelForPath(path: string): string {
  const normalized = normalizePath(path);
  if (normalized === '/') return 'Home';

  const pmpLabel = PMP_PATH_LABELS.get(normalized);
  if (pmpLabel) return pmpLabel;

  const cert = certifications.find((c) => normalized === `/certifications/${c.id}`);
  if (cert) return cert.name;

  const answer = getPublishedAnswerPages().find((p) => p.path === normalized);
  if (answer) return answer.question;

  const topic = getPublishedTopicHubs().find((p) => p.path === normalized);
  if (topic) {
    return topic.h1.replace(/\s*[·—-]\s*PM Structure.*$/i, '').trim() || topic.title;
  }

  const legalDoc = legalLabelForPath(normalized);
  if (legalDoc) return legalDoc;

  if (normalized === '/certifications') return 'Certification hub';
  if (normalized === '/certifications/compare') return 'Compare certification pathways';
  if (normalized === '/certifications/pmp') return 'PMP certification pathway';
  if (normalized === '/answers') return 'Direct answers index';
  if (normalized === '/topics') return 'Topic hubs index';
  if (normalized === '/faq') return 'FAQ';
  if (normalized === '/community') return 'Community';
  if (normalized === '/membership') return 'Membership';
  if (normalized === '/pm-service') return 'PM Service';
  if (normalized === '/newsletter') return 'Newsletter';
  if (normalized === '/about') return 'About';
  if (normalized === '/contact') return 'Contact';
  if (normalized === '/legal') return 'Legal hub';
  if (normalized === '/legal/terms') return 'Terms & Conditions';
  if (normalized === '/legal/privacy') return 'Privacy Policy';
  if (normalized === '/legal/cookies') return 'Cookie Policy';
  if (normalized === '/legal/services') return 'Services Terms';
  if (normalized === '/legal/pricing-disclaimers') return 'Pricing disclaimers';

  const regionPrivacy = PRIVACY_REGION_OPTIONS.find((r) => r.href === normalized);
  if (regionPrivacy) return regionPrivacy.label;

  if (normalized.startsWith('/newsletter/')) {
    const slug = normalized.replace('/newsletter/', '');
    return humanizePath(slug);
  }

  return humanizePath(normalized);
}

function sortLinks(links: HtmlSitemapLink[]): HtmlSitemapLink[] {
  return [...links].sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
}

function dedupeLinks(links: HtmlSitemapLink[]): HtmlSitemapLink[] {
  const seen = new Set<string>();
  return links.filter((item) => {
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });
}

export function getXmlSitemapUrlCount(): number {
  return getAllIndexationStrategyRows().filter(
    (row) => row.includeInSitemap && !isConsolidatedSeoPath(row.path),
  ).length;
}

export async function buildHtmlSitemapSections(): Promise<HtmlSitemapSection[]> {
  const [newsletterArticles, newsletterAuthors] = await Promise.all([
    getPublishedNewsletterArticles().catch(() => []),
    getPublishedNewsletterAuthors().catch(() => []),
  ]);

  const startHerePaths = [
    '/',
    '/certifications',
    '/certifications/compare',
    '/certifications/pmp',
    '/faq',
    '/pmp-faq',
    '/contact',
  ];

  const pmpPaths = dedupeLinks(
    [
      ...PMP_CLUSTER_PATHS,
      ...PMP_COURSE_PATHS,
      ...PMP_SERVICE_PAGES.map((s) => s.path),
      '/pmp-enrollment',
      '/answers/is-the-pmp-exam-changing-in-2026',
    ]
      .filter((path) => !isConsolidatedSeoPath(path))
      .map((path) => link(path, labelForPath(path))),
  );

  const certPaths = sortLinks(
    certifications.map((cert) => link(`/certifications/${cert.id}`, cert.name)),
  );

  const answerPaths = sortLinks(
    getPublishedAnswerPages()
      .filter((page) => !isConsolidatedSeoPath(page.path))
      .map((page) => link(page.path, page.question)),
  );

  const topicLinksBySlug = new Map(
    getPublishedTopicHubs()
      .filter((hub) => !isConsolidatedSeoPath(hub.path))
      .map((hub) => [hub.slug, link(hub.path, labelForPath(hub.path))]),
  );

  const topicSections: HtmlSitemapSection[] = TOPIC_HUB_GROUPS.map((group) => ({
    title: group.h2,
    links: sortLinks(
      group.slugs
        .map((slug) => topicLinksBySlug.get(slug))
        .filter((item): item is HtmlSitemapLink => Boolean(item)),
    ),
  })).filter((section) => section.links.length > 0);

  const authorPaths = newsletterAuthors
    .filter((author) => author.status === 'active' && author.slug)
    .map((author) => `/newsletter/author/${author.slug}`)
    .filter(isIndexablePath);

  const communityPaths = [
    '/community',
    '/membership',
    '/pm-service',
    '/newsletter',
    '/about',
    ...newsletterArticles
      .map((article) => `/newsletter/${article.slug}`)
      .filter(isIndexablePath),
    ...authorPaths,
  ];

  const legalPaths = getAllIndexationStrategyRows()
    .filter((row) => row.includeInSitemap && row.path.startsWith('/legal'))
    .map((row) => link(row.path, labelForPath(row.path)));

  const sections: HtmlSitemapSection[] = [
    {
      title: 'Start here',
      links: startHerePaths.map((path) => link(path, labelForPath(path))),
    },
    {
      title: 'PMP 2026 readiness',
      links: sortLinks(pmpPaths),
    },
    {
      title: 'Certification pathways',
      links: certPaths,
    },
    {
      title: 'Answer guides',
      links: answerPaths,
    },
    ...topicSections,
    {
      title: 'Community & newsletter',
      links: sortLinks(communityPaths.map((path) => link(path, labelForPath(path)))),
    },
    {
      title: 'Legal & policies',
      links: sortLinks(dedupeLinks(legalPaths)),
    },
  ];

  return sections.filter((section) => section.links.length > 0);
}
