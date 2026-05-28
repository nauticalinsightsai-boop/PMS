/**
 * Lists picsum/pravatar image refs for manual review.
 */
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
try {
  const out = execSync('rg -n "picsum\\.photos|pravatar\\.cc" frontend --glob "!**/.next/**"', {
    cwd: root,
    encoding: 'utf8',
  });
  console.log(out);
  const lines = out.trim().split('\n').filter(Boolean);
  console.log(`\n${lines.length} placeholder image reference(s) found.`);
  process.exit(lines.length > 10 ? 1 : 0);
} catch (e) {
  if (e.status === 1) {
    console.log('PASS — no picsum/pravatar references found');
    process.exit(0);
  }
  throw e;
}
