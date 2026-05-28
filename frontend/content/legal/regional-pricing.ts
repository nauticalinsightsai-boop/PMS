import type { LegalDocument } from './types';
import { LEGAL_LAST_UPDATED, legalSupportSection, section } from './shared';
import { BRAND, REGION_COPY, REGIONAL_PRICING_COPY_POLICY } from '@/lib/brand-voice';

export const regionalPricingDocument: LegalDocument = {
  slug: 'regional-pricing',
  title: 'Regional Pricing & Scholarship Policy',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'How regional tuition and Regional Scholarship pricing are determined and displayed.',
  sections: [
    section(
      'basis',
      '1. Basis of regional pricing',
      `${REGION_COPY.pricingSelector} We do not use nationality alone to set prices.`,
    ),
    section(
      'south-asia',
      '2. South Asia Regional Scholarship',
      `${REGION_COPY.southAsiaNote} ${REGION_COPY.scholarshipFootnote}`,
    ),
    section(
      'framing',
      '3. Scholarship vs discount',
      REGIONAL_PRICING_COPY_POLICY +
        ' Membership may show 20% off displayed regional tuition; regional tuition itself is not framed as a promotional sale.',
    ),
    section(
      'checkout',
      '4. Checkout currency',
      `${REGION_COPY.checkoutNote} ${REGION_COPY.compliance}`,
    ),
    section(
      'verification',
      '5. Verification',
      'For certain offerings we verify that residence and billing country match the selected scholarship region before checkout. Failed verification blocks checkout until details are corrected.',
    ),
    section(
      'access',
      '6. Access & parity',
      `${BRAND.name} offers regional scholarship pricing to improve access to structured exam preparation in selected markets. This is not arbitrary price discrimination; eligibility is tied to verifiable residence and billing location.`,
    ),
    section(
      'related',
      '7. Related policies',
      'See also [Pricing & disclaimers](/legal/pricing-disclaimers) and [Terms](/legal/terms).',
    ),
    section(
      'disputes',
      '8. Pricing disputes',
      'If you believe regional pricing was applied incorrectly, email support with your selected region, residence, billing country, and screenshots from checkout.',
    ),
    section(
      'contact',
      '9. Contact',
      legalSupportSection('regional pricing'),
    ),
  ],
};
