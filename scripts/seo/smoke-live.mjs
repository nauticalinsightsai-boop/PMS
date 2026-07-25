/**
 * Post-deploy live smoke test. HTTP 200 + H1 + canonical on priority URLs.
 * Usage: node scripts/seo/smoke-live.mjs [--base=https://pmstructure.com]
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const baseArg = process.argv.find((a) => a.startsWith('--base='));
const base = (baseArg?.slice(7) ?? process.env.PMS_SITE_URL ?? 'https://pmstructure.com').replace(
  /\/$/,
  '',
);

const checks = [
  { path: '/', needH1: true, needCanonical: true },
  { path: '/faq', needH1: true, needCanonical: true },
  { path: '/pmp-exam-2026', needH1: true, needCanonical: true },
  { path: '/answers/is-the-pmp-exam-changing-in-2026', needH1: true, needCanonical: true, needText: 'short answer' },
  { path: '/certifications/pmp', needH1: true, needCanonical: true },
  { path: '/sitemap.xml', needH1: false, needCanonical: false },
  { path: '/robots.txt', needH1: false, needCanonical: false },
  { path: '/llms.txt', needH1: false, needCanonical: false },
  { path: '/entity.json', needH1: false, needCanonical: false },
];

let failed = false;
let passed = 0;

function fetchBody(url) {
  const args = ['-sL', '-m', '40', '-A', 'PMS-SEO-Smoke/1.0', '-w', '\n__STATUS__%{http_code}', url];
  let lastErr;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return execFileSync('curl', args, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    } catch (err) {
      lastErr = err;
      if (attempt < 2) continue;
    }
  }
  throw new Error(lastErr?.message || 'curl failed');
}

console.log(`smoke-live: ${base}\n`);

for (const check of checks) {
  const url = `${base}${check.path}`;
  try {
    const raw = fetchBody(url);
    const statusMatch = raw.match(/__STATUS__(\d{3})$/);
    const status = statusMatch ? Number(statusMatch[1]) : 0;
    const body = statusMatch ? raw.slice(0, -statusMatch[0].length) : raw;
    const lower = body.toLowerCase();

    if (status < 200 || status >= 400) {
      console.error(`FAIL ${check.path}. HTTP ${status || 'unknown'}`);
      failed = true;
      continue;
    }

    if (check.needH1 && !lower.includes('<h1')) {
      console.error(`FAIL ${check.path}: no <h1 in response`);
      failed = true;
      continue;
    }

    if (check.needCanonical && !lower.includes('rel="canonical"')) {
      console.error(`FAIL ${check.path}: no canonical link`);
      failed = true;
      continue;
    }

    if (check.needText && !lower.includes(check.needText.toLowerCase())) {
      console.error(`FAIL ${check.path}: missing "${check.needText}" in body`);
      failed = true;
      continue;
    }

    passed++;
    console.log(`OK   ${check.path} (${status})`);
  } catch (err) {
    console.error(`FAIL ${check.path}: ${err.message}`);
    failed = true;
  }
}

const outDir = path.join(__dirname, '../../docs/reports');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
const reportPath = path.join(outDir, `SMOKE_LIVE_${stamp}.md`);
fs.writeFileSync(
  reportPath,
  `# Live smoke test: ${stamp}\n\nBase: ${base}\n\nPassed: ${passed}/${checks.length}\nStatus: ${failed ? 'FAIL' : 'PASS'}\n`,
);

console.log(`\nReport: ${reportPath}`);
if (failed) process.exit(1);
console.log(`smoke-live complete (${passed}/${checks.length})`);
