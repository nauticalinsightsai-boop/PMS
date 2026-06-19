# PM Structure — Internal Editing Guide

## Purpose

This document explains where PM Structure website content and SEO settings are edited.

This is an internal operating guide. Do not publish it as a public page.

**Related:** [`PMSTRUCTURE_ARCHITECTURE_ON_PAGE_SEO.md`](PMSTRUCTURE_ARCHITECTURE_ON_PAGE_SEO.md) · [`PMSTRUCTURE_TECHNICAL_HYGIENE.md`](PMSTRUCTURE_TECHNICAL_HYGIENE.md) · [`../MASTER_PLATFORM_PROMPT.md`](../MASTER_PLATFORM_PROMPT.md)

---

## Editing areas

| Area | Where Edited | Who Can Edit | Risk | Notes |
| --- | --- | --- | --- | --- |
| Homepage copy & sections | `/admin` → Site System → Home (`home_page_config` in Supabase) + `frontend/components/pages/Home.tsx` fallbacks | Owner + developer | Medium | Avoid changing primary PMP 2026 positioning without review |
| Certification pages | `frontend/data/siteData.ts`, cert registry scripts, CMS page editors | Developer | High | Keep certification claims compliance-safe |
| PMP 2026 cluster | `frontend/content/pmp/*`, `frontend/components/pmp/*` | Developer | High | Primary commercial cluster |
| Answer / topic pages | `frontend/content/answers/*`, `frontend/content/topics/*`, phase-2 SEO | Developer | High | B06 minimum internal links |
| FAQ content | `frontend/content/faq/*`, FAQ components | Developer + owner | Medium | Must stay compliance-safe |
| Navigation | `frontend/components/Navbar.tsx`, `frontend/components/Footer.tsx` | Developer | Medium | Do not link to missing or internal-only pages |
| Metadata (title/description) | `frontend/content/seo/phase-2-page-seo.ts`, per-route `metadata` in `app/` | Developer | High | Avoid duplicate titles/descriptions — run `seo:audit-on-page-seo` |
| Schema / OG / JSON-LD | B07 components under `frontend/components/seo/`, `npm run seo:generate-ai-files` | Developer only | High | No fake claims; no duplicate schema |
| Analytics events | B03 — `pmstructure-event-map.csv`, `GoogleAnalytics.tsx`, conversion components | Developer only | High | Do not send PII or duplicate events |
| Sitemap / indexation | B04 — `frontend/content/indexation/strategy.ts`, `frontend/app/sitemap.ts`, `robots.ts` | Developer only | High | Do not index checkout/admin/API |
| Redirects | B05 — `frontend/next.config.ts`, `frontend/content/redirects/inventory.ts` | Developer only | High | Apex host only |
| Images / assets | `frontend/public/`, `npm run generate:marketing-images`, `npm run optimize:brand-icons` | Developer + owner | Medium | B08 pipeline; correct alt text (B06) |
| Portals `/go/*` | Dashboard Booking CRM + `data/channel-landing-pages.json` | Owner | Medium | Channel logos large — portal-only |
| Newsletter / blog posts | `/admin` CMS + `packages/site-content` registries | Owner + developer | Medium | Draft/publish workflow |
| Legal pages | `frontend/content/legal/*` | Developer + owner | High | Legal review before publish |
| Regional pricing | `packages/regional-catalogue`, Supabase sync scripts | Developer | High | Pricing claims sensitive |
| Calendly URLs | Env vars + `docs/CALENDLY_*` — not hardcoded in page copy | Developer + owner | Medium | HTTPS only |

---

## Admin dashboard (non-developer friendly)

Production URL: `https://pmstructure.com/admin/login`

| Task | Path |
| ---- | ---- |
| Edit homepage sections | Admin → Site System → Home |
| Edit public page copy | Admin → Site System → Pages |
| Newsletter posts | Admin → Site System → Newsletter |
| Channel landing pages | Admin → Booking CRM → CTA Management |
| View form submissions | Admin → Booking CRM → Interaction Inbox |

CMS API: `POST /admin/api/cms/website-data` with `intent: saveDraft | publish`.

---

## Do not edit without review

- Claims about PMI / PRINCE2 / Six Sigma official status
- Pass guarantees or success-rate claims
- Pricing, refunds, and payment flow
- Analytics event names and consent wiring (B03)
- Schema claims and `@id` URLs (B07)
- Sitemap / noindex / robots rules (B04)
- Redirects and canonical host rules (B05)
- Environment variables and secrets
- Stripe, Supabase service role, webhook secrets

---

## Safe checks after content edits

```bash
npm run seo:audit-on-page-seo
npm run audit:technical-hygiene
npm run build -w @pms/frontend
```

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026
