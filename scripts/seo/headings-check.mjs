/**
 * Heading outline guard: single H1 on key marketing routes (Run 6).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontend = path.join(__dirname, '../../frontend');

let failed = false;

const pages = [
  // Home H1 lives in components/pages/Home.tsx (HomeServerHeading is sr-only supplementary copy)
  'components/pages/Home.tsx',
  // FAQ H1 lives in FaqServerHeading.tsx (composed in app/(site)/faq/page.tsx)
  'components/pages/Certifications.tsx',
  'components/pages/Compare.tsx',
  'components/pages/About.tsx',
  'components/pages/Contact.tsx',
  'components/pages/Blog.tsx',
  'components/pages/Membership.tsx',
  'components/pages/PMService.tsx',
  'components/faq/FaqServerHeading.tsx',
];


for (const rel of pages) {
  const filePath = path.join(frontend, rel);
  if (!fs.existsSync(filePath)) {
    console.error(`headings-check FAIL: missing ${rel}`);
    failed = true;
    continue;
  }
  const src = fs.readFileSync(filePath, 'utf8');
  const h1Count = (src.match(/<h1[\s>]/g) || []).length;
  const pseudoH1 = (src.match(/aria-level=\{1\}/g) || []).length;
  if (h1Count + pseudoH1 === 0 && !rel.includes('ServerHeading')) {
    console.error(`headings-check FAIL: no H1 in ${rel}`);
    failed = true;
  }
  if (h1Count + pseudoH1 > 1) {
    console.error(`headings-check FAIL: multiple H1 in ${rel}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`headings-check OK (${pages.length} files)`);