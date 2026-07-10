# OA-008 — Geo page builds cancelled; geo slug redirects allowed

**Status:** Locked (2026-07-10)

## Decision

- Do **not** build regional commercial landing pages (UAE, Egypt, Saudi Arabia, Qatar, Oman, Kuwait, Bahrain, etc.).
- Keyword Plan geo SEO URLs **may** exist as permanent **301** redirects into `/certifications/pmp` (or other hubs per the redirect matrix).
- Ranking and conversion consolidate on hubs + `KeywordLeadPopup` (form, WhatsApp, Calendly).

## Evidence in repo

- Redirect source of truth: `frontend/content/seo/keyword-redirect-map.ts`
- CSV: `docs/internal/pmstructure-keyword-redirect-map.csv`
- Architecture: `docs/internal/PMSTRUCTURE_KEYWORD_REDIRECT_ARCHITECTURE.md`
