# PM Structure — Analytics and Conversion Tracking System

## Purpose

This document defines PM Structure's analytics, conversion tracking, GA4/GTM, key events, and reporting QA system.

This is an internal technical and marketing operations document. Do not publish it as a public page.

**Related docs:**

- [`PMSTRUCTURE_ANALYTICS_SETUP.md`](PMSTRUCTURE_ANALYTICS_SETUP.md) — base GA4 loader and env vars (T-012)
- [`PMSTRUCTURE_CONVERSION_TRACKING_PLAN.md`](PMSTRUCTURE_CONVERSION_TRACKING_PLAN.md) — T-013 funnel implementation map
- [`PMSTRUCTURE_GA4_GSC_REPORTING_QA.md`](PMSTRUCTURE_GA4_GSC_REPORTING_QA.md) — B03 reporting QA
- [`pmstructure-event-map.csv`](pmstructure-event-map.csv) — B03 event inventory
- [`pmstructure-offline-conversion-template.csv`](pmstructure-offline-conversion-template.csv) — offline lead import template
- [`PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md`](PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md) — B04 GSC checks

---

## Primary Funnel

**PMP 2026 Readiness Pathway**

Visitor → PMP 2026 page → roadmap CTA → roadmap form → lead → booking/follow-up → qualified lead → paid learner.

---

## Preferred Tracking Method

**Selected (B03):** Direct GA4 (`gtag.js`), consent-gated via cookie banner.

**Future option:** Google Tag Manager if owner provides `NEXT_PUBLIC_GTM_ID` and approves migration.

**Rule:** Do not run duplicate GA4 pageview tracking through both GTM and direct gtag unless duplication is intentionally prevented.

| Input | Status |
|-------|--------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Active — owner confirmed `G-E9QRM0GQ1W` |
| `NEXT_PUBLIC_GTM_ID` | Not configured |

Implementation: [`frontend/components/analytics/GoogleAnalytics.tsx`](../../frontend/components/analytics/GoogleAnalytics.tsx), [`frontend/lib/analytics/ga-config.ts`](../../frontend/lib/analytics/ga-config.ts).

Page views: owned by the single `@next/third-parties` Google Analytics installation. Manual SPA `page_view` calls are disabled to avoid duplication.

---

## Duplicate Tracking Risks

| Risk | Status | Mitigation |
|------|--------|------------|
| GTM + direct GA4 double pageviews | Not present | Do not add GTM GA4 tag without disabling direct gtag |
| Auto + manual `page_view` | Controlled | One Google Analytics installation owns pageviews; manual helper is a no-op |
| Lead conversions across public forms | Controlled | Shared interaction helper fires once after authoritative `201` persistence |
| Browser Pixel + CAPI `Lead` | Controlled | Same opaque client submission ID is used as `event_id` |
| Direct visit to success URL | Partial | `purchase` gated on `verifyCheckoutSession` + `trackPurchaseOnce` dedup |
| Legacy `conversion-events.ts` vs `pms-events.ts` | Coexist | Phase 14 micro-events (`view_pmp_*`, `click_enroll_*`) are supporting; primary funnel uses `pms-events.ts` |

---

## Primary Events

| Event | Meaning | GA4 Key Event? |
|-------|---------|----------------|
| `pms_roadmap_cta_click` | User clicks PMP roadmap CTA | No |
| `pmp_roadmap_form_start` | User starts roadmap form | No |
| `pmp_roadmap_fit_complete` | Candidate completes fit diagnostics once per form session | No |
| `pmp_roadmap_eligibility_complete` | Candidate completes eligibility diagnostics once per form session | No |
| `generate_lead` | Lead form successfully submitted | Yes |
| `select_content` | User clicks a booking/schedule CTA | No |
| `booking_confirmed` | Trusted appointment confirmation | Yes |
| `pms_contact_click` | User clicks email/WhatsApp/phone/contact | Maybe |
| `begin_checkout` | User starts live checkout | Yes if payment live |
| `purchase` | Verified payment success | Yes |
| `pms_waitlist_join` | Secondary waitlist submission | Maybe |
| `sign_up` | Newsletter signup success | Maybe |
| `qualify_lead` | Lead becomes qualified | Yes, offline/server-side later |
| `close_convert_lead` | Lead becomes paid learner | Yes, offline/server-side later |

Full inventory: [`pmstructure-event-map.csv`](pmstructure-event-map.csv).

Transport: [`frontend/lib/analytics/push-event.ts`](../../frontend/lib/analytics/push-event.ts) → consent-gated `gtag`.

---

## Consent / Cookie Behavior

- GA4 loads only after analytics consent; Meta Pixel/CAPI and ad click-ID capture require marketing consent ([`CookieConsent.tsx`](../../frontend/components/CookieConsent.tsx), [`consent.ts`](../../frontend/lib/legal/consent.ts)).
- UTMs remain contextual attribution. `fbclid`, `gclid`, `gbraid`, `wbraid`, and `msclkid` are stored and submitted only with marketing consent.
- Withdrawal clears pending Meta events, marketing click-ID storage, and related cookies.
- **Google Consent Mode v2 is not implemented** — owner/legal decision required before adding.
- Do not bypass consent or fire analytics before acceptance.

---

## PII Rule

Do not send name, email, phone, message body, card details, IDs, or private notes to GA4/GTM.

Use non-PII parameters only. CRM payloads via `submitPublicInteraction` are separate from GA4.

PII keys stripped in [`push-event.ts`](../../frontend/lib/analytics/push-event.ts).

---

## Offline Conversion Feasibility

**Today (browser → CRM):** consent-gated `ga_client_id`, consent-gated ad click IDs, contextual UTMs, landing page, and consent flags via [`lead-tracking-context.ts`](../../frontend/lib/analytics/lead-tracking-context.ts).

**Not implemented:** Measurement Protocol, Google Ads offline import automation, qualification workflow events.

**Blocked until:** API secret, CRM export process, consent handling, owner approval.

Template: [`pmstructure-offline-conversion-template.csv`](pmstructure-offline-conversion-template.csv).

---

## Manual GA4 Key Event Steps

1. Open GA4 Admin.
2. Go to Data display → Events / Key events.
3. Confirm events are receiving data (DebugView after deploy).
4. Mark relevant events as key events.
5. Do not mark events until they fire correctly.

**Candidates:** `generate_lead`, `booking_confirmed`, `begin_checkout`, `purchase`, `qualify_lead`, `close_convert_lead`.

---

## Google Ads Conversion Import (manual)

1. Link GA4 and Google Ads.
2. Confirm GA4 events are firing.
3. Mark relevant GA4 events as key events.
4. Import selected GA4 key events into Google Ads as conversions.
5. Use `generate_lead` for lead submissions.
6. Use `purchase` or `close_convert_lead` for paid learner conversion.
7. Use enhanced conversions for leads only after consent and data handling are confirmed.

Do not add Google Ads tags in codebase unless explicitly required.

---

## Verification

Regenerate/check: `npm run check:ga`, `npm run seo:audit-analytics`.

Manual:

- Google Tag Assistant
- GA4 Realtime
- GA4 DebugView
- Browser DevTools Network tab
- Test form submission where owner approves

See [`PMSTRUCTURE_GA4_GSC_REPORTING_QA.md`](PMSTRUCTURE_GA4_GSC_REPORTING_QA.md) for full QA checklist.

---

## Owner Actions (post-deploy)

1. Confirm production `NEXT_PUBLIC_GA_MEASUREMENT_ID` on Vercel matches `G-E9QRM0GQ1W`.
2. Mark GA4 key events in Admin after DebugView verification.
3. Link GA4 ↔ Google Ads when ads run; import key events.
4. Decide GTM migration vs staying on direct GA4.
5. Decide Google Consent Mode v2 (legal).
6. Provide Measurement Protocol API secret + CRM export before offline server events.
7. Run test lead / test checkout in staging with owner approval.

---

## Owner Inputs Required

| Input | Required For |
|-------|--------------|
| GTM ID | GTM tracking (future) |
| GA4 Measurement ID | Direct GA4 or Measurement Protocol |
| Measurement Protocol API secret | Offline/server events |
| Consent/cookie decision | Privacy handling |
| Google Ads access | Conversion import |
| Form destination | Lead tracking |
| CRM/database/Google Sheet | Offline lead status |
| Payment provider/session ID | Purchase tracking |
| Final prices | Ecommerce values |

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026
