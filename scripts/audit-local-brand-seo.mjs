/**
 * B14 local/brand SEO audit (read-only).
 * Usage: npm run audit:local-brand-seo
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const docsInternal = path.join(root, 'docs/internal');
const frontend = path.join(root, 'frontend');

const B14_DOCS = [
  'PMSTRUCTURE_LOCAL_BRAND_SEO_SYSTEM.md',
  'pmstructure-local-seo-applicability.csv',
  'pmstructure-gbp-readiness-checklist.csv',
  'pmstructure-citation-nap-register.csv',
  'pmstructure-social-link-register.csv',
  'pmstructure-site-search-decision.csv',
];

const EXPECTED_HEADERS = {
  'pmstructure-local-seo-applicability.csv':
    'Task_ID,Area,Applicable,Agent_Action,Status,Owner_Approval,Notes',
  'pmstructure-gbp-readiness-checklist.csv':
    'Check_ID,GBP_Area,Requirement,Status,Owner,Evidence_Link,Notes',
  'pmstructure-citation-nap-register.csv':
    'Citation_ID,Directory,NAP_Name,NAP_Address,NAP_Phone,URL,Status,Owner,Notes',
  'pmstructure-social-link-register.csv':
    'Platform,URL,Surface,Aria_Label,Approved,Owner,Notes',
  'pmstructure-site-search-decision.csv':
    'Decision_ID,Feature,Decision,Rationale,Exclude_Routes,SearchAction_Schema,Owner,Status,Notes',
};

const MIN_ROWS = {
  'pmstructure-local-seo-applicability.csv': 18,
  'pmstructure-gbp-readiness-checklist.csv': 7,
  'pmstructure-citation-nap-register.csv': 1,
  'pmstructure-social-link-register.csv': 9,
  'pmstructure-site-search-decision.csv': 3,
};

const FORBIDDEN_COPY = [
  { pattern: /\bnear me\b/i, label: 'near me' },
  { pattern: /\bwalk-in\b/i, label: 'walk-in' },
  { pattern: /\btraining center\b/i, label: 'training center' },
  { pattern: /\bopen now\b/i, label: 'open now' },
];

const COPY_SCAN_DIRS = [
  path.join(frontend, 'components', 'pages'),
  path.join(frontend, 'components', 'Footer.tsx'),
  path.join(frontend, 'app', '(site)'),
  path.join(frontend, 'config', 'pms-site.ts'),
];

const COPY_ALLOWLIST = [
  'certification-enrollment.ts',
  'pmstructure-regional-route-approval',
];

let failed = false;

function fail(msg) {
  console.error(`audit-local-brand-seo FAIL: ${msg}`);
  failed = true;
}

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    if (/\.(tsx?|jsx?|mdx?)$/.test(dir)) acc.push(dir);
    return acc;
  }
  for (const entry of fs.readdirSync(dir)) {
    walkFiles(path.join(dir, entry), acc);
  }
  return acc;
}

console.log('audit-local-brand-seo: B14 artifacts\n');

for (const name of B14_DOCS) {
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

const systemDoc = fs.readFileSync(
  path.join(docsInternal, 'PMSTRUCTURE_LOCAL_BRAND_SEO_SYSTEM.md'),
  'utf8',
);
for (const link of [
  'PMSTRUCTURE_OFFER_TRUST_SYSTEM.md',
  'PMSTRUCTURE_REPORTING_QA_SYSTEM.md',
  'pmstructure-regional-route-approval.csv',
  'pmstructure-local-seo-applicability.csv',
  'pmstructure-social-link-register.csv',
  'pmstructure-site-search-decision.csv',
]) {
  if (!systemDoc.includes(link)) {
    fail(`LOCAL_BRAND_SEO_SYSTEM.md missing cross-link: ${link}`);
  }
}

const schemaPath = path.join(frontend, 'lib/schema/index.ts');
const schemaSrc = fs.readFileSync(schemaPath, 'utf8');
for (const forbidden of ['LocalBusiness', 'SearchAction', 'openingHours', 'postalAddress']) {
  if (schemaSrc.includes(forbidden)) {
    fail(`schema/index.ts must not include ${forbidden}`);
  } else {
    console.log(`  OK  schema/index.ts no ${forbidden}`);
  }
}

const pmsSitePath = path.join(frontend, 'config/pms-site.ts');
const pmsSite = fs.readFileSync(pmsSitePath, 'utf8');
if (!pmsSite.includes('PMS_REGIONAL_SUPPORT_NOTE')) {
  fail('pms-site.ts missing PMS_REGIONAL_SUPPORT_NOTE');
} else {
  console.log('  OK  pms-site.ts PMS_REGIONAL_SUPPORT_NOTE');
}

if (pmsSite.includes("city: 'Dubai'") || pmsSite.includes("city: 'London'")) {
  fail('pms-site.ts still seeds Dubai/London office locations');
}

const footerSrc = fs.readFileSync(path.join(frontend, 'components/Footer.tsx'), 'utf8');
const contactSrc = fs.readFileSync(path.join(frontend, 'components/pages/Contact.tsx'), 'utf8');
for (const [name, src] of [
  ['Footer.tsx', footerSrc],
  ['Contact.tsx', contactSrc],
]) {
  if (src.includes('PMS_OFFICE_LOCATIONS')) {
    fail(`${name} still references PMS_OFFICE_LOCATIONS`);
  }
  if (!src.includes('PMS_REGIONAL_SUPPORT_NOTE')) {
    fail(`${name} missing PMS_REGIONAL_SUPPORT_NOTE`);
  }
  if (src.includes('>Locations<') || src.includes('"Locations"')) {
    fail(`${name} still uses Locations heading`);
  }
}
console.log('  OK  Footer.tsx + Contact.tsx location-trust fix');

for (const asset of [
  'app/icon.png',
  'app/apple-icon.png',
  'public/brand/pms-icon.png',
  'public/brand/pms-icon-dark.png',
  'public/og/default.png',
]) {
  const p = path.join(frontend, asset);
  if (!fs.existsSync(p)) {
    fail(`missing frontend/${asset}`);
  } else {
    console.log(`  OK  frontend/${asset}`);
  }
}

if (!pmsSite.includes('PMS_FAVICON_PATH') || !pmsSite.includes('PMS_OG_IMAGE_PATH')) {
  fail('pms-site.ts missing favicon/OG path constants');
}

const filesToScan = [];
for (const dir of COPY_SCAN_DIRS) {
  walkFiles(dir, filesToScan);
}
const uniqueFiles = [...new Set(filesToScan)];
for (const file of uniqueFiles) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  if (COPY_ALLOWLIST.some((a) => rel.includes(a))) continue;
  const content = fs.readFileSync(file, 'utf8');
  for (const { pattern, label } of FORBIDDEN_COPY) {
    if (pattern.test(content)) {
      fail(`forbidden copy "${label}" in ${rel}`);
    }
  }
}
console.log('  OK  no forbidden local-office copy patterns in public surfaces');

const pkg = fs.readFileSync(path.join(root, 'package.json'), 'utf8');
if (!pkg.includes('"audit:local-brand-seo"')) {
  fail('package.json missing audit:local-brand-seo');
}

const readme = fs.readFileSync(path.join(docsInternal, 'README.md'), 'utf8');
if (!readme.includes('PMSTRUCTURE_LOCAL_BRAND_SEO_SYSTEM.md') || !readme.includes('audit:local-brand-seo')) {
  fail('docs/internal/README.md missing B14 block');
} else {
  console.log('  OK  docs/internal/README.md B14 block');
}

const offerTrust = fs.readFileSync(
  path.join(docsInternal, 'PMSTRUCTURE_OFFER_TRUST_SYSTEM.md'),
  'utf8',
);
if (!offerTrust.includes('PMSTRUCTURE_LOCAL_BRAND_SEO_SYSTEM.md')) {
  fail('PMSTRUCTURE_OFFER_TRUST_SYSTEM.md missing B14 cross-link');
} else {
  console.log('  OK  PMSTRUCTURE_OFFER_TRUST_SYSTEM.md B14 cross-link');
}

console.log(`\naudit-local-brand-seo: ${failed ? 'FAILED' : 'PASSED'}`);
process.exit(failed ? 1 : 0);
