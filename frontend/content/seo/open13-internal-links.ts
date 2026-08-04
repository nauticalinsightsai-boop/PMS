export type Open13InternalLink = {
  sourcePath: '/newsletter' | '/certifications' | '/legal/terms';
  href: string;
  anchor: string;
};

export const OPEN13_NEWSLETTER_LINKS = [
  {
    sourcePath: '/newsletter',
    href: '/newsletter/sustainable-value-delivery-practice-2026-candidates',
    anchor: 'Sustainable value delivery practice for 2026 candidates',
  },
  {
    sourcePath: '/newsletter',
    href: '/newsletter/mena-project-talent-gap-career-evidence',
    anchor: 'MENA project talent gap: career evidence guide',
  },
] as const satisfies readonly Open13InternalLink[];

export const OPEN13_CERTIFICATION_LINKS = [
  {
    sourcePath: '/certifications',
    href: '/certifications/prince2-agile',
    anchor: 'PRINCE2 Agile Foundation pathway',
  },
  {
    sourcePath: '/certifications',
    href: '/certifications/prince2-agile-practitioner',
    anchor: 'PRINCE2 Agile Practitioner pathway',
  },
  {
    sourcePath: '/certifications',
    href: '/certifications/mor',
    anchor: 'Management of Risk (M_o_R) pathway',
  },
  {
    sourcePath: '/certifications',
    href: '/certifications/lss-champion',
    anchor: 'Six Sigma Champion pathway',
  },
  {
    sourcePath: '/certifications',
    href: '/certifications/foundation-direct',
    anchor: 'Foundation Direct pathway',
  },
] as const satisfies readonly Open13InternalLink[];

export const OPEN13_LEGAL_LINKS = [
  {
    sourcePath: '/legal/terms',
    href: '/legal/services',
    anchor: 'PM Structure Services Terms',
  },
  {
    sourcePath: '/legal/terms',
    href: '/legal/acceptable-use',
    anchor: 'Acceptable Use & Community Guidelines',
  },
] as const satisfies readonly Open13InternalLink[];

export const OPEN13_INTERNAL_LINKS = [
  ...OPEN13_NEWSLETTER_LINKS,
  ...OPEN13_CERTIFICATION_LINKS,
  ...OPEN13_LEGAL_LINKS,
] as const satisfies readonly Open13InternalLink[];

export function getOpen13NewsletterEvidenceLinks(articleCardHrefs: readonly string[]) {
  const emittedArticleHrefs = new Set(articleCardHrefs);
  return OPEN13_NEWSLETTER_LINKS.filter(({ href }) => !emittedArticleHrefs.has(href));
}
