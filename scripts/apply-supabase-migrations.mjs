/**
 * Apply SQL files in supabase/migrations/ using DATABASE_URL from .env (repo root).
 *
 * Usage: node scripts/apply-supabase-migrations.mjs
 * Requires: DATABASE_URL=postgresql://postgres.[ref]:[password]@... (Supabase → Settings → Database)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const env = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

const env = { ...loadEnvFile(path.join(ROOT, '.env')), ...loadEnvFile(path.join(ROOT, '.env.local')) };
const databaseUrl = env.DATABASE_URL || env.SUPABASE_DB_URL;

if (!databaseUrl) {
  console.error(`
DATABASE_URL is not set.

1. Copy .env.example → .env
2. In Supabase Dashboard → Project Settings → Database → Connection string (URI),
   set DATABASE_URL=postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-....pooler.supabase.com:6543/postgres
3. Re-run: npm run db:migrate

Or paste these files manually in SQL Editor (in order):
  - supabase/migrations/20240517000000_initial_schema.sql
  - supabase/migrations/20260523100000_regional_catalogue.sql
  - supabase/migrations/20260523100001_seed_regions.sql
  - supabase/migrations/20260523100002_catalogue_meta.sql
`);
  process.exit(1);
}

const migrationsDir = path.join(ROOT, 'supabase', 'migrations');
const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

const { default: pg } = await import('pg');
const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  console.log(`Connected. Applying ${files.length} migration(s)...`);
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`  → ${file}`);
    await client.query(sql);
  }
  console.log('Migrations applied successfully.');
} catch (err) {
  console.error('Migration failed:', err.message);
  process.exit(1);
} finally {
  await client.end();
}
