import type { MetadataRoute } from 'next';
import { certifications } from '@/data/siteData';
import { getPublishedNewsletterArticles } from '@/lib/newsletter/articles';
import { DYNAMIC_LEGAL_SLUGS } from '@/content/legal/registry';
import { PRIVACY_REGION_OPTIONS, GCC_COUNTRY_SLUGS } from '@/content/legal';
import { buildSitemapEntry } from '@/lib/sitemap/helpers';
import { PMP_COURSE_PATHS } from '@/content/pmp/courses';
import { PMP_CLUSTER_PATHS } from '@/content/pmp/pages';
import { PMP_SERVICE_PATHS } from '@/content/pmp/services';
import { getPublishedAnswerPaths } from '@/content/answers';
import { getPublishedTopicPaths } from '@/content/topics';
import { isConsolidatedSeoPath } from '@/content/seo/consolidated-paths';

type SitemapFreq = MetadataRoute.Sitemap[0]['changeFrequency'];

type RouteSpec = {
  path: string;
  priority: number;
  changeFrequency?: SitemapFreq;
};

const entry = buildSitemapEntry;

const FIXED_PUBLISHED_NEWSLETTER_ENTRIES = [
  { path: '/newsletter/pmi-rmp-2026-domain-map-five-domain-study-plan', publishedAt: '2026-08-04T01:07:06.733Z' },
  { path: '/newsletter/pmi-rmp-eligibility-separate-risk-experience-general-project-work', publishedAt: '2026-08-04T01:08:27.700Z' },
] as const;

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

async function safeNewsletterArticles() {
  try {
    return await getPublishedNewsletterArticles();
  } catch {
    return [];
  }
}

function safePathsToEntries(
  paths: string[],
  priority: number,
  changeFrequency: SitemapFreq = 'monthly',
): MetadataRoute.Sitemap {
  try {
    return paths
      .filter((path) => !isConsolidatedSeoPath(path))
      .map((path) => safeEntry(path, priority, changeFrequency))
      .filter((e): e is MetadataRoute.Sitemap[0] => e !== null);
  } catch {
    return [];
  }
}

function buildCertEntries(): MetadataRoute.Sitemap {
  try {
    return certifications
      .map((c) => {
        const isPmp = c.id === 'pmp';
        return safeEntry(
          `/certifications/${c.id}`,
          isPmp ? 0.9 : 0.8,
          isPmp ? 'weekly' : 'monthly',
        );
      })
      .filter((e): e is MetadataRoute.Sitemap[0] => e !== null);
  } catch {
    return [];
  }
}

function buildLegalEntries(): MetadataRoute.Sitemap {
  try {
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
    ];
    return safePathsToEntries(legalPaths, 0.3, 'yearly');
  } catch {
    return [];
  }
}

function buildPmpClusterEntries(): MetadataRoute.Sitemap {
  const PMP_PRIORITY_PATHS = new Set(['/pmp-exam-2026']);
  try {
    return PMP_CLUSTER_PATHS.filter((p) => !isConsolidatedSeoPath(p)).map((p) =>
      safeEntry(
        p,
        PMP_PRIORITY_PATHS.has(p) ? 0.9 : 0.85,
        PMP_PRIORITY_PATHS.has(p) ? 'weekly' : 'monthly',
      ),
    ).filter((e): e is MetadataRoute.Sitemap[0] => e !== null);
  } catch {
    return [];
  }
}

function buildAnswerEntries(): MetadataRoute.Sitemap {
  try {
    return safePathsToEntries(getPublishedAnswerPaths(), 0.7, 'monthly');
  } catch {
    return [];
  }
}

function buildTopicEntries(): MetadataRoute.Sitemap {
  try {
    return safePathsToEntries(getPublishedTopicPaths(), 0.7, 'monthly');
  } catch {
    return [];
  }
}

function dedupeSitemap(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  return entries.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
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
  { path: '/sitemap', priority: 0.3, changeFrequency: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    return await buildSitemap();
  } catch {
    return entriesFromSpecs(MARKETING_ROUTES);
  }
}

export async function buildSitemap(
  newsletterSlugsOverride?: readonly string[],
): Promise<MetadataRoute.Sitemap> {
  const newsletterSlugs = newsletterSlugsOverride ?? (await safeNewsletterArticles()).map((article) => article.slug);

  const newsletter = newsletterSlugs
    .map((slug) => safeEntry(`/newsletter/${slug}`, 0.6, 'monthly'))
    .filter((e): e is MetadataRoute.Sitemap[0] => e !== null);

  const fixedPublishedNewsletter: MetadataRoute.Sitemap = FIXED_PUBLISHED_NEWSLETTER_ENTRIES.flatMap(({ path, publishedAt }) => {
    const sitemapEntry = safeEntry(path, 0.6, 'monthly');
    return sitemapEntry ? [{ ...sitemapEntry, lastModified: new Date(publishedAt) }] : [];
  });

  return dedupeSitemap([
    ...entriesFromSpecs(MARKETING_ROUTES),
    ...buildCertEntries(),
    ...buildPmpClusterEntries(),
    ...safePathsToEntries([...PMP_COURSE_PATHS], 0.85, 'monthly'),
    ...safePathsToEntries([...PMP_SERVICE_PATHS], 0.85, 'monthly'),
    ...buildAnswerEntries(),
    ...buildTopicEntries(),
    ...buildLegalEntries(),
    ...fixedPublishedNewsletter,
    ...newsletter,
  ]);
}
