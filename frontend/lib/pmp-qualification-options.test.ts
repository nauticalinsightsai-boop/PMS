import { describe, expect, it } from 'vitest';
import {
  resolveQualificationOutcome,
  getOutcomeMessage,
  WORK_FIELD_OPTIONS,
  NEEDS_OBJECTIVE_OPTIONS,
  EDUCATION_OPTIONS,
  FORM_VERSION,
  type QualificationAnswers,
} from '@/lib/pmp-qualification-options';

describe('qualification options lite surface', () => {
  it('uses the lite form version', () => {
    expect(FORM_VERSION).toBe('p0.6.0-four-choice');
  });

  it('exposes short one-line industry chips', () => {
    expect(WORK_FIELD_OPTIONS.map((o) => o.label)).toEqual([
      'Construction',
      'Energy',
      'Technology',
      'Other',
    ]);
  });

  it('caps needs objectives at four with short labels', () => {
    expect(NEEDS_OBJECTIVE_OPTIONS).toHaveLength(4);
    expect(NEEDS_OBJECTIVE_OPTIONS.map((o) => o.value)).toEqual([
      'check_eligibility',
      'prepare_exam',
      'guidance',
      'other',
    ]);
    expect(NEEDS_OBJECTIVE_OPTIONS.map((o) => o.label)).toEqual([
      'Eligibility',
      'Exam prep',
      'Guidance',
      'Other',
    ]);
  });

  it('uses the four approved education options', () => {
    expect(EDUCATION_OPTIONS.map((o) => o.value)).not.toContain('secondary');
    expect(EDUCATION_OPTIONS.map((o) => o.value)).toEqual([
      'associate',
      'bachelor_plus',
      'masters',
      'other',
    ]);
  });
});

describe('resolveQualificationOutcome', () => {
  const baseAnswers: QualificationAnswers = {
    workField: 'project_management',
    needsObjective: 'check_eligibility',
    education: 'bachelor_plus',
    pmExperience: '3_to_4',
    trainingStatus: 'completed',
    examTimeline: 'within_3',
  };

  it('returns corporate_enquiry when objective is team training', () => {
    const answers: QualificationAnswers = {
      ...baseAnswers,
      needsObjective: 'team_training',
    };
    expect(resolveQualificationOutcome(answers)).toBe('corporate_enquiry');
  });

  it('returns needs_verification when education is unsure', () => {
    const answers: QualificationAnswers = {
      ...baseAnswers,
      education: 'unsure',
    };
    expect(resolveQualificationOutcome(answers)).toBe('needs_verification');
  });

  it('returns needs_verification when experience is unsure', () => {
    const answers: QualificationAnswers = {
      ...baseAnswers,
      pmExperience: 'unsure',
    };
    expect(resolveQualificationOutcome(answers)).toBe('needs_verification');
  });

  it('returns preparation_discussion when training not started and exploring', () => {
    const answers: QualificationAnswers = {
      ...baseAnswers,
      trainingStatus: 'not_yet',
      examTimeline: 'exploring',
    };
    expect(resolveQualificationOutcome(answers)).toBe('preparation_discussion');
  });

  describe('likely_ready outcome', () => {
    it('returns likely_ready for bachelor+ with 3+ years and completed training', () => {
      const answers: QualificationAnswers = {
        ...baseAnswers,
        education: 'bachelor_plus',
        pmExperience: '3_to_4',
        trainingStatus: 'completed',
      };
      expect(resolveQualificationOutcome(answers)).toBe('likely_ready');
    });

    it('returns likely_ready for bachelor+ with 5+ years and CAPM', () => {
      const answers: QualificationAnswers = {
        ...baseAnswers,
        education: 'bachelor_plus',
        pmExperience: '5_plus',
        trainingStatus: 'capm_holder',
      };
      expect(resolveQualificationOutcome(answers)).toBe('likely_ready');
    });

    it('returns likely_ready for GAC-accredited degree with 2+ years of experience', () => {
      const answers: QualificationAnswers = {
        ...baseAnswers,
        education: 'gac_accredited',
        pmExperience: '2_to_3',
        trainingStatus: 'completed',
      };
      expect(resolveQualificationOutcome(answers)).toBe('likely_ready');
    });

    it('returns likely_ready for associate degree with 4+ years and completed training', () => {
      const answers: QualificationAnswers = {
        ...baseAnswers,
        education: 'associate',
        pmExperience: '4_to_5',
        trainingStatus: 'completed',
      };
      expect(resolveQualificationOutcome(answers)).toBe('likely_ready');
    });
  });

  describe('needs_verification outcome', () => {
    it('returns needs_verification for bachelor+ with only 2-3 years but training completed', () => {
      const answers: QualificationAnswers = {
        ...baseAnswers,
        education: 'bachelor_plus',
        pmExperience: '2_to_3',
        trainingStatus: 'completed',
      };
      expect(resolveQualificationOutcome(answers)).toBe('needs_verification');
    });

    it('returns needs_verification for associate degree with under 4 years', () => {
      const answers: QualificationAnswers = {
        ...baseAnswers,
        education: 'associate',
        pmExperience: '3_to_4',
        trainingStatus: 'completed',
      };
      expect(resolveQualificationOutcome(answers)).toBe('needs_verification');
    });

    it('returns preparation_discussion for GAC-accredited degree with under 2 years', () => {
      const answers: QualificationAnswers = {
        ...baseAnswers,
        education: 'gac_accredited',
        pmExperience: 'under_2',
        trainingStatus: 'completed',
      };
      expect(resolveQualificationOutcome(answers)).toBe('preparation_discussion');
    });

    it('returns needs_verification when training is in progress', () => {
      const answers: QualificationAnswers = {
        ...baseAnswers,
        education: 'bachelor_plus',
        pmExperience: '3_to_4',
        trainingStatus: 'in_progress',
      };
      expect(resolveQualificationOutcome(answers)).toBe('needs_verification');
    });

    it('returns needs_verification for adequate experience but training status unsure', () => {
      const answers: QualificationAnswers = {
        ...baseAnswers,
        education: 'bachelor_plus',
        pmExperience: '4_to_5',
        trainingStatus: 'unsure',
      };
      expect(resolveQualificationOutcome(answers)).toBe('needs_verification');
    });
  });

  describe('preparation_discussion outcome', () => {
    it('returns preparation_discussion for under 2 years experience', () => {
      const answers: QualificationAnswers = {
        ...baseAnswers,
        pmExperience: 'under_2',
        trainingStatus: 'not_yet',
      };
      expect(resolveQualificationOutcome(answers)).toBe('preparation_discussion');
    });

    it('returns preparation_discussion when both training and experience are insufficient', () => {
      const answers: QualificationAnswers = {
        ...baseAnswers,
        education: 'bachelor_plus',
        pmExperience: 'under_2',
        trainingStatus: 'not_yet',
        examTimeline: 'more_than_12',
      };
      expect(resolveQualificationOutcome(answers)).toBe('preparation_discussion');
    });
  });
});

describe('getOutcomeMessage', () => {
  it('returns appropriate message for likely_ready', () => {
    const message = getOutcomeMessage('likely_ready');
    expect(message).toContain('may be ready');
    expect(message).not.toContain('eligible');
    expect(message).not.toContain('qualified');
  });

  it('returns appropriate message for needs_verification', () => {
    const message = getOutcomeMessage('needs_verification');
    expect(message).toContain('verification');
  });

  it('returns appropriate message for preparation_discussion', () => {
    const message = getOutcomeMessage('preparation_discussion');
    expect(message).toContain('preparation');
  });

  it('returns appropriate message for corporate_enquiry', () => {
    const message = getOutcomeMessage('corporate_enquiry');
    expect(message).toContain('team training');
  });

  it('never claims formal PMP eligibility in any outcome', () => {
    const outcomes: Array<'likely_ready' | 'needs_verification' | 'preparation_discussion' | 'corporate_enquiry'> = [
      'likely_ready',
      'needs_verification',
      'preparation_discussion',
      'corporate_enquiry',
    ];

    for (const outcome of outcomes) {
      const message = getOutcomeMessage(outcome);
      expect(message.toLowerCase()).not.toContain('you are eligible');
      expect(message.toLowerCase()).not.toContain('you qualify');
      expect(message.toLowerCase()).not.toContain('you are qualified');
    }
  });
});
