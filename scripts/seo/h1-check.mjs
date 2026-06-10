/**
 * Fail if a server page.tsx has more than one <h1 tag.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteApp = path.join(__dirname, '../../frontend/app/(site)');

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (name === 'page.tsx') files.push(p);
  }
  return files;
}

let failed = false;
const pages = walk(siteApp);
for (const file of pages) {
  const src = fs.readFileSync(file, 'utf8');
  const h1Count = (src.match(/<h1[\s>]/g) || []).length;
  if (h1Count > 1) {
    console.error(`h1-check FAIL: ${file} has ${h1Count} <h1 tags`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`h1-check OK (${pages.length} pages scanned)`);
