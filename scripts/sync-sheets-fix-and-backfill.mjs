#!/usr/bin/env node
/**
 * Fix PM Structure Google Sheet (Submissions tab) and backfill from Supabase.
 * Usage: node scripts/sync-sheets-fix-and-backfill.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JWT } from 'google-auth-library';
import { createClient } from '@supabase/supabase-js';
import { loadMonorepoEnv, applyToProcessEnv } from './lib/monorepo-env.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
applyToProcessEnv(loadMonorepoEnv());

const HEADERS = [
  'created_at',
  'source',
  'subject',
  'email',
  'payload_json',
  'metadata_json',
  'submission_id',
];

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
const SA_PATH = path.resolve(ROOT, process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH || '.secrets/google-sheets-sa.json');

async function getToken(creds) {
  const client = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const { access_token } = await client.authorize();
  if (!access_token) throw new Error('No access token');
  return access_token;
}

async function sheetsRequest(token, method, apiPath, body) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}${apiPath}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Sheets ${method} ${apiPath}: ${res.status} ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : {};
}

function rowFromSubmission(row) {
  return [
    row.created_at ?? '',
    row.source ?? '',
    row.subject ?? '',
    (row.email ?? '').toLowerCase(),
    JSON.stringify(row.payload ?? {}),
    JSON.stringify(row.metadata ?? {}),
    row.id ?? '',
  ];
}

async function main() {
  if (!SPREADSHEET_ID) throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID missing');
  if (!fs.existsSync(SA_PATH)) throw new Error(`Missing ${SA_PATH}`);

  const creds = JSON.parse(fs.readFileSync(SA_PATH, 'utf8'));
  const token = await getToken(creds);

  // Ensure tab is named Submissions (rename Sheet1 if needed)
  const meta = await sheetsRequest(token, 'GET', '?fields=sheets.properties');
  const sheets = meta.sheets ?? [];
  let submissionsSheetId = sheets.find((s) => s.properties?.title === 'Submissions')?.properties?.sheetId;
  const firstSheet = sheets[0]?.properties;
  if (!submissionsSheetId && firstSheet) {
    await sheetsRequest(token, 'POST', ':batchUpdate', {
      requests: [{ updateSheetProperties: { properties: { sheetId: firstSheet.sheetId, title: 'Submissions' }, fields: 'title' } }],
    });
    submissionsSheetId = firstSheet.sheetId;
    console.log('Renamed first tab → Submissions');
  }

  // Clear Submissions data (keep structure clean) and set headers
  await sheetsRequest(
    token,
    'PUT',
    '/values/Submissions!A1:G1?valueInputOption=USER_ENTERED',
    { values: [HEADERS] },
  );
  console.log('Row 1 headers set');

  // Fetch all submissions from Supabase
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: rows, error } = await supabase
    .from('form_submissions')
    .select('id, created_at, source, subject, email, payload, metadata')
    .order('created_at', { ascending: true });
  if (error) throw error;

  const values = (rows ?? []).map(rowFromSubmission);
  console.log(`Supabase submissions to backfill: ${values.length}`);

  if (values.length) {
    // Clear old rows 2+ then write in one batch (faster than append for backfill)
    const lastRow = Math.max(values.length + 1, 2);
    await sheetsRequest(
      token,
      'PUT',
      `/values/Submissions!A2:G${lastRow}?valueInputOption=USER_ENTERED`,
      { values },
    );
    console.log(`Wrote ${values.length} rows to Submissions!A2:G${lastRow}`);
  }

  // Setup tab with checklist
  const setupExists = sheets.some((s) => s.properties?.title === 'Setup');
  if (!setupExists) {
    await sheetsRequest(token, 'POST', ':batchUpdate', {
      requests: [{ addSheet: { properties: { title: 'Setup', index: 0 } } }],
    });
  }
  const setupRows = [
    ['PM Structure — Google Sheets sync'],
    [''],
    ['Status', 'Item', 'Notes'],
    ['Done', 'Submissions row 1 headers', HEADERS.join(' · ')],
    ['Done', 'Service account', creds.client_email],
    ['Done', 'Spreadsheet ID', SPREADSHEET_ID],
    ['Done', 'Backfill from Supabase', `${values.length} rows on ${new Date().toISOString().slice(0, 10)}`],
    ['Todo', 'Railway GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64', 'Required for live pmstructure.com sync'],
    ['Todo', 'Redeploy Railway', 'After env vars set'],
    ['', 'Test', 'Submit footer newsletter → new row appears automatically'],
    ['', 'Dashboard', 'https://pmstructure.com/admin/dashboard/booking-crm/interactions/sheets'],
  ];
  await sheetsRequest(
    token,
    'PUT',
    '/values/Setup!A1:C12?valueInputOption=USER_ENTERED',
    { values: setupRows },
  );
  console.log('Setup tab updated');

  // All Leads — readable summary (static snapshot; use Apps Script for refresh)
  const allLeadsExists = sheets.some((s) => s.properties?.title === 'All Leads');
  if (!allLeadsExists) {
    await sheetsRequest(token, 'POST', ':batchUpdate', {
      requests: [{ addSheet: { properties: { title: 'All Leads' } } }],
    });
  }
  const leadHeaders = [
    'Date',
    'Type',
    'Email',
    'Name',
    'Phone',
    'Certification',
    'Region',
    'Page',
    'Subject',
    'Submission ID',
    'Status',
    'Owner',
    'Notes',
  ];
  const sourceLabels = {
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
    return field(p, ['fullName', 'name']) || [field(p, ['firstName']), field(p, ['lastName'])].filter(Boolean).join(' ');
  }
  const leadRows = [...(rows ?? [])]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((r) => {
      const p = r.payload ?? {};
      return [
        r.created_at,
        sourceLabels[r.source] ?? r.source,
        r.email,
        nameFrom(p),
        field(p, ['phoneFull', 'phone', 'whatsapp']),
        field(p, ['certName', 'certificationInterest', 'siteCertId']),
        field(p, ['regionId']),
        field(p, ['pagePath']),
        r.subject,
        r.id,
        '',
        '',
        '',
      ];
    });
  await sheetsRequest(
    token,
    'PUT',
    `/values/All Leads!A1:M${Math.max(leadRows.length + 1, 1)}?valueInputOption=USER_ENTERED`,
    { values: [leadHeaders, ...leadRows] },
  );
  console.log(`All Leads tab: ${leadRows.length} rows`);

  // Verify read back
  const verify = await sheetsRequest(token, 'GET', '/values/Submissions!A1:G3');
  console.log('\nVerify Submissions (first 3 rows):');
  for (const [i, row] of (verify.values ?? []).entries()) {
    console.log(`  ${i + 1}: ${row.slice(0, 4).join(' | ')}…`);
  }
  console.log('\nDone. Open:', process.env.GOOGLE_SHEETS_EDITOR_URL ?? `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
}

main().catch((err) => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
