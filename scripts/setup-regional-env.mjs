/**
 * Copy .env.example → .env if missing (does not overwrite).
 * Usage: node scripts/setup-regional-env.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const example = path.join(root, '.env.example');
const env = path.join(root, '.env');

if (fs.existsSync(env)) {
  const text = fs.readFileSync(env, 'utf8');
  const hasDb = /^DATABASE_URL=.+$/m.test(text) && !text.includes('DATABASE_URL=postgresql://postgres.[ref]');
  console.log('.env already exists — edit DATABASE_URL and Supabase keys, then:');
  console.log('  npm run db:migrate');
  console.log('  npm run sync:regional');
  console.log('  npm run verify:regional-dev');
  if (!hasDb) console.log('\n⚠ DATABASE_URL is still unset or placeholder.');
  process.exit(0);
}

if (!fs.existsSync(example)) {
  console.error('.env.example not found');
  process.exit(1);
}

fs.copyFileSync(example, env);
console.log('Created .env from .env.example');
console.log('Next: set DATABASE_URL in .env, then:');
console.log('  npm run db:migrate');
console.log('  npm run sync:regional');
console.log('  npm run verify:regional-dev');
