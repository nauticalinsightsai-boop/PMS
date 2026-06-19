/**
 * B13 reporting/QA audit (read-only).
 * Usage: npm run audit:reporting-qa
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const docsInternal = path.join(root, 'docs/internal');

const B13_DOCS = [
  'PMSTRUCTURE_REPORTING_QA_SYSTEM.md',
  'PMSTRUCTURE_WEEKLY_REPORT_TEMPLATE.md',
  'pmstructure-weekly-seo-dashboard.csv',
  'pmstructure-result-scan-links.csv',
  'pmstructure-monthly-technical-audit.csv',
  'pmstructure-qa-signoff-register.csv',
];

const EXPECTED_HEADERS = {
  'pmstructure-weekly-seo-dashboard.csv':
    'Week_Start,Week_End,Report_Date,Organic_Clicks,Organic_Impressions,Average_CTR,Average_Position,Users,Sessions,Organic_Sessions,PMP_Page_Views,Topic_Guide_Views,Answer_Page_Views,FAQ_Views,Roadmap_CTA_Clicks,Roadmap_Form_Starts,Lead_Submissions,Booking_Clicks,Contact_Clicks,Qualified_Leads,Paid_Learners,Top_Query,Top_Page,Main_Win,Main_Drop,Issues_Found,Next_Actions,Owner,Status,Notes',
  'pmstructure-result-scan-links.csv':
    'Scan_ID,Scan_Type,Tool,URL_or_File_Link,Scan_Date,Scope,Status,Main_Findings,Owner,Next_Action,Notes',
  'pmstructure-monthly-technical-audit.csv':
    'Audit_Month,Audit_Date,Area,Check,Result,Severity,Affected_URL,Evidence_Link,Recommended_Action,Owner,Due_Date,Status,Notes',
  'pmstructure-qa-signoff-register.csv':
    'Batch_ID,Batch_Name,Ask_Inventory_Status,Plan_Status,Agent_Status,Files_Changed,Build_Result,Lint_Result,Typecheck_Result,Manual_QA_Status,Deployment_Status,Post_Deploy_Check_Status,Owner_Approval,Open_Risks,Next_Action,Status,Notes',
};

const MIN_ROWS = {
  'pmstructure-result-scan-links.csv': 5,
  'pmstructure-monthly-technical-audit.csv': 5,
  'pmstructure-qa-signoff-register.csv': 11,
};

let failed = false;

function fail(msg) {
  console.error(`audit-reporting-qa FAIL: ${msg}`);
  failed = true;
}

console.log('audit-reporting-qa: B13 artifacts\n');

for (const name of B13_DOCS) {
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
  const lines = fs.readFileSync(p, 'utf8').trim().split('\n');
  const firstLine = lines[0].replace(/\r$/, '');
  if (firstLine !== header) {
    fail(`${file} header mismatch`);
  } else {
    const rowCount = lines.length - 1;
    const min = MIN_ROWS[file] ?? 1;
    if (rowCount < min) {
      fail(`${file} expected at least ${min} data rows, found ${rowCount}`);
    } else {
      console.log(`  OK  ${file} (${rowCount} rows)`);
    }
  }
}

const dashboardPath = path.join(docsInternal, 'pmstructure-weekly-seo-dashboard.csv');
if (fs.existsSync(dashboardPath)) {
  const rows = fs.readFileSync(dashboardPath, 'utf8').trim().split('\n').slice(1);
  const templateRows = rows.filter((r) => r.includes('Pending data'));
  const suspicious = rows.filter(
    (r) => !r.includes('Pending data') && !r.includes('TBD') && r.split(',').some((c) => /^\d+$/.test(c.trim())),
  );
  if (templateRows.length < 1) {
    fail('weekly dashboard missing Pending data template row');
  }
  if (suspicious.length > 0) {
    fail('weekly dashboard contains numeric rows that may be invented metrics (use TBD until owner export)');
  }
}

const systemDoc = fs.readFileSync(
  path.join(docsInternal, 'PMSTRUCTURE_REPORTING_QA_SYSTEM.md'),
  'utf8',
);
for (const link of [
  'PMSTRUCTURE_GA4_GSC_REPORTING_QA.md',
  'PMSTRUCTURE_CRAWL_INDEXATION_CONTROL.md',
  'PMSTRUCTURE_REDIRECT_URL_CANONICALIZATION.md',
  'PMSTRUCTURE_PERFORMANCE_SYSTEM.md',
  'PMSTRUCTURE_COMPETITOR_BENCHMARK.md',
  'PMSTRUCTURE_CONTENT_ENGINE.md',
  'PMSTRUCTURE_OFFER_TRUST_SYSTEM.md',
  'pmstructure-offline-conversion-template.csv',
  'pmstructure-owner-validation-register.csv',
]) {
  if (!systemDoc.includes(link)) {
    fail(`REPORTING_QA_SYSTEM.md missing cross-link: ${link}`);
  }
}

const pkg = fs.readFileSync(path.join(root, 'package.json'), 'utf8');
for (const script of ['audit:reporting-qa', 'audit:weekly-seo-health']) {
  if (!pkg.includes(`"${script}"`)) {
    fail(`package.json missing ${script}`);
  }
}

const readme = fs.readFileSync(path.join(docsInternal, 'README.md'), 'utf8');
if (!readme.includes('PMSTRUCTURE_REPORTING_QA_SYSTEM.md') || !readme.includes('audit:reporting-qa')) {
  fail('docs/internal/README.md missing B13 block');
}

if (!fs.existsSync(path.join(root, 'scripts/audit-weekly-seo-health.mjs'))) {
  fail('missing scripts/audit-weekly-seo-health.mjs');
} else {
  console.log('  OK  scripts/audit-weekly-seo-health.mjs');
}

console.log(`\naudit-reporting-qa: ${failed ? 'FAILED' : 'PASSED'}`);
process.exit(failed ? 1 : 0);
