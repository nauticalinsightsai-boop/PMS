/**
 * Verify PMP course and pathway pages exist.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const siteApp = path.join(root, 'frontend/app/(site)');

const expected = [
  '/pmp-foundation',
  '/pmp-professional',
  '/pmp-mastery',
  '/pmp-readiness-diagnostic',
  '/pmp-scenario-practice',
  '/pmp-mock-exam',
  '/pmp-q-and-a-support',
  '/pmp-enrollment',
];

let failed = false;

for (const route of expected) {
  const pagePath = path.join(siteApp, route.slice(1), 'page.tsx');
  if (!fs.existsSync(pagePath)) {
    console.error(`course-check FAIL: missing ${route}`);
    failed = true;
  }
}

const courses = fs.readFileSync(path.join(root, 'frontend/content/pmp/courses.ts'), 'utf8');
if (!courses.includes('PmpPathwayComparisonTable') && !fs.existsSync(path.join(root, 'frontend/components/pmp/PmpPathwayComparisonTable.tsx'))) {
  // comparison table is separate component - verify file exists
}
if (!fs.existsSync(path.join(root, 'frontend/components/pmp/PmpPathwayComparisonTable.tsx'))) {
  console.error('course-check FAIL: missing PmpPathwayComparisonTable');
  failed = true;
}

if (failed) process.exit(1);
console.log(`course-check OK (${expected.length} pathway routes)`);
