# PM Structure — Architecture, Keywords, and On-Page SEO

## Purpose

This document defines PM Structure's site architecture, keyword-to-URL map, title/H1/meta standards, internal-linking rules, breadcrumbs, navigation, and on-page SEO governance.

This is an internal SEO and UX document. Do not publish it as a public page.

**Related internal docs:**

- Site architecture (T-032): [`PMSTRUCTURE_SITE_ARCHITECTURE.md`](PMSTRUCTURE_SITE_ARCHITECTURE.md), [`pmstructure-site-architecture.csv`](pmstructure-site-architecture.csv)
- Keyword & anchor map Phase Two (T-022): [`PMSTRUCTURE_KEYWORD_ANCHOR_MAP_PHASE_2.md`](PMSTRUCTURE_KEYWORD_ANCHOR_MAP_PHASE_2.md), [`pmstructure-keyword-anchor-map-phase-2.csv`](pmstructure-keyword-anchor-map-phase-2.csv)
- Redirect / canonical (B05): [`PMSTRUCTURE_REDIRECT_URL_CANONICALIZATION.md`](PMSTRUCTURE_REDIRECT_URL_CANONICALIZATION.md)
- Analytics / conversion (B03): [`PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md`](PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md)
- Schema (B07 handoff): visible breadcrumbs implemented in B06; full BreadcrumbList JSON-LD expansion deferred to B07. Existing component: `frontend/components/seo/BreadcrumbJsonLd.tsx`

**B06 audit artifacts:**

- [`pmstructure-keyword-url-map.csv`](pmstructure-keyword-url-map.csv)
- [`pmstructure-on-page-seo-audit.csv`](pmstructure-on-page-seo-audit.csv)
- [`pmstructure-internal-link-map.csv`](pmstructure-internal-link-map.csv)
- [`pmstructure-breadcrumb-map.csv`](pmstructure-breadcrumb-map.csv)

**Implementation source in code:** `frontend/content/seo/phase-2-page-seo.ts`, `frontend/lib/site-metadata.ts`, `frontend/content/site-architecture/routes.ts`

---

## First Commercial Focus

PMP 2026 Readiness Pathway

## Preferred Host

https://pmstructure.com

---

## Primary Architecture

- `/` — Homepage
- `/certifications` — Certification hub
- `/certifications/pmp` — Primary PMP 2026 commercial page
- `/topics/pmp-exam-2026` — PMP 2026 topic hub
- `/answers/is-the-pmp-exam-changing-in-2026` — Direct answer page
- `/certifications/compare` — Certification comparison
- `/faq` — Trust and compliance page
- `/community` — Learning community support
- `/membership` — Membership support
- `/pm-service` — B2B/service support
- `/legal/*` — Legal/trust support
- `/pmp-exam-2026` + `/pmp/*` — Supporting deep-guide cluster (not primary nav)

Only use routes that exist and are useful.

---

## Keyword-to-URL Rule

One primary intent maps to one primary URL.

| Intent | Primary URL |
|--------|-------------|
| PMP commercial readiness | `/certifications/pmp` |
| PMP 2026 informational hub | `/topics/pmp-exam-2026` |
| Direct question (exam changing 2026) | `/answers/is-the-pmp-exam-changing-in-2026` |
| Certification exploration | `/certifications` |
| Certification comparison | `/certifications/compare` |

---

## Cannibalization Policy

| URL | Primary intent | Recommended action |
|-----|----------------|-------------------|
| `/certifications/pmp` | PMP commercial | **keep** — money page |
| `/topics/pmp-exam-2026` | PMP 2026 hub | **keep** — topic hub |
| `/pmp-exam-2026` + `/pmp/*` | Deep guide cluster | **keep** — supporting; link to commercial + hub |
| `/pmp` | Legacy pillar index | **canonicalize** in copy/links; redirect = B05 owner |
| `/compare` vs `/certifications/compare` | Comparison | **keep** categorized route; flat `/compare` = owner review |
| Secondary cert pages | Non-PMP pathways | **keep** — must not outrank PMP for PMP commercial terms |

Do not implement redirects in B06. See B05 for redirect-owner approval.

---

## URL Categorization

**Preferred categorized routes:**

- `/certifications/*` — certification hub and detail pages
- `/topics/*` — topic hubs
- `/answers/*` — direct answer pages
- `/legal/*` — legal documents

**Deep-guide cluster (flat routes, supporting layer):**

- `/pmp-exam-2026`, `/pmp-readiness-diagnostic`, `/pmp-*` domain pages
- Footer links to both `/pmp-exam-2026` (deep guide) and `/topics/pmp-exam-2026` (topic hub)
- Breadcrumbs for deep guide point to `/pmp` hub intentionally (T-032)

**Note:** Spec references `/legal/refund`; live route is `/legal/refunds`.

---

## Title Standards

Recommended title length: **40–60 characters** where practical.

Avoid duplication, keyword stuffing, fake guarantees, and official-body claims unless verified.

Preferred examples:

- Homepage: `PM Structure | PMP 2026 Readiness & Project Certification Support`
- PMP page: `PMP 2026 Readiness Pathway | PM Structure`
- Topic hub: `PMP Exam 2026 Guide | PM Structure`
- Answer page: `Is the PMP Exam Changing in 2026? | PM Structure`
- FAQ: `PM Structure FAQ | PMP Readiness, Training Hours & Support`

---

## Meta Description Standards

Recommended length: **120–160 characters** where practical.

Use clear, safe, useful descriptions. No fake guarantees or unverified official-body claims.

---

## H1 Standards

Each page should have one clear H1 matching core intent.

Homepage uses T-169 benefit-led H1 in visible hero and sr-only server heading. B06 spec H1 alternative documented in audit CSV — **owner approval required** before hero rewrite.

---

## Internal Link Rules

- Homepage should link to PMP page, certification hub, compare, FAQ, community, membership, pm-service.
- PMP commercial page should link to topic hub, answer page, FAQ, compare.
- Topic hub should link to PMP page, answer pages, FAQ, compare.
- Answer pages should link back to PMP page and topic hub.
- Certification hub should link to certification detail pages.
- Avoid excessive generic links to homepage (`learn more → /`).

Anchor text: use descriptive labels (PMP 2026 Readiness Pathway, PMP Exam 2026 Guide, Compare Project Management Certifications, PM Structure FAQ). Avoid `click here`, `learn more`, `read more`.

---

## Breadcrumb Rules

Visible breadcrumbs on nested priority pages via `frontend/components/navigation/Breadcrumbs.tsx`.

Examples:

- Home > Certifications > PMP 2026 Readiness Pathway
- Home > Topics > PMP Exam 2026
- Home > Answers > Is the PMP Exam Changing in 2026?
- Home > Legal > Privacy Policy

JSON-LD: partial via `BreadcrumbJsonLd.tsx`. Full schema expansion = **B07** (do not duplicate in B06).

---

## Navigation Rules

**Header:** Certifications, PMP 2026 (`/certifications/pmp`), Compare Pathways, FAQ, Community, Get Roadmap CTA. Membership in header = owner decision (footer-only today).

**Footer:** Explore + Resources columns; PMP 2026 Readiness, deep guide (`/pmp-exam-2026`), topic hub (`/topics/pmp-exam-2026`), Answers, Topics, Newsletter. Legal via footer support links.

Do not link to missing pages, checkout flows as primary nav, or internal docs.

---

## T-075 SOGO / Header-Footer Scripts

**N/A — PM Structure is Next.js, not WordPress.** No SOGO or WordPress header/footer plugin layer. Tracking is consent-gated GA4 via `GoogleAnalytics.tsx` (B03). Do not add random injected scripts without owner IDs.

---

## Mobile UX Rules

- Navigation works on mobile (Sheet menu, min-h-11 tap targets).
- CTAs visible and tappable (roadmap CTA in nav drawer).
- Forms readable on small screens.
- No horizontal overflow in header/footer.
- Tables/cards adapt to screen width.

---

## Alt Text Rules

Meaningful images need descriptive alt text. Decorative images use `alt=""`. Do not keyword-stuff alt text.

---

## Form Rules

- Preferred CTA: **Get My PMP 2026 Roadmap**
- Homepage and cert pages use responsive dual-mount `PmpRoadmapLeadForm` (mobile + desktop hero) — intentional, not accidental duplicate conversion blocks.
- Forms need accessible labels (`htmlFor`), clear CTA, no API/analytics changes without approval (B03).

---

## Uncategorized Pages / Posts

**N/A for WordPress taxonomy.** Blog at `/blog` flagged in audit CSV for owner review if thin. Planned routes in architecture CSV marked `Planned - do not publish yet`.

---

## Manual QA Checklist (Post-Deploy)

For each priority URL (`/`, `/certifications`, `/certifications/pmp`, `/topics/pmp-exam-2026`, `/answers/is-the-pmp-exam-changing-in-2026`, `/faq`):

1. Title is unique
2. Meta description is unique
3. One clear H1
4. Logical H2/H3 structure
5. Primary CTA is clear
6. Internal links point to relevant pages
7. Breadcrumbs appear where needed
8. Header/footer links work
9. Mobile layout works
10. Images have meaningful alt or decorative empty alt
11. Forms have labels
12. No duplicated accidental forms (responsive pattern documented)
13. No unsafe certification claims
14. No links to missing pages
15. No links to internal docs

---

## Owner Decisions Still Required

1. **Homepage H1:** Keep T-169 benefit copy vs B06 spec H1 ("PMP 2026 Readiness, Structured for Serious Project Professionals")
2. **Footer strategy:** Both deep guide and topic hub links implemented (recommended); confirm labels
3. **Header Membership:** Add to nav or keep footer-only
4. **`/pmp` cluster redirects:** When to canonicalize to `/certifications/pmp` (B05)
5. **Homepage form count:** Keep 3 roadmap form placements or consolidate sections

---

## Audit Command

```bash
npm run seo:audit-on-page-seo
```

Also run: `seo:architecture-check`, `seo:keyword-map-check`, `seo:internal-links-check`

---

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026
