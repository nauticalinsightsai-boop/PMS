/**
 * B08 performance asset audit (read-only scan).
 * Usage: npm run audit:performance-assets
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicRoot = path.join(root, 'frontend/public');
const docsInternal = path.join(root, 'docs/internal');

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg']);
const VIDEO_EXT = new Set(['.mp4', '.webm']);
const RASTER_CONVERT = new Set(['.png', '.jpg', '.jpeg']);

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function flagSize(kb) {
  const flags = [];
  if (kb > 1000) flags.push('urgent_1mb');
  else if (kb > 500) flags.push('high_500kb');
  else if (kb > 250) flags.push('review_250kb');
  return flags.join(';') || 'ok';
}

function rel(p) {
  return p.replace(/\\/g, '/').replace(`${root.replace(/\\/g, '/')}/`, '');
}

function inferUsedOn(relPath) {
  if (relPath.includes('/brand/pms-icon')) return '/; /certifications/pmp; forms';
  if (relPath.includes('/images/marketing/')) return 'Home; Community; testimonials';
  if (relPath.includes('/images/logo/')) return '/go/* portal pages';
  if (relPath.includes('/programme/')) return 'programme pages';
  if (relPath.includes('/brand/pms-logo')) return 'Navbar; Footer';
  return 'various';
}

function main() {
  const files = walk(publicRoot);
  const rows = [];
  let failed = false;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!IMAGE_EXT.has(ext) && !VIDEO_EXT.has(ext)) continue;

    const stat = fs.statSync(file);
    const kb = Math.round((stat.size / 1024) * 10) / 10;
    const relPath = rel(file);
    const flags = flagSize(kb);

    if (flags.includes('urgent') || flags.includes('high')) {
      console.warn(`audit-performance-assets WARN: ${relPath} ${kb}KB (${flags})`);
    }

    if (RASTER_CONVERT.has(ext) && kb > 50 && !relPath.endsWith('.source.png')) {
      rows.push({
        file: relPath,
        format: ext.slice(1),
        kb,
        flags,
        webpCandidate: 'yes',
      });
    } else {
      rows.push({
        file: relPath,
        format: ext.slice(1),
        kb,
        flags,
        webpCandidate: ext === '.webp' || ext === '.svg' ? 'no' : 'maybe',
      });
    }
  }

  rows.sort((a, b) => b.kb - a.kb);

  console.log(`\naudit-performance-assets: scanned ${rows.length} media files under frontend/public\n`);
  for (const r of rows.slice(0, 25)) {
    console.log(`  ${r.kb.toString().padStart(8)} KB  ${r.flags.padEnd(14)}  ${r.file}`);
  }
  if (rows.length > 25) console.log(`  ... and ${rows.length - 25} more`);

  const b08Docs = [
    'PMSTRUCTURE_PERFORMANCE_SYSTEM.md',
    'pmstructure-performance-audit.csv',
    'pmstructure-image-optimization-inventory.csv',
    'pmstructure-third-party-script-inventory.csv',
  ];
  for (const name of b08Docs) {
    if (!fs.existsSync(path.join(docsInternal, name))) {
      console.error(`audit-performance-assets FAIL: missing docs/internal/${name}`);
      failed = true;
    }
  }

  if (failed) process.exit(1);
  console.log('\naudit-performance-assets OK');
}

main();
