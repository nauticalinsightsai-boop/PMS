import type { LegalDocument } from './types';
import { LEGAL_LAST_UPDATED, legalSupportSection, section } from './shared';
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
      'independent-platform',
      '3. Independent exam-preparation platform',
      `${BRAND.name} is an independent exam-preparation and project management learning platform. We are not PMI, PeopleCert, IASSC, or any certification body. We do not deliver official exams, issue credentials, or guarantee exam passes unless expressly stated in writing for a specific offering.`,
    ),
    section(
      'trademarks',
      '4. Trademarks & fair use',
      `${DISCLAIMERS.accreditation} PMP®, CAPM®, PMI-ACP®, PRINCE2®, and related marks are used for descriptive purposes only to identify the certifications candidates may prepare for.`,
    ),
    section(
      'roadmap',
      '5. Accreditation roadmap',
      DISCLAIMERS.roadmap,
    ),
    section(
      'exam',
      '6. Official exams',
      'Official exam registration, scheduling, and fees are handled by the relevant certification bodies (e.g. PMI, PeopleCert, IASSC). Always verify eligibility, fees, and policies on the official body website before registering.',
    ),
    section(
      'verification',
      '7. Scholarship verification',
      'For certain offerings we verify residence and billing country before checkout. See [Regional pricing policy](/legal/regional-pricing).',
    ),
    section(
      'parity',
      '8. Access framing',
      `${BRAND.name} offers regional scholarship pricing to improve access to exam preparation in selected markets based on verifiable residence and billing location, not nationality alone.`,
    ),
    section(
      'contact',
      '9. Contact',
      legalSupportSection('pricing and certification disclaimers'),
    ),
  ],
};
