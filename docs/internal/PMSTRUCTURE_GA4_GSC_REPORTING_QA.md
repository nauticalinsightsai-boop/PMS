# PM Structure — GA4 / GSC Reporting QA

## Purpose

This document defines the reporting QA process for PM Structure analytics, Search Console, and conversion tracking.

This is an internal reporting operations document. Do not publish it as a public page.

**Related:** [`PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md`](PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md), [`pmstructure-event-map.csv`](pmstructure-event-map.csv), [`PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md`](PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md), [`PMSTRUCTURE_REPORTING_QA_SYSTEM.md`](PMSTRUCTURE_REPORTING_QA_SYSTEM.md) (B13 weekly/monthly ops).

---

## Weekly Reporting Questions

1. How many users visited PM Structure?
2. Which pages brought traffic?
3. Which PMP 2026 pages received traffic?
4. How many roadmap CTA clicks happened?
5. How many roadmap form starts happened?
6. How many roadmap form submits happened?
7. How many booking clicks happened?
8. How many contact clicks happened?
9. How many qualified leads came from these events?
10. How many paid learners came from these leads?

---

## Priority Pages

- /
- /certifications/pmp
- /answers/is-the-pmp-exam-changing-in-2026
- /topics/pmp-exam-2026
- /faq
- /certifications/compare

---

## GA4 Checks

1. Realtime receives page views.
2. DebugView receives test events.
3. CTA events fire once.
4. Form-start event fires once.
5. Lead event fires only after success.
6. Purchase fires only after verified payment.
7. No PII appears in event parameters.
8. Key events are marked after testing.
9. Events are not duplicated.

---

## Search Console Checks

1. Query impressions for PMP 2026 pages.
2. Clicks to priority URLs.
3. Indexation status.
4. Sitemap status.
5. Canonical status.
6. Manual actions status.
7. Search appearance improvements.

---

## Monthly KPI View

Track:

- users
- sessions
- organic sessions
- PMP page views
- roadmap CTA clicks
- roadmap form starts
- roadmap form submissions
- booking clicks
- contact clicks
- qualified leads
- paid learners
- lead-to-paid conversion rate
- revenue where available

---

## Manual QA Test Table (post-deploy)

| Test | Expected |
|------|----------|
| Homepage load | One `page_view`, not duplicated |
| PMP page load | One `page_view`, not duplicated |
| Reject analytics cookies | `gtag/js` does not load |
| Accept analytics cookies | `gtag/js` loads once |
| Click roadmap CTA | `pms_roadmap_cta_click` fires once |
| Start roadmap form | `pmp_roadmap_form_start` fires once |
| Submit invalid form | No lead event fires |
| Submit valid test form | `generate_lead` fires once after authoritative persistence |
| Click booking link | `select_content` fires once; no lead event |
| Confirm trusted booking | `booking_confirmed` fires once |
| Click WhatsApp/email | `pms_contact_click` fires once |
| Join waitlist | `pms_waitlist_join` fires on success only |
| Newsletter subscribe | `sign_up` fires on success only |
| Start checkout | `begin_checkout` fires once (cert/membership/store) |
| Payment success | `purchase` fires only after verified success |

Tools: Google Tag Assistant, GA4 Realtime, GA4 DebugView, Browser DevTools Network tab.

---

## Owner Inputs Required

| Input | Required For |
|-------|--------------|
| GA4 access | Verify events and reports |
| GSC access | Verify search performance |
| Google Ads access | Conversion imports |
| CRM/Sheet access | Qualified and paid learner tracking |
| Payment provider export | Revenue and purchase validation |

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026
