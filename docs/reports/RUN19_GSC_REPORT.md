# Run 19 — GSC / Bing Submission Report

**Date:** 2026-06-10  
**Status:** GSC complete — Bing + monitoring remain

## Completed

- [x] `PMSTRUCTURE_GSC_BING_SUBMISSION_PLAN.md` — properties, sitemap URL, 15+ inspection targets
- [x] GSC property `https://pmstructure.com` — HTML file verification (`google5780310dc725cd18.html`)
- [x] Sitemap submitted: `sitemap.xml` (~181 URLs, apex canonical)
- [x] Vercel env `NEXT_PUBLIC_SITE_URL=https://pmstructure.com`
- [x] `npm run seo:smoke-live` — 10/10 on production (2026-06-10)
- [x] `npm run seo:release-verify` — build 252 pages + 17 checks + render-check 8 routes

## Operator follow-up

- [ ] Bing Webmaster Tools — import from GSC at [bing.com/webmasters](https://www.bing.com/webmasters)
- [ ] Rich Results Test — use URLs in `RUN8_SCHEMA_REPORT.md`
- [x] GSC URL inspection — recommended for priority URLs below
- [ ] Monitor Coverage + sitemap **Discovered pages** weekly for 30 days (expect ~181)

## Priority URL inspections

| URL | Purpose |
|-----|---------|
| `/` | Homepage SSR + H1 |
| `/pmp-exam-2026` | PMP 2026 anchor |
| `/pmp` | Cluster hub |
| `/certifications/pmp` | Conversion + pricing |
| `/faq` | FAQPage schema |
| `/answers/is-the-pmp-exam-changing-in-2026` | AEO answer |
| `/topics/pmp-exam-2026` | Topic hub |

## Monitoring (30 days)

- Coverage: excluded vs indexed
- FAQ rich results on `/faq`
- Crawl stats for `/answers/*` and `/topics/*`
- Manual queries: “PMP exam 2026”, “PMP readiness”
