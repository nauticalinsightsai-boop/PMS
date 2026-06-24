#!/usr/bin/env node
/**
 * Submit a certification roadmap test lead and verify Google Sheets append.
 * Usage:
 *   node scripts/test-cert-form-sheets.mjs
 *   node scripts/test-cert-form-sheets.mjs --base=https://pmstructure.com
 */
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadMonorepoEnv, applyToProcessEnv } from './lib/monorepo-env.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
applyToProcessEnv(loadMonorepoEnv());

const baseArg = process.argv.find((a) => a.startsWith('--base='));
const base = (baseArg?.slice(7) ?? 'http://localhost:3000').replace(/\/$/, '');
const testEmail = `sheets-test+${Date.now()}@pmstructure.test`;

async function postInteraction() {
  const body = {
    source: 'cert_roadmap_lead',
    subject: 'Sheets connectivity test — certification roadmap',
    email: testEmail,
    payload: {
      fullName: 'Sheets Test User',
      phoneFull: '+971501234567',
      certificationInterest: 'PMP',
      siteCertId: 'pmp',
      certName: 'PMP',
      tierLabel: 'Foundation',
      regionId: 'uae',
      pagePath: '/certifications/pmp',
      formId: 'cert_roadmap_sheets_test',
      formLabel: 'Certification roadmap (connectivity test)',
      placement: 'automated_test',
    },
    metadata: { clientSubmittedAt: new Date().toISOString() },
    website: '',
    company: '',
  };

  const res = await fetch(`${base}/api/interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: base },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`POST /api/interactions ${res.status}: ${JSON.stringify(json)}`);
  }
  return json;
}

async function readLatestFromSheets(submissionId) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  const saPath = path.resolve(
    ROOT,
    process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH || '.secrets/google-sheets-sa.json',
  );
  if (!spreadsheetId || !fs.existsSync(saPath)) {
    console.warn('Skip Sheets verify — local SA or spreadsheet id missing');
    return false;
  }

  const creds = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  const client = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const { access_token } = await client.authorize();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Submissions!A:G`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${access_token}` } });
  const data = await res.json();
  const rows = data.values ?? [];
  const found = rows.some((row) => row[6] === submissionId || row[3] === testEmail);
  return found;
}

async function main() {
  console.log(`test-cert-form-sheets: ${base}\n`);

  const result = await postInteraction();
  console.log('API response:', JSON.stringify(result));

  if (result.sheetsSyncPending) {
    console.log('Sheets sync queued (background) — waiting 3s…');
    await new Promise((r) => setTimeout(r, 3000));
  }

  if (result.id && result.id !== 'honeypot') {
    const inSheet = await readLatestFromSheets(result.id);
    if (inSheet) {
      console.log('\nOK — submission found in Submissions tab');
    } else if (result.sheetsSynced) {
      console.log('\nOK — API reported sheetsSynced=true');
    } else if (result.sheetsSyncPending) {
      console.warn('\nWARN — row saved to Supabase; Sheets append may still be running or GOOGLE_SHEETS_* not set on server');
    } else {
      console.warn('\nWARN — row in Supabase only. Set GOOGLE_SHEETS_* on Railway and redeploy.');
    }
  }

  console.log('\nOpen spreadsheet:', process.env.GOOGLE_SHEETS_EDITOR_URL ?? '(set GOOGLE_SHEETS_EDITOR_URL)');
  console.log('Check Records + Certification Forms tabs after npm run sync:sheets');
}

main().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
