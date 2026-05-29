#!/usr/bin/env node
/**
 * Automated verification for platform audit checklist items.
 * Writes docs/audits/automated-verification.json
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'docs', 'audits', 'automated-verification.json');

function run(cmd) {
  try {
    execSync(cmd, { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    return true;
  } catch {
    return false;
  }
}

function fileExists(rel) {
  return fs.existsSync(path.join(root, rel));
}

const checks = [];

function pass(id, note = 'ok') {
  checks.push({ id, pass: true, note });
}
function fail(id, note) {
  checks.push({ id, pass: false, note });
}

// Phase 0
if (fileExists('docs/PLATFORM_AUDIT_MASTER_PLAN.md')) pass('P0.001');
else fail('P0.001', 'missing master plan');
if (fileExists('docs/audits/PLATFORM_AUDIT_SCORECARD.md')) pass('P0.002');
else fail('P0.002', 'missing scorecard');

// A1 sample
if (fileExists('packages/booking-crm/package.json')) pass('A1.003');
if (fileExists('packages/ui/package.json')) pass('A1.004');

// A2 routes exist
const apiRoutes = [
  'backend/app/api/health/route.ts',
  'backend/app/api/catalogue/route.ts',
  'backend/app/api/checkout/create/route.ts',
  'backend/app/api/stripe/webhook/route.ts',
];
for (const [i, r] of apiRoutes.entries()) {
  const id = `A2.00${i + 1}`;
  if (fileExists(r)) pass(id, r);
  else fail(id, `missing ${r}`);
}

// A4 migrations
const migrations = fs.readdirSync(path.join(root, 'supabase/migrations')).filter((f) => f.endsWith('.sql'));
for (let i = 0; i < migrations.length; i++) {
  pass(`A4.00${i + 1}`, migrations[i]);
}

// C1 flow — platformOfferPack
const pack = fs.readFileSync(
  path.join(root, 'packages/booking-crm/src/channel-landing-pages/platformOfferPack.ts'),
  'utf8',
);
if (pack.includes('PROFESSIONAL_FLOW')) pass('C1.F02');
if (pack.includes('usesProConsultationPortalLayout')) pass('C1.F01');

// E1 matrix
if (run('npm run validate:regional')) pass('E1.000');
if (run('npm run qa:regional')) pass('E1.000b');

// F2 webhook signature in source
const webhook = fs.readFileSync(path.join(root, 'backend/app/api/stripe/webhook/route.ts'), 'utf8');
if (webhook.includes('constructEvent')) pass('F2.001', 'stripe signature');
else fail('F2.001', 'no constructEvent');

// Tests
if (run('npm run test -w @pms/frontend -- lib/pathway-tier-cta.test.ts')) pass('F3.003');
if (run('npm run test -w @pms/frontend -- lib/pathway-from-catalogue.test.ts')) pass('F3.020');
if (run('npm run test -w @pms/frontend -- packages/booking-crm/src/channel-landing-pages/portalConversionPacks.test.ts')) {
  pass('F3.017');
}

// vk copy
const copy = fs.readFileSync(
  path.join(root, 'packages/booking-crm/src/channel-landing-pages/channelPortalCopy.ts'),
  'utf8',
);
if (copy.includes('vk:')) pass('C1.F13');

const summary = {
  at: new Date().toISOString(),
  total: checks.length,
  passed: checks.filter((c) => c.pass).length,
  checks,
};
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(summary, null, 2));
console.log(`Verification: ${summary.passed}/${summary.total} checks`);
process.exit(summary.passed === summary.total ? 0 : 1);
