/**
 * B12 offer/trust audit (read-only).
 * Usage: npm run audit:offer-trust
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const docsInternal = path.join(root, 'docs/internal');

const B12_DOCS = [
  'PMSTRUCTURE_OFFER_TRUST_SYSTEM.md',
  'PMSTRUCTURE_CORPORATE_COHORT_BRIEF.md',
  'pmstructure-cta-inventory.csv',
  'pmstructure-offer-package-matrix.csv',
  'pmstructure-testimonial-verification.csv',
  'pmstructure-community-platform-decision.csv',
  'pmstructure-regional-positioning-rules.csv',
  'pmstructure-scholarship-rules.csv',
];

const EXPECTED_HEADERS = {
  'pmstructure-cta-inventory.csv':
    'URL,Route,Page_Type,Current_Primary_CTA,Current_Secondary_CTA,Recommended_Primary_CTA,Recommended_Secondary_CTA,Above_Fold_Status,Issue,Recommended_Action,Implementation_Status,Notes',
  'pmstructure-offer-package-matrix.csv':
    'Package_Name,Status,Target_User,Problem_Solved,Deliverables,Delivery_Format,Support_Level,Community_Access,Pricing_Status,Primary_CTA,Owner_Approval,Implementation_Status,Notes',
  'pmstructure-testimonial-verification.csv':
    'Testimonial_ID,Current_Text,Display_Name,Role_or_Context,Source,Permission_Status,Verification_Status,Public_Display_Status,Recommended_Label,Risk_Level,Owner_Action,Notes',
  'pmstructure-community-platform-decision.csv':
    'Platform,Detected_Mentions,Detected_URLs,Current_Status,Recommended_Status,Risk,Owner_Decision,Implementation_Status,Notes',
  'pmstructure-regional-positioning-rules.csv':
    'Region,Positioning_Rule,Approved_Language,Avoid_Language,Offer_Implication,Pricing_Implication,Owner_Approval,Implementation_Status,Notes',
  'pmstructure-scholarship-rules.csv':
    'Scholarship_Name,Eligibility,Applicable_Package,Discount_or_Benefit,Seat_Limit,Valid_Dates,Approval_Process,Can_Combine,Public_Copy_Status,Owner_Approval,Implementation_Status,Notes',
};

const MIN_ROWS = {
  'pmstructure-testimonial-verification.csv': 18,
};

let failed = false;

function fail(msg) {
  console.error(`audit-offer-trust FAIL: ${msg}`);
  failed = true;
}

console.log('audit-offer-trust: B12 artifacts\n');

for (const name of B12_DOCS) {
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
  } else {
    const rowCount = fs.readFileSync(p, 'utf8').trim().split('\n').length - 1;
    const min = MIN_ROWS[file] ?? 1;
    if (rowCount < min) {
      fail(`${file} expected at least ${min} data rows, found ${rowCount}`);
    } else {
      console.log(`  OK  ${file} (${rowCount} rows)`);
    }
  }
}

const brandVoice = fs.readFileSync(path.join(root, 'frontend/lib/brand-voice.ts'), 'utf8');
for (const constant of [
  'talkToAMentor',
  'pmp2026Roadmap',
  'requestCorporateCohortBrief',
  'previewPathway',
]) {
  if (!brandVoice.includes(constant)) {
    fail(`brand-voice.ts missing CTAS.${constant}`);
  }
}
if (!brandVoice.includes("'Talk to a Mentor'")) {
  fail('brand-voice.ts missing canonical Talk to a Mentor label');
}

const regionalCatalogue = fs.readFileSync(
  path.join(root, 'frontend/data/regional-catalogue.json'),
  'utf8',
);
if (/Talk to your mentor/i.test(regionalCatalogue) || /Talk to Mentor[^a]/i.test(regionalCatalogue)) {
  fail('regional-catalogue.json contains non-canonical mentor CTA labels');
}

const store = fs.readFileSync(path.join(root, 'frontend/components/pages/Store.tsx'), 'utf8');
if (/Buy Now/i.test(store)) {
  fail('Store.tsx contains Buy Now');
}
if (store.includes('rating ?? 4.5')) {
  fail('Store.tsx still defaults star rating to 4.5');
}

const contentDir = path.join(root, 'frontend/content');
function walkTs(dir) {
  let hits = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) hits = hits.concat(walkTs(full));
    else if (ent.name.endsWith('.ts') || ent.name.endsWith('.tsx')) hits.push(full);
  }
  return hits;
}
const CONTENT_35_PDU_ALLOWLIST = [
  'frontend/content/faq/pmp-2026-faqs.ts',
  'frontend/content/t176-claims.ts',
];

for (const file of walkTs(contentDir)) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  if (CONTENT_35_PDU_ALLOWLIST.includes(rel)) continue;
  const text = fs.readFileSync(file, 'utf8');
  if (/\b35 PDUs\b/i.test(text)) {
    fail(`${rel} contains 35 PDUs eligibility wording`);
  }
}

const offerTrust = fs.readFileSync(
  path.join(docsInternal, 'PMSTRUCTURE_OFFER_TRUST_SYSTEM.md'),
  'utf8',
);
for (const link of [
  'PMSTRUCTURE_PMP_2026_FACT_LOCK.md',
  'pmstructure-offer-comparison-benchmark.csv',
  'pmstructure-legal-disclaimer-review.csv',
  'FounderTrustBlock.tsx',
]) {
  if (!offerTrust.includes(link)) {
    fail(`OFFER_TRUST_SYSTEM.md missing cross-link: ${link}`);
  }
}

if (!fs.existsSync(path.join(root, 'frontend/components/trust/FounderTrustBlock.tsx'))) {
  fail('missing frontend/components/trust/FounderTrustBlock.tsx');
} else {
  console.log('  OK  frontend/components/trust/FounderTrustBlock.tsx');
}

console.log(`\naudit-offer-trust: ${failed ? 'FAILED' : 'PASSED'}`);
process.exit(failed ? 1 : 0);
