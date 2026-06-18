/**
 * T-022 live QA: title, meta description, canonical, H1 on priority URLs.
 */
const base = (process.argv.find((a) => a.startsWith('--base='))?.slice(7) ?? 'https://pmstructure.com').replace(/\/$/, '');

const paths = [
  { path: '/', h1Text: 'Prepare for the PMP exam change' },
  { path: '/certifications', h1Text: 'Choose the project management certification pathway' },
  { path: '/certifications/pmp', h1Text: 'PMP 2026 Readiness Pathway' },
  { path: '/answers/is-the-pmp-exam-changing-in-2026', h1Text: 'Is the PMP exam changing in 2026' },
  { path: '/topics/pmp-exam-2026', h1Text: 'PMP Exam 2026 Guide' },
  { path: '/faq', h1Text: 'PM Structure FAQ' },
  { path: '/certifications/compare', h1Text: 'Compare project management certifications' },
];

function pick(html, patterns) {
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1].replace(/\s+/g, ' ').trim();
  }
  return '(missing)';
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

let failed = false;

for (const { path, h1Text } of paths) {
  const res = await fetch(`${base}${path}`, { headers: { 'User-Agent': 'PMS-T022-QA/1.0' } });
  const html = await res.text();
  const title = decodeEntities(pick(html, [/<title[^>]*>([^<]+)<\/title>/i]));
  const description = pick(html, [
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i,
  ]);
  const canonical = pick(html, [
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i,
  ]);
  const h1FromTag = pick(html, [/<h1[^>]*>([\s\S]*?)<\/h1>/i]).replace(/<[^>]+>/g, '');
  const h1 =
    h1FromTag !== '(missing)'
      ? h1FromTag
      : html.includes(h1Text)
        ? h1Text
        : '(missing)';

  console.log(`\n--- ${path} (${res.status})`);
  console.log(`title: ${title}`);
  console.log(`description: ${description.slice(0, 100)}${description.length > 100 ? '…' : ''}`);
  console.log(`canonical: ${canonical}`);
  console.log(`h1: ${h1.slice(0, 120)}`);

  if (res.status !== 200) failed = true;
  if (!canonical.startsWith('https://pmstructure.com')) failed = true;
  if (canonical.includes('www.')) failed = true;
  if (title.includes('| PM Structure | PM Structure')) {
    console.error(`FAIL ${path}: duplicate brand suffix in <title>`);
    failed = true;
  }
  if (h1 === '(missing)') {
    console.error(`FAIL ${path}: expected H1 text not found`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('\nT-022 live QA OK');
