import type { LegalDocument } from './types';
import { LEGAL_LAST_UPDATED, section } from './shared';
import { BRAND, DISCLAIMERS, REGION_COPY } from '@/lib/brand-voice';

export const pricingDisclaimersDocument: LegalDocument = {
  slug: 'pricing-disclaimers',
  title: 'Pricing & Certification Disclaimers',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Important notices about pricing, exams, trademarks, and accreditation status.',
  sections: [
    section(
      'pricing',
      '1. Pricing & fees',
      `${REGION_COPY.compliance} ${REGION_COPY.checkoutNote}`,
    ),
    section(
      'regional',
      '2. Regional pricing',
      `${REGION_COPY.pricingSelector} ${REGION_COPY.southAsiaNote} ${REGION_COPY.scholarshipFootnote} Active members may receive ${REGION_COPY.membershipDiscountNote}`,
    ),
    section(
      'trademarks',
      '3. Trademarks & independence',
      DISCLAIMERS.accreditation,
    ),
    section(
      'roadmap',
      '4. Accreditation roadmap',
      DISCLAIMERS.roadmap,
    ),
    section(
      'exam',
      '5. Official exams',
      'Official exam registration, scheduling, and fees are handled by the relevant certification bodies (e.g. PMI, PeopleCert, IASSC). Always verify eligibility, fees, and policies on the official body website before registering.',
    ),
  ],
};
