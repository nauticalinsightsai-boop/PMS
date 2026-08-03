import { PMS_EVENTS, type AnalyticsRegion } from '@/lib/analytics/pms-events';
import { pushAnalyticsEvent, type AnalyticsEventParams } from '@/lib/analytics/push-event';
import { FORM_VERSION } from '@/lib/pmp-qualification-options';

export type PmpRoadmapStepId = 'fit' | 'eligibility' | 'contact';

export type PmpRoadmapFieldKey =
  | 'industry'
  | 'experience'
  | 'need'
  | 'education'
  | 'training'
  | 'timeline'
  | 'industry_other_detail'
  | 'experience_other_detail'
  | 'need_other_detail'
  | 'education_other_detail'
  | 'training_other_detail'
  | 'full_name'
  | 'mobile'
  | 'email';

export type PmpRoadmapErrorCode =
  | 'required'
  | 'invalid_format'
  | 'invalid_length';

export type PmpRoadmapStepAnswers = {
  industry?: string;
  experience?: string;
  need?: string;
  education?: string;
  training?: string;
  timeline?: string;
  hasIndustryOtherDetail?: boolean;
  hasNeedOtherDetail?: boolean;
  hasExperienceOtherDetail?: boolean;
  hasEducationOtherDetail?: boolean;
  hasTrainingOtherDetail?: boolean;
};

export type PmpRoadmapAnalyticsContext = {
  formSessionId: string;
  formPlacement: string;
  regionGroup: AnalyticsRegion;
  channel?: string;
  goSlug?: string;
  pagePath?: string;
};

export type PmpRoadmapAnalyticsTracker = {
  open: () => boolean;
  viewStep: (stepId: PmpRoadmapStepId) => boolean;
  start: () => boolean;
  validationError: (
    stepId: PmpRoadmapStepId,
    fieldKey: PmpRoadmapFieldKey,
    errorCode: PmpRoadmapErrorCode,
  ) => boolean;
  completeStep: (
    stepId: PmpRoadmapStepId,
    answers?: PmpRoadmapStepAnswers,
  ) => boolean;
  submitAttempt: () => boolean;
  resultView: (submissionId: string) => boolean;
};

export type PmpRoadmapFormAnalyticsRuntime = {
  expose: () => void;
  mutate: () => boolean;
  blockAdvance: (
    stepId: PmpRoadmapStepId,
    fieldKey: PmpRoadmapFieldKey,
    errorCode: PmpRoadmapErrorCode,
  ) => boolean;
  advance: (
    stepId: Exclude<PmpRoadmapStepId, 'contact'>,
    nextStepId: PmpRoadmapStepId,
    answers: PmpRoadmapStepAnswers,
  ) => void;
  submit: () => boolean;
  acceptResult: (result: {
    ok: boolean;
    newDurableSubmission?: boolean;
    submissionId?: string;
    idempotentReplay?: boolean;
  }) => boolean;
};

let eventSequence = 0;

function createOpaqueEventId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return `roadmap_${globalThis.crypto.randomUUID()}`;
  }
  eventSequence += 1;
  return `roadmap_${Date.now().toString(36)}_${eventSequence.toString(36)}`;
}

function baseParams(
  context: PmpRoadmapAnalyticsContext,
  eventId = createOpaqueEventId(),
): AnalyticsEventParams {
  const channel = context.channel ?? context.goSlug;
  return {
    event_id: eventId,
    form_session_id: context.formSessionId,
    form_id: 'pmp_qualification_roadmap',
    form_version: FORM_VERSION,
    page_path:
      context.pagePath ??
      (typeof window !== 'undefined' ? window.location.pathname : '/'),
    form_placement: context.formPlacement,
    region_group: context.regionGroup,
    ...(channel
      ? {
          channel,
          go_slug: context.goSlug ?? channel,
          content_group: 'go_portal',
        }
      : {}),
  };
}

function answerParams(answers: PmpRoadmapStepAnswers = {}): AnalyticsEventParams {
  return {
    ...(answers.industry ? { industry: answers.industry } : {}),
    ...(answers.experience ? { experience: answers.experience } : {}),
    ...(answers.need ? { need: answers.need } : {}),
    ...(answers.education ? { education: answers.education } : {}),
    ...(answers.training ? { training: answers.training } : {}),
    ...(answers.timeline ? { timeline: answers.timeline } : {}),
    ...(answers.hasIndustryOtherDetail !== undefined
      ? { has_industry_other_detail: answers.hasIndustryOtherDetail }
      : {}),
    ...(answers.hasExperienceOtherDetail !== undefined
      ? { has_experience_other_detail: answers.hasExperienceOtherDetail }
      : {}),
    ...(answers.hasNeedOtherDetail !== undefined
      ? { has_need_other_detail: answers.hasNeedOtherDetail }
      : {}),
    ...(answers.hasEducationOtherDetail !== undefined
      ? { has_education_other_detail: answers.hasEducationOtherDetail }
      : {}),
    ...(answers.hasTrainingOtherDetail !== undefined
      ? { has_training_other_detail: answers.hasTrainingOtherDetail }
      : {}),
  };
}

/**
 * Runtime lifecycle controller for one mounted roadmap form. The controller
 * owns once-only semantics, so React remount effects, Back, and revisits cannot
 * manufacture extra lifecycle events.
 */
export function createPmpRoadmapAnalyticsTracker(
  getContext: () => PmpRoadmapAnalyticsContext,
): PmpRoadmapAnalyticsTracker {
  const emitted = new Set<string>();

  const emitOnce = (
    dedupeKey: string,
    eventName: string,
    params: AnalyticsEventParams = {},
  ): boolean => {
    if (emitted.has(dedupeKey)) return false;
    emitted.add(dedupeKey);
    pushAnalyticsEvent(eventName, {
      ...baseParams(getContext()),
      ...params,
    });
    return true;
  };

  return {
    open: () => emitOnce('open', PMS_EVENTS.ROADMAP_OPEN),
    viewStep: (stepId) =>
      emitOnce(
        `step_view:${stepId}`,
        PMS_EVENTS.ROADMAP_STEP_VIEW,
        { step_id: stepId },
      ),
    start: () => emitOnce('start', PMS_EVENTS.ROADMAP_START),
    validationError: (stepId, fieldKey, errorCode) =>
      emitOnce(
        `validation:${stepId}:${fieldKey}:${errorCode}`,
        PMS_EVENTS.ROADMAP_VALIDATION_ERROR,
        {
          step_id: stepId,
          field_key: fieldKey,
          error_code: errorCode,
        },
      ),
    completeStep: (stepId, answers = {}) =>
      emitOnce(
        `step_complete:${stepId}`,
        PMS_EVENTS.ROADMAP_STEP_COMPLETE,
        {
          step_id: stepId,
          ...answerParams(answers),
        },
      ),
    submitAttempt: () =>
      emitOnce(
        'submit_attempt',
        PMS_EVENTS.ROADMAP_SUBMIT_ATTEMPT,
        { clientSubmissionId: getContext().formSessionId },
      ),
    resultView: (submissionId) =>
      Boolean(submissionId) &&
      emitOnce(
        `result_view:${submissionId}`,
        PMS_EVENTS.ROADMAP_RESULT_VIEW,
        {
          clientSubmissionId: getContext().formSessionId,
          submission_id: submissionId,
        },
      ),
  };
}

/**
 * Form-facing runtime boundary. PmpRoadmapLeadForm uses this adapter for every
 * lifecycle transition so invalid advances, Back/revisits, failed requests,
 * and idempotent replays cannot be mistaken for conversions.
 */
export function createPmpRoadmapFormAnalyticsRuntime(
  tracker: PmpRoadmapAnalyticsTracker,
): PmpRoadmapFormAnalyticsRuntime {
  return {
    expose: () => {
      tracker.open();
      tracker.viewStep('fit');
    },
    mutate: () => tracker.start(),
    blockAdvance: (stepId, fieldKey, errorCode) =>
      tracker.validationError(stepId, fieldKey, errorCode),
    advance: (stepId, nextStepId, answers) => {
      const isCanonicalTransition =
        (stepId === 'fit' && nextStepId === 'eligibility') ||
        (stepId === 'eligibility' && nextStepId === 'contact');
      if (!isCanonicalTransition) return;
      tracker.completeStep(stepId, answers);
      tracker.viewStep(nextStepId);
    },
    submit: () => tracker.submitAttempt(),
    acceptResult: (result) => {
      if (
        !result.ok ||
        result.newDurableSubmission !== true ||
        !result.submissionId ||
        result.idempotentReplay === true
      ) {
        return false;
      }
      return tracker.resultView(result.submissionId);
    },
  };
}

/**
 * Legacy P0.4 helpers remain for downstream compatibility. New form code uses
 * createPmpRoadmapAnalyticsTracker for the canonical pms_roadmap_* sequence.
 */
export type PmpQualificationEventParams = {
  formPlacement?: string;
  regionGroup?: AnalyticsRegion;
  channel?: string;
  goSlug?: string;
  formSessionId?: string;
  leadField?: string;
  leadObjective?: string;
  educationBand?: string;
  experienceBand?: string;
  trainingStatus?: string;
  examTimeline?: string;
};

const completedLegacyEvents = new Set<string>();

function legacyBaseParams(
  extra: PmpQualificationEventParams = {},
): AnalyticsEventParams {
  const channel = extra.channel ?? extra.goSlug;
  return {
    form_id: 'pmp_qualification_roadmap',
    form_name: 'PMP Qualification Roadmap',
    form_version: FORM_VERSION,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
    ...(extra.formPlacement ? { form_placement: extra.formPlacement } : {}),
    ...(extra.regionGroup ? { region_group: extra.regionGroup } : {}),
    ...(channel
      ? {
          channel,
          go_slug: extra.goSlug ?? channel,
          content_group: 'go_portal',
        }
      : {}),
  };
}

function legacyOnce(
  eventName: string,
  extra: PmpQualificationEventParams,
  params: AnalyticsEventParams = {},
): void {
  const key = `${extra.formSessionId ?? 'unknown'}:${eventName}`;
  if (completedLegacyEvents.has(key)) return;
  completedLegacyEvents.add(key);
  pushAnalyticsEvent(eventName, {
    ...legacyBaseParams(extra),
    ...params,
  });
}

export function resetPmpQualificationEventDedupe(): void {
  completedLegacyEvents.clear();
  eventSequence = 0;
}

export function trackPmpQualificationFormStart(
  extra: PmpQualificationEventParams = {},
): void {
  legacyOnce(PMS_EVENTS.PMP_ROADMAP_FORM_START, extra);
}

export function trackPmpQualificationFitComplete(
  extra: PmpQualificationEventParams = {},
): void {
  legacyOnce(PMS_EVENTS.PMP_ROADMAP_FIT_COMPLETE, extra, {
    ...(extra.leadField ? { lead_field: extra.leadField } : {}),
    ...(extra.leadObjective ? { lead_objective: extra.leadObjective } : {}),
    ...(extra.experienceBand
      ? { experience_band: extra.experienceBand }
      : {}),
  });
}

export function trackPmpQualificationEligibilityComplete(
  extra: PmpQualificationEventParams = {},
): void {
  legacyOnce(PMS_EVENTS.PMP_ROADMAP_ELIGIBILITY_COMPLETE, extra, {
    ...(extra.educationBand
      ? { education_band: extra.educationBand }
      : {}),
    ...(extra.trainingStatus
      ? { training_status: extra.trainingStatus }
      : {}),
    ...(extra.examTimeline ? { exam_timeline: extra.examTimeline } : {}),
  });
}
