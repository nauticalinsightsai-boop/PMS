# PM Structure — Site Architecture (T-032)

## Purpose

This document records the **public site hierarchy**, navigation priorities, breadcrumb strategy, and internal linking rules for PM Structure. It consolidates Ask-mode findings into an actionable architecture map for engineering and SEO.

**Related docs:** [`PMSTRUCTURE_INDEXING_MATRIX.md`](../PMSTRUCTURE_INDEXING_MATRIX.md), [`PMSTRUCTURE_KEYWORD_ANCHOR_MAP_PHASE_2.md`](PMSTRUCTURE_KEYWORD_ANCHOR_MAP_PHASE_2.md), [`pmstructure-site-architecture.csv`](pmstructure-site-architecture.csv).

---

## Framework and routing

| Item | Value |
| ---- | ----- |
| Framework | Next.js 15 App Router — `frontend/app/(site)/` |
| Routing | File-based routes + content modules (`content/answers`, `content/topics`, `content/pmp`) + CMS cert registry |
| Canonical host | `https://pmstructure.com` — `frontend/config/pms-site.ts` |

---

## Architecture levels

### Level 1 — Primary entry points

Homepage and top nav targets:

- `/` — Homepage
- `/certifications/pmp` — **Primary PMP commercial page**
- `/certifications` — Certification hub
- `/certifications/compare` — Comparison
- `/faq` — Trust FAQ
- `/community` — Community
- `/membership` — Membership (footer-primary)
- `/pm-service` — PM Service (footer-primary)

### Level 2 — Content hubs

- `/certifications`, `/topics`, `/answers`, `/faq`, `/community`, `/membership`, `/newsletter`, `/pm-service`, `/legal`

### Level 3 — PMP commercial pillar

```
/certifications/pmp          ← primary conversion
  ↔ /topics/pmp-exam-2026
  ↔ /answers/is-the-pmp-exam-changing-in-2026
  ↔ /faq
  ↔ /certifications/compare
  ↔ /pmp-exam-2026           ← supporting deep guide (not primary nav)
```

---

## Navigation rules

### Header (`frontend/components/Navbar.tsx`)

| Label | Target | Notes |
| ----- | ------ | ----- |
| Certifications | `/certifications` | Hub |
| PMP 2026 | `/certifications/pmp` | Commercial primary (not `/pmp-exam-2026`) |
| Compare Pathways | `/certifications/compare` | |
| FAQ | `/faq` | Replaces former Resources → Answers link |
| Community | `/community` | |

### Footer (`frontend/components/Footer.tsx`)

| Column | Highlights |
| ------ | ---------- |
| Explore | Certifications, Compare, **FAQ**, **PM Service**, Membership |
| Resources | **PMP 2026 Readiness** → `/certifications/pmp`, PMP exam guide → `/pmp-exam-2026`, Answers, Topics |

All nav links use **relative paths** only (no `www`).

---

## Breadcrumb strategy

### Shared component

- UI: `frontend/components/navigation/Breadcrumbs.tsx`
- Schema helper: `frontend/components/navigation/breadcrumb-schema.ts` → `breadcrumbItemsToSchema()`
- Route config: `frontend/content/site-architecture/routes.ts`

**Rule:** One `BreadcrumbList` per page, generated from the same `items[]` passed to `<Breadcrumbs />`.

### Priority trails

| Route | Visible trail |
| ----- | ------------- |
| `/certifications/pmp` | Home > Certifications > PMP 2026 Readiness Pathway |
| `/certifications/compare` | Home > Certifications > Compare Project Management Certifications |
| `/faq` | Home > FAQ |
| `/legal/terms`, `/legal/privacy`, etc. | Home > Legal > {document title} |
| `/answers/{slug}` | Home > Answers > {question} |
| `/topics/{slug}` | Home > Topics > {hub h1} |
| `/pmp-exam-2026` (+ cluster) | Home > PMP > {page h1} |

PMP cert page schema label matches visible crumb: **"PMP 2026 Readiness Pathway"**.

---

## Internal linking

| Source | Target | Rule |
| ------ | ------ | ---- |
| Topic hub `pmp-exam-2026` CTA | `/certifications/pmp` | Commercial intent |
| Topic hub resources | `/pmp-exam-2026`, answers, cluster pages | Supporting depth |
| Phase-2 SEO (`phase-2-page-seo.ts`) | `/certifications/pmp` on FAQ, compare, cert pages | Verified in T-022 map |
| Footer Resources | Both `/certifications/pmp` and `/pmp-exam-2026` | Primary + deep guide |

---

## Sitemap and canonical

- Sitemap: `frontend/app/sitemap.ts` — includes hub, certs, answers, topics, PMP cluster, legal
- Canonical: `buildPageMetadata()` + `PMS_SITE_URL` apex HTTPS
- Private routes: `indexing-metadata.ts` → `noindex,nofollow`
- **No public exposure** of `docs/internal/`

---

## Planned routes — do not publish yet

These appear in the CSV as `Planned - do not publish yet`. Do **not** add to sitemap, nav, or internal links until content exists:

- `/answers/pmp-training-hours-vs-pdus`
- `/answers/should-i-take-pmp-before-july-2026` (similar: `/answers/should-i-take-pmp-before-8-july-2026`)
- `/corporate/pmp-2026-readiness`
- `/compare/pmp-vs-*` geo-specific cert landing pages

---

## Validation

```bash
npm run seo:architecture-check
npm run seo:sitemap-check
npm run seo:canonical-check
npm run seo:internal-links-check
npm run build -w @pms/frontend
```

---

## Implementation reference (T-032)

| Item | Location |
| ---- | -------- |
| Breadcrumbs UI | `frontend/components/navigation/Breadcrumbs.tsx` |
| Schema helper | `frontend/components/navigation/breadcrumb-schema.ts` |
| Route/breadcrumb config | `frontend/content/site-architecture/routes.ts` |
| Architecture audit script | `scripts/seo/architecture-check.mjs` |
| Route matrix CSV | `docs/internal/pmstructure-site-architecture.csv` |

---

## Cannibalization mitigation

Nav and topic-hub CTAs send **primary PMP traffic** to `/certifications/pmp`. The `/pmp-exam-2026` cluster remains indexable and linked from footer Resources, topic resources, and phase-2 related guides — it supports rather than replaces the commercial page.
