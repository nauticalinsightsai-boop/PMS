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

Page views: `send_page_view: false` on gtag config + manual SPA `page_view` on route change.

---

## Duplicate Tracking Risks

| Risk | Status | Mitigation |
|------|--------|------------|
| GTM + direct GA4 double pageviews | Not present | Do not add GTM GA4 tag without disabling direct gtag |
| Auto + manual `page_view` | Controlled | `send_page_view: false` |
| Lead on submit + thank-you page | Controlled | Roadmap uses inline success; events fire in submit handler only |
| `generate_lead` + `pms_roadmap_form_submit` | Intentional | Both fire once on successful submit |
| Direct visit to success URL | Partial | `purchase` gated on `verifyCheckoutSession` + `trackPurchaseOnce` dedup |
| Legacy `conversion-events.ts` vs `pms-events.ts` | Coexist | Phase 14 micro-events (`view_pmp_*`, `click_enroll_*`) are supporting; primary funnel uses `pms-events.ts` |

---

## Primary Events

| Event | Meaning | GA4 Key Event? |
|-------|---------|----------------|
| `pms_roadmap_cta_click` | User clicks PMP roadmap CTA | No |
| `pms_roadmap_form_start` | User starts roadmap form | No |
| `generate_lead` | Lead form successfully submitted | Yes |
| `pms_roadmap_form_submit` | PMP roadmap form successfully submitted | Yes |
| `pms_booking_click` | User clicks booking/schedule link | Yes if primary action |
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

- Analytics scripts load **only after** visitor accepts optional analytics cookies ([`CookieConsent.tsx`](../../frontend/components/CookieConsent.tsx), [`consent.ts`](../../frontend/lib/legal/consent.ts)).
- **Google Consent Mode v2 is not implemented** — owner/legal decision required before adding.
- Do not bypass consent or fire analytics before acceptance.

---

## PII Rule

Do not send name, email, phone, message body, card details, IDs, or private notes to GA4/GTM.

Use non-PII parameters only. CRM payloads via `submitPublicInteraction` are separate from GA4.

PII keys stripped in [`push-event.ts`](../../frontend/lib/analytics/push-event.ts).

---

## Offline Conversion Feasibility

**Today (browser → CRM):** `ga_client_id`, gclid/gbraid/wbraid, UTMs, landing_page, consent flags via [`lead-tracking-context.ts`](../../frontend/lib/analytics/lead-tracking-context.ts).

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

**Candidates:** `generate_lead`, `pms_roadmap_form_submit`, `pms_booking_click`, `begin_checkout`, `purchase`, `qualify_lead`, `close_convert_lead`.

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
