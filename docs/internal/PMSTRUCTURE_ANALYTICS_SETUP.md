# PM Structure — Analytics Setup

## Purpose

This document records the base analytics setup for PM Structure.

This is an internal technical document. Do not publish it as a public page.

---

## Preferred Tracking Approach

Preferred setup:

```
Google Tag Manager for base GA4 and future conversion tracking.
```

Fallback:

```
Direct GA4 Google tag only if no GTM container is available.
```

**Current implementation:** Direct GA4 (`gtag.js`), consent-gated. No GTM container is configured.

Do not run duplicate GA4 pageview tracking through both GTM and direct gtag unless duplication is intentionally prevented.

---

## Required Owner Inputs

| Input                             | Required Format        | Status                       |
| --------------------------------- | ---------------------- | ---------------------------- |
| GTM Container ID                  | GTM-XXXXXXX            | Not configured (direct GA4)  |
| GA4 Measurement ID                | G-XXXXXXXXXX           | **Confirmed:** `G-E9QRM0GQ1W` |
| Consent/cookie requirement        | Owner/legal decision   | **Signed off** — banner gates analytics; Consent Mode v2 not implemented |
| Roadmap form conversion event     | T-013 browser events   | Implemented — see conversion plan |
| Payment/checkout conversion event | T-013 browser events   | Implemented — begin_checkout, purchase |
| Offline lead/import tracking      | T-013 docs + CSV       | Lead payloads capture ga_client_id, gclid, UTMs; server import pending |

Consent/cookie behavior requires owner/legal confirmation. Analytics must respect applicable privacy requirements and any existing consent mechanism before full conversion tracking is enabled.

Google Consent Mode v2 is **not** implemented. Analytics scripts load only after the visitor accepts optional analytics cookies via the site cookie banner.

---

## Environment Variables

Use one of the following:

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

or:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Active variable:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`

Do not enable both for the same GA4 pageview unless tracking duplication is controlled.

Set the measurement ID on Vercel (marketing `frontend` project). The codebase falls back to `G-E9QRM0GQ1W` when unset at build time. **Owner confirmed** this matches the production GA4 property (June 2026).

---

## Implementation Summary

| Item | Location |
| ---- | -------- |
| GA4 loader (consent-gated) | `frontend/components/analytics/GoogleAnalytics.tsx` |
| Measurement ID resolution | `frontend/lib/analytics/ga-config.ts` |
| Event helper | `frontend/lib/analytics/gtag.ts` |
| Funnel / page views / UTM | `frontend/lib/analytics/funnel.ts` |
| Conversion event names | `frontend/lib/analytics/conversion-events.ts` |
| Cookie consent | `frontend/components/CookieConsent.tsx`, `frontend/lib/legal/consent.ts` |
| Public site mount | `frontend/components/PublicShell.tsx` |
| Portal routes mount | `frontend/app/go/[channel]/PortalRegionShell.tsx` |
| Config check script | `npm run check:ga` |

Page views use `send_page_view: false` on gtag config and manual SPA `page_view` events on route change (avoids duplicate auto pageviews).

---

## Verification Steps

After deployment:

1. Open the site in a browser.
2. Use Google Tag Assistant.
3. Confirm only one intended Google tag or GTM container loads.
4. Open GA4 Realtime report.
5. Visit the homepage.
6. Visit `/certifications/pmp`.
7. Submit no forms yet unless testing is approved.
8. Confirm page views appear.
9. Confirm there are no duplicate page views.
10. Confirm consent behavior matches owner/legal decision.

Reject non-essential cookies first and confirm `gtag/js` does **not** load. Accept all and confirm it loads once.

---

## Important

Base analytics setup is not the same as conversion tracking.

Conversion tracking is handled separately in:

```
T-013 — Conversion Tracking Online and Offline
```

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Last updated: 18 June 2026
