/**
 * Validates frontend/data/regional-catalogue.json (55 offerings, required fields).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JSON_PATH = path.join(__dirname, '..', 'frontend', 'data', 'regional-catalogue.json');

const REQUIRED_REGIONS = ['global', 'europe', 'uk', 'gcc', 'india', 'pakistan'];
const EXPECTED_COUNT = 55;

const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const errors = [];

if (!data.offerings || data.offerings.length !== EXPECTED_COUNT) {
  errors.push(`Expected ${EXPECTED_COUNT} offerings, got ${data.offerings?.length ?? 0}`);
}

for (const o of data.offerings ?? []) {
  if (!o.offeringId) errors.push('Missing offeringId');
  if (!o.prices?.global?.usdCents) errors.push(`${o.offeringId}: missing global usdCents`);
  for (const r of REQUIRED_REGIONS) {
    if (!o.regional?.[r]?.status) errors.push(`${o.offeringId}: missing regional.${r}.status`);
    if (!o.prices?.[r]?.display) errors.push(`${o.offeringId}: missing prices.${r}.display`);
  }
}

if (errors.length) {
  console.error('Validation FAILED:\n' + errors.slice(0, 20).join('\n'));
  if (errors.length > 20) console.error(`... and ${errors.length - 20} more`);
  process.exit(1);
}

console.log(`Validation OK: ${data.offerings.length} offerings, regions seeded: ${data.regions?.length ?? 0}`);
