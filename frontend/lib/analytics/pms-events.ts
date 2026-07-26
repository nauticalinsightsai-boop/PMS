/** T-013 conversion event names and shared non-PII defaults. */

export const PMS_EVENTS = {
  ROADMAP_CTA_CLICK: 'pms_roadmap_cta_click',
  CONTACT_CLICK: 'pms_contact_click',
  WAITLIST_JOIN: 'pms_waitlist_join',
  MEMBERSHIP_INTEREST: 'pms_membership_interest',
  RESOURCE_INTEREST: 'pms_resource_interest',
  GENERATE_LEAD: 'generate_lead',
  SELECT_CONTENT: 'select_content',
  BOOKING_CONFIRMED: 'booking_confirmed',
  BEGIN_CHECKOUT: 'begin_checkout',
  PURCHASE: 'purchase',
  // P0.6 roadmap funnel events (no PII in params)
  PMP_ROADMAP_OPEN: 'pms_roadmap_open',
  PMP_ROADMAP_START: 'pms_roadmap_start',
  PMP_ROADMAP_STEP_VIEW: 'pms_roadmap_step_view',
  PMP_ROADMAP_STEP_COMPLETE: 'pms_roadmap_step_complete',
  PMP_ROADMAP_VALIDATION_ERROR: 'pms_roadmap_validation_error',
  PMP_ROADMAP_SUBMIT_ATTEMPT: 'pms_roadmap_submit_attempt',
  PMP_ROADMAP_RESULT_VIEW: 'pms_roadmap_result_view',
  CONSULTATION_CTA_CLICK: 'pms_consultation_cta_click',
  CALENDLY_PAGE_VIEW: 'pms_calendly_page_view',
} as const;

export type PmsEventName = (typeof PMS_EVENTS)[keyof typeof PMS_EVENTS];

export const PMP_2026_OFFER = {
  offer_id: 'pmp_2026_readiness_pathway',
  offer_name: 'PMP 2026 Readiness Pathway',
  certification: 'PMP',
  funnel_stage: 'lead_generation',
} as const;

export const ROADMAP_FORM = {
  form_id: 'pmp_2026_roadmap_form',
  form_name: 'PMP 2026 Roadmap Form',
  lead_type: 'roadmap_request',
} as const;

export type CtaLocation = 'nav' | 'hero' | 'body' | 'footer' | 'pricing' | 'unknown';

export type AnalyticsRegion = 'gcc' | 'south_asia' | 'global' | 'unknown';

export type BookingType = 'roadmap_call' | 'mentor_call' | 'corporate_call' | 'unknown';

export type BookingDestination = 'calendly' | 'internal' | 'external' | 'unknown';

export type ContactMethod = 'email' | 'whatsapp' | 'phone' | 'telegram' | 'other';

export type ContactContext = 'roadmap' | 'support' | 'corporate' | 'general';

export type PackageType =
  | 'diagnostic'
  | 'foundation'
  | 'professional'
  | 'mastery'
  | 'membership'
  | 'resource'
  | 'unknown';

export type WaitlistType =
  | 'prince2'
  | 'lean_six_sigma'
  | 'pmi_rmp'
  | 'membership'
  | 'resource'
  | 'community'
  | 'unknown';

/** Map site region IDs to analytics region groups (non-PII). */
export function mapRegionIdToAnalyticsRegion(regionId?: string | null): AnalyticsRegion {
  if (!regionId) return 'unknown';
  const id = regionId.toLowerCase();
  if (id === 'gcc' || id.startsWith('gcc_')) return 'gcc';
  if (id === 'india' || id === 'pakistan' || id === 'south_asia') return 'south_asia';
  if (id === 'global' || id === 'us' || id === 'uk' || id === 'eu') return 'global';
  return 'unknown';
}

/** Infer package type from offering / tier identifiers. */
export function inferPackageType(offeringId?: string | null, tierId?: string | null): PackageType {
  const hay = `${offeringId ?? ''} ${tierId ?? ''}`.toLowerCase();
  if (hay.includes('diagnostic') || hay.includes('readiness')) return 'diagnostic';
  if (hay.includes('foundation')) return 'foundation';
  if (hay.includes('professional')) return 'professional';
  if (hay.includes('mastery')) return 'mastery';
  if (hay.includes('membership')) return 'membership';
  if (hay.includes('store') || hay.includes('resource')) return 'resource';
  return 'unknown';
}

/** Infer waitlist type from offering id or cert name. */
export function inferWaitlistType(offeringId?: string | null, certName?: string | null): WaitlistType {
  const hay = `${offeringId ?? ''} ${certName ?? ''}`.toLowerCase();
  if (hay.includes('prince2')) return 'prince2';
  if (hay.includes('six_sigma') || hay.includes('lss') || hay.includes('lean')) return 'lean_six_sigma';
  if (hay.includes('rmp') || hay.includes('pmi-rmp')) return 'pmi_rmp';
  if (hay.includes('membership')) return 'membership';
  if (hay.includes('community')) return 'community';
  if (hay.includes('store') || hay.includes('resource')) return 'resource';
  return 'unknown';
}
