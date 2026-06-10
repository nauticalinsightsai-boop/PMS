/**
 * Static check: noindex routes must not appear in sitemap.ts literals.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');

const sitemap = fs.readFileSync(path.join(root, 'frontend/app/sitemap.ts'), 'utf8');
const forbidden = ['/checkout', '/admin', '/enroll'];

for (const segment of forbidden) {
  if (sitemap.includes(`'${segment}`) || sitemap.includes(`"${segment}`)) {
    console.error(`noindex-check FAIL: sitemap.ts references ${segment}`);
    process.exit(1);
  }
}

const adminLayout = fs.readFileSync(path.join(root, 'frontend/app/admin/layout.tsx'), 'utf8');
if (!adminLayout.includes('noindex') && !adminLayout.includes('NOINDEX')) {
  console.error('noindex-check FAIL: admin layout missing noindex robots');
  process.exit(1);
}

console.log('noindex-check OK');
