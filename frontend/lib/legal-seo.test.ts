import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { getAllFaqs, FAQ_COUNT_MIN } from '@/content/faq';
import { getAllLegalDocumentPaths, DYNAMIC_LEGAL_SLUGS } from '@/content/legal';
import { REGION_COPY } from '@/lib/brand-voice';
import { FOOTER_LEGAL_LINKS, LEGAL_HUB_PATH } from '@/constants/legal';

const BANNED = [
  'draft template',
  'counsel review',
  'legal@pmstructure',
  '(placeholder)',
  'Template reference only',
  'confirm with local counsel',
];

function readLegalAndFaqSources(): string {
  const root = path.join(process.cwd(), 'content');
  const legalDir = path.join(root, 'legal');
  const parts: string[] = [];
  const walk = (dir: string) => {
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name.endsWith('.ts')) parts.push(readFileSync(full, 'utf8'));
    }
  };
  walk(legalDir);
  parts.push(readFileSync(path.join(root, 'faq', 'data.ts'), 'utf8'));
  return parts.join('\n');
}

describe('legal-seo', () => {
  it('has minimum FAQ count for AEO', () => {
    expect(getAllFaqs().length).toBeGreaterThanOrEqual(FAQ_COUNT_MIN);
  });

  it('pricing FAQ answers include REGION_COPY pricingSelector', () => {
    const pricingFaqs = getAllFaqs().filter((f) => f.clusterId === 'pricing');
    const combined = pricingFaqs.map((f) => f.answer).join(' ');
    expect(combined).toContain(REGION_COPY.pricingSelector);
    expect(combined).toContain(REGION_COPY.southAsiaNote);
  });

  it('legal hub paths use /legal not /legalhub', () => {
    expect(LEGAL_HUB_PATH).toBe('/legal');
    for (const link of FOOTER_LEGAL_LINKS) {
      expect(link.href).not.toContain('/legalhub');
    }
    const paths = getAllLegalDocumentPaths();
    expect(paths.every((p) => !p.includes('legalhub'))).toBe(true);
    expect(DYNAMIC_LEGAL_SLUGS.length).toBeGreaterThanOrEqual(12);
  });

  it('published legal and FAQ copy has no banned draft/placeholder strings', () => {
    const src = readLegalAndFaqSources();
    for (const phrase of BANNED) {
      expect(src.toLowerCase()).not.toContain(phrase.toLowerCase());
    }
  });

  it('privacy and support FAQ clusters reference support email', () => {
    const combined = getAllFaqs()
      .filter((f) => f.clusterId === 'privacy' || f.clusterId === 'support')
      .map((f) => f.answer)
      .join(' ');
    expect(combined).toContain('support@pmstructure.com');
    expect(combined).not.toContain('legal@pmstructure.com');
  });
});
