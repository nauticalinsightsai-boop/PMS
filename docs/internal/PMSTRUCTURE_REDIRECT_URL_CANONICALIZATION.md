# PM Structure — Redirect and URL Canonicalization

## Purpose

This document defines PM Structure's redirect, canonical URL, 301, 302, 404, and 410 rules.

This is an internal technical SEO document. Do not publish it as a public page.

**Related docs:**

- [`PMSTRUCTURE_REDIRECT_DEPLOYMENT_NOTE.md`](PMSTRUCTURE_REDIRECT_DEPLOYMENT_NOTE.md) — T-009 canonical host deployment
- [`PMSTRUCTURE_302_REDIRECT_AUDIT.md`](PMSTRUCTURE_302_REDIRECT_AUDIT.md) — T-037 302 decision table
- [`PMSTRUCTURE_CRAWL_INDEXATION_CONTROL.md`](PMSTRUCTURE_CRAWL_INDEXATION_CONTROL.md) — B04 crawl/indexation (T-038/B04)
- [`PMSTRUCTURE_INDEXATION_STRATEGY.md`](PMSTRUCTURE_INDEXATION_STRATEGY.md) — T-038 indexation decisions
- [`PMSTRUCTURE_INDEXING_MATRIX.md`](../PMSTRUCTURE_INDEXING_MATRIX.md) — implementation matrix
- [`pmstructure-redirect-map.csv`](pmstructure-redirect-map.csv) — B05 redirect inventory
- [`pmstructure-302-audit.csv`](pmstructure-302-audit.csv) — B05 302 audit export
- [`pmstructure-410-review.csv`](pmstructure-410-review.csv) — B05 410 review (placeholders)

---

## Preferred Host

```txt
https://pmstructure.com
```

---

## Canonical Redirects

These should be permanent:

- `http://pmstructure.com/*` → `https://pmstructure.com/*`
- `http://www.pmstructure.com/*` → `https://pmstructure.com/*`
- `https://www.pmstructure.com/*` → `https://pmstructure.com/*`

**Implementation:**

- [`frontend/lib/canonical-host.ts`](../../frontend/lib/canonical-host.ts) — middleware **301** (path + query preserved)
- [`frontend/next.config.ts`](../../frontend/next.config.ts) — backup www → apex rule

Regenerate CSV inventories: `npm run seo:generate-redirect-csvs`

---

## Internal Link Rule

Use relative URLs for normal internal links:

- `/certifications/pmp`
- `/faq`
- `/community`
- `/legal/privacy`

Use absolute `https://pmstructure.com` URLs only for metadata, sitemap, schema, robots sitemap line, external sharing, and email templates.

Public nav/footer should link to **final URLs** (e.g. `/certifications/compare`, not `/compare`).

---

## 302 Rule

Not every 302 is bad.

Keep temporary redirects for:

- login/auth (`/admin` → `/admin/login`)
- checkout/payment/session (Stripe **302/303**)
- form success flows
- booking/scheduling
- A/B tests and campaigns
- preview/staging
- editable `/go` external CTAs (client navigation, not HTTP redirects)

Convert to permanent only for stable canonical or old-to-new SEO moves.

---

## `/go` Route Policy

- `/go` → `/go/website` is **permanent** (stable default entry)
- Legacy `/go/{slug}` aliases → canonical portal slugs are **permanent** (89 rules in `go-slug-redirects.ts`)
- `/go/{channel}` portal pages are **200 indexable pages** — do not mass-convert to HTTP redirects
- External booking CTAs on portal pages are **client navigation** — not HTTP redirects

---

## Checkout / Payment / Auth Policy

Do not convert to 301:

- `/checkout` — Stripe session redirects
- `/membership/checkout` — membership checkout flow
- `/admin` auth entry — temporary **307**
- Admin middleware CRM path cleanup — temporary **307**

Do not break Stripe, Circle, Skool, Calendly, or conversion tracking.

---

## 404 With Traffic Rule

404 URLs with clicks, impressions, backlinks, sessions, campaign traffic, or internal links should be mapped to the closest relevant live page with a **301** — **only when GSC/crawl data confirms the dead URL** and the owner approves **per row**.

Do not redirect everything to homepage.

**Critical:** `/pmp`, `/pmp-exam-2026`, and PMP cluster pages are **live indexed pages** (T-032). Do not redirect them unless a **separate legacy dead URL** is proven in GSC/crawl data.

---

## 404 With No Traffic Rule

404 URLs with no traffic, no backlinks, and no useful replacement may remain **404** or become **410** with owner approval.

Do not overuse 410. **404 is acceptable when unsure.**

Populate [`pmstructure-410-review.csv`](pmstructure-410-review.csv) after GSC export.

---

## WordPress 410 Rule (T-076)

**N/A — PM Structure is Next.js, not WordPress.**

WordPress 410 candidates apply only if WordPress-generated dead URLs appear in crawl data. Do not create WordPress-specific routes or plugins.

---

## Sitemap Rule

Sitemap should include only final canonical URLs at `https://pmstructure.com`.

Do not include:

- old redirected URLs (`/compare`, `/store`, etc. — noindex + excluded)
- 404 URLs
- 410 URLs
- noindex/private URLs
- checkout/payment/thank-you URLs
- internal docs

---

## In-repo redirect decision table

| Source | Target | Status | Keep temporary? |
|--------|--------|--------|-----------------|
| HTTP / non-apex host | `https://pmstructure.com/*` | 301 | No |
| www host | apex | 308 | No |
| `/compare` | `/certifications/compare` | 308 | No |
| `/store` | `/community?view=store` | 308 | No |
| `/go` | `/go/website` | 308 | No |
| `/go/{legacy}` | `/go/{canonical}` | 308 | No |
| `/privacy`, `/legalhub/*` | `/legal/*` | 308 | No |
| `/login`, `/dashboard` | `/admin/*` | 308 | No |
| `/admin` | `/admin/login` | 307 | **Yes** |
| Stripe checkout | dynamic session URL | 302/303 | **Yes** |

---

## Verification

For each redirect:

```bash
curl -IL https://pmstructure.com/source-path
npm run seo:audit-redirects
npm run seo:audit-redirects -- --base=https://pmstructure.com
```

Expected:

- one hop where possible
- 301/308 for permanent redirects
- 302/307 only where intentionally temporary
- final target returns 200
- no redirect loop
- no redirect to www

Canonical host tests:

```bash
curl -IL http://pmstructure.com/
curl -IL http://www.pmstructure.com/
curl -IL https://www.pmstructure.com/
curl -IL "https://www.pmstructure.com/certifications/pmp?source=test"
```

---

## Owner Actions (post-deploy)

1. Export GSC **Pages** + **Not found** reports; populate redirect-map and 410-review CSVs
2. Approve any new 301 mappings **per row** (never blanket PMP cluster redirects)
3. Verify Vercel domain alias: `www.pmstructure.com` → `pmstructure.com` (one-hop)
4. Re-run `npm run seo:audit-redirects -- --base=https://pmstructure.com`
5. Import Screaming Frog / crawl export into CSV `Current_Target` columns

---

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026
