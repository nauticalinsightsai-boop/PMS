/**
 * One-shot catalogue rewrite for enrollment delivery pricing.
 * Run: node scripts/rebuild-delivery-pricing-catalogue.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cataloguePath = path.join(__dirname, '../frontend/data/regional-catalogue.json');

const FX = {
  AED: 3.6725,
  SAR: 3.75,
  QAR: 3.64,
  BHD: 0.376,
  KWD: 0.307,
  OMR: 0.385,
  PKR: 278,
  INR: 83,
  EUR: 0.92,
  GBP: 0.79,
};

const GCC = ['AE', 'SA', 'QA', 'BH', 'KW', 'OM'];
const GCC_CUR = { AE: 'AED', SA: 'SAR', QA: 'QAR', BH: 'BHD', KW: 'KWD', OM: 'OMR' };
const REGIONS = ['global', 'europe', 'uk', 'gcc', 'india', 'pakistan'];

function nearestCharm50(n) {
  if (!Number.isFinite(n) || n <= 49) return 49;
  const k = Math.round((n - 49) / 50);
  return Math.max(49, k * 50 + 49);
}

function ceilCharm50(n) {
  if (!Number.isFinite(n) || n <= 49) return 49;
  const k = Math.ceil((n - 49) / 50);
  return Math.max(49, k * 50 + 49);
}

/** Smallest amount ending in 99 that is >= n (GCC). */
function ceilCharm99(n) {
  if (!Number.isFinite(n) || n <= 99) return 99;
  return Math.ceil((n + 1) / 100) * 100 - 1;
}

function charm999(n) {
  if (!Number.isFinite(n) || n <= 999) return 999;
  return Math.ceil((n + 1) / 1000) * 1000 - 1;
}

function deriveFoundationUsd(u) {
  return nearestCharm50(u * 0.3);
}
function deriveSelfPacedUsd(u) {
  return nearestCharm50(u * 0.5);
}

function payFraction(tierId, regionId) {
  if (tierId === 'foundation') return 1;
  if (regionId === 'india' || regionId === 'pakistan') return 0.7;
  if (regionId === 'gcc') return 0.8;
  return 1;
}

function formatMajor(amount, code) {
  const formatted = Math.round(amount).toLocaleString('en-US');
  if (code === 'USD') return `$${formatted}`;
  if (code === 'EUR') return `€${formatted}`;
  if (code === 'GBP') return `£${formatted}`;
  if (code === 'INR') return `₹${formatted}`;
  return `${code} ${formatted}`;
}

function majorFor(usd, regionId, tierId, gccCountry) {
  const pay = payFraction(tierId, regionId);
  if (regionId === 'global') return { major: nearestCharm50(usd), code: 'USD' };
  if (regionId === 'europe') return { major: ceilCharm50(usd * FX.EUR * pay), code: 'EUR' };
  if (regionId === 'uk') return { major: ceilCharm50(usd * FX.GBP * pay), code: 'GBP' };
  if (regionId === 'india') return { major: charm999(usd * FX.INR * pay), code: 'INR' };
  if (regionId === 'pakistan') return { major: charm999(usd * FX.PKR * pay), code: 'PKR' };
  const code = GCC_CUR[gccCountry || 'AE'];
  return { major: ceilCharm99(usd * FX[code] * pay), code };
}

function buildPrices(usd, tierId) {
  const usdCents = Math.round(usd * 100);
  const out = {};
  for (const regionId of REGIONS) {
    const isScholarship =
      tierId !== 'foundation' &&
      (regionId === 'india' || regionId === 'pakistan' || regionId === 'gcc');
    if (regionId === 'gcc') {
      const perCountry = {};
      for (const c of GCC) {
        const { major, code } = majorFor(usd, 'gcc', tierId, c);
        perCountry[c] = formatMajor(major, code);
      }
      out.gcc = {
        display: GCC.map((c) => perCountry[c]).join(' / '),
        usdCents,
        currencyCode: 'GCC',
        isScholarship,
        perCountry,
      };
      continue;
    }
    const { major, code } = majorFor(usd, regionId, tierId);
    out[regionId] = {
      display: formatMajor(major, code),
      usdCents,
      currencyCode: code,
      isScholarship,
    };
  }
  return out;
}

function globalUsdFromOffering(o) {
  const cents = o.prices?.global?.usdCents;
  if (typeof cents === 'number' && cents > 0) return cents / 100;
  const d = o.prices?.global?.display || '';
  const m = d.match(/([\d][\d,]*(?:\.\d+)?)/);
  if (!m) throw new Error(`No global USD for ${o.offeringId}`);
  return parseFloat(m[1].replace(/,/g, ''));
}

const catalogue = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));
let foundationCount = 0;
let professionalCount = 0;
let masterySkipped = 0;

for (const o of catalogue.offerings) {
  if (o.tierId === 'foundation') {
    const oldUsd = globalUsdFromOffering(o);
    const usd = deriveFoundationUsd(oldUsd);
    o.prices = buildPrices(usd, 'foundation');
    delete o.pricesSelfPaced;
    foundationCount += 1;
    continue;
  }
  if (o.tierId === 'professional') {
    const mentorUsd = globalUsdFromOffering(o);
    const selfUsd = deriveSelfPacedUsd(mentorUsd);
    o.prices = buildPrices(mentorUsd, 'professional');
    o.pricesSelfPaced = buildPrices(selfUsd, 'professional');
    professionalCount += 1;
    continue;
  }
  masterySkipped += 1;
}

catalogue.meta = {
  ...catalogue.meta,
  deliveryPricingRebuildAt: new Date().toISOString(),
  deliveryPricingNote:
    'Foundation: 30% Global + FX no scholarship. Professional mentor full Global; self-paced 50%; IN/PK 30% off; GCC 20% off.',
};

fs.writeFileSync(cataloguePath, `${JSON.stringify(catalogue, null, 2)}\n`, 'utf8');
const packageCopyPath = path.join(__dirname, '../packages/regional-catalogue/regional-catalogue.json');
fs.writeFileSync(packageCopyPath, `${JSON.stringify(catalogue, null, 2)}\n`, 'utf8');
console.log(
  JSON.stringify(
    { foundationCount, professionalCount, masterySkipped, path: cataloguePath, packageCopyPath },
    null,
    2,
  ),
);
