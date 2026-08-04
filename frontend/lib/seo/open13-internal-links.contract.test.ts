import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  OPEN13_CERTIFICATION_LINKS,
  OPEN13_INTERNAL_LINKS,
  OPEN13_LEGAL_LINKS,
  OPEN13_NEWSLETTER_LINKS,
} from '@/content/seo/open13-internal-links';

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

    expect(newsletter).toContain('OPEN13_NEWSLETTER_LINKS.map');
    expect(newsletter).toContain('aria-label="Evidence guides"');
    expect(certifications).toContain('OPEN13_CERTIFICATION_LINKS.map');
    expect(certifications).toContain('id="specialist-pathways-heading"');
  });

  it('emits both legal targets from the terms content without legacy aliases', () => {
    const terms = read('content/legal/terms.ts');

    for (const { href, anchor } of OPEN13_LEGAL_LINKS) {
      expect(terms).toContain(`[${anchor}](${href})`);
    }
    expect(terms).not.toMatch(/\/legal\/(service-terms|community-guidelines)(?:[)'"#?]|$)/);
  });
});
