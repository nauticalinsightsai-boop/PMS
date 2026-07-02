#!/usr/bin/env node
/**
 * Build Railway production variable checklist from .env.local.
 * Does not commit secrets — writes .secrets/railway-production-vars.txt (gitignored).
 *
 * Usage:
 *   node scripts/apply-railway-production-env.mjs
 *   node scripts/apply-railway-production-env.mjs --smoke   # also run production smoke
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { loadMonorepoEnv, applyToProcessEnv } from './lib/monorepo-env.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '.secrets/railway-production-vars.txt');
const PRODUCTION = 'https://pmstructure.com';

applyToProcessEnv(loadMonorepoEnv());

/** Keys that must not be copied to Railway (local dev only). */
const SKIP = new Set([
  'BACKEND_URL',
  'DASHBOARD_BACKEND_URL',
  'GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH',
  'AUTH_DEV_LOG_RESET_LINK',
  'AUTH_DEV_LOG_OTP',
  'USE_BACKEND_PROXY',
]);

/** Keys whose localhost values must be rewritten for production. */
const URL_KEYS = new Set([
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_MARKETING_SITE_URL',
  'NEXT_PUBLIC_DASHBOARD_URL',
]);

function productionValue(key, value) {
  if (URL_KEYS.has(key)) return PRODUCTION;
  if (key === 'AUTH_ALLOWED_ORIGINS') {
    return PRODUCTION;
  }
  const host = process.env.SMTP_HOST?.trim() ?? '';
  const isGmail = /gmail\.com$/i.test(host) || host === 'smtp.gmail.com';
  if (isGmail && key === 'SMTP_PORT') return '465';
  if (isGmail && key === 'SMTP_SECURE') return 'true';
  if (key === 'RESEND_FROM') {
    const verified = process.env.RESEND_DOMAIN_VERIFIED?.trim().toLowerCase() === 'true';
    if (!verified && value.includes('@pmstructure.com')) {
      return 'PM Structure <onboarding@resend.dev>';
    }
  }
  if (key === 'AUTH_EMAIL_TRANSPORT') {
    if (process.env.RESEND_API_KEY?.trim()) return 'resend';
    if (isSmtpConfigured()) return 'smtp';
  }
  return value;
}

function isSmtpConfigured() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.AUTH_EMAIL_FROM?.trim() || user;
  return Boolean(host && user && pass && from);
}

function collectVars() {
  const entries = [];
  for (const [key, value] of Object.entries(process.env)) {
    if (!key || SKIP.has(key)) continue;
    if (!value?.trim()) continue;
    if (key.startsWith('npm_') || key === 'NODE_ENV') continue;
    // Only vars present in .env.local or known production keys
    const allowedPrefixes = [
      'NEXT_PUBLIC_',
      'SUPABASE_',
      'AUTH_',
      'SMTP_',
      'STRIPE_',
      'GROQ_',
      'OPENROUTER_',
      'GOOGLE_SHEETS_',
      'DASHBOARD_',
      'TWILIO_',
      'DISCOVERY_',
      'RESEND_',
      'R2_',
      'PROGRAMME_MEDIA_',
    ];
    if (!allowedPrefixes.some((p) => key.startsWith(p))) continue;
    entries.push([key, productionValue(key, value.trim())]);
  }
  entries.sort((a, b) => a[0].localeCompare(b[0]));
  if (isSmtpConfigured() && !entries.some(([k]) => k === 'AUTH_EMAIL_TRANSPORT')) {
    entries.push(['AUTH_EMAIL_TRANSPORT', process.env.RESEND_API_KEY?.trim() ? 'resend' : 'smtp']);
  }
  if (process.env.RESEND_API_KEY?.trim() && !entries.some(([k]) => k === 'RESEND_API_KEY')) {
    entries.push(['RESEND_API_KEY', process.env.RESEND_API_KEY.trim()]);
    const idx = entries.findIndex(([k]) => k === 'AUTH_EMAIL_TRANSPORT');
    if (idx >= 0) entries[idx][1] = 'resend';
    else entries.push(['AUTH_EMAIL_TRANSPORT', 'resend']);
  }
  return entries;
}

function writeChecklist(entries) {
  const lines = [
    '# Railway → PMS service → Variables → paste each line → Redeploy',
    '# Generated from .env.local — do not commit this file',
    '',
    ...entries.map(([k, v]) => `${k}=${v}`),
    '',
    '# After redeploy, verify:',
    '#   npm run smoke:production',
  ];
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, lines.join('\n'));
  console.log(`Wrote ${OUT} (${entries.length} variables)`);
}

function copySheetsBase64() {
  const b64 = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64?.trim();
  if (!b64) {
    console.warn('WARN  GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64 missing in .env.local');
    return;
  }
  try {
    spawnSync('pbcopy', { input: b64 });
    console.log('Copied GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64 to clipboard');
  } catch {
    /* ignore */
  }
}

function main() {
  const entries = collectVars();
  if (!entries.some(([k]) => k === 'GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64')) {
    console.warn('WARN  Google Sheets base64 not in env — run: npm run apply:sheets');
  }
  writeChecklist(entries);
  copySheetsBase64();

  console.log('\nManual steps (Railway CLI token expired — use dashboard):');
  console.log('  1. Open https://railway.app → PMS service → Variables');
  console.log('  2. Paste vars from .secrets/railway-production-vars.txt');
  console.log('  3. Deployments → Redeploy latest');
  console.log('  4. Run: npm run smoke:production');

  if (process.argv.includes('--smoke')) {
    const r = spawnSync('node', ['scripts/production-platform-smoke.mjs'], {
      cwd: ROOT,
      stdio: 'inherit',
    });
    process.exit(r.status ?? 1);
  }
}

main();
