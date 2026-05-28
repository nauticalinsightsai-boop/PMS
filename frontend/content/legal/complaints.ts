import type { LegalDocument } from './types';
import { LEGAL_LAST_UPDATED, LEGAL_SUPPORT_EMAIL, legalSupportSection, section } from './shared';

export const complaintsDocument: LegalDocument = {
  slug: 'complaints',
  title: 'Complaints & Disputes',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'How to raise service, billing, or privacy complaints.',
  sections: [
    section(
      'support-first',
      '1. Email support first',
      `Most issues are resolved by emailing ${LEGAL_SUPPORT_EMAIL}. Include your order email, region, offering ID, and a clear description of the problem.`,
    ),
    section(
      'billing',
      '2. Billing disputes',
      'For unexpected charges, failed access after payment, or renewal issues, contact support before initiating a chargeback so we can investigate and fix the account.',
    ),
    section(
      'privacy',
      '3. Privacy complaints',
      `For data protection complaints, email ${LEGAL_SUPPORT_EMAIL} with subject “Privacy complaint” and your country. EU/UK users may also contact their supervisory authority — see regional privacy addenda at [/legal/privacy](/legal/privacy).`,
    ),
    section(
      'accessibility',
      '4. Accessibility barriers',
      'Report accessibility issues under [Accessibility](/legal/accessibility). We aim to respond within 10 business days.',
    ),
    section(
      'escalation',
      '5. Escalation',
      'If support cannot resolve your complaint, ask for escalation in your email thread. We document serious complaints and respond in writing where appropriate.',
    ),
    section(
      'contact',
      '6. Contact',
      legalSupportSection('complaints'),
    ),
  ],
};
