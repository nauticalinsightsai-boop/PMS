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
  '/go',
];

const SITEMAP_BLOCKED_EXACT = ['/go'];

const NOINDEX_PORTAL_PATHS = [
  '/go/instagram',
  '/go/linkedin',
  '/go/facebook',
  '/go/snapchat',
  '/go/whatsapp',
  '/go/telegram',
];

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

function hasNofollowRobotsMeta(html) {
  const matches = html.match(/<meta[^>]+name=["']robots["'][^>]*>/gi) ?? [];
  return matches.some((tag) => /nofollow/i.test(tag));
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
  check(
    !sitemapSrc.includes('getPublishedGoChannelSlugs'),
    'sitemap.ts must not generate /go/* channel entries',
  );

  for (const submissionScript of [
    '../scripts/seo/indexnow.mjs',
    '../scripts/seo/prepare-submission-list.mjs',
    '../scripts/seo/owner-prereq-check.mjs',
  ]) {
    const source = fs.readFileSync(path.join(frontend, submissionScript), 'utf8');
    check(!/['"]\/go\/[^'"]+['"]/.test(source), `${submissionScript} must not submit noindex /go/* URLs`);
    check(
      !source.includes('/topics/pmp-exam-2026'),
      `${submissionScript} must not submit obsolete /topics/pmp-exam-2026`,
    );
    check(
      source.includes('/pmp-exam-2026'),
      `${submissionScript} must retain canonical /pmp-exam-2026`,
    );
  }

  const sitemapHelpers = read('lib/sitemap/helpers.ts');
  check(sitemapHelpers.includes('assertIndexable'), 'sitemap helpers must define assertIndexable');
  check(sitemapHelpers.includes('isIndexablePath'), 'sitemap helpers must use isIndexablePath');

  const {
    getPriorityIndexationRows,
    getIndexationDecisionForPath,
    getAllIndexationStrategyRows,
    shouldIncludeInHtmlSitemap,
  } = await loadStrategyModule();
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
  for (const path of NOINDEX_PORTAL_PATHS) {
    check(!isIndexablePath(path), `${path} must be noindex in indexing-metadata.ts`);
    check(
      getIndexationDecisionForPath(path) === 'noindex',
      `${path} must have noindex strategy decision`,
    );
  }
  check(getIndexationDecisionForPath('/go') === 'redirect', '/go exact must be redirect decision');
  check(!isIndexablePath('/go'), '/go exact must not be organic index');
  check(isIndexablePath('/newsletter'), '/newsletter hub must be indexable');
  check(
    getIndexationDecisionForPath('/newsletter') === 'index',
    '/newsletter hub must have index decision',
  );
  const newsletterRow = getAllIndexationStrategyRows().find((row) => row.path === '/newsletter');
  check(Boolean(newsletterRow), '/newsletter strategy row must exist');
  if (newsletterRow) {
    check(newsletterRow.index === true, '/newsletter strategy row must have index=true');
    check(newsletterRow.follow === true, '/newsletter strategy row must have follow=true');
    check(
      newsletterRow.includeInSitemap === true,
      '/newsletter strategy row must have includeInSitemap=true',
    );
    check(
      shouldIncludeInHtmlSitemap(newsletterRow),
      '/newsletter strategy row must be included in HTML sitemap',
    );
  }
  check(!isIndexablePath('/legal/cookies'), '/legal/cookies must be soft-noindex');
  check(isIndexablePath('/membership'), '/membership must stay indexable');
  check(isIndexablePath('/pm-service'), '/pm-service must stay indexable');
  check(isIndexablePath('/legal/privacy'), '/legal/privacy must stay indexable');

  const goRows = getAllIndexationStrategyRows().filter((row) => row.path.startsWith('/go/'));
  check(goRows.length > 0, 'expected at least one /go/* strategy row');
  for (const row of goRows) {
    check(row.decision === 'noindex', `${row.path} strategy decision must be noindex`);
    check(row.index === false, `${row.path} must have index=false`);
    check(row.follow === false, `${row.path} must have follow=false`);
    check(row.includeInSitemap === false, `${row.path} must be excluded from XML sitemap`);
    check(!shouldIncludeInHtmlSitemap(row), `${row.path} must be excluded from HTML sitemap`);
  }

  const newsletterPage = read('components/pages/Newsletter.tsx');
  const heroFormCount = (newsletterPage.match(/<NewsletterHeroSubscribeForm\b/g) ?? []).length;
  const footerFormCount = (newsletterPage.match(/<NewsletterSubscribeForm\b/g) ?? []).length;
  check(heroFormCount === 1, `newsletter hub must render one hero form (found ${heroFormCount})`);
  check(footerFormCount === 1, `newsletter hub must render one footer form (found ${footerFormCount})`);

  const newsletterArticlePage = read('app/(site)/newsletter/[slug]/page.tsx');
  check(
    newsletterArticlePage.includes('isDraftPreview ? { index: false, follow: false } : undefined'),
    'newsletter draft previews must retain noindex,nofollow metadata',
  );

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

  for (const path of NOINDEX_PORTAL_PATHS) {
    const url = `${base}${path}?utm_source=packet04c&utm_medium=seo&utm_campaign=go_containment`;
    const { status, body, error } = fetchBody(url);
    if (error) {
      check(false, `${path}: ${error}`);
      continue;
    }
    check(status >= 200 && status < 400, `${path}: HTTP ${status || 'unknown'}`);
    if (status >= 200 && status < 400) {
      check(hasNoindexRobotsMeta(body), `${path}: portal must contain noindex meta robots`);
      check(hasNofollowRobotsMeta(body), `${path}: portal must contain nofollow meta robots`);
      if (hasNoindexRobotsMeta(body) && hasNofollowRobotsMeta(body)) {
        console.log(`OK   ${path} portal noindex,nofollow with query handoff (HTTP ${status})`);
      }
    }
  }

  if (ok) console.log('\naudit-indexation-strategy live checks OK');
  return ok;
}

const repoOk = await runRepoChecks();
const liveOk = liveBase ? await runLiveChecks(liveBase) : true;

process.exit(repoOk && liveOk ? 0 : 1);
