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
  stepId?: 'fit' | 'eligibility' | 'contact';
  fieldKey?: string;
  optionValue?: string;
  otherUsed?: boolean;
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

/** Exposure only: emitted after an embedded roadmap form mounts. */
export function trackPmpQualificationFormOpen(extra: PmpQualificationEventParams = {}): void {
  trackOncePerFormSession(
    PMS_EVENTS.PMP_ROADMAP_OPEN,
    extra.formSessionId,
    () => pushAnalyticsEvent(PMS_EVENTS.PMP_ROADMAP_OPEN, baseParams(extra)),
  );
}

/** Track step 1 completion (fit: field + objective) - NO PII */
export function trackPmpQualificationFitComplete(extra: PmpQualificationEventParams = {}): void {
  const params = {
    ...baseParams(extra),
    step_id: 'fit',
    ...(extra.leadField ? { lead_field: extra.leadField } : {}),
    ...(extra.leadObjective ? { lead_objective: extra.leadObjective } : {}),
  };
  trackOncePerFormSession(
    PMS_EVENTS.PMP_ROADMAP_STEP_COMPLETE,
    extra.formSessionId,
    () => pushAnalyticsEvent(PMS_EVENTS.PMP_ROADMAP_STEP_COMPLETE, params),
  );
}

/** Track step 2 completion (eligibility: education, experience, training, timing) - NO PII */
export function trackPmpQualificationEligibilityComplete(extra: PmpQualificationEventParams = {}): void {
  const params = {
    ...baseParams(extra),
    step_id: 'eligibility',
    ...(extra.leadField ? { lead_field: extra.leadField } : {}),
    ...(extra.leadObjective ? { lead_objective: extra.leadObjective } : {}),
    ...(extra.educationBand ? { education_band: extra.educationBand } : {}),
    ...(extra.experienceBand ? { experience_band: extra.experienceBand } : {}),
    ...(extra.trainingStatus ? { training_status: extra.trainingStatus } : {}),
    ...(extra.examTimeline ? { exam_timeline: extra.examTimeline } : {}),
  };
  trackOncePerFormSession(
    PMS_EVENTS.PMP_ROADMAP_STEP_COMPLETE,
    extra.formSessionId,
    () =>
      pushAnalyticsEvent(PMS_EVENTS.PMP_ROADMAP_STEP_COMPLETE, params),
  );
}

/** Canonical intent signal: emitted once on the first real form mutation. */
export function trackPmpQualificationFormStart(extra: PmpQualificationEventParams = {}): void {
  trackOncePerFormSession(
    PMS_EVENTS.PMP_ROADMAP_START,
    extra.formSessionId,
    () => pushAnalyticsEvent(PMS_EVENTS.PMP_ROADMAP_START, baseParams(extra)),
  );
}

export function trackPmpQualificationStepView(extra: PmpQualificationEventParams): void {
  if (!extra.stepId) return;
  trackOncePerFormSession(
    `${PMS_EVENTS.PMP_ROADMAP_STEP_VIEW}:${extra.stepId}`,
    extra.formSessionId,
    () => pushAnalyticsEvent(PMS_EVENTS.PMP_ROADMAP_STEP_VIEW, { ...baseParams(extra), step_id: extra.stepId }),
  );
}

export function trackPmpQualificationValidationError(extra: PmpQualificationEventParams): void {
  if (!extra.fieldKey) return;
  pushAnalyticsEvent(PMS_EVENTS.PMP_ROADMAP_VALIDATION_ERROR, {
    ...baseParams(extra),
    ...(extra.stepId ? { step_id: extra.stepId } : {}),
    field_key: extra.fieldKey,
  });
}

export function trackPmpQualificationSubmitAttempt(extra: PmpQualificationEventParams): void {
  pushAnalyticsEvent(PMS_EVENTS.PMP_ROADMAP_SUBMIT_ATTEMPT, {
    ...baseParams(extra),
    step_id: 'contact',
  });
}

export function trackPmpQualificationResultView(extra: PmpQualificationEventParams): void {
  trackOncePerFormSession(
    PMS_EVENTS.PMP_ROADMAP_RESULT_VIEW,
    extra.formSessionId,
    () => pushAnalyticsEvent(PMS_EVENTS.PMP_ROADMAP_RESULT_VIEW, { ...baseParams(extra), step_id: 'result' }),
  );
}
