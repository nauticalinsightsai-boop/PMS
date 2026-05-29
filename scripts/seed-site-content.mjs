/**
 * Seed website_data documents from @pms/site-content defaults (T-005).
 * Requires DATABASE_URL in .env (repo root).
 *
 * Usage: npm run seed:site-content [-- --publish]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { buildAllSeedDocuments } from '../packages/site-content/src/seeds/index.ts';
import { validateFieldContent } from '../packages/site-content/src/index.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publish = process.argv.includes('--publish');

function loadEnv() {
  for (const f of ['.env', '.env.local']) {
    const p = path.join(root, f);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

loadEnv();
const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
if (!url) {
  console.error('DATABASE_URL required for seed:site-content');
  process.exit(1);
}

const docs = buildAllSeedDocuments();
for (const doc of docs) {
  const check = validateFieldContent(doc.field_key, doc.content);
  if (!check.success) {
    console.error(`Validation failed for ${doc.field_key}:`, check.error?.format?.() ?? check);
    process.exit(1);
  }
}

const client = new pg.Client({ connectionString: url });
await client.connect();

try {
  for (const doc of docs) {
    await client.query(
      `insert into public.website_data (field_key, content, is_published, updated_at)
       values ($1, $2::jsonb, $3, now())
       on conflict (field_key) do update set
         content = excluded.content,
         is_published = case when $3 then true else public.website_data.is_published end,
         updated_at = now()`,
      [doc.field_key, JSON.stringify(doc.content), publish],
    );
    console.log(`Seeded ${doc.field_key}${publish ? ' (published)' : ''}`);
  }
  if (publish) {
    for (const doc of docs) {
      await client.query(
        `update public.website_data set is_published = true, updated_at = now() where field_key = $1`,
        [doc.field_key],
      );
    }
  }
  console.log(`Done — ${docs.length} documents.`);
} finally {
  await client.end();
}
