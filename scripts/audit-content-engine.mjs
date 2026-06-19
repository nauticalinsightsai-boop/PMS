/**
 * B11 content engine audit (read-only).
 * Usage: npm run audit:content-engine
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const docsInternal = path.join(root, 'docs/internal');

const B11_DOCS = [
  'PMSTRUCTURE_CONTENT_ENGINE.md',
  'PMSTRUCTURE_PMP_2026_FACT_LOCK.md',
  'pmstructure-content-inventory.csv',
  'pmstructure-pmp-2026-source-review.csv',
  'pmstructure-answer-library.csv',
  'pmstructure-90-day-content-calendar.csv',
  'pmstructure-owner-validation-register.csv',
  'pmstructure-legal-disclaimer-review.csv',
  'PMSTRUCTURE_B03_GSC_GA4_VALIDATION_CHECKLIST.md',
  'pmstructure-regional-route-approval.csv',
  'pmstructure-author-reviewer-registry.csv',
];

const EXPECTED_HEADERS = {
  'pmstructure-content-inventory.csv':
    'URL,Route,Page_Type,Primary_Intent,Current_Status,Recommended_Status,Official_Source_Required,Last_Reviewed,CTA,Internal_Links,Owner,Notes',
  'pmstructure-pmp-2026-source-review.csv':
    'Claim,Page_URL,Current_Copy,Source_Required,Official_Source_URL,Verification_Status,Last_Reviewed,Reviewer,Recommended_Copy,Public_Copy_Status,Legal_Risk,Notes',
  'pmstructure-answer-library.csv':
    'Question,Target_URL,Intent,Primary_Page,Related_Topic_Hub,CTA,Status,Official_Source_Required,Notes',
  'pmstructure-90-day-content-calendar.csv':
    'Week,Date,Content_Type,Title,Target_URL,Primary_Keyword,Intent,CTA,Internal_Links,Status,Owner,Notes',
};

const MIN_ROWS = {
  'pmstructure-content-inventory.csv': 50,
  'pmstructure-pmp-2026-source-review.csv': 18,
  'pmstructure-answer-library.csv': 15,
  'pmstructure-90-day-content-calendar.csv': 16,
};

let failed = false;

function fail(msg) {
  console.error(`audit-content-engine FAIL: ${msg}`);
  failed = true;
}

console.log('audit-content-engine: B11 artifacts\n');

for (const name of B11_DOCS) {
  const p = path.join(docsInternal, name);
  if (!fs.existsSync(p)) {
    fail(`missing docs/internal/${name}`);
    continue;
  }
  console.log(`  OK  docs/internal/${name}`);
}

for (const [file, header] of Object.entries(EXPECTED_HEADERS)) {
  const p = path.join(docsInternal, file);
  if (!fs.existsSync(p)) continue;
  const firstLine = fs.readFileSync(p, 'utf8').split('\n')[0].replace(/\r$/, '');
  if (firstLine !== header) {
    fail(`${file} header mismatch`);
  }
  const rowCount = fs.readFileSync(p, 'utf8').trim().split('\n').length - 1;
  const min = MIN_ROWS[file] ?? 1;
  if (rowCount < min) {
    fail(`${file} expected at least ${min} data rows, found ${rowCount}`);
  } else {
    console.log(`  OK  ${file} (${rowCount} rows)`);
  }
}

const engine = fs.readFileSync(path.join(docsInternal, 'PMSTRUCTURE_CONTENT_ENGINE.md'), 'utf8');
for (const link of [
  'pmstructure-keyword-url-map.csv',
  'PMSTRUCTURE_COMPETITOR_BENCHMARK.md',
  'PMSTRUCTURE_90_DAY_MARKETING_SCHEDULE.md',
  'PMSTRUCTURE_PMP_2026_FACT_LOCK.md',
  'compliance.ts',
]) {
  if (!engine.includes(link)) {
    fail(`CONTENT_ENGINE.md missing cross-link: ${link}`);
  }
}

const factLock = fs.readFileSync(path.join(docsInternal, 'PMSTRUCTURE_PMP_2026_FACT_LOCK.md'), 'utf8');
if (!factLock.includes('9 July 2026') || !factLock.includes('8 July 2026')) {
  fail('FACT_LOCK.md missing July 2026 date lock');
}

const registry = fs.readFileSync(
  path.join(root, 'packages/site-content/data/certifications-registry.json'),
  'utf8',
);
if (!registry.includes('PMP 2026 Readiness Pathway')) {
  fail('PMP registry detailHeroTitle not aligned to 2026 pathway');
}

const answers = fs.readFileSync(path.join(root, 'frontend/content/answers/pages.ts'), 'utf8');
if (!answers.includes("ctaLabel: 'Get My PMP 2026 Roadmap'")) {
  fail('flagship answer missing roadmap CTA');
}
if (answers.includes('35 PDUs')) {
  fail('answers/pages.ts still contains 35 PDUs');
}

console.log(`\naudit-content-engine: ${failed ? 'FAILED' : 'PASSED'}`);
process.exit(failed ? 1 : 0);
