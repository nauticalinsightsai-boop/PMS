# PM Structure — GSC & Bing Submission Plan

**Run:** 19 (Phase 18)  
**Property:** https://www.pmstructure.com  
**Status:** Ready after deploy — do not submit until production build verified

## Properties to verify

| Platform | URL prefix / domain | Action |
|----------|---------------------|--------|
| Google Search Console | `https://www.pmstructure.com` | Verify ownership (DNS or HTML) |
| Bing Webmaster Tools | `https://www.pmstructure.com` | Import from GSC or verify separately |

## Sitemap submission

- **URL:** `https://www.pmstructure.com/sitemap.xml`
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

- [ ] Production deploy complete
- [ ] `npm run seo:release-verify` green on release branch
- [ ] `npm run seo:smoke-live` green against `https://www.pmstructure.com`
- [ ] No `noindex` on PMP/answer/topic indexable routes
