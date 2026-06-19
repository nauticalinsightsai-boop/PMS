/**
 * Regenerate B05 redirect CSV files from frontend/content/redirects/inventory.ts
 * Usage: npm run seo:generate-redirect-csvs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const frontend = path.join(root, 'frontend');
const docsInternal = path.join(root, 'docs/internal');

process.chdir(frontend);

const inventory = await import(pathToFileURL(path.join(frontend, 'content/redirects/inventory.ts')).href);

const files = [
  { name: 'pmstructure-redirect-map.csv', content: inventory.formatRedirectMapCsv() },
  { name: 'pmstructure-302-audit.csv', content: inventory.format302AuditCsv() },
  { name: 'pmstructure-410-review.csv', content: inventory.format410ReviewCsv() },
  // Keep T-037 filename in sync for backward compatibility
  { name: 'pmstructure-302-redirect-audit.csv', content: inventory.format302AuditCsv() },
];

for (const { name, content } of files) {
  const outPath = path.join(docsInternal, name);
  fs.writeFileSync(outPath, `${content}\n`, 'utf8');
  const rows = content.split('\n').length - 1;
  console.log(`Wrote ${outPath} (${rows} rows)`);
}
