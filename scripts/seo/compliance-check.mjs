import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeReport } from './lib/report-writer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const frontend = path.join(root, 'frontend');

const unsafePositive = [
  /(?<!does not )(?<!not )guarantee(?:d|s)?\s+(?:a\s+)?pmp\s+pass/i,
  /official\s+PMI\s+ATP(?!\s+unless)/i,
  /PMI\s+authorized\s+training\s+partner(?!\s+unless)/i,
];

const negationOk = /does not guarantee|not an official|not a PMI|not PMI|is not|No\./i;
const scanDirs = ['content/faq', 'content/pmp', 'content/answers', 'public'];
const findings = [];

for (const dir of scanDirs) {
  const full = path.join(frontend, dir);
  if (!fs.existsSync(full)) continue;
  const walk = (d) => {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (/\.(ts|tsx|json|txt|md)$/.test(ent.name)) {
        const text = fs.readFileSync(p, 'utf8');
        for (const pat of unsafePositive) {
          if (pat.test(text) && !negationOk.test(text)) {
            findings.push({ file: path.relative(root, p), pattern: String(pat), severity: 'critical' });
          }
        }
      }
    }
  };
  walk(full);
}

writeReport('compliance-check', { pass: findings.length === 0, findings });
if (findings.length) {
  console.error('compliance-check FAIL', findings.length, 'issues');
  process.exit(1);
}
console.log('compliance-check OK');
