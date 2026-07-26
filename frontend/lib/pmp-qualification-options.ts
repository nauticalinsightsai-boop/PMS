/** P0.5 PMP qualification-lite roadmap form options and outcome resolution. */

export const FORM_VERSION = 'p0.5.1-chip-lite';

/** Step 1: Industry options (stable value keys retained for analytics continuity) */
export const WORK_FIELD_OPTIONS = [
  { value: 'project_management', label: 'PMO' },
  { value: 'civil_engineering', label: 'Construction' },
  { value: 'oil_gas_energy', label: 'Energy' },
  { value: 'it_digital', label: 'Technology' },
  { value: 'operations_business', label: 'Operations' },
  { value: 'other', label: 'Other' },
] as const;

export type WorkFieldValue = (typeof WORK_FIELD_OPTIONS)[number]['value'];

/** Step 1: Needs/objective options */
export const NEEDS_OBJECTIVE_OPTIONS = [
  { value: 'check_eligibility', label: 'Eligibility' },
  { value: 'join_cohort', label: 'Cohort' },
  { value: 'prepare_exam', label: 'Exam prep' },
  { value: 'team_training', label: 'Team' },
  { value: 'exploring', label: 'Exploring' },
] as const;

export type NeedsObjectiveValue = (typeof NEEDS_OBJECTIVE_OPTIONS)[number]['value'];

/** Step 2: Education level options */
export const EDUCATION_OPTIONS = [
  { value: 'associate', label: 'Associate' },
  { value: 'bachelor_plus', label: "Bachelor's+" },
  { value: 'gac_accredited', label: 'GAC' },
  { value: 'unsure', label: 'Not sure' },
] as const;

export type EducationValue = (typeof EDUCATION_OPTIONS)[number]['value'];

/** Step 2: PM experience in last 10 years (non-overlapping) */
export const PM_EXPERIENCE_OPTIONS = [
  { value: 'under_2', label: '<2 yrs' },
  { value: '2_to_3', label: '2–3 yrs' },
  { value: '3_to_4', label: '3–4 yrs' },
  { value: '4_to_5', label: '4–5 yrs' },
  { value: '5_plus', label: '5+ yrs' },
  { value: 'unsure', label: 'Not sure' },
] as const;

export type PmExperienceValue = (typeof PM_EXPERIENCE_OPTIONS)[number]['value'];

/** Step 2: 35 hours PM training status (never label as "35 PDUs") */
export const TRAINING_STATUS_OPTIONS = [
  { value: 'completed', label: 'Yes' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'not_yet', label: 'Not yet' },
  { value: 'capm_holder', label: 'CAPM' },
  { value: 'unsure', label: 'Not sure' },
] as const;

export type TrainingStatusValue = (typeof TRAINING_STATUS_OPTIONS)[number]['value'];

/** Step 2: Exam timeline */
export const EXAM_TIMELINE_OPTIONS = [
  { value: 'within_3', label: '<3 mo' },
  { value: '3_to_6', label: '3–6 mo' },
  { value: '6_to_12', label: '6–12 mo' },
  { value: 'more_than_12', label: '12+ mo' },
  { value: 'exploring', label: 'Exploring' },
] as const;


export type ExamTimelineValue = (typeof EXAM_TIMELINE_OPTIONS)[number]['value'];

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
  if (education === 'unsure' || pmExperience === 'unsure') {
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
      : education === 'bachelor_plus'
        ? pmExperience === '3_to_4' || pmExperience === '4_to_5' || pmExperience === '5_plus'
        : education === 'associate'
          ? pmExperience === '4_to_5' || pmExperience === '5_plus'
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
