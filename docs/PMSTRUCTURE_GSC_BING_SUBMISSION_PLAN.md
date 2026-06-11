# PM Structure. GSC & Bing Submission Plan

**Run:** 19 (Phase 18)  
**Property:** https://pmstructure.com (apex: `www` has no DNS until added in Vercel Domains)  
**Status:** Deploy verified: submit sitemap after ownership verified

## Properties to verify

| Platform | URL prefix / domain | Action |
|----------|---------------------|--------|
| Google Search Console | `https://pmstructure.com` | Verify ownership (HTML file already deployed) |
| Bing Webmaster Tools | `https://pmstructure.com` | Import from GSC or verify separately |

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

- [x] Production deploy complete (live 200 on priority routes: 2026-06-10)
- [x] `npm run seo:release-verify` green on release branch (2026-06-10, 274 pages)
- [x] `npm run seo:smoke-live` green against `https://pmstructure.com`
- [x] No `noindex` on PMP/answer/topic indexable routes (local `seo:noindex-check` PASS; live HTTP 200 on `/pmp-faq`, answers, topics)

## Release run log

See `docs/reports/RELEASE_VERIFY_2026-06-10.md` for full gate output and 15-URL HTTP pre-inspection.

**Owner still required:** GSC/Bing sitemap submit + URL Inspection tool + Request indexing (cannot be automated without owner credentials).