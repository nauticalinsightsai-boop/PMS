/**
 * Remove Next.js .next caches (fixes dev 500s after `npm run build` while dev was running).
 * Usage: node scripts/clean-next-cache.mjs [--kill-ports]
 */
import { rmSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const killPorts = process.argv.includes('--kill-ports');

const NEXT_DIRS = [
  'frontend/.next',
  'backend/.next',
  'dashboard/frontend/.next',
  'dashboard/backend/.next',
];

for (const rel of NEXT_DIRS) {
  const dir = path.join(root, rel);
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    console.log(`Removed ${rel}`);
  }
}

if (killPorts) {
  const ports = [3000, 3001, 3002, 3050, 5174];
  for (const port of ports) {
    try {
      if (process.platform === 'win32') {
        const out = execSync(`netstat -ano | findstr ":${port} " | findstr LISTENING`, {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'ignore'],
        });
        const pids = new Set();
        for (const line of out.split('\n')) {
          const m = line.trim().match(/\s+(\d+)\s*$/);
          if (m) pids.add(m[1]);
        }
        for (const pid of pids) {
          execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
          console.log(`Freed port ${port} (PID ${pid})`);
        }
      }
    } catch {
      /* port free */
    }
  }
}

console.log('Next.js caches cleared.');
