/**
 * FAQ count, PMP 2026 cluster, /pmp-faq route, 27 categories, compliance scan.
 */
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const frontend = path.join(root, 'frontend');

const faqData = fs.readFileSync(path.join(frontend, 'content/faq/data.ts'), 'utf8');
const pmpFaqs = fs.readFileSync(path.join(frontend, 'content/faq/pmp-2026-faqs.ts'), 'utf8');
const pmpCategories = fs.readFileSync(path.join(frontend, 'content/faq/pmp-categories.ts'), 'utf8');
const hubSections = fs.readFileSync(path.join(frontend, 'content/faq/hub-sections.ts'), 'utf8');
const pmpFaqPage = path.join(frontend, 'app/(site)/pmp-faq/page.tsx');

let pmpFaqJson = { count: 0 };
try {
  pmpFaqJson = JSON.parse(
    fs.readFileSync(path.join(frontend, 'public/pmp-faq.json'), 'utf8'),
  );
} catch {
  console.warn('faq-check: pmp-faq.json not found: run seo:generate-ai-files');
}

const pmp2026Count = (pmpFaqs.match(/id: 'pmp26-/g) || []).length;
const categoryCount = (pmpCategories.match(/id: '/g) || []).length;
const hubPmpFirst = hubSections.indexOf("id: 'pmp-2026'") < hubSections.indexOf("id: 'about-pathways'");

const unsafePatterns = [
  /guaranteed pass/i,
  /guarantee.*pmp pass/i,
  /official PMI ATP/i,
  /PMI authorized training partner(?!.*not)/i,
];

let failed = false;

if (pmp2026Count < 83) {
  console.error(`faq-check FAIL: expected >= 83 PMP 2026 FAQs, found ${pmp2026Count}`);
  failed = true;
}

const surfaceRun = spawnSync(
  'node',
  ['--import', 'tsx', path.join(__dirname, 'faq-surface-tags.mjs')],
  { cwd: root, encoding: 'utf8' },
);
if (surfaceRun.status !== 0) {
  console.error(surfaceRun.stdout || surfaceRun.stderr || 'faq-check FAIL: surface tag validation');
  failed = true;
} else if (surfaceRun.stdout?.trim()) {
  console.log(surfaceRun.stdout.trim());
}

if (categoryCount < 27) {
  console.error(`faq-check FAIL: expected 27 PMP categories, found ~${categoryCount}`);
  failed = true;
}

if (!hubSections.includes('pmp-2026') || !hubSections.includes('pmp2026')) {
  console.error('faq-check FAIL: /faq missing pmp-2026 hub section');
  failed = true;
}

if (!hubPmpFirst) {
  console.error('faq-check FAIL: /faq hub sections should be PMP-first');
  failed = true;
}

if (!fs.existsSync(pmpFaqPage)) {
  console.error('faq-check FAIL: /pmp-faq route missing');
  failed = true;
}

if (pmpFaqJson.count && pmpFaqJson.count < 83) {
  console.error(`faq-check FAIL: pmp-faq.json count too low (${pmpFaqJson.count})`);
  failed = true;
}

const baseCount = (faqData.match(/\bP\(/g) || []).length;
const pmpHelperCount = (pmpFaqs.match(/\bpmp\(/g) || []).length;
const totalApprox = baseCount + pmpHelperCount;
if (totalApprox < 130) {
  console.error(
    `faq-check FAIL: total FAQ entries low (${totalApprox}, base=${baseCount}, pmp=${pmpHelperCount})`,
  );
  failed = true;
}

for (const pattern of unsafePatterns) {
  if (pattern.test(pmpFaqs)) {
    const negation = /does not guarantee|not an official|not PMI|No\./i.test(pmpFaqs);
    if (!negation) {
      console.error(`faq-check WARN: review compliance pattern ${pattern} in pmp-2026-faqs.ts`);
    }
  }
}

const slugMapBlock = pmpFaqs.match(/FAQ_RELATED_ANSWER_SLUGS[\s\S]*?\};/);
const relatedAnswerSlugCount = slugMapBlock
  ? (slugMapBlock[0].match(/'pmp26-/g) || []).length
  : 0;
if (relatedAnswerSlugCount < 15) {
  console.error(
    `faq-check FAIL: expected >= 15 relatedAnswerSlug links, found ${relatedAnswerSlugCount}`,
  );
  failed = true;
}

if (failed) process.exit(1);
console.log(
  `faq-check OK (${pmp2026Count} pmp2026 FAQs, ${categoryCount} categories, ~${totalApprox} total, ${relatedAnswerSlugCount} answer links)`,
);