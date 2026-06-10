/**
 * Smoke-check canonical helper exists and site metadata uses PMS_SITE_URL.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');

const required = [
  'frontend/lib/canonical.ts',
  'frontend/lib/site-metadata.ts',
  'frontend/config/pms-site.ts',
];

for (const rel of required) {
  const filePath = path.join(root, rel);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing ${rel}`);
    process.exit(1);
  }
}

const meta = fs.readFileSync(path.join(root, 'frontend/lib/site-metadata.ts'), 'utf8');
if (!meta.includes('canonicalUrl') || !meta.includes('robotsForPath')) {
  console.error('site-metadata.ts missing canonicalUrl or robotsForPath integration');
  process.exit(1);
}

console.log('canonical-check OK');
