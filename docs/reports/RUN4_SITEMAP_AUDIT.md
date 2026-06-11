# Run 4. Sitemap & Robots Audit

**Date:** 2026-06-10 (updated post-deploy)  
**Scope:** `frontend/app/sitemap.ts`, `frontend/app/robots.ts`, indexing matrix

## Summary

Monolithic sitemap is live at `https://pmstructure.com/sitemap.xml` with **~181 indexable URLs** across marketing, certifications (27), PMP cluster (21), answers (23), topics (17), legal, blog, newsletter, and `/go/*` portals. Enroll/checkout/admin routes are excluded via `buildSitemapEntry` + `assertIndexable`.

## URL categories in sitemap

| Category | Source | Count (approx) |
|----------|--------|----------------|
| Marketing core | Static list | 12 |
| Certifications | `siteData.certifications` | 27 |
| PMP cluster | `PMP_CLUSTER_PATHS` | 13 |
| PMP courses/services | course + service paths | 8 |
| Answers | `ANSWER_PATHS` | 23 |
| Topics | `TOPIC_PATHS` | 17 |
| Legal | registry + privacy regions | 20+ |
| Blog / newsletter | CMS published | dynamic |
| Go portals | booking-crm | ~41 |

## Excluded (verified)

- `/checkout/*`, `/certifications/*/enroll/*`
- `/admin/*`, `/login`, `/dashboard`
- Draft/unpublished content

## robots.ts

- References `https://pmstructure.com/sitemap.xml` (via `PMS_SITE_URL`)
- Disallows `/api/`, `/admin/` only: no disallow on noindex-meta routes

## Validation

- `npm run seo:sitemap-check`. OK
- Production build: 252 static pages
- GSC sitemap submitted: operator confirmed

## Follow-up

- Split sitemap index (13 child sitemaps) documented as TODO in `SITEMAP_PLAN.md` when URL count exceeds 500