# Run 4 — Sitemap & Robots Audit

**smap-01:** Monolithic `sitemap.ts` audited against indexing matrix; indexable public routes included, checkout/admin/API excluded. Category split deferred per SITEMAP_PLAN TODO. Report

**Date:** 2026-06-10  
**Scope:** `frontend/app/sitemap.ts`, `frontend/app/robots.ts`, indexing matrix

## Summary

Monolithic sitemap is live with ~110+ indexable URLs across marketing, certifications (27), PMP cluster (21+), answers (15), topics (11), legal, blog, newsletter, and `/go/*` portals. Enroll/checkout/admin routes are excluded.

## URL categories in sitemap

| Category | Source | Count (approx) |
|----------|--------|----------------|
| Marketing core | Static list | 12 |
| Certifications | `siteData.certifications` | 27 |
| PMP cluster | `PMP_CLUSTER_PATHS` | 13 |
| PMP courses/services | course + service paths | 8 |
| Answers | `ANSWER_PATHS` | 15 |
| Topics | `TOPIC_PATHS` | 11 |
| Legal | registry + privacy regions | 20+ |
| Blog / newsletter | CMS published | dynamic |
| Go portals | booking-crm | dynamic |

## Excluded (verified)

- `/checkout/*`, `/certifications/*/enroll/*`
- `/admin/*`, `/login`, `/dashboard`
- Draft/unpublished content

## robots.ts

- References `https://www.pmstructure.com/sitemap.xml`
- No disallow on routes that rely on `noindex` meta only

## Validation

- `npm run seo:sitemap-check` — OK
- Production build — 252 static pages (23 `/answers/*`, 17 `/topics/*`)

## Follow-up

- Split sitemap index (13 child sitemaps) documented as TODO in `SITEMAP_PLAN.md` when URL count exceeds 500
