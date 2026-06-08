/**
 * Apply dashboard_one auth SQL only (no full migration set).
 * Usage:
 *   SUPABASE_DB_PASSWORD=your_db_password npm run db:apply-auth
 * or set DATABASE_URL in root .env.local
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadMonorepoEnv } from './lib/monorepo-env.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const env = loadMonorepoEnv();

function projectRef() {
  const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || '';
  const m = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return m?.[1] ?? null;
}

const ref = projectRef();
let databaseUrl = env.DATABASE_URL || env.SUPABASE_DB_URL;
const dbPassword = process.env.SUPABASE_DB_PASSWORD || env.SUPABASE_DB_PASSWORD;

if ((!databaseUrl || databaseUrl.includes('YOUR_DB_PASSWORD')) && dbPassword && ref) {
  databaseUrl = `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.${ref}.supabase.co:5432/postgres`;
}

if (!databaseUrl || databaseUrl.includes('YOUR_DB_PASSWORD')) {
  console.error(`
Missing database password for project ${ref ?? 'unknown'}.

Quick fix (one line in root .env.local):

  SUPABASE_DB_PASSWORD=your_database_password

Or full URI:

  DATABASE_URL=postgresql://postgres:PASSWORD@db.${ref ?? 'YOUR_REF'}.supabase.co:5432/postgres

Get password: Supabase → Project Settings → Database → Database password / Connection string

Then run: npm run db:apply-auth
`);
  process.exit(1);
}

const sqlPath = path.join(ROOT, 'supabase', 'manual-dashboard-one-auth.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

const { default: pg } = await import('pg');
const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  console.log(`Connected to ${ref}. Applying dashboard_one auth SQL...`);
  await client.query(sql);
  console.log('✓ Auth tables applied.');
  console.log('\nNext: Supabase → Settings → API → Exposed schemas → add "dashboard_one"');
  console.log('Then: npm run db:check-supabase');
} catch (err) {
  console.error('Failed:', err.message);
  process.exit(1);
} finally {
  await client.end();
}
