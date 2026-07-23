/**
 * T-038 indexation strategy audit (read-only).
 * Repo mode (default): node scripts/audit-indexation-strategy.mjs
 * Live mode: node scripts/audit-indexation-strategy.mjs --base=https://pmstructure.com
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

const SITEMAP_BLOCKED_PREFIXES = [
  '/admin',
  '/checkout',
  '/membership/checkout',
  '/api',
  '/compare',
  '/store',
];

const SITEMAP_BLOCKED_EXACT = ['/go'];

const INDEXABLE_PORTAL_PATHS = ['/go/website'];

function read(rel) {
  return fs.readFileSync(path.join(frontend, rel), 'utf8');
}

function fail(msg) {
  console.error(`audit-indexation-strategy FAIL: ${msg}`);
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
      ['-sL', '-m', '25', '-A', 'PMS-Indexation-Strategy-Audit/1.0', '-w', '\n__STATUS__%{http_code}', url],
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

  check(fs.existsSync(path.join(root, 'docs/internal/PMSTRUCTURE_INDEXATION_STRATEGY.md')), 'PMSTRUCTURE_INDEXATION_STRATEGY.md must exist');
  check(fs.existsSync(path.join(root, 'docs/internal/pmstructure-indexation-strategy.csv')), 'pmstructure-indexation-strategy.csv must exist');

  const storeSuccessLayout = read('app/(site)/checkout/store/success/layout.tsx');
  check(storeSuccessLayout.includes('index: false'), 'checkout/store/success layout must set robots index: false');
  check(storeSuccessLayout.includes('follow: false'), 'checkout/store/success layout must set robots follow: false');
  check(storeSuccessLayout.includes('/checkout/store/success'), 'checkout/store/success layout must reference correct path');

  const indexingMeta = read('lib/indexing-metadata.ts');
  check(indexingMeta.includes("'/checkout'"), 'indexing-metadata must noindex /checkout prefix');
  check(indexingMeta.includes("'/admin'"), 'indexing-metadata must noindex /admin prefix');
  check(indexingMeta.includes("NOINDEX_EXACT_PATHS"), 'indexing-metadata must define NOINDEX_EXACT_PATHS');
  check(indexingMeta.includes("'/go'"), 'indexing-metadata must keep exact /go redirect noindex');

  const sitemapSrc = read('app/sitemap.ts');
  check(sitemapSrc.includes('getPublishedGoChannelSlugs'), 'sitemap.ts must include published /go channel slugs');

  const sitemapHelpers = read('lib/sitemap/helpers.ts');
  check(sitemapHelpers.includes('assertIndexable'), 'sitemap helpers must define assertIndexable');
  check(sitemapHelpers.includes('isIndexablePath'), 'sitemap helpers must use isIndexablePath');

  const { getPriorityIndexationRows, getIndexationDecisionForPath, getAllIndexationStrategyRows } =
    await loadStrategyModule();
  const { isIndexablePath } = await import(pathToFileURL(path.join(frontend, 'lib/indexing-metadata.ts')).href);

  const p0Rows = getPriorityIndexationRows();
  check(p0Rows.length >= 7, `expected at least 7 P0 priority rows, got ${p0Rows.length}`);

  for (const row of p0Rows) {
    check(row.decision === 'index', `P0 path ${row.path} must have index decision (got ${row.decision})`);
    check(row.index === true, `P0 path ${row.path} must have index=true`);
    check(isIndexablePath(row.path), `P0 path ${row.path} must be indexable in indexing-metadata.ts`);
    check(getIndexationDecisionForPath(row.path) === 'index', `P0 path ${row.path} must resolve to index decision`);
  }

  for (const utilityPath of NOINDEX_UTILITY_PATHS) {
    check(!isIndexablePath(utilityPath), `${utilityPath} must be noindex in indexing-metadata.ts`);
    const decision = getIndexationDecisionForPath(utilityPath);
    check(decision === 'noindex', `${utilityPath} strategy decision must be noindex (got ${decision})`);
  }

  for (const prefix of SITEMAP_BLOCKED_PREFIXES) {
    check(!isIndexablePath(prefix), `sitemap guard: ${prefix} must not be indexable`);
  }
  for (const exact of SITEMAP_BLOCKED_EXACT) {
    check(!isIndexablePath(exact), `sitemap guard: ${exact} must not be indexable`);
  }

  check(getIndexationDecisionForPath('/compare') === 'redirect', '/compare must be redirect decision');
  check(getIndexationDecisionForPath('/store') === 'redirect', '/store must be redirect decision');
  check(getIndexationDecisionForPath('/go/website') === 'index', '/go/website must be index decision');
  check(isIndexablePath('/go/website'), '/go/website must be indexable in indexing-metadata.ts');

  const goRows = getAllIndexationStrategyRows().filter((row) => row.path.startsWith('/go/'));
  check(goRows.length > 0, 'expected at least one /go/* strategy row');
  for (const row of goRows) {
    check(row.decision === 'index', `${row.path} strategy decision must be index (got ${row.decision})`);
    check(row.includeInSitemap === true, `${row.path} must have includeInSitemap=true`);
  }

  if (ok) console.log('audit-indexation-strategy repo checks OK');
  return ok;
}

async function runLiveChecks(base) {
  let ok = true;
  const check = (cond, msg) => {
    if (!cond) ok = fail(msg) && ok;
  };

  const { getPriorityIndexationRows } = await loadStrategyModule();
  const p0Paths = getPriorityIndexationRows().map((r) => r.path);

  console.log(`audit-indexation-strategy live: ${base}\n`);

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

  for (const path of INDEXABLE_PORTAL_PATHS) {
    const url = `${base}${path}`;
    const { status, body, error } = fetchBody(url);
    if (error) {
      check(false, `${path}: ${error}`);
      continue;
    }
    check(status >= 200 && status < 400, `${path}: HTTP ${status || 'unknown'}`);
    if (status >= 200 && status < 400) {
      check(!hasNoindexRobotsMeta(body), `${path}: portal must not contain noindex meta robots`);
      if (!hasNoindexRobotsMeta(body)) console.log(`OK   ${path} portal indexable (HTTP ${status})`);
    }
  }

  if (ok) console.log('\naudit-indexation-strategy live checks OK');
  return ok;
}

const repoOk = await runRepoChecks();
const liveOk = liveBase ? await runLiveChecks(liveBase) : true;

process.exit(repoOk && liveOk ? 0 : 1);
