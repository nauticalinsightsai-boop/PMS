#!/usr/bin/env node
/**
 * Fix PM Structure Google Sheet (Submissions tab) and backfill from Supabase.
 * Creates/updates Records + Certification Forms readable tabs.
 * Usage: node scripts/sync-sheets-fix-and-backfill.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JWT } from 'google-auth-library';
import { createClient } from '@supabase/supabase-js';
import { loadMonorepoEnv, applyToProcessEnv } from './lib/monorepo-env.mjs';
import {
  CERTIFICATION_RECORDS_HEADERS,
  RECORDS_HEADERS,
  SUBMISSIONS_HEADERS,
  isCertificationSubmission,
  submissionToCertificationRecordRow,
  submissionToHumanRow,
  submissionToRecordRow,
} from './lib/sheets-record-rows.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
applyToProcessEnv(loadMonorepoEnv());

const HEADERS = SUBMISSIONS_HEADERS;

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
const SA_PATH = path.resolve(ROOT, process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH || '.secrets/google-sheets-sa.json');

function loadServiceAccountCreds() {
  const b64 = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64?.trim();
  if (b64) {
    const json = Buffer.from(b64, 'base64').toString('utf8').trim();
    if (!json.startsWith('{')) throw new Error('GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64 is not valid JSON');
    return JSON.parse(json);
  }
  if (!fs.existsSync(SA_PATH)) {
    throw new Error(`Missing ${SA_PATH} and GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64`);
  }
  return JSON.parse(fs.readFileSync(SA_PATH, 'utf8'));
}

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
  return submissionToHumanRow(row);
}

async function ensureSheetTab(token, sheets, title) {
  if (sheets.some((s) => s.properties?.title === title)) return;
  await sheetsRequest(token, 'POST', ':batchUpdate', {
    requests: [{ addSheet: { properties: { title } } }],
  });
  console.log(`Created tab: ${title}`);
}

async function writeTab(token, tabName, headers, dataRows) {
  const values = [headers, ...dataRows];
  const lastRow = Math.max(values.length, 1);
  const col = String.fromCharCode(64 + headers.length);
  await sheetsRequest(
    token,
    'PUT',
    `/values/${encodeURIComponent(tabName)}!A1:${col}${lastRow}?valueInputOption=USER_ENTERED`,
    { values },
  );
}

async function main() {
  if (!SPREADSHEET_ID) throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID missing');

  const creds = loadServiceAccountCreds();
  const token = await getToken(creds);

  const meta = await sheetsRequest(token, 'GET', '?fields=sheets.properties');
  let sheets = meta.sheets ?? [];

  const hasSubmissions = sheets.some((s) => s.properties?.title === 'Submissions');
  if (!hasSubmissions) {
    const firstSheet = sheets[0]?.properties;
    if (firstSheet && firstSheet.title !== 'Submissions') {
      await sheetsRequest(token, 'POST', ':batchUpdate', {
        requests: [
          {
            updateSheetProperties: {
              properties: { sheetId: firstSheet.sheetId, title: 'Submissions' },
              fields: 'title',
            },
          },
        ],
      });
      console.log('Renamed first tab → Submissions');
      const meta2 = await sheetsRequest(token, 'GET', '?fields=sheets.properties');
      sheets = meta2.sheets ?? [];
    }
  }

  await sheetsRequest(
    token,
    'PUT',
    '/values/Submissions!A1:W1?valueInputOption=USER_ENTERED',
    { values: [HEADERS] },
  );
  console.log('Submissions row 1 headers set');

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: rows, error } = await supabase
    .from('form_submissions')
    .select('id, created_at, source, subject, email, payload, metadata')
    .order('created_at', { ascending: true });
  if (error) throw error;

  const values = (rows ?? []).map(rowFromSubmission);
  console.log(`Supabase submissions to backfill: ${values.length}`);

  if (values.length) {
    const lastRow = Math.max(values.length + 1, 2);
    await sheetsRequest(
      token,
      'PUT',
      `/values/Submissions!A2:W${lastRow}?valueInputOption=USER_ENTERED`,
      { values },
    );
    console.log(`Wrote ${values.length} rows to Submissions`);
  }

  await ensureSheetTab(token, sheets, 'Setup');
  const setupRows = [
    ['PM Structure — Google Sheets sync'],
    [''],
    ['Status', 'Item', 'Notes'],
    ['Done', 'Submissions row 1 headers', HEADERS.join(' · ')],
    ['Done', 'Service account', creds.client_email],
    ['Done', 'Spreadsheet ID', SPREADSHEET_ID],
    ['Done', 'Backfill from Supabase', `${values.length} rows on ${new Date().toISOString().slice(0, 10)}`],
    ['Info', 'Live sync', 'Every website form → POST /api/interactions → Submissions append'],
    ['Info', 'Certification forms', 'Roadmap, consultation, scholarship, waitlist, register modal'],
    ['Info', 'Readable tabs', 'Records (all) · Certification Forms (cert leads only)'],
    ['Todo', 'Railway GOOGLE_SHEETS_*', 'Required for pmstructure.com live append'],
    ['', 'Dashboard', 'https://pmstructure.com/admin/dashboard/booking-crm/interactions/sheets'],
  ];
  await sheetsRequest(
    token,
    'PUT',
    '/values/Setup!A1:C12?valueInputOption=USER_ENTERED',
    { values: setupRows },
  );
  console.log('Setup tab updated');

  const sorted = [...(rows ?? [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const recordRows = sorted.map(submissionToRecordRow);
  const certRows = sorted.filter(isCertificationSubmission).map(submissionToCertificationRecordRow);

  for (const tab of ['Records', 'All Leads']) {
    await ensureSheetTab(token, sheets, tab);
    await writeTab(token, tab, RECORDS_HEADERS, recordRows);
    console.log(`${tab} tab: ${recordRows.length} rows`);
  }

  await ensureSheetTab(token, sheets, 'Certification Forms');
  await writeTab(token, 'Certification Forms', CERTIFICATION_RECORDS_HEADERS, certRows);
  console.log(`Certification Forms tab: ${certRows.length} rows`);

  const certCount = sorted.filter((r) =>
    ['pmp_roadmap_lead', 'cert_roadmap_lead'].includes(r.source),
  ).length;
  console.log(`  (includes ${certCount} roadmap leads)`);

  const verify = await sheetsRequest(token, 'GET', '/values/Submissions!A1:G3');
  console.log('\nVerify Submissions (first 3 rows):');
  for (const [i, row] of (verify.values ?? []).entries()) {
    console.log(`  ${i + 1}: ${row.slice(0, 4).join(' | ')}…`);
  }

  const syncedAt = new Date().toISOString();
  for (const row of rows ?? []) {
    await supabase
      .from('form_submissions')
      .update({ sheets_synced_at: syncedAt, sheets_sync_error: null })
      .eq('id', row.id);
  }
  console.log(`\nMarked ${(rows ?? []).length} Supabase rows as sheets-synced`);

  console.log('\nDone. Open:', process.env.GOOGLE_SHEETS_EDITOR_URL ?? `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
}

main().catch((err) => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
