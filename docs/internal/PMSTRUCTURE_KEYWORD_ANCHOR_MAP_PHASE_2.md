# PM Structure — Keyword & Anchor Map (Phase Two)

## Purpose

This document is the internal Phase Two keyword and internal-anchor map for PM Structure.

It ensures priority public URLs have:

1. One primary keyword target (no cannibalization).
2. Supporting secondary keyword targets.
3. Clear search intent and funnel stage.
4. Unique SEO title and meta description.
5. Correct canonical URL (`https://pmstructure.com`, apex, no `www`).
6. H1 alignment with the primary keyword intent.
7. Descriptive internal-link anchor text (not generic “click here” / “read more” on priority surfaces).

**This is an internal document.** Do not publish it on the public site, link it from nav/footer, or copy it into `frontend/public/`.

**Code source of truth:** [`frontend/content/seo/phase-2-page-seo.ts`](../../frontend/content/seo/phase-2-page-seo.ts)  
**Owner-editable export:** [`pmstructure-keyword-anchor-map-phase-2.csv`](pmstructure-keyword-anchor-map-phase-2.csv)

---

## Strategic focus (Phase Two)

Primary commercial funnel:

```
PMP 2026 Readiness Pathway → /certifications/pmp
```

Supporting funnel pages:

| Role | URL |
|------|-----|
| Direct answer | `/answers/is-the-pmp-exam-changing-in-2026` |
| Topic hub | `/topics/pmp-exam-2026` |
| Deep guide (supporting) | `/pmp-exam-2026` cluster |
| Trust | `/faq` |
| Consideration | `/certifications`, `/certifications/compare` |

---

## Mapping rule (one primary keyword per page)

| Intent | Owner page |
|--------|------------|
| Commercial PMP readiness | `/certifications/pmp` |
| “Is the PMP exam changing?” | `/answers/is-the-pmp-exam-changing-in-2026` |
| PMP 2026 hub / guide intent | `/topics/pmp-exam-2026` |
| Compare certifications | `/certifications/compare` |
| Brand + pathways overview | `/` |
| PM Structure trust questions | `/faq` |

The `/pmp-exam-2026` cluster remains a **supporting deep guide**, not the primary commercial CTA target.

---

## Cannibalization rules

- Never assign the same `primaryKeyword` to two live priority pages.
- Commercial “PMP 2026 readiness” intent → `/certifications/pmp`.
- Direct question intent → answer page.
- Hub / guide intent → `/topics/pmp-exam-2026`.
- Enforced in `phase-2-page-seo.ts` and `npm run seo:keyword-map-check`.

---

## Priority keyword table (summary)

See CSV for full rows. Volume and difficulty are **not invented** — use `Needs keyword research` until owner fills from tools.

| Route | Primary keyword | Funnel |
|-------|-----------------|--------|
| `/` | project management certification pathways | Conversion |
| `/certifications` | project management certifications | Consideration |
| `/certifications/pmp` | PMP 2026 readiness pathway | Conversion |
| `/answers/is-the-pmp-exam-changing-in-2026` | is the PMP exam changing in 2026 | Awareness |
| `/topics/pmp-exam-2026` | PMP exam 2026 | Awareness + consideration |
| `/faq` | PM Structure FAQ | Trust |
| `/certifications/compare` | compare project management certifications | Consideration |
| Secondary certs | per cert (PMI-RMP, PRINCE2, LSS) | Waitlist / secondary |
| `/membership`, `/community`, `/newsletter` | support-layer keywords | Retention |
| `/pm-service` | project management advisory services | B2B |
| `/legal/terms`, `/legal/privacy` | trust / legal | Trust |

---

## Internal link map (priority)

| From | To | Anchor text |
|------|-----|-------------|
| `/` | `/certifications/pmp` | PMP 2026 Readiness Pathway |
| `/` | `/certifications/compare` | compare certification pathways |
| `/` | `/faq` | PM Structure FAQ |
| `/certifications` | `/certifications/pmp` | PMP 2026 Readiness Pathway |
| `/certifications` | `/certifications/compare` | compare project management certifications |
| `/certifications/pmp` | answer page | PMP exam change in 2026 |
| `/certifications/pmp` | `/topics/pmp-exam-2026` | PMP exam 2026 topic hub |
| `/certifications/pmp` | `/faq` | PMP eligibility and training-hour FAQ |
| `/certifications/pmp` | `/certifications/compare` | compare project management certifications |
| Answer page | `/certifications/pmp` | PMP 2026 Readiness Pathway |
| Answer page | `/topics/pmp-exam-2026` | PMP exam 2026 guide |
| Answer page | `/faq` | PM Structure FAQ |
| Topic hub | `/certifications/pmp` | PMP 2026 Readiness Pathway |
| Topic hub | answer page | is the PMP exam changing in 2026? |
| Topic hub | `/certifications/compare` | compare project management certifications |
| `/faq` | `/certifications/pmp` | PMP 2026 Readiness Pathway |
| `/certifications/compare` | cert pages | descriptive pathway anchors |
| `/membership` | `/certifications/pmp` | PMP 2026 Readiness Pathway |
| `/community` | `/certifications/pmp` | PMP 2026 preparation support |
| `/pm-service` | `/certifications/pmp` | PMP 2026 team readiness |

Implemented via `PHASE_2_RELATED_BLOCKS` + `RelatedGuidesLinks` component.

---

## Weak anchor inventory

| Location | Before | After (T-022) |
|----------|--------|----------------|
| `Home.tsx` blog cards | Read More | Read article: {title} |
| `PMService.tsx` service cards | Learn More | Book advisory call: {service title} |

Short CTAs (“Get My PMP 2026 Roadmap”, “Join Waitlist”) intentionally unchanged.

---

## Planned pages (defer — do not add to sitemap)

- Regional segment pages (`pmp-for-engineers`, GCC, South Asia)
- `/compare/pmp-vs-*` dedicated comparison routes
- Additional answer/topic bulk pass on full PMP cluster

---

## Owner inputs still required

- Regional keyword research export (UAE, KSA, Qatar, Pakistan, India, UK, global)
- Search volume, difficulty, CPC — CSV columns remain `Needs keyword research`
- Final pricing and waitlist/live status for secondary certifications
- Official community platform wording
- Verified testimonials and social-proof counts

---

## Validation

```bash
npm run seo:keyword-map-check
npm run seo:metadata-check
npm run seo:h1-check
npm run seo:canonical-check
npm run seo:internal-links-check
npm run build -w @pms/frontend
```

Manual QA: view-source on `/`, `/certifications/pmp`, answer page, topic hub, `/faq`, `/certifications/compare`, `/certifications`.

---

## Task Status (T-022)

```txt
Complete — repo-side implementation and automated SEO checks passed (18 June 2026).
```

| Check | Status |
| ----- | ------ |
| Internal MD + CSV | Pass |
| `phase-2-page-seo.ts` (17 priority URLs, unique primaryKeyword) | Pass |
| Priority metadata + internal links + weak-anchor fixes | Pass |
| `npm run seo:keyword-map-check` | Pass |
| `npm run seo:metadata-check`, `h1-check`, `canonical-check`, `internal-links-check` | Pass |
| `npm run build -w @pms/frontend` (297 pages) | Pass |
| Live view-source QA on 7 priority URLs | **Pending** — owner spot-check after deploy |

**Owner still required:** regional keyword research (CSV volume/difficulty), GSC sitemap Success + URL inspections, Bing URL discovery monitoring, pricing/waitlist/community/testimonial copy.
