import { PHONE_DIAL_CODES, type PhoneDialOption } from '@/lib/phone-dial-codes';

export type { PhoneDialOption };

export const PMP_ROADMAP_DIAL_CODES = PHONE_DIAL_CODES;

export function resolveDialOption(value: string): PhoneDialOption {
  return PMP_ROADMAP_DIAL_CODES.find((d) => d.value === value) ?? PMP_ROADMAP_DIAL_CODES[0];
}

export function formatDialPrefix(option: PhoneDialOption): string {
  return `${option.prefix} ${option.code}`;
}

export const PMP_JOB_EXPERIENCE_OPTIONS = [
  { value: 'under-3', label: 'Under 3 years' },
  { value: '3-5', label: '3–5 years' },
  { value: '5-10', label: '5–10 years' },
  { value: '10-plus', label: '10+ years' },
] as const;

/** Homepage lead form — primary certification family interest */
export const HOME_CERT_INTEREST_OPTIONS = [
  { value: 'pmp', label: 'PMP' },
  { value: 'prince2', label: 'PRINCE2' },
  { value: 'six-sigma', label: 'Six Sigma' },
] as const;

export type HomeCertInterestValue = (typeof HOME_CERT_INTEREST_OPTIONS)[number]['value'] | 'other';

export const PMP_DAILY_STUDY_OPTIONS = [
  { value: 'under-1', label: 'Under 1 hour' },
  { value: '1-2', label: '1–2 hours' },
  { value: '2-3', label: '2–3 hours' },
  { value: '3-plus', label: '3+ hours' },
] as const;

export const PMP_HOURS_PER_DAY_OPTIONS = [
  { value: '0-1', label: '0–1 hour' },
  { value: '1-2', label: '1–2 hours' },
  { value: '2-4', label: '2–4 hours' },
  { value: '4-plus', label: '4+ hours' },
] as const;

export const PMP_HOURS_PER_WEEK_OPTIONS = [
  { value: 'under-5', label: 'Under 5 hours' },
  { value: '5-10', label: '5–10 hours' },
  { value: '10-20', label: '10–20 hours' },
  { value: '20-plus', label: '20+ hours' },
] as const;
