/**
 * T-028 repo + live insecure content audit (read-only).
 * Usage:
 *   node scripts/audit-insecure-content.mjs
 *   node scripts/audit-insecure-content.mjs --base=https://pmstructure.com
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const baseArg = process.argv.find((a) => a.startsWith('--base='));
const liveBase = baseArg?.slice(7)?.replace(/\/$/, '');

const SCAN_DIRS = [
  'frontend',
  path.join('packages', 'site-content'),
  path.join('packages', 'booking-crm'),
];

const SKIP_DIR_NAMES = new Set([
  'node_modules',
  '.next',
  'dist',
  'build',
  '.git',
  'coverage',
]);

const SKIP_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.pdf',
  '.zip',
  '.lock',
]);

const DEV_HTTP_ALLOW = [
  /^http:\/\/localhost(?::\d+)?(?:\/|$)/i,
  /^http:\/\/127\.0\.0\.1(?::\d+)?(?:\/|$)/i,
  /^http:\/\/\[::1\](?::\d+)?(?:\/|$)/i,
];

const LIVE_PRIORITY_PATHS = [
  '/',
  '/certifications',
  '/certifications/pmp',
  '/answers/is-the-pmp-exam-changing-in-2026',
  '/pmp-exam-2026',
  '/faq',
  '/certifications/compare',
  '/community',
  '/membership',
  '/contact',
];

const LIVE_ASSET_PATTERNS = [
  /\bsrc\s*=\s*["']http:\/\//gi,
  /\bhref\s*=\s*["']http:\/\//gi,
  /\baction\s*=\s*["']http:\/\//gi,
  /\bposter\s*=\s*["']http:\/\//gi,
  /https:\/\/www\.pmstructure\.com/i,
  /\bhttp:\/\/pmstructure\.com/i,
  /\bws:\/\//i,
];

function isDevHttpAllowed(match) {
  return DEV_HTTP_ALLOW.some((re) => re.test(match));
}

function shouldSkipFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath);
  if (SKIP_EXTENSIONS.has(ext)) return true;
  if (/\.(test|spec)\.(ts|tsx|js|jsx|mjs)$/.test(base)) return true;
  if (filePath.endsWith('.min.js') || filePath.endsWith('.min.css')) return true;
  return false;
}

function walkFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR_NAMES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, files);
    } else if (!shouldSkipFile(full)) {
      files.push(full);
    }
  }
  return files;
}

function isBenignHttpContext(line) {
  if (isSvgXmlnsFalsePositive(line)) return true;
  if (/xmlns\s*=\s*["']http:\/\/www\.w3\.org\//i.test(line)) return true;
  return false;
}

/** Redirect audit inventory rows document http/www sources — not live links. */
function isRedirectInventoryAllowlisted(relPath, line) {
  if (!relPath.includes('frontend/content/redirects/inventory.ts')) return false;
  return /sourceUrl:\s*['"]https?:\/\/(www\.)?pmstructure\.com/i.test(line);
}

/** Redirect QA script intentionally tests http/www URLs. */
function isAuditScriptAllowlisted(relPath) {
  return (
    relPath === 'scripts/audit-redirects.mjs' ||
    relPath === 'scripts/seo/robots-check.mjs' ||
    relPath.startsWith('docs/')
  );
}

/**
 * Intentional Circle custom-domain references only (www CNAME for Circle).
 * Does not allow www.pmstructure.com elsewhere in metadata, pages, sitemap, robots, or unrelated config.
 */
export function isCircleCustomDomainAllowlisted(relPath, line) {
  if (relPath === 'frontend/config/community.ts') {
    return (
      /CIRCLE_CUSTOM_DOMAIN_URL\s*=\s*['"]https:\/\/www\.pmstructure\.com['"]/i.test(line) ||
      /CIRCLE_COMMUNITY_INVITATION_JOIN_URL\s*=\s*['"]https:\/\/www\.pmstructure\.com\/join\?/i.test(line) ||
      // Invitation URL is assigned on the line after `CIRCLE_COMMUNITY_INVITATION_JOIN_URL =`
      /^\s*['"]https:\/\/www\.pmstructure\.com\/join\?invitation_token=/i.test(line)
    );
  }
  if (relPath === 'frontend/config/README.md') {
    return /^\s*NEXT_PUBLIC_CIRCLE_COMMUNITY_JOIN_URL\s*=\s*https:\/\/www\.pmstructure\.com\/join\?/i.test(line);
  }
  return false;
}

export function scanRepoLine(line, relPath, lineNo, findings) {
  if (isBenignHttpContext(line)) return;
  if (isRedirectInventoryAllowlisted(relPath, line)) return;
  if (isAuditScriptAllowlisted(relPath)) return;

  const httpMatches = [...line.matchAll(/http:\/\/[^\s"'<>]+/gi)].map((m) => m[0]);
  for (const match of httpMatches) {
    if (!isDevHttpAllowed(match)) {
      findings.push({ relPath, lineNo, kind: 'http', text: match, line: line.trim() });
    }
  }

  if (/https:\/\/www\.pmstructure\.com/i.test(line) && !isCircleCustomDomainAllowlisted(relPath, line)) {
    findings.push({ relPath, lineNo, kind: 'www-host', text: 'https://www.pmstructure.com', line: line.trim() });
  }

  if (/\bws:\/\//i.test(line)) {
    findings.push({ relPath, lineNo, kind: 'ws', text: 'ws://', line: line.trim() });
  }

  if (/(?:src|href|action|poster)\s*=\s*["']\/\//i.test(line)) {
    findings.push({ relPath, lineNo, kind: 'protocol-relative', text: 'src/href="//', line: line.trim() });
  }
}

function scanRepo() {
  const findings = [];
  for (const relDir of SCAN_DIRS) {
    const absDir = path.join(root, relDir);
    for (const file of walkFiles(absDir)) {
      const relPath = path.relative(root, file).replace(/\\/g, '/');
      let content;
      try {
        content = fs.readFileSync(file, 'utf8');
      } catch {
        continue;
      }
      if (content.includes('\0')) continue;
      const lines = content.split('\n');
      lines.forEach((line, idx) => scanRepoLine(line, relPath, idx + 1, findings));
    }
  }
  return findings;
}

function fetchBody(url) {
  try {
    const raw = execFileSync(
      'curl',
      ['-sL', '-m', '25', '-A', 'PMS-Insecure-Content-Audit/1.0', '-w', '\n__STATUS__%{http_code}', url],
      { encoding: 'utf8', maxBuffer: 12 * 1024 * 1024 },
    );
    const statusMatch = raw.match(/__STATUS__(\d{3})$/);
    const status = statusMatch ? Number(statusMatch[1]) : 0;
    const body = statusMatch ? raw.slice(0, -statusMatch[0].length) : raw;
    return { status, body };
  } catch (err) {
    return { status: 0, body: '', error: err.message || 'curl failed' };
  }
}

function isSvgXmlnsFalsePositive(line) {
  return /xmlns\s*=\s*["']http:\/\/www\.w3\.org\/2000\/svg["']/i.test(line);
}

function scanLiveHtml(body, pagePath, findings) {
  const lines = body.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isSvgXmlnsFalsePositive(line)) continue;

    for (const re of LIVE_ASSET_PATTERNS) {
      re.lastIndex = 0;
      if (re.test(line)) {
        findings.push({
          relPath: `live:${pagePath}`,
          lineNo: i + 1,
          kind: 'live-insecure',
          text: line.trim().slice(0, 160),
          line: line.trim().slice(0, 160),
        });
        break;
      }
    }

    const bareHttp = [...line.matchAll(/(?<![s])http:\/\/[^\s"'<>]+/gi)].map((m) => m[0]);
    for (const match of bareHttp) {
      if (match.startsWith('http://www.w3.org')) continue;
      findings.push({
        relPath: `live:${pagePath}`,
        lineNo: i + 1,
        kind: 'live-http',
        text: match,
        line: line.trim().slice(0, 160),
      });
    }
  }
}

function scanLive(base) {
  const findings = [];
  for (const pagePath of LIVE_PRIORITY_PATHS) {
    const url = `${base}${pagePath}`;
    const { status, body, error } = fetchBody(url);
    if (error || status < 200 || status >= 400) {
      findings.push({
        relPath: `live:${pagePath}`,
        lineNo: 0,
        kind: 'live-fetch',
        text: error || `HTTP ${status}`,
        line: error || `HTTP ${status}`,
      });
      continue;
    }
    scanLiveHtml(body, pagePath, findings);
  }

  for (const assetPath of ['/robots.txt', '/sitemap.xml']) {
    const { status, body } = fetchBody(`${base}${assetPath}`);
    if (status >= 200 && status < 400) {
      if (/http:\/\/pmstructure/i.test(body) || /https:\/\/www\.pmstructure\.com/i.test(body)) {
        findings.push({
          relPath: `live:${assetPath}`,
          lineNo: 0,
          kind: 'live-meta',
          text: 'insecure host in robots/sitemap',
          line: body.split('\n').find((l) => /http:\/\//i.test(l) || /www\.pmstructure/i.test(l)) ?? '',
        });
      }
    }
  }

  return findings;
}

function printFindings(label, findings) {
  if (!findings.length) {
    console.log(`${label}: OK (no issues)`);
    return 0;
  }
  console.error(`${label}: ${findings.length} issue(s)`);
  for (const f of findings) {
    const loc = f.lineNo ? `${f.relPath}:${f.lineNo}` : f.relPath;
    console.error(`  [${f.kind}] ${loc}`);
    console.error(`    ${f.text || f.line}`);
  }
  return findings.length;
}

function isExecutedDirectly() {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return path.resolve(fileURLToPath(import.meta.url)) === path.resolve(entry);
  } catch {
    return false;
  }
}

if (isExecutedDirectly()) {
  let failed = false;

  console.log('audit-insecure-content: repo scan\n');
  const repoFindings = scanRepo();
  if (printFindings('repo', repoFindings)) failed = true;

  if (liveBase) {
    console.log(`\naudit-insecure-content: live scan (${liveBase})\n`);
    const liveFindings = scanLive(liveBase);
    if (printFindings('live', liveFindings)) failed = true;
  }

  console.log(`\naudit-insecure-content: ${failed ? 'FAILED' : 'PASSED'}`);
  process.exit(failed ? 1 : 0);
}
