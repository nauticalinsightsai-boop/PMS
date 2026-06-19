import type { MetadataRoute } from 'next';
import { getPublishedPortalSitemapPaths } from '@pms/booking-crm';
import { certifications } from '@/data/siteData';
import { getPublishedNewsletterArticles } from '@/lib/newsletter/articles';
import { getPublishedBlogArticles } from '@/lib/blog/posts';
import { DYNAMIC_LEGAL_SLUGS } from '@/content/legal/registry';
import { PRIVACY_REGION_OPTIONS, GCC_COUNTRY_SLUGS } from '@/content/legal';
import { buildSitemapEntry } from '@/lib/sitemap/helpers';
import { PMP_COURSE_PATHS } from '@/content/pmp/courses';
import { PMP_CLUSTER_PATHS } from '@/content/pmp/pages';
import { PMP_SERVICE_PATHS } from '@/content/pmp/services';
import { getPublishedAnswerPaths } from '@/content/answers';
import { getPublishedTopicPaths } from '@/content/topics';

type SitemapFreq = MetadataRoute.Sitemap[0]['changeFrequency'];

type RouteSpec = {
  path: string;
  priority: number;
  changeFrequency?: SitemapFreq;
};

const entry = buildSitemapEntry;

function safeEntry(
  path: string,
  priority: number,
  changeFrequency?: SitemapFreq,
): MetadataRoute.Sitemap[0] | null {
  try {
    return entry(path, priority, changeFrequency);
  } catch {
    return null;
  }
}

function entriesFromSpecs(specs: RouteSpec[]): MetadataRoute.Sitemap {
  return specs
    .map(({ path, priority, changeFrequency }) => safeEntry(path, priority, changeFrequency))
    .filter((e): e is MetadataRoute.Sitemap[0] => e !== null);
}

function safePortalPaths(): string[] {
  try {
    return getPublishedPortalSitemapPaths();
  } catch {
    return [];
  }
}

async function safeNewsletterArticles() {
  try {
    return await getPublishedNewsletterArticles();
  } catch {
    return [];
  }
}

async function safeBlogArticles() {
  try {
    return await getPublishedBlogArticles();
  } catch {
    return [];
  }
}

const MARKETING_ROUTES: RouteSpec[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/certifications', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/certifications/compare', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/answers', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/topics', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/pmp-faq', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/community', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/membership', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/pm-service', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/newsletter', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/sitemap', priority: 0.3, changeFrequency: 'monthly' },
];

const PMP_PRIORITY_PATHS = new Set(['/pmp-exam-2026']);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    return await buildSitemap();
  } catch {
    return entriesFromSpecs(MARKETING_ROUTES);
  }
}

async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  const portalPaths = safePortalPaths();
  const newsletterArticles = await safeNewsletterArticles();
  const blogArticles = await safeBlogArticles();

  const certs = certifications
    .map((c) => {
      const isPmp = c.id === 'pmp';
      return safeEntry(
        `/certifications/${c.id}`,
        isPmp ? 0.9 : 0.8,
        isPmp ? 'weekly' : 'monthly',
      );
    })
    .filter((e): e is MetadataRoute.Sitemap[0] => e !== null);

  const legalPaths = [
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
  ]
    .map((p) => safeEntry(p, 0.3, 'yearly'))
    .filter((e): e is MetadataRoute.Sitemap[0] => e !== null);

  const newsletter = newsletterArticles
    .map((n) => safeEntry(`/newsletter/${n.slug}`, 0.6, 'monthly'))
    .filter((e): e is MetadataRoute.Sitemap[0] => e !== null);

  const blog = blogArticles
    .map((b) => safeEntry(`/blog/${b.slug}`, 0.6, 'monthly'))
    .filter((e): e is MetadataRoute.Sitemap[0] => e !== null);

  const portalEntries = portalPaths
    .map((path) => safeEntry(path, 0.5, 'monthly'))
    .filter((e): e is MetadataRoute.Sitemap[0] => e !== null);

  const pmpCluster = PMP_CLUSTER_PATHS.map((p) =>
    safeEntry(
      p,
      PMP_PRIORITY_PATHS.has(p) ? 0.9 : 0.85,
      PMP_PRIORITY_PATHS.has(p) ? 'weekly' : 'monthly',
    ),
  ).filter((e): e is MetadataRoute.Sitemap[0] => e !== null);

  const pmpCourses = PMP_COURSE_PATHS.map((p) => safeEntry(p, 0.85, 'monthly')).filter(
    (e): e is MetadataRoute.Sitemap[0] => e !== null,
  );
  const pmpServices = PMP_SERVICE_PATHS.map((p) => safeEntry(p, 0.85, 'monthly')).filter(
    (e): e is MetadataRoute.Sitemap[0] => e !== null,
  );
  const answers = getPublishedAnswerPaths()
    .map((p) => safeEntry(p, 0.7, 'monthly'))
    .filter((e): e is MetadataRoute.Sitemap[0] => e !== null);
  const topics = getPublishedTopicPaths()
    .map((p) => safeEntry(p, 0.7, 'monthly'))
    .filter((e): e is MetadataRoute.Sitemap[0] => e !== null);

  return [
    ...entriesFromSpecs(MARKETING_ROUTES),
    ...certs,
    ...pmpCluster,
    ...pmpCourses,
    ...pmpServices,
    ...answers,
    ...topics,
    ...legalPaths,
    ...newsletter,
    ...blog,
    ...portalEntries,
  ];
}
