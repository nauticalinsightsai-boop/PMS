import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeReport } from './lib/report-writer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../../frontend/public');
const issues = [];

const forbiddenPath = /^\/(?:checkout|payment|admin)(?:\/|$)/;
const forbiddenUrl = /https?:\/\/(?:www\.)?pmstructure\.com\/(?:checkout|payment|admin)(?:\/|$)/i;

function isForbiddenUrl(url) {
  return forbiddenUrl.test(url) || forbiddenPath.test(url);
}

function scanPromotedUrls(file, urls) {
  for (const url of urls) {
    if (typeof url === 'string' && isForbiddenUrl(url)) {
      issues.push({ file, url });
    }
  }
}

function collectPromotedStrings(data, out = []) {
  if (typeof data === 'string') {
    if (data.includes('pmstructure.com') || data.startsWith('/')) out.push(data);
    return out;
  }
  if (Array.isArray(data)) {
    for (const item of data) collectPromotedStrings(item, out);
    return out;
  }
  if (data && typeof data === 'object') {
    for (const [key, value] of Object.entries(data)) {
      if (key === 'doNotCite' || key === 'do_not_cite') continue;
      collectPromotedStrings(value, out);
    }
  }
  return out;
}

for (const file of ['llms.txt', 'entity.json', 'pmp-faq.json', 'faq.json', 'answers.json', 'topics.json']) {
  const p = path.join(publicDir, file);
  if (!fs.existsSync(p)) continue;

  if (file.endsWith('.json')) {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    const promoted = collectPromotedStrings(data);
    scanPromotedUrls(file, promoted);
    if (data.bestPagesToCite) scanPromotedUrls(file, data.bestPagesToCite);
  } else {
    const text = fs.readFileSync(p, 'utf8');
    const promotedLines = text
      .split('\n')
      .filter((line) => /^https?:\/\/(?:www\.)?pmstructure\.com\//i.test(line.trim()));
    scanPromotedUrls(file, promotedLines);
  }
}

writeReport('ai-citation-map-check', { pass: issues.length === 0, issues });
if (issues.length) {
  console.error('check-ai-citation-map FAIL', issues);
  process.exit(1);
}
console.log('check-ai-citation-map OK');
