/**
 * Production post-fix verification fetch for B15 closeout evidence.
 * Usage: node scripts/post-fix-verification-fetch.mjs
 */
const urls = [
  'https://pmstructure.com/',
  'https://pmstructure.com/certifications',
  'https://pmstructure.com/certifications/pmp',
  'https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026',
  'https://pmstructure.com/faq',
  'https://pmstructure.com/certifications/compare',
  'https://pmstructure.com/legal/privacy',
  'https://pmstructure.com/legal/terms',
  'https://pmstructure.com/pmp',
  'https://pmstructure.com/pmp-exam-2026',
  'https://pmstructure.com/go/website',
  'https://pmstructure.com/terms',
  'https://pmstructure.com/privacy',
];

function extract(html) {
  const title = html.match(/<title[^>]*>([^<]+)/)?.[1]?.replace(/&amp;/g, '&') ?? 'N/A';
  const canon =
    html.match(/rel="canonical" href="([^"]+)"/)?.[1] ??
    html.match(/href="([^"]+)" rel="canonical"/)?.[1] ??
    'N/A';
  const robots =
    html.match(/name="robots" content="([^"]+)"/)?.[1] ??
    html.match(/content="([^"]+)" name="robots"/)?.[1] ??
    'N/A';
  const h1 = html.match(/<h1[^>]*>([^<]{1,200})/)?.[1]?.replace(/&amp;/g, '&') ?? 'N/A';
  return { title, canon, robots, h1 };
}

async function headNoFollow(url) {
  const res = await fetch(url, { redirect: 'manual' });
  return { status: res.status, location: res.headers.get('location') };
}

const results = [];
for (const url of urls) {
  const head = await headNoFollow(url);
  const res = await fetch(url, { redirect: 'follow' });
  const html = await res.text();
  const meta = extract(html);
  results.push({
    url,
    headStatus: head.status,
    redirectTo: head.location,
    finalStatus: res.status,
    finalUrl: res.url,
    ...meta,
    todoInHtml: html.includes('TODO'),
  });
}

console.log(JSON.stringify({ capturedAt: new Date().toISOString(), results }, null, 2));
