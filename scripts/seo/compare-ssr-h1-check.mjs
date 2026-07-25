/**
 * Focused compare-page raw-render check.
 * Usage: node scripts/seo/compare-ssr-h1-check.mjs --base=http://127.0.0.1:3066
 */
import { execFileSync } from 'child_process';

const baseArg = process.argv.find((arg) => arg.startsWith('--base='));
const base = (baseArg?.slice(7) ?? 'http://127.0.0.1:3066').replace(/\/$/, '');

function fetchBody(path) {
  const raw = execFileSync(
    'curl',
    [
      '-sL',
      '-m',
      '25',
      '-A',
      'PMS-Compare-SSR-H1-Check/1.0',
      '-w',
      '\n__STATUS__%{http_code}',
      `${base}${path}`,
    ],
    { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 },
  );
  const statusMatch = raw.match(/__STATUS__(\d{3})$/);
  const status = statusMatch ? Number(statusMatch[1]) : 0;
  const body = statusMatch ? raw.slice(0, -statusMatch[0].length) : raw;
  return { status, body };
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function check(condition, message) {
  if (!condition) {
    console.error(`compare-ssr-h1-check FAIL: ${message}`);
    process.exitCode = 1;
    return;
  }
  console.log(`OK   ${message}`);
}

for (const path of [
  '/certifications/compare',
  '/certifications/compare?c=pmp,capm,pmi-acp',
]) {
  const response = fetchBody(path);
  const h1Count = (response.body.match(/<h1(?:\s|>)/gi) ?? []).length;
  const text = visibleText(response.body).toLowerCase();

  check(response.status === 200, `${path} HTTP 200 (got ${response.status})`);
  check(h1Count === 1, `${path} raw HTML contains exactly one H1 (found ${h1Count})`);
  check(
    text.includes('compare') && text.includes('certification'),
    `${path} raw HTML contains the compare-page introduction`,
  );
}

if (!process.exitCode) {
  console.log('compare-ssr-h1-check OK');
}
