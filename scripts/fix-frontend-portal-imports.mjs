import fs from 'fs';
import path from 'path';

const root = path.resolve('frontend/components/channel-landing');

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.ts') || p.endsWith('.tsx')) {
      let t = fs.readFileSync(p, 'utf8');
      t = t.replaceAll('@/src/', '@/');
      t = t.replaceAll('@pms/booking-crm/src/', '@pms/booking-crm/');
      fs.writeFileSync(p, t);
    }
  }
}

walk(root);
console.log('fixed frontend portal imports');
