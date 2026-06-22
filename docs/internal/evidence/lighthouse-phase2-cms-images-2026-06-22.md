# Phase 2 — CMS placeholder images (2026-06-22)

## Snapshot audit (`docs/cms-audit/website-data-snapshot.json`)

| `field_key` | Placeholder URLs |
|-------------|------------------|
| `store_catalog` | 6× `picsum.photos` product `imageUrl` |
| testimonials fields | **0** in snapshot |

## Production

- Initial HTML: **no** picsum/pravatar (`audit-images.mjs --production`)
- Runtime guards in `Home.tsx` / `Store.tsx` block client hydration fetches

## Migration script

`node scripts/cms/sanitize-placeholder-images.mjs [--dry-run] [--publish]`

Requires `DATABASE_URL`. Dry-run without DB: reports snapshot `store_catalog` replacements (6 URLs).

**Status:** Code defaults + runtime guards shipped; live DB migration optional when `DATABASE_URL` available in deploy environment.
