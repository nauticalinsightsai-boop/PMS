/**
 * Verify pre-rendered HTML contains expected H1 and crawlable content (run after next build).
 * Covers Phase 17 local crawlability checks (production crawl uses seo:production-check).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(__dirname, '../../frontend/.next/server/app');

const checks = [
  {
    label: 'homepage',
    file: 'index.html',
    mustInclude: ['<h1', 'pmp'],
    minTextLen: 2000,
    navLinks: ['/certifications', '/faq'],
  },
  { label: 'faq', file: 'faq.html', mustInclude: ['<h1', 'faq'] },
  { label: 'pmp-faq', file: 'pmp-faq.html', mustInclude: ['<h1', 'pmp'] },
  {
    label: 'pmp-exam-2026',
    file: path.join('pmp-exam-2026.html'),
    mustInclude: ['<h1', '2026', 'direct answer'],
  },
  {
    label: 'answers-changing-2026',
    file: path.join('answers', 'is-the-pmp-exam-changing-in-2026.html'),
    mustInclude: ['<h1', 'changing', 'short answer'],
  },
  {
    label: 'topics-pmp-2026',
    file: path.join('topics', 'pmp-exam-2026.html'),
    mustInclude: ['<h1', 'pmp'],
  },
  {
    label: 'certifications-compare',
    file: path.join('certifications', 'compare.html'),
    mustInclude: ['compare project management certifications'],
    navLinks: [
      '/certifications/pmp',
      '/certifications/prince2-practitioner',
      '/certifications/pmi-rmp',
      '/certifications/lss-yellow',
      '/certifications/lss-black',
    ],
  },
  {
    label: 'certifications-pmp',
    file: path.join('certifications', 'pmp.html'),
    mustInclude: ['<h1', 'pmp'],
  },
  {
    label: 'legal-regional-pricing',
    file: path.join('legal', 'regional-pricing.html'),
    mustInclude: ['<h1', 'regional'],
  },
  {
    label: 'pmp-foundation-pathway',
    file: path.join('pmp-foundation.html'),
    mustInclude: ['<h1', 'foundation'],
  },
  { label: 'answers-index', file: path.join('answers.html'), mustInclude: ['<h1'] },
  { label: 'topics-index', file: path.join('topics.html'), mustInclude: ['<h1'] },
];

function htmlHasLink(html, href) {
  return (
    html.includes(`href="${href}"`) ||
    html.includes(`href='${href}'`) ||
    html.includes(`"href":"${href}"`) ||
    html.includes(`\\"href\\":\\"${href}\\"`)
  );
}

function visibleTextLen(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().length;
}

let failed = false;
let checked = 0;

for (const { label, file, mustInclude, minTextLen, navLinks } of checks) {
  const filePath = path.join(appDir, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`render-check skip ${label}: missing ${file} (run next build first)`);
    continue;
  }
  checked++;
  const html = fs.readFileSync(filePath, 'utf8');
  const lower = html.toLowerCase();
  let routeFailed = false;

  for (const needle of mustInclude) {
    if (!lower.includes(needle.toLowerCase())) {
      console.error(`render-check FAIL ${label}: expected "${needle}" in ${file}`);
      failed = true;
      routeFailed = true;
    }
  }

  if (minTextLen && visibleTextLen(html) < minTextLen) {
    console.error(
      `render-check FAIL ${label}: meaningful HTML too short (${visibleTextLen(html)} < ${minTextLen})`,
    );
    failed = true;
    routeFailed = true;
  }

  if (lower.includes('loading...') && visibleTextLen(html) < 500) {
    console.error(`render-check FAIL ${label}: page appears loading-only shell`);
    failed = true;
    routeFailed = true;
  }

  if (navLinks) {
    for (const href of navLinks) {
      if (!htmlHasLink(html, href)) {
        console.error(`render-check FAIL ${label}: missing crawlable link ${href}`);
        failed = true;
        routeFailed = true;
      }
    }
  }

  if (!routeFailed) console.log(`render-check OK ${label}`);
}

const regionGate = fs.readFileSync(
  path.join(__dirname, '../../frontend/components/RegionGate.tsx'),
  'utf8',
);
if (!regionGate.includes('without blocking') && !regionGate.includes('immediately')) {
  console.error('render-check FAIL: RegionGate must not block SSR body for crawlers');
  failed = true;
} else {
  console.log('render-check OK regiongate-nonblocking');
}

if (checked === 0) {
  console.warn('render-check: no HTML files found: run npm run build -w @pms/frontend first');
  process.exit(0);
}

if (failed) process.exit(1);
console.log(`render-check complete (${checked} routes)`);