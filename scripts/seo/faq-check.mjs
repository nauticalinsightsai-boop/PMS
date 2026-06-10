/**
 * FAQ count and PMP 2026 cluster validation.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const frontend = path.join(root, 'frontend');

const faqData = fs.readFileSync(path.join(frontend, 'content/faq/data.ts'), 'utf8');
const pmpFaqs = fs.readFileSync(path.join(frontend, 'content/faq/pmp-2026-faqs.ts'), 'utf8');
const hubSections = fs.readFileSync(path.join(frontend, 'content/faq/hub-sections.ts'), 'utf8');
const pmpFaqJson = JSON.parse(
  fs.readFileSync(path.join(frontend, 'public/pmp-faq.json'), 'utf8'),
);

const pmp2026Count = (pmpFaqs.match(/id: 'pmp26-/g) || []).length;
const hubHasPmp = hubSections.includes('pmp-2026') && hubSections.includes('pmp2026');

let failed = false;

if (pmp2026Count < 75) {
  console.error(`faq-check FAIL: expected >= 75 PMP 2026 FAQs, found ${pmp2026Count}`);
  failed = true;
}

if (!hubHasPmp) {
  console.error('faq-check FAIL: /faq missing pmp-2026 hub section');
  failed = true;
}

if (!pmpFaqJson.count || pmpFaqJson.count < 75) {
  console.error(`faq-check FAIL: pmp-faq.json count too low (${pmpFaqJson.count})`);
  failed = true;
}

const baseCount = (faqData.match(/\bP\(/g) || []).length;
const pmpHelperCount = (pmpFaqs.match(/\bpmp\(/g) || []).length;
const totalApprox = baseCount + pmpHelperCount;
if (totalApprox < 130) {
  console.error(`faq-check FAIL: total FAQ entries low (${totalApprox}, base=${baseCount}, pmp=${pmpHelperCount})`);
  failed = true;
}

if (failed) process.exit(1);
console.log(`faq-check OK (${pmp2026Count} pmp2026 FAQs, ~${totalApprox} total)`);
