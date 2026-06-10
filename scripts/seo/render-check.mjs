/**
 * Verify pre-rendered HTML contains expected H1 and key content on static routes (run after next build).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(__dirname, '../../frontend/.next/server/app');

const checks = [
  { label: 'homepage', file: 'index.html', mustInclude: ['<h1', 'PMP'] },
  { label: 'faq', file: 'faq.html', mustInclude: ['<h1', 'FAQ'] },
  {
    label: 'pmp-exam-2026',
    file: path.join('pmp-exam-2026.html'),
    mustInclude: ['<h1', '2026'],
  },
  {
    label: 'answers-changing-2026',
    file: path.join('answers', 'is-the-pmp-exam-changing-in-2026.html'),
    mustInclude: ['<h1', 'changing', 'short answer'],
  },
  {
    label: 'topics-pmp-2026',
    file: path.join('topics', 'pmp-exam-2026.html'),
    mustInclude: ['<h1', 'PMP'],
  },
  {
    label: 'certifications-pmp',
    file: path.join('certifications', 'pmp.html'),
    mustInclude: ['<h1', 'PMP'],
  },
  { label: 'answers-index', file: path.join('answers.html'), mustInclude: ['<h1'] },
  { label: 'topics-index', file: path.join('topics.html'), mustInclude: ['<h1'] },
];

let failed = false;
let checked = 0;

for (const { label, file, mustInclude } of checks) {
  const filePath = path.join(appDir, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`render-check skip ${label}: missing ${file} (run next build first)`);
    continue;
  }
  checked++;
  const html = fs.readFileSync(filePath, 'utf8').toLowerCase();
  let routeFailed = false;
  for (const needle of mustInclude) {
    if (!html.includes(needle.toLowerCase())) {
      console.error(`render-check FAIL ${label}: expected "${needle}" in ${file}`);
      failed = true;
      routeFailed = true;
    }
  }
  if (!routeFailed) console.log(`render-check OK ${label}`);
}

if (checked === 0) {
  console.warn('render-check: no HTML files found — run npm run build -w @pms/frontend first');
  process.exit(0);
}

if (failed) process.exit(1);
console.log(`render-check complete (${checked} routes)`);
