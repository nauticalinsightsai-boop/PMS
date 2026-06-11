#!/usr/bin/env node
/**
 * Ensure all env lives in repo root `.env.local` only.
 * Removes per-app .env.local files (apps load root via next.config.ts).
 *
 * Usage: npm run env:link
 */
import fs from 'fs';
import path from 'path';
import {
  ROOT,
  loadMonorepoEnv,
  removeAppEnvFiles,
  serializeEnvFile,
} from './lib/monorepo-env.mjs';

const rootLocal = path.join(ROOT, '.env.local');
const example = path.join(ROOT, '.env.example');

const header = `# PM Structure: single local env (repo root only)
# All apps (frontend, backend, dashboard/*) read this file automatically.
# Do not create .env.local in subfolders.
# Production: set vars per Vercel project: docs/DEPLOYMENT_VERCEL.md`;

function main() {
  const merged = loadMonorepoEnv();

  if (Object.keys(merged).length === 0) {
    if (fs.existsSync(example)) {
      console.log('No .env.local yet. Run:');
      console.log('  cp .env.example .env.local');
      console.log('  # edit keys, then: npm run env:link');
    } else {
      console.error('Missing .env.local and .env.example');
    }
    process.exit(1);
  }

  fs.writeFileSync(rootLocal, serializeEnvFile(merged, header), 'utf8');
  console.log(`✓ ${path.relative(ROOT, rootLocal)} (${Object.keys(merged).length} keys)`);

  const removed = removeAppEnvFiles();
  if (removed.length) {
    console.log(`✓ Removed per-app env files:`);
    for (const r of removed) console.log(`    ${r}`);
  } else {
    console.log('✓ No per-app .env.local files (already clean)');
  }

  console.log('\nEdit repo root .env.local only. Restart: npm run dev');
}

main();