/**
 * Replace picsum/pravatar URLs in published website_data JSON (store, testimonials).
 * Requires DATABASE_URL in .env (repo root).
 *
 * Usage:
 *   node scripts/cms/sanitize-placeholder-images.mjs [--dry-run] [--publish]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');

/** Mirrors defaultStoreCatalog() imageUrl values in packages/site-content/src/store.ts */
const STORE_IMAGE_BY_ID = {
  'pmp-mock-pack': '/images/marketing/membership-templates-500.webp',
  'pmo-templates': '/images/marketing/membership-templates-500.webp',
  'agile-planner': '/images/marketing/membership-guides-500.webp',
  'exam-bundle': '/images/marketing/membership-tools-500.webp',
  'risk-pack': '/images/marketing/community-workshop-600.webp',
  'lss-green-kit': '/images/marketing/membership-webinars-500.webp',
};
const dryRun = process.argv.includes('--dry-run');
const publish = process.argv.includes('--publish');

const PLACEHOLDER_RE = /picsum\.photos|pravatar\.cc/i;

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

function sanitizeStoreContent(content) {
  let changed = 0;
  if (!content?.products) return { content, changed };
  for (const product of content.products) {
    const url = product.imageUrl || product.image?.url || '';
    if (!PLACEHOLDER_RE.test(url)) continue;
    const replacement = STORE_IMAGE_BY_ID[product.id] || '/images/marketing/membership-templates-500.webp';
    product.imageUrl = replacement;
    if (product.image) product.image = { ...product.image, url: replacement };
    changed += 1;
  }
  return { content, changed };
}

function sanitizeTestimonials(content) {
  let changed = 0;
  const avatars = [
    '/images/marketing/pmp-avatar-1.webp',
    '/images/marketing/pmp-avatar-2.webp',
    '/images/marketing/pmp-avatar-3.webp',
  ];
  const items = content?.items ?? content?.testimonials ?? [];
  for (let i = 0; i < items.length; i++) {
    const t = items[i];
    const url = t.avatarUrl || t.avatar?.url || '';
    if (!PLACEHOLDER_RE.test(url)) continue;
    const replacement = avatars[i % avatars.length];
    t.avatarUrl = replacement;
    if (t.avatar) t.avatar = { ...t.avatar, url: replacement };
    changed += 1;
  }
  return { content, changed };
}

loadEnv();
const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
if (!url) {
  console.error('DATABASE_URL required. Dry-run against snapshot only.');
  const snapPath = path.join(root, 'docs/cms-audit/website-data-snapshot.json');
  if (!fs.existsSync(snapPath)) process.exit(1);
  const snap = JSON.parse(fs.readFileSync(snapPath, 'utf8'));
  const rows = Array.isArray(snap) ? snap : snap.rows ?? [];
  const storeRow = rows.find((r) => r.field_key === 'store_catalog' || r.field_key === 'store');
  if (storeRow) {
    const { changed } = sanitizeStoreContent(structuredClone(storeRow.content));
    console.log(`Snapshot store: would replace ${changed} product image(s)`);
  }
  process.exit(0);
}

const client = new pg.Client({ connectionString: url });
await client.connect();

try {
  const keys = ['store_catalog', 'store', 'testimonials', 'home_testimonials'];
  let total = 0;
  for (const fieldKey of keys) {
    const { rows } = await client.query(
      'select field_key, content, is_published from public.website_data where field_key = $1',
      [fieldKey],
    );
    if (!rows.length) continue;
    const row = rows[0];
    const clone = structuredClone(row.content);
    const result =
      fieldKey === 'store_catalog' || fieldKey === 'store'
        ? sanitizeStoreContent(clone)
        : sanitizeTestimonials(clone);
    if (result.changed === 0) {
      console.log(`${fieldKey}: no placeholder URLs`);
      continue;
    }
    total += result.changed;
    console.log(`${fieldKey}: ${result.changed} URL(s) sanitized`);
    if (dryRun) continue;
    await client.query(
      `update public.website_data set content = $2::jsonb, updated_at = now()${
        publish ? ', is_published = true' : ''
      } where field_key = $1`,
      [fieldKey, JSON.stringify(result.content)],
    );
  }
  console.log(dryRun ? `Dry-run: ${total} URL(s) would change` : `Done: ${total} URL(s) updated`);
} finally {
  await client.end();
}
