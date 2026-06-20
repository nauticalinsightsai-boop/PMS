import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureReportsDir, REPORTS_DIR } from './lib/report-writer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = 'https://pmstructure.com';

const P0_SUBMISSION_PATHS = [
  '/',
  '/certifications/pmp',
  '/pmp-exam-2026',
  '/pmp',
  '/faq',
  '/certifications/compare',
  '/answers/is-the-pmp-exam-changing-in-2026',
  '/topics/pmp-exam-2026',
  '/newsletter',
];

const forbidden = /checkout|payment|success|cancel|thank-you|login|account|dashboard|admin|\/go\/|utm_|currency=|region=/i;
const urls = P0_SUBMISSION_PATHS.map((p) => `${base}${p}`).filter((u) => !forbidden.test(u));

ensureReportsDir();
fs.writeFileSync(path.join(REPORTS_DIR, 'google-priority-urls.txt'), urls.join('\n') + '\n');
fs.writeFileSync(path.join(REPORTS_DIR, 'bing-priority-urls.txt'), urls.join('\n') + '\n');
fs.writeFileSync(path.join(REPORTS_DIR, 'indexnow-urls.txt'), urls.join('\n') + '\n');
console.log(`prepare-submission-list OK (${urls.length} URLs)`);
