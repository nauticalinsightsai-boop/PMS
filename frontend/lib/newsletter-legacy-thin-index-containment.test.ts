import { describe, expect, it } from 'vitest';
import { generateMetadata } from '@/app/(site)/newsletter/[slug]/page';
import sitemap from '@/app/sitemap';
import { isGscSoftNoindexPath } from '@/content/indexation/gsc-crawled-not-indexed-noindex';
import { isIndexablePath, robotsForPath } from '@/lib/indexing-metadata';
import { buildHtmlSitemapSections } from '@/lib/sitemap/build-html-sitemap-sections';

const LEGACY_THIN_NEWSLETTER_SLUGS = [
  '2026-pmp-exam-changes',
  'hybrid-methodologies-enterprise',
  'risk-beyond-probability-matrix',
  'ai-augmented-project-manager',
  'prince2-7th-edition-practitioner',
  'building-high-performance-pmo',
] as const;

describe.each(LEGACY_THIN_NEWSLETTER_SLUGS)(
  'legacy thin newsletter containment: %s',
  (slug) => {
    const path = `/newsletter/${slug}`;

    it('resolves through the explicit soft-noindex policy and emits noindex,nofollow', async () => {
      expect(isGscSoftNoindexPath(path)).toBe(true);
      expect(isIndexablePath(path)).toBe(false);
      expect(robotsForPath(path)).toMatchObject({ index: false, follow: false });

      const metadata = await generateMetadata({
        params: Promise.resolve({ slug }),
        searchParams: Promise.resolve({}),
      });

      expect(metadata.robots).toMatchObject({ index: false, follow: false });
    });
  },
);

describe('legacy thin newsletter sitemap containment', () => {
  it('excludes all six paths from the XML sitemap', async () => {
    const paths = new Set((await sitemap()).map((entry) => new URL(entry.url).pathname));

    for (const slug of LEGACY_THIN_NEWSLETTER_SLUGS) {
      expect(paths.has(`/newsletter/${slug}`), slug).toBe(false);
    }
  });

  it('excludes all six paths from the HTML sitemap', async () => {
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
