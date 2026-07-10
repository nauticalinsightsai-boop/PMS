import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { KEYWORD_REDIRECT_ROWS, KEYWORD_ALIAS_REDIRECT_ROWS } from '../frontend/content/seo/keyword-redirect-map.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const out = path.join(root, 'docs/internal/pmstructure-keyword-redirect-map.csv');
const site = 'https://pmstructure.com';

const header =
  'Source_URL,Source_Path,Destination_Path,Keyword,Content_Type,Intent,Redirect_Type,Priority,Data_Source,Reason,Implementation_Status,Notes';

function escape(v) {
  return `"${String(v).replace(/"/g, '""')}"`;
}

const allRows = [...KEYWORD_REDIRECT_ROWS, ...KEYWORD_ALIAS_REDIRECT_ROWS];
const lines = [header];
for (const row of allRows) {
  const keep = Boolean(row.keep);
  lines.push(
    [
      `${site}${row.source}`,
      row.source,
      row.destination,
      row.keyword,
      row.contentType,
      row.intent,
      keep ? 'KEEP (no redirect)' : '301 permanent',
      'P1',
      row.contentType.includes('Ads') || row.contentType.includes('Legacy')
        ? 'Ads/legacy alias'
        : 'Keyword H1 Meta workbook',
      keep ? 'Live lead-magnet page' : 'Consolidate ranking on hub + lead popup',
      'Implemented',
      keep ? 'Popup on direct visit' : 'Destination includes ?from=slug for popup',
    ]
      .map(escape)
      .join(','),
  );
}

fs.writeFileSync(out, `${lines.join('\n')}\n`);
console.log(`Wrote ${allRows.length} rows → ${out}`);
