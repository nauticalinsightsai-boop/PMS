/**

 * PM Structure brand voice: source: PM_STRUCTURE_BRAND_VOICE.md

 *

 * Brevity: CTAs ≤5 words; hero titles one line; subtitles one short sentence.

 * Save longer explanation for body copy, FAQs, and detail sections: not buttons or H1s.

 */



export const BRAND = {

  /** Legal / formal name for portal headers */
  fullName: 'Project Management Structure',

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

  /** Canonical secondary CTA (B12). */
  talkToAMentor: 'Talk to a Mentor',

  pathwayConsultation: 'Talk to a Mentor',

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
  /** Mobile sticky bar on /go/* channel portals */
  portalVisitWebsite: 'Explore on website',
  /** Final CTA row on /go/* channel portals */
  portalEmailSupport: 'Email support',

  browseResources: 'Browse resources',

  navConsultation: 'Talk to a Mentor',

  /** @deprecated Prefer talkToAMentor */
  talkToMentor: 'Talk to a Mentor',

  /** PM advisory / corporate services hero (distinct from exam-prep mentor CTAs). */
  talkToAdvisor: 'Talk to Advisor',

  /** Professional & Mastery pathway modal: mentor scheduling (≤5 words). */
  pathwayMentorCta: 'Talk to a Mentor',

  /** Professional & Mastery enrollment CTA (≤5 words). */
  pathwayReserveSeat: 'Reserve your seat',

  /** Home hero Calendly consultation (≤5 words). */
  websiteHeroConsultation: 'Talk to a Mentor',

  /** T-169 flagship primary CTA (task copy; 6 words). */
  pmp2026Roadmap: 'Get My PMP 2026 Roadmap',

  comparePathways: 'Compare certifications',

  joinWaitlist: 'Join Waitlist',

  joinMembershipWaitlist: 'Join Membership Waitlist',

  previewPathway: 'Preview Pathway',

  requestCorporateCohortBrief: 'Request Corporate Cohort Brief',

  requestMasteryReview: 'Request Mastery Review',

} as const;



/** Display labels for pricing tiers (data keys may still use Elite internally). */

export function tierDisplayName(tier: 'Foundation' | 'Professional' | 'Elite'): string {

  if (tier === 'Elite') return 'Mastery';

  return tier;

}



export const HOME_COPY = {

  heroBadge: 'PMP 2026 readiness',

  heroTitle: 'Project management\nguidance',

  heroTitleAccents: [
    'PM membership',
    'PMS network',
    'Certification readiness',
    'PMP 2026 Changes',
  ] as const,

  /** @deprecated Use heroTitleAccents; kept for CMS default string */
  heroTitleAccent: 'PM membership',

  heroSubtitle: BRAND_LINES.promise,

  heroMicrocopy:
    'Independent exam-prep and readiness support. Certifications are issued by their respective certification bodies, not PM Structure.',

  ctaPrimary: 'Get My PMP 2026 Roadmap',

  ctaSecondary: 'Compare certifications',

  frameworksTitle: 'Programme families',

  frameworksSubtitle:

    'PMI, PRINCE2, and Six Sigma: structured for readiness, not random content.',

  featuredSubtitle:

    'PMP 2026 is the flagship pathway; compare other certifications when you are ready.',

  membershipSubtitle:

    'Unlock tools, community access, and certification discounts while you prepare.',

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
    'Cohorts run from August 2026 onward. If a pathway shows “next cohort”, that intake is not open yet: view the overview or join the waitlist.',

  familyMorePathways: 'More in this family',

} as const;



export const COMMUNITY_COPY = {

  heroBadge: 'Community & resources',

  heroTitle: 'Built by PMs, for PMs',

  heroSubtitle:

    'Peers, study circles, and practical templates: beyond solo self-study.',

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
  /** Browse/compare surfaces: less “sale” framing than “Original price”. */
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