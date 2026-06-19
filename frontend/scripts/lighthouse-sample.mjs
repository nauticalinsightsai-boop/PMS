/**
 * Run Lighthouse performance audits on sample marketing routes.
 * Requires production server: npm run build && npm run start:perf
 *
 * Usage: node scripts/lighthouse-sample.mjs [baseUrl]
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = (process.argv[2] || process.env.PERF_SMOKE_BASE_URL || 'http://localhost:3051').replace(/\/$/, '');

const ROUTES = [
  { slug: 'home', path: '/' },
  { slug: 'certifications', path: '/certifications' },
  { slug: 'cert-detail-pmp', path: '/certifications/pmp' },
  { slug: 'newsletter', path: '/newsletter' },
];

const outDir = path.join(__dirname, '../docs/lighthouse');
fs.mkdirSync(outDir, { recursive: true });

const summary = [];

for (const route of ROUTES) {
  const url = `${base}${route.path}`;
  const outFile = path.join(outDir, `${route.slug}.json`);
  console.log(`Lighthouse: ${url}`);
  try {
    execSync(
      `npx --yes lighthouse "${url}" --only-categories=performance --chrome-flags="--headless=new --no-sandbox" --max-wait-for-load=90000 --output=json --output-path="${outFile}"`,
      { stdio: 'inherit', env: process.env },
    );
    const report = JSON.parse(fs.readFileSync(outFile, 'utf8'));
    const perf = report.categories?.performance?.score;
    const audits = report.audits || {};
    summary.push({
      route: route.path,
      performanceScore: perf != null ? Math.round(perf * 100) : null,
      lcpMs: audits['largest-contentful-paint']?.numericValue ?? null,
      tbtMs: audits['total-blocking-time']?.numericValue ?? null,
      totalJsKb: audits['total-byte-weight']?.numericValue
        ? Math.round(audits['total-byte-weight'].numericValue / 1024)
        : null,
    });
  } catch (err) {
    console.error(`Lighthouse failed for ${url}:`, err.message);
    summary.push({ route: route.path, error: String(err.message || err) });
  }
}

const summaryPath = path.join(outDir, 'summary.json');
fs.writeFileSync(summaryPath, JSON.stringify({ capturedAt: new Date().toISOString(), base, summary }, null, 2));
console.log('Wrote', summaryPath);
console.table(summary);
