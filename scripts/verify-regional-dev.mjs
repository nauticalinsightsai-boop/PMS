/**
 * Dev spot-check: catalogue scripts + optional live frontend/backend probes.
 * Usage: node scripts/verify-regional-dev.mjs
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitePorts = [3000];
const apiBase = process.env.BACKEND_URL || 'http://localhost:3001';

function runNodeScript(name) {
  const scriptPath = path.join(root, 'scripts', name);
  const r = spawnSync(process.execPath, [scriptPath], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

async function probeUrl(url, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  } finally {
    clearTimeout(t);
  }
}

console.log('=== Regional plan verification ===\n');

runNodeScript('spot-check-india-pmp.mjs');
runNodeScript('qa-regional-matrix.mjs');

let siteOk = false;
for (const port of sitePorts) {
  const url = `http://localhost:${port}/certifications/pmp`;
  const { ok, status } = await probeUrl(url, 20000);
  if (ok) {
    console.log(`\nFrontend probe PASS — ${url} → ${status}`);
    siteOk = true;
    break;
  }
  console.log(`Frontend probe skip — ${url} not ready (${status || 'timeout'})`);
}

if (!siteOk) {
  console.log(
    '\nNote: start dev with `npm run dev` and open http://localhost:3000 for browser QA.',
  );
}

const apiProbe = await probeUrl(`${apiBase}/api/regions`);
if (apiProbe.ok) {
  console.log(`\nBackend probe PASS — ${apiBase}/api/regions → ${apiProbe.status}`);
  process.env.NEXT_PUBLIC_API_URL = apiBase;
  runNodeScript('spot-check-checkout-api.mjs');
} else {
  console.log(`\nBackend probe skip — ${apiBase} not reachable; run npm run dev:backend`);
}

console.log('\n=== CLI verification complete ===');
