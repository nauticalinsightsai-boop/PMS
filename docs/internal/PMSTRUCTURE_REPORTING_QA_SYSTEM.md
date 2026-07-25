# PM Structure — Reporting, QA, and Monitoring System

## Purpose

This document defines PM Structure's weekly SEO dashboard, result scan links, monthly technical audit, and QA sign-off system.

This is an internal operations document. Do not publish it as a public page.

## First Commercial Focus

PMP 2026 Readiness Pathway

## Priority URLs

- https://pmstructure.com/
- https://pmstructure.com/certifications
- https://pmstructure.com/certifications/pmp
- https://pmstructure.com/topics/pmp-exam-2026
- https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026
- https://pmstructure.com/faq
- https://pmstructure.com/certifications/compare

## Weekly Dashboard Questions

Every week, answer:

1. What improved?
2. What declined?
3. What broke?
4. What was published?
5. What generated leads?
6. What needs fixing next?

## Weekly Metrics

### Search Console

- clicks
- impressions
- CTR
- average position
- top queries
- top pages
- priority page indexation
- sitemap status
- manual actions status
- new 404s
- canonical issues

Priority query groups: PMP 2026, PMP exam 2026, PMP exam changing 2026, PMP readiness, PMP training hours, PMP vs PRINCE2, project management certifications.

### GA4

- users
- sessions
- organic sessions
- priority page views
- roadmap CTA clicks (`pms_roadmap_cta_click`)
- form starts (`pms_roadmap_form_start`)
- lead submissions (`generate_lead`, `pms_roadmap_form_submit`)
- booking clicks (`pms_booking_click`)
- contact clicks (`pms_contact_click`)
- checkout/purchase events if live (`begin_checkout`, `purchase`)

### Funnel

- PMP page views
- roadmap CTA clicks
- form starts
- form submits
- qualified leads
- bookings
- paid learners

Funnel rates (compute in weekly report; mark `Data unavailable` if missing):

- CTA click rate = roadmap CTA clicks / PMP page views
- Form start rate = form starts / CTA clicks
- Lead submit rate = form submissions / form starts
- Lead-to-booking rate = bookings / form submissions
- Lead-to-paid rate = paid learners / form submissions

## Weekly Technical Checks

- robots.txt returns 200
- sitemap.xml returns 200
- robots.txt includes sitemap
- priority pages return 200
- priority pages are indexable
- private/thank-you/payment pages are not indexable
- canonical host is https://pmstructure.com
- www redirects to non-www
- HTTP redirects to HTTPS
- no major new 404s
- no redirect loops
- no mixed-content warnings
- forms and booking links work
- analytics events fire once (GA4 DebugView — owner evidence)

Automated helper: `npm run audit:weekly-seo-health -- --base=https://pmstructure.com`

## Monthly Technical Audit

Run monthly:

1. Full crawl (Screaming Frog / Sitebulb — link in scan register)
2. Broken-link review
3. Redirect-chain review (`npm run seo:audit-redirects -- --base=https://pmstructure.com`)
4. 404/410 review
5. Sitemap/indexation review (`npm run seo:audit-crawl-indexation`, GSC export)
6. Schema validation (Rich Results Test — link in scan register)
7. OG/social metadata review
8. PageSpeed/Core Web Vitals review (PSI — link in scan register)
9. Mixed-content/security exposure review (`npm run seo:audit-insecure-content`)
10. Content publishing review (`pmstructure-90-day-content-calendar.csv`)
11. Competitor/SERP review (`pmstructure-competitor-metrics.csv`)
12. Lead-quality and conversion review (`pmstructure-offline-conversion-template.csv`)

Track issues in `pmstructure-monthly-technical-audit.csv`.

## Evidence Rule

Do not claim data without evidence.

If GA4, GSC, PageSpeed, crawl, or scan data is missing, mark it as **Pending owner/Mahaa verification**.

Do not invent rankings, traffic, leads, or conversion numbers.

## Related Artifacts

| Artifact | Purpose |
| -------- | ------- |
| [`pmstructure-weekly-seo-dashboard.csv`](pmstructure-weekly-seo-dashboard.csv) | Weekly KPI rows |
| [`pmstructure-result-scan-links.csv`](pmstructure-result-scan-links.csv) | T-101 scan evidence links |
| [`pmstructure-monthly-technical-audit.csv`](pmstructure-monthly-technical-audit.csv) | Monthly issue tracker |
| [`pmstructure-qa-signoff-register.csv`](pmstructure-qa-signoff-register.csv) | Batch QA sign-off |
| [`PMSTRUCTURE_WEEKLY_REPORT_TEMPLATE.md`](PMSTRUCTURE_WEEKLY_REPORT_TEMPLATE.md) | Fill-in weekly report |

## Cross-links (do not redo these batches)

- B03 analytics/reporting: [`PMSTRUCTURE_GA4_GSC_REPORTING_QA.md`](PMSTRUCTURE_GA4_GSC_REPORTING_QA.md), [`PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md`](PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md), [`pmstructure-event-map.csv`](pmstructure-event-map.csv), [`PMSTRUCTURE_B03_GSC_GA4_VALIDATION_CHECKLIST.md`](PMSTRUCTURE_B03_GSC_GA4_VALIDATION_CHECKLIST.md)
- B04 crawl/indexation: [`PMSTRUCTURE_CRAWL_INDEXATION_CONTROL.md`](PMSTRUCTURE_CRAWL_INDEXATION_CONTROL.md), [`PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md`](PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md)
- B05 redirects: [`PMSTRUCTURE_REDIRECT_URL_CANONICALIZATION.md`](PMSTRUCTURE_REDIRECT_URL_CANONICALIZATION.md)
- B08 performance: [`PMSTRUCTURE_PERFORMANCE_SYSTEM.md`](PMSTRUCTURE_PERFORMANCE_SYSTEM.md), [`pmstructure-performance-audit.csv`](pmstructure-performance-audit.csv)
- B10 competitor: [`PMSTRUCTURE_COMPETITOR_BENCHMARK.md`](PMSTRUCTURE_COMPETITOR_BENCHMARK.md), [`pmstructure-competitor-metrics.csv`](pmstructure-competitor-metrics.csv)
- B11 content: [`PMSTRUCTURE_CONTENT_ENGINE.md`](PMSTRUCTURE_CONTENT_ENGINE.md), [`pmstructure-90-day-content-calendar.csv`](pmstructure-90-day-content-calendar.csv)
- B12 offer/trust: [`PMSTRUCTURE_OFFER_TRUST_SYSTEM.md`](PMSTRUCTURE_OFFER_TRUST_SYSTEM.md)
- Owner validation: [`pmstructure-owner-validation-register.csv`](pmstructure-owner-validation-register.csv)
- Offline leads: [`pmstructure-offline-conversion-template.csv`](pmstructure-offline-conversion-template.csv)
- Historical GSC evidence: [`../reports/RUN19_GSC_REPORT.md`](../reports/RUN19_GSC_REPORT.md)

## Owner Roles

- **Sheikh M. Abdullah:** business owner and final decision
- **Developer:** technical implementation and deployment
- **Mahaa:** SEO, GSC, content, competitor, and reporting inputs

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026
