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
  needsObjective: NeedsObjectiveValue | '';
  education: EducationValue | '';
  pmExperience: PmExperienceValue | '';
  trainingStatus: TrainingStatusValue | '';
  examTimeline: ExamTimelineValue | '';
  workFieldOther: string;
  needsObjectiveOther: string;
  educationOther: string;
  pmExperienceOther: string;
  trainingStatusOther: string;
  fullName: string;
  phone: string;
  email: string;
};

export type PmpQualificationValidationIssue = {
  field:
    | 'workField'
    | 'needsObjective'
    | 'education'
    | 'pmExperience'
    | 'trainingStatus'
    | 'examTimeline'
    | 'workFieldOther'
    | 'needsObjectiveOther'
    | 'educationOther'
    | 'pmExperienceOther'
    | 'trainingStatusOther'
    | 'fullName'
    | 'phone'
    | 'email';
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validatePmpQualificationStep(
  step: PmpQualificationFormStep,
  values: PmpQualificationFormValues,
): PmpQualificationValidationIssue | null {
  if (step === 'fit') {
    if (!values.workField) {
      return { field: 'workField', message: 'Please select your industry.' };
    }
    if (!values.needsObjective) {
      return { field: 'needsObjective', message: 'Please select what you need help with.' };
    }
    if (values.workField === 'other' && !values.workFieldOther.trim()) {
      return { field: 'workFieldOther', message: 'Please specify your industry.' };
    }
    if (values.needsObjective === 'other' && !values.needsObjectiveOther.trim()) {
      return { field: 'needsObjectiveOther', message: 'Please specify what you need help with.' };
    }
    return null;
  }

  if (step === 'eligibility') {
    if (!values.education) {
      return { field: 'education', message: 'Please select your education level.' };
    }
    if (!values.pmExperience) {
      return { field: 'pmExperience', message: 'Please select your PM experience.' };
    }
    if (!values.trainingStatus) {
      return { field: 'trainingStatus', message: 'Please select your training status.' };
    }
    if (!values.examTimeline) {
      return { field: 'examTimeline', message: 'Please select your exam timeline.' };
    }
    const otherDetailFields: Array<[
      boolean,
      PmpQualificationValidationIssue['field'],
      string,
    ]> = [
      [values.education === 'other' && !values.educationOther.trim(), 'educationOther', 'Please specify your education level.'],
      [values.pmExperience === 'other' && !values.pmExperienceOther.trim(), 'pmExperienceOther', 'Please specify your PM experience.'],
      [values.trainingStatus === 'other' && !values.trainingStatusOther.trim(), 'trainingStatusOther', 'Please specify your training status.'],
    ];
    const missingOtherDetail = otherDetailFields.find(([isMissing]) => isMissing);
    if (missingOtherDetail) {
      return { field: missingOtherDetail[1], message: missingOtherDetail[2] };
    }
    return null;
  }

  if (values.fullName.trim().length < 2) {
    return { field: 'fullName', message: 'Please enter your full name.' };
  }
  const phoneDigits = values.phone.replace(/\D/g, '');
  if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    return { field: 'phone', message: 'Please enter a valid mobile number.' };
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    return { field: 'email', message: 'Please enter a valid email address.' };
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
    workField: values.workField,
    needsObjective: values.needsObjective,
    education: values.education,
    pmExperience: values.pmExperience,
    trainingStatus: values.trainingStatus,
    examTimeline: values.examTimeline,
    workFieldOther: values.workField === 'other' ? values.workFieldOther.trim() : undefined,
    needsObjectiveOther:
      values.needsObjective === 'other' ? values.needsObjectiveOther.trim() : undefined,
    educationOther: values.education === 'other' ? values.educationOther.trim() : undefined,
    pmExperienceOther:
      values.pmExperience === 'other' ? values.pmExperienceOther.trim() : undefined,
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
