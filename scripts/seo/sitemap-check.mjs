/**
 * Validate sitemap paths are indexable (no enroll/checkout/admin URLs).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sitemapPath = path.join(__dirname, '../../frontend/app/sitemap.ts');
const indexingPath = path.join(__dirname, '../../frontend/lib/indexing-metadata.ts');

const NOINDEX_PREFIXES = [
  '/admin',
  '/checkout',
  '/membership/checkout',
  '/api',
  '/compare',
  '/store',
];
const NOINDEX_EXACT = ['/go'];
const NOINDEX_PATTERN = /\/certifications\/[^/]+\/[^/]+\/enroll/;

function isIndexable(pathname) {
  for (const exact of NOINDEX_EXACT) {
    if (pathname === exact) return false;
  }
  for (const prefix of NOINDEX_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return false;
  }
  if (NOINDEX_PATTERN.test(pathname)) return false;
  return true;
}

const src = fs.readFileSync(sitemapPath, 'utf8');
const paths = [...src.matchAll(/['"`](\/[^'"`]+)['"`]/g)].map((m) => m[1]);
const unique = [...new Set(paths)].filter((p) => p.startsWith('/'));

const blocked = unique.filter((p) => !isIndexable(p));
if (blocked.length) {
  console.error('Sitemap source references noindex paths:');
  blocked.forEach((p) => console.error(`  ${p}`));
  process.exit(1);
}

if (!fs.existsSync(indexingPath)) {
  console.error('Missing indexing-metadata.ts');
  process.exit(1);
}

console.log(`sitemap-check OK (${unique.length} literal paths scanned)`);
