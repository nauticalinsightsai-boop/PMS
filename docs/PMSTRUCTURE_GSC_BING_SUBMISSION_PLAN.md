# PM Structure. GSC & Bing Submission Plan

**Run:** 19 (Phase 18)  
**Property:** https://pmstructure.com (apex: `www` has no DNS until added)  
**Status:** GSC sitemap **Pending** (15 discovered / ~187 sitemap URLs, owner 2026-06-18). Bing verified + sitemap submitted.

## Properties to verify

| Platform | URL prefix / domain | Action |
|----------|---------------------|--------|
| Google Search Console | `https://pmstructure.com` | Verify ownership (HTML file already deployed) |
| Bing Webmaster Tools | `https://pmstructure.com` | **Verified** (owner 2026-06-18, `BingSiteAuth.xml`) |

## Sitemap submission

- **In GSC → Sitemaps**, enter only: `sitemap.xml` (not a file upload, not `/frontend/public/...`)
- **Full URL:** `https://pmstructure.com/sitemap.xml`
- Submit once after Run 17 `seo:all` passes on production
- Re-submit after major PMP/FAQ/answer/topic releases

## Priority URL inspections (15+)

| URL | Purpose |
|-----|---------|
| `/` | Homepage SSR + H1 |
| `/pmp-exam-2026` | PMP 2026 anchor |
| `/pmp` | Cluster hub |
| `/certifications/pmp` | Conversion + pricing |
| `/faq` | FAQPage schema |
| `/answers/is-the-pmp-exam-changing-in-2026` | AEO answer (verify SSR body in view-source) |
| `/answers/what-are-the-pmp-eligibility-requirements` | AEO answer (expansion) |
| `/topics/pmp-exam-2026` | Topic hub |
| `/topics/exam-readiness` | Topic hub (expansion) |
| `/pmp-foundation` | Course page |
| `/legal/pricing-disclaimers` | Compliance |
| `/legal/regional-pricing` | Regional policy |
| `/blog` | Content index |
| `/newsletter` | Content index |

Add remaining PMP cluster URLs after indexation of anchor pages.

## Post-submit monitoring (30 days)

- Coverage report: excluded vs indexed
- FAQ rich results on `/faq`
- Crawl stats for `/answers/*` and `/topics/*`
- Manual query checks for “PMP exam 2026”, “PMP readiness”

## Blockers before submit

- [x] Production deploy complete (Railway PMS service, apex HTTPS live)
- [x] `npm run seo:production-check` green (2026-06-18)
- [x] `npm run seo:smoke-live` green (2026-06-18, 10/10)
- [x] Sitemap/robots use `https://pmstructure.com` (localhost guard in `pms-site.ts`)
- [x] No `noindex` on PMP/answer/topic indexable routes

## Release run log

See `docs/reports/SMOKE_LIVE_2026-06-18.md` for live HTTP verification.

**Owner still required:** GSC sitemap **Success** (currently Pending); URL Inspection + Request indexing on priority URLs. Bing: monitor discovered URLs 48–72h. Internal log: `docs/internal/PMSTRUCTURE_SEARCH_CONSOLE_SUBMISSION.md`.