import type { LegalDocument } from './types';
import { LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED, section } from './shared';
import { BRAND } from '@/lib/brand-voice';

export const servicesDocument: LegalDocument = {
  slug: 'services',
  title: 'Services Terms',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Applies to advisory, consultation, readiness reviews, and corporate training booked through PM Structure.',
  sections: [
    section(
      'scope',
      '1. Scope',
      `These terms supplement our general Terms & Conditions for ${BRAND.name} advisory and professional services (pathway consultation, readiness reviews, governance reviews, corporate training, and related engagements).`,
    ),
    section(
      'delivery',
      '2. Delivery',
      'Services are delivered remotely unless otherwise agreed in writing. Session times, materials, and deliverables will be confirmed in booking confirmations or statements of work.',
    ),
    section(
      'fees',
      '3. Fees',
      'Service fees are separate from certification-body exam fees and pathway tuition unless bundled in a written quote. Invoices are due as stated on the quote. Late payment may suspend delivery.',
    ),
    section(
      'cancellation',
      '4. Cancellation & rescheduling',
      'Cancellations or reschedules must follow the policy in your booking confirmation. We may offer credit or rescheduling for good-faith requests with reasonable notice.',
    ),
    section(
      'outcomes',
      '5. No guaranteed outcomes',
      `${BRAND.name} does not guarantee exam passes, certification awards, or business results. Advisory content is for educational and planning purposes.`,
    ),
    section(
      'confidentiality',
      '6. Confidentiality',
      'We treat client information shared during engagements as confidential except where disclosure is required by law or you authorize sharing.',
    ),
    section(
      'contact',
      '7. Contact',
      `Book or enquire via the site contact form or ${LEGAL_CONTACT_EMAIL}.`,
    ),
  ],
};
