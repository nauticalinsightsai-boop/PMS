import fs from 'fs';
import path from 'path';

const roots = [
  'dashboard/frontend/lib',
  'dashboard/frontend/hooks',
  'dashboard/frontend/components/admin',
  'dashboard/frontend/components/booking-crm',
  'dashboard/backend/lib',
  'dashboard/backend/app/api/interactions',
];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx|js)$/.test(p)) {
      let t = fs.readFileSync(p, 'utf8');
      const next = t
        .replaceAll('@/src/', '@/')
        .replaceAll('@/components/ui/cards/GlassCard', '@/components/ui/GlassCard')
        .replaceAll('@/components/ui/buttons/CTAButton', '@/components/ui/CTAButton')
        .replaceAll('@pms/booking-crm/lead-attribution', '@pms/booking-crm');
      if (next !== t) fs.writeFileSync(p, next);
    }
  }
}

for (const r of roots) walk(path.resolve(r));
console.log('fixed dashboard @/src imports');
