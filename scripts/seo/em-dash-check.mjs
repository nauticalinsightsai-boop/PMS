/**
 * Fail CI if em dashes remain in user-facing marketing copy.
 * Run: node scripts/seo/em-dash-check.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');

const TARGETS = [
  'frontend/content',
  'frontend/data',
  'frontend/components',
  'frontend/app/(site)',
  'frontend/config',
  'frontend/constants',
  'frontend/lib/brand-voice.ts',
  'frontend/lib/conversion-recovery',
  'frontend/lib/cert-program-offer.ts',
  'frontend/lib/ai-files/builders.ts',
  'frontend/lib/media/build-cta-channels-social-grid.ts',
  'frontend/public/faq.json',
  'frontend/public/pmp-faq.json',
  'frontend/public/topics.json',
  'frontend/public/answers.json',
  'frontend/public/pricing-policy.json',
  'packages/site-content',
];

const EXT = new Set(['.ts', '.tsx', '.json']);

function walk(rel, out) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) return;
  if (fs.statSync(abs).isFile()) {
    if (EXT.has(path.extname(abs)) || rel.endsWith('.json')) out.push(abs);
    return;
  }
  for (const name of fs.readdirSync(abs)) {
    if (name === 'node_modules' || name === '.next') continue;
    walk(path.join(rel, name), out);
  }
}

const hits = [];
for (const target of TARGETS) {
  const files = [];
  walk(target, files);
  for (const file of files) {
    const rel = path.relative(root, file);
    // Imported editorial drafts keep source punctuation; validate separately via word-count.
    if (
      rel.replace(/\\/g, '/').includes('newsletter-draft-registry') ||
      rel.replace(/\\/g, '/').includes('content/newsletter/drafts/')
    ) {
      continue;
    }
    const text = fs.readFileSync(file, 'utf8');
    if (!text.includes('—')) continue;
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      if (line.includes('—') && !line.includes('normalizeEmDash') && !line.includes('\\u2014')) {
        hits.push(`${rel}:${i + 1}:${line.trim().slice(0, 120)}`);
      }
    });
  }
}

if (hits.length) {
  console.error('Em dash (—) found in user-facing copy:\n');
  for (const h of hits.slice(0, 40)) console.error(h);
  if (hits.length > 40) console.error(`... and ${hits.length - 40} more`);
  process.exit(1);
}

console.log('em-dash-check: OK (no — in user-facing copy)');
