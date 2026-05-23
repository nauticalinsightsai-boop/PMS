/**

 * PM Structure brand voice — source: PM_STRUCTURE_BRAND_VOICE.md

 *

 * Brevity: CTAs ≤5 words; hero titles one line; subtitles one short sentence.

 * Save longer explanation for body copy, FAQs, and detail sections — not buttons or H1s.

 */



export const BRAND = {

  name: 'PM Structure',

  short: 'PMS',

  website: 'www.PMStructure.com',

  domain: 'pmstructure.com',

} as const;



export const BRAND_LINES = {

  primary: 'Prepare with structure. Manage with discipline. Deliver with control.',

  positioning:

    'Independent exam prep and structured readiness across PMI, PRINCE2, and Six Sigma.',

  promise:

    'Choose the right pathway. Prepare with structure. Build judgment for real projects.',

} as const;



export const DISCLAIMERS = {

  accreditation:

    'Certification names and trademarks belong to their respective owners. PM Structure currently operates as an independent exam-prep platform. Accreditation status, official provider status, contact-hour eligibility, and PDU eligibility will be stated only where formally approved.',

  roadmap:

    'PM Structure currently operates as an independent exam-prep and project management learning platform. Formal accreditation pathways with PMI, PeopleCert/PRINCE2, and Six Sigma bodies are part of our future roadmap.',

} as const;



export const CTAS = {

  pathwayConsultation: 'Book consultation',

  pmpConsultation: 'Book PMP consultation',

  readinessCheck: 'Check readiness',

  readinessReview: 'Readiness review',

  corporateTraining: 'Corporate training',

  governanceReview: 'Governance review',

  processDiagnostic: 'Process diagnostic',

  choosePathway: 'Choose your pathway',

  findPathway: 'Find your pathway',

  newsletter: 'Join newsletter',

  readinessChecklist: 'Download checklist',

  exploreCertifications: 'Explore pathways',

  browseResources: 'Browse resources',

  navConsultation: 'Book consultation',

} as const;



/** Display labels for pricing tiers (data keys may still use Elite internally). */

export function tierDisplayName(tier: 'Foundation' | 'Professional' | 'Elite'): string {

  if (tier === 'Elite') return 'Mastery';

  return tier;

}



export const HOME_COPY = {

  heroBadge: 'Prepare with structure',

  heroTitle: 'Structured project management capability',

  heroSubtitle: BRAND_LINES.promise,

  ctaPrimary: 'Book consultation',

  ctaSecondary: 'Find your pathway',

  frameworksTitle: 'Programme families',

  frameworksSubtitle:

    'PMI, PRINCE2, and Six Sigma — structured for readiness, not random content.',

  featuredSubtitle:

    'Pathways aligned to current exam standards and practical judgment.',

  membershipSubtitle:

    'Tools and support for measurable progress — not passive access.',

} as const;



export const CERTIFICATIONS_COPY = {

  heroBadge: 'Certification pathways',

  heroTitle: 'Find your pathway',

  heroSubtitle:

    'Compare PMI, PRINCE2, and Six Sigma. Match timeline and study capacity to the right tier.',

  listingSubtitle:

    'Independent exam prep. Verify eligibility and policies with each certification body.',

  openCohortLabel: 'Next intake',

  nextCohortLabel: 'Next cohort',

  nextCohortHint:
    'Cohorts run from August 2026 onward. If a pathway shows “next cohort”, that intake is not open yet — view the overview or join the waitlist.',

  familyMorePathways: 'More in this family',

} as const;



export const COMMUNITY_COPY = {

  heroBadge: 'Community & resources',

  heroTitle: 'Built by PMs, for PMs',

  heroSubtitle:

    'Peers, study circles, and practical templates — beyond solo self-study.',

} as const;



/** Regional matrix website copy (from Excel Website Copy sheet). */
export const REGION_COPY = {
  pricingSelector:
    'Regional pricing is based on current country of residence and billing country, not nationality.',
  southAsiaNote:
    'South Asia pricing is offered as regional scholarship pricing for learners residing and billing from India or Pakistan.',
  masteryUnavailable:
    'This mentor-led Mastery tier is not currently available under your regional scholarship pricing. You may request a scholarship review, join the waitlist, or enroll at the Global price.',
  checkoutNote:
    'Final checkout is processed in USD equivalent. Regional pricing is used to calculate the applicable checkout amount.',
  compliance:
    'Prices exclude official exam fees, certification-body fees, taxes, vouchers, membership fees, and third-party charges. PM Structure is currently an independent exam-prep and project management learning platform.',
  originalPriceLabel: 'Original price',
  /** Browse/compare surfaces — less “sale” framing than “Original price”. */
  globalReferenceLabel: 'Global reference',
  scholarshipPriceLabel: 'Regional Scholarship price',
  scholarshipChipSubtitle: 'Regional scholarship',
  scholarshipFootnote:
    'Regional Scholarship Pricing applies when residence and billing country match this region.',
  regionalPriceLabel: 'Regional price',
  membershipPriceLabel: 'Membership price',
  membershipChipLabel: 'Membership',
  membershipDiscountNote: '20% off regional tuition with an active membership.',
} as const;

/** UI policy: use "Regional Scholarship" for regional tuition; reserve "discount" for membership only. */
export const REGIONAL_PRICING_COPY_POLICY =
  'Do not label regional tuition as a discount; membership may show as 20% off regional price.';

export const SERVICES_COPY = {

  heroBadge: 'Advisory & delivery',

  heroTitle: 'Preparation into progress',

  heroSubtitle:

    'Pathway consultation, readiness reviews, training, and governance support.',

} as const;


