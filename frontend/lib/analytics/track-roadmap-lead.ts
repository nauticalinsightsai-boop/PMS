import {
  AnalyticsRegion,
  PMP_2026_OFFER,
  ROADMAP_FORM,
  PMS_EVENTS,
} from '@/lib/analytics/pms-events';
import { pushAnalyticsEvent } from '@/lib/analytics/push-event';

export type RoadmapLeadSubmitParams = {
  pagePath?: string;
  formPlacement?: string;
  region?: AnalyticsRegion;
  buyerType?: 'individual' | 'corporate' | 'unknown';
  examRoute?: 'current_pmp' | 'updated_pmp' | 'unknown';
  certification?: string;
};

function roadmapLeadParams(extra: RoadmapLeadSubmitParams = {}): Record<string, unknown> {
  return {
    ...ROADMAP_FORM,
    ...PMP_2026_OFFER,
    page_path: extra.pagePath ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
    ...(extra.formPlacement ? { form_placement: extra.formPlacement } : {}),
    ...(extra.region ? { region: extra.region } : {}),
    ...(extra.buyerType ? { buyer_type: extra.buyerType } : {}),
    ...(extra.examRoute ? { exam_route: extra.examRoute } : {}),
    ...(extra.certification ? { certification: extra.certification } : {}),
  };
}

export function trackRoadmapFormStart(extra: RoadmapLeadSubmitParams = {}): void {
  pushAnalyticsEvent(PMS_EVENTS.ROADMAP_FORM_START, roadmapLeadParams(extra));
}

export function trackRoadmapLeadSubmit(extra: RoadmapLeadSubmitParams = {}): void {
  const params = roadmapLeadParams(extra);
  pushAnalyticsEvent(PMS_EVENTS.GENERATE_LEAD, params);
  pushAnalyticsEvent(PMS_EVENTS.ROADMAP_FORM_SUBMIT, params);
}
