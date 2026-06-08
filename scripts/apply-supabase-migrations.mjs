/**
 * Apply SQL files in supabase/migrations/ using DATABASE_URL.
 *
 * Usage: npm run db:migrate
 * Loads env from repo root `.env.local` only.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadMonorepoEnv } from './lib/monorepo-env.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const env = loadMonorepoEnv();

function projectRefFromUrl(url) {
  const m = url?.match(/https:\/\/([^.]+)\.supabase\.co/);
  return m?.[1] ?? null;
}

const ref =
  projectRefFromUrl(env.NEXT_PUBLIC_SUPABASE_URL) ||
  projectRefFromUrl(env.SUPABASE_URL) ||
  'YOUR_PROJECT_REF';

const dbPassword = process.env.SUPABASE_DB_PASSWORD || env.SUPABASE_DB_PASSWORD;
let databaseUrl = env.DATABASE_URL || env.SUPABASE_DB_URL;
if ((!databaseUrl || databaseUrl.includes('YOUR_DB_PASSWORD')) && dbPassword && ref) {
  databaseUrl = `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.${ref}.supabase.co:5432/postgres`;
}

if (!databaseUrl || databaseUrl.includes('YOUR_DB_PASSWORD')) {
  console.error(`
DATABASE_URL is not set (or still has placeholder YOUR_DB_PASSWORD).

1. Supabase Dashboard → Project Settings → Database → Connection string → URI
2. Add to repo root .env.local (create if missing):

   SUPABASE_DB_PASSWORD=your_database_password
   # or DATABASE_URL=postgresql://postgres:PASSWORD@db.${ref}.supabase.co:5432/postgres

   (Password: Supabase → Settings → Database → Database password)

3. Re-run: npm run db:migrate

Auth-only (if you already ran other migrations): paste
  supabase/manual-dashboard-one-auth.sql
in Supabase SQL Editor instead.

Env: repo root .env.local
`);
  process.exit(1);
}

const onlyAuth = process.argv.includes('--only-auth');
const migrationsDir = path.join(ROOT, 'supabase', 'migrations');
let files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort();
if (onlyAuth) {
  files = files.filter((f) => f.includes('dashboard_one'));
  if (files.length === 0) {
    console.error('No dashboard_one migration files found in supabase/migrations/');
    process.exit(1);
  }
}

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
