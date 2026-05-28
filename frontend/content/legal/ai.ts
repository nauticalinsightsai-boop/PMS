import type { LegalDocument } from './types';
import { LEGAL_LAST_UPDATED, legalSupportSection, section } from './shared';
import { BRAND } from '@/lib/brand-voice';

export const aiDocument: LegalDocument = {
  slug: 'ai',
  title: 'AI Use Disclosure',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'How AI may be used in our products and communications.',
  sections: [
    section(
      'scope',
      '1. Scope',
      `${BRAND.name} may use AI-assisted tools internally for content drafting, support suggestions, or member features where disclosed. We do not use your exam responses to train public models without consent.`,
    ),
    section(
      'accuracy',
      '2. Accuracy',
      'AI-generated suggestions are not a substitute for official certification body guidance or professional advice. Verify eligibility and exam rules on official sites.',
    ),
    section(
      'personal',
      '3. Personal data',
      'Where AI features process personal data, we describe them in the [Privacy Policy](/legal/privacy) and obtain consent where required.',
    ),
    section(
      'updates',
      '4. Updates',
      'We update this page when we launch member-facing AI features that materially change how data is processed.',
    ),
    section(
      'contact',
      '5. Contact',
      legalSupportSection('AI use'),
    ),
  ],
};
