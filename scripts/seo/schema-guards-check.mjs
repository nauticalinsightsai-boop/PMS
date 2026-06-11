/**
 * Schema safety guards: no ATP claims, payment URLs, or AggregateRating in JSON-LD (Run 8).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontend = path.join(__dirname, '../../frontend');

const schemaDirs = [
  path.join(frontend, 'components/seo'),
  path.join(frontend, 'lib/schema'),
];

const BAD_PATTERNS = [
  /AggregateRating/i,
  /guaranteed pass/i,
  /pmi authorized training partner/i,
  /\/checkout/i,
  /\/admin/i,
  /\/enroll\/success/i,
];

let failed = false;

for (const dir of schemaDirs) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue;
    const src = fs.readFileSync(path.join(dir, file), 'utf8');
    for (const pattern of BAD_PATTERNS) {
      if (pattern.test(src)) {
        console.error(`schema-guards-check FAIL: ${file} matches ${pattern}`);
        failed = true;
      }
    }
  }
}

if (failed) process.exit(1);
console.log('schema-guards-check OK');