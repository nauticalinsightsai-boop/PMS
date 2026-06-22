/**
 * Lists picsum/pravatar image refs for manual review.
 * Optional: node scripts/audit-images.mjs --production https://pmstructure.com
 */
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const productionArg = process.argv.find((arg) => arg.startsWith('--production='));
const productionBase = productionArg?.split('=')[1]?.replace(/\/$/, '');

function scanRepo() {
  try {
    const out = execSync(
      'rg -n "https://picsum\\.photos|i\\.pravatar\\.cc|pravatar\\.cc/" frontend packages --glob "!**/.next/**"',
      {
      cwd: root,
      encoding: 'utf8',
    });
    console.log(out);
    const lines = out.trim().split('\n').filter(Boolean);
    console.log(`\n${lines.length} placeholder image reference(s) in repo.`);
    return lines.length;
  } catch (e) {
    if (e.status === 1) {
      console.log('PASS: no picsum/pravatar references in repo source');
      return 0;
    }
    throw e;
  }
}

async function scanProductionHtml() {
  if (!productionBase) return 0;
  const res = await fetch(`${productionBase}/`, { redirect: 'follow' });
  const html = await res.text();
  const hits = [];
  if (html.includes('pravatar.cc')) hits.push('pravatar.cc');
  if (html.includes('picsum.photos')) hits.push('picsum.photos');
  if (hits.length > 0) {
    console.error(`FAIL: production HTML contains: ${hits.join(', ')}`);
    return hits.length;
  }
  console.log(`PASS: no pravatar/picsum in ${productionBase}/ HTML`);
  return 0;
}

const repoHits = scanRepo();
const prodHits = productionBase ? await scanProductionHtml() : 0;
process.exit(repoHits + prodHits > 0 ? 1 : 0);
