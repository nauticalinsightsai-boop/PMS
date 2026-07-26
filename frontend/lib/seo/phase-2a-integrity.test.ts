import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { buildPageMetadata } from '@/lib/site-metadata';
import { getPhase2Seo } from '@/content/seo/phase-2-page-seo';
import { PMP_PATHWAY_PAGE } from '@/content/pmp/pathway-page';
import { isConsolidatedSeoPath } from '@/content/seo/consolidated-paths';
import { buildSitemapEntry } from '@/lib/sitemap/helpers';
import { DEFAULT_HOME_INSIGHTS } from '@pms/site-content/home';
import { PMS_SITE_URL } from '@/config/pms-site';

const frontendRoot = path.join(process.cwd());

function readFrontend(...parts: string[]) {
  return readFileSync(path.join(frontendRoot, ...parts), 'utf8');
}

describe('Phase 2A SEO integrity', () => {
  it('emits self-canonicals for the eight legal routes', () => {
    const paths = [
      '/legal/services',
      '/legal/pricing-disclaimers',
      '/legal/privacy/eu',
      '/legal/privacy/uk',
      '/legal/privacy/us',
      '/legal/privacy/gcc',
      '/legal/privacy/india',
      '/legal/privacy/pakistan',
    ];

    for (const route of paths) {
      const meta = buildPageMetadata({
        title: 'Example',
        path: route,
      });
      expect(meta.alternates?.canonical).toBe(`${PMS_SITE_URL}${route}`);
      expect(String(meta.title)).not.toMatch(/PM Structure \| PM Structure/);
    }

    const services = readFrontend('app/(site)/legal/services/page.tsx');
    const pricing = readFrontend('app/(site)/legal/pricing-disclaimers/page.tsx');
    const privacy = readFrontend('app/(site)/legal/privacy/[region]/page.tsx');
    const privacyGcc = readFrontend('app/(site)/legal/privacy/gcc/page.tsx');
    expect(services).toContain("path: '/legal/services'");
    expect(services).toContain('buildPageMetadata');
    expect(pricing).toContain("path: '/legal/pricing-disclaimers'");
    expect(privacy).toContain('buildPageMetadata');
    expect(privacy).toContain('`/legal/privacy/${slug}`');
    expect(privacyGcc).toContain('buildPageMetadata');
    expect(privacyGcc).toContain("path: '/legal/privacy/gcc'");
    expect(privacyGcc).not.toContain('| ${BRAND.name}');
    expect(privacyGcc).not.toContain('| PM Structure');
  });

  it('keeps a single /pmp-faq H1 source and absolute title without duplicate brand suffix', () => {
    const page = readFrontend('app/(site)/pmp-faq/page.tsx');
    const faq = readFrontend('components/faq/PmpFaqPage.tsx');
    expect(page).not.toMatch(/<h1[\s>]/);
    expect((faq.match(/<h1[\s>]/g) || []).length).toBe(1);
    expect(page).toContain("title: 'PMP Frequently Asked Questions'");
    expect(page).not.toContain('| PM Structure');
  });

  it('restores Community H1 → H2 → H3 hierarchy for channels', () => {
    const community = readFrontend('components/pages/Community.tsx');
    expect(community).toMatch(/<h2[^>]*>[\s\S]*Community channels/);
    expect(community).toMatch(/<h3 className="text-2xl font-bold tracking-tight">\{channel\.title\}<\/h3>/);
  });

  it('separates /certifications/pmp and /pmp-2026-pathway search intent', () => {
    const cert = getPhase2Seo('/certifications/pmp');
    const pathway = getPhase2Seo('/pmp-2026-pathway');
    expect(cert?.title).toBeTruthy();
    expect(pathway?.title).toBeTruthy();
    expect(cert?.title).not.toBe(pathway?.title);
    expect(cert?.h1).not.toBe(pathway?.h1);
    expect(cert?.title?.toLowerCase()).toMatch(/credential|exam overview|certification/);
    expect(pathway?.title?.toLowerCase()).toMatch(/readiness|preparation|roadmap/);
    expect(PMP_PATHWAY_PAGE.title).toBe(pathway?.title);
    expect(PMP_PATHWAY_PAGE.h1).toBe(pathway?.h1);
  });

  it('points the homepage salary-card replacement at matching post-transition content', () => {
    const insight = DEFAULT_HOME_INSIGHTS.items.find((item) =>
      item.href.includes('post-transition-pmp-reset-july-2026'),
    );
    expect(insight).toBeTruthy();
    expect(insight?.title.toLowerCase()).toMatch(/post-transition|reset/);
    expect(insight?.href).toBe('/newsletter/post-transition-pmp-reset-july-2026');

    const home = readFrontend('components/pages/Home.tsx');
    expect(home).toContain('/newsletter/post-transition-pmp-reset-july-2026');
    expect(home).not.toContain('/newsletter/2026-pmp-exam-changes');
    expect(home).not.toContain('2026 Salary Trends');
  });

  it('replaces consolidated /topics/pmp-exam-2026 aliases in newsletter sources', () => {
    const registry = readFileSync(
      path.join(frontendRoot, '..', 'packages', 'site-content', 'src', 'newsletter-draft-registry.ts'),
      'utf8',
    );
    expect(registry).not.toContain('/topics/pmp-exam-2026');
    expect(registry).toContain('/pmp-exam-2026');
    expect(isConsolidatedSeoPath('/topics/pmp-exam-2026')).toBe(true);
  });

  it('omits lastmod when unsupported and accepts page-specific dates', () => {
    const without = buildSitemapEntry('/about', 0.5, 'monthly');
    expect(without).not.toHaveProperty('lastModified');

    const withDate = buildSitemapEntry('/newsletter/example', 0.6, 'monthly', '2026-07-25T00:00:00.000Z');
    expect(withDate.lastModified).toEqual(new Date('2026-07-25T00:00:00.000Z'));
  });

  it('documents sitemap decisions for authors vs consolidated topic alias', () => {
    const sitemap = readFrontend('app/sitemap.ts');
    expect(sitemap).toContain('buildNewsletterAuthorEntries');
    expect(sitemap).toContain('/newsletter/author/');
    expect(sitemap).toContain('/topics/pmp-exam-2026');
    expect(sitemap).toContain('isConsolidatedSeoPath');
  });
});
