/**
 * Refresh GCC catalogue display prices only — ceil to …99 (not …49).
 * Derives from each offering's existing Global usdCents (no Foundation re-cut).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cataloguePath = path.join(__dirname, '../frontend/data/regional-catalogue.json');
const packageCopyPath = path.join(__dirname, '../packages/regional-catalogue/regional-catalogue.json');

const FX = {
  AED: 3.6725,
  SAR: 3.75,
  QAR: 3.64,
  BHD: 0.376,
  KWD: 0.307,
  OMR: 0.385,
};
const GCC = ['AE', 'SA', 'QA', 'BH', 'KW', 'OM'];
const GCC_CUR = { AE: 'AED', SA: 'SAR', QA: 'QAR', BH: 'BHD', KW: 'KWD', OM: 'OMR' };

function ceilCharm99(n) {
  if (!Number.isFinite(n) || n <= 99) return 99;
  return Math.ceil((n + 1) / 100) * 100 - 1;
}

function payFraction(tierId) {
  // Foundation: full FX. Professional + Mastery: 20% GCC scholarship.
  if (tierId === 'foundation') return 1;
  return 0.8;
}

function formatMajor(amount, code) {
  const formatted = Math.round(amount).toLocaleString('en-US');
  return `${code} ${formatted}`;
}

function buildGcc(usd, tierId) {
  const usdCents = Math.round(usd * 100);
  const pay = payFraction(tierId);
  const isScholarship = tierId !== 'foundation';
  const perCountry = {};
  for (const c of GCC) {
    const code = GCC_CUR[c];
    const major = ceilCharm99(usd * FX[code] * pay);
    perCountry[c] = formatMajor(major, code);
  }
  return {
    display: GCC.map((c) => perCountry[c]).join(' / '),
    usdCents,
    currencyCode: 'GCC',
    isScholarship,
    perCountry,
  };
}

function usdFromPrices(prices) {
  const cents = prices?.global?.usdCents;
  if (typeof cents === 'number' && cents > 0) return cents / 100;
  return null;
}

const catalogue = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));
let updated = 0;
let skipped = 0;

for (const o of catalogue.offerings) {
  const mentorUsd = usdFromPrices(o.prices);
  if (mentorUsd != null && o.prices?.gcc) {
    o.prices.gcc = buildGcc(mentorUsd, o.tierId);
    updated += 1;
  } else {
    skipped += 1;
  }
  const selfUsd = usdFromPrices(o.pricesSelfPaced);
  if (selfUsd != null && o.pricesSelfPaced?.gcc) {
    o.pricesSelfPaced.gcc = buildGcc(selfUsd, o.tierId);
  }
}

catalogue.meta = {
  ...catalogue.meta,
  gccCharm99RefreshAt: new Date().toISOString(),
  gccCharmNote: 'GCC display majors ceil to …99 only (Asia remains …999).',
};

const json = `${JSON.stringify(catalogue, null, 2)}\n`;
fs.writeFileSync(cataloguePath, json, 'utf8');
fs.writeFileSync(packageCopyPath, json, 'utf8');
console.log(JSON.stringify({ updated, skipped, cataloguePath, packageCopyPath }, null, 2));
