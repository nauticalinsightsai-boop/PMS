# B15 Post-Fix Verification Evidence Bundle

**Site:** https://pmstructure.com  
**Captured:** 20 June 2026  
**Agent:** Cursor post-fix verification implementation

## Attached machine-readable evidence

| File | Description |
|------|-------------|
| [b15-post-fix-verification-fetch-2026-06-20.json](./b15-post-fix-verification-fetch-2026-06-20.json) | HTTP status, title, canonical, robots, H1 for 14 URLs |
| [b15-sitemap-url-audit-2026-06-20.json](./b15-sitemap-url-audit-2026-06-20.json) | 203-URL sitemap audit; 50-URL sample; forbidden-route check |
| [b15-lighthouse-production-summary-2026-06-20.json](./b15-lighthouse-production-summary-2026-06-20.json) | Lighthouse performance scores (mobile) for 4 routes |
| [b15-compare-h1-manual-qa-2026-06-20.md](./b15-compare-h1-manual-qa-2026-06-20.md) | Browser manual QA for `/certifications/compare` H1 |
| [GSC_GA4_OWNER_ACTIONS.md](./GSC_GA4_OWNER_ACTIONS.md) | Owner checklist for GSC/GA4 items requiring authenticated access |

## Public-fetch verification summary

### Verified fixed in production

- `/sitemap.xml` — HTTP 200, 203 URLs, valid XML
- `/terms` — HTTP 308 → `/legal/terms`
- `/privacy` — HTTP 308 → `/legal/privacy`
- Answer page — no public `TODO` strings
- `/go/website` — no named pass stories; permission-safe placeholder
- `robots.txt` — references sitemap; disallows `/api/`, `/admin/`
- Sitemap — priority URLs included; no `/api/`, `/admin/`, `/checkout`, `/thank-you` locs
- All nine priority URLs — HTTP 200, `index, follow`, self-canonical

### Interim owner decisions documented (T-032)

- `/pmp` — **keep live hub** until Sheikh approves consolidation (OA-004)
- `/pmp-exam-2026` — **keep live cluster guide** until Sheikh approves consolidation (OA-005)
- Legacy URLs **remain in sitemap** until consolidation decision (lines 256, 262, 1192)

### Pending owner / external evidence

- GSC sitemap resubmit + indexing screenshots (Mahaa)
- GA4 DebugView / Tag Assistant event proof (Mahaa)
- Formal legal sign-off row (Sheikh)
- Scholarship/pricing/corporate/regional approvals (Sheikh)
- Full Screaming Frog/Sitebulb export (Mahaa) — lightweight sitemap audit attached as interim crawl substitute

## SEO closeout dev verification (19 June 2026)

| Check | Result |
|-------|--------|
| `npm run seo:release-verify` | **Pass** — build + seo:all + seo:postbuild (12 render-check routes) |
| `npm run seo:audit-analytics` | **Pass** — repo gtag scan OK |
| `npm run seo:production-check` | **Pass** — 6 production URLs |
| Owner gates G1–G6 | Recorded in [seo-closeout-owner-gates-2026-06-19.csv](../seo-closeout-owner-gates-2026-06-19.csv) |
| `npm run seo:smoke-live` | **Pass** — 10/10 production URLs ([SMOKE_LIVE_2026-06-19.md](../../reports/SMOKE_LIVE_2026-06-19.md)) |

Phase 1 dev items: phase-2 metadata for `/pmp-exam-2026` + `/pmp-readiness-diagnostic`; community/membership breadcrumbs; compare page H2/CTA; blog noindex + sitemap exclusion; footer internal links for answers/topics/PMP cluster.

## Closeout status

**Batch B15: Partially Verified** — production blockers fixed; external GSC/GA4/owner sign-offs remain.
