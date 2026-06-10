export type PhoneDialOption = { code: string; label: string };

export const PMP_ROADMAP_DIAL_CODES: readonly PhoneDialOption[] = [
  { code: '+1', label: 'United States +1' },
  { code: '+44', label: 'United Kingdom +44' },
  { code: '+91', label: 'India +91' },
  { code: '+92', label: 'Pakistan +92' },
  { code: '+971', label: 'UAE +971' },
  { code: '+966', label: 'Saudi Arabia +966' },
  { code: '+974', label: 'Qatar +974' },
  { code: '+965', label: 'Kuwait +965' },
  { code: '+973', label: 'Bahrain +973' },
  { code: '+968', label: 'Oman +968' },
  { code: '+49', label: 'Germany +49' },
  { code: '+33', label: 'France +33' },
  { code: '+61', label: 'Australia +61' },
  { code: '+65', label: 'Singapore +65' },
  { code: '+27', label: 'South Africa +27' },
] as const;

export const PMP_JOB_EXPERIENCE_OPTIONS = [
  { value: 'under-3', label: 'Under 3 years' },
  { value: '3-5', label: '3–5 years' },
  { value: '5-10', label: '5–10 years' },
  { value: '10-plus', label: '10+ years' },
] as const;

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
