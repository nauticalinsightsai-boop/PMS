/**
 * Public prerequisites for owner GSC/GA4 tasks (OA-002, OA-003).
 * Run before Mahaa logs into Search Console / GA4.
 *
 * Usage: node scripts/seo/owner-prereq-check.mjs [--base=https://pmstructure.com]
 */
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: { base: { type: 'string', default: 'https://pmstructure.com' } },
});
const base = values.base.replace(/\/$/, '');

const priorityUrls = [
  '/',
  '/certifications/pmp',
  '/certifications',
  '/pmp-exam-2026',
  '/topics/pmp-exam-2026',
  '/answers/is-the-pmp-exam-changing-in-2026',
  '/faq',
  '/answers',
  '/topics',
  '/legal/terms',
  '/legal/privacy',
];

const assets = ['/sitemap.xml', '/robots.txt', '/llms.txt'];

let failed = 0;

async function check(path, label) {
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) {
      console.error(`FAIL ${label}: HTTP ${res.status} ${url}`);
      failed++;
      return;
    }
    console.log(`OK   ${label}: HTTP ${res.status}`);
  } catch (err) {
    console.error(`FAIL ${label}: ${err.message}`);
    failed++;
  }
}

console.log(`owner-prereq-check: ${base}\n`);

for (const path of priorityUrls) await check(path, path);
for (const path of assets) await check(path, path);

console.log('\nNext: Mahaa follows docs/internal/evidence/GSC_GA4_OWNER_ACTIONS.md');
console.log('Attach screenshots to docs/internal/evidence/gsc/ and ga4/');

process.exit(failed ? 1 : 0);
