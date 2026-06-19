# PM Structure — B03 GSC / GA4 Validation Checklist

## Purpose

This checklist validates Search Console and GA4 after the analytics/indexation implementation work.

This is an internal validation document. Do not publish it as a public page.

**Related:** [`PMSTRUCTURE_GA4_GSC_REPORTING_QA.md`](PMSTRUCTURE_GA4_GSC_REPORTING_QA.md), [`PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md`](PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md), [`pmstructure-event-map.csv`](pmstructure-event-map.csv), [`PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md`](PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md).

## Status Rule

Do not mark anything verified without evidence.

Acceptable evidence:

- GA4 Realtime screenshot
- GA4 DebugView screenshot
- Tag Assistant result
- GSC property screenshot
- GSC sitemap screenshot
- GSC URL inspection screenshot
- exported CSV
- dated owner/Mahaa confirmation

## GSC Checks

| Check | Status | Evidence | Owner | Notes |
|---|---|---|---|---|
| GSC property exists for https://pmstructure.com | Pending | TBD | Mahaa |  |
| Sitemap submitted | Pending | TBD | Mahaa |  |
| Sitemap discovered successfully | Pending | TBD | Mahaa |  |
| Homepage indexed | Pending | TBD | Mahaa |  |
| /certifications/pmp indexed or submitted | Pending | TBD | Mahaa |  |
| /topics/pmp-exam-2026 indexed or submitted | Pending | TBD | Mahaa |  |
| /answers/is-the-pmp-exam-changing-in-2026 indexed or submitted | Pending | TBD | Mahaa |  |
| /faq indexed or submitted | Pending | TBD | Mahaa |  |
| Manual actions checked | Pending | TBD | Mahaa |  |
| Page indexing errors reviewed | Pending | TBD | Mahaa |  |
| 404 report reviewed | Pending | TBD | Mahaa |  |

## GA4 Checks

| Check | Status | Evidence | Owner | Notes |
|---|---|---|---|---|
| GA4 property exists | Pending | TBD | Mahaa |  |
| GA4 tag fires once per pageview | Pending | TBD | Mahaa |  |
| GTM/GA4 duplicate tracking checked | Pending | TBD | Mahaa |  |
| pms_roadmap_cta_click fires | Pending | TBD | Mahaa |  |
| pms_roadmap_form_start fires once | Pending | TBD | Mahaa |  |
| generate_lead fires only after successful submit | Pending | TBD | Mahaa |  |
| pms_roadmap_form_submit fires only after successful submit | Pending | TBD | Mahaa |  |
| pms_booking_click fires | Pending | TBD | Mahaa |  |
| pms_contact_click fires | Pending | TBD | Mahaa |  |
| No PII sent to GA4 | Pending | TBD | Mahaa |  |
| Key events marked in GA4 after testing | Pending | TBD | Mahaa |  |

## Required Owner Action

Mahaa or the account owner must validate GSC/GA4 with access.

Cursor must not claim this is complete without evidence.
