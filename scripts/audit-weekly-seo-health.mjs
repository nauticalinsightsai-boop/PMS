/**
 * B13 weekly SEO health check (read-only, optional live).
 * Usage: npm run audit:weekly-seo-health -- --base=https://pmstructure.com
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeReport } from './seo/lib/report-writer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const baseArg = process.argv.find((a) => a.startsWith('--base='));
const base = (baseArg?.slice(7) ?? process.env.PMS_SITE_URL ?? 'https://pmstructure.com').replace(
  /\/$/,
  '',
);

const writeJson = process.argv.includes('--write-json');

const PRIORITY_PATHS = [
  '/',
  '/certifications',
  '/certifications/pmp',
  '/topics/pmp-exam-2026',
  '/answers/is-the-pmp-exam-changing-in-2026',
  '/faq',
  '/certifications/compare',
];

const PRIVATE_PATHS = ['/checkout/success', '/checkout/cancel'];

const results = [];
let failed = false;

function record(name, ok, detail) {
  results.push({ check: name, ok, detail });
  if (!ok) failed = true;
  console.log(`${ok ? '  OK' : 'FAIL'}  ${name}${detail ? `: ${detail}` : ''}`);
}

function fetch(url, method = 'GET') {
  try {
    const out = execFileSync(
      'curl',
      ['-sL', '-m', '25', '-A', 'PMS-Weekly-SEO-Health/1.0', '-X', method, '-w', '\n__STATUS__%{http_code}', url],
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 },
    );
    const statusMatch = out.match(/__STATUS__(\d{3})$/);
    const status = statusMatch ? Number(statusMatch[1]) : 0;
    const body = statusMatch ? out.slice(0, -statusMatch[0].length) : out;
    return { status, body, headers: '' };
  } catch (err) {
    return { status: 0, body: '', error: err.message || 'curl failed' };
  }
}

function hasNoindex(html) {
  const lower = html.toLowerCase();
  return (
    lower.includes('noindex') ||
    lower.includes('content="noindex') ||
    lower.includes("content='noindex")
  );
}

console.log(`audit-weekly-seo-health: ${base}\n`);

for (const p of PRIORITY_PATHS) {
  const { status, body, error } = fetch(`${base}${p}`);
  if (error) {
    record(`GET ${p}`, false, error);
    continue;
  }
  if (status < 200 || status >= 400) {
    record(`GET ${p}`, false, `HTTP ${status}`);
    continue;
  }
  if (hasNoindex(body)) {
    record(`GET ${p}`, false, 'noindex detected on priority page');
    continue;
  }
  record(`GET ${p}`, true, `HTTP ${status}`);
}

for (const p of ['/robots.txt', '/sitemap.xml']) {
  const { status, body, error } = fetch(`${base}${p}`);
  if (error || status < 200 || status >= 400) {
    record(`GET ${p}`, false, error || `HTTP ${status}`);
    continue;
  }
  record(`GET ${p}`, true, `HTTP ${status}`);
  if (p === '/robots.txt') {
    const hasSitemap = /sitemap:\s*https?:\/\//i.test(body);
    record('robots.txt includes sitemap', hasSitemap, hasSitemap ? undefined : 'missing Sitemap: line');
  }
  if (p === '/sitemap.xml') {
    const badHost = /https?:\/\/(?:www\.|http:\/\/)/i.test(body);
    record('sitemap.xml host hygiene', !badHost, badHost ? 'contains www or http locs' : undefined);
  }
}

for (const p of PRIVATE_PATHS) {
  const { status, body } = fetch(`${base}${p}`);
  if (status >= 200 && status < 400 && body && !hasNoindex(body)) {
    record(`noindex ${p}`, false, 'checkout route reachable without noindex');
  } else if (status >= 200 && status < 400) {
    record(`noindex ${p}`, true, 'noindex or blocked');
  } else {
    record(`noindex ${p}`, true, `HTTP ${status} (not publicly indexable)`);
  }
}

try {
  const wwwUrl = base.replace('://', '://www.');
  const www = execFileSync(
    'curl',
    ['-sI', '-m', '15', '-A', 'PMS-Weekly-SEO-Health/1.0', '-w', '__FINAL__%{url_effective}', wwwUrl],
    { encoding: 'utf8' },
  );
  const finalMatch = www.match(/__FINAL__(.+)$/);
  const finalUrl = finalMatch ? finalMatch[1].trim() : '';
  const apexOk = !finalUrl.includes('://www.');
  record('www redirects to apex', apexOk, apexOk ? undefined : `final URL ${finalUrl}`);
} catch {
  record('www redirects to apex', false, 'curl failed');
}

try {
  const httpUrl = base.replace('https://', 'http://');
  const http = execFileSync(
    'curl',
    ['-sI', '-m', '15', '-A', 'PMS-Weekly-SEO-Health/1.0', '-w', '__FINAL__%{url_effective}', httpUrl],
    { encoding: 'utf8' },
  );
  const finalMatch = http.match(/__FINAL__(.+)$/);
  const finalUrl = finalMatch ? finalMatch[1].trim() : '';
  const httpsOk = finalUrl.startsWith('https://');
  record('http redirects to https', httpsOk, httpsOk ? undefined : `final URL ${finalUrl}`);
} catch {
  record('http redirects to https', false, 'curl failed');
}

console.log('\nNext steps:');
console.log('  npm run seo:smoke-live -- --base=' + base);
console.log('  npm run seo:audit-redirects -- --base=' + base);
console.log('  npm run seo:audit-indexability -- --base=' + base);
console.log('  npm run seo:audit-crawl-indexation -- --base=' + base);
console.log('  Mahaa: fill pmstructure-weekly-seo-dashboard.csv from GA4/GSC exports');
console.log('  Mahaa: add scan evidence links to pmstructure-result-scan-links.csv');

if (writeJson) {
  const stamp = new Date().toISOString().slice(0, 10);
  const file = writeReport(`weekly-health-${stamp}`, { base, failed, results });
  console.log(`\nWrote ${path.relative(root, file)}`);
}

console.log(`\naudit-weekly-seo-health: ${failed ? 'FAILED' : 'PASSED'}`);
process.exit(failed ? 1 : 0);
