#!/usr/bin/env node
/**
 * Sync production env to Railway and redeploy PMS service.
 *
 * Prereq (one of):
 *   npx @railway/cli login
 *   export RAILWAY_TOKEN=<project token from railway.app/account/tokens>
 *
 * Optional (non-interactive link):
 *   export RAILWAY_PROJECT_ID=...
 *   export RAILWAY_ENVIRONMENT=production
 *   export RAILWAY_SERVICE=PMS
 *
 * Usage:
 *   npm run railway:setup
 *   npm run railway:setup -- --dry-run
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { loadMonorepoEnv, applyToProcessEnv } from './lib/monorepo-env.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const VARS_FILE = path.join(ROOT, '.secrets/railway-production-vars.txt');
const RAILWAY = 'npx';
const RAILWAY_ARGS = ['--yes', '@railway/cli'];

const dryRun = process.argv.includes('--dry-run');

applyToProcessEnv(loadMonorepoEnv());

function railwayEnv() {
  const env = { ...process.env };
  if (process.env.RAILWAY_TOKEN?.trim()) {
    env.RAILWAY_TOKEN = process.env.RAILWAY_TOKEN.trim();
  }
  return env;
}

function linkArgs() {
  const args = [];
  if (process.env.RAILWAY_PROJECT_ID?.trim()) {
    args.push('-p', process.env.RAILWAY_PROJECT_ID.trim());
  }
  if (process.env.RAILWAY_ENVIRONMENT?.trim()) {
    args.push('-e', process.env.RAILWAY_ENVIRONMENT.trim());
  }
  if (process.env.RAILWAY_SERVICE?.trim()) {
    args.push('-s', process.env.RAILWAY_SERVICE.trim());
  }
  return args;
}

function scopeArgs() {
  const args = [];
  if (process.env.RAILWAY_SERVICE?.trim()) {
    args.push('-s', process.env.RAILWAY_SERVICE.trim());
  }
  if (process.env.RAILWAY_ENVIRONMENT?.trim()) {
    args.push('-e', process.env.RAILWAY_ENVIRONMENT.trim());
  }
  if (process.env.RAILWAY_PROJECT_ID?.trim()) {
    args.push('-p', process.env.RAILWAY_PROJECT_ID.trim());
  }
  return args;
}

function runRailway(args, opts = {}) {
  const cmd = [RAILWAY, ...RAILWAY_ARGS, ...args];
  if (dryRun) {
    console.log('[dry-run]', cmd.join(' '));
    return { status: 0, stdout: '', stderr: '' };
  }
  const r = spawnSync(cmd[0], cmd.slice(1), {
    cwd: ROOT,
    encoding: 'utf8',
    env: railwayEnv(),
    stdio: opts.inherit ? 'inherit' : 'pipe',
    ...opts,
  });
  if (!opts.inherit && r.status !== 0) {
    const err = (r.stderr || r.stdout || '').trim();
    throw new Error(`railway ${args.join(' ')} failed: ${err}`);
  }
  return r;
}

function parseVarsFile() {
  if (!fs.existsSync(VARS_FILE)) {
    throw new Error(`Missing ${VARS_FILE} — run: npm run apply:railway`);
  }
  const entries = [];
  for (const line of fs.readFileSync(VARS_FILE, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq <= 0) continue;
    entries.push([t.slice(0, eq), t.slice(eq + 1)]);
  }
  return entries;
}

function ensureSmtpForAuth(entries) {
  const hasSmtp = entries.some(([k]) => k === 'SMTP_HOST');
  if (hasSmtp) return entries;
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return entries;
  const isGmail = /gmail\.com$/i.test(host) || host === 'smtp.gmail.com';
  return [
    ...entries,
    ['SMTP_HOST', host],
    ['SMTP_PORT', isGmail ? '465' : (process.env.SMTP_PORT?.trim() || '587')],
    ['SMTP_SECURE', isGmail ? 'true' : (process.env.SMTP_SECURE?.trim() || 'false')],
    ['SMTP_USER', user],
    ['SMTP_PASS', pass],
    ['AUTH_EMAIL_TRANSPORT', 'smtp'],
  ];
}

function setVariable(key, value) {
  const args = ['variable', 'set', `${key}=${value}`, '--skip-deploys', ...scopeArgs()];
  runRailway(args);
}

async function main() {
  console.log('Railway production setup\n');

  const who = runRailway(['whoami']);
  if (!dryRun) console.log('Logged in as:', (who.stdout || '').trim());

  const linkFlags = linkArgs();
  if (linkFlags.length) {
    console.log('Linking project with env flags...');
    runRailway(['link', ...linkFlags]);
  } else {
    try {
      runRailway(['status']);
    } catch {
      console.log('Linking project (select PMS / pmstructure.com service if prompted)...');
      runRailway(['link'], { inherit: true });
    }
  }

  let entries = parseVarsFile();
  entries = ensureSmtpForAuth(entries);

  const smtpOk = entries.some(([k, v]) => k === 'SMTP_HOST' && v?.trim());
  if (!smtpOk) {
    console.error('\nERROR: SMTP is required for login OTP on Railway.');
    console.error('Set SMTP_HOST, SMTP_USER, SMTP_PASS, AUTH_EMAIL_FROM in .env.local');
    console.error('Then: npm run apply:railway && npm run railway:setup');
    process.exit(1);
  }

  if (!entries.some(([k]) => k === 'AUTH_EMAIL_TRANSPORT')) {
    entries.push(['AUTH_EMAIL_TRANSPORT', 'smtp']);
  }

  entries = entries.filter(([k]) => k !== 'GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH');

  console.log(`Setting ${entries.length} variables on Railway (single redeploy at end)...`);
  for (const [key, value] of entries) {
    setVariable(key, value);
    console.log(`  ✓ ${key}`);
  }

  console.log('\nDeploying latest...');
  runRailway(['up', '--detach', ...scopeArgs()], { inherit: true });

  console.log('\nDone. Verify with: npm run smoke:production');
}

try {
  await main();
} catch (e) {
  console.error('\nFAILED:', e.message);
  if (String(e.message).includes('Unauthorized')) {
    console.error('\nRailway auth required. Choose one:');
    console.error('  A) npx @railway/cli login');
    console.error('     or https://railway.com/activate (device code from login --browserless)');
    console.error('  B) export RAILWAY_TOKEN=<project token from railway.app/account/tokens>');
    console.error('     export RAILWAY_PROJECT_ID=... RAILWAY_SERVICE=PMS');
  }
  process.exit(1);
}
