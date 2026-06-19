# GSC / GA4 Owner Actions — Post B15 Verification

**Date:** 20 June 2026  
**Owner:** Mahaa (Marketing) / Sheikh (legal sign-off)

Agent verified all public-fetch prerequisites. Complete these authenticated checks and attach screenshots/exports to [pmstructure-result-scan-links.csv](../pmstructure-result-scan-links.csv).

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
