/** P0.4 PMP qualification-first roadmap form options and outcome resolution. */

export const FORM_VERSION = 'p0.4-qualification-first';

/** Step 1: Work field options */
export const WORK_FIELD_OPTIONS = [
  { value: 'project_management', label: 'Project Management / PMO' },
  { value: 'civil_engineering', label: 'Civil Engineering / Construction' },
  { value: 'oil_gas_energy', label: 'Oil & Gas / Energy' },
  { value: 'mechanical_electrical', label: 'Mechanical / Electrical / MEP Engineering' },
  { value: 'it_digital', label: 'IT / Digital / Technology' },
  { value: 'operations_business', label: 'Operations / Business' },
  { value: 'other', label: 'Other' },
] as const;

export type WorkFieldValue = (typeof WORK_FIELD_OPTIONS)[number]['value'];

/** Step 1: Needs/objective options */
export const NEEDS_OBJECTIVE_OPTIONS = [
  { value: 'check_eligibility', label: 'Check my PMP eligibility' },
  { value: 'join_cohort', label: 'Join the upcoming PMP cohort' },
  { value: 'updated_exam', label: 'Prepare for the updated PMP exam' },
  { value: 'study_plan', label: 'Build a realistic study plan' },
  { value: 'team_training', label: 'Discuss training for my team' },
  { value: 'exploring', label: 'I am still exploring' },
] as const;

export type NeedsObjectiveValue = (typeof NEEDS_OBJECTIVE_OPTIONS)[number]['value'];

/** Step 2: Education level options */
export const EDUCATION_OPTIONS = [
  { value: 'secondary', label: 'Secondary school / high school' },
  { value: 'associate', label: 'Associate degree / recognised technical or vocational qualification' },
  { value: 'bachelor_plus', label: "Bachelor's degree or higher" },
  { value: 'gac_accredited', label: 'PMI GAC-accredited degree programme' },
  { value: 'unsure', label: 'Not sure how my qualification maps' },
] as const;

export type EducationValue = (typeof EDUCATION_OPTIONS)[number]['value'];

/** Step 2: PM experience in last 10 years (non-overlapping) */
export const PM_EXPERIENCE_OPTIONS = [
  { value: 'under_2', label: 'Less than 2 years' },
  { value: '2_to_3', label: '2 to under 3' },
  { value: '3_to_4', label: '3 to under 4' },
  { value: '4_to_5', label: '4 to under 5' },
  { value: '5_plus', label: '5 years or more' },
  { value: 'unsure', label: 'Not sure what counts' },
] as const;

export type PmExperienceValue = (typeof PM_EXPERIENCE_OPTIONS)[number]['value'];

/** Step 2: 35 hours PM training status (never label as "35 PDUs") */
export const TRAINING_STATUS_OPTIONS = [
  { value: 'completed', label: 'Yes completed' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'not_yet', label: 'Not yet' },
  { value: 'capm_holder', label: 'I hold CAPM' },
  { value: 'unsure', label: 'Not sure' },
] as const;

export type TrainingStatusValue = (typeof TRAINING_STATUS_OPTIONS)[number]['value'];

/** Step 2: Exam timeline */
export const EXAM_TIMELINE_OPTIONS = [
  { value: 'within_3', label: 'Within 3 months' },
  { value: '3_to_6', label: '3–6 months' },
  { value: '6_to_12', label: '6–12 months' },
  { value: 'more_than_12', label: 'More than 12 months' },
  { value: 'exploring', label: 'Still exploring' },
] as const;

export type ExamTimelineValue = (typeof EXAM_TIMELINE_OPTIONS)[number]['value'];

/** Step 3: Preferred contact channel (NO WhatsApp) */
export const CONTACT_CHANNEL_OPTIONS = [
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
  { value: 'instagram', label: 'Instagram message' },
  { value: 'messenger', label: 'Messenger' },
] as const;

export type ContactChannelValue = (typeof CONTACT_CHANNEL_OPTIONS)[number]['value'];

/** Step 3: Preferred contact window */
export const CONTACT_WINDOW_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
] as const;

export type ContactWindowValue = (typeof CONTACT_WINDOW_OPTIONS)[number]['value'];

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
  // - Secondary school: 5 years
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
          : pmExperience === '5_plus';

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
