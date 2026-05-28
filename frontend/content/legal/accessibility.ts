import type { LegalDocument } from './types';
import { LEGAL_LAST_UPDATED, LEGAL_SUPPORT_EMAIL, legalSupportSection, section } from './shared';
import { BRAND } from '@/lib/brand-voice';

export const accessibilityDocument: LegalDocument = {
  slug: 'accessibility',
  title: 'Accessibility Statement',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: `Our commitment to accessible digital experiences on ${BRAND.name}.`,
  sections: [
    section(
      'commitment',
      '1. Commitment',
      `${BRAND.name} aims to meet WCAG 2.2 Level AA where practicable for public marketing pages, checkout, and legal content.`,
    ),
    section(
      'measures',
      '2. Measures',
      'We use semantic HTML, keyboard-navigable components, sufficient colour contrast in our design system, and descriptive alt text for informative images.',
    ),
    section(
      'known',
      '3. Known limitations',
      'Some third-party embeds (payment, scheduling) may not be fully under our control. PDF programme previews may require assistive technology compatible viewers.',
    ),
    section(
      'feedback',
      '4. Feedback',
      `If you encounter barriers, email ${LEGAL_SUPPORT_EMAIL} with the page URL, browser, and description. We aim to respond within 10 business days.`,
    ),
    section(
      'contact',
      '5. Contact',
      legalSupportSection('accessibility'),
    ),
  ],
};
