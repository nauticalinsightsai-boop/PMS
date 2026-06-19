/**
 * B09 internal link audit (read-only repo scan).
 * Flags http://, www.pmstructure.com, /docs/internal links in public source.
 * Usage: npm run audit:links
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const SCAN_DIRS = ['frontend/components', 'frontend/app', 'frontend/content', 'packages/site-content'];

const SKIP_DIR_NAMES = new Set(['node_modules', '.next', 'dist', 'build', '.git']);

const SKIP_FILES = new Set([
  'frontend/content/redirects/inventory.ts',
]);

const HREF_RE = /href\s*=\s*["']([^"']+)["']/g;
const HREF_OBJ_RE = /href:\s*['"]([^'"]+)['"]/g;

function walkFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR_NAMES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, files);
    else if (/\.(tsx?|jsx?|mdx?)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function rel(p) {
  return p.replace(/\\/g, '/').replace(`${root.replace(/\\/g, '/')}/`, '');
}

function scanHref(value, relPath, lineNo, findings) {
  if (!value || value.startsWith('#') || value.startsWith('mailto:') || value.startsWith('tel:')) return;

  if (/^http:\/\//i.test(value) && !/^http:\/\/localhost/i.test(value) && !/^http:\/\/127\.0\.0\.1/i.test(value)) {
    findings.push({ relPath, lineNo, kind: 'http-href', text: value });
  }
  if (/https:\/\/www\.pmstructure\.com/i.test(value)) {
    findings.push({ relPath, lineNo, kind: 'www-href', text: value });
  }
  if (/\/docs\/internal/i.test(value)) {
    findings.push({ relPath, lineNo, kind: 'internal-doc-link', text: value });
  }
}

function main() {
  const findings = [];

  for (const relDir of SCAN_DIRS) {
    const absDir = path.join(root, relDir);
    for (const file of walkFiles(absDir)) {
      const relPath = rel(file);
      if (SKIP_FILES.has(relPath)) continue;
      if (relPath.includes('/admin/') && relPath.includes('test')) continue;

      let content;
      try {
        content = fs.readFileSync(file, 'utf8');
      } catch {
        continue;
      }

      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        const lineNo = idx + 1;
        for (const re of [HREF_RE, HREF_OBJ_RE]) {
          re.lastIndex = 0;
          let m;
          while ((m = re.exec(line))) {
            scanHref(m[1], relPath, lineNo, findings);
          }
        }
      });
    }
  }

  if (!findings.length) {
    console.log('audit-links OK (no flagged hrefs in public source)');
    return;
  }

  console.error(`audit-links: ${findings.length} flagged href(s)\n`);
  for (const f of findings) {
    console.error(`  [${f.kind}] ${f.relPath}:${f.lineNo} → ${f.text}`);
  }
  process.exit(1);
}

main();
