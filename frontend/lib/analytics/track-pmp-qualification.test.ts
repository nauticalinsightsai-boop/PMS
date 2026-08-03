import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PMS_EVENTS } from '@/lib/analytics/pms-events';
import * as pushEventModule from '@/lib/analytics/push-event';
import {
  createPmpRoadmapFormAnalyticsRuntime,
  createPmpRoadmapAnalyticsTracker,
  resetPmpQualificationEventDedupe,
  trackPmpQualificationEligibilityComplete,
  trackPmpQualificationFitComplete,
  trackPmpQualificationFormStart,
} from '@/lib/analytics/track-pmp-qualification';

vi.mock('@/lib/analytics/push-event', () => ({
  pushAnalyticsEvent: vi.fn(),
}));

describe('PMP qualification analytics tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetPmpQualificationEventDedupe();
  });

  it('fires the canonical first-interaction event without PII', () => {
    trackPmpQualificationFormStart({
      formSessionId: 'lead_session_1',
      formPlacement: 'home_hero_desktop',
      regionGroup: 'gcc',
    });

    expect(pushEventModule.pushAnalyticsEvent).toHaveBeenCalledWith(
      PMS_EVENTS.PMP_ROADMAP_FORM_START,
      expect.objectContaining({
        form_id: 'pmp_qualification_roadmap',
        form_placement: 'home_hero_desktop',
        region_group: 'gcc',
      }),
    );
  });

  it('fires fit completion once per form session with experience_band (no PII)', () => {
    const input = {
      formSessionId: 'lead_session_1',
      leadField: 'civil_engineering',
      leadObjective: 'check_eligibility',
      experienceBand: '5_to_7',
    };
    trackPmpQualificationFitComplete(input);
    trackPmpQualificationFitComplete(input);

    expect(pushEventModule.pushAnalyticsEvent).toHaveBeenCalledTimes(1);
    const params = (pushEventModule.pushAnalyticsEvent as any).mock.calls[0][1];
    expect(params).toMatchObject({
      lead_field: 'civil_engineering',
      lead_objective: 'check_eligibility',
      experience_band: '5_to_7',
    });
    expect(params).not.toHaveProperty('education_band');
    expect(params).not.toHaveProperty('pmExperienceOther');
    expect(params).not.toHaveProperty('email');
  });

  it('fires eligibility completion once per form session and strips contact details', () => {
    const input = {
      formSessionId: 'lead_session_1',
      educationBand: 'bachelor_plus',
      experienceBand: '5_to_7',
      trainingStatus: 'completed',
      examTimeline: 'within_3',
    };
    trackPmpQualificationEligibilityComplete(input);
    trackPmpQualificationEligibilityComplete(input);

    expect(pushEventModule.pushAnalyticsEvent).toHaveBeenCalledTimes(1);
    const params = (pushEventModule.pushAnalyticsEvent as any).mock.calls[0][1];
    expect(params).toMatchObject({
      education_band: 'bachelor_plus',
      training_status: 'completed',
      exam_timeline: 'within_3',
    });
    // Experience lives on fit / step_complete; legacy eligibility must not re-emit raw Other text
    expect(params).not.toHaveProperty('experience_band');
    expect(params).not.toHaveProperty('email');
    expect(params).not.toHaveProperty('phone');
    expect(params).not.toHaveProperty('fullName');
    expect(params).not.toHaveProperty('contactWindow');
    expect(params).not.toHaveProperty('educationOther');
  });

  it('allows the same step for a separate form session', () => {
    trackPmpQualificationFormStart({ formSessionId: 'lead_session_1' });
    trackPmpQualificationFormStart({ formSessionId: 'lead_session_2' });
    expect(pushEventModule.pushAnalyticsEvent).toHaveBeenCalledTimes(2);
  });

  it('preserves go-portal attribution without exposing the session key', () => {
    trackPmpQualificationFormStart({
      formSessionId: 'lead_session_private',
      channel: 'partner_abc',
      goSlug: 'partner-landing-2026',
    });

    const params = (pushEventModule.pushAnalyticsEvent as any).mock.calls[0][1];
    expect(params).toMatchObject({
      channel: 'partner_abc',
      go_slug: 'partner-landing-2026',
      content_group: 'go_portal',
    });
    expect(params).not.toHaveProperty('formSessionId');
    expect(params).not.toHaveProperty('form_session_id');
  });
});

describe('canonical PMP roadmap lifecycle controller', () => {
  const context = {
    formSessionId: 'lead_runtime_session_123',
    formPlacement: 'certifications_hub_desktop',
    regionGroup: 'gcc' as const,
    channel: 'linkedin',
    goSlug: 'linkedin',
    pagePath: '/go/linkedin',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    resetPmpQualificationEventDedupe();
  });

  it('emits the exact once-only 3/3/3 lifecycle in canonical order', () => {
    const tracker = createPmpRoadmapAnalyticsTracker(() => context);

    tracker.open();
    tracker.open();
    tracker.viewStep('fit');
    tracker.viewStep('fit');
    tracker.start();
    tracker.start();
    tracker.completeStep('fit', {
      industry: 'civil_engineering',
      experience: 'other',
      need: 'check_eligibility',
      hasIndustryOtherDetail: false,
      hasExperienceOtherDetail: true,
      hasNeedOtherDetail: false,
    });
    tracker.completeStep('fit');
    tracker.viewStep('eligibility');
    tracker.viewStep('eligibility');
    tracker.completeStep('eligibility', {
      education: 'bachelor_plus',
      training: 'completed',
      timeline: '3_to_6',
      hasEducationOtherDetail: false,
      hasTrainingOtherDetail: false,
    });
    tracker.viewStep('contact');
    tracker.submitAttempt();
    tracker.submitAttempt();
    tracker.resultView('submission-runtime-1');
    tracker.resultView('submission-runtime-1');

    expect(
      (pushEventModule.pushAnalyticsEvent as any).mock.calls.map(
        (call: any[]) => call[0],
      ),
    ).toEqual([
      PMS_EVENTS.ROADMAP_OPEN,
      PMS_EVENTS.ROADMAP_STEP_VIEW,
      PMS_EVENTS.ROADMAP_START,
      PMS_EVENTS.ROADMAP_STEP_COMPLETE,
      PMS_EVENTS.ROADMAP_STEP_VIEW,
      PMS_EVENTS.ROADMAP_STEP_COMPLETE,
      PMS_EVENTS.ROADMAP_STEP_VIEW,
      PMS_EVENTS.ROADMAP_SUBMIT_ATTEMPT,
      PMS_EVENTS.ROADMAP_RESULT_VIEW,
    ]);

    const allParams = (pushEventModule.pushAnalyticsEvent as any).mock.calls.map(
      (call: any[]) => call[1],
    );
    expect(allParams.every((params: any) =>
      params.form_session_id === context.formSessionId &&
      params.form_id === 'pmp_qualification_roadmap' &&
      params.form_version &&
      params.page_path === '/go/linkedin' &&
      params.form_placement === 'certifications_hub_desktop' &&
      params.region_group === 'gcc' &&
      params.event_id
    )).toBe(true);
    expect(new Set(allParams.map((params: any) => params.event_id)).size)
      .toBe(allParams.length);

    const fitComplete = allParams[3];
    expect(fitComplete).toMatchObject({
      step_id: 'fit',
      industry: 'civil_engineering',
      experience: 'other',
      need: 'check_eligibility',
      has_experience_other_detail: true,
    });
    expect(fitComplete).not.toHaveProperty('pmExperienceOther');
    expect(fitComplete).not.toHaveProperty('email');
    expect(fitComplete).not.toHaveProperty('phone');

    expect(allParams[5]).toMatchObject({
      step_id: 'eligibility',
      education: 'bachelor_plus',
      training: 'completed',
      timeline: '3_to_6',
    });
    expect(allParams[8]).toMatchObject({
      clientSubmissionId: context.formSessionId,
      submission_id: 'submission-runtime-1',
    });
  });

  it('records validation only and never manufactures completion or a new view', () => {
    const tracker = createPmpRoadmapAnalyticsTracker(() => context);
    tracker.open();
    tracker.viewStep('fit');
    tracker.validationError('fit', 'experience_other_detail', 'required');
    tracker.validationError('fit', 'experience_other_detail', 'required');

    expect(
      (pushEventModule.pushAnalyticsEvent as any).mock.calls.map(
        (call: any[]) => call[0],
      ),
    ).toEqual([
      PMS_EVENTS.ROADMAP_OPEN,
      PMS_EVENTS.ROADMAP_STEP_VIEW,
      PMS_EVENTS.ROADMAP_VALIDATION_ERROR,
    ]);
    expect(
      (pushEventModule.pushAnalyticsEvent as any).mock.calls[2][1],
    ).toMatchObject({
      step_id: 'fit',
      field_key: 'experience_other_detail',
      error_code: 'required',
    });
  });

  it('does not emit a result conversion without a durable submission id', () => {
    const tracker = createPmpRoadmapAnalyticsTracker(() => context);
    tracker.submitAttempt();
    expect(tracker.resultView('')).toBe(false);
    expect(
      (pushEventModule.pushAnalyticsEvent as any).mock.calls.map(
        (call: any[]) => call[0],
      ),
    ).toEqual([PMS_EVENTS.ROADMAP_SUBMIT_ATTEMPT]);
  });

  it('scopes roadmap lifecycle to the allowlisted pms_roadmap_* events only', () => {
    expect(PMS_EVENTS.ROADMAP_OPEN).toBe('pms_roadmap_open');
    expect(PMS_EVENTS.ROADMAP_STEP_VIEW).toBe('pms_roadmap_step_view');
    expect(PMS_EVENTS.ROADMAP_START).toBe('pms_roadmap_start');
    expect(PMS_EVENTS.ROADMAP_VALIDATION_ERROR).toBe('pms_roadmap_validation_error');
    expect(PMS_EVENTS.ROADMAP_STEP_COMPLETE).toBe('pms_roadmap_step_complete');
    expect(PMS_EVENTS.ROADMAP_SUBMIT_ATTEMPT).toBe('pms_roadmap_submit_attempt');
    expect(PMS_EVENTS.ROADMAP_RESULT_VIEW).toBe('pms_roadmap_result_view');

    const tracker = createPmpRoadmapAnalyticsTracker(() => context);
    tracker.open();
    tracker.viewStep('fit');
    tracker.start();
    tracker.completeStep('fit', {
      industry: 'civil_engineering',
      experience: 'under_2',
      need: 'guidance',
    });
    tracker.viewStep('eligibility');
    tracker.completeStep('eligibility', {
      education: 'bachelor_plus',
      training: 'completed',
      timeline: 'exploring',
    });
    tracker.viewStep('contact');
    tracker.submitAttempt();
    tracker.resultView('submission-allowlist-1');

    const names = (pushEventModule.pushAnalyticsEvent as any).mock.calls.map(
      (call: any[]) => call[0],
    );
    expect(names.every((name: string) => name.startsWith('pms_roadmap_'))).toBe(true);
    expect(names).not.toContain(PMS_EVENTS.BEGIN_CHECKOUT);
    expect(names).not.toContain(PMS_EVENTS.PURCHASE);
    const params = (pushEventModule.pushAnalyticsEvent as any).mock.calls.map(
      (call: any[]) => call[1],
    );
    for (const entry of params) {
      expect(entry).not.toHaveProperty('email');
      expect(entry).not.toHaveProperty('phone');
      expect(entry).not.toHaveProperty('fullName');
      expect(entry).not.toHaveProperty('pmExperienceOther');
      expect(entry).not.toHaveProperty('preferredContactChannel');
      expect(entry).not.toHaveProperty('contactChannel');
    }
  });

  it('drives the form runtime sequence and suppresses failed or replayed results', () => {
    const tracker = createPmpRoadmapAnalyticsTracker(() => context);
    const runtime = createPmpRoadmapFormAnalyticsRuntime(tracker);

    runtime.expose();
    runtime.expose();
    runtime.mutate();
    runtime.mutate();
    runtime.blockAdvance('fit', 'experience_other_detail', 'required');
    runtime.advance('fit', 'contact', {});
    runtime.advance('fit', 'eligibility', {
      industry: 'construction',
      experience: '2_to_5',
      need: 'guidance',
    });
    runtime.advance('eligibility', 'contact', {
      education: 'bachelors',
      training: 'yes',
      timeline: '3_to_6',
    });
    runtime.submit();
    expect(runtime.acceptResult({ ok: false })).toBe(false);
    expect(
      runtime.acceptResult({
        ok: true,
        newDurableSubmission: false,
        submissionId: 'submission-http-200',
        idempotentReplay: false,
      }),
    ).toBe(false);
    expect(
      runtime.acceptResult({
        ok: true,
        newDurableSubmission: false,
        submissionId: 'submission-replayed',
        idempotentReplay: true,
      }),
    ).toBe(false);
    expect(
      runtime.acceptResult({
        ok: true,
        newDurableSubmission: true,
        submissionId: 'submission-new',
        idempotentReplay: false,
      }),
    ).toBe(true);

    expect(
      (pushEventModule.pushAnalyticsEvent as any).mock.calls.map(
        (call: any[]) => call[0],
      ),
    ).toEqual([
      PMS_EVENTS.ROADMAP_OPEN,
      PMS_EVENTS.ROADMAP_STEP_VIEW,
      PMS_EVENTS.ROADMAP_START,
      PMS_EVENTS.ROADMAP_VALIDATION_ERROR,
      PMS_EVENTS.ROADMAP_STEP_COMPLETE,
      PMS_EVENTS.ROADMAP_STEP_VIEW,
      PMS_EVENTS.ROADMAP_STEP_COMPLETE,
      PMS_EVENTS.ROADMAP_STEP_VIEW,
      PMS_EVENTS.ROADMAP_SUBMIT_ATTEMPT,
      PMS_EVENTS.ROADMAP_RESULT_VIEW,
    ]);
  });
});
