import { describe, expect, it, vi } from 'vitest';
import {
  buildPmpQualificationSubmissionPayload,
  getOrCreatePmpSubmissionId,
  getPmpChoiceTabIndex,
  hasPmpQualificationPartialData,
  nextPmpQualificationStep,
  previousPmpQualificationStep,
  type PmpQualificationFormValues,
  validatePmpQualificationStep,
} from '@/lib/pmp-qualification-form';

const completeValues: PmpQualificationFormValues = {
  workField: 'civil_engineering',
  needsObjective: 'join_cohort',
  education: 'bachelor_plus',
  pmExperience: '3_to_4',
  trainingStatus: 'completed',
  examTimeline: 'within_3',
  workFieldOther: '',
  needsObjectiveOther: '',
  educationOther: '',
  pmExperienceOther: '',
  trainingStatusOther: '',
  fullName: 'Aisha Khan',
  phone: '50 123 4567',
  email: 'aisha@example.com',
};

describe('PMP qualification step flow', () => {
  it.each([
    ['fit', 'workField', ''],
    ['fit', 'needsObjective', ''],
    ['eligibility', 'education', ''],
    ['eligibility', 'pmExperience', ''],
    ['eligibility', 'trainingStatus', ''],
    ['eligibility', 'examTimeline', ''],
    ['contact', 'fullName', 'x'],
    ['contact', 'phone', '123456'],
    ['contact', 'email', 'invalid'],
  ] as const)(
    'blocks %s forward movement when %s is invalid',
    (step, field, invalidValue) => {
      expect(
        validatePmpQualificationStep(step, {
          ...completeValues,
          [field]: invalidValue,
        }),
      ).toMatchObject({ field });
    },
  );

  it('accepts every complete step before moving forward', () => {
    expect(validatePmpQualificationStep('fit', completeValues)).toBeNull();
    expect(validatePmpQualificationStep('eligibility', completeValues)).toBeNull();
    expect(validatePmpQualificationStep('contact', completeValues)).toBeNull();
  });

  it('requires a detail when an Other choice is selected and persists it only for that choice', () => {
    const otherValues: PmpQualificationFormValues = {
      ...completeValues,
      workField: 'other',
      workFieldOther: 'Aviation',
      needsObjective: 'other',
      needsObjectiveOther: 'Mentoring',
      education: 'other',
      educationOther: 'Diploma',
      pmExperience: 'other',
      pmExperienceOther: 'Independent consulting',
      trainingStatus: 'other',
      trainingStatusOther: 'Equivalent training',
    };
    expect(validatePmpQualificationStep('fit', otherValues)).toBeNull();
    expect(validatePmpQualificationStep('eligibility', otherValues)).toBeNull();
    expect(validatePmpQualificationStep('fit', { ...otherValues, workFieldOther: '' })).toMatchObject({
      field: 'workFieldOther',
    });
    expect(validatePmpQualificationStep('eligibility', { ...otherValues, educationOther: '' })).toMatchObject({
      field: 'educationOther',
    });
    expect(
      buildPmpQualificationSubmissionPayload({
        values: otherValues,
        dialCode: 'AE',
        dialPrefix: '+971',
        qualificationOutcome: 'needs_verification',
        placement: 'home_hero_desktop',
        certName: 'PMP',
      }),
    ).toMatchObject({
      workFieldOther: 'Aviation',
      needsObjectiveOther: 'Mentoring',
      educationOther: 'Diploma',
      pmExperienceOther: 'Independent consulting',
      trainingStatusOther: 'Equivalent training',
    });
  });

  it('moves forward and backward without discarding the answers', () => {
    expect(validatePmpQualificationStep('fit', completeValues)).toBeNull();
    const second = nextPmpQualificationStep('fit');
    expect(second).toBe('eligibility');
    expect(validatePmpQualificationStep(second, completeValues)).toBeNull();
    expect(nextPmpQualificationStep(second)).toBe('contact');
    expect(previousPmpQualificationStep('contact')).toBe('eligibility');
    expect(previousPmpQualificationStep('eligibility')).toBe('fit');
    expect(completeValues.workField).toBe('civil_engineering');
  });

  it('treats fit or eligibility answers as partial recovery state', () => {
    const empty = Object.fromEntries(
      Object.keys(completeValues).map((key) => [key, '']),
    ) as PmpQualificationFormValues;
    expect(hasPmpQualificationPartialData(empty)).toBe(false);
    expect(
      hasPmpQualificationPartialData({ ...empty, workField: 'other' }),
    ).toBe(true);
    expect(
      hasPmpQualificationPartialData({ ...empty, education: 'associate' }),
    ).toBe(true);
    for (const [field, value] of Object.entries(completeValues)) {
      if (!value) continue;
      expect(
        hasPmpQualificationPartialData({
          ...empty,
          [field]: value,
        } as PmpQualificationFormValues),
      ).toBe(true);
    }
  });

  it('keeps custom radio groups to one keyboard Tab stop', () => {
    expect(getPmpChoiceTabIndex(false, false, 0)).toBe(0);
    expect(getPmpChoiceTabIndex(false, false, 1)).toBe(-1);
    expect(getPmpChoiceTabIndex(false, true, 0)).toBe(-1);
    expect(getPmpChoiceTabIndex(true, true, 2)).toBe(0);
  });
});

describe('PMP qualification submission', () => {
  it('reuses one clientSubmissionId across a retry', () => {
    const create = vi.fn(() => 'lead_stable-retry-id');
    const first = getOrCreatePmpSubmissionId(null, create);
    const retry = getOrCreatePmpSubmissionId(first, create);
    expect(retry).toBe(first);
    expect(create).toHaveBeenCalledTimes(1);
  });

  it('maps every intended qualification field once and omits study hours and contact prefs', () => {
    const payload = buildPmpQualificationSubmissionPayload({
      values: completeValues,
      dialCode: 'AE',
      dialPrefix: '+971',
      qualificationOutcome: 'likely_ready',
      placement: 'home_hero_desktop',
      certName: 'PMP',
      channelId: 'instagram',
      landingSlug: 'instagram',
    });

    expect(payload).toMatchObject({
      workField: 'civil_engineering',
      needsObjective: 'join_cohort',
      education: 'bachelor_plus',
      pmExperience: '3_to_4',
      trainingStatus: 'completed',
      examTimeline: 'within_3',
      fullName: 'Aisha Khan',
      phoneCountryCode: 'AE',
      phoneCountryPrefix: '+971',
      phone: '50 123 4567',
      phoneFull: '+971 50 123 4567',
    });
    const qualificationKeys = [
      'workField',
      'needsObjective',
      'education',
      'pmExperience',
      'trainingStatus',
      'examTimeline',
    ];
    for (const field of qualificationKeys) {
      expect(Object.keys(payload).filter((key) => key === field)).toHaveLength(1);
    }
    expect(payload).not.toHaveProperty('preferredContactChannel');
    expect(payload).not.toHaveProperty('preferredContactWindow');
    const persistedInteraction = {
      email: completeValues.email,
      payload,
    };
    expect(persistedInteraction.email).toBe('aisha@example.com');
    expect(payload).not.toHaveProperty('email');
    expect(Object.keys(payload)).not.toContain('dailyStudyHours');
    expect(JSON.stringify(payload).toLowerCase()).not.toContain('studyhours');
  });
});
