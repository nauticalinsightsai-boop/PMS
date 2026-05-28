import fs from 'fs';
import path from 'path';

const roots = [
  'frontend/hooks',
  'frontend/lib/interactions',
  'frontend/lib/calendly',
  'frontend/lib/analytics',
  'frontend/lib/media',
  'frontend/lib/brand',
  'frontend/utils',
  'frontend/components/ui',
  'frontend/components/legal',
  'frontend/components/admin',
  'frontend/constants',
  'frontend/config',
];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(p)) {
      let t = fs.readFileSync(p, 'utf8');
      const next = t.replaceAll('@/src/', '@/').replaceAll('@/src/config/site', '@/config/site');
      if (next !== t) fs.writeFileSync(p, next);
    }
  }
}

for (const r of roots) walk(path.resolve(r));
console.log('fixed X1 imports');
