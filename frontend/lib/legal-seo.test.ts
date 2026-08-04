import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { getAllFaqs, FAQ_COUNT_MIN } from '@/content/faq';
import { getAllLegalDocumentPaths, DYNAMIC_LEGAL_SLUGS, PRIVACY_REGION_OPTIONS } from '@/content/legal';
import { REGION_COPY } from '@/lib/brand-voice';
import { FOOTER_LEGAL_LINKS, LEGAL_HUB_PATH } from '@/constants/legal';
import { metadata as gccMetadata } from '@/app/(site)/legal/privacy/gcc/page';
import { metadata as pricingDisclaimerMetadata } from '@/app/(site)/legal/pricing-disclaimers/page';
import { generateMetadata as generateRegionalPrivacyMetadata } from '@/app/(site)/legal/privacy/[region]/page';

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
  it('gives pricing disclaimers complete self-canonical metadata without a duplicate suffix', () => {
    expect(pricingDisclaimerMetadata).toMatchObject({
      title: { absolute: 'Pricing & Certification Disclaimers | PM Structure' },
      alternates: { canonical: 'https://pmstructure.com/legal/pricing-disclaimers' },
      robots: { index: true, follow: true },
      openGraph: { title: 'Pricing & Certification Disclaimers | PM Structure', url: 'https://pmstructure.com/legal/pricing-disclaimers' },
      twitter: { title: 'Pricing & Certification Disclaimers | PM Structure' },
    });
  });
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

  it('gives each published regional privacy root complete, self-canonical metadata', async () => {
    const regionalRoots = [
      ['eu', '/legal/privacy/eu', 'Privacy Policy (EU / EEA) | PM Structure'],
      ['uk', '/legal/privacy/uk', 'Privacy Policy (United Kingdom) | PM Structure'],
      ['us', '/legal/privacy/us', 'Privacy Policy (United States) | PM Structure'],
      ['india', '/legal/privacy/india', 'Privacy Policy (India) | PM Structure'],
      ['pakistan', '/legal/privacy/pakistan', 'Privacy Policy (Pakistan) | PM Structure'],
    ] as const;

    for (const [region, path, expectedTitle] of regionalRoots) {
      const metadata = await generateRegionalPrivacyMetadata({
        params: Promise.resolve({ region }),
      });
      expect(metadata).toMatchObject({
        title: { absolute: expectedTitle },
        alternates: { canonical: `https://pmstructure.com${path}` },
        robots: { index: true, follow: true },
        openGraph: { title: expectedTitle, url: `https://pmstructure.com${path}` },
        twitter: { title: expectedTitle },
      });
      expect(metadata.description).toContain('privacy policy');
    }

    expect(gccMetadata).toMatchObject({
      title: { absolute: 'Privacy Policy (GCC) | PM Structure' },
      alternates: { canonical: 'https://pmstructure.com/legal/privacy/gcc' },
      robots: { index: true, follow: true },
      openGraph: {
        title: 'Privacy Policy (GCC) | PM Structure',
        url: 'https://pmstructure.com/legal/privacy/gcc',
      },
      twitter: { title: 'Privacy Policy (GCC) | PM Structure' },
    });
    expect(gccMetadata.description).toContain('privacy policy');

    expect(
      PRIVACY_REGION_OPTIONS.filter((option) => option.slug !== 'global').map((option) => option.href),
    ).toEqual([
      '/legal/privacy/eu',
      '/legal/privacy/uk',
      '/legal/privacy/us',
      '/legal/privacy/gcc',
      '/legal/privacy/india',
      '/legal/privacy/pakistan',
    ]);
  });
});
