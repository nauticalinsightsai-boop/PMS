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

const entry = buildSitemapEntry;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const portalPaths = getPublishedPortalSitemapPaths();
  const newsletterArticles = await getPublishedNewsletterArticles();
  const blogArticles = await getPublishedBlogArticles();

  const marketing = [
    '/',
    '/about',
    '/contact',
    '/faq',
    '/pmp-faq',
    '/answers',
    '/topics',
    '/membership',
    '/community',
    '/pm-service',
    '/newsletter',
    '/blog',
    '/certifications',
    '/certifications/compare',
  ].map((p, i) => entry(p, i === 0 ? 1 : 0.8));

  const certs = certifications.map((c) => entry(`/certifications/${c.id}`, 0.85));

  const legal = [
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
  ].map((p) => entry(p, 0.5, 'monthly'));

  const newsletter = newsletterArticles.map((n) =>
    entry(`/newsletter/${n.slug}`, 0.6, 'monthly'),
  );

  const blog = blogArticles.map((b) => entry(`/blog/${b.slug}`, 0.6, 'monthly'));

  const portalEntries = portalPaths.map((path) => entry(path, 0.6));

  const pmpCluster = PMP_CLUSTER_PATHS.map((p) => entry(p, p === '/pmp-exam-2026' ? 0.9 : 0.85));
  const pmpCourses = PMP_COURSE_PATHS.map((p) => entry(p, 0.88));
  const pmpServices = PMP_SERVICE_PATHS.map((p) => entry(p, 0.86));
  const answers = getPublishedAnswerPaths().map((p) => entry(p, 0.84));
  const topics = getPublishedTopicPaths().map((p) => entry(p, 0.83));

  return [
    ...marketing,
    ...certs,
    ...pmpCluster,
    ...pmpCourses,
    ...pmpServices,
    ...answers,
    ...topics,
    ...legal,
    ...newsletter,
    ...blog,
    ...portalEntries,
  ];
}
