import fs from 'fs';
import path from 'path';

const root = path.resolve('packages/booking-crm/src');

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.ts')) {
      let t = fs.readFileSync(p, 'utf8');
      const next = t.replace(/from '(\.\.?\/[^']+)\.js'/g, "from '$1'");
      if (next !== t) fs.writeFileSync(p, next);
    }
  }
}

walk(root);
console.log('stripped .js import suffixes in booking-crm');
