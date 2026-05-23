/**
 * Import PM_Structure_Regional_Availability_Matrix.xlsx → frontend/data/regional-catalogue.json
 *
 * Usage: node scripts/import-regional-matrix.mjs [path-to-xlsx]
 * Env: REGIONAL_MATRIX_XLSX_PATH
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEFAULT_XLSX =
  process.env.REGIONAL_MATRIX_XLSX_PATH ||
  String.raw`i:\My Drive\Sample\PM_Structure_Regional_Availability_Matrix.xlsx`;

const REGION_IDS = ['global', 'europe', 'uk', 'gcc', 'india', 'pakistan'];

const STATUS_MAP = [
  ['available — direct checkout', 'direct_checkout'],
  ['available - direct checkout', 'direct_checkout'],
  ['regional scholarship available — verify eligibility', 'scholarship_verify'],
  ['regional scholarship available - verify eligibility', 'scholarship_verify'],
  ['available — consultation required', 'consultation_required'],
  ['available - consultation required', 'consultation_required'],
  ['regional scholarship unavailable', 'scholarship_unavailable'],
  ['global only', 'global_only'],
  ['waitlist', 'waitlist'],
  ['hidden', 'hidden'],
];

function normalizeKey(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeStatus(raw) {
  const key = normalizeKey(raw);
  if (key.includes('direct checkout')) return 'direct_checkout';
  if (key.includes('scholarship available')) return 'scholarship_verify';
  if (key.includes('consultation required')) return 'consultation_required';
  if (key.includes('scholarship unavailable')) return 'scholarship_unavailable';
  if (key.includes('global only')) return 'global_only';
  if (key.includes('waitlist')) return 'waitlist';
  if (key === 'hidden') return 'hidden';
  throw new Error(`Unknown status: ${raw}`);
}

function normalizeTier(raw) {
  const t = normalizeKey(raw);
  if (t === 'foundation') return 'foundation';
  if (t === 'professional') return 'professional';
  if (t === 'mastery') return 'mastery';
  if (t.includes('mastery / corporate') || t.includes('mastery/ corporate')) return 'mastery_corporate';
  if (t.includes('mastery / advisory') || t.includes('mastery/ advisory')) return 'mastery_advisory';
  throw new Error(`Unknown tier: ${raw}`);
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/®/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function offeringKey(family, course, tier) {
  return `${normalizeKey(family)}|${normalizeKey(course)}|${normalizeKey(tier)}`;
}

/** Parse $1,499 → 149900 cents */
function parseUsdCents(display) {
  if (!display) return null;
  const m = String(display).match(/\$\s*([\d,]+(?:\.\d{2})?)/);
  if (!m) return null;
  const num = parseFloat(m[1].replace(/,/g, ''));
  return Math.round(num * 100);
}

function parseGccPerCountry(gccDisplay) {
  const perCountry = {};
  if (!gccDisplay) return perCountry;
  const parts = String(gccDisplay).split('/');
  const codes = { AED: 'AE', SAR: 'SA', QAR: 'QA', BHD: 'BH', KWD: 'KW', OMR: 'OM' };
  for (const part of parts) {
    const trimmed = part.trim();
    for (const [currency, code] of Object.entries(codes)) {
      if (trimmed.includes(currency)) {
        perCountry[code] = trimmed;
      }
    }
  }
  return perCountry;
}

function sheetToRows(wb, name) {
  const sheet = wb.Sheets[name];
  if (!sheet) throw new Error(`Missing sheet: ${name}`);
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
}

function parseAvailability(rows) {
  const header = rows[0].map((h) => normalizeKey(h));
  const idx = (name) => header.indexOf(normalizeKey(name));

  const offerings = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || !row[idx('course')]) continue;

    const familyRaw = row[idx('family')];
    const family = familyRaw;
    const course = row[idx('course')];
    const tierRaw = row[idx('tier')];
    const tierId = normalizeTier(tierRaw);

    const regional = {};
    const statusCols = [
      ['global', 'global status'],
      ['europe', 'europe status'],
      ['uk', 'uk status'],
      ['gcc', 'gcc status'],
      ['india', 'india status'],
      ['pakistan', 'pakistan status'],
    ];

    for (const [regionId, colName] of statusCols) {
      const statusRaw = row[idx(colName)];
      if (!statusRaw) continue;
      regional[regionId] = {
        status: normalizeStatus(statusRaw),
        primaryCta: row[idx('primary cta')] ?? null,
        secondaryCta: row[idx('secondary cta')] ?? null,
        regionMessage:
          regionId === 'india'
            ? row[idx('india message')] ?? null
            : regionId === 'pakistan'
              ? row[idx('pakistan message')] ?? null
              : null,
      };
    }

    const courseSlug = slugify(course);
    const offeringId = `${courseSlug}-${tierId}`;

    offerings.push({
      offeringId,
      familyId: familyRaw === 'Six Sigma' ? 'SixSigma' : familyRaw,
      familyName: familyRaw,
      courseName: course,
      courseSlug,
      tier: tierRaw,
      tierId,
      length: row[idx('length')] ?? null,
      deliveryMode: row[idx('tier delivery')] ?? null,
      adminNotes: row[idx('admin notes')] ?? null,
      regional,
    });
  }
  return offerings;
}

function parsePricing(rows) {
  const header = rows[0].map((h) => normalizeKey(h));
  const idx = (name) => header.indexOf(normalizeKey(name));
  const map = new Map();

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || !row[idx('course')]) continue;
    const key = offeringKey(row[idx('family')], row[idx('course')], row[idx('tier')]);
    const globalDisplay = row[idx('global usd')];
    const usdCents = parseUsdCents(globalDisplay);
    const gccDisplay = row[idx('gcc display price')];

    map.set(key, {
      global: {
        display: globalDisplay,
        usdCents,
        currencyCode: 'USD',
        isScholarship: false,
      },
      europe: {
        display: row[idx('europe eur')],
        currencyCode: 'EUR',
        isScholarship: false,
      },
      uk: {
        display: row[idx('uk gbp')],
        currencyCode: 'GBP',
        isScholarship: false,
      },
      gcc: {
        display: gccDisplay,
        currencyCode: 'GCC',
        perCountry: parseGccPerCountry(gccDisplay),
        isScholarship: true,
      },
      india: {
        display: row[idx('india regional scholarship')],
        currencyCode: 'INR',
        isScholarship: true,
      },
      pakistan: {
        display: row[idx('pakistan regional scholarship')],
        currencyCode: 'PKR',
        isScholarship: true,
      },
    });
  }
  return map;
}

function parseRegionRules(rows) {
  const regions = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || !row[0]) continue;
    const name = String(row[0]);
    let id = null;
    if (name.includes('Global')) id = 'global';
    else if (name === 'Europe') id = 'europe';
    else if (name === 'UK') id = 'uk';
    else if (name === 'GCC') id = 'gcc';
    else if (name === 'India') id = 'india';
    else if (name === 'Pakistan') id = 'pakistan';
    else if (name.includes('Mastery')) continue;

    if (!id) continue;
    regions.push({
      id,
      label: name,
      defaultPriceDisplay: row[1],
      canChangeRegion: String(row[2] ?? '').toLowerCase() === 'yes',
      mismatchRule: row[3],
      checkoutRule: row[4],
      websiteMessage: row[5],
    });
  }
  return regions;
}

function parseWebsiteCopy(rows) {
  const copy = {};
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || !row[0]) continue;
    const placement = normalizeKey(row[0]).replace(/\s+/g, '_');
    copy[placement] = row[1];
  }
  return copy;
}

function parseOverview(rows) {
  const rules = [];
  let recommendedMessage = null;
  const ruleLabels = [
    'Course creation',
    'Pricing',
    'Foundation',
    'Professional',
    'Mastery',
    'Fallback',
    'Verification',
  ];
  for (const row of rows) {
    if (!row?.[0]) continue;
    if (ruleLabels.includes(row[0]) && row[1]) {
      rules.push({ rule: row[0], decision: row[1] });
    }
    if (String(row[0]).startsWith('Regional pricing is based on')) {
      recommendedMessage = row[0];
    }
  }
  return { rules, recommendedMessage };
}

function main() {
  const xlsxPath = process.argv[2] || DEFAULT_XLSX;
  if (!fs.existsSync(xlsxPath)) {
    console.error(`XLSX not found: ${xlsxPath}`);
    process.exit(1);
  }

  const wb = XLSX.readFile(xlsxPath);
  const availRows = sheetToRows(wb, 'Availability Matrix');
  const priceRows = sheetToRows(wb, 'Pricing Reference');
  const regionRows = sheetToRows(wb, 'Region Rules');
  const copyRows = sheetToRows(wb, 'Website Copy');
  const overviewRows = sheetToRows(wb, 'Overview');

  const offerings = parseAvailability(availRows);
  const priceMap = parsePricing(priceRows);

  for (const offering of offerings) {
    const key = offeringKey(offering.familyName, offering.courseName, offering.tier);
    const prices = priceMap.get(key);
    if (!prices) {
      throw new Error(`No pricing row for: ${offering.courseName} / ${offering.tier}`);
    }
    offering.prices = prices;
    // Scholarship regions use global usdCents at checkout (§K decision 2)
    for (const rid of ['india', 'pakistan', 'gcc']) {
      if (offering.prices[rid]) {
        offering.prices[rid].usdCents = offering.prices.global.usdCents;
      }
    }
    for (const rid of ['europe', 'uk']) {
      if (offering.prices[rid]) {
        offering.prices[rid].usdCents = offering.prices.global.usdCents;
      }
    }
  }

  const catalogue = {
    meta: {
      version: 1,
      importedAt: new Date().toISOString(),
      sourceFile: path.basename(xlsxPath),
      offeringCount: offerings.length,
      businessRules: {
        membershipDiscount: 'TBD — do not stack on scholarship until confirmed',
        gccCheckoutUsdCents: 'single global usdCents per offering',
        consultationApproval: 'manual dashboard before mastery checkout',
      },
      overview: parseOverview(overviewRows),
    },
    regions: parseRegionRules(regionRows),
    regionIds: REGION_IDS,
    websiteCopy: parseWebsiteCopy(copyRows),
    offerings,
  };

  const outPath = path.join(ROOT, 'frontend', 'data', 'regional-catalogue.json');
  const reportPath = path.join(ROOT, 'frontend', 'data', 'regional-catalogue-import-report.txt');

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(catalogue, null, 2), 'utf8');

  const lines = [
    `Import OK: ${offerings.length} offerings`,
    `Output: ${outPath}`,
    `Source: ${xlsxPath}`,
    '',
    'Offering IDs:',
    ...offerings.map((o, i) => `${i + 1}. ${o.offeringId} (${o.familyId} | ${o.courseName} | ${o.tierId})`),
  ];
  fs.writeFileSync(reportPath, lines.join('\n'), 'utf8');

  console.log(lines.join('\n'));

  if (offerings.length !== 55) {
    console.error(`WARNING: expected 55 offerings, got ${offerings.length}`);
    process.exit(1);
  }
}

main();
