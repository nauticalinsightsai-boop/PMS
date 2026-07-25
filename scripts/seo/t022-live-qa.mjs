/**
 * T-022 live QA: title, meta description, canonical, H1, and priority internal links.
 * Usage: node scripts/seo/t022-live-qa.mjs [--base=https://pmstructure.com]
 */
const base = (process.argv.find((a) => a.startsWith('--base='))?.slice(7) ?? 'https://pmstructure.com').replace(
  /\/$/,
  '',
);

const checks = [
  {
    path: '/',
    h1Text: 'Prepare for the PMP exam change',
    links: ['/certifications/pmp', '/certifications/compare', '/faq'],
  },
  {
    path: '/certifications',
    h1Text: 'Choose the project management certification pathway',
    links: ['/certifications/pmp', '/certifications/compare'],
  },
  {
    path: '/certifications/pmp',
    h1Text: 'PMP 2026 Readiness Pathway',
    links: [
      '/answers/is-the-pmp-exam-changing-in-2026',
      '/pmp-exam-2026',
      '/faq',
      '/certifications/compare',
    ],
  },
  {
    path: '/answers/is-the-pmp-exam-changing-in-2026',
    h1Text: 'Is the PMP exam changing in 2026',
    links: ['/certifications/pmp', '/pmp-exam-2026', '/faq'],
  },
  {
    path: '/pmp-exam-2026',
    h1Text: 'PMP Exam 2026',
    links: ['/certifications/pmp', '/answers/is-the-pmp-exam-changing-in-2026', '/certifications/compare'],
  },
  {
    path: '/faq',
    h1Text: 'PM Structure FAQ',
    links: ['/certifications/pmp'],
    titleMustNotInclude: '| PM Structure | PM Structure',
  },
  {
    path: '/certifications/compare',
    h1Text: 'Compare project management certifications',
    links: [
      '/certifications/pmp',
      '/certifications/prince2-practitioner',
      '/certifications/pmi-rmp',
      '/certifications/lss-yellow',
      '/certifications/lss-black',
    ],
  },
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

function countBrandSuffix(title) {
  return (title.match(/\|\s*PM Structure/gi) ?? []).length;
}

function htmlHasLink(html, href) {
  return (
    html.includes(`href="${href}"`) ||
    html.includes(`href='${href}'`) ||
    html.includes(`"href":"${href}"`) ||
    html.includes(`\\"href\\":\\"${href}\\"`)
  );
}

let failed = false;

for (const { path, h1Text, links = [], titleMustNotInclude } of checks) {
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
    h1FromTag !== '(missing)' ? h1FromTag : html.includes(h1Text) ? h1Text : '(missing)';

  console.log(`\n--- ${path} (${res.status})`);
  console.log(`title: ${title}`);
  console.log(`description: ${description.slice(0, 100)}${description.length > 100 ? '…' : ''}`);
  console.log(`canonical: ${canonical}`);
  console.log(`h1: ${h1.slice(0, 120)}`);

  if (res.status !== 200) {
    console.error(`FAIL ${path}: HTTP ${res.status}`);
    failed = true;
  }
  if (!canonical.startsWith('https://pmstructure.com')) {
    console.error(`FAIL ${path}: canonical not apex https://pmstructure.com (${canonical})`);
    failed = true;
  }
  if (canonical.includes('www.')) {
    console.error(`FAIL ${path}: canonical uses www`);
    failed = true;
  }
  if (countBrandSuffix(title) > 1 || title.includes('| PM Structure | PM Structure')) {
    console.error(`FAIL ${path}: duplicate brand suffix in <title>`);
    failed = true;
  }
  if (titleMustNotInclude && title.includes(titleMustNotInclude)) {
    console.error(`FAIL ${path}: title contains "${titleMustNotInclude}"`);
    failed = true;
  }
  if (h1 === '(missing)') {
    console.error(`FAIL ${path}: expected H1 text not found`);
    failed = true;
  }
  for (const href of links) {
    if (!htmlHasLink(html, href)) {
      console.error(`FAIL ${path}: missing internal link ${href}`);
      failed = true;
    } else {
      console.log(`link OK: ${href}`);
    }
  }
}

if (failed) process.exit(1);
console.log('\nT-022 live QA OK');
