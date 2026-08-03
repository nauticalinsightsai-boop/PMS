/** P0.5 PMP qualification-lite roadmap form options and outcome resolution. */

export const FORM_VERSION = 'p0.6.2-333-authoritative';

/** Step 1 (Context / fit): Industry → Experience → Need (stable value keys retained for analytics continuity) */
export const WORK_FIELD_OPTIONS = [
  { value: 'civil_engineering', label: 'Construction' },
  { value: 'oil_gas_energy', label: 'Energy' },
  { value: 'it_digital', label: 'Technology' },
  { value: 'other', label: 'Other' },
] as const;

/** Historical values remain valid when reading existing lead data. */
export type WorkFieldValue =
  | (typeof WORK_FIELD_OPTIONS)[number]['value']
  | 'project_management'
  | 'operations_business';

/** Step 1 (Context / fit): Need / objective options */
export const NEEDS_OBJECTIVE_OPTIONS = [
  { value: 'check_eligibility', label: 'Eligibility' },
  { value: 'prepare_exam', label: 'Exam prep' },
  { value: 'guidance', label: 'Guidance' },
  { value: 'other', label: 'Other' },
] as const;

export type NeedsObjectiveValue =
  | (typeof NEEDS_OBJECTIVE_OPTIONS)[number]['value']
  | 'join_cohort'
  | 'team_training'
  | 'exploring';

/** Step 2 (Readiness / eligibility): Education level options */
export const EDUCATION_OPTIONS = [
  { value: 'associate', label: 'Associate' },
  { value: 'bachelor_plus', label: "Bachelor's" },
  { value: 'masters', label: "Master's" },
  { value: 'other', label: 'Other' },
] as const;

export type EducationValue =
  | (typeof EDUCATION_OPTIONS)[number]['value']
  | 'gac_accredited'
  | 'unsure';

/** Step 1 (Context / fit): Experience in last 10 years — under_2 | 2_to_5 | 5_to_7 | other */
export const PM_EXPERIENCE_OPTIONS = [
  { value: 'under_2', label: '< 2 years' },
  { value: '2_to_5', label: '2–5 years' },
  { value: '5_to_7', label: '5–7 years' },
  { value: 'other', label: 'Other' },
] as const;

export type PmExperienceValue =
  | (typeof PM_EXPERIENCE_OPTIONS)[number]['value']
  | '2_to_3'
  | '3_to_4'
  | '4_to_5'
  | '5_plus'
  | 'unsure';

/** Step 2 (Readiness / eligibility): 35 hours PM training status (never label as "35 PDUs") */
export const TRAINING_STATUS_OPTIONS = [
  { value: 'completed', label: 'Yes' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'not_yet', label: 'Not yet' },
  { value: 'other', label: 'Other' },
] as const;

export type TrainingStatusValue =
  | (typeof TRAINING_STATUS_OPTIONS)[number]['value']
  | 'capm_holder'
  | 'unsure';

/** Step 2 (Readiness / eligibility): Exam timeline */
export const EXAM_TIMELINE_OPTIONS = [
  { value: 'within_3', label: '< 3 months' },
  { value: '3_to_6', label: '3–6 months' },
  { value: '6_plus', label: '6+ months' },
  { value: 'exploring', label: 'Exploring' },
] as const;

export type ExamTimelineValue =
  | (typeof EXAM_TIMELINE_OPTIONS)[number]['value']
  | '6_to_12'
  | 'more_than_12';

/** Qualification outcome types (never claim formal PMP eligibility; PMI decides/may audit) */
export type QualificationOutcome =
  | 'likely_ready'
  | 'needs_verification'
  | 'preparation_discussion'
  | 'corporate_enquiry';

export type QualificationAnswers = {
  workField: WorkFieldValue;
  needsObjective: NeedsObjectiveValue;
  education: EducationValue;
  pmExperience: PmExperienceValue;
  trainingStatus: TrainingStatusValue;
  examTimeline: ExamTimelineValue;
};

/**
 * Resolve qualification outcome based on user answers.
 * NEVER claims formal PMP eligibility; PMI decides and may audit.
 */
export function resolveQualificationOutcome(answers: QualificationAnswers): QualificationOutcome {
  const { needsObjective, education, pmExperience, trainingStatus, examTimeline } = answers;

  // Corporate/team enquiry
  if (needsObjective === 'team_training') {
    return 'corporate_enquiry';
  }

  // If user is unsure about education or experience, needs verification
  if (
    education === 'unsure' ||
    education === 'other' ||
    pmExperience === 'unsure' ||
    pmExperience === 'other' ||
    trainingStatus === 'other'
  ) {
    return 'needs_verification';
  }

  // If user has not started training yet and is exploring
  if (trainingStatus === 'not_yet' && examTimeline === 'exploring') {
    return 'preparation_discussion';
  }

  // Current PMP pathways for experience gained within the past 10 years:
  // - Associate / recognised short-cycle or technical qualification: 4 years
  // - Bachelor's degree or higher: 3 years
  // - PMI GAC-accredited degree: 2 years
  const hasAdequateExperience =
    education === 'gac_accredited'
      ? pmExperience !== 'under_2'
      : education === 'bachelor_plus' || education === 'masters'
        ? pmExperience === '3_to_4' || pmExperience === '4_to_5' || pmExperience === '5_plus' || pmExperience === '5_to_7'
        : education === 'associate'
          ? pmExperience === '4_to_5' || pmExperience === '5_plus' || pmExperience === '5_to_7'
          : false;

  // Must have completed or be completing the 35 hours training
  const hasTrainingCompleted = trainingStatus === 'completed' || trainingStatus === 'capm_holder';

  // If all requirements appear met, likely ready for eligibility review
  if (hasAdequateExperience && hasTrainingCompleted) {
    return 'likely_ready';
  }

  // If user has some experience but not enough, or training in progress
  if (trainingStatus === 'in_progress' || pmExperience !== 'under_2') {
    return 'needs_verification';
  }

  // Default to preparation discussion
  return 'preparation_discussion';
}

/** Map outcome to user-facing message (never claims formal eligibility) */
export function getOutcomeMessage(outcome: QualificationOutcome): string {
  switch (outcome) {
    case 'likely_ready':
      return "Based on your responses, you may be ready for an eligibility review. We'll help you verify the details.";
    case 'needs_verification':
      return "A few details need verification. We'll help clarify what counts toward PMP eligibility.";
    case 'preparation_discussion':
      return "Let's discuss your preparation pathway and build a realistic plan together.";
    case 'corporate_enquiry':
      return "Thank you for your interest in team training. We'll discuss tailored options for your organization.";
  }
}
