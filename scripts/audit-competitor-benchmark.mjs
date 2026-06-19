/**
 * B10 competitor benchmark audit (read-only).
 * Verifies governance docs and CSV headers exist.
 * Usage: npm run audit:competitor-benchmark
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const docsInternal = path.join(root, 'docs/internal');

const B10_DOCS = [
  'PMSTRUCTURE_COMPETITOR_BENCHMARK.md',
  'pmstructure-competitor-benchmark.csv',
  'pmstructure-competitor-metrics.csv',
  'pmstructure-keyword-gap-benchmark.csv',
  'pmstructure-offer-comparison-benchmark.csv',
  'pmstructure-claims-risk-benchmark.csv',
];

const EXPECTED_HEADERS = {
  'pmstructure-competitor-benchmark.csv':
    'Competitor_ID,Brand,URL,Source_Type,Page_Type,Primary_Offer,Primary_Audience,Primary_CTA,Main_Promise,Trust_Signals,Delivery_Format,Pricing_Visibility,Certification_Body_Relationship,FAQ_Coverage,Schema_Visible,Title_H1_Notes,Content_Depth,Strengths,Weaknesses,PMStructure_Opportunity,Claims_To_Avoid,Data_Source,Confidence,Notes',
  'pmstructure-competitor-metrics.csv':
    'Competitor_ID,URL,Estimated_Traffic,Ranking_Keywords,Backlinks,Referring_Domains,Authority_Metric,Keyword_Volume_Primary,Keyword_Difficulty_Primary,SERP_Features,PageSpeed_Mobile,PageSpeed_Desktop,Indexed_Status,Data_Tool,Data_Date,Confidence,Notes',
  'pmstructure-keyword-gap-benchmark.csv':
    'Keyword_or_Topic,Intent,Region,Current_PMStructure_Target_URL,Competitor_URLs_Covering_It,PMStructure_Status,Content_Gap,Commercial_Value,Priority,Recommended_Action,Notes',
  'pmstructure-offer-comparison-benchmark.csv':
    'Brand,URL,Offer_Type,Delivery_Format,Duration,Support_Model,Practice_Questions,Mock_Exams,Mentor_Access,Community_Access,Corporate_Option,Pricing,Guarantee,Refund,Proof_Signals,Primary_CTA,PMStructure_Response,Confidence,Notes',
  'pmstructure-claims-risk-benchmark.csv':
    'Claim_or_Phrase,Seen_On_Competitor,Competitor_URL,Claim_Type,Risk_Level,Can_PMStructure_Use,Safer_PMStructure_Wording,Reason,Owner_Approval,Notes',
};

const MIN_ROWS = {
  'pmstructure-competitor-benchmark.csv': 10,
  'pmstructure-competitor-metrics.csv': 5,
  'pmstructure-keyword-gap-benchmark.csv': 18,
  'pmstructure-offer-comparison-benchmark.csv': 5,
  'pmstructure-claims-risk-benchmark.csv': 10,
};

let failed = false;

function fail(msg) {
  console.error(`audit-competitor-benchmark FAIL: ${msg}`);
  failed = true;
}

console.log('audit-competitor-benchmark: B10 artifacts\n');

for (const name of B10_DOCS) {
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

const metrics = fs.readFileSync(path.join(docsInternal, 'pmstructure-competitor-metrics.csv'), 'utf8');
if (!metrics.includes('URL 2') && !metrics.includes('PMTRAINING')) {
  fail('metrics CSV missing URL 2 / PMTraining mapping note');
}
if (metrics.includes('TBD — requires tool export')) {
  console.log('  NOTE metrics CSV correctly uses TBD for tool exports');
}

console.log(`\naudit-competitor-benchmark: ${failed ? 'FAILED' : 'PASSED'}`);
process.exit(failed ? 1 : 0);
