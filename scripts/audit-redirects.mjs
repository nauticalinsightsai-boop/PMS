/**

 * T-037 / B05 redirect audit (read-only).

 * Repo guard (default): node scripts/audit-redirects.mjs

 * Live mode: node scripts/audit-redirects.mjs --base=https://pmstructure.com

 */

import fs from 'fs';

import path from 'path';

import { execFileSync } from 'child_process';

import { fileURLToPath, pathToFileURL } from 'url';



const __dirname = path.dirname(fileURLToPath(import.meta.url));

const root = path.join(__dirname, '..');

const frontend = path.join(root, 'frontend');



const baseArg = process.argv.find((a) => a.startsWith('--base='));

const liveBase = baseArg?.slice(7)?.replace(/\/$/, '');



const REDIRECT_STATUS = new Set([301, 302, 303, 307, 308]);



const LEGACY_HREF_PATTERNS = [

  { pattern: /href=["']\/compare["']/g, label: '/compare' },

  { pattern: /href=["']\/store["']/g, label: '/store' },

  { pattern: /href=["']\/privacy["']/g, label: '/privacy' },

  { pattern: /href=["']\/legalhub/g, label: '/legalhub' },

];



const LEGACY_HREF_SCAN_DIRS = ['components', 'app/(site)'];



const LIVE_CANONICAL_HOST_URLS = [

  'http://pmstructure.com/',

  'http://www.pmstructure.com/',

  'https://www.pmstructure.com/',

  'https://www.pmstructure.com/certifications/pmp?source=test',

];



function read(rel) {

  return fs.readFileSync(path.join(frontend, rel), 'utf8');

}



function fail(msg) {

  console.error(`audit-redirects FAIL: ${msg}`);

  return false;

}



function walkTsxFiles(dir, acc = []) {

  if (!fs.existsSync(dir)) return acc;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {

    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) walkTsxFiles(full, acc);

    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) acc.push(full);

  }

  return acc;

}



function runLegacyHrefChecks() {

  let ok = true;

  const check = (cond, msg) => {

    if (!cond) ok = fail(msg) && ok;

  };



  for (const relDir of LEGACY_HREF_SCAN_DIRS) {

    const absDir = path.join(frontend, relDir);

    for (const file of walkTsxFiles(absDir)) {

      const rel = path.relative(frontend, file).replace(/\\/g, '/');

      if (rel.includes('/compare/page.tsx') || rel.includes('/store/page.tsx')) continue;

      const content = fs.readFileSync(file, 'utf8');

      for (const { pattern, label } of LEGACY_HREF_PATTERNS) {

        pattern.lastIndex = 0;

        if (pattern.test(content)) {

          check(false, `legacy href ${label} found in ${rel} — use final URL`);

        }

      }

    }

  }



  if (ok) console.log('audit-redirects legacy href scan OK');

  return ok;

}



function runRepoChecks() {

  let ok = true;

  const check = (cond, msg) => {

    if (!cond) ok = fail(msg) && ok;

  };



  check(

    fs.existsSync(path.join(root, 'docs/internal/PMSTRUCTURE_REDIRECT_URL_CANONICALIZATION.md')),

    'PMSTRUCTURE_REDIRECT_URL_CANONICALIZATION.md must exist',

  );

  check(

    fs.existsSync(path.join(root, 'docs/internal/pmstructure-redirect-map.csv')),

    'pmstructure-redirect-map.csv must exist',

  );

  check(

    fs.existsSync(path.join(root, 'docs/internal/pmstructure-302-audit.csv')),

    'pmstructure-302-audit.csv must exist',

  );

  check(

    fs.existsSync(path.join(root, 'docs/internal/pmstructure-410-review.csv')),

    'pmstructure-410-review.csv must exist',

  );



  const goPage = read('app/go/page.tsx');

  const comparePage = read('app/(site)/compare/page.tsx');

  const storePage = read('app/(site)/store/page.tsx');

  const nextConfig = read('next.config.ts');

  const canonicalHost = read('lib/canonical-host.ts');

  const indexingMeta = read('lib/indexing-metadata.ts');



  check(goPage.includes('permanentRedirect('), 'app/go/page.tsx must use permanentRedirect()');

  check(comparePage.includes('permanentRedirect('), 'compare page must use permanentRedirect()');

  check(storePage.includes('permanentRedirect('), 'store page must use permanentRedirect()');

  check(!goPage.includes("redirect('/go/website')"), 'app/go/page.tsx must not use temporary redirect()');

  check(nextConfig.includes("source: '/go'"), 'next.config.ts must include permanent /go redirect');

  check(nextConfig.includes("destination: '/go/website'"), 'next.config.ts /go destination must be /go/website');

  check(

    /source: '\/admin'[\s\S]*?permanent: false/.test(nextConfig),

    '/admin → /admin/login must stay temporary (permanent: false)',

  );

  check(canonicalHost.includes('301'), 'canonical-host middleware must use 301');

  check(

    nextConfig.includes("value: 'www.pmstructure.com'") && nextConfig.includes('permanent: true'),

    'www host redirect must be permanent in next.config.ts',

  );

  check(indexingMeta.includes("'/compare'"), 'indexing-metadata must noindex /compare');

  check(indexingMeta.includes("'/store'"), 'indexing-metadata must noindex /store');



  ok = runLegacyHrefChecks() && ok;



  if (ok) console.log('audit-redirects repo checks OK');

  return ok;

}



function resolveLocation(baseUrl, location) {

  if (!location) return null;

  try {

    return new URL(location, baseUrl).href;

  } catch {

    return null;

  }

}



function fetchRedirectChain(startUrl, maxHops = 10) {

  const chain = [];

  let url = startUrl;

  const seen = new Set();



  for (let hop = 0; hop < maxHops; hop++) {

    if (seen.has(url)) {

      return { chain, loop: true, finalUrl: url, finalStatus: 0 };

    }

    seen.add(url);



    let raw;

    try {

      raw = execFileSync(

        'curl',

        ['-sI', '-m', '25', '-A', 'PMS-Redirect-Audit/1.0', url],

        { encoding: 'utf8', maxBuffer: 1024 * 1024 },

      );

    } catch (err) {

      return { chain, loop: false, finalUrl: url, finalStatus: 0, error: err.message };

    }



    const statusMatch = raw.match(/^HTTP\/[\d.]+ (\d{3})/m);

    const status = statusMatch ? Number(statusMatch[1]) : 0;

    const locationMatch = raw.match(/^location:\s*(.+)$/im);

    const location = locationMatch ? locationMatch[1].trim() : null;



    chain.push({ url, status, location });



    if (!REDIRECT_STATUS.has(status) || !location) {

      return { chain, loop: false, finalUrl: url, finalStatus: status };

    }



    url = resolveLocation(url, location);

    if (!url) {

      return { chain, loop: false, finalUrl: startUrl, finalStatus: status, error: 'bad Location header' };

    }

  }



  return { chain, loop: false, finalUrl: url, finalStatus: 0, error: 'max hops exceeded' };

}



async function getLiveRedirectPaths() {

  process.chdir(frontend);

  try {

    const { getLiveAuditRedirectPaths } = await import(

      pathToFileURL(path.join(frontend, 'content/redirects/inventory.ts')).href

    );

    return getLiveAuditRedirectPaths();

  } catch {

    return ['/go', '/compare', '/store', '/privacy', '/legalhub', '/login', '/dashboard', '/admin'];

  }

}



async function runLiveChecks(base) {

  let ok = true;

  console.log(`\nLive redirect audit: ${base}\n`);



  const livePaths = await getLiveRedirectPaths();



  for (const pathSuffix of livePaths) {

    const url = `${base}${pathSuffix}`;

    const result = fetchRedirectChain(url);

    const hops = result.chain.length;

    const first = result.chain[0];

    const label = pathSuffix;



    if (result.error) {

      ok = fail(`${label}: ${result.error}`) && ok;

      continue;

    }

    if (result.loop) {

      ok = fail(`${label}: redirect loop detected`) && ok;

      continue;

    }



    const isRedirect = first && REDIRECT_STATUS.has(first.status);

    if (!isRedirect && pathSuffix !== '/admin') {

      ok = fail(`${label}: expected redirect, got ${first?.status ?? 'unknown'}`) && ok;

      continue;

    }



    if (pathSuffix === '/go' && first?.status === 307) {

      ok = fail(`${label}: still temporary 307 (expected 308/301)`) && ok;

    }

    if (pathSuffix === '/admin' && first?.status !== 307 && first?.status !== 302) {

      if (first?.status === 308) {

        console.warn(`audit-redirects WARN: ${label} is ${first.status} (auth entry usually temporary)`);

      }

    }

    if (hops > 2) {

      ok = fail(`${label}: redirect chain has ${hops} hops (prefer ≤2)`) && ok;

    } else {

      console.log(`  OK ${label}: ${first.status} → ${result.chain.at(-1)?.location ?? result.finalUrl}`);

    }

  }



  for (const url of LIVE_CANONICAL_HOST_URLS) {

    const result = fetchRedirectChain(url);

    const first = result.chain[0];

    if (result.loop) {

      ok = fail(`${url}: redirect loop`) && ok;

      continue;

    }

    if (!first || !REDIRECT_STATUS.has(first.status)) {

      if (url.includes('www') || url.startsWith('http://')) {

        ok = fail(`${url}: expected redirect, got ${first?.status ?? 'unknown'}`) && ok;

      }

      continue;

    }

    if (![301, 308].includes(first.status)) {

      ok = fail(`${url}: expected permanent redirect, got ${first.status}`) && ok;

      continue;

    }

    const finalLoc = result.chain.at(-1)?.location ?? '';

    if (finalLoc.includes('www.pmstructure.com')) {

      ok = fail(`${url}: final Location still uses www`) && ok;

      continue;

    }

    if (url.includes('source=test') && !finalLoc.includes('source=test')) {

      ok = fail(`${url}: query string not preserved in redirect`) && ok;

      continue;

    }

    console.log(`  OK ${url}: ${first.status} → ${finalLoc || result.finalUrl}`);

  }



  if (ok) console.log('\naudit-redirects live checks OK');

  return ok;

}



const repoOk = runRepoChecks();

const liveOk = liveBase ? await runLiveChecks(liveBase) : true;



if (!repoOk || !liveOk) process.exit(1);

if (!liveBase) {

  console.log('Tip: run live checks with --base=https://pmstructure.com after deploy');

}


