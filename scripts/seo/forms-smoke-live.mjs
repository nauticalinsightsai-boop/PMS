/**
 * OA-012: Live forms smoke test against production /api/interactions.
 * Usage: node scripts/seo/forms-smoke-live.mjs [--base=https://pmstructure.com]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const evidenceDir = path.join(root, 'docs/internal/evidence');

const baseArg = process.argv.find((a) => a.startsWith('--base='));
const base = (baseArg?.slice(7) ?? 'https://pmstructure.com').replace(/\/$/, '');
const stamp = new Date().toISOString().slice(0, 10);
const testEmail = `seo-smoke+${stamp.replace(/-/g, '')}@pmstructure.com`;

const cases = [
  {
    name: 'roadmap',
    body: {
      source: 'pmp_roadmap_lead',
      subject: 'SEO smoke test: PMP roadmap',
      email: testEmail,
      payload: {
        formId: 'seo_smoke_roadmap',
        formLabel: 'SEO smoke roadmap',
        placement: 'seo_closeout_smoke',
        pagePath: '/certifications/pmp',
        fullName: 'SEO Smoke Test',
        phone: '+971 500000000',
        siteCertId: 'pmp',
        certName: 'PMP',
      },
    },
  },
  {
    name: 'waitlist',
    body: {
      source: 'waitlist',
      subject: 'SEO smoke test: waitlist',
      email: testEmail,
      payload: {
        formId: 'seo_smoke_waitlist',
        formLabel: 'SEO smoke waitlist',
        placement: 'seo_closeout_smoke',
        pagePath: '/certifications/compare',
        fullName: 'SEO Smoke Test',
        phone: '+971 500000000',
        offeringId: 'prince2-practitioner',
      },
    },
  },
  {
    name: 'newsletter',
    body: {
      source: 'subscription',
      subject: 'SEO smoke test: newsletter',
      email: testEmail,
      payload: {
        formId: 'seo_smoke_newsletter',
        formLabel: 'SEO smoke newsletter',
        placement: 'seo_closeout_smoke',
        pagePath: '/newsletter',
        fullName: 'SEO Smoke Test',
        topics: ['PMP 2026'],
        topicsLabel: 'PMP 2026',
      },
    },
  },
];

const results = [];

async function post(caseDef) {
  const res = await fetch(`${base}/api/interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(caseDef.body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

console.log(`forms-smoke-live: ${base}\n`);

for (const c of cases) {
  try {
    const { status, json } = await post(c);
    const ok = status === 201 && json.success === true;
    const detail = ok
      ? `id=${json.id ?? 'n/a'} sheetsSynced=${json.sheetsSynced} sheetsSyncPending=${json.sheetsSyncPending}`
      : JSON.stringify(json);
    results.push({ form: c.name, ok, status, detail, sheetsWarning: json.sheetsWarning ?? null });
    console.log(`${ok ? 'OK' : 'FAIL'}  ${c.name}: HTTP ${status} ${detail}`);
  } catch (err) {
    results.push({ form: c.name, ok: false, error: err.message });
    console.log(`FAIL  ${c.name}: ${err.message}`);
  }
}

const outPath = path.join(evidenceDir, `forms-smoke-live-${stamp}.json`);
fs.mkdirSync(evidenceDir, { recursive: true });
fs.writeFileSync(
  outPath,
  JSON.stringify({ base, testEmail, capturedAt: new Date().toISOString(), results }, null, 2),
);
console.log(`\nWrote ${path.relative(root, outPath)}`);

const failed = results.some((r) => !r.ok);
process.exit(failed ? 1 : 0);
