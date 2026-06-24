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

export const RECORDS_HEADERS = [
  'Date',
  'Type',
  'Email',
  'Name',
  'Phone',
  'Certification',
  'Tier',
  'Region',
  'Page',
  'Form',
  'Subject',
  'Submission ID',
  'Status',
  'Owner',
  'Notes',
];

export const CERTIFICATION_RECORDS_HEADERS = [
  'Date',
  'Form type',
  'Email',
  'Name',
  'Phone',
  'Certification',
  'Tier',
  'Region',
  'Page',
  'Placement',
  'Subject',
  'Submission ID',
  'Notes',
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

export function submissionToRecordRow(row) {
  const p = row.payload ?? {};
  return [
    row.created_at,
    sourceLabel(row.source),
    row.email,
    nameFrom(p),
    field(p, ['phoneFull', 'phone', 'whatsapp', 'whatsappNumber']),
    field(p, ['certName', 'certificationInterest', 'siteCertId']),
    field(p, ['tierLabel', 'offeringId']),
    field(p, ['regionId']),
    field(p, ['pagePath']),
    field(p, ['formLabel', 'formId', 'placement']),
    row.subject,
    row.id,
    '',
    '',
    '',
  ];
}

export function submissionToCertificationRecordRow(row) {
  const p = row.payload ?? {};
  return [
    row.created_at,
    sourceLabel(row.source),
    row.email,
    nameFrom(p),
    field(p, ['phoneFull', 'phone', 'whatsapp', 'whatsappNumber']),
    field(p, ['certName', 'certificationInterest', 'siteCertId']),
    field(p, ['tierLabel', 'offeringId']),
    field(p, ['regionId']),
    field(p, ['pagePath']),
    field(p, ['placement', 'formLabel']),
    row.subject,
    row.id,
    '',
  ];
}
