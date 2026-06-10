import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeReport } from './lib/report-writer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontend = path.join(__dirname, '../../frontend');
const issues = [];

const priorityPaths = ['/', '/pmp', '/pmp-exam-2026', '/pmp-faq', '/faq', '/topics', '/legal'];
for (const p of priorityPaths) {
  const pageFile = p === '/'
    ? path.join(frontend, 'app/(site)/page.tsx')
    : path.join(frontend, `app/(site)${p}/page.tsx`);
  if (!fs.existsSync(pageFile)) {
    issues.push({ severity: 'high', path: p, issue: 'page file missing' });
  }
}

const genericTitle = issues.length === 0;
writeReport('metadata-check', { pass: issues.length === 0, issues, priorityPaths });
if (issues.length) {
  console.error('metadata-check FAIL', issues);
  process.exit(1);
}
console.log('metadata-check OK');
