import {
  certNameFromPayload,
  formFieldsFromPayload,
  pagePathFromPayload,
  submissionSourceLabel,
  type InteractionSource,
} from './form-submissions';

/** Primary append target — plain English headers (no JSON). */
export const SUBMISSIONS_SHEET_HEADERS = [
  'Date',
  'Form Type',
  'Email',
  'Full Name',
  'Phone',
  'Company',
  'Role / Job Title',
  'Certification',
  'Tier / Package',
  'Region',
  'Page URL',
  'Form / Placement',
  'Subject line',
  'Message / Notes',
  'Years of Experience',
  'Daily Study Time',
  'How they found us',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'Referrer',
  'Other form answers',
  'Submission ID',
] as const;

/** All leads — same readable layout for ops team. */
export const RECORDS_SHEET_HEADERS = [
  'Date',
  'Form Type',
  'Email',
  'Full Name',
  'Phone',
  'Certification',
  'Tier / Package',
  'Region',
  'Page URL',
  'Form / Placement',
  'Subject line',
  'Message / Notes',
  'Submission ID',
] as const;

/** Certification / pathway leads only. */
export const CERTIFICATION_SHEET_HEADERS = [
  'Date',
  'Form Type',
  'Email',
  'Full Name',
  'Phone',
  'Certification',
  'Tier / Package',
  'Region',
  'Page URL',
  'Form / Placement',
  'Subject line',
  'Message / Notes',
  'Submission ID',
] as const;

/** @deprecated Legacy API format — kept for reading old rows. */
export const LEGACY_SHEET_HEADERS = [
  'created_at',
  'source',
  'subject',
  'email',
  'payload_json',
  'metadata_json',
  'submission_id',
] as const;

export type SheetSubmissionRow = {
  id: string;
  created_at: string;
  source: string;
  subject: string;
  email: string;
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

const CERTIFICATION_FORM_SOURCES = new Set<string>([
  'pmp_roadmap_lead',
  'cert_roadmap_lead',
  'consultation',
  'scholarship_review',
  'register_modal',
  'waitlist',
  'lead_recovery',
]);

const DEDICATED_PAYLOAD_KEYS = new Set([
  'fullName',
  'name',
  'firstName',
  'lastName',
  'phone',
  'phoneFull',
  'whatsapp',
  'whatsappNumber',
  'company',
  'role',
  'certName',
  'certificationInterest',
  'siteCertId',
  'tierLabel',
  'offeringId',
  'regionId',
  'pagePath',
  'pageUrl',
  'formLabel',
  'formId',
  'placement',
  'originLabel',
  'message',
  'notes',
  'jobExperienceYears',
  'dailyStudyTime',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'attribution',
]);

function field(payload: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = payload[key];
    if (value == null || value === '') continue;
    if (Array.isArray(value)) return value.map(String).join(', ');
    if (typeof value === 'object') continue;
    return String(value);
  }
  return '';
}

function attributionField(payload: Record<string, unknown>, key: string): string {
  const attr = payload.attribution;
  if (attr && typeof attr === 'object' && !Array.isArray(attr)) {
    const v = (attr as Record<string, unknown>)[key];
    if (v != null && v !== '') return String(v);
  }
  return field(payload, [key]);
}

function nameFromPayload(payload: Record<string, unknown>): string {
  const full = field(payload, ['fullName', 'name']);
  if (full) return full;
  return [field(payload, ['firstName']), field(payload, ['lastName'])].filter(Boolean).join(' ');
}

function formatSheetDate(iso: string): string {
  if (!iso.trim()) return '';
  try {
    return new Date(iso).toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Europe/London',
    });
  } catch {
    return iso;
  }
}

function pageUrlFromPayload(payload: Record<string, unknown>): string {
  const direct = field(payload, ['pageUrl']);
  if (direct) return direct;
  const path = pagePathFromPayload(payload);
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `https://pmstructure.com${path.startsWith('/') ? path : `/${path}`}`;
}

function otherAnswersFromPayload(payload: Record<string, unknown>): string {
  return formFieldsFromPayload(payload)
    .filter((row) => !DEDICATED_PAYLOAD_KEYS.has(row.key))
    .map((row) => `${row.label}: ${row.value}`)
    .join(' · ');
}

function marketingSource(payload: Record<string, unknown>): string {
  return (
    field(payload, ['originLabel']) ||
    attributionField(payload, 'utm_source') ||
    attributionField(payload, 'utm_campaign') ||
    ''
  );
}

export function isCertificationSheetSubmission(row: SheetSubmissionRow): boolean {
  if (!CERTIFICATION_FORM_SOURCES.has(row.source)) return false;
  if (row.source === 'waitlist' || row.source === 'lead_recovery') {
    const p = row.payload ?? {};
    return Boolean(
      field(p, ['siteCertId', 'certName', 'certificationInterest', 'offeringId']),
    );
  }
  return true;
}

export function buildHumanSubmissionsRow(row: SheetSubmissionRow): string[] {
  const payload = row.payload ?? {};
  const metadata = row.metadata ?? {};
  const cert = certNameFromPayload(payload) || field(payload, ['certificationInterest']);

  return [
    formatSheetDate(row.created_at),
    submissionSourceLabel(row.source),
    row.email.trim().toLowerCase(),
    nameFromPayload(payload),
    field(payload, ['phoneFull', 'phone', 'whatsapp', 'whatsappNumber']),
    field(payload, ['company']),
    field(payload, ['role']),
    cert,
    field(payload, ['tierLabel', 'offeringId']),
    field(payload, ['regionId']),
    pageUrlFromPayload(payload),
    field(payload, ['formLabel', 'formId', 'placement']),
    row.subject,
    field(payload, ['message', 'notes']),
    field(payload, ['jobExperienceYears']),
    field(payload, ['dailyStudyTime']),
    marketingSource(payload),
    attributionField(payload, 'utm_source'),
    attributionField(payload, 'utm_medium'),
    attributionField(payload, 'utm_campaign'),
    typeof metadata.referrer === 'string' ? metadata.referrer : '',
    otherAnswersFromPayload(payload),
    row.id,
  ];
}

export function buildRecordsRow(row: SheetSubmissionRow): string[] {
  const payload = row.payload ?? {};
  const cert = certNameFromPayload(payload) || field(payload, ['certificationInterest']);

  return [
    formatSheetDate(row.created_at),
    submissionSourceLabel(row.source),
    row.email.trim().toLowerCase(),
    nameFromPayload(payload),
    field(payload, ['phoneFull', 'phone', 'whatsapp', 'whatsappNumber']),
    cert,
    field(payload, ['tierLabel', 'offeringId']),
    field(payload, ['regionId']),
    pageUrlFromPayload(payload),
    field(payload, ['formLabel', 'formId', 'placement']),
    row.subject,
    field(payload, ['message', 'notes']),
    row.id,
  ];
}

export function buildCertificationSheetRow(row: SheetSubmissionRow): string[] {
  return buildRecordsRow(row);
}

/** Reconstruct payload object from a human-readable sheet row (for dashboard display). */
export function payloadFromHumanSheetCells(
  headers: string[],
  cells: string[],
): Record<string, unknown> {
  const norm = headers.map((h) => h.trim().toLowerCase());
  const get = (...names: string[]): string => {
    for (const name of names) {
      const idx = norm.indexOf(name.toLowerCase());
      if (idx >= 0 && cells[idx]?.trim()) return cells[idx].trim();
    }
    return '';
  };

  const other = get('other form answers');
  const payload: Record<string, unknown> = {
    fullName: get('full name'),
    phone: get('phone'),
    company: get('company'),
    role: get('role / job title', 'role'),
    certName: get('certification'),
    tierLabel: get('tier / package', 'tier'),
    regionId: get('region'),
    pageUrl: get('page url', 'page'),
    formLabel: get('form / placement', 'form'),
    message: get('message / notes', 'message'),
    jobExperienceYears: get('years of experience'),
    dailyStudyTime: get('daily study time'),
    originLabel: get('how they found us'),
    utm_source: get('utm source'),
    utm_medium: get('utm medium'),
    utm_campaign: get('utm campaign'),
  };

  if (other) payload._otherAnswers = other;
  return payload;
}

export function isHumanSheetHeaders(headers: string[]): boolean {
  const norm = headers.map((h) => h.trim().toLowerCase());
  return norm.includes('form type') || norm.includes('full name');
}

export function isLegacySheetHeaders(headers: string[]): boolean {
  const norm = headers.map((h) => h.trim().toLowerCase());
  return norm.includes('payload_json') || norm.includes('metadata_json');
}

export function sourceCodeFromLabel(label: string): InteractionSource | string {
  const trimmed = label.trim().toLowerCase();
  const entries: Array<[InteractionSource, string]> = [
    ['contact', 'contact'],
    ['subscription', 'newsletter'],
    ['meeting_booking', 'meeting'],
    ['documentation_request', 'documentation'],
    ['pmp_roadmap_lead', 'pmp roadmap'],
    ['cert_roadmap_lead', 'cert roadmap'],
    ['cert_roadmap_lead', 'certification roadmap'],
    ['consultation', 'consultation'],
    ['waitlist', 'waitlist'],
    ['scholarship_review', 'scholarship'],
    ['lead_recovery', 'lead recovery'],
    ['channel_portal', 'channel portal'],
    ['register_modal', 'register modal'],
    ['payment', 'payment'],
  ];
  for (const [code, needle] of entries) {
    if (trimmed === needle || trimmed.includes(needle)) return code;
  }
  return label.replace(/\s+/g, '_').toLowerCase();
}
