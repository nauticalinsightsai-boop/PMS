# PM Structure — Sitemap Notes

## Purpose

This document records the intended XML sitemap strategy for PM Structure.

This is an internal technical SEO document. Do not publish it as a public page.

---

## Preferred Sitemap URL

```txt
https://pmstructure.com/sitemap.xml
```

---

## Preferred Host

```txt
https://pmstructure.com
```

---

## Implementation

| Item | Location |
| ---- | -------- |
| Sitemap generator | `frontend/app/sitemap.ts` |
| Entry helper + indexability guard | `frontend/lib/sitemap/helpers.ts` |
| Noindex path rules | `frontend/lib/indexing-metadata.ts` |
| Canonical host + URL | `frontend/config/pms-site.ts`, `frontend/lib/canonical.ts` |
| Robots + sitemap reference | `frontend/app/robots.ts` |
| Validation | `npm run seo:sitemap-check`, `npm run seo:robots-check` |

Dynamic sources: certifications (`siteData`), PMP cluster, answers, topics, legal registry, published blog/newsletter articles, published `/go/*` portals.

`lastModified` uses `new Date()` at generation time until content modules expose real `updatedAt` fields.

**Critical:** Production must never bake `http://localhost:3000` into sitemap or canonical URLs. Set all four `NEXT_PUBLIC_*` URL vars to `https://pmstructure.com` on the Railway **PMS** production service and redeploy. `frontend/config/pms-site.ts` falls back to apex in production if localhost is misconfigured.

---

## Sitemap Policy

The sitemap should include only canonical, public, indexable URLs.

It should not include:

* internal documents,
* private dashboards,
* admin routes,
* API routes,
* payment/checkout pages,
* success/cancel/thank-you pages,
* tokenized invitation links,
* duplicate query URLs,
* noindex pages,
* or placeholder/thin pages that are not intended to rank.

---

## Priority Pages

Priority public pages include:

1. Homepage.
2. PMP 2026 / PMP readiness page (`/certifications/pmp`, `/pmp-exam-2026`).
3. Certification hub.
4. Direct answer pages.
5. Topic hubs.
6. FAQ.
7. Public community/membership pages if intended to rank.
8. Legal trust pages.

Intentionally included (not checkout):

* `/pmp-enrollment` — indexable enrollment hub (checkout routes are noindex).
* Published `/go/{channel}` portal pages at lower priority.

---

## Search Console Submission

See **`PMSTRUCTURE_SEARCH_CONSOLE_SUBMISSION.md`** (T-016) for GSC + Bing submission steps, pre-checks, URL inspection list, and submission log.

---

## Manual Verification

Run:

```bash
curl -I https://pmstructure.com/sitemap.xml
```

Expected:

```txt
HTTP 200
Content-Type: application/xml or text/xml
```

Check:

1. URLs use `https://pmstructure.com`.
2. URLs are canonical.
3. Important PMP 2026 pages are included.
4. Internal docs are not included.
5. Payment/checkout/thank-you pages are not included.
6. No `www` URLs appear.
7. No query URLs appear unless intentionally canonical.

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026
