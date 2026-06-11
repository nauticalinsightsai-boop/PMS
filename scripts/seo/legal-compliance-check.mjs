/**
 * Run 16: legal routes, footer links, PMP compliance phrase scan.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const frontend = path.join(root, 'frontend');

let failed = false;

function fail(msg) {
  console.error(`legal-compliance-check FAIL: ${msg}`);
  failed = true;
}

const plan = path.join(root, 'docs/PMSTRUCTURE_LEGAL_COMPLIANCE_MAP.md');
if (!fs.existsSync(plan)) {
  fail('missing docs/PMSTRUCTURE_LEGAL_COMPLIANCE_MAP.md');
}

const registry = fs.readFileSync(path.join(frontend, 'content/legal/registry.ts'), 'utf8');
const dynamicBlock = registry.match(/DYNAMIC_LEGAL_SLUGS = \[([\s\S]*?)\]/)?.[1] ?? '';
const dynamicCount = (dynamicBlock.match(/'[^']+'/g) || []).length;
if (dynamicCount < 12) {
  fail(`expected >= 12 dynamic legal slugs, found ${dynamicCount}`);
}

const pricing = fs.readFileSync(path.join(frontend, 'content/legal/pricing-disclaimers.ts'), 'utf8');
if (!pricing.includes('independent-platform')) {
  fail('pricing-disclaimers missing independent-platform section');
}
if (!pricing.includes('fair use')) {
  fail('pricing-disclaimers missing trademark fair-use language');
}

const footer = fs.readFileSync(path.join(frontend, 'components/Footer.tsx'), 'utf8');
if (!footer.includes('FOOTER_LEGAL_LINKS')) {
  fail('Footer.tsx does not render FOOTER_LEGAL_LINKS');
}

const footerConstants = fs.readFileSync(path.join(frontend, 'constants/legal.ts'), 'utf8');
if (!footerConstants.includes('pricing-disclaimers')) {
  fail('FOOTER_LEGAL_LINKS missing pricing-disclaimers');
}

const PMP_BANNED = [
  'guaranteed to pass',
  'guarantee your pass',
  'we are a pmi authorized training partner',
  'we are an official pmi atp',
  'official pmi authorized training partner',
];

function scanDir(relDir) {
  const dir = path.join(frontend, relDir);
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir, { recursive: true })) {
    const name = String(file);
    if (!name.endsWith('.ts') && !name.endsWith('.tsx')) continue;
    const src = fs.readFileSync(path.join(dir, name), 'utf8').toLowerCase();
    for (const phrase of PMP_BANNED) {
      if (src.includes(phrase)) {
        fail(`banned phrase "${phrase}" in ${relDir}/${name}`);
      }
    }
  }
}

scanDir('content/pmp');
scanDir('content/answers');

const disclaimer = fs.readFileSync(path.join(frontend, 'content/pmp/disclaimer.ts'), 'utf8');
if (!disclaimer.includes('not a PMI Authorized Training Partner')) {
  fail('PMP_INDEPENDENT_DISCLAIMER missing ATP negation');
}

const terms = fs.readFileSync(path.join(frontend, 'content/legal/terms.ts'), 'utf8');
if (!terms.includes('Payments & refunds')) {
  fail('terms.ts missing payment terms section');
}

if (failed) process.exit(1);
console.log('legal-compliance-check OK');