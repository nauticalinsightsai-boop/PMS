/**
 * Notify Bing/Yandex via IndexNow after deploy (optional).
 * Requires INDEXNOW_KEY env + public/{key}.txt on site root.
 *
 * Usage:
 *   INDEXNOW_KEY=yourkey node scripts/seo/indexnow.mjs
 *   INDEXNOW_KEY=yourkey node scripts/seo/indexnow.mjs --base=https://pmstructure.com
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');

const key = process.env.INDEXNOW_KEY?.trim();
const baseArg = process.argv.find((a) => a.startsWith('--base='));
const base = (baseArg?.slice(7) ?? process.env.PMS_SITE_URL ?? 'https://pmstructure.com').replace(
  /\/$/,
  '',
);
const host = new URL(base).host;

if (!key) {
  console.error('indexnow: set INDEXNOW_KEY (8-128 hex chars) and deploy public/{key}.txt first');
  process.exit(1);
}

const keyFile = path.join(root, 'frontend/public', `${key}.txt`);
if (!fs.existsSync(keyFile)) {
  fs.writeFileSync(keyFile, `${key}\n`);
  console.log(`Created frontend/public/${key}.txt: commit and deploy before pinging`);
}

const priorityPaths = [
  '/',
  '/certifications/pmp',
  '/pmp-exam-2026',
  '/pmp',
  '/faq',
  '/certifications/compare',
  '/answers/is-the-pmp-exam-changing-in-2026',
  '/membership',
  '/pm-service',
  '/sitemap.xml',
];

const forbidden = /checkout|payment|success|cancel|thank-you|login|account|dashboard|admin/i;
const urlList = priorityPaths
  .map((p) => `${base}${p}`)
  .filter((u) => !forbidden.test(u));

const dryRun = !process.argv.includes('--send');
if (dryRun) {
  console.log('indexnow dry-run (pass --send to submit):', urlList.length, 'URLs');
  urlList.forEach((u) => console.log(' ', u));
  process.exit(0);
}

const body = JSON.stringify({
  host,
  key,
  keyLocation: `${base}/${key}.txt`,
  urlList,
});

try {
  const out = execFileSync(
    'curl',
    [
      '-sS',
      '-X',
      'POST',
      'https://api.indexnow.org/indexnow',
      '-H',
      'Content-Type: application/json; charset=utf-8',
      '-d',
      body,
    ],
    { encoding: 'utf8' },
  );
  console.log('indexnow: submitted', urlList.length, 'URLs');
  if (out.trim()) console.log(out.trim());
} catch (err) {
  console.error('indexnow failed:', err.message || err);
  process.exit(1);
}
