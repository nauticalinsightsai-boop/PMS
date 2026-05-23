/**
 * CLI spot-check: India PMP Professional regional + membership display.
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogue = JSON.parse(
  readFileSync(path.join(root, 'frontend/data/regional-catalogue.json'), 'utf8')
);

const MEMBERSHIP_RATE = 0.2;

function applyMembershipDiscountDisplay(display) {
  if (!display) return null;
  const trimmed = display.trim();
  const match = trimmed.match(/^(.*?)([\d][\d,]*(?:\.\d{1,2})?)(.*)$/);
  if (!match) return null;
  const [, prefix, numStr, suffix] = match;
  const value = parseFloat(numStr.replace(/,/g, ''));
  if (Number.isNaN(value)) return null;
  const discounted = Math.round(value * (1 - MEMBERSHIP_RATE));
  return `${prefix}${discounted.toLocaleString('en-US')}${suffix}`.trim();
}

const offering = catalogue.offerings.find((o) => o.offeringId === 'pmp-preparation-professional');
if (!offering) {
  console.error('Offering pmp-preparation-professional not found');
  process.exit(1);
}

const globalDisplay = offering.prices.global.display;
const active = offering.prices.india.display;
const membership = applyMembershipDiscountDisplay(active);

console.log('India PMP Professional — expected on /certifications/pmp');
console.log('  Original price:             ', globalDisplay);
console.log('  Regional Scholarship:       ', active);
console.log('  Membership price (20% off):', membership);

const pass = membership === '₹35,999' && active === '₹44,999';
console.log('');
console.log(pass ? 'PASS (catalogue + discount math)' : 'FAIL — check values');
process.exit(pass ? 0 : 1);
