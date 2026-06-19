/**
 * Regenerate docs/internal/pmstructure-indexation-strategy.csv from strategy.ts
 * Usage: npm run seo:generate-indexation-strategy-csv
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const frontend = path.join(root, 'frontend');

process.chdir(frontend);

const { formatIndexationStrategyCsv } = await import(
  pathToFileURL(path.join(frontend, 'content/indexation/strategy.ts')).href
);

const outPath = path.join(root, 'docs/internal/pmstructure-indexation-strategy.csv');
const csv = formatIndexationStrategyCsv();
fs.writeFileSync(outPath, `${csv}\n`, 'utf8');
console.log(`Wrote ${outPath} (${csv.split('\n').length - 1} rows)`);
