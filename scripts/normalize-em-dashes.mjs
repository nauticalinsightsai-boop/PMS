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
        .replace(/(\d)–(\d)/g, '$1-$2')
        .replace(/\u2013/g, '-')
        .replace(/\u2014/g, ':')
        .replace(/\.\s+\./g, '.')
        .replace(/:\s+:/g, ':')
        .replace(/\?\s+\./g, '?');
    })
    .join('\n')
    .trimEnd();
}

const SCAN_DIRS = [
  'frontend',
  'backend',
  'dashboard',
  'packages',
  'docs',
  'data',
  'scripts',
  '.agents',
  '.',
];

const SKIP_DIR_NAMES = new Set(['node_modules', '.next', '.git', 'dist', 'build', 'coverage']);

const SKIP_REL_PATHS = new Set([
  'scripts/normalize-em-dashes.mjs',
  'scripts/seo/em-dash-check.mjs',
  'frontend/lib/normalize-copy.ts',
]);

const EXT = new Set(['.ts', '.tsx', '.json', '.js', '.mjs', '.md', '.css', '.txt']);

function walk(relDir, out) {
  const abs = path.join(root, relDir);
  if (!fs.existsSync(abs)) return;
  const stat = fs.statSync(abs);
  if (stat.isFile()) {
    if (EXT.has(path.extname(abs)) && !SKIP_REL_PATHS.has(relDir.replace(/\\/g, '/'))) {
      out.push(abs);
    }
    return;
  }
  for (const name of fs.readdirSync(abs)) {
    if (SKIP_DIR_NAMES.has(name)) continue;
    walk(path.join(relDir, name), out);
  }
}

function collectFiles() {
  const files = [];
  for (const target of SCAN_DIRS) {
    walk(target, files);
  }
  return [...new Set(files)];
}

let changed = 0;
for (const file of collectFiles()) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  if (SKIP_REL_PATHS.has(rel)) continue;
  const raw = fs.readFileSync(file, 'utf8');
  if (!raw.includes('—') && !raw.includes('–')) continue;
  const next = normalizeEmDashText(raw);
  if (next !== raw) {
    fs.writeFileSync(file, next);
    changed += 1;
    console.log(rel);
  }
}

console.log(`\nNormalized ${changed} file(s).`);
