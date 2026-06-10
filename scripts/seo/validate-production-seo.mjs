/**
 * Post-deploy production SEO smoke (read-only fetches).
 * Usage: node scripts/seo/validate-production-seo.mjs
 */
import { writeReport } from './lib/report-writer.mjs';

const base = process.env.PMS_SITE_URL ?? 'https://pmstructure.com';
const paths = ['/', '/sitemap.xml', '/robots.txt', '/pmp-faq', '/faq', '/llms.txt'];
const results = [];

for (const p of paths) {
  const url = `${base}${p}`;
  try {
    const res = await fetch(url, { redirect: 'follow' });
    results.push({ url, status: res.status, ok: res.ok });
  } catch (err) {
    results.push({ url, ok: false, error: err.message });
  }
}

const failed = results.filter((r) => !r.ok);
writeReport('production-check', { base, results, failed: failed.length });
if (failed.length) {
  console.error('production-check FAIL', failed);
  process.exit(1);
}
console.log('production-check OK', results.length, 'URLs');
