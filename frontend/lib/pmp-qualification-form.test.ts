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
import { PM_EXPERIENCE_OPTIONS } from '@/lib/pmp-qualification-options';

const completeValues: PmpQualificationFormValues = {
  workField: 'civil_engineering',
  pmExperience: '5_to_7',
  needsObjective: 'check_eligibility',
  education: 'bachelor_plus',
  trainingStatus: 'completed',
  examTimeline: 'within_3',
  workFieldOther: '',
  pmExperienceOther: '',
  needsObjectiveOther: '',
  educationOther: '',
  trainingStatusOther: '',
  fullName: 'Aisha Khan',
  phone: '50 123 4567',
  email: 'aisha@example.com',
};

describe('PMP qualification step flow (authoritative 3/3/3)', () => {
  it('exposes only approved experience choice values', () => {
    expect(PM_EXPERIENCE_OPTIONS.map((o) => o.value)).toEqual([
      'under_2',
      '2_to_5',
      '5_to_7',
      'other',
    ]);
    expect(PM_EXPERIENCE_OPTIONS.map((o) => o.label)).toEqual([
      '< 2 years',
      '2–5 years',
      '5–7 years',
      'Other',
    ]);
    expect(PM_EXPERIENCE_OPTIONS.map((o) => o.value).join(',')).not.toMatch(
      /lt_2_years|2_to_5_years|5_to_7_years/,
    );
  });

  it.each([
    ['fit', 'workField', ''],
    ['fit', 'pmExperience', ''],
    ['fit', 'needsObjective', ''],
    ['eligibility', 'education', ''],
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

  it('validates Step 1 in Industry → Experience → Need order', () => {
    expect(
      validatePmpQualificationStep('fit', {
        ...completeValues,
        workField: '',
        pmExperience: '',
        needsObjective: '',
      }),
    ).toMatchObject({ field: 'workField' });
    expect(
      validatePmpQualificationStep('fit', {
        ...completeValues,
        pmExperience: '',
        needsObjective: '',
      }),
    ).toMatchObject({ field: 'pmExperience' });
    expect(
      validatePmpQualificationStep('fit', {
        ...completeValues,
        needsObjective: '',
      }),
    ).toMatchObject({ field: 'needsObjective' });
  });

  it('requires Experience Other detail on fit and omits raw text from non-Other payload', () => {
    const otherValues: PmpQualificationFormValues = {
      ...completeValues,
      workField: 'other',
      workFieldOther: 'Aviation',
      pmExperience: 'other',
      pmExperienceOther: 'Independent consulting',
      needsObjective: 'other',
      needsObjectiveOther: 'Mentoring',
      education: 'other',
      educationOther: 'Diploma',
      trainingStatus: 'other',
      trainingStatusOther: 'Equivalent training',
    };
    expect(validatePmpQualificationStep('fit', otherValues)).toBeNull();
    expect(validatePmpQualificationStep('eligibility', otherValues)).toBeNull();
    expect(
      validatePmpQualificationStep('fit', { ...otherValues, pmExperienceOther: '' }),
    ).toMatchObject({ field: 'pmExperienceOther' });
    expect(
      validatePmpQualificationStep('eligibility', { ...otherValues, educationOther: '' }),
    ).toMatchObject({ field: 'educationOther' });

    const payload = buildPmpQualificationSubmissionPayload({
      values: otherValues,
      dialCode: 'AE',
      dialPrefix: '+971',
      qualificationOutcome: 'needs_verification',
      placement: 'home_hero_desktop',
      certName: 'PMP',
    });
    expect(payload).toMatchObject({
      workField: 'other',
      pmExperience: 'other',
      needsObjective: 'other',
      pmExperienceOther: 'Independent consulting',
      education: 'other',
      educationOther: 'Diploma',
    });
    expect(payload).not.toHaveProperty('preferredContactChannel');
    expect(payload).not.toHaveProperty('preferredContactWindow');
    expect(payload).not.toHaveProperty('contactChannel');
    expect(payload).not.toHaveProperty('contactWindow');
    expect(
      buildPmpQualificationSubmissionPayload({
        values: completeValues,
        dialCode: 'AE',
        dialPrefix: '+971',
        qualificationOutcome: 'likely_ready',
        placement: 'home_hero_desktop',
        certName: 'PMP',
      }).pmExperienceOther,
    ).toBeUndefined();
  });

  it('omits stale Other detail text when the selected choice is no longer Other', () => {
    const payload = buildPmpQualificationSubmissionPayload({
      values: {
        ...completeValues,
        workField: 'civil_engineering',
        workFieldOther: 'stale aviation',
        pmExperience: '2_to_5',
        pmExperienceOther: 'stale consulting',
        needsObjective: 'guidance',
        needsObjectiveOther: 'stale mentoring',
        education: 'bachelor_plus',
        educationOther: 'stale diploma',
        trainingStatus: 'completed',
        trainingStatusOther: 'stale training',
      },
      dialCode: 'AE',
      dialPrefix: '+971',
      qualificationOutcome: 'likely_ready',
      placement: 'home_hero_desktop',
      certName: 'PMP',
    });
    expect(payload.workFieldOther).toBeUndefined();
    expect(payload.pmExperienceOther).toBeUndefined();
    expect(payload.needsObjectiveOther).toBeUndefined();
    expect(payload.educationOther).toBeUndefined();
    expect(payload.trainingStatusOther).toBeUndefined();
    expect(payload).not.toHaveProperty('preferredContactChannel');
  });

  it('moves forward and backward without discarding the answers', () => {
    expect(nextPmpQualificationStep('fit')).toBe('eligibility');
    expect(nextPmpQualificationStep('eligibility')).toBe('contact');
    expect(previousPmpQualificationStep('contact')).toBe('eligibility');
    expect(previousPmpQualificationStep('eligibility')).toBe('fit');
  });

  it('tracks partial data and submission id helpers', () => {
    expect(hasPmpQualificationPartialData(completeValues)).toBe(true);
    const create = vi.fn(() => 'new-id');
    expect(getOrCreatePmpSubmissionId(null, create)).toBe('new-id');
    expect(getOrCreatePmpSubmissionId('existing', create)).toBe('existing');
    expect(getPmpChoiceTabIndex(true, true, 2)).toBe(0);
    expect(getPmpChoiceTabIndex(false, false, 0)).toBe(0);
  });
});
