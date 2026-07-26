import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PMS_EVENTS } from '@/lib/analytics/pms-events';
import * as pushEventModule from '@/lib/analytics/push-event';
import {
  resetPmpQualificationEventDedupe,
  trackPmpQualificationEligibilityComplete,
  trackPmpQualificationFitComplete,
  trackPmpQualificationFormOpen,
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

  it('keeps mount exposure separate from first-mutation start', () => {
    const input = {
      formSessionId: 'lead_session_1',
      formPlacement: 'home_hero_desktop',
      regionGroup: 'gcc',
    };
    trackPmpQualificationFormOpen(input);

    expect(pushEventModule.pushAnalyticsEvent).toHaveBeenCalledWith(
      PMS_EVENTS.PMP_ROADMAP_OPEN,
      expect.objectContaining({
        form_id: 'pmp_qualification_roadmap',
        form_placement: 'home_hero_desktop',
        region_group: 'gcc',
      }),
    );
    expect(pushEventModule.pushAnalyticsEvent).not.toHaveBeenCalledWith(
      PMS_EVENTS.PMP_ROADMAP_START,
      expect.anything(),
    );

    trackPmpQualificationFormStart(input);
    trackPmpQualificationFormStart(input);
    expect(pushEventModule.pushAnalyticsEvent).toHaveBeenCalledTimes(2);
    expect(pushEventModule.pushAnalyticsEvent).toHaveBeenLastCalledWith(
      PMS_EVENTS.PMP_ROADMAP_START,
      expect.objectContaining({
        form_id: 'pmp_qualification_roadmap',
        form_placement: 'home_hero_desktop',
        region_group: 'gcc',
      }),
    );
  });

  it('fires fit completion once per form session', () => {
    const input = {
      formSessionId: 'lead_session_1',
      leadField: 'civil_engineering',
      leadObjective: 'check_eligibility',
    };
    trackPmpQualificationFitComplete(input);
    trackPmpQualificationFitComplete(input);

    expect(pushEventModule.pushAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(pushEventModule.pushAnalyticsEvent).toHaveBeenCalledWith(
      PMS_EVENTS.PMP_ROADMAP_STEP_COMPLETE,
      expect.objectContaining({
        lead_field: 'civil_engineering',
        lead_objective: 'check_eligibility',
      }),
    );
  });

  it('fires eligibility completion once per form session and strips contact details', () => {
    const input = {
      formSessionId: 'lead_session_1',
      educationBand: 'bachelor_plus',
      experienceBand: '5_plus',
      trainingStatus: 'completed',
      examTimeline: 'within_3_months',
    };
    trackPmpQualificationEligibilityComplete(input);
    trackPmpQualificationEligibilityComplete(input);

    expect(pushEventModule.pushAnalyticsEvent).toHaveBeenCalledTimes(1);
    const params = (pushEventModule.pushAnalyticsEvent as any).mock.calls[0][1];
    expect(params).toMatchObject({
      education_band: 'bachelor_plus',
      experience_band: '5_plus',
      training_status: 'completed',
      exam_timeline: 'within_3_months',
    });
    expect(params).not.toHaveProperty('email');
    expect(params).not.toHaveProperty('phone');
    expect(params).not.toHaveProperty('fullName');
    expect(params).not.toHaveProperty('contactWindow');
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
