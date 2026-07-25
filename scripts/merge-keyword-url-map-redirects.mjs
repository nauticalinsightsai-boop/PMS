import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  KEYWORD_REDIRECT_ROWS,
  KEYWORD_ALIAS_REDIRECT_ROWS,
} from '../frontend/content/seo/keyword-redirect-map.ts';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const mapPath = path.join(root, 'docs/internal/pmstructure-keyword-url-map.csv');
let csv = fs.readFileSync(mapPath, 'utf8').trimEnd();
const existing = new Set(
  [...csv.matchAll(/https:\/\/pmstructure\.com(\/[^,"\r\n]*)/g)].map((m) => m[1]),
);

function escape(v) {
  return `"${String(v).replace(/"/g, '""')}"`;
}

let added = 0;
for (const row of [...KEYWORD_REDIRECT_ROWS, ...KEYWORD_ALIAS_REDIRECT_ROWS]) {
  if (existing.has(row.source)) continue;
  const status = row.keep ? 'Implemented' : 'Soft lander';
  const action = row.keep ? 'Keep live + popup' : 'Soft rewrite to hub + adapted H1/meta + popup';
  csv +=
    '\n' +
    [
      `https://pmstructure.com${row.source}`,
      row.contentType,
      row.intent,
      row.keyword,
      '',
      '',
      '',
      '',
      row.destination,
      'High',
      action,
      status,
      row.keep ? 'KEEP live page' : 'Keyword soft lander; see pmstructure-keyword-redirect-map.csv',
    ]
      .map(escape)
      .join(',');
  added += 1;
}

fs.writeFileSync(mapPath, `${csv}\n`);
console.log(`Appended ${added} redirect rows to keyword-url-map`);
