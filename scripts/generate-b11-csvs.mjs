/**
 * One-time generator for B11 internal CSVs (inventory, answer library, source review, calendar).
 * Usage: node scripts/generate-b11-csvs.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const docsInternal = path.join(root, 'docs/internal');

const pagesTs = fs.readFileSync(path.join(root, 'frontend/content/answers/pages.ts'), 'utf8');
const hubsTs = fs.readFileSync(path.join(root, 'frontend/content/topics/hubs.ts'), 'utf8');
const answerSlugs = [...pagesTs.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);
const hubSlugs = [...hubsTs.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);

function esc(v) {
  const s = String(v ?? '');
  return `"${s.replace(/"/g, '""')}"`;
}
function row(...cols) {
  return cols.map(esc).join(',');
}
function headerRow(...cols) {
  return cols.join(',');
}

// --- Content inventory ---
const inv = [
  headerRow(
    'URL',
    'Route',
    'Page_Type',
    'Primary_Intent',
    'Current_Status',
    'Recommended_Status',
    'Official_Source_Required',
    'Last_Reviewed',
    'CTA',
    'Internal_Links',
    'Owner',
    'Notes',
  ),
];

function addInv(url, route, type, intent, status, rec, src, reviewed, cta, links, owner, notes) {
  inv.push(
    row(
      `https://pmstructure.com${url}`,
      route,
      type,
      intent,
      status,
      rec,
      src,
      reviewed,
      cta,
      links,
      owner,
      notes,
    ),
  );
}

addInv('/', '/', 'Homepage', 'Brand + PMP 2026 flagship', 'Implemented', 'Keep', 'No', '18 June 2026', 'Get My PMP 2026 Roadmap', '/certifications/pmp', 'Mahaa', 'T-167 reviewed');
addInv('/certifications', '/certifications', 'Directory', 'Certification discovery', 'Implemented', 'Keep', 'No', '18 June 2026', 'Compare Certification Pathways', '/certifications/pmp', 'Mahaa', 'T-167');
addInv('/certifications/pmp', '/certifications/pmp', 'Commercial', 'PMP 2026 readiness conversion', 'Implemented', 'Enhance', 'Partial', '18 June 2026', 'Get My PMP 2026 Roadmap', '/topics/pmp-exam-2026; /answers/is-the-pmp-exam-changing-in-2026; /faq', 'Mahaa', 'Money page');
addInv('/topics/pmp-exam-2026', '/topics/pmp-exam-2026', 'Topic hub', 'PMP 2026 authority guide', 'Implemented', 'Enhance', 'Yes', '18 June 2026', 'View PMP 2026 pathway', '/certifications/pmp; /faq', 'Mahaa', 'Authority hub');
addInv('/pmp-exam-2026', '/pmp-exam-2026', 'Cluster pillar', 'PMP 2026 deep guide', 'Implemented', 'Keep', 'Yes', '18 June 2026', 'Get My PMP 2026 Roadmap', '/certifications/pmp; /topics/pmp-exam-2026', 'Mahaa', 'Cluster pillar');
addInv('/pmp', '/pmp', 'Hub', 'PMP preparation hub', 'Implemented', 'Keep', 'Partial', '18 June 2026', 'Readiness diagnostic', '/certifications/pmp', 'Mahaa', 'T-167');
addInv('/answers', '/answers', 'Index', 'Answer library index', 'Implemented', 'Keep', 'No', '18 June 2026', 'Browse answers', '/certifications/pmp', 'Mahaa', 'T-167');
addInv('/answers/is-the-pmp-exam-changing-in-2026', '/answers/is-the-pmp-exam-changing-in-2026', 'Direct answer', 'Is PMP exam changing 2026', 'Implemented', 'Enhance', 'Yes', '18 June 2026', 'Get My PMP 2026 Roadmap', '/certifications/pmp; /topics/pmp-exam-2026; /faq', 'Mahaa', 'P0 answer');
addInv('/faq', '/faq', 'FAQ', 'Trust and objections', 'Implemented', 'Enhance', 'Partial', '18 June 2026', 'Get My PMP 2026 Roadmap', '/certifications/pmp', 'Mahaa', 'T-167');

for (const slug of answerSlugs) {
  if (slug === 'is-the-pmp-exam-changing-in-2026') continue;
  addInv(`/answers/${slug}`, `/answers/${slug}`, 'Direct answer', 'Informational', 'Implemented', 'Keep', 'Partial', '18 June 2026', 'Varies', '/certifications/pmp', 'Mahaa', 'answers/pages.ts');
}
for (const slug of hubSlugs) {
  if (slug === 'pmp-exam-2026') continue;
  const isSecondary = ['prince2-preparation', 'six-sigma-preparation', 'pmi-rmp-preparation'].includes(slug);
  addInv(
    `/topics/${slug}`,
    `/topics/${slug}`,
    isSecondary ? 'Secondary hub' : 'Topic hub',
    'Informational hub',
    'Implemented',
    isSecondary ? 'Secondary support' : 'Keep',
    'Partial',
    '18 June 2026',
    'Varies',
    '/certifications/pmp',
    'Mahaa',
    isSecondary ? 'T-151 secondary' : 'hubs.ts',
  );
}
const pmpCluster = [
  '/pmp-faq',
  '/pmp-current-vs-new-exam',
  '/pmp-exam-timeline-2026',
  '/pmp-before-8-july-2026',
  '/pmp-after-9-july-2026',
  '/pmp-study-plan-2026',
  '/pmp-readiness-diagnostic',
  '/pmp-mock-exam',
  '/pmp-foundation',
  '/pmp-professional',
  '/pmp-mastery',
];
for (const r of pmpCluster) {
  addInv(r, r, 'PMP cluster', 'PMP 2026 support', 'Implemented', 'Keep', 'Partial', '18 June 2026', 'Get My PMP 2026 Roadmap', '/certifications/pmp', 'Mahaa', 'Cluster');
}
for (const [id, name, rec] of [
  ['prince2-practitioner', 'PRINCE2 Practitioner', 'Secondary / waitlist'],
  ['lss-yellow', 'Lean Six Sigma Yellow', 'Secondary / waitlist'],
  ['lss-black', 'Lean Six Sigma Black', 'Secondary / waitlist'],
  ['pmi-rmp', 'PMI-RMP', 'Secondary'],
  ['pgmp', 'PgMP', 'Secondary / waitlist'],
]) {
  addInv(
    `/certifications/${id}`,
    `/certifications/${id}`,
    'Certification',
    `${name} pathway`,
    'Implemented',
    rec,
    'Partial',
    '18 June 2026',
    'Join Waitlist / Compare',
    '/certifications/compare; /certifications/pmp',
    'Mahaa',
    'T-151 secondary',
  );
}

fs.writeFileSync(path.join(docsInternal, 'pmstructure-content-inventory.csv'), `${inv.join('\n')}\n`);

// --- Source review ---
const srcHeader = headerRow(
  'Claim',
  'Page_URL',
  'Current_Copy',
  'Source_Required',
  'Official_Source_URL',
  'Verification_Status',
  'Last_Reviewed',
  'Reviewer',
  'Recommended_Copy',
  'Notes',
);
const srcRows = [
  srcHeader,
  row('PMP exam changing in 2026', 'https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026', 'Yes — transition around 9 July 2026 (verify PMI)', 'Yes', 'OFFICIAL_SOURCE_URL_REQUIRED', 'Pending owner PMI browser capture', '18 June 2026', 'Owner', 'Verify against PMI official PMP pages before publishing final wording', 'pmi.org 403 automated'),
  row('Exam transition date', 'Multiple PMP cluster pages', '8 July / 9 July 2026 planning anchors', 'Yes', 'OFFICIAL_SOURCE_URL_REQUIRED', 'Pending verification', '18 June 2026', 'Owner', 'Confirm effective date on PMI.org', ''),
  row('Current exam final date', 'https://pmstructure.com/pmp-before-8-july-2026', 'Before 8 July 2026 narrative', 'Yes', 'OFFICIAL_SOURCE_URL_REQUIRED', 'Pending verification', '18 June 2026', 'Owner', 'Verify with PMI handbook', ''),
  row('Updated exam launch date', 'https://pmstructure.com/pmp-after-9-july-2026', 'From 9 July 2026 onward', 'Yes', 'OFFICIAL_SOURCE_URL_REQUIRED', 'Pending verification', '18 June 2026', 'Owner', 'Verify with PMI handbook', ''),
  row('Number of questions', 'https://pmstructure.com/certifications/pmp', '180 questions (registry/siteData)', 'Yes', 'OFFICIAL_SOURCE_URL_REQUIRED', 'Pending verification', '18 June 2026', 'Owner', 'Verify current PMP exam format on PMI', ''),
  row('Exam duration', 'https://pmstructure.com/certifications/pmp', '230 minutes (registry/siteData)', 'Yes', 'OFFICIAL_SOURCE_URL_REQUIRED', 'Pending verification', '18 June 2026', 'Owner', 'Verify on PMI', ''),
  row('Domain weights', 'https://pmstructure.com/answers/what-are-the-pmp-2026-domain-weights', 'Orientation only — no fixed percentages published', 'Yes', 'OFFICIAL_SOURCE_URL_REQUIRED', 'Unverified — do not invent weights', '18 June 2026', 'Owner', 'Use PMI ECO only when verified', 'Flagged in source-review'),
  row('Eligibility wording', 'https://pmstructure.com/certifications/pmp', '35 hours PM education/training in prerequisites copy', 'Yes', 'OFFICIAL_SOURCE_URL_REQUIRED', 'Partial — verify handbook', '18 June 2026', 'Owner', 'Match PMI eligibility language', ''),
  row('35 hours project management education/training', 'https://pmstructure.com/faq', 'Safe training-hour wording; not PDUs for eligibility', 'Yes', 'OFFICIAL_SOURCE_URL_REQUIRED', 'Partial', '18 June 2026', 'Owner', 'Use contact hours / training hours not 35 PDUs', ''),
  row('PMP credential awarded by PMI', 'https://pmstructure.com/faq', 'PM Structure does not award PMP', 'No', 'https://www.pmi.org/certifications/project-management-pmp', 'Verified disclaimer pattern', '18 June 2026', 'Developer', 'Keep independent platform disclaimer', ''),
  row('PM Structure independent platform disclaimer', 'https://pmstructure.com/certifications/pmp', 'Independent exam-prep; not PMI ATP', 'No', '', 'Verified on live copy', '18 June 2026', 'Developer', 'Maintain on all PMP factual pages', ''),
];
fs.writeFileSync(path.join(docsInternal, 'pmstructure-pmp-2026-source-review.csv'), `${srcRows.join('\n')}\n`);

// --- Answer library ---
const libHeader = headerRow(
  'Question',
  'Target_URL',
  'Intent',
  'Primary_Page',
  'Related_Topic_Hub',
  'CTA',
  'Status',
  'Official_Source_Required',
  'Notes',
);
const lib = [
  libHeader,
  row('Is the PMP exam changing in 2026?', 'https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026', 'Informational', '/answers/is-the-pmp-exam-changing-in-2026', '/topics/pmp-exam-2026', 'Get My PMP 2026 Roadmap', 'Implemented', 'Yes', ''),
  row('Should I take PMP before the 2026 update?', 'https://pmstructure.com/answers/should-i-take-pmp-before-8-july-2026', 'Decision', '/answers/should-i-take-pmp-before-8-july-2026', '/topics/pmp-exam-2026', 'Get My PMP 2026 Roadmap', 'Implemented', 'Yes', ''),
  row('What changed in the PMP exam 2026?', 'https://pmstructure.com/answers/current-pmp-exam-vs-new-pmp-exam', 'Informational', '/answers/current-pmp-exam-vs-new-pmp-exam', '/topics/pmp-exam-2026', 'Get My PMP 2026 Roadmap', 'Implemented', 'Yes', ''),
  row('What is the difference between PMP training hours and PDUs?', 'https://pmstructure.com/faq', 'Trust', '/faq', '/topics/pmp-exam-2026', 'Get My PMP 2026 Roadmap', 'Implemented', 'No', 'FAQ cluster'),
  row('How many hours do I need for PMP eligibility?', 'https://pmstructure.com/answers/what-are-the-pmp-eligibility-requirements', 'Informational', '/answers/what-are-the-pmp-eligibility-requirements', '/topics/pmp-exam-2026', 'Get My PMP 2026 Roadmap', 'Implemented', 'Yes', ''),
  row('Is PM Structure an official PMI provider?', 'https://pmstructure.com/answers/is-pm-structure-an-official-pmi-atp', 'Trust', '/answers/is-pm-structure-an-official-pmi-atp', '/faq', 'Compare Certification Pathways', 'Implemented', 'No', ''),
  row('Does PM Structure award PMP certification?', 'https://pmstructure.com/faq', 'Trust', '/faq', '/certifications/pmp', 'Get My PMP 2026 Roadmap', 'Implemented', 'No', ''),
  row('Is the PMP exam fee included?', 'https://pmstructure.com/faq', 'Commercial', '/faq', '/certifications/pmp', 'Get My PMP 2026 Roadmap', 'Partial', 'No', 'Owner confirm offer'),
  row('How do I know if I am ready for PMP?', 'https://pmstructure.com/answers/what-is-pmp-readiness', 'Decision', '/answers/what-is-pmp-readiness', '/topics/pmp-readiness', 'Get My PMP 2026 Roadmap', 'Implemented', 'No', ''),
  row('What is a PMP readiness roadmap?', 'https://pmstructure.com/certifications/pmp', 'Commercial', '/certifications/pmp', '/topics/pmp-exam-2026', 'Get My PMP 2026 Roadmap', 'Implemented', 'No', ''),
  row('Is PMP better than PRINCE2?', 'https://pmstructure.com/certifications/compare', 'Comparison', '/certifications/compare', '/topics/prince2-preparation', 'Compare Certification Pathways', 'Planned', 'No', 'Calendar Week 4'),
  row('Is PMI-RMP worth doing after PMP?', 'https://pmstructure.com/certifications/pmi-rmp', 'Comparison', '/certifications/pmi-rmp', '/topics/pmi-rmp-preparation', 'Join Waitlist', 'Planned', 'No', 'Secondary cert'),
  row('Should engineers take PMP?', 'TBD', 'Regional/audience', 'TBD', '/topics/pmp-exam-2026', 'Get My PMP 2026 Roadmap', 'Planned', 'No', 'B10 gap — owner decision'),
  row('Is PMP useful in GCC?', 'TBD', 'Regional', 'TBD', '/topics/pmp-exam-2026', 'Get My PMP 2026 Roadmap', 'Planned', 'No', 'Calendar Week 4'),
  row('Can South Asian professionals use PMP for GCC career mobility?', 'TBD', 'Regional', 'TBD', '/topics/pmp-exam-2026', 'Get My PMP 2026 Roadmap', 'Planned', 'No', 'Calendar Week 4'),
];
fs.writeFileSync(path.join(docsInternal, 'pmstructure-answer-library.csv'), `${lib.join('\n')}\n`);

// --- 90-day calendar ---
const calHeader = headerRow(
  'Week',
  'Date',
  'Content_Type',
  'Title',
  'Target_URL',
  'Primary_Keyword',
  'Intent',
  'CTA',
  'Internal_Links',
  'Status',
  'Owner',
  'Notes',
);
const cal = [calHeader];
const seed = [
  ['Week 1', '2026-06-23', 'authority guide', 'PMP Exam 2026 Guide', '/topics/pmp-exam-2026', 'PMP exam 2026', 'Informational', 'Get My PMP 2026 Roadmap', '/certifications/pmp; /faq', 'Implemented', 'Mahaa', ''],
  ['Week 1', '2026-06-24', 'answer page', 'Is the PMP exam changing in 2026?', '/answers/is-the-pmp-exam-changing-in-2026', 'is the PMP exam changing in 2026', 'Informational', 'Get My PMP 2026 Roadmap', '/certifications/pmp; /topics/pmp-exam-2026', 'Implemented', 'Mahaa', ''],
  ['Week 1', '2026-06-25', 'FAQ expansion', 'PMP 2026 + training hours vs PDUs', '/faq', 'PMP training hours vs PDUs', 'Trust', 'Get My PMP 2026 Roadmap', '/certifications/pmp', 'In progress', 'Mahaa', ''],
  ['Week 1', '2026-06-26', 'LinkedIn post', 'Why PMP 2026 needs a roadmap not random videos', '/certifications/pmp', 'PMP 2026 roadmap', 'Awareness', 'Get My PMP 2026 Roadmap', '/topics/pmp-exam-2026', 'Planned', 'Mahaa', ''],
  ['Week 2', '2026-06-30', 'answer page', 'Should I take PMP before the 2026 update?', '/answers/should-i-take-pmp-before-8-july-2026', 'PMP before 2026 update', 'Decision', 'Get My PMP 2026 Roadmap', '/certifications/pmp', 'Implemented', 'Mahaa', ''],
  ['Week 2', '2026-07-01', 'FAQ expansion', 'PMP training hours vs PDUs', '/faq', 'PMP training hours PDUs', 'Trust', 'Get My PMP 2026 Roadmap', '/certifications/pmp', 'In progress', 'Mahaa', ''],
  ['Week 2', '2026-07-02', 'comparison page', 'PMP current path vs updated path', '/pmp-current-vs-new-exam', 'current vs new PMP exam', 'Informational', 'Get My PMP 2026 Roadmap', '/certifications/pmp', 'Implemented', 'Mahaa', ''],
  ['Week 2', '2026-07-03', 'X post', 'Candidates fail from weak study structure not lack of content', '/certifications/pmp', 'PMP study structure', 'Awareness', 'Get My PMP 2026 Roadmap', '/topics/pmp-exam-2026', 'Planned', 'Mahaa', ''],
  ['Week 3', '2026-07-07', 'authority guide', 'PMP readiness checklist', '/pmp-readiness-diagnostic', 'PMP readiness checklist', 'Decision', 'Get My PMP 2026 Roadmap', '/certifications/pmp', 'Planned', 'Mahaa', ''],
  ['Week 3', '2026-07-08', 'answer page', 'How do I know if I am ready for PMP?', '/answers/what-is-pmp-readiness', 'PMP readiness', 'Decision', 'Get My PMP 2026 Roadmap', '/certifications/pmp', 'Implemented', 'Mahaa', ''],
  ['Week 3', '2026-07-09', 'corporate brief', 'PMP 2026 readiness for teams', '/pm-service', 'corporate PMP readiness', 'Commercial', 'Talk to a Mentor', '/certifications/pmp', 'Planned', 'Mahaa', ''],
  ['Week 3', '2026-07-10', 'LinkedIn post', 'PMOs should plan PMP cohorts before exam transition', '/pm-service', 'corporate PMP 2026', 'Awareness', 'Talk to a Mentor', '/certifications/pmp', 'Planned', 'Mahaa', ''],
  ['Week 4', '2026-07-14', 'Regional section', 'PMP for GCC professionals', 'TBD', 'PMP for GCC', 'Regional', 'Get My PMP 2026 Roadmap', '/certifications/pmp', 'Planned', 'Owner', 'Dedicated landing TBD'],
  ['Week 4', '2026-07-15', 'Regional section', 'PMP for South Asia career mobility', 'TBD', 'PMP South Asia GCC', 'Regional', 'Get My PMP 2026 Roadmap', '/certifications/pmp', 'Planned', 'Owner', 'Dedicated landing TBD'],
  ['Week 4', '2026-07-16', 'comparison page', 'PMP vs PRINCE2', '/certifications/compare', 'PMP vs PRINCE2', 'Comparison', 'Compare Certification Pathways', '/certifications/pmp', 'Planned', 'Mahaa', ''],
  ['Week 4', '2026-07-17', 'FAQ expansion', 'Exam fee refund support independent disclaimer', '/faq', 'PMP exam fee refund', 'Trust', 'Get My PMP 2026 Roadmap', '/legal/pricing-disclaimers', 'In progress', 'Mahaa', ''],
];
for (const r of seed) cal.push(row(...r));

// Expand to 90 days with priority topics
const extraTopics = [
  ['PMP for engineers', 'Planned', 'Content calendar'],
  ['Mock exam readiness', '/pmp-mock-exam', 'Implemented'],
  ['Common PMP mistakes', 'Planned', 'Newsletter or answer'],
  ['PMP vs PMI-RMP', '/certifications/compare', 'Planned'],
  ['Corporate PMP readiness', '/pm-service', 'Planned'],
  ['PMP study plan 2026', '/pmp-study-plan-2026', 'Implemented'],
  ['Training hours guidance', '/faq', 'In progress'],
  ['Current vs updated exam decision', '/pmp-current-vs-new-exam', 'Implemented'],
  ['Short video: roadmap CTA', '/certifications/pmp', 'Planned'],
  ['Carousel: 2026 timeline', '/pmp-exam-timeline-2026', 'Planned'],
  ['Case note: readiness structure', '/certifications/pmp', 'Planned'],
  ['Newsletter: PMP 2026 transition', '/newsletter/2026-pmp-exam-changes', 'Implemented'],
];
let weekNum = 5;
for (let i = 0; i < extraTopics.length; i++) {
  const [title, url, status] = extraTopics[i];
  const w = `Week ${weekNum + Math.floor(i / 3)}`;
  cal.push(
    row(
      w,
      'TBD',
      i % 3 === 0 ? 'answer page' : i % 3 === 1 ? 'newsletter' : 'social',
      title,
      url,
      title.toLowerCase(),
      'Informational',
      'Get My PMP 2026 Roadmap',
      '/certifications/pmp; /topics/pmp-exam-2026',
      status,
      'Mahaa',
      '90-day expansion — see pmstructure-90-day-marketing-schedule.csv for channel ops',
    ),
  );
}
fs.writeFileSync(path.join(docsInternal, 'pmstructure-90-day-content-calendar.csv'), `${cal.join('\n')}\n`);

console.log('B11 CSVs generated:', {
  inventory: inv.length - 1,
  sourceReview: srcRows.length - 1,
  answerLibrary: lib.length - 1,
  calendar: cal.length - 1,
});
