import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PHASE_2_PAGE_SEO } from '@/content/seo/phase-2-page-seo';

const read = (path: string) => readFileSync(path, 'utf8');

describe('detailed source-backed SEO remediation', () => {
  it('uses a public scheduling href while preserving the popup action', () => {
    const source = read('components/calendly/WebsiteCalendlyButton.tsx');
    expect(source).toContain('buildWebsiteCalendlySchedulingHref(tier, resolvedUtm)');
    expect(source).toContain('openWebsiteCalendly(tier, { funnelLabel, utm })');
    expect(source).not.toContain('buildCalendlyPopupWidgetUrl');
  });

  it('keeps exactly one PMP FAQ H1 source', () => {
    const source = `${read('app/(site)/pmp-faq/page.tsx')}\n${read('components/faq/PmpFaqPage.tsx')}`;
    expect(source.match(/<h1\b/g)).toHaveLength(1);
  });

  it('gives the pathway a title distinct from the PMP certification page', () => {
    expect(PHASE_2_PAGE_SEO['/pmp-2026-pathway'].title).toBe('PMP 2026 Study Roadmap & Tier Pathways | PM Structure');
    expect(PHASE_2_PAGE_SEO['/pmp-2026-pathway'].title).not.toBe(PHASE_2_PAGE_SEO['/certifications/pmp'].title);
  });

  it('removes avoidable legacy internal href literals from emitting surfaces', () => {
    const source = [
      read('components/answers/AnswersIndexPage.tsx'), read('components/topics/TopicsIndexPage.tsx'),
      read('components/pages/Home.tsx'), read('../packages/site-content/src/home.ts'),
    ].join('\n');
    for (const path of [
      '/newsletter/2026-pmp-exam-changes', '/newsletter/ai-augmented-project-manager',
      '/newsletter/hybrid-methodologies-enterprise',
    ]) expect(source).not.toMatch(new RegExp(`["']${path}["']`));
    expect(source).toContain("'/pmp-after-9-july-2026'");
    expect(source).toContain("'/pmp-exam-2026'");
  });
});
