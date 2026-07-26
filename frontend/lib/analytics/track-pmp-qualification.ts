import { PMS_EVENTS, type AnalyticsRegion } from '@/lib/analytics/pms-events';
import { pushAnalyticsEvent, type AnalyticsEventParams } from '@/lib/analytics/push-event';
import { FORM_VERSION } from '@/lib/pmp-qualification-options';

/** Analytics params for P0.4 qualification-first roadmap form (NO PII allowed) */
export type PmpQualificationEventParams = {
  formPlacement?: string;
  regionGroup?: AnalyticsRegion;
  channel?: string;
  goSlug?: string;
  /** Opaque browser session key used only to suppress repeated step completions. */
  formSessionId?: string;
  // Step 1 params (no PII)
  leadField?: string;
  leadObjective?: string;
  // Step 2 params (no PII)
  educationBand?: string;
  experienceBand?: string;
  trainingStatus?: string;
  examTimeline?: string;
  // Never include: fullName, email, phone
};

const completedFormSessionEvents = new Set<string>();

function trackOncePerFormSession(
  eventName: string,
  formSessionId: string | undefined,
  send: () => void,
): void {
  if (!formSessionId) {
    send();
    return;
  }
  const key = `${formSessionId}:${eventName}`;
  if (completedFormSessionEvents.has(key)) return;
  completedFormSessionEvents.add(key);
  send();
}

export function resetPmpQualificationEventDedupe(): void {
  completedFormSessionEvents.clear();
}

function baseParams(extra: PmpQualificationEventParams = {}): AnalyticsEventParams {
  const channel = extra.channel ?? extra.goSlug;
  return {
    form_id: 'pmp_qualification_roadmap',
    form_name: 'PMP Qualification Roadmap',
    form_version: FORM_VERSION,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
    ...(extra.formPlacement ? { form_placement: extra.formPlacement } : {}),
    ...(extra.regionGroup ? { region_group: extra.regionGroup } : {}),
    ...(channel ? { channel, go_slug: extra.goSlug ?? channel, content_group: 'go_portal' } : {}),
  };
}

/** Track form start (first interaction) */
export function trackPmpQualificationFormStart(extra: PmpQualificationEventParams = {}): void {
  trackOncePerFormSession(
    PMS_EVENTS.PMP_ROADMAP_FORM_START,
    extra.formSessionId,
    () => pushAnalyticsEvent(PMS_EVENTS.PMP_ROADMAP_FORM_START, baseParams(extra)),
  );
}

/** Track step 1 completion (fit: field + objective) - NO PII */
export function trackPmpQualificationFitComplete(extra: PmpQualificationEventParams = {}): void {
  const params = {
    ...baseParams(extra),
    ...(extra.leadField ? { lead_field: extra.leadField } : {}),
    ...(extra.leadObjective ? { lead_objective: extra.leadObjective } : {}),
  };
  trackOncePerFormSession(
    PMS_EVENTS.PMP_ROADMAP_FIT_COMPLETE,
    extra.formSessionId,
    () => pushAnalyticsEvent(PMS_EVENTS.PMP_ROADMAP_FIT_COMPLETE, params),
  );
}

/** Track step 2 completion (eligibility: education, experience, training, timing) - NO PII */
export function trackPmpQualificationEligibilityComplete(extra: PmpQualificationEventParams = {}): void {
  const params = {
    ...baseParams(extra),
    ...(extra.leadField ? { lead_field: extra.leadField } : {}),
    ...(extra.leadObjective ? { lead_objective: extra.leadObjective } : {}),
    ...(extra.educationBand ? { education_band: extra.educationBand } : {}),
    ...(extra.experienceBand ? { experience_band: extra.experienceBand } : {}),
    ...(extra.trainingStatus ? { training_status: extra.trainingStatus } : {}),
    ...(extra.examTimeline ? { exam_timeline: extra.examTimeline } : {}),
  };
  trackOncePerFormSession(
    PMS_EVENTS.PMP_ROADMAP_ELIGIBILITY_COMPLETE,
    extra.formSessionId,
    () =>
      pushAnalyticsEvent(PMS_EVENTS.PMP_ROADMAP_ELIGIBILITY_COMPLETE, params),
  );
}
