# PM Structure — Sitemap Plan

**Canonical host:** `https://pmstructure.com`  
**Implementation:** [`frontend/app/sitemap.ts`](../frontend/app/sitemap.ts), [`frontend/lib/sitemap/helpers.ts`](../frontend/lib/sitemap/helpers.ts)

## Current architecture (Run 4 — monolithic, documented defer)

| Item | Status |
|------|--------|
| Sitemap index | Single `/sitemap.xml` (Next.js default) |
| Category split | **Optional** — criteria met (PMP live, 23 answers, 17 topics); monolithic still OK (&lt;500 URLs) |
| URL count | ~250+ static URLs (monolithic sitemap) |
| Guard | `buildSitemapEntry()` + `assertIndexable()` |

**Decision:** Monolithic sitemap is safe under 50k URL limit. Split into category sitemaps when any of: PMP cluster live, `/answers/*` > 20, `/topics/*` > 15, or total URLs > 500.

## Target architecture (post Run 12)

```
/sitemap.xml          → sitemap index
/sitemap-pages.xml    → marketing + certs + legal
/sitemap-blog.xml     → blog posts
/sitemap-newsletter.xml
/sitemap-portals.xml  → published /go/* only
/sitemap-pmp.xml      → PMP cluster (Run 9+)
/sitemap-courses.xml  → dedicated course pages (Run 10+)
/sitemap-faq.xml      → optional FAQ anchors (if needed)
/sitemap-answers.xml  → Run 12
/sitemap-topics.xml   → Run 13
```

## Inclusion rules

- Only `isIndexablePath()` routes (see `indexing-metadata.ts`)
- Canonical URLs only (`buildCanonicalPath`)
- Published blog/newsletter only
- Published go portals only (`getPublishedPortalSitemapPaths()`)
- **Never:** enroll, checkout, admin, api, compare, store

## Robots.txt

[`frontend/app/robots.ts`](../frontend/app/robots.ts)

- `Disallow: /api/`, `/admin/`
- **Do not** disallow `/checkout` (use meta noindex instead)
- `Sitemap: https://pmstructure.com/sitemap.xml`

## Validation

```bash
npm run seo:sitemap-check
npm run seo:check
```

## Tasks when splitting sitemaps

- [ ] Add `frontend/app/sitemap.ts` index route or custom `sitemap.xml` route handler
- [ ] Update `robots.ts` sitemap index URL
- [ ] Update GSC submission plan (Run 19)
- [ ] Run full `seo:sitemap-check` per file
