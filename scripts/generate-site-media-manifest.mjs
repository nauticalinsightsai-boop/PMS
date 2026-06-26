#!/usr/bin/env node
/**
 * Scan frontend/public for site-bundled images (served from pmstructure.com/...).
 * Run on prebuild — output consumed by /api/cms/media.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'frontend', 'public');
const OUT = path.join(ROOT, 'dashboard', 'backend', 'lib', 'cms', 'static-media-manifest.json');

const IMAGE_EXT = new Set(['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.avif']);

function walk(dir, base = '') {
  const entries = [];
  if (!fs.existsSync(dir)) return entries;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue;
    const rel = base ? `${base}/${ent.name}` : ent.name;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) entries.push(...walk(full, rel));
    else if (IMAGE_EXT.has(path.extname(ent.name).toLowerCase())) {
      entries.push({
        name: rel.replace(/\\/g, '/'),
        path: `/${rel.replace(/\\/g, '/')}`,
        category: rel.split('/')[0] ?? 'root',
      });
    }
  }
  return entries;
}

const items = walk(PUBLIC).sort((a, b) => a.path.localeCompare(b.path));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  OUT,
  JSON.stringify({ generatedAt: new Date().toISOString(), count: items.length, items }, null, 2),
);
console.log(`Wrote ${items.length} static media paths → ${path.relative(ROOT, OUT)}`);
