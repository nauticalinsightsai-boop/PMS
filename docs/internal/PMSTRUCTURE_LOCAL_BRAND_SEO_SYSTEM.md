# PM Structure — Local / Brand SEO, GBP, Citations, Favicon, Social, Site Search

## Purpose

This document defines PM Structure's online-first local and brand SEO governance: location trust, favicon/OG signals, social profile audit, GBP/citation deferrals, and site-search decision.

This is an internal operations document. Do not publish it as a public page.

## Location strategy — Option A (Online-first)

PM Structure has no verified public street address, no GBP documentation, no opening-hours policy, and B12 explicitly blocks fake GCC office claims. Registered address and phone are env-gated (`NEXT_PUBLIC_LEGAL_ENTITY_*`, `NEXT_PUBLIC_CONTACT_PHONE`) and unset in `.env.example`.

**Recommended:** Option A — online-first regional support wording. Do **not** choose Option C (physical location) without owner proof.

### B12 conflict resolved (B14)

Previously `PMS_OFFICE_LOCATIONS` (Dubai, London) rendered with MapPin in Footer and Contact, contradicting `pmstructure-regional-route-approval.csv` (“Do not claim Dubai office/training center unless verified”). B14 replaces this with `PMS_REGIONAL_SUPPORT_NOTE`.

### Safe replacement copy

> PM Structure supports GCC-based, South Asian, and global project professionals through online readiness support, roadmap guidance, and corporate cohort planning.

## Applicability matrix

| Area | Applicable? | Agent action |
|------|-----------|--------------|
| GBP (T-082, T-086–T-091) | **Deferred** | Internal checklist only; no public GBP claims |
| Physical address (T-083) | **N/A** until owner env | Document; do not publish fake address |
| Service location (T-084) | **Online-first wording** | Footer/contact use regional support note |
| Opening hours (T-085) | **N/A** | Document pending |
| Citations/NAP (T-097–T-099) | **Deferred** | Placeholder register only |
| Inside/outside photos (T-094–T-095) | **N/A** | Mark in CSV |
| Team/service photos (T-093, T-096) | **Conditional** | B12 permission rules |
| Favicon (T-029) | **Applicable** | Implemented; audit script verifies |
| Social on site (T-113) | **Applicable** | Register from code; Approved=TBD |
| Site search (T-111) | **Deferred** | Decision CSV; no SearchAction |
| LocalBusiness schema | **N/A** | Keep Organization from B07 |
| SearchAction schema | **N/A** until search exists | Do not add |

## Favicon plan (T-029)

| Asset | Status | Action |
|-------|--------|--------|
| PNG favicon (light/dark) | Implemented | Documented in applicability CSV |
| `app/icon.png` / `apple-icon.png` | OK | Verified in audit script |
| Theme favicon sync | OK | No change |
| `favicon.ico` | Missing | Owner optional |
| `site.webmanifest` | Missing | Defer unless PWA needed |
| `/og/default.png` | OK | Generated via `npm run generate:marketing-images` (1200×630) |

## Social-link plan

1. Populate `pmstructure-social-link-register.csv` from `FOOTER_SOCIAL_LINKS` and support surfaces.
2. Mark **Approved=TBD** until Sheikh/Mahaa confirms PM Structure vs founder-brand URLs.
3. Do **not** add dead profiles or private Slack/Skool invite tokens (B12 rule).
4. Schema `sameAs`: keep minimal (`PMS_ORGANIZATION_SAME_AS`) until owner approves official PM Structure profiles.

## GBP / citations / photos plan

- **GBP:** Readiness CSV only; status **Deferred — owner must confirm eligibility**.
- **Citations:** One placeholder row; **do not create directory listings**.
- **Reviews/Q&A/posts/promotions:** **N/A until GBP verified** in applicability CSV.
- **Inside/outside photos:** **N/A** in CSV.
- **Team/service photos:** Document requirements; B12 testimonial/founder rules apply.

## Site-search plan (T-111)

**Recommendation: Defer**

- Site has HTML sitemap + FAQ/cert filters but no unified search index.
- Implementing search now risks exposing internal routes if mis-scoped.
- Document in `pmstructure-site-search-decision.csv`: defer until content volume justifies; must exclude `/docs/internal`, admin, checkout, account routes.
- **Do not add SearchAction** JSON-LD.

## Owner / Mahaa inputs required

| Input | Blocks |
|-------|--------|
| Verified physical address or approved service-area GBP setup | GBP, citations, LocalBusiness, inside/outside photos |
| Public phone / stable NAP | Citations, GBP |
| Opening hours / support schedule | Hours schema, GBP |
| Official PM Structure social profile URLs | Footer/schema alignment |
| Approved favicon/OG 1200×630 asset | OG default image |
| GBP access + review/Q&A/post owners | T-087–T-091 |
| Team/founder photos with permission | T-096, GBP photos |

## Agent safe vs blocked

**Yes:** internal docs/CSVs, location-trust copy fix, audit script, social/favicon audit, OG brand-icon fallback.

**No:** GBP claims, fake NAP/hours, LocalBusiness schema, SearchAction/sitewide search, citation directory submissions, inventing social URLs.

## Testing plan

```bash
npm run audit:local-brand-seo
npm run audit:offer-trust
npm run seo:schema-guards-check
npm run audit:links
npm run build -w @pms/frontend
npm run lint
```

Manual QA: `/`, `/contact`, `/faq`, `/certifications/pmp` — favicon visible, social links work, no fake office/GBP/hours, no SearchAction in source.

## Do not edit (without owner proof)

- Regional landing routes (blocked claims in B12 register)
- LocalBusiness schema
- GBP public claims or links
- Citation directory submissions
- Public exposure of internal docs

## Cross-links

- B07 schema: `frontend/lib/schema/index.ts`, `PMSTRUCTURE_ARCHITECTURE_ON_PAGE_SEO.md`
- B12 offer/trust: `PMSTRUCTURE_OFFER_TRUST_SYSTEM.md`, `pmstructure-regional-route-approval.csv`, `pmstructure-regional-positioning-rules.csv`
- B13 reporting: `PMSTRUCTURE_REPORTING_QA_SYSTEM.md`
- Remote delivery: `frontend/content/legal/services.ts`
- Registers: `pmstructure-local-seo-applicability.csv`, `pmstructure-gbp-readiness-checklist.csv`, `pmstructure-citation-nap-register.csv`, `pmstructure-social-link-register.csv`, `pmstructure-site-search-decision.csv`

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 19 June 2026
