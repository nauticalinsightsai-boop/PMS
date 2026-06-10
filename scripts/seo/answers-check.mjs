/**
 * Verify answer pages exist and are referenced in sitemap.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');

const pagesSrc = fs.readFileSync(
  path.join(root, 'frontend/content/answers/pages.ts'),
  'utf8',
);
const slugs = [...pagesSrc.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);

const dynamicPage = path.join(root, 'frontend/app/(site)/answers/[slug]/page.tsx');
const indexPage = path.join(root, 'frontend/app/(site)/answers/page.tsx');

let failed = false;

if (!fs.existsSync(dynamicPage)) {
  console.error('answers-check FAIL: missing answers/[slug]/page.tsx');
  failed = true;
}
if (!fs.existsSync(indexPage)) {
  console.error('answers-check FAIL: missing answers/page.tsx');
  failed = true;
}

const sitemap = fs.readFileSync(path.join(root, 'frontend/app/sitemap.ts'), 'utf8');
if (!sitemap.includes('getPublishedAnswerPaths')) {
  console.error('answers-check FAIL: sitemap.ts missing getPublishedAnswerPaths');
  failed = true;
}
if (!sitemap.includes("'/answers'")) {
  console.error('answers-check FAIL: sitemap.ts missing /answers index');
  failed = true;
}

const minAnswers = 30;
if (slugs.length < minAnswers) {
  console.error(`answers-check FAIL: expected >= ${minAnswers} answers, found ${slugs.length}`);
  failed = true;
}

const batch2 = [
  'is-the-new-pmp-exam-harder',
  'should-i-rush-pmp-before-july-2026',
  'can-i-prepare-for-pmp-in-30-days',
  'what-is-the-best-pmp-study-plan',
  'what-should-i-do-after-a-low-pmp-mock-score',
  'is-pm-structure-an-official-pmi-atp',
  'does-pm-structure-guarantee-pmp-success',
];
for (const slug of batch2) {
  if (!slugs.includes(slug)) {
    console.error(`answers-check FAIL: missing batch-2 slug: ${slug}`);
    failed = true;
  }
}

const answersIndex = fs.readFileSync(path.join(root, 'frontend/content/answers/index.ts'), 'utf8');
if (!answersIndex.includes('getPublishedAnswerPaths')) {
  console.error('answers-check FAIL: index must export getPublishedAnswerPaths for sitemap');
  failed = true;
}

if (failed) process.exit(1);
console.log(`answers-check OK (${slugs.length} answer slugs)`);
