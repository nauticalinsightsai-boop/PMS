import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeReport } from './lib/report-writer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '../..');
const seoModule = path.join(repoRoot, 'frontend/content/seo/phase-2-page-seo.ts');
const issues = [];

if (!fs.existsSync(seoModule)) {
  issues.push({ severity: 'high', issue: 'phase-2-page-seo.ts missing' });
} else {
  const source = fs.readFileSync(seoModule, 'utf8');

  const routeMatches = [...source.matchAll(/^\s+'(\/[^']+)':\s*\{/gm)];
  const routes = routeMatches.map((m) => m[1]);

  const keywordMatches = [...source.matchAll(/primaryKeyword:\s*'([^']+)'/g)];
  const keywords = keywordMatches.map((m) => m[1]);

  if (routes.length < 16) {
    issues.push({
      severity: 'high',
      issue: `expected at least 16 priority routes, found ${routes.length}`,
    });
  }

  const keywordCounts = new Map();
  for (const kw of keywords) {
    keywordCounts.set(kw, (keywordCounts.get(kw) ?? 0) + 1);
  }
  for (const [kw, count] of keywordCounts) {
    if (count > 1) {
      issues.push({
        severity: 'high',
        issue: `duplicate primaryKeyword: "${kw}" (${count} times)`,
      });
    }
  }

  const hrefMatches = [...source.matchAll(/href:\s*'([^']+)'/g)];
  for (const href of hrefMatches.map((m) => m[1])) {
    if (href.startsWith('http://') || href.includes('www.')) {
      issues.push({ severity: 'high', issue: `non-relative or bad host in link: ${href}` });
    }
  }

  const internalMd = path.join(repoRoot, 'docs/internal/PMSTRUCTURE_KEYWORD_ANCHOR_MAP_PHASE_2.md');
  const internalCsv = path.join(repoRoot, 'docs/internal/pmstructure-keyword-anchor-map-phase-2.csv');
  if (!fs.existsSync(internalMd)) {
    issues.push({ severity: 'medium', issue: 'internal MD missing' });
  }
  if (!fs.existsSync(internalCsv)) {
    issues.push({ severity: 'medium', issue: 'internal CSV missing' });
  }

  const publicExposure = [
    path.join(repoRoot, 'frontend/public/PMSTRUCTURE_KEYWORD_ANCHOR_MAP_PHASE_2.md'),
    path.join(repoRoot, 'frontend/public/pmstructure-keyword-anchor-map-phase-2.csv'),
  ];
  for (const p of publicExposure) {
    if (fs.existsSync(p)) {
      issues.push({ severity: 'high', issue: `internal keyword doc exposed publicly: ${p}` });
    }
  }
}

writeReport('keyword-map-check', {
  pass: issues.length === 0,
  issues,
  routeCount: issues.length ? undefined : [...fs.readFileSync(seoModule, 'utf8').matchAll(/^\s+'(\/[^']+)':\s*\{/gm)].length,
});
if (issues.length) {
  console.error('keyword-map-check FAIL', issues);
  process.exit(1);
}
console.log('keyword-map-check OK');
