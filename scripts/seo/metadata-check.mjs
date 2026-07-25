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

// Check for double title suffix in phase-2 SEO config
const phase2File = path.join(frontend, 'content/seo/phase-2-page-seo.ts');
if (fs.existsSync(phase2File)) {
  const content = fs.readFileSync(phase2File, 'utf8');
  // Extract title lines and check for double suffix pattern
  const titleMatches = content.matchAll(/title:\s*['"`]([^'"`]+)['"`]/g);
  for (const match of titleMatches) {
    const title = match[1];
    const suffixCount = (title.match(/\|\s*PM Structure/gi) || []).length;
    if (suffixCount > 1) {
      issues.push({
        severity: 'high',
        path: phase2File,
        issue: `Title contains multiple "| PM Structure" suffixes: "${title}"`
      });
    }
  }
}

// Check answers pages for double suffix
const answersDir = path.join(frontend, 'content/answers');
if (fs.existsSync(answersDir)) {
  const pagesFile = path.join(answersDir, 'pages.ts');
  if (fs.existsSync(pagesFile)) {
    const content = fs.readFileSync(pagesFile, 'utf8');
    const titleMatches = content.matchAll(/title:\s*['"`]([^'"`]+)['"`]/g);
    for (const match of titleMatches) {
      const title = match[1];
      const suffixCount = (title.match(/\|\s*PM Structure/gi) || []).length;
      if (suffixCount > 1) {
        issues.push({
          severity: 'high',
          path: pagesFile,
          issue: `Title contains multiple "| PM Structure" suffixes: "${title}"`
        });
      }
    }
  }
}

const genericTitle = issues.length === 0;
writeReport('metadata-check', { pass: issues.length === 0, issues, priorityPaths });
if (issues.length) {
  console.error('metadata-check FAIL', issues);
  process.exit(1);
}
console.log('metadata-check OK');
