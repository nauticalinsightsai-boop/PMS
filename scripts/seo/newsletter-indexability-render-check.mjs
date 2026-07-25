/**
 * Focused newsletter hub release check.
 * Usage: node scripts/seo/newsletter-indexability-render-check.mjs --base=http://127.0.0.1:3062
 */
import { execFileSync } from 'child_process';

const baseArg = process.argv.find((arg) => arg.startsWith('--base='));
const base = (baseArg?.slice(7) ?? 'http://127.0.0.1:3062').replace(/\/$/, '');
const canonicalHost = 'https://pmstructure.com';

function fetchBody(path) {
  const raw = execFileSync(
    'curl',
    [
      '-sL',
      '-m',
      '25',
      '-A',
      'PMS-Newsletter-Indexability-Check/1.0',
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

function check(condition, message) {
  if (!condition) {
    console.error(`newsletter-indexability-render-check FAIL: ${message}`);
    process.exitCode = 1;
    return;
  }
  console.log(`OK   ${message}`);
}

const newsletter = fetchBody('/newsletter');
check(newsletter.status === 200, `/newsletter HTTP 200 (got ${newsletter.status})`);
check(
  !/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(newsletter.body),
  '/newsletter has no noindex robots meta',
);
check(
  (newsletter.body.match(/<h1(?:\s|>)/gi) ?? []).length === 1,
  '/newsletter raw HTML contains exactly one H1',
);
check(
  (newsletter.body.match(/href=["']\/newsletter\/[^"'?#/]+["']/gi) ?? []).length > 0,
  '/newsletter raw HTML contains initial article links',
);

const xmlSitemap = fetchBody('/sitemap.xml');
const newsletterLoc = `<loc>${canonicalHost}/newsletter</loc>`;
check(xmlSitemap.status === 200, `/sitemap.xml HTTP 200 (got ${xmlSitemap.status})`);
check(
  xmlSitemap.body.split(newsletterLoc).length - 1 === 1,
  'XML sitemap contains /newsletter exactly once',
);

const htmlSitemap = fetchBody('/sitemap');
const mainHtml = htmlSitemap.body.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] ?? '';
check(htmlSitemap.status === 200, `/sitemap HTTP 200 (got ${htmlSitemap.status})`);
check(
  (mainHtml.match(/<a[^>]*href=["']\/newsletter["'][^>]*>/gi) ?? []).length === 1,
  'HTML sitemap main content contains /newsletter exactly once',
);

if (!process.exitCode) {
  console.log('newsletter-indexability-render-check OK');
}
