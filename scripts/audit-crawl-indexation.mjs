/**
 * B04 crawl/indexation audit (read-only).
 * Repo mode (default): node scripts/audit-crawl-indexation.mjs
 * Live mode: node scripts/audit-crawl-indexation.mjs --base=https://pmstructure.com
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const frontend = path.join(root, 'frontend');

process.chdir(frontend);

const baseArg = process.argv.find((a) => a.startsWith('--base='));
const liveBase = baseArg?.slice(7)?.replace(/\/$/, '');

const NOINDEX_UTILITY_PATHS = [
  '/checkout',
  '/checkout/success',
  '/checkout/store',
  '/checkout/store/success',
  '/membership/checkout',
  '/membership/checkout/success',
  '/admin',
];

function read(rel) {
  return fs.readFileSync(path.join(frontend, rel), 'utf8');
}

function fail(msg) {
  console.error(`audit-crawl-indexation FAIL: ${msg}`);
  return false;
}

async function loadStrategyModule() {
  return import(pathToFileURL(path.join(frontend, 'content/indexation/strategy.ts')).href);
}

function hasNoindexRobotsMeta(html) {
  const matches = html.match(/<meta[^>]+name=["']robots["'][^>]*>/gi) ?? [];
  return matches.some((tag) => /noindex/i.test(tag));
}

function fetchBody(url) {
  try {
    const raw = execFileSync(
      'curl',
      ['-sL', '-m', '25', '-A', 'PMS-Crawl-Indexation-Audit/1.0', '-w', '\n__STATUS__%{http_code}', url],
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

async function runRepoChecks() {
  let ok = true;
  const check = (cond, msg) => {
    if (!cond) ok = fail(msg) && ok;
  };

  check(
    fs.existsSync(path.join(root, 'docs/internal/PMSTRUCTURE_CRAWL_INDEXATION_CONTROL.md')),
    'PMSTRUCTURE_CRAWL_INDEXATION_CONTROL.md must exist',
  );
  check(
    fs.existsSync(path.join(root, 'docs/internal/PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md')),
    'PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md must exist',
  );
  check(
    fs.existsSync(path.join(root, 'docs/internal/pmstructure-indexation-control-matrix.csv')),
    'pmstructure-indexation-control-matrix.csv must exist',
  );
  check(
    fs.existsSync(path.join(frontend, 'app/(site)/sitemap/page.tsx')),
    'HTML sitemap page must exist at app/(site)/sitemap/page.tsx',
  );
  check(
    fs.existsSync(path.join(frontend, 'content/sitemap/html-sitemap-sections.ts')),
    'html-sitemap-sections.ts must exist',
  );

  const footerContent = fs.readFileSync(path.join(frontend, 'components/Footer.tsx'), 'utf8');
  check(footerContent.includes('href="/sitemap"'), 'Footer must link to /sitemap');

  const robots = read('app/robots.ts');
  check(robots.includes('sitemap:'), 'robots.ts must declare sitemap');
  check(robots.includes('/sitemap.xml'), 'robots.ts must reference sitemap.xml');
  check(!robots.includes("disallow: '/'") && !robots.includes('Disallow: /'), 'robots.ts must not disallow entire site');

  const sitemapTs = read('app/sitemap.ts');
  check(sitemapTs.includes("path: '/sitemap'"), 'sitemap.ts must include /sitemap route');

  const storeSuccessLayout = read('app/(site)/checkout/store/success/layout.tsx');
  check(storeSuccessLayout.includes('index: false'), 'checkout/store/success layout must set robots index: false');

  const htmlSections = read('content/sitemap/html-sitemap-sections.ts');
  check(!htmlSections.includes('/checkout'), 'HTML sitemap sections must not include checkout');
  check(!htmlSections.includes('/admin'), 'HTML sitemap sections must not include admin');
  check(!htmlSections.includes('/go/'), 'HTML sitemap sections must not include /go/* portals');

  const strategyModule = await loadStrategyModule();
  const allRows = await getAllRows(strategyModule);
  check(
    allRows.some((r) => r.path === '/sitemap' && r.index),
    '/sitemap must be indexable in strategy.ts',
  );

  const { getPriorityIndexationRows, getIndexationDecisionForPath, shouldIncludeInHtmlSitemap } =
    strategyModule;
  const { isIndexablePath } = await import(pathToFileURL(path.join(frontend, 'lib/indexing-metadata.ts')).href);

  const p0Rows = getPriorityIndexationRows();
  for (const row of p0Rows) {
    check(row.decision === 'index', `P0 path ${row.path} must have index decision`);
    check(isIndexablePath(row.path), `P0 path ${row.path} must be indexable`);
  }

  for (const utilityPath of NOINDEX_UTILITY_PATHS) {
    check(!isIndexablePath(utilityPath), `${utilityPath} must be noindex in indexing-metadata.ts`);
    check(getIndexationDecisionForPath(utilityPath) === 'noindex', `${utilityPath} must be noindex decision`);
  }

  const htmlConfig = p0Rows.find((r) => r.path === '/certifications/pmp');
  if (htmlConfig) {
    check(shouldIncludeInHtmlSitemap(htmlConfig), '/certifications/pmp must be in HTML sitemap matrix');
  }

  if (ok) console.log('audit-crawl-indexation repo checks OK');
  return ok;
}

async function getAllRows(strategyModule) {
  const { getAllIndexationStrategyRows } = strategyModule;
  return getAllIndexationStrategyRows();
}

async function runLiveChecks(base) {
  let ok = true;
  const check = (cond, msg) => {
    if (!cond) ok = fail(msg) && ok;
  };

  const { getPriorityIndexationRows } = await loadStrategyModule();
  const p0Paths = getPriorityIndexationRows().map((r) => r.path);

  console.log(`audit-crawl-indexation live: ${base}\n`);

  for (const path of p0Paths) {
    const url = `${base}${path}`;
    const { status, body, error } = fetchBody(url);
    if (error) {
      check(false, `${path}: ${error}`);
      continue;
    }
    check(status >= 200 && status < 400, `${path}: HTTP ${status || 'unknown'}`);
    if (status >= 200 && status < 400) {
      check(!hasNoindexRobotsMeta(body), `${path}: must not contain noindex meta robots`);
      console.log(`OK   ${path} indexable (HTTP ${status})`);
    }
  }

  for (const path of NOINDEX_UTILITY_PATHS) {
    const url = `${base}${path}`;
    const { status, body, error } = fetchBody(url);
    if (error) {
      check(false, `${path}: ${error}`);
      continue;
    }
    if (status >= 500) {
      check(false, `${path}: HTTP ${status}`);
      continue;
    }
    if (status >= 200 && status < 400) {
      check(hasNoindexRobotsMeta(body), `${path}: must contain noindex meta robots`);
      if (hasNoindexRobotsMeta(body)) console.log(`OK   ${path} noindex (HTTP ${status})`);
    } else {
      console.log(`OK   ${path} non-200 (${status}) — skipped noindex body check`);
    }
  }

  const sitemapUrl = `${base}/sitemap`;
  const sitemapRes = fetchBody(sitemapUrl);
  check(sitemapRes.status >= 200 && sitemapRes.status < 400, `/sitemap HTML: HTTP ${sitemapRes.status || 'unknown'}`);
  if (sitemapRes.status >= 200 && sitemapRes.status < 400) {
    check(!hasNoindexRobotsMeta(sitemapRes.body), '/sitemap HTML must not contain noindex');
    console.log(`OK   /sitemap HTML indexable (HTTP ${sitemapRes.status})`);
  }

  if (ok) console.log('\naudit-crawl-indexation live checks OK');
  return ok;
}

const repoOk = await runRepoChecks();
const liveOk = liveBase ? await runLiveChecks(liveBase) : true;

process.exit(repoOk && liveOk ? 0 : 1);
