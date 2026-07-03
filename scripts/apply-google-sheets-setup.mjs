#!/usr/bin/env node
/**
 * Apply Google Sheets setup: env base64 in .env.local, Supabase SQL, sheet backfill.
 * Usage: node scripts/apply-google-sheets-setup.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { loadMonorepoEnv, applyToProcessEnv } from './lib/monorepo-env.mjs';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(ROOT, '.env.local');
const SA_JSON = path.join(ROOT, '.secrets/google-sheets-sa.json');
const SA_B64 = path.join(ROOT, '.secrets/google-sheets-sa.base64.txt');

applyToProcessEnv(loadMonorepoEnv());

function ensureBase64InEnv() {
  if (!fs.existsSync(SA_JSON)) {
    throw new Error(`Missing ${SA_JSON}`);
  }
  const b64 = fs.readFileSync(SA_B64, 'utf8').trim() || fs.readFileSync(SA_JSON).toString('base64');
  if (!fs.existsSync(SA_B64)) {
    fs.mkdirSync(path.dirname(SA_B64), { recursive: true });
    fs.writeFileSync(SA_B64, b64);
  }

  let envText = fs.existsSync(ENV_FILE) ? fs.readFileSync(ENV_FILE, 'utf8') : '';
  const lines = [
    '',
    '# Google Sheets (interactions — docs/guides/GOOGLE_SHEETS_SETUP.md)',
    'GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH=.secrets/google-sheets-sa.json',
    `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64=${b64}`,
    'GOOGLE_SHEETS_SPREADSHEET_ID=1HW8agZ2SlxjyDCz9rm6We7UWQJ_6Hoyq6_xo2a11FdI',
    'GOOGLE_SHEETS_RANGE=Submissions!A:W',
    'GOOGLE_SHEETS_EDITOR_URL=https://docs.google.com/spreadsheets/d/1HW8agZ2SlxjyDCz9rm6We7UWQJ_6Hoyq6_xo2a11FdI/edit',
  ];

  if (/GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64=/.test(envText)) {
    envText = envText.replace(
      /^GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64=.*$/m,
      `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64=${b64}`,
    );
  } else if (/GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH=/.test(envText)) {
    envText = envText.replace(
      /(# Google Sheets[^\n]*\n(?:GOOGLE_SHEETS_[^\n]+\n)+)/,
      `${lines.slice(1).join('\n')}\n`,
    );
    if (!/GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64=/.test(envText)) {
      envText = envText.replace(
        /(GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH=.*\n)/,
        `$1GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64=${b64}\n`,
      );
    }
  } else {
    envText = envText.trimEnd() + '\n' + lines.join('\n') + '\n';
  }

  fs.writeFileSync(ENV_FILE, envText);
  console.log('Updated .env.local with GOOGLE_SHEETS_* (path + base64)');
}

async function applySupabaseSheetsColumns() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY required');

  const sql = `
alter table public.form_submissions
  add column if not exists sheets_synced_at timestamptz,
  add column if not exists sheets_sync_error text,
  add column if not exists sheets_sync_attempts smallint not null default 0;
`;
  const db = createClient(url, key);
  const { error } = await db.rpc('exec_sql', { query: sql });
  if (error?.message?.includes('exec_sql')) {
    // Fallback: try raw SQL via postgres if rpc missing — mark sheets_status only
    const { data: sample, error: colErr } = await db
      .from('form_submissions')
      .select('sheets_synced_at')
      .limit(1);
    if (colErr?.message?.includes('sheets_synced_at')) {
      console.warn(
        'Could not auto-apply SQL (run in Supabase SQL Editor):\n',
        fs.readFileSync(path.join(ROOT, 'supabase/migrations/20260610120000_form_submissions_sheets_sync.sql'), 'utf8'),
      );
      return;
    }
    console.log('Supabase sheets sync columns already present');
    return;
  }
  if (error) throw error;
  console.log('Supabase sheets sync columns applied');
}

function runBackfill() {
  const r = spawnSync('node', ['scripts/sync-sheets-fix-and-backfill.mjs'], {
    cwd: ROOT,
    stdio: 'inherit',
    env: process.env,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function printRailwayChecklist() {
  const b64 = fs.readFileSync(SA_B64, 'utf8').trim();
  const outPath = path.join(ROOT, '.secrets/railway-google-sheets-vars.txt');
  fs.writeFileSync(
    outPath,
    [
      'Paste these in Railway → PMS service → Variables → Redeploy',
      '',
      `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64=${b64}`,
      'GOOGLE_SHEETS_SPREADSHEET_ID=1HW8agZ2SlxjyDCz9rm6We7UWQJ_6Hoyq6_xo2a11FdI',
      'GOOGLE_SHEETS_RANGE=Submissions!A:W',
      'GOOGLE_SHEETS_EDITOR_URL=https://docs.google.com/spreadsheets/d/1HW8agZ2SlxjyDCz9rm6We7UWQJ_6Hoyq6_xo2a11FdI/edit',
      '',
      'Also required if not set:',
      'SUPABASE_URL=...',
      'SUPABASE_SERVICE_ROLE_KEY=...',
    ].join('\n'),
  );
  console.log(`\nRailway vars written to ${outPath} (gitignored via .secrets/)`);
  try {
    spawnSync('pbcopy', { input: b64 });
    console.log('Base64 copied to clipboard for Railway paste');
  } catch {
    /* ignore */
  }
}

async function main() {
  ensureBase64InEnv();
  await applySupabaseSheetsColumns();
  runBackfill();
  printRailwayChecklist();
  console.log('\nApply complete.');
}

main().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
