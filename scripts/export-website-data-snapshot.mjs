/**
 * Export website_data rows to docs/cms-audit/website-data-snapshot.json (T-001).
 * Uses DATABASE_URL when available; otherwise writes bundled seed defaults.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { buildAllSeedDocuments } from '../packages/site-content/src/seeds/index.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outPath = path.join(root, 'docs/cms-audit/website-data-snapshot.json');

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

async function fetchFromDb() {
  const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!url) return null;
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    const { rows } = await client.query(
      'select field_key, content, is_published, updated_at from public.website_data order by field_key',
    );
    return rows;
  } finally {
    await client.end();
  }
}

const exportedAt = new Date().toISOString();
let snapshot;

try {
  const rows = await fetchFromDb();
  if (rows?.length) {
    snapshot = {
      meta: { exportedAt, source: 'database', rowCount: rows.length },
      rows,
    };
  } else {
    const seeds = buildAllSeedDocuments();
    snapshot = {
      meta: { exportedAt, source: 'bundled-seeds', rowCount: seeds.length, note: 'DATABASE_URL unavailable or empty table' },
      rows: seeds.map((doc) => ({
        field_key: doc.field_key,
        content: doc.content,
        is_published: false,
        updated_at: exportedAt,
      })),
    };
  }
} catch (err) {
  const seeds = buildAllSeedDocuments();
  snapshot = {
    meta: {
      exportedAt,
      source: 'bundled-seeds',
      rowCount: seeds.length,
      error: err instanceof Error ? err.message : String(err),
    },
    rows: seeds.map((doc) => ({
      field_key: doc.field_key,
      content: doc.content,
      is_published: false,
      updated_at: exportedAt,
    })),
  };
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2));
console.log(`Wrote ${snapshot.rows.length} rows to ${outPath} (${snapshot.meta.source})`);
