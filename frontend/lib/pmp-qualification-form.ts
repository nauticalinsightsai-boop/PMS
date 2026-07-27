import type {
  EducationValue,
  ExamTimelineValue,
  NeedsObjectiveValue,
  PmExperienceValue,
  TrainingStatusValue,
  WorkFieldValue,
} from '@/lib/pmp-qualification-options';

export type PmpQualificationFormStep = 'fit' | 'eligibility' | 'contact';

export type PmpQualificationFormValues = {
  workField: WorkFieldValue | '';
  pmExperience: PmExperienceValue | '';
  needsObjective: NeedsObjectiveValue | '';
  education: EducationValue | '';
  trainingStatus: TrainingStatusValue | '';
  examTimeline: ExamTimelineValue | '';
  workFieldOther: string;
  pmExperienceOther: string;
  needsObjectiveOther: string;
  educationOther: string;
  trainingStatusOther: string;
  fullName: string;
  phone: string;
  email: string;
};

export type PmpQualificationValidationIssue = {
  field:
    | 'workField'
    | 'pmExperience'
    | 'needsObjective'
    | 'education'
    | 'trainingStatus'
    | 'examTimeline'
    | 'workFieldOther'
    | 'pmExperienceOther'
    | 'needsObjectiveOther'
    | 'educationOther'
    | 'trainingStatusOther'
    | 'fullName'
    | 'phone'
    | 'email';
  code: 'required' | 'invalid_format' | 'invalid_length';
  message: string;
};

export const PMP_ANALYTICS_FIELD_KEY: Record<
  PmpQualificationValidationIssue['field'],
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
  | 'email'
> = {
  workField: 'industry',
  pmExperience: 'experience',
  needsObjective: 'need',
  education: 'education',
  trainingStatus: 'training',
  examTimeline: 'timeline',
  workFieldOther: 'industry_other_detail',
  pmExperienceOther: 'experience_other_detail',
  needsObjectiveOther: 'need_other_detail',
  educationOther: 'education_other_detail',
  trainingStatusOther: 'training_other_detail',
  fullName: 'full_name',
  phone: 'mobile',
  email: 'email',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Authoritative 3/3/3 (0d204ee / 4.1):
 * fit (Context) = Industry + Experience + Need
 * eligibility (Readiness) = Education + Training + Timeline
 * contact = Full name + Mobile + Email
 * Conditional Other-detail fields are dependents, not primary inputs.
 * Channel/window are optional/legacy only (not primary inputs).
 */
export function validatePmpQualificationStep(
  step: PmpQualificationFormStep,
  values: PmpQualificationFormValues,
): PmpQualificationValidationIssue | null {
  if (step === 'fit') {
    // Authoritative order: Industry → Experience → Need
    if (!values.workField) {
      return { field: 'workField', code: 'required', message: 'Please select your industry.' };
    }
    if (values.workField === 'other' && !values.workFieldOther.trim()) {
      return { field: 'workFieldOther', code: 'required', message: 'Please specify your industry.' };
    }
    if (!values.pmExperience) {
      return { field: 'pmExperience', code: 'required', message: 'Please select your PM experience.' };
    }
    if (values.pmExperience === 'other' && !values.pmExperienceOther.trim()) {
      return { field: 'pmExperienceOther', code: 'required', message: 'Please specify your PM experience.' };
    }
    if (!values.needsObjective) {
      return { field: 'needsObjective', code: 'required', message: 'Please select what you need help with.' };
    }
    if (values.needsObjective === 'other' && !values.needsObjectiveOther.trim()) {
      return { field: 'needsObjectiveOther', code: 'required', message: 'Please specify what you need help with.' };
    }
    return null;
  }

  if (step === 'eligibility') {
    if (!values.education) {
      return { field: 'education', code: 'required', message: 'Please select your education level.' };
    }
    if (values.education === 'other' && !values.educationOther.trim()) {
      return { field: 'educationOther', code: 'required', message: 'Please specify your education level.' };
    }
    if (!values.trainingStatus) {
      return { field: 'trainingStatus', code: 'required', message: 'Please select your training status.' };
    }
    if (values.trainingStatus === 'other' && !values.trainingStatusOther.trim()) {
      return { field: 'trainingStatusOther', code: 'required', message: 'Please specify your training status.' };
    }
    if (!values.examTimeline) {
      return { field: 'examTimeline', code: 'required', message: 'Please select your exam timeline.' };
    }
    return null;
  }

  if (values.fullName.trim().length < 2) {
    return { field: 'fullName', code: 'invalid_length', message: 'Please enter your full name.' };
  }
  const phoneDigits = values.phone.replace(/\D/g, '');
  if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    return { field: 'phone', code: 'invalid_length', message: 'Please enter a valid mobile number.' };
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    return { field: 'email', code: 'invalid_format', message: 'Please enter a valid email address.' };
  }
  return null;
}

export function nextPmpQualificationStep(
  step: PmpQualificationFormStep,
): PmpQualificationFormStep {
  return step === 'fit' ? 'eligibility' : 'contact';
}

export function previousPmpQualificationStep(
  step: PmpQualificationFormStep,
): PmpQualificationFormStep {
  return step === 'contact' ? 'eligibility' : 'fit';
}

export function hasPmpQualificationPartialData(
  values: PmpQualificationFormValues,
): boolean {
  return Object.values(values).some((value) => value.trim().length > 0);
}

export function getOrCreatePmpSubmissionId(
  current: string | null,
  create: () => string,
): string {
  return current ?? create();
}

/**
 * Keep each custom radio group to one Tab stop while leaving the first choice
 * reachable before a selection exists.
 */
export function getPmpChoiceTabIndex(
  selected: boolean,
  hasSelection: boolean,
  optionIndex: number,
): 0 | -1 {
  return selected || (!hasSelection && optionIndex === 0) ? 0 : -1;
}

export function buildPmpQualificationSubmissionPayload(input: {
  values: PmpQualificationFormValues;
  dialCode: string;
  dialPrefix: string;
  qualificationOutcome: string;
  placement: string;
  siteCertId?: string;
  certName: string;
  gccCountry?: string;
  channelId?: string;
  landingSlug?: string;
}): Record<string, string | undefined> {
  const { values } = input;
  return {
    fullName: values.fullName.trim(),
    phoneCountryCode: input.dialCode,
    phoneCountryPrefix: input.dialPrefix,
    phone: values.phone.trim(),
    phoneFull: `${input.dialPrefix} ${values.phone.trim()}`.trim(),
    // Authoritative taxonomy order: Industry, Experience, Need, Education, Training, Timeline
    workField: values.workField,
    pmExperience: values.pmExperience,
    needsObjective: values.needsObjective,
    education: values.education,
    trainingStatus: values.trainingStatus,
    examTimeline: values.examTimeline,
    workFieldOther: values.workField === 'other' ? values.workFieldOther.trim() : undefined,
    pmExperienceOther:
      values.pmExperience === 'other' ? values.pmExperienceOther.trim() : undefined,
    needsObjectiveOther:
      values.needsObjective === 'other' ? values.needsObjectiveOther.trim() : undefined,
    educationOther: values.education === 'other' ? values.educationOther.trim() : undefined,
    trainingStatusOther:
      values.trainingStatus === 'other' ? values.trainingStatusOther.trim() : undefined,
    qualificationOutcome: input.qualificationOutcome,
    placement: input.placement,
    siteCertId: input.siteCertId,
    certName: input.certName,
    gccCountry: input.gccCountry,
    channelId: input.channelId,
    landingSlug: input.landingSlug,
  };
}
