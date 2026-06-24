/**
 * PM Structure — Google Sheets views (paste into Extensions → Apps Script)
 *
 * Prerequisites:
 * - Tab "Submissions" with row 1: created_at | source | subject | email | payload_json | metadata_json | submission_id
 * - Do NOT let this script modify row 1 on Submissions or delete data rows there (API append-only)
 *
 * After paste: Save → Run setupPmStructureSheets once → authorize → use menu "PM Structure → Refresh all views"
 */

const SUBMISSIONS_SHEET = 'Submissions';
const RECORDS_SHEET = 'Records';
const ALL_LEADS_SHEET = 'All Leads';
const CERT_FORMS_SHEET = 'Certification Forms';

const SOURCE_LABELS = {
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

const CERTIFICATION_SOURCES = {
  pmp_roadmap_lead: true,
  cert_roadmap_lead: true,
  consultation: true,
  scholarship_review: true,
  register_modal: true,
  waitlist: true,
  lead_recovery: true,
};

/** Safe JSON parse for payload_json / metadata_json cells */
function parsePayloadJson(cell) {
  if (cell == null || cell === '') return {};
  if (typeof cell === 'object') return cell;
  try {
    const v = JSON.parse(String(cell));
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  } catch (e) {
    return { _parseError: String(cell).slice(0, 200) };
  }
}

function payloadField(payload, keys) {
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var v = payload[k];
    if (v == null || v === '') continue;
    if (Array.isArray(v)) return v.join(', ');
    if (typeof v === 'object') continue;
    return String(v);
  }
  return '';
}

function fullNameFromPayload(p) {
  var full = payloadField(p, ['fullName', 'name']);
  if (full) return full;
  var first = payloadField(p, ['firstName']);
  var last = payloadField(p, ['lastName']);
  return [first, last].filter(Boolean).join(' ').trim();
}

function phoneFromPayload(p) {
  return payloadField(p, ['phoneFull', 'phone', 'whatsapp', 'whatsappNumber']);
}

function isCertificationRow(r) {
  if (!CERTIFICATION_SOURCES[r.source]) return false;
  if (r.source === 'waitlist' || r.source === 'lead_recovery') {
    var p = r.payload;
    return !!(payloadField(p, ['siteCertId', 'certName', 'certificationInterest', 'offeringId']));
  }
  return true;
}

function tierFromPayload(p) {
  return payloadField(p, ['tierLabel', 'offeringId']);
}

function formFromPayload(p) {
  return payloadField(p, ['formLabel', 'formId', 'placement']);
}

function sourceLabel(code) {
  return SOURCE_LABELS[code] || String(code || '').replace(/_/g, ' ');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('PM Structure')
    .addItem('Refresh all views', 'refreshAllViews')
    .addItem('Setup sheets (first time)', 'setupPmStructureSheets')
    .addToUi();
}

function setupPmStructureSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sub = ss.getSheetByName(SUBMISSIONS_SHEET);
  if (!sub) {
    SpreadsheetApp.getUi().alert('Missing tab "' + SUBMISSIONS_SHEET + '". Create it with headers in row 1 first.');
    return;
  }
  sub.getRange(1, 1, 1, 7).setValues([[
    'created_at', 'source', 'subject', 'email', 'payload_json', 'metadata_json', 'submission_id',
  ]]);
  sub.setFrozenRows(1);

  var records = ss.getSheetByName(RECORDS_SHEET) || ss.insertSheet(RECORDS_SHEET);
  records.clear();
  records.getRange(1, 1, 1, 15).setValues([[
    'Date', 'Type', 'Email', 'Name', 'Phone', 'Certification', 'Tier', 'Region', 'Page', 'Form', 'Subject', 'Submission ID', 'Status', 'Owner', 'Notes',
  ]]);
  records.setFrozenRows(1);

  var certForms = ss.getSheetByName(CERT_FORMS_SHEET) || ss.insertSheet(CERT_FORMS_SHEET);
  certForms.clear();
  certForms.getRange(1, 1, 1, 13).setValues([[
    'Date', 'Form type', 'Email', 'Name', 'Phone', 'Certification', 'Tier', 'Region', 'Page', 'Placement', 'Subject', 'Submission ID', 'Notes',
  ]]);
  certForms.setFrozenRows(1);

  var all = ss.getSheetByName(ALL_LEADS_SHEET) || ss.insertSheet(ALL_LEADS_SHEET);
  all.clear();
  all.getRange(1, 1, 1, 15).setValues([[
    'Date', 'Type', 'Email', 'Name', 'Phone', 'Certification', 'Tier', 'Region', 'Page', 'Form', 'Subject', 'Submission ID', 'Status', 'Owner', 'Notes',
  ]]);
  all.setFrozenRows(1);

  refreshAllViews();
  SpreadsheetApp.getUi().alert('Setup complete. Use PM Structure → Refresh all views after new website submissions.');
}

function refreshAllViews() {
  refreshRecordsTab(RECORDS_SHEET);
  refreshRecordsTab(ALL_LEADS_SHEET);
  refreshCertificationFormsTab();
  refreshFilteredTab('Contact', ['contact']);
  refreshFilteredTab('Newsletter', ['subscription']);
  refreshFilteredTab('Waitlist', ['waitlist']);
  refreshFilteredTab('Roadmap Leads', ['pmp_roadmap_lead', 'cert_roadmap_lead']);
  refreshFilteredTab('Consultations', ['consultation']);
  refreshFilteredTab('Scholarship', ['scholarship_review']);
  refreshFilteredTab('Lead Recovery', ['lead_recovery']);
  refreshFilteredTab('Register Events', ['register_modal']);
  refreshFilteredTab('Channel Portals', ['channel_portal', 'contact']);
  refreshFilteredTab('Meeting Bookings', ['meeting_booking']);
}

function refreshRecordsTab(tabName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) return;

  var rows = readSubmissionsRows();
  rows.sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 15).clearContent();
  }

  if (!rows.length) return;

  var out = rows.map(function (r) {
    var p = r.payload;
    return [
      r.createdAt,
      sourceLabel(r.source),
      r.email,
      fullNameFromPayload(p),
      phoneFromPayload(p),
      payloadField(p, ['certName', 'certificationInterest', 'siteCertId']),
      tierFromPayload(p),
      payloadField(p, ['regionId']),
      payloadField(p, ['pagePath']),
      formFromPayload(p),
      r.subject,
      r.submissionId,
      '',
      '',
      '',
    ];
  });

  sheet.getRange(2, 1, out.length, 15).setValues(out);
}

function refreshCertificationFormsTab() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CERT_FORMS_SHEET);
  if (!sheet) return;

  var rows = readSubmissionsRows().filter(isCertificationRow);
  rows.sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 13).clearContent();
  }

  if (!rows.length) return;

  var out = rows.map(function (r) {
    var p = r.payload;
    return [
      r.createdAt,
      sourceLabel(r.source),
      r.email,
      fullNameFromPayload(p),
      phoneFromPayload(p),
      payloadField(p, ['certName', 'certificationInterest', 'siteCertId']),
      tierFromPayload(p),
      payloadField(p, ['regionId']),
      payloadField(p, ['pagePath']),
      payloadField(p, ['placement', 'formLabel']),
      r.subject,
      r.submissionId,
      '',
    ];
  });

  sheet.getRange(2, 1, out.length, 13).setValues(out);
}

function readSubmissionsRows() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SUBMISSIONS_SHEET);
  if (!sheet) throw new Error('Tab "' + SUBMISSIONS_SHEET + '" not found');
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  return values.map(function (row) {
    var payload = parsePayloadJson(row[4]);
    return {
      createdAt: row[0],
      source: row[1],
      subject: row[2],
      email: row[3],
      payload: payload,
      submissionId: row[6],
    };
  });
}

function refreshFilteredTab(tabName, sources) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) return;

  var headers = [
    'Date', 'Email', 'Name', 'Phone', 'Region', 'Page', 'Subject', 'Submission ID', 'Extra (payload)',
  ];
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);

  var rows = readSubmissionsRows().filter(function (r) {
    return sources.indexOf(String(r.source)) >= 0;
  });
  rows.sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (!rows.length) return;

  var out = rows.map(function (r) {
    var p = r.payload;
    return [
      r.createdAt,
      r.email,
      fullNameFromPayload(p),
      phoneFromPayload(p),
      payloadField(p, ['regionId']),
      payloadField(p, ['pagePath']),
      r.subject,
      r.submissionId,
      JSON.stringify(p).slice(0, 500),
    ];
  });

  sheet.getRange(2, 1, out.length, headers.length).setValues(out);
}
