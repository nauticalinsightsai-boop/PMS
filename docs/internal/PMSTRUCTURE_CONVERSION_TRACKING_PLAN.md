# PM Structure — Conversion Tracking Plan

## Purpose

This document defines PM Structure’s online and offline conversion tracking plan.

The first commercial funnel is:

```
PMP 2026 Readiness Pathway
```

The goal is to measure qualified leads, roadmap requests, booking intent, checkout activity, paid learner conversion, and offline lead quality.

This is an internal technical and marketing document. Do not publish it as a public page.

**B03 consolidated governance:** [`PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md`](PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md)  
**Event inventory:** [`pmstructure-event-map.csv`](pmstructure-event-map.csv)  
**Reporting QA:** [`PMSTRUCTURE_GA4_GSC_REPORTING_QA.md`](PMSTRUCTURE_GA4_GSC_REPORTING_QA.md)  
**Base GA4 setup:** [`PMSTRUCTURE_ANALYTICS_SETUP.md`](PMSTRUCTURE_ANALYTICS_SETUP.md)

---

## Primary Conversion Events

| Event                     | Meaning                                      | Mark as GA4 Key Event?             |
| ------------------------- | -------------------------------------------- | ---------------------------------- |
| `generate_lead`           | Roadmap/contact form successfully submitted  | Yes                                |
| `pms_roadmap_form_submit` | PMP 2026 roadmap form successfully submitted | Yes                                |
| `pms_booking_click`       | User clicks booking/schedule link            | Yes if booking is a primary action |
| `begin_checkout`          | User starts live checkout                    | Yes if payment is live             |
| `purchase`                | Payment success confirmed                    | Yes                                |
| `qualify_lead`            | Lead becomes qualified after review          | Yes                                |
| `close_convert_lead`      | Lead becomes paid learner/customer           | Yes                                |

---

## Supporting Events

| Event                     | Meaning                                              |
| ------------------------- | ---------------------------------------------------- |
| `pms_roadmap_cta_click`   | User clicks roadmap CTA                              |
| `pms_roadmap_form_start`  | User starts roadmap form                             |
| `pms_contact_click`       | User clicks email, WhatsApp, phone, or other contact |
| `pms_waitlist_join`       | User joins a secondary pathway/resource waitlist     |
| `pms_membership_interest` | User shows membership interest                       |
| `pms_resource_interest`   | User shows resource/store interest                   |

---

## Implementation (T-013)

| Layer | Location |
| ----- | -------- |
| Event names + defaults | `frontend/lib/analytics/pms-events.ts` |
| Transport | `frontend/lib/analytics/push-event.ts` → `trackFunnelEvent` → consent-gated `gtag` |
| Lead attribution (offline) | `frontend/lib/analytics/lead-tracking-context.ts` → merged in `submit-public.ts` |
| Roadmap CTA | `track-roadmap-cta.ts`, `PmpRoadmapCtaLink`, `CertRoadmapCta` |
| Roadmap form | `PmpRoadmapLeadForm` — start + submit in handler only |
| Booking | `track-booking-click.ts`, `open-themed-popup.ts` |
| Contact | `TrackedContactLink`, `track-contact-click.ts` |
| Waitlist | `WaitlistForm` |
| Checkout | `begin_checkout` on live Stripe/checkout flows (cert, membership, store) |
| Purchase | `track-purchase-once.ts` on verified success pages (enrollment, store, membership) |
| Newsletter | `NewsletterSubscribeForm` — `sign_up` on success |

Lead events fire in the **form submit handler** when `res.ok` — not on thank-you UI render (inline success only).

---

## Online Tracking Rule

Browser events must not send personally identifiable information.

Do not send:

* name,
* email,
* phone,
* CNIC/passport/ID,
* payment card details,
* full message text,
* street address,
* private notes.

Allowed non-PII event parameters include:

* form ID,
* CTA text,
* CTA location,
* page path,
* offer ID,
* offer name,
* certification,
* region group,
* buyer type,
* package type,
* currency,
* value where applicable.

---

## Offline Conversion Rule

Offline conversion tracking should only be enabled when PM Structure has:

1. consent handling,
2. lead ID,
3. GA client ID or advertising click ID,
4. CRM/database/Google Sheet record,
5. clear qualification status,
6. payment/paid learner status,
7. and a safe server-side or import process.

Until then, offline tracking should use a CSV/manual review process.

Template: `pmstructure-offline-conversion-template.csv`

**Lead payload fields (browser → CRM):** every public form submission via `submitPublicInteraction` attaches:

* `ga_client_id` — when analytics consent granted and gtag loaded
* `gclid`, `gbraid`, `wbraid` (+ first-touch `first_*` variants)
* last-touch UTMs (`utm_source`, `utm_medium`, etc.)
* `landing_page` — first page path in session
* `consent_analytics`, `consent_marketing`

Attribution is captured on shell mount (`initAttributionCapture`) and refreshed at submit time.

**Remaining gaps:** no server-side Measurement Protocol or Google Ads offline import yet; qualification workflow (`qualify_lead`, `close_convert_lead`) is CSV/manual.

---

## GA4 Key Events to Configure Manually

After implementation, mark these as key events in GA4 where relevant:

```
generate_lead
pms_roadmap_form_submit
pms_booking_click
begin_checkout
purchase
qualify_lead
close_convert_lead
```

Only mark events that are actually firing.

**Owner action (June 2026):** mark key events in GA4 Admin after post-deploy DebugView verification (see checklist below).

---

## Google Ads Conversion Notes

If PM Structure uses Google Ads later:

1. Mark the GA4 event as a key event first.
2. Import relevant GA4 key events into Google Ads.
3. Avoid counting weak events as conversions.
4. Use `generate_lead` for lead submission.
5. Use `close_convert_lead` or offline conversion import for paid learner conversion where possible.
6. Use enhanced conversions for leads only after consent and data-handling are confirmed.

---

## Verification Checklist

After deployment:

1. Open Google Tag Assistant.
2. Visit homepage.
3. Click “Get My PMP 2026 Roadmap.”
4. Start the roadmap form.
5. Submit a test lead only if allowed.
6. Confirm `pms_roadmap_cta_click` fires.
7. Confirm `pms_roadmap_form_start` fires once.
8. Confirm `generate_lead` fires only after successful submission.
9. Confirm `pms_roadmap_form_submit` fires only after successful submission.
10. Confirm no PII appears in event parameters.
11. Confirm no duplicate events fire.
12. Confirm GA4 DebugView receives the events.
13. Mark selected events as key events only after confirming they fire correctly.

---

## Owner Inputs Required

| Input                                 | Required For               | Status (June 2026) |
| ------------------------------------- | -------------------------- | ------------------ |
| GTM ID or GA4 Measurement ID          | Base tracking              | **Confirmed:** `G-E9QRM0GQ1W` (direct GA4) |
| GA4 Admin access                      | Mark key events            | Owner — post-deploy manual step |
| Google Ads account access             | Import conversions         | Pending (when ads run) |
| Consent/cookie decision               | Legal/privacy handling     | **Signed off** — banner gates analytics; Consent Mode v2 not implemented |
| Form destination                      | Lead tracking              | Implemented |
| CRM/database/Google Sheet destination | Offline tracking           | Lead payloads include attribution fields |
| Payment provider/session ID           | Purchase tracking          | Implemented (Stripe success pages) |
| Final package prices                  | Ecommerce values           | As configured in checkout flows |
| Confirmation of live products         | Checkout/purchase tracking | Owner confirms per launch |

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026
