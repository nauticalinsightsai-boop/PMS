/**
 * T-022 live QA: title, meta description, canonical, H1 on priority URLs.
 */
const base = (process.argv.find((a) => a.startsWith('--base='))?.slice(7) ?? 'https://pmstructure.com').replace(/\/$/, '');

const paths = [
  '/',
  '/certifications',
  '/certifications/pmp',
  '/answers/is-the-pmp-exam-changing-in-2026',
  '/topics/pmp-exam-2026',
  '/faq',
  '/certifications/compare',
];

function pick(html, patterns) {
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1].replace(/\s+/g, ' ').trim();
  }
  return '(missing)';
}

let failed = false;

for (const path of paths) {
  const res = await fetch(`${base}${path}`, { headers: { 'User-Agent': 'PMS-T022-QA/1.0' } });
  const html = await res.text();
  const title = pick(html, [/<title[^>]*>([^<]+)<\/title>/i]);
  const description = pick(html, [
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i,
  ]);
  const canonical = pick(html, [
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i,
  ]);
  const h1 = pick(html, [/<h1[^>]*>([\s\S]*?)<\/h1>/i]).replace(/<[^>]+>/g, '');

  console.log(`\n--- ${path} (${res.status})`);
  console.log(`title: ${title}`);
  console.log(`description: ${description.slice(0, 100)}${description.length > 100 ? '…' : ''}`);
  console.log(`canonical: ${canonical}`);
  console.log(`h1: ${h1.slice(0, 120)}`);

  if (res.status !== 200) failed = true;
  if (!canonical.startsWith('https://pmstructure.com')) failed = true;
  if (canonical.includes('www.')) failed = true;
}

if (failed) process.exit(1);
console.log('\nT-022 live QA OK');
