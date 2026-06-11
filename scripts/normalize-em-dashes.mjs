/**
 * Replace em/en dashes in user-facing copy with plain punctuation.
 * Run: node scripts/normalize-em-dashes.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

/** Prefer colon for label-style breaks; period when the tail is a full sentence. */
export function normalizeEmDashText(text) {
  const lines = text.split('\n');
  return lines
    .map((line) => {
      if (/^\s*\/\//.test(line)) {
        return line.replace(/\s*—\s*/g, ': ').replace(/\s+–\s+/g, ': ');
      }
      return line
        .replace(/\s*—\s*([A-Z"'(])/g, '. $1')
        .replace(/\s*—\s*/g, ': ')
        .replace(/\s+–\s+/g, ': ')
        .replace(/\.\s+\./g, '.')
        .replace(/:\s+:/g, ':')
        .replace(/\?\s+\./g, '?');
    })
    .join('\n')
    .trimEnd();
}

const TARGET_FILES = [
  'frontend/content',
  'frontend/data',
  'frontend/config',
  'frontend/constants',
  'frontend/components',
  'frontend/lib/brand-voice.ts',
  'frontend/lib/cert-program-offer.ts',
  'frontend/lib/conversion-recovery',
  'frontend/lib/pmp-roadmap-form-options.ts',
  'frontend/lib/pathway-programme-preview.ts',
  'frontend/lib/pathway-tier-cta.ts',
  'frontend/lib/site-metadata.ts',
  'packages/site-content',
  'packages/booking-crm/data',
  'packages/booking-crm/src/channel-landing-pages/channelPortalCopy.ts',
  'packages/booking-crm/src/channel-landing-pages/portalLearnerCopy.ts',
  'packages/booking-crm/src/constants/ctaPlatformButtons.ts',
  'data/calendly-events.manifest.json',
  'data/channel-landing-pages.json',
];

const EXT = new Set(['.ts', '.tsx', '.json', '.js', '.mjs']);

function walk(relDir, out) {
  const abs = path.join(root, relDir);
  if (!fs.existsSync(abs)) return;
  const stat = fs.statSync(abs);
  if (stat.isFile()) {
    if (EXT.has(path.extname(abs))) out.push(abs);
    return;
  }
  for (const name of fs.readdirSync(abs)) {
    if (name === 'node_modules' || name === '.next') continue;
    walk(path.join(relDir, name), out);
  }
}

function collectFiles() {
  const files = [];
  for (const target of TARGET_FILES) {
    walk(target, files);
  }
  return [...new Set(files)];
}

let changed = 0;
for (const file of collectFiles()) {
  const raw = fs.readFileSync(file, 'utf8');
  if (!raw.includes('—') && !raw.includes('–')) continue;
  const next = normalizeEmDashText(raw);
  if (next !== raw) {
    fs.writeFileSync(file, next);
    changed += 1;
    console.log(path.relative(root, file));
  }
}

console.log(`\nNormalized ${changed} file(s).`);
