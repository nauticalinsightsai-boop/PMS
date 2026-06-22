# PM Structure — Final Crawl Fixes and SEO Closeout

## Purpose

This document closes the PM Structure SEO implementation system (Batch B15).

This is an internal SEO and technical QA document. Do not publish it as a public page.

## First Commercial Focus

PMP 2026 Readiness Pathway

## Preferred Host

https://pmstructure.com

## Priority URLs

- /
- /certifications
- /certifications/pmp
- /topics/pmp-exam-2026
- /answers/is-the-pmp-exam-changing-in-2026
- /answers
- /topics
- /faq
- /legal/privacy (canonical; `/privacy` redirects here via 308)
- /legal/terms (canonical; `/terms` redirects here via 308)

## Related registers (B15)

| Register | File |
|----------|------|
| Crawl findings | [pmstructure-crawl-findings-register.csv](./pmstructure-crawl-findings-register.csv) |
| Priority URL QA | [pmstructure-priority-url-qa.csv](./pmstructure-priority-url-qa.csv) |
| Legacy URL decisions | [pmstructure-legacy-url-decision-register.csv](./pmstructure-legacy-url-decision-register.csv) |
| A–Z batch closeout | [pmstructure-a-z-implementation-closeout.csv](./pmstructure-a-z-implementation-closeout.csv) |
| Digital PR / backlinks | [pmstructure-digital-pr-backlink-register.csv](./pmstructure-digital-pr-backlink-register.csv) |
| Owner actions | [pmstructure-final-owner-action-list.csv](./pmstructure-final-owner-action-list.csv) |
| Post-fix evidence | [evidence/B15_POST_FIX_VERIFICATION_EVIDENCE.md](./evidence/B15_POST_FIX_VERIFICATION_EVIDENCE.md) |

## Closeout Rule

Do not mark a batch or issue as verified without evidence.

Acceptable evidence:

- crawler export (Screaming Frog, Sitebulb, etc.)
- screenshot
- build/lint output
- GSC screenshot/export
- GA4 DebugView/Realtime screenshot
- PageSpeed/Lighthouse report
- manual QA record
- owner approval register entry

## Production fix verification (20 June 2026)

**Status: Verified** — live public-fetch evidence in [evidence/B15_POST_FIX_VERIFICATION_EVIDENCE.md](./evidence/B15_POST_FIX_VERIFICATION_EVIDENCE.md).

| Fix | Status | Evidence |
|-----|--------|----------|
| `/sitemap.xml` no longer 500 | Verified | HTTP 200; 203 URLs |
| `/terms` no longer 404 | Verified | HTTP 308 → `/legal/terms` |
| `/privacy` duplicate resolved | Verified | HTTP 308 → `/legal/privacy` |
| Answer page public TODO removed | Verified | No TODO strings in HTML |
| `/go/website` testimonial risk | Verified | No named pass stories; permission placeholder |
| `robots.txt` sitemap reference | Verified | Live robots.txt |
| Sitemap private-route exclusion | Verified | Sitemap URL audit |
| Priority URLs HTTP/indexability | Verified | 9/9 return 200; index,follow; self-canonical |

## Legacy URL Rule

Do not leave duplicate PMP commercial intent undocumented.

**Preferred canonical owners (B15 default):**

- `/certifications/pmp` — primary commercial PMP 2026 Readiness Pathway page
- `/topics/pmp-exam-2026` — informational PMP 2026 topic hub
- `/answers/is-the-pmp-exam-changing-in-2026` — direct answer for one search question

**Interim operational decision (T-032 — live, indexed, 20 June 2026):**

- `/pmp` — **keep** supporting PMP hub (self-canonical; in sitemap) until Sheikh approves OA-004 consolidation
- `/pmp-exam-2026` — **keep** deep cluster guide (self-canonical; in sitemap) until Sheikh approves OA-005 consolidation

Owner must confirm: **keep T-032 multi-URL architecture** or **consolidate** to B15 preferred URLs (301 redirects). See [pmstructure-legacy-url-decision-register.csv](./pmstructure-legacy-url-decision-register.csv).

## Legal URL Rule

Canonical legal structure: `/legal/*`.

- `/privacy` → `/legal/privacy` — **Verified live** (308, `frontend/next.config.ts`)
- `/terms` → `/legal/terms` — **Verified live** (308, `frontend/next.config.ts`)

Do not leave duplicate legal pages indexable with identical content.

## June 2026 schedule dev continuation (19 June 2026)

- Published `/answers/pmp-training-hours-vs-pdus` (Jul 3 website row)
- Marked Jul 2, 3, 6, 11 website schedule rows **Done** in marketing CSV
- Fixed on-page audit drift (community/membership breadcrumbs, diagnostic metadata)
- Owner gates: [seo-closeout-owner-gates-2026-06-19.csv](./seo-closeout-owner-gates-2026-06-19.csv)
- `npm run seo:release-verify` pass after changes

## Full crawl status

**Partial crawl evidence attached** — lightweight sitemap URL audit (50-URL sample, 0 failures) in [evidence/b15-sitemap-url-audit-2026-06-20.json](./evidence/b15-sitemap-url-audit-2026-06-20.json).

**Full Screaming Frog/Sitebulb export still pending** (OA-001). Do not claim full crawl complete until Mahaa attaches export.

## Performance status

**Partial Lighthouse baseline attached** — mobile performance scores for `/`, `/certifications`, `/certifications/pmp`, `/newsletter` in [evidence/b15-lighthouse-production-summary-2026-06-20.json](./evidence/b15-lighthouse-production-summary-2026-06-20.json).

Desktop PSI and remaining priority URLs pending (OA-009).

## GSC / GA4 status

Public prerequisites verified. Authenticated GSC/GA4 proof pending — see [evidence/GSC_GA4_OWNER_ACTIONS.md](./evidence/GSC_GA4_OWNER_ACTIONS.md) (OA-002, OA-003).

## Backlink / Digital PR Rule

Do not fake backlinks.

Use only legitimate outreach, citations, partnerships, expert contributions, and useful content assets. See [pmstructure-digital-pr-backlink-register.csv](./pmstructure-digital-pr-backlink-register.csv).

## Prior batch cross-links

- B03: [PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md](./PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md), [PMSTRUCTURE_GA4_GSC_REPORTING_QA.md](./PMSTRUCTURE_GA4_GSC_REPORTING_QA.md)
- B04: [PMSTRUCTURE_CRAWL_INDEXATION_CONTROL.md](./PMSTRUCTURE_CRAWL_INDEXATION_CONTROL.md)
- B05: [PMSTRUCTURE_REDIRECT_URL_CANONICALIZATION.md](./PMSTRUCTURE_REDIRECT_URL_CANONICALIZATION.md), [pmstructure-redirect-map.csv](./pmstructure-redirect-map.csv)
- B06: [pmstructure-on-page-seo-audit.csv](./pmstructure-on-page-seo-audit.csv)
- B13: [PMSTRUCTURE_REPORTING_QA_SYSTEM.md](./PMSTRUCTURE_REPORTING_QA_SYSTEM.md), [pmstructure-qa-signoff-register.csv](./pmstructure-qa-signoff-register.csv)

## Final Owner Actions

See [pmstructure-final-owner-action-list.csv](./pmstructure-final-owner-action-list.csv).

## Batch B15 closeout status

**Dev verified live** (22 June 2026) — owner evidence still partial

- Production technical fixes: **Verified**
- Sitemap readiness: **Verified**
- Legal route readiness: **Verified** (live redirects)
- PMP content safety: **Verified**
- Testimonials safety: **Verified**
- Legacy URL SEO risk: **Needs Owner Approval** (T-032 interim keep)
- GSC readiness: **Pending External Evidence**
- GA4 readiness: **Pending External Evidence**
- Performance readiness: **Verified** (16/16 PSI batch 2026-06-22)
- Full crawl readiness: **Partially Verified** (sitemap audit attached; SF export pending)
- Legal approval: **Pending External Evidence**
- Owner approvals: **Needs Owner Approval**
- Final SEO closeout: **Dev complete** — see `docs/internal/evidence/seo-remaining-closeout-2026-06-22.md`

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 22 June 2026 (SEO remaining closeout complete)
