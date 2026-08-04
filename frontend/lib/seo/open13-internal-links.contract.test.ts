import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  getOpen13NewsletterEvidenceLinks,
  OPEN13_CERTIFICATION_LINKS,
  OPEN13_INTERNAL_LINKS,
  OPEN13_LEGAL_LINKS,
  OPEN13_NEWSLETTER_LINKS,
} from '@/content/seo/open13-internal-links';
import { termsDocument } from '@/content/legal/terms';

const read = (path: string) => readFileSync(path, 'utf8');

const EXPECTED_TARGETS = [
  '/newsletter/sustainable-value-delivery-practice-2026-candidates',
  '/newsletter/mena-project-talent-gap-career-evidence',
  '/legal/services',
  '/legal/acceptable-use',
  '/certifications/prince2-agile-practitioner',
  '/certifications/prince2-agile',
  '/certifications/mor',
  '/certifications/lss-champion',
  '/certifications/foundation-direct',
].sort();

describe('OPEN-13 internal-link correction', () => {
  it('binds one canonical, descriptive source-to-target row for each accepted URL', () => {
    expect(OPEN13_INTERNAL_LINKS).toHaveLength(9);
    expect(OPEN13_INTERNAL_LINKS.map(({ href }) => href).sort()).toEqual(EXPECTED_TARGETS);
    expect(new Set(OPEN13_INTERNAL_LINKS.map(({ href }) => href)).size).toBe(9);
    expect(new Set(OPEN13_INTERNAL_LINKS.map(({ sourcePath, href }) => `${sourcePath}->${href}`)).size).toBe(9);

    for (const link of OPEN13_INTERNAL_LINKS) {
      expect(link.href).toMatch(/^\/[a-z0-9/-]+$/);
      expect(link.href).not.toMatch(/[?#]|\/$/);
      expect(link.anchor.trim().split(/\s+/).length).toBeGreaterThanOrEqual(3);
      expect(link.anchor.toLowerCase()).not.toMatch(/^(click here|learn more|read more|view page)$/);
    }
  });

  it('keeps the nine rows in three bounded, intent-relevant source groups', () => {
    expect(OPEN13_NEWSLETTER_LINKS).toHaveLength(2);
    expect(OPEN13_CERTIFICATION_LINKS).toHaveLength(5);
    expect(OPEN13_LEGAL_LINKS).toHaveLength(2);
    expect(OPEN13_NEWSLETTER_LINKS.every(({ sourcePath }) => sourcePath === '/newsletter')).toBe(true);
    expect(OPEN13_CERTIFICATION_LINKS.every(({ sourcePath }) => sourcePath === '/certifications')).toBe(true);
    expect(OPEN13_LEGAL_LINKS.every(({ sourcePath }) => sourcePath === '/legal/terms')).toBe(true);
  });

  it('emits the registry links from the newsletter and certification hubs', () => {
    const newsletter = read('components/pages/Newsletter.tsx');
    const certifications = read('components/pages/Certifications.tsx');

    expect(newsletter).toContain('newsletterEvidenceLinks.map');
    expect(newsletter).toContain('getOpen13NewsletterEvidenceLinks(articleCardHrefs)');
    expect(newsletter).toContain('aria-label="Evidence guides"');
    expect(certifications).toContain('OPEN13_CERTIFICATION_LINKS.map');
    expect(certifications).toContain('id="specialist-pathways-heading"');
  });

  it('emits both legal targets as typed native links without parsing Markdown', () => {
    const terms = read('content/legal/terms.ts');
    const legalSectionList = read('components/legal/LegalSectionList.tsx');
    const emittedLinks = termsDocument.sections.flatMap((section) => section.links ?? []);

    expect(emittedLinks).toEqual(
      OPEN13_LEGAL_LINKS.map(({ href, anchor }) => ({ href, label: anchor })),
    );
    expect(terms).not.toMatch(/\[[^\]]+\]\(\/legal\/(?:services|acceptable-use)\)/);
    expect(legalSectionList).toContain("import Link from 'next/link'");
    expect(legalSectionList).toContain('<Link');
    expect(legalSectionList).toContain('href={link.href}');
    expect(legalSectionList).toContain('{link.label}');
    expect(terms).not.toMatch(/\/legal\/(service-terms|community-guidelines)(?:[)'"#?]|$)/);
  });

  it('suppresses CMS-present article-card duplicates and preserves absent-card fallbacks', () => {
    const [first, second] = OPEN13_NEWSLETTER_LINKS;
    const present = getOpen13NewsletterEvidenceLinks([first.href, '/newsletter/unrelated']);
    const bothPresent = getOpen13NewsletterEvidenceLinks([first.href, second.href]);
    const fallback = getOpen13NewsletterEvidenceLinks(['/newsletter/unrelated']);

    expect(present.map(({ href }) => href)).toEqual([second.href]);
    expect(bothPresent).toEqual([]);
    expect(fallback.map(({ href }) => href)).toEqual([first.href, second.href]);

    const presentCounts = [first.href, ...present.map(({ href }) => href)].reduce<Record<string, number>>(
      (counts, href) => ({ ...counts, [href]: (counts[href] ?? 0) + 1 }),
      {},
    );
    const fallbackCounts = fallback.reduce<Record<string, number>>(
      (counts, { href }) => ({ ...counts, [href]: (counts[href] ?? 0) + 1 }),
      {},
    );
    const bothPresentCounts = [first.href, second.href].reduce<Record<string, number>>(
      (counts, href) => ({ ...counts, [href]: (counts[href] ?? 0) + 1 }),
      {},
    );

    for (const { href } of OPEN13_NEWSLETTER_LINKS) {
      expect(presentCounts[href]).toBe(1);
      expect(bothPresentCounts[href]).toBe(1);
      expect(fallbackCounts[href]).toBe(1);
    }
  });
});
