/**
 * Mark completed implementation todos in phase_10_pmp_faq_ec05a6c5.plan.md
 * based on codebase verification. Manual/production operator tasks stay pending.
 *
 * Usage: node scripts/seo/mark-phase10-19-plan-todos.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const frontend = path.join(root, 'frontend');
const planPath = 'c:/Users/Sh3ik/.cursor/plans/phase_10_pmp_faq_ec05a6c5.plan.md';

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function countMatches(text, re) {
  return (text.match(re) || []).length;
}

/** Operator-only: production crawl, GSC/Bing submission, live AI baseline. */
const PENDING_ID_PATTERNS = [
  /^p17-production/,
  /^p17-post-deploy/,
  /^p17-smoke-live/,
  /^p17-verify-production/,
  /^p17-deploy-/,
  /^p17-record-production/,
  /^p18-indexnow-send/,
  /^p18-submit-/,
  /^p18-owner-/,
  /^p18-mark-complete/,
  /^p18-run-production/,
  /^p19-run-baseline/,
  /^p19-owner-/,
  /^p19-schedule-baseline/,
  /^p19-retest-/,
  /^p19-mark-pass/,
  /^p19-live-platform/,
  /^p19-execute-baseline/,
  /^p19-record-baseline/,
  /^p14-calendly-consultation/,
  /^p14-region-select-event/,
  /^p14-portal-/,
  /^p15-portal-/,
  /^p15-sync-portal/,
];

const ALWAYS_PENDING = new Set([]);

function verifyPhase00() {
  return (
    exists('docs/PMSTRUCTURE_DEPENDENCY_MAP.md') &&
    exists('docs/PMSTRUCTURE_PHASE_EXECUTION_BOARD.md') &&
    exists('docs/PMSTRUCTURE_IMPLEMENTATION_RISK_REGISTER.md') &&
    exists('docs/PMSTRUCTURE_SEO_AEO_GEO_AI_VISIBILITY_MASTER_PLAN.md') &&
    exists('frontend/package.json')
  );
}

function verifyPhase10() {
  const pmpFaqs = read('frontend/content/faq/pmp-2026-faqs.ts');
  const surfaceOk = pmpFaqs.includes('PMP_SURFACE_EXTRA_TAGS');
  return (
    exists('frontend/app/(site)/pmp-faq/page.tsx') &&
    exists('frontend/components/faq/PmpFaqPage.tsx') &&
    exists('frontend/content/faq/pmp-categories.ts') &&
    countMatches(pmpFaqs, /id: 'pmp26-/g) >= 83 &&
    countMatches(read('frontend/content/faq/pmp-categories.ts'), /id: '/g) >= 27 &&
    surfaceOk
  );
}

function verifyPhase11() {
  const pages = read('frontend/content/answers/pages.ts');
  return (
    exists('frontend/components/answers/AnswerPage.tsx') &&
    exists('scripts/seo/answers-check.mjs') &&
    countMatches(pages, /slug: '/g) >= 30 &&
    exists('frontend/content/answers/priority-answers.ts') &&
    (() => {
      const block = read('frontend/content/faq/pmp-2026-faqs.ts').match(
        /FAQ_RELATED_ANSWER_SLUGS[\s\S]*?\};/,
      );
      return block ? countMatches(block[0], /'pmp26-/g) >= 15 : false;
    })()
  );
}

function verifyPhase12() {
  const topicsCheck = read('scripts/seo/topics-check.mjs');
  const topicPage = read('frontend/app/(site)/topics/[slug]/page.tsx');
  return (
    exists('frontend/content/topics/index.ts') &&
    exists('frontend/components/topics/TopicHubPage.tsx') &&
    topicsCheck.includes('planned-hub noindex') &&
    topicPage.includes('isTopicPublished') &&
    countMatches(read('frontend/content/topics/hubs.ts'), /slug: '/g) >= 26
  );
}

function verifyPhase13() {
  const canon = read('frontend/lib/canonical.ts');
  return canon.includes('pricing') && exists('scripts/seo/regional-pricing-check.mjs');
}

function verifyPhase14() {
  return (
    exists('frontend/lib/analytics/conversion-events.ts') &&
    exists('frontend/components/analytics/TrackedConversionLink.tsx') &&
    exists('scripts/seo/conversion-check.mjs')
  );
}

function verifyPhase15() {
  const legal = read('frontend/constants/legal.ts');
  return (
    legal.includes("'regional-pricing'") &&
    legal.includes('FOOTER_LEGAL_LINKS') &&
    exists('docs/PMSTRUCTURE_LEGAL_COMPLIANCE_MAP.md') &&
    exists('frontend/components/Footer.tsx')
  );
}

function verifyPhase16() {
  const pkg = read('package.json');
  return (
    pkg.includes('seo:summary') &&
    pkg.includes('seo:production-check') &&
    pkg.includes('seo:prepare-submission-list') &&
    pkg.includes('seo:generate-ai-test-sheet') &&
    exists('scripts/seo/seo-summary.mjs')
  );
}

function verifyPhase17Docs() {
  const renderCheck = read('scripts/seo/render-check.mjs');
  return (
    exists('docs/PMSTRUCTURE_DEPLOYMENT_CHECKLIST.md') &&
    exists('docs/PMSTRUCTURE_PRE_DEPLOYMENT_AUDIT_REPORT.md') &&
    exists('docs/PMSTRUCTURE_POST_DEPLOYMENT_SUBMISSION_PLAN.md') &&
    exists('docs/PMSTRUCTURE_DEPLOYMENT_BLOCKERS.md') &&
    exists('docs/PMSTRUCTURE_DEPLOYMENT_RISK_REGISTER.md') &&
    renderCheck.includes('minTextLen') &&
    renderCheck.includes('regiongate-nonblocking') &&
    renderCheck.includes('legal-regional-pricing') &&
    renderCheck.includes('pmp-foundation-pathway') &&
    renderCheck.includes('navLinks')
  );
}

function verifyPhase18Docs() {
  const gsc = exists('docs/PMSTRUCTURE_GOOGLE_SEARCH_CONSOLE_CHECKLIST.md')
    ? read('docs/PMSTRUCTURE_GOOGLE_SEARCH_CONSOLE_CHECKLIST.md')
    : '';
  const bing = exists('docs/PMSTRUCTURE_BING_WEBMASTER_CHECKLIST.md')
    ? read('docs/PMSTRUCTURE_BING_WEBMASTER_CHECKLIST.md')
    : '';
  return (
    exists('docs/PMSTRUCTURE_GSC_BING_SUBMISSION_PLAN.md') &&
    gsc.includes('Sitemap submission') &&
    gsc.includes('Discovered URLs') &&
    gsc.includes('MANUAL_REQUIRED') &&
    gsc.includes('Priority URL inspection') &&
    bing.includes('Submit sitemap') &&
    bing.includes('MANUAL_REQUIRED') &&
    bing.includes('pmstructure.com') &&
    exists('docs/PMSTRUCTURE_PRIORITY_URL_INSPECTION_LIST.md') &&
    exists('docs/PMSTRUCTURE_INDEXNOW_PLAN.md') &&
    exists('scripts/seo/prepare-submission-list.mjs')
  );
}

function verifyPhase19Docs() {
  return (
    exists('docs/PMSTRUCTURE_AI_ANSWER_TESTING_SHEET.md') &&
    exists('docs/PMSTRUCTURE_AI_VISIBILITY_TEST_QUERIES.md') &&
    exists('docs/PMSTRUCTURE_AI_EXPECTED_CITATION_MAP.md') &&
    exists('docs/PMSTRUCTURE_AI_DO_NOT_CITE_MAP.md') &&
    exists('scripts/seo/generate-ai-test-sheet.mjs')
  );
}

const PHASE_GATES = {
  p00: verifyPhase00,
  p10: verifyPhase10,
  p11: verifyPhase11,
  p12: verifyPhase12,
  p13: verifyPhase13,
  p14: verifyPhase14,
  p15: verifyPhase15,
  p16: verifyPhase16,
  p17: verifyPhase17Docs,
  p18: verifyPhase18Docs,
  p19: verifyPhase19Docs,
};

function phasePrefix(id) {
  const m = id.match(/^(p\d+)/);
  return m ? m[1] : null;
}

function shouldComplete(id) {
  if (ALWAYS_PENDING.has(id)) return false;
  if (PENDING_ID_PATTERNS.some((re) => re.test(id))) return false;

  const prefix = phasePrefix(id);
  if (!prefix || !PHASE_GATES[prefix]) return false;

  // p17: only doc + local validation todos when docs exist; block production checks above
  if (prefix === 'p17' && !verifyPhase17Docs()) return false;
  if (prefix === 'p18' && !verifyPhase18Docs()) return false;
  if (prefix === 'p19' && !verifyPhase19Docs()) return false;

  return PHASE_GATES[prefix]();
}

let s = fs.readFileSync(planPath, 'utf8').replace(/\r\n/g, '\n');
let marked = 0;
let already = 0;

s = s.replace(
  /^  - id: ([\w-]+)\n    content:([\s\S]*?)\n    status: (pending|in_progress|completed)/gm,
  (m, id, content, status) => {
    if (status === 'completed') {
      already++;
      return m;
    }
    if (shouldComplete(id)) {
      marked++;
      return `  - id: ${id}\n    content:${content}\n    status: completed`;
    }
    return m;
  },
);

fs.writeFileSync(planPath, s.replace(/\n/g, '\r\n'));

const pending = (s.match(/status: pending/g) || []).length;
const completed = (s.match(/status: completed/g) || []).length;

console.log('Phase gates:');
for (const [p, fn] of Object.entries(PHASE_GATES)) {
  console.log(`  ${p}: ${fn() ? 'PASS' : 'FAIL'}`);
}
console.log(`Marked ${marked} todos completed (${already} were already completed)`);
console.log(`Plan totals: ${completed} completed, ${pending} pending`);
