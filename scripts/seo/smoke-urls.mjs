/**
 * Print priority post-deploy smoke URLs (GSC inspection + manual checks).
 * Usage: node scripts/seo/smoke-urls.mjs [--base https://www.pmstructure.com]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const base =
  process.argv.find((a) => a.startsWith('--base='))?.slice(7) ??
  process.env.PMS_SITE_URL ??
  'https://pmstructure.com';

function slugsFrom(file, pattern) {
  const src = fs.readFileSync(path.join(root, file), 'utf8');
  return [...src.matchAll(pattern)].map((m) => m[1]);
}

const paths = [
  '/',
  '/faq',
  '/pmp-exam-2026',
  '/pmp',
  '/certifications/pmp',
  '/answers',
  '/topics',
  '/answers/is-the-pmp-exam-changing-in-2026',
  '/answers/what-are-the-pmp-eligibility-requirements',
  '/topics/pmp-exam-2026',
  '/topics/exam-readiness',
  '/pmp-foundation',
  '/legal/pricing-disclaimers',
  '/legal/regional-pricing',
  '/sitemap.xml',
  '/robots.txt',
  '/llms.txt',
  '/entity.json',
];

const pmpCluster = slugsFrom('frontend/content/pmp/pages.ts', /path: '(\/pmp[^']*)'/g).slice(0, 3);
const extra = pmpCluster.filter((p) => !paths.includes(p));

console.log('# PM Structure — post-deploy smoke URLs\n');
console.log(`Base: ${base}\n`);
for (const p of [...paths, ...extra]) {
  console.log(`${base.replace(/\/$/, '')}${p}`);
}

console.log('\n# Rich Results Test (manual)');
console.log(`${base}/faq`);
console.log(`${base}/certifications/pmp`);
console.log(`${base}/answers/is-the-pmp-exam-changing-in-2026`);
