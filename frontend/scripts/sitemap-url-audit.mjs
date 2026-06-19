/**
 * Lightweight sitemap URL audit (crawl substitute when Screaming Frog unavailable).
 * Usage: node scripts/sitemap-url-audit.mjs [sitemapUrl]
 */
const sitemapUrl = process.argv[2] || 'https://pmstructure.com/sitemap.xml';

const xml = await fetch(sitemapUrl).then((r) => r.text());
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const forbidden = [
  '/api/',
  '/admin/',
  'docs/internal',
  '/thank-you',
  '/checkout',
];
const forbiddenHits = locs.filter((loc) => forbidden.some((f) => loc.includes(f)));

const priority = [
  'https://pmstructure.com/',
  'https://pmstructure.com/certifications',
  'https://pmstructure.com/certifications/pmp',
  'https://pmstructure.com/topics/pmp-exam-2026',
  'https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026',
  'https://pmstructure.com/faq',
  'https://pmstructure.com/legal/privacy',
  'https://pmstructure.com/legal/terms',
];

const sampleSize = Math.min(50, locs.length);
const sample = [];
for (let i = 0; i < sampleSize; i++) {
  const url = locs[Math.floor((i * locs.length) / sampleSize)];
  const res = await fetch(url, { redirect: 'follow' });
  sample.push({ url, status: res.status, finalUrl: res.url });
}

const failures = sample.filter((s) => s.status >= 400);

console.log(
  JSON.stringify(
    {
      capturedAt: new Date().toISOString(),
      sitemapUrl,
      urlCount: locs.length,
      priorityIncluded: Object.fromEntries(priority.map((p) => [p, locs.includes(p)])),
      forbiddenHits,
      sampleChecked: sample.length,
      sampleFailures: failures,
      legacyUrls: {
        pmp: locs.includes('https://pmstructure.com/pmp'),
        pmpExam2026: locs.includes('https://pmstructure.com/pmp-exam-2026'),
        goWebsite: locs.includes('https://pmstructure.com/go/website'),
      },
    },
    null,
    2,
  ),
);
