import type { MetadataRoute } from 'next';
import { getPublishedPortalSitemapPaths } from '@pms/booking-crm';
import { PMS_SITE_URL } from '@/config/pms-site';
import { certifications } from '@/data/siteData';
import { getPublishedNewsletterArticles } from '@/lib/newsletter/articles';
import { getPublishedBlogArticles } from '@/lib/blog/posts';
import { DYNAMIC_LEGAL_SLUGS } from '@/content/legal/registry';
import { PRIVACY_REGION_OPTIONS, GCC_COUNTRY_SLUGS } from '@/content/legal';

const siteUrl = PMS_SITE_URL;

function entry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'] = 'weekly',
): MetadataRoute.Sitemap[0] {
  return {
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const portalPaths = getPublishedPortalSitemapPaths();
  const newsletterArticles = await getPublishedNewsletterArticles();
  const blogArticles = await getPublishedBlogArticles();

  const marketing = [
    '/',
    '/about',
    '/contact',
    '/faq',
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

  return [...marketing, ...certs, ...legal, ...newsletter, ...blog, ...portalEntries];
}
