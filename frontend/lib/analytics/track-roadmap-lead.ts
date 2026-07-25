import {
  AnalyticsRegion,
  PMP_2026_OFFER,
  ROADMAP_FORM,
  PMS_EVENTS,
} from '@/lib/analytics/pms-events';
import {
  pushAnalyticsEvent,
  type AnalyticsEventParams,
} from '@/lib/analytics/push-event';

export type RoadmapLeadSubmitParams = {
  pagePath?: string;
  formPlacement?: string;
  regionGroup?: AnalyticsRegion;
  buyerType?: 'individual' | 'corporate' | 'unknown';
  examRoute?: 'current_pmp' | 'updated_pmp' | 'unknown';
  certification?: string;
  /** Public `/go/{slug}` channel when form is on a portal. */
  channel?: string;
  goSlug?: string;
};

function roadmapLeadParams(extra: RoadmapLeadSubmitParams = {}): AnalyticsEventParams {
  const channel = extra.channel ?? extra.goSlug;
  return {
    ...ROADMAP_FORM,
    ...PMP_2026_OFFER,
    page_path: extra.pagePath ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
    ...(extra.formPlacement ? { form_placement: extra.formPlacement } : {}),
    ...(extra.regionGroup ? { region_group: extra.regionGroup } : {}),
    ...(extra.buyerType ? { buyer_type: extra.buyerType } : {}),
    ...(extra.examRoute ? { exam_route: extra.examRoute } : {}),
    ...(extra.certification ? { certification: extra.certification } : {}),
    ...(channel
      ? { channel, go_slug: extra.goSlug ?? channel, content_group: 'go_portal' }
      : {}),
  };
}

export function trackRoadmapFormStart(extra: RoadmapLeadSubmitParams = {}): void {
  pushAnalyticsEvent(PMS_EVENTS.PMP_ROADMAP_FORM_START, roadmapLeadParams(extra));
}
