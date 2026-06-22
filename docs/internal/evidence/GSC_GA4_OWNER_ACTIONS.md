# GSC / GA4 Owner Actions — Post B15 Verification

**Date:** 22 June 2026 (dev closeout complete)  
**Owner:** Mahaa (Marketing) / Sheikh (legal sign-off)  
**Time:** ~30–45 minutes with GSC + GA4 access

Public prerequisites re-verified **2026-06-22**: `seo:smoke-live` 10/10, forms 3/3, `seo:owner-prereq-check` 14/14. Attach screenshots to the paths below, then update [pmstructure-result-scan-links.csv](../pmstructure-result-scan-links.csv) and [pmstructure-final-owner-action-list.csv](../pmstructure-final-owner-action-list.csv).

## Quick links

| Tool | URL |
|------|-----|
| Google Search Console | https://search.google.com/search-console |
| GSC Sitemaps | Property → Sitemaps → submit `sitemap.xml` |
| GSC URL Inspection | Property → URL inspection (paste each URL below) |
| GA4 property | https://analytics.google.com/ — measurement ID `G-E9QRM0GQ1W` |
| GA4 DebugView | Admin → DebugView (enable debug after accepting cookies on site) |

**Screenshot drop folder (create if missing):** `docs/internal/evidence/gsc/` and `docs/internal/evidence/ga4/`

## GSC — 9 priority URLs (OA-002 o-m-002)

Paste each into URL Inspection; screenshot status (Indexed / Crawled / etc.):

1. https://pmstructure.com/
2. https://pmstructure.com/certifications/pmp
3. https://pmstructure.com/certifications
4. https://pmstructure.com/pmp-exam-2026
5. https://pmstructure.com/topics/pmp-exam-2026
6. https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026
7. https://pmstructure.com/faq
8. https://pmstructure.com/answers
9. https://pmstructure.com/topics

**Legal (o-m-004):** also inspect https://pmstructure.com/legal/terms and https://pmstructure.com/legal/privacy

## GSC checklist

| Task | Public prerequisite verified | Owner action | Evidence to attach |
|------|------------------------------|--------------|-------------------|
| Sitemap resubmit | Yes — sitemap returns 200, 203 URLs | Resubmit `https://pmstructure.com/sitemap.xml` in GSC | SCAN-005 screenshot |
| Priority URL indexing | Yes — all 9 priority URLs return 200, index,follow | URL Inspection for each priority URL | SCAN-001 follow-up or new SCAN row |
| Manual actions | N/A publicly | Confirm "No issues detected" in Manual actions | GSC screenshot |
| Legal URL inspection | Yes — `/terms` and `/privacy` 308 to `/legal/*` | Inspect `/legal/terms` and `/legal/privacy` | URL inspection screenshots |

## GA4 checklist

| Event | Public prerequisite verified | Owner action | Evidence to attach |
|-------|------------------------------|--------------|-------------------|
| page_view | GA tag present in HTML | DebugView on priority URLs after cookie consent | SCAN-004 screenshot |
| roadmap CTA click | CTAs live on priority pages | Click "Get My PMP 2026 Roadmap" in DebugView | SCAN-004 screenshot |
| form start | Forms live on cert/home pages | Focus first form field; confirm event | SCAN-004 screenshot |
| generate_lead | Form submit endpoint live | Submit test lead; confirm event (no PII in params) | SCAN-004 screenshot |
| booking click | Calendly buttons live | Click Calendly CTA; confirm event | SCAN-004 screenshot |
| Tag Assistant duplicate check | N/A | Run Tag Assistant; confirm single GA4 config | Tag Assistant export |

## Runbook

Follow [PMSTRUCTURE_GA4_GSC_REPORTING_QA.md](../PMSTRUCTURE_GA4_GSC_REPORTING_QA.md) and [PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md](../PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md).

When complete, update [pmstructure-final-owner-action-list.csv](../pmstructure-final-owner-action-list.csv) OA-002 and OA-003 to **Verified** with evidence links.
