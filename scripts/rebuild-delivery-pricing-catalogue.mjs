/**
 * Regenerate GCC / India / Pakistan catalogue displays from each offering's Global USD
 * using fee-adjusted regional pay fractions. Leaves Global / Europe / UK untouched.
 * Owner locks in gcc-owner-overrides.json stay as explicit exceptions.
 *
 * Run: node scripts/rebuild-delivery-pricing-catalogue.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cataloguePath = path.join(__dirname, '../frontend/data/regional-catalogue.json');
const ownerOverrides = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../packages/regional-catalogue/gcc-owner-overrides.json'), 'utf8'),
);

const PROCESSING_FEE_FRACTION = 0.0315;
const STATED_GCC_OFF = 0.2;
const STATED_IN_PK_OFF = 0.3;

function payFractionFromStatedOff(statedOff) {
  if (!Number.isFinite(statedOff) || statedOff <= 0) return 1;
  return 1 - Math.max(0, statedOff - PROCESSING_FEE_FRACTION);
}

function payFraction(tierId, regionId) {
  if (tierId === 'foundation') return 1;
  if (regionId === 'india' || regionId === 'pakistan') return payFractionFromStatedOff(STATED_IN_PK_OFF);
  if (regionId === 'gcc') return payFractionFromStatedOff(STATED_GCC_OFF);
  return 1;
}

const FX = {
  AED: 3.6725,
  SAR: 3.75,
  QAR: 3.64,
  BHD: 0.376,
  KWD: 0.307,
  OMR: 0.385,
  PKR: 278,
  INR: 83,
};

const GCC = ['AE', 'SA', 'QA', 'BH', 'KW', 'OM'];
const GCC_CUR = { AE: 'AED', SA: 'SAR', QA: 'QAR', BH: 'BHD', KW: 'KWD', OM: 'OMR' };
const DISCOUNTED_REGIONS = ['gcc', 'india', 'pakistan'];

function ceilCharm99(n) {
  if (!Number.isFinite(n) || n <= 99) return 99;
  return Math.ceil((n + 1) / 100) * 100 - 1;
}

function charm999(n) {
  if (!Number.isFinite(n) || n <= 999) return 999;
  return Math.ceil((n + 1) / 1000) * 1000 - 1;
}

function formatMajor(amount, code) {
  const formatted = Math.round(amount).toLocaleString('en-US');
  if (code === 'INR') return `₹${formatted}`;
  return `${code} ${formatted}`;
}

function majorFor(usd, regionId, tierId, gccCountry) {
  const pay = payFraction(tierId, regionId);
  if (regionId === 'india') return { major: charm999(usd * FX.INR * pay), code: 'INR' };
  if (regionId === 'pakistan') return { major: charm999(usd * FX.PKR * pay), code: 'PKR' };
  const code = GCC_CUR[gccCountry || 'AE'];
  // Explicit owner locks stay as-authored; derived fallbacks use fee-adjusted pay fraction.
  const override = ownerOverrides[`${tierId}:${usd}:${gccCountry || 'AE'}`];
  return {
    major: typeof override === 'number' ? override : ceilCharm99(usd * FX[code] * pay),
    code,
  };
}

function buildDiscountedRegionPrices(usd, tierId) {
  const usdCents = Math.round(usd * 100);
  const out = {};
  const isScholarship = tierId !== 'foundation';
  for (const regionId of DISCOUNTED_REGIONS) {
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
      currencyCode: code,
      isScholarship,
      usdCents,
    };
  }
  return out;
}

function globalUsdFromPrices(prices) {
  const cents = prices?.global?.usdCents;
  if (typeof cents === 'number' && cents > 0) return cents / 100;
  const d = prices?.global?.display || '';
  const m = d.match(/([\d][\d,]*(?:\.\d+)?)/);
  if (!m) return null;
  return parseFloat(m[1].replace(/,/g, ''));
}

function patchPriceBook(prices, tierId) {
  if (!prices?.global) return false;
  const usd = globalUsdFromPrices(prices);
  if (usd == null || !Number.isFinite(usd) || usd <= 0) return false;
  Object.assign(prices, buildDiscountedRegionPrices(usd, tierId));
  return true;
}

const catalogue = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));
let patched = 0;
let selfPacedPatched = 0;
let skipped = 0;

for (const o of catalogue.offerings) {
  const tierId = o.tierId || 'professional';
  if (patchPriceBook(o.prices, tierId)) patched += 1;
  else skipped += 1;
  if (o.pricesSelfPaced && patchPriceBook(o.pricesSelfPaced, tierId)) {
    selfPacedPatched += 1;
  }
}

const now = new Date().toISOString();
catalogue.meta = {
  ...catalogue.meta,
  deliveryPricingRebuildAt: now,
  deliveryPricingNote:
    'Foundation: 30% Global + FX no scholarship. Professional mentor full Global; self-paced 50%; stated IN/PK 30% / GCC 20% with silent 3.15% processing fee in pay fraction (UI shows stated %). Europe/UK unchanged by this rebuild.',
};

fs.writeFileSync(cataloguePath, `${JSON.stringify(catalogue, null, 2)}\n`, 'utf8');
const packageCopyPath = path.join(__dirname, '../packages/regional-catalogue/regional-catalogue.json');
fs.writeFileSync(packageCopyPath, `${JSON.stringify(catalogue, null, 2)}\n`, 'utf8');
console.log(
  JSON.stringify(
    {
      patched,
      selfPacedPatched,
      skipped,
      payGcc: payFraction('professional', 'gcc'),
      payInPk: payFraction('professional', 'india'),
      path: cataloguePath,
      packageCopyPath,
    },
    null,
    2,
  ),
);
