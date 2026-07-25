# PM Structure — Crawl, Sitemap, and Indexation Control

## Purpose

This document defines crawl, sitemap, robots, noindex, and Search Console rules for PM Structure.

This is an internal SEO and technical governance document. Do not publish it as a public page.

**Related docs:**

- [`PMSTRUCTURE_INDEXATION_STRATEGY.md`](PMSTRUCTURE_INDEXATION_STRATEGY.md) — T-038 decision matrix
- [`PMSTRUCTURE_INDEXING_MATRIX.md`](../PMSTRUCTURE_INDEXING_MATRIX.md) — implementation matrix (T-003)
- [`PMSTRUCTURE_SITEMAP_NOTES.md`](PMSTRUCTURE_SITEMAP_NOTES.md) — T-015 XML sitemap
- [`PMSTRUCTURE_ROBOTS_SITEMAP_CHECK.md`](PMSTRUCTURE_ROBOTS_SITEMAP_CHECK.md) — T-017 robots + sitemap line
- [`PMSTRUCTURE_INDEXABILITY_SANDBOX_CHECK.md`](PMSTRUCTURE_INDEXABILITY_SANDBOX_CHECK.md) — T-025 live checks
- [`PMSTRUCTURE_302_REDIRECT_AUDIT.md`](PMSTRUCTURE_302_REDIRECT_AUDIT.md) — T-037 redirects
- [`PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md`](PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md) — B04 GSC ops
- [`pmstructure-indexation-control-matrix.csv`](pmstructure-indexation-control-matrix.csv) — B04 route matrix

---

## Preferred Host

```txt
https://pmstructure.com
```

Do not use `www`, `http`, localhost, staging, or preview hosts in canonicals or sitemaps.

---

## Public Pages That Should Usually Be Indexed

- /
- /certifications
- /certifications/pmp
- /certifications/compare
- /answers/is-the-pmp-exam-changing-in-2026
- /topics/pmp-exam-2026
- /faq
- /community
- /membership
- /newsletter
- /pm-service
- /legal/terms
- /legal/privacy
- /sitemap (HTML sitemap hub)

Only index these if the routes exist, return 200, are useful, and are not placeholders.

---

## Pages That Should Usually Be Noindexed or Protected

- /admin and /admin/*
- /dashboard (redirects to /admin)
- /login (redirects to /admin)
- /checkout and /checkout/*
- /membership/checkout and /membership/checkout/*
- /certifications/{id}/{tier}/enroll*
- /api and /api/*
- Spec-only paths not in repo: /account, /payment, /thank-you, /thanks, /success, /cancel
- /internal, /docs/internal (not public app routes)
- /search (no search route in repo)
- preview, draft, tokenized invitation pages

---

## WordPress-Specific Review

**N/A — PM Structure is Next.js, not WordPress.**

| Task | Status |
|------|--------|
| T-041 Date archives | N/A — no `/date/*` or year archive routes |
| T-042 Author archives | N/A — no `/author/*` routes |
| T-043 Post tags | N/A — no `/tag/*` routes |
| T-045 WP directories | N/A — no `/wp-admin/`, `/wp-content/`, `/wp-json/` |
| T-047 Media attachments | N/A — no attachment pages; `/_next/static/` assets must stay crawlable |
| T-048 Category pages | N/A — no `/category/*` routes |
| T-046 Account pages | N/A — no `/account` route; admin is protected |
| T-040 PDFs | N/A today — zero public PDFs in `frontend/public/` |

If public PDFs are added later, apply `X-Robots-Tag: noindex, nofollow` on non-ranking downloads per owner decision. Do not break legitimate downloads.

---

## Robots.txt Rule

Runtime: [`frontend/app/robots.ts`](../../frontend/app/robots.ts)

Baseline:

```txt
User-agent: *
Allow: /

Disallow: /api/
Disallow: /admin/

Sitemap: https://pmstructure.com/sitemap.xml
```

Do not use `Disallow: /` for the whole site.

Do not block checkout with robots.txt — use meta `noindex,nofollow` instead.

Do not block public assets: `/_next/static/`, `/_next/image/`, fonts, CSS, JS, images.

---

## XML Sitemap Rule

Runtime: [`frontend/app/sitemap.ts`](../../frontend/app/sitemap.ts) + [`frontend/lib/sitemap/helpers.ts`](../../frontend/lib/sitemap/helpers.ts)

The XML sitemap should include only public, canonical, indexable URLs at `https://pmstructure.com`.

Exclude:

- noindex pages (checkout, admin, enroll, compare, store)
- private pages
- internal docs
- redirected URLs
- parameter URLs
- 404 URLs

Regenerate control matrix: `npm run seo:generate-indexation-control-matrix-csv`

---

## HTML Sitemap Rule

Public route: `/sitemap` — curated indexable pages only.

Do not expose internal/private URLs, checkout, `/go/*` portals, or long-tail blog/newsletter posts.

Footer link: **Sitemap → /sitemap** (legal/utility area only).

Do not link the XML sitemap URL from the public footer.

---

## Search Console Rule

Google Search Console requires owner access. See [`PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md`](PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md).

Do not claim sitemap Success, zero errors, or no manual penalties without GSC evidence.

Verification file in repo: `frontend/public/google5780310dc725cd18.html` (owner-confirmed).

---

## Priority URLs to Inspect

- https://pmstructure.com/
- https://pmstructure.com/certifications/pmp
- https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026
- https://pmstructure.com/topics/pmp-exam-2026
- https://pmstructure.com/faq

---

## Owner Actions (post-deploy)

1. Re-check GSC sitemap status until **Success**; expect discovered count ~140 after `/go/*` removal (was ~184)
2. URL Inspection on 5 P0 URLs above; export Pages report into `pmstructure-indexation-control-matrix.csv`
3. Manual Actions check in GSC → Security & Manual Actions → log evidence in checklist
4. ~~Review `/go/*` crawl budget (R05 in risk register)~~ **Closed 2026-06-20:** `/go/*` = noindex, omitted from XML sitemap (lead-gen via direct links only)
5. Review pages marked **needs_review** in indexation matrix (community, membership, pm-service, secondary certs)
6. If public PDFs added: apply X-Robots-Tag policy per section above

---

## `/go/*` Portal Indexation (R05 closed)

**Decision (2026-06-20):** Channel portals under `/go/*` are **noindex, nofollow** and **excluded from sitemap.xml**.

- Implementation: `frontend/app/go/[channel]/page.tsx` robots meta, `frontend/app/sitemap.ts` (no portal entries), `frontend/content/indexation/strategy.ts`
- Robots.txt does **not** disallow `/go/` — Google should crawl once, see noindex, and drop from index
- Portals remain reachable via social and direct links for lead-gen

---

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 20 June 2026
