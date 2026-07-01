/** Shared labels + row builders for Google Sheets Records / All Leads tabs. */

export const SOURCE_LABELS = {
  contact: 'Contact',
  subscription: 'Newsletter',
  waitlist: 'Waitlist',
  pmp_roadmap_lead: 'PMP roadmap',
  cert_roadmap_lead: 'Cert roadmap',
  consultation: 'Consultation',
  scholarship_review: 'Scholarship',
  lead_recovery: 'Lead recovery',
  register_modal: 'Register modal',
  channel_portal: 'Channel portal',
  meeting_booking: 'Meeting booking',
  documentation_request: 'Documentation',
};

/** Form sources that are certification / pathway lead capture. */
export const CERTIFICATION_FORM_SOURCES = new Set([
  'pmp_roadmap_lead',
  'cert_roadmap_lead',
  'consultation',
  'scholarship_review',
  'register_modal',
  'waitlist',
  'lead_recovery',
]);

/** Human-readable Submissions tab headers (written by live API sync). */
export const SUBMISSIONS_HEADERS = [
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
];

export const RECORDS_HEADERS = [
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
];

export const CERTIFICATION_RECORDS_HEADERS = [
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
];

function field(p, keys) {
  for (const k of keys) {
    const v = p[k];
    if (v == null || v === '') continue;
    if (Array.isArray(v)) return v.join(', ');
    if (typeof v === 'object') continue;
    return String(v);
  }
  return '';
}

function nameFrom(p) {
  return (
    field(p, ['fullName', 'name']) ||
    [field(p, ['firstName']), field(p, ['lastName'])].filter(Boolean).join(' ')
  );
}

export function sourceLabel(code) {
  return SOURCE_LABELS[code] ?? String(code || '').replace(/_/g, ' ');
}

export function isCertificationSubmission(row) {
  if (CERTIFICATION_FORM_SOURCES.has(row.source)) {
    if (row.source === 'waitlist' || row.source === 'lead_recovery') {
      const p = row.payload ?? {};
      return Boolean(field(p, ['siteCertId', 'certName', 'certificationInterest', 'offeringId']));
    }
    return true;
  }
  return false;
}

function formatSheetDate(iso) {
  if (!iso) return '';
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

function pageUrlFrom(p) {
  if (p.pageUrl) return String(p.pageUrl);
  const path = field(p, ['pagePath']);
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `https://pmstructure.com${path.startsWith('/') ? path : `/${path}`}`;
}

export function submissionToHumanRow(row) {
  const p = row.payload ?? {};
  const m = row.metadata ?? {};
  return [
    formatSheetDate(row.created_at),
    sourceLabel(row.source),
    (row.email ?? '').toLowerCase(),
    nameFrom(p),
    field(p, ['phoneFull', 'phone', 'whatsapp', 'whatsappNumber']),
    field(p, ['company']),
    field(p, ['role']),
    field(p, ['certName', 'certificationInterest', 'siteCertId']),
    field(p, ['tierLabel', 'offeringId']),
    field(p, ['regionId']),
    pageUrlFrom(p),
    field(p, ['formLabel', 'formId', 'placement']),
    row.subject ?? '',
    field(p, ['message', 'notes']),
    field(p, ['jobExperienceYears']),
    field(p, ['dailyStudyTime']),
    field(p, ['originLabel']),
    field(p, ['utm_source']),
    field(p, ['utm_medium']),
    field(p, ['utm_campaign']),
    typeof m.referrer === 'string' ? m.referrer : '',
    '',
    row.id ?? '',
  ];
}

export function submissionToRecordRow(row) {
  const p = row.payload ?? {};
  return [
    formatSheetDate(row.created_at),
    sourceLabel(row.source),
    (row.email ?? '').toLowerCase(),
    nameFrom(p),
    field(p, ['phoneFull', 'phone', 'whatsapp', 'whatsappNumber']),
    field(p, ['certName', 'certificationInterest', 'siteCertId']),
    field(p, ['tierLabel', 'offeringId']),
    field(p, ['regionId']),
    pageUrlFrom(p),
    field(p, ['formLabel', 'formId', 'placement']),
    row.subject ?? '',
    field(p, ['message', 'notes']),
    row.id ?? '',
  ];
}

export function submissionToCertificationRecordRow(row) {
  return submissionToRecordRow(row);
}
