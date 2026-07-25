import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import nextConfig from '../next.config';
import { LEGACY_THIN_NEWSLETTER_SLUGS } from '@/content/newsletter/publication';
import { buildHtmlSitemapSections } from '@/lib/sitemap/build-html-sitemap-sections';

describe('legacy thin newsletter sitemap containment', () => {
  it('permanently redirects all seven thin paths to substantive replacements', async () => {
    const redirects =
      typeof nextConfig.redirects === 'function' ? await nextConfig.redirects() : [];

    for (const slug of LEGACY_THIN_NEWSLETTER_SLUGS) {
      const rule = redirects.find((entry) => entry.source === `/newsletter/${slug}`);
      expect(rule, slug).toBeDefined();
      expect(rule?.permanent, slug).toBe(true);
      expect(rule?.destination, slug).not.toBe('/newsletter');
    }
  });

  it('excludes all seven paths from the XML sitemap', async () => {
    const paths = new Set((await sitemap()).map((entry) => new URL(entry.url).pathname));

    for (const slug of LEGACY_THIN_NEWSLETTER_SLUGS) {
      expect(paths.has(`/newsletter/${slug}`), slug).toBe(false);
    }
  });

  it('excludes all seven paths from the HTML sitemap', async () => {
    const paths = new Set(
      (await buildHtmlSitemapSections())
        .flatMap((section) => section.links)
        .map((entry) => entry.href),
    );

    for (const slug of LEGACY_THIN_NEWSLETTER_SLUGS) {
      expect(paths.has(`/newsletter/${slug}`), slug).toBe(false);
    }
  });
});
