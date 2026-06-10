/**
 * Lightweight SEO audit summary — counts routes in sitemap source.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');

const sitemap = fs.readFileSync(path.join(root, 'frontend/app/sitemap.ts'), 'utf8');
const checks = [
  'PMP_CLUSTER_PATHS',
  'PMP_COURSE_PATHS',
  'PMP_SERVICE_PATHS',
  'ANSWER_PATHS',
  'TOPIC_PATHS',
  'DYNAMIC_LEGAL_SLUGS',
];

let failed = false;
for (const token of checks) {
  if (!sitemap.includes(token)) {
    console.error(`audit FAIL: sitemap.ts missing ${token}`);
    failed = true;
  }
}

const publicFiles = ['answers.json', 'topics.json', 'pricing-policy.json'];
for (const f of publicFiles) {
  if (!fs.existsSync(path.join(root, 'frontend/public', f))) {
    console.error(`audit FAIL: missing public/${f}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('audit OK (sitemap tokens + AI files present)');
