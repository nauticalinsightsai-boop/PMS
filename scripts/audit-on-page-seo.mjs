/**
 * B06 on-page SEO audit (read-only + delegates to guard scripts).
 * Usage: npm run seo:audit-on-page-seo
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const docsInternal = path.join(root, 'docs/internal');
const phase2Path = path.join(root, 'frontend/content/seo/phase-2-page-seo.ts');
const t169Path = path.join(root, 'frontend/content/pmp/flagship-t169.ts');

const B06_DOCS = [
  'PMSTRUCTURE_ARCHITECTURE_ON_PAGE_SEO.md',
  'pmstructure-keyword-url-map.csv',
  'pmstructure-on-page-seo-audit.csv',
  'pmstructure-internal-link-map.csv',
  'pmstructure-breadcrumb-map.csv',
];

let warnings = [];
let failed = false;

function fail(msg) {
  console.error(`audit-on-page-seo FAIL: ${msg}`);
  failed = true;
}

function warn(msg) {
  warnings.push(msg);
  console.warn(`audit-on-page-seo WARN: ${msg}`);
}

function runGuard(scriptRel) {
  const scriptPath = path.join(root, scriptRel);
  if (!fs.existsSync(scriptPath)) {
    fail(`guard script missing: ${scriptRel}`);
    return;
  }
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });
  if (result.status !== 0) {
    fail(`${scriptRel} exited ${result.status}`);
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  } else {
    console.log(`${scriptRel} OK`);
  }
}

function checkB06Docs() {
  for (const name of B06_DOCS) {
    const p = path.join(docsInternal, name);
    if (!fs.existsSync(p)) {
      fail(`missing B06 artifact: docs/internal/${name}`);
    }
  }
  if (!failed) console.log('B06 docs/CSVs present');
}

function parsePhase2Entries(source) {
  const seoSection = source.split('export const PHASE_2_RELATED_BLOCKS')[0] ?? source;
  const entries = [];
  const blockRe = /^\s+'(\/[^']+)':\s*\{/gm;
  let match;
  while ((match = blockRe.exec(seoSection)) !== null) {
    const route = match[1];
    const start = match.index;
    const next = seoSection.indexOf("\n  '/", start + 1);
    const block = next > start ? seoSection.slice(start, next) : seoSection.slice(start);
    const title = block.match(/title:\s*'([^']+)'/)?.[1];
    const description = block.match(/description:\s*\n?\s*'([^']+)'/)?.[1];
    if (title) entries.push({ route, title, description: description ?? '' });
  }
  return entries;
}

function checkTitleMetaBands(entries) {
  for (const { route, title, description } of entries) {
    const titleLen = title.length;
    if (titleLen < 40 || titleLen > 65) {
      warn(`${route} title length ${titleLen} (target 40–60): "${title}"`);
    }
    if (description) {
      const metaLen = description.length;
      if (metaLen < 100 || metaLen > 170) {
        warn(`${route} meta length ${metaLen} (target 120–160): "${description.slice(0, 60)}…"`);
      }
    }
  }

  const titleCounts = new Map();
  const descCounts = new Map();
  for (const { title, description } of entries) {
    titleCounts.set(title, (titleCounts.get(title) ?? 0) + 1);
    if (description) descCounts.set(description, (descCounts.get(description) ?? 0) + 1);
  }
  for (const [title, count] of titleCounts) {
    if (count > 1) fail(`duplicate phase-2 title (${count}x): "${title}"`);
  }
  for (const [desc, count] of descCounts) {
    if (count > 1) fail(`duplicate phase-2 description (${count}x): "${desc.slice(0, 50)}…"`);
  }
}

function checkHomepageT169Alignment() {
  if (!fs.existsSync(t169Path) || !fs.existsSync(phase2Path)) return;
  const t169 = fs.readFileSync(t169Path, 'utf8');
  const phase2 = fs.readFileSync(phase2Path, 'utf8');
  const homeTitleT169 = t169.match(/homeTitle:\s*'([^']+)'/)?.[1];
  const homeTitlePhase2 = phase2.match(/'\/':\s*\{[\s\S]*?title:\s*'([^']+)'/)?.[1];
  if (homeTitleT169 && homeTitlePhase2 && homeTitleT169 !== homeTitlePhase2) {
    warn(`homepage title mismatch T169 vs phase-2:\n  T169: ${homeTitleT169}\n  phase-2: ${homeTitlePhase2}`);
  } else if (homeTitleT169) {
    console.log(`homepage T169/phase-2 title aligned: "${homeTitleT169}"`);
  }
}

console.log('audit-on-page-seo: starting B06 checks…\n');

checkB06Docs();

if (fs.existsSync(phase2Path)) {
  const entries = parsePhase2Entries(fs.readFileSync(phase2Path, 'utf8'));
  console.log(`phase-2 routes scanned: ${entries.length}`);
  checkTitleMetaBands(entries);
} else {
  fail('phase-2-page-seo.ts missing');
}

checkHomepageT169Alignment();

console.log('\naudit-on-page-seo: running guard scripts…\n');
runGuard('scripts/seo/architecture-check.mjs');
runGuard('scripts/seo/keyword-map-check.mjs');
runGuard('scripts/seo/internal-links-check.mjs');

if (warnings.length) {
  console.log(`\naudit-on-page-seo: ${warnings.length} warning(s)`);
}

if (failed) {
  process.exit(1);
}

console.log('\naudit-on-page-seo OK');
