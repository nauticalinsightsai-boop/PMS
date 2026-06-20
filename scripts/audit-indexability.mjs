/**
 * T-025 live indexability audit (read-only).
 * Usage: node scripts/audit-indexability.mjs [--base=https://pmstructure.com]
 */
import { execFileSync } from 'child_process';

const baseArg = process.argv.find((a) => a.startsWith('--base='));
const base = (baseArg?.slice(7) ?? process.env.PMS_SITE_URL ?? 'https://pmstructure.com').replace(
  /\/$/,
  '',
);

const CANONICAL_HOST = 'https://pmstructure.com';

const PRIORITY_PATHS = [
  '/',
  '/certifications',
  '/certifications/pmp',
  '/answers/is-the-pmp-exam-changing-in-2026',
  '/topics/pmp-exam-2026',
  '/faq',
  '/certifications/compare',
  '/community',
  '/membership',
  '/newsletter',
  '/pm-service',
  '/legal/terms',
  '/legal/privacy',
];

const PRIORITY_SITEMAP_PATHS = [
  '/',
  '/certifications',
  '/certifications/pmp',
  '/answers/is-the-pmp-exam-changing-in-2026',
  '/topics/pmp-exam-2026',
  '/faq',
  '/certifications/compare',
  '/community',
  '/membership',
  '/newsletter',
  '/pm-service',
  '/legal/terms',
  '/legal/privacy',
];

const NOINDEX_UTILITY_PATHS = [
  '/checkout',
  '/checkout/success',
  '/checkout/store',
  '/checkout/store/success',
  '/membership/checkout',
  '/membership/checkout/success',
  '/admin',
];

const NOINDEX_PORTAL_PATHS = ['/go/website'];

function fetchWithHeaders(url) {
  try {
    const raw = execFileSync(
      'curl',
      ['-sI', '-m', '25', '-A', 'PMS-Indexability-Audit/1.0', '-w', '\n__STATUS__%{http_code}', url],
      { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 },
    );
    const statusMatch = raw.match(/__STATUS__(\d{3})$/);
    const status = statusMatch ? Number(statusMatch[1]) : 0;
    const headerBlock = statusMatch ? raw.slice(0, -statusMatch[0].length) : raw;
    const headers = {};
    for (const line of headerBlock.split(/\r?\n/)) {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const key = line.slice(0, idx).trim().toLowerCase();
        headers[key] = line.slice(idx + 1).trim();
      }
    }
    return { status, headers };
  } catch (err) {
    return { status: 0, headers: {}, error: err.message || 'curl failed' };
  }
}

function fetchBody(url) {
  try {
    const raw = execFileSync(
      'curl',
      ['-sL', '-m', '25', '-A', 'PMS-Indexability-Audit/1.0', '-w', '\n__STATUS__%{http_code}', url],
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 },
    );
    const statusMatch = raw.match(/__STATUS__(\d{3})$/);
    const status = statusMatch ? Number(statusMatch[1]) : 0;
    const body = statusMatch ? raw.slice(0, -statusMatch[0].length) : raw;
    return { status, body };
  } catch (err) {
    return { status: 0, body: '', error: err.message || 'curl failed' };
  }
}

function hasNoindexRobotsMeta(html) {
  const matches = html.match(/<meta[^>]+name=["']robots["'][^>]*>/gi) ?? [];
  return matches.some((tag) => /noindex/i.test(tag));
}

function pickCanonical(html) {
  const m =
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ??
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  return m?.[1] ?? '';
}

function headerHasNoindex(headers) {
  const tag = headers['x-robots-tag'] ?? '';
  return /noindex/i.test(tag);
}

function sitemapHasLoc(body, path) {
  if (path === '/') {
    return body.includes(`<loc>${CANONICAL_HOST}/</loc>`) || body.includes(`<loc>${CANONICAL_HOST}</loc>`);
  }
  return body.includes(`<loc>${CANONICAL_HOST}${path}</loc>`);
}
let failed = false;
let passed = 0;

console.log(`audit-indexability: ${base}\n`);

for (const path of PRIORITY_PATHS) {
  const url = `${base}${path}`;
  const { status, headers, error } = fetchWithHeaders(url);

  if (error) {
    console.error(`FAIL ${path}: ${error}`);
    failed = true;
    continue;
  }

  if (status < 200 || status >= 400) {
    console.error(`FAIL ${path}: HTTP ${status || 'unknown'}`);
    failed = true;
    continue;
  }

  if (headerHasNoindex(headers)) {
    console.error(`FAIL ${path}: X-Robots-Tag contains noindex (${headers['x-robots-tag']})`);
    failed = true;
    continue;
  }

  const { status: bodyStatus, body } = fetchBody(url);
  if (bodyStatus < 200 || bodyStatus >= 400) {
    console.error(`FAIL ${path}: body fetch HTTP ${bodyStatus || 'unknown'}`);
    failed = true;
    continue;
  }

  if (hasNoindexRobotsMeta(body)) {
    console.error(`FAIL ${path}: meta robots contains noindex`);
    failed = true;
    continue;
  }

  const canonical = pickCanonical(body);
  if (canonical && !canonical.startsWith(CANONICAL_HOST)) {
    console.error(`FAIL ${path}: canonical not on ${CANONICAL_HOST} (${canonical})`);
    failed = true;
    continue;
  }

  console.log(`OK   ${path} HTTP ${status}`);
  passed += 1;
}

for (const path of NOINDEX_UTILITY_PATHS) {
  const url = `${base}${path}`;
  const { status, body } = fetchBody(url);
  if (status >= 500) {
    console.error(`FAIL ${path}: utility route HTTP ${status}`);
    failed = true;
    continue;
  }
  if (status >= 200 && status < 400 && !hasNoindexRobotsMeta(body) && !headerHasNoindex(fetchWithHeaders(url).headers)) {
    console.error(`WARN ${path}: expected noindex meta or header (status ${status})`);
    failed = true;
    continue;
  }
  console.log(`OK   ${path} utility noindex (${status})`);
  passed += 1;
}

for (const path of NOINDEX_PORTAL_PATHS) {
  const url = `${base}${path}`;
  const { status, body } = fetchBody(url);
  if (status >= 500) {
    console.error(`FAIL ${path}: portal route HTTP ${status}`);
    failed = true;
    continue;
  }
  if (status >= 200 && status < 400 && !hasNoindexRobotsMeta(body)) {
    console.error(`FAIL ${path}: portal must have noindex meta robots (status ${status})`);
    failed = true;
    continue;
  }
  console.log(`OK   ${path} portal noindex (${status})`);
  passed += 1;
}

for (const path of ['/robots.txt', '/sitemap.xml']) {
  const url = `${base}${path}`;
  const { status, headers, error } = fetchWithHeaders(url);
  if (error || status < 200 || status >= 400) {
    console.error(`FAIL ${path}: HTTP ${status || 'unknown'}${error ? ` (${error})` : ''}`);
    failed = true;
    continue;
  }
  if (headerHasNoindex(headers)) {
    console.error(`FAIL ${path}: X-Robots-Tag contains noindex`);
    failed = true;
    continue;
  }
  console.log(`OK   ${path} HTTP ${status}`);
  passed += 1;
}

const sitemapRes = fetchBody(`${base}/sitemap.xml`);
if (sitemapRes.status >= 200 && sitemapRes.status < 400) {
  let sitemapUrlsOk = true;
  for (const path of PRIORITY_SITEMAP_PATHS) {
    if (!sitemapHasLoc(sitemapRes.body, path)) {
      console.error(`FAIL sitemap.xml: missing loc for ${path}`);
      sitemapUrlsOk = false;
      failed = true;
    }
  }
  if (sitemapUrlsOk) {
    console.log(`OK   sitemap.xml includes ${PRIORITY_SITEMAP_PATHS.length} priority URLs`);
    passed += 1;
  }
  if (sitemapRes.body.includes('/go/')) {
    console.error('FAIL sitemap.xml: must not contain /go/ portal URLs');
    failed = true;
  } else {
    console.log('OK   sitemap.xml excludes /go/ portal URLs');
    passed += 1;
  }
} else {
  console.error(`FAIL sitemap.xml body: HTTP ${sitemapRes.status || 'unknown'}`);
  failed = true;
}

const robotsRes = fetchBody(`${base}/robots.txt`);
if (robotsRes.status >= 200 && robotsRes.status < 400) {
  let robotsOk = true;
  if (!/allow:\s*\//i.test(robotsRes.body)) {
    console.error('FAIL robots.txt: missing Allow: /');
    robotsOk = false;
  }
  if (!robotsRes.body.includes(`Sitemap: ${CANONICAL_HOST}/sitemap.xml`)) {
    console.error(`FAIL robots.txt: missing Sitemap: ${CANONICAL_HOST}/sitemap.xml`);
    robotsOk = false;
  }
  if (robotsOk) {
    console.log('OK   robots.txt allow + sitemap line');
    passed += 1;
  } else {
    failed = true;
  }
} else {
  console.error(`FAIL robots.txt body: HTTP ${robotsRes.status || 'unknown'}`);
  failed = true;
}

console.log(`\naudit-indexability: ${passed} passed${failed ? ', failures above' : ''}`);
process.exit(failed ? 1 : 0);
