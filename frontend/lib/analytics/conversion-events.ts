import { trackFunnelEvent } from '@/lib/analytics/funnel';

/** Spec-aligned conversion event names (Phase 14). */
export const CONVERSION_EVENTS = {
  VIEW_PMP_EXAM_2026: 'view_pmp_exam_2026',
  VIEW_PMP_PATHWAY: 'view_pmp_pathway',
  VIEW_PMP_FOUNDATION: 'view_pmp_foundation',
  VIEW_PMP_PROFESSIONAL: 'view_pmp_professional',
  VIEW_PMP_MASTERY: 'view_pmp_mastery',
  CLICK_PMP_DIAGNOSTIC: 'click_pmp_diagnostic',
  CLICK_ENROLL_PMP_FOUNDATION: 'click_enroll_pmp_foundation',
  CLICK_ENROLL_PMP_PROFESSIONAL: 'click_enroll_pmp_professional',
  CLICK_ENROLL_PMP_MASTERY: 'click_enroll_pmp_mastery',
  START_CHECKOUT: 'start_checkout',
  CLICK_PAYMENT: 'click_payment',
  VIEW_PMP_FAQ: 'view_pmp_faq',
  VIEW_ANSWER_PAGE: 'view_answer_page',
  VIEW_TOPIC_HUB: 'view_topic_hub',
  CONSULTATION_BOOK: 'consultation_book',
  REGION_SELECT: 'region_select',
} as const;

export type ConversionEventName = (typeof CONVERSION_EVENTS)[keyof typeof CONVERSION_EVENTS];

const PMP_ENROLL_BY_TIER: Record<string, ConversionEventName> = {
  foundation: CONVERSION_EVENTS.CLICK_ENROLL_PMP_FOUNDATION,
  professional: CONVERSION_EVENTS.CLICK_ENROLL_PMP_PROFESSIONAL,
  mastery: CONVERSION_EVENTS.CLICK_ENROLL_PMP_MASTERY,
};

export function getPmpEnrollConversionEvent(tierId: string): ConversionEventName | null {
  return PMP_ENROLL_BY_TIER[tierId] ?? null;
}

export function trackConversionEvent(
  eventName: ConversionEventName,
  params?: Record<string, unknown>,
): void {
  trackFunnelEvent(eventName, params);
}
