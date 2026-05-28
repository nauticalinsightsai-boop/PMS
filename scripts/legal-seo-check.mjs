/**
 * CLI check for legal/FAQ/SEO baseline (no browser).
 * Usage: node scripts/legal-seo-check.mjs
 */
import { readFileSync, existsSync, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const frontend = path.join(root, 'frontend');

const BANNED = [
  'draft template',
  'counsel review',
  'legal@pmstructure',
  '(placeholder)',
  'template reference only',
  'confirm with local counsel',
];

function read(rel) {
  return readFileSync(path.join(frontend, rel), 'utf8');
}

function collectLegalFaqSources() {
  const parts = [];
  const legalDir = path.join(frontend, 'content', 'legal');
  const walk = (dir) => {
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name.endsWith('.ts')) parts.push(readFileSync(full, 'utf8'));
    }
  };
  walk(legalDir);
  parts.push(read('content/faq/data.ts'));
  return parts.join('\n');
}

const checks = [];

const faqData = read('content/faq/data.ts');
const faqCount = (faqData.match(/^\s+P\(/gm) || []).length;
checks.push({ name: 'FAQ entries', ok: faqCount >= 65, detail: String(faqCount) });

const legalTs = read('constants/legal.ts');
checks.push({
  name: 'LEGAL_HUB_PATH',
  ok: legalTs.includes("LEGAL_HUB_PATH = '/legal'"),
  detail: '',
});

const combined = collectLegalFaqSources().toLowerCase();
const bannedHit = BANNED.find((p) => combined.includes(p));
checks.push({
  name: 'No banned draft/placeholder strings',
  ok: !bannedHit,
  detail: bannedHit ?? 'ok',
});

const requiredFiles = [
  'app/robots.ts',
  'app/sitemap.ts',
  'public/llms.txt',
  'lib/site-metadata.ts',
  'config/pms-site.ts',
  'public/og/default.png',
  'content/faq/hub-sections.ts',
];

for (const f of requiredFiles) {
  const exists = existsSync(path.join(frontend, f));
  checks.push({ name: `file ${f}`, ok: exists, detail: exists ? 'ok' : 'missing' });
}

let failed = 0;
for (const c of checks) {
  const status = c.ok ? 'PASS' : 'FAIL';
  if (!c.ok) failed++;
  console.log(`${status} ${c.name}${c.detail ? ` (${c.detail})` : ''}`);
}

process.exit(failed > 0 ? 1 : 0);
