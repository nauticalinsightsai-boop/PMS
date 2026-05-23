/**
 * Optional: upsert catalogue_meta + course_offerings from regional-catalogue.json (T5.5).
 * Requires DATABASE_URL in .env (repo root).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const jsonPath = path.join(root, 'frontend/data/regional-catalogue.json');

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
const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL required');
  process.exit(1);
}

const catalogue = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const client = new pg.Client({ connectionString: url });

await client.connect();
try {
  await client.query(
    `insert into public.catalogue_meta (id, version, imported_at, source_file, offering_count, payload, updated_at)
     values ('default', $1, $2::timestamptz, $3, $4, $5::jsonb, now())
     on conflict (id) do update set
       version = excluded.version,
       imported_at = excluded.imported_at,
       source_file = excluded.source_file,
       offering_count = excluded.offering_count,
       payload = excluded.payload,
       updated_at = now()`,
    [
      catalogue.meta.version,
      catalogue.meta.importedAt,
      catalogue.meta.sourceFile,
      catalogue.meta.offeringCount,
      JSON.stringify(catalogue.meta),
    ]
  );

  for (const o of catalogue.offerings) {
    await client.query(
      `insert into public.course_offerings (offering_id, family_id, course_name, tier_id, payload, updated_at)
       values ($1, $2, $3, $4, $5::jsonb, now())
       on conflict (offering_id) do update set
         family_id = excluded.family_id,
         course_name = excluded.course_name,
         tier_id = excluded.tier_id,
         payload = excluded.payload,
         updated_at = now()`,
      [o.offeringId, o.familyId, o.courseName, o.tierId, JSON.stringify(o)]
    );
  }
  console.log(`Synced ${catalogue.offerings.length} offerings to Supabase.`);
} finally {
  await client.end();
}
