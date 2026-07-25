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
  '/pmp-exam-2026',
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
  '/pmp-exam-2026',
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

const NOINDEX_PORTAL_PATHS = [
  '/go/instagram',
  '/go/linkedin',
  '/go/facebook',
  '/go/snapchat',
  '/go/whatsapp',
  '/go/telegram',
];

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

function hasNofollowRobotsMeta(html) {
  const matches = html.match(/<meta[^>]+name=["']robots["'][^>]*>/gi) ?? [];
  return matches.some((tag) => /nofollow/i.test(tag));
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

function countOccurrences(body, pattern) {
  return body.split(pattern).length - 1;
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
  const url = `${base}${path}?utm_source=packet04c&utm_medium=seo&utm_campaign=go_containment`;
  const { status, body } = fetchBody(url);
  if (status >= 500) {
    console.error(`FAIL ${path}: portal route HTTP ${status}`);
    failed = true;
    continue;
  }
  if (
    status >= 200 &&
    status < 400 &&
    (!hasNoindexRobotsMeta(body) || !hasNofollowRobotsMeta(body))
  ) {
    console.error(`FAIL ${path}: portal must emit noindex,nofollow (status ${status})`);
    failed = true;
    continue;
  }
  console.log(`OK   ${path} portal noindex,nofollow with query handoff (${status})`);
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
  const newsletterLoc = `<loc>${CANONICAL_HOST}/newsletter</loc>`;
  const newsletterLocCount = countOccurrences(sitemapRes.body, newsletterLoc);
  if (newsletterLocCount === 1) {
    console.log('OK   sitemap.xml contains /newsletter exactly once');
    passed += 1;
  } else {
    console.error(
      `FAIL sitemap.xml: expected exactly one ${newsletterLoc}, found ${newsletterLocCount}`,
    );
    failed = true;
  }
  if (/<loc>[^<]*\/go\/[^<]*<\/loc>/i.test(sitemapRes.body)) {
    console.error('FAIL sitemap.xml: /go/* portal URLs must be omitted');
    failed = true;
  } else {
    console.log('OK   sitemap.xml omits every /go/* portal URL');
    passed += 1;
  }
} else {
  console.error(`FAIL sitemap.xml body: HTTP ${sitemapRes.status || 'unknown'}`);
  failed = true;
}

const newsletterRes = fetchBody(`${base}/newsletter`);
if (newsletterRes.status >= 200 && newsletterRes.status < 400) {
  const h1Count = (newsletterRes.body.match(/<h1(?:\s|>)/gi) ?? []).length;
  const articleLinkCount = (
    newsletterRes.body.match(/href=["']\/newsletter\/[^"'?#/]+["']/gi) ?? []
  ).length;
  if (h1Count === 1) {
    console.log('OK   /newsletter raw HTML contains exactly one H1');
    passed += 1;
  } else {
    console.error(`FAIL /newsletter raw HTML: expected one H1, found ${h1Count}`);
    failed = true;
  }
  if (articleLinkCount > 0) {
    console.log(`OK   /newsletter raw HTML contains ${articleLinkCount} initial article links`);
    passed += 1;
  } else {
    console.error('FAIL /newsletter raw HTML: no initial article links found');
    failed = true;
  }
} else {
  console.error(`FAIL /newsletter raw HTML: HTTP ${newsletterRes.status || 'unknown'}`);
  failed = true;
}

const htmlSitemapRes = fetchBody(`${base}/sitemap`);
if (htmlSitemapRes.status >= 200 && htmlSitemapRes.status < 400) {
  const mainHtml =
    htmlSitemapRes.body.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] ?? '';
  const newsletterHrefCount = (
    mainHtml.match(/<a[^>]*href=["']\/newsletter["'][^>]*>/gi) ?? []
  ).length;
  if (newsletterHrefCount === 1) {
    console.log('OK   HTML sitemap contains /newsletter exactly once');
    passed += 1;
  } else {
    console.error(
      `FAIL HTML sitemap: expected one href="/newsletter", found ${newsletterHrefCount}`,
    );
    failed = true;
  }
  const goHrefCount = (
    mainHtml.match(/<a[^>]*href=["']\/go\/[^"'?#]+["'][^>]*>/gi) ?? []
  ).length;
  if (goHrefCount === 0) {
    console.log('OK   HTML sitemap omits every /go/* portal URL');
    passed += 1;
  } else {
    console.error(`FAIL HTML sitemap: found ${goHrefCount} /go/* portal links`);
    failed = true;
  }
} else {
  console.error(`FAIL HTML sitemap: HTTP ${htmlSitemapRes.status || 'unknown'}`);
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
