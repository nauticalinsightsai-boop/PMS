# PM Structure — Indexation Strategy (T-038)

## Purpose

This document defines **governance-level indexation decisions** for every PM Structure route type: whether a URL should be indexed, followed, included in the sitemap, canonicalized, redirected, merged, or flagged for owner review.

This is an internal technical SEO document. Do not publish it as a public page.

**Related docs:**

- [`PMSTRUCTURE_INDEXING_MATRIX.md`](../PMSTRUCTURE_INDEXING_MATRIX.md) — implementation matrix (T-003 era)
- [`pmstructure-indexation-strategy.csv`](pmstructure-indexation-strategy.csv) — full route inventory with decision columns (T-038)
- [`PMSTRUCTURE_INDEXABILITY_SANDBOX_CHECK.md`](PMSTRUCTURE_INDEXABILITY_SANDBOX_CHECK.md) — T-025 live indexability checks
- [`PMSTRUCTURE_SITE_ARCHITECTURE.md`](PMSTRUCTURE_SITE_ARCHITECTURE.md) — T-032 PMP pillar architecture
- [`PMSTRUCTURE_302_REDIRECT_AUDIT.md`](PMSTRUCTURE_302_REDIRECT_AUDIT.md) — T-037 redirect implementation
- [`pmstructure-indexability-matrix.csv`](pmstructure-indexability-matrix.csv) — T-025 live audit export (complement, not replace)

---

## Preferred production host

```txt
https://pmstructure.com
```

---

## Runtime source of truth vs governance

| Layer | Location | Role |
| ----- | -------- | ---- |
| **Runtime index/noindex** | `frontend/lib/indexing-metadata.ts` | `isIndexablePath()`, `robotsForPath()` — used by metadata and sitemap guards |
| **Page metadata** | `frontend/lib/site-metadata.ts` | `buildPageMetadata()` applies robots + canonical per path |
| **Canonical URLs** | `frontend/lib/canonical.ts` | Strips `view`, `tab`, UTM, and region params |
| **Sitemap** | `frontend/app/sitemap.ts` + `frontend/lib/sitemap/helpers.ts` | `assertIndexable()` blocks noindex prefixes |
| **Robots.txt** | `frontend/app/robots.ts` | Disallow `/api/`, `/admin/` only; checkout uses meta noindex |
| **Governance matrix** | `frontend/content/indexation/strategy.ts` | Decision types, P0–P3 priorities, CSV export — **must mirror** `indexing-metadata.ts`, not replace it |

Do not wire sitemap or metadata to depend solely on `strategy.ts` until a single refactor is approved. Helpers in `strategy.ts` call `isIndexablePath()` to stay aligned.

Regenerate CSV after route inventory changes:

```bash
npm run seo:generate-indexation-strategy-csv
```

---

## Indexation decision types

| Decision | Meaning | Index | Sitemap |
| -------- | ------- | ----- | ------- |
| **index** | Public canonical page | Yes | Yes |
| **noindex** | Utility, checkout, admin, enroll | No | No |
| **redirect** | Legacy URL with permanent target (T-037) | No | No |
| **merge** | Combine into another URL (owner approval only) | No | No |
| **canonicalize** | Parameter variant resolves to clean URL | Yes (via canonical) | No separate entry |
| **needs_review** | Index decision pending owner/GSC data | Varies | Varies |

---

## PMP focus (T-032 pillar)

Three intentional layers — **do not merge or canonicalize across them**:

| URL | Role | Decision |
| --- | ---- | -------- |
| `/certifications/pmp` | Primary PMP 2026 **commercial** conversion page | **Index** (P0) |
| `/pmp` | Supporting **hub** — authority + internal links | **Index** (P1) |
| `/pmp-exam-2026` + cluster | **Deep guides** — exam change narrative | **Index** (P1) |

Answers and topic hubs (e.g. `/answers/is-the-pmp-exam-changing-in-2026`, `/topics/pmp-exam-2026`) remain **distinct indexed pages** — not merged into `/certifications/pmp`.

---

## Priority matrix (P0–P3)

### P0 — Commercial funnel

```txt
/
/certifications
/certifications/pmp
/certifications/compare
/answers/is-the-pmp-exam-changing-in-2026
/topics/pmp-exam-2026
/faq
```

Plus all checkout/admin/utility surfaces → **noindex** (including `/checkout/store/success`).

### P1 — Secondary certs, answers, topics, PMP cluster

All published `/certifications/{id}`, `/answers/*`, `/topics/*`, PMP cluster/course/service paths.

### P2 — Community, membership, portals

```txt
/community
/membership
/pm-service
/newsletter
/go/*
```

Mark **needs_review** for content quality and `/go/*` crawl budget.

### P3 — Legal, about, blog

Legal slugs, regional privacy variants, secondary marketing pages.

### Utility — Never index

```txt
/admin/**
/api/**
/checkout/**
/membership/checkout/**
/certifications/{id}/{tier}/enroll*
```

Enrollment noindex is enforced via `NOINDEX_PATH_PATTERNS` in `indexing-metadata.ts`.

---

## Decision summary by page type

| Page type | Decision | Index | Sitemap | Notes |
| --------- | -------- | ----- | ------- | ----- |
| Homepage, cert hub, PMP commercial, priority answer/topic/FAQ, compare | **index** | Yes | Yes | P0 commercial funnel |
| Secondary certs, legal, blog/newsletter (published) | **index** | Yes | Yes | P1–P3 |
| PMP cluster + `/pmp` hub + courses/services | **index** | Yes | Yes | Supporting deep content; not merged |
| `/community`, `/membership`, `/pm-service` | **needs_review** | Yes | Yes | Owner content-quality review |
| `/go/[channel]` published | **needs_review** | Yes | Yes | Crawl budget review |
| Checkout, enroll, success/cancel, membership checkout | **noindex** | No | No | Meta robots; not robots.txt disallow |
| `/admin`, `/api` | **noindex** | No | No | robots.txt + layout |
| `/compare`, `/store` | **redirect** | No | No | Permanent → final URLs (T-037) |
| `/community?view=store` | **canonicalize** | Yes (via `/community`) | No separate entry | `view` stripped in canonical |
| Spec old URLs (`/pmp-certification`, `/payment`, `/thank-you`) | **Not in repo** | — | — | Owner decision if GSC shows traffic |
| Spec planned answers/corporate pages | **Not in repo** | — | — | Do not publish without approval |

---

## Sitemap rules

1. Only paths where `isIndexablePath()` returns true may appear in `sitemap.ts`.
2. `buildSitemapEntry()` calls `assertIndexable()` — throws if a noindex prefix slips in at build time.
3. Redirect sources (`/compare`, `/store`) and checkout/admin paths are excluded.
4. Parameter URLs (e.g. `/community?view=store`) are not separate sitemap entries.

---

## Canonical rules

1. Every indexable page sets canonical via `buildPageMetadata()` → `PMS_SITE_URL` + path.
2. Query params stripped: `view`, `tab`, UTM tags, regional overrides (see `STRIPPED_QUERY_PARAM_KEYS` in `canonical.ts`).
3. `/community?view=store` canonicalizes to `https://pmstructure.com/community`.
4. Do not point answer/topic canonicals at `/certifications/pmp`.

---

## Robots rules

1. **No global noindex** on the root layout — indexation is per-path.
2. `robotsForPath(path)` returns `index,follow` or `noindex,nofollow` from prefix/pattern lists.
3. `robots.txt` disallows `/api/` and `/admin/` only; checkout relies on meta noindex (correct pattern).
4. Thank-you/success pages must export explicit noindex metadata in route layouts.

### T-038 code fix

`/checkout/store/success` previously had no metadata export (client-only page). Fixed with `frontend/app/(site)/checkout/store/success/layout.tsx` matching other checkout success layouts.

---

## Redirects (T-037 — document only here)

Permanent redirect **implementation** lives in T-037. This strategy documents redirect **decisions** in the CSV `Redirect_Target` column only.

Examples:

| Source | Target | Status |
| ------ | ------ | ------ |
| `/compare` | `/certifications/compare` | Permanent |
| `/store` | `/community?view=store` | Permanent (canonical strips `view`) |
| `/go` | `/go/website` | Permanent |

Do not add new redirect rules from T-038 without owner approval.

---

## Merge policy

**No merges approved in T-038.** The CSV `Merge_Target` column is reserved for future owner-approved consolidations. Specifically:

- Do **not** merge `/pmp` into `/certifications/pmp`
- Do **not** canonicalize unique answer/topic pages to commercial PMP

---

## GSC / owner data required (post-deploy)

The CSV `Current_Status` column is **Unknown** until real Search Console data is imported. Do not invent index statuses.

1. Export GSC **Pages** report (indexed + excluded).
2. Run URL Inspection on 5 P0 URLs (homepage, `/certifications/pmp`, priority answer, topic hub, `/faq`).
3. Import real statuses into `pmstructure-indexation-strategy.csv`.
4. Review `/go/*` crawl budget and secondary cert thin-content.
5. Approve any future **merge** or **redirect** for legacy SEO URLs with traffic.

Manual notes only (no machine export in repo): [`docs/reports/RUN19_GSC_REPORT.md`](../reports/RUN19_GSC_REPORT.md).

---

## Audit commands

```bash
npm run seo:audit-indexation-strategy
npm run seo:audit-indexation-strategy -- --base=https://pmstructure.com
npm run seo:audit-indexability -- --base=https://pmstructure.com
npm run seo:sitemap-check
npm run seo:canonical-check
npm run seo:noindex-check
npm run build -w @pms/frontend
```

Post-deploy manual checks:

```bash
curl -I https://pmstructure.com/certifications/pmp
curl -L https://pmstructure.com/certifications/pmp | grep -i noindex   # expect none
curl -L https://pmstructure.com/checkout/store/success | grep -i noindex   # expect present
curl https://pmstructure.com/sitemap.xml   # no checkout/admin/compare/store
```

---

## Files to leave alone

- Do not remove noindex from checkout/enroll/admin
- Do not index `/docs/internal`
- Do not merge `/pmp` into `/certifications/pmp`
- Do not canonicalize unique answer/topic pages to commercial PMP
- Do not add unapproved old URL redirects
