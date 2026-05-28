import fs from 'fs';
import path from 'path';

const root = path.resolve('packages/booking-crm/src');
const clp = path.join(root, 'channel-landing-pages');

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.ts')) {
      let t = fs.readFileSync(p, 'utf8');
      t = t.replaceAll('@/src/lib/channel-landing-pages/', '');
      t = t.replaceAll('@/src/constants/', '../constants/');
      t = t.replaceAll('@/src/types/', '../types/');
      t = t.replaceAll('@/src/lib/api/dataFileUtils', '../dataFileUtils');
      t = t.replaceAll('@/src/lib/calendly/', '../calendly/');
      fs.writeFileSync(p, t);
    }
  }
}

walk(root);

for (const name of fs.readdirSync(clp)) {
  if (!name.endsWith('.ts')) continue;
  const p = path.join(clp, name);
  let t = fs.readFileSync(p, 'utf8');
  t = t.replace(/from '([a-zA-Z])/g, "from './$1");
  fs.writeFileSync(p, t);
}

let cta = fs.readFileSync(path.join(root, 'constants/ctaPlatformButtons.ts'), 'utf8');
cta = cta.replace(
  "from './migrateChannelPages'",
  "from '../channel-landing-pages/migrateChannelPages.js'",
);
fs.writeFileSync(path.join(root, 'constants/ctaPlatformButtons.ts'), cta);

console.log('fixed imports');
