/**
 * Automated QA spot-check for all 55 offerings × key regions (T10.2).
 * Usage: node scripts/qa-regional-matrix.mjs
 */
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogue = JSON.parse(
  readFileSync(path.join(root, 'frontend/data/regional-catalogue.json'), 'utf8')
);

const REGIONS = ['global', 'europe', 'uk', 'gcc', 'india', 'pakistan'];
const issues = [];

if (catalogue.offerings.length !== 55) {
  issues.push(`Expected 55 offerings, got ${catalogue.offerings.length}`);
}

const pmp = catalogue.offerings.filter((o) => o.courseName === 'PMP Preparation');
const pmpTiers = pmp.map((o) => o.tierId).sort().join(',');
if (!pmpTiers.includes('foundation') || !pmpTiers.includes('professional') || !pmpTiers.includes('mastery')) {
  issues.push(`PMP tiers incomplete: ${pmpTiers}`);
}

const capm = catalogue.offerings.filter((o) => o.courseName === 'CAPM Preparation');
if (capm.length !== 1 || capm[0].tierId !== 'professional') {
  issues.push(`CAPM should be professional only, got ${capm.length} offerings`);
}

const indiaMastery = catalogue.offerings.find((o) => o.offeringId === 'pmp-preparation-mastery');
if (indiaMastery?.regional?.india?.status !== 'scholarship_unavailable') {
  issues.push('India PMP mastery should be scholarship_unavailable');
}

for (const o of catalogue.offerings) {
  for (const r of REGIONS) {
    const price = o.prices?.[r];
    if (!price?.display && o.regional[r]?.status !== 'hidden') {
      issues.push(`Missing display: ${o.offeringId} @ ${r}`);
    }
  }
}

const pro = catalogue.offerings.find((o) => o.offeringId === 'pmp-preparation-professional');
const indiaDisplay = pro?.prices?.india?.display;
const globalCents = pro?.prices?.global?.usdCents;
const gccCents = pro?.prices?.gcc?.usdCents ?? globalCents;
if (gccCents !== globalCents) {
  issues.push('GCC usdCents should match global for PMP pro');
}
if (indiaDisplay !== '₹44,999') {
  issues.push(`India PMP pro display expected ₹44,999, got ${indiaDisplay}`);
}

console.log(`QA regional matrix: ${catalogue.offerings.length} offerings, ${REGIONS.length} regions`);
if (issues.length === 0) {
  console.log('PASS — no issues found');
  process.exit(0);
}
console.log(`FAIL — ${issues.length} issue(s):`);
for (const i of issues.slice(0, 20)) console.log('  -', i);
if (issues.length > 20) console.log(`  ... and ${issues.length - 20} more`);
process.exit(1);
