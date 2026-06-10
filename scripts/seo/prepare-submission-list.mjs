import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureReportsDir, REPORTS_DIR } from './lib/report-writer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = 'https://pmstructure.com';

const priority = [
  '/',
  '/pmp',
  '/pmp-exam-2026',
  '/pmp-current-vs-new-exam',
  '/pmp-before-8-july-2026',
  '/pmp-after-9-july-2026',
  '/pmp-foundation',
  '/pmp-professional',
  '/pmp-mastery',
  '/pmp-readiness-diagnostic',
  '/pmp-scenario-practice',
  '/pmp-faq',
  '/faq',
  '/topics',
  '/legal',
];

const forbidden = /checkout|payment|success|cancel|thank-you|login|account|dashboard|admin|utm_|currency=|region=/i;
const urls = priority.map((p) => `${base}${p}`).filter((u) => !forbidden.test(u));

ensureReportsDir();
fs.writeFileSync(path.join(REPORTS_DIR, 'google-priority-urls.txt'), urls.join('\n') + '\n');
fs.writeFileSync(path.join(REPORTS_DIR, 'bing-priority-urls.txt'), urls.join('\n') + '\n');
fs.writeFileSync(path.join(REPORTS_DIR, 'indexnow-urls.txt'), urls.join('\n') + '\n');
console.log(`prepare-submission-list OK (${urls.length} URLs)`);
