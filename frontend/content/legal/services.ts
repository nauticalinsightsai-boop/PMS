import type { LegalDocument } from './types';
import { LEGAL_LAST_UPDATED, LEGAL_SUPPORT_EMAIL, legalSupportSection, section } from './shared';
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
      'mastery',
      '5. Mastery consultation',
      'Some mentor-led Mastery pathways require a consultation and admin approval before checkout. Submit the consultation form; once approved for your email and offering, checkout is unlocked.',
    ),
    section(
      'outcomes',
      '6. No guaranteed outcomes',
      `${BRAND.name} does not guarantee exam passes, certification awards, or business results. Advisory content is for educational and planning purposes.`,
    ),
    section(
      'confidentiality',
      '7. Confidentiality',
      'We treat client information shared during engagements as confidential except where disclosure is required by law or you authorize sharing.',
    ),
    section(
      'contact',
      '8. Contact',
      `Book via [/contact](/contact) or email ${LEGAL_SUPPORT_EMAIL} for cohort and corporate enquiries.`,
    ),
    section(
      'support',
      '9. Support',
      legalSupportSection('advisory services'),
    ),
  ],
};
