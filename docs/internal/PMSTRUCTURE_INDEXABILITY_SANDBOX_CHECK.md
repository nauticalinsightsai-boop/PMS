# PM Structure — Indexability / Sandbox Check

## Purpose

This document records how PM Structure verifies that production pages are not accidentally sandboxed, noindexed, blocked, or hidden from search engines.

This is an internal technical SEO document. Do not publish it as a public page.

**Related docs:** [`PMSTRUCTURE_INDEXING_MATRIX.md`](../PMSTRUCTURE_INDEXING_MATRIX.md) (repo root route matrix), [`PMSTRUCTURE_ROBOTS_SITEMAP_CHECK.md`](PMSTRUCTURE_ROBOTS_SITEMAP_CHECK.md) (T-017), [`pmstructure-indexability-matrix.csv`](pmstructure-indexability-matrix.csv) (T-025 export).

---

## Preferred Production Host

```txt
https://pmstructure.com
```

---

## Production Rule

Important public pages should be:

```txt
crawlable
indexable
followable
canonical to https://pmstructure.com
included in sitemap where appropriate
not blocked by robots.txt
not marked noindex
not protected by staging auth
not returning 403/404/500
```

---

## Implementation (code)

| Item | Location |
| ---- | -------- |
| Per-path robots | `frontend/lib/indexing-metadata.ts` → `robotsForPath()` |
| Page metadata | `frontend/lib/site-metadata.ts` → `buildPageMetadata()` |
| Global layout | `frontend/app/layout.tsx` — **no global noindex** |
| robots.txt | `frontend/app/robots.ts` |
| Sitemap | `frontend/app/sitemap.ts` + `frontend/lib/sitemap/helpers.ts` |
| Canonical host redirect | `frontend/middleware.ts` → 301 to apex |
| Site URL | `frontend/config/pms-site.ts` → `PMS_SITE_URL` |

---

## Priority Public Pages

```txt
/
/certifications
/certifications/pmp
/answers/is-the-pmp-exam-changing-in-2026
/topics/pmp-exam-2026
/faq
/certifications/compare
/community
/membership
/newsletter
/pm-service
/legal/terms
/legal/privacy
```

Expected robots: `index, follow` (explicit or via `robotsForPath`).

---

## Pages That Should Stay Noindex or Private

```txt
/admin/**
/api/**
/checkout/**
/membership/checkout/**
/certifications/*/enroll/**
/compare (legacy redirect)
/store (legacy redirect)
/go/[channel] when draft/preview
```

---

## Common Sandbox Mistakes

Check for:

```txt
<meta name="robots" content="noindex">
<meta name="robots" content="noindex,nofollow">
X-Robots-Tag: noindex
robots.txt with Disallow: /
canonical pointing to staging
canonical pointing to www
canonical pointing to localhost
basic auth on production
password protection on public pages
public pages missing from sitemap
environment variable disabling indexing in production
```

**Not found in repo (18 June 2026):** `NEXT_PUBLIC_NOINDEX`, `DISABLE_INDEXING`, global `X-Robots-Tag: noindex` in `next.config.ts` / middleware, or basic auth on the public host.

---

## Automated Verification

Repo checks:

```bash
npm run seo:noindex-check
npm run seo:robots-check
npm run seo:sitemap-check
npm run seo:canonical-check
npm run build -w @pms/frontend
npm run seo:render-check
```

Live audit (T-025):

```bash
npm run seo:audit-indexability
npm run seo:audit-indexability -- --base=https://pmstructure.com
```

---

## Manual Verification Commands

Run after deployment:

```bash
curl -I https://pmstructure.com/
curl -I https://pmstructure.com/certifications
curl -I https://pmstructure.com/certifications/pmp
curl -I https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026
curl -I https://pmstructure.com/topics/pmp-exam-2026
curl -I https://pmstructure.com/faq
curl -I https://pmstructure.com/robots.txt
curl -I https://pmstructure.com/sitemap.xml
```

Expected for existing public pages:

```txt
HTTP 200
No X-Robots-Tag: noindex
No redirect to www
No staging host
```

Check HTML robots meta:

```bash
curl -L https://pmstructure.com/certifications/pmp | grep -i "robots"
```

Expected:

```txt
No noindex on public pages
```

Check canonical:

```bash
curl -L https://pmstructure.com/certifications/pmp | grep -i "canonical"
```

Expected:

```txt
Canonical uses https://pmstructure.com/certifications/pmp
```

Check robots.txt:

```bash
curl https://pmstructure.com/robots.txt
```

Expected:

```txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://pmstructure.com/sitemap.xml
```

Check sitemap:

```bash
curl https://pmstructure.com/sitemap.xml
```

Expected:

```txt
Priority public pages included.
No checkout/admin/enroll pages included.
HTTP 200
```

---

## T-025 Agent Verification (18 June 2026)

| Check | Result |
| ----- | ------ |
| Live `/robots.txt` | OK — Allow `/`, Disallow `/api/` + `/admin/`, sitemap apex URL |
| Live `/sitemap.xml` | **HTTP 200** at verification time (Ask mode had observed HTTP 500; may have been transient). Sitemap hardened with graceful fallbacks in `frontend/app/sitemap.ts`. |
| Priority URLs in sitemap | Confirmed: `/`, `/certifications/pmp`, `/faq`, `/answers/is-the-pmp-exam-changing-in-2026`, etc. |
| Global sandbox / noindex | Not found in code or live headers |
| `/membership/checkout/success` | Missing explicit robots meta before T-025 — added `layout.tsx` with `noindex,nofollow` |

---

## Google Search Console Checks (owner)

After deployment, inspect:

```txt
https://pmstructure.com/
https://pmstructure.com/certifications/pmp
https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026
https://pmstructure.com/topics/pmp-exam-2026
https://pmstructure.com/faq
```

For each URL, confirm:

1. URL is indexable.
2. Page is not blocked by robots.txt.
3. Page is not marked noindex.
4. User-declared canonical is correct.
5. Google-selected canonical is not the www/staging version.
6. Page is in sitemap where appropriate.
7. Page returns HTTP 200.

**Owner action after sitemap fix:** Resubmit `https://pmstructure.com/sitemap.xml` in Google Search Console if prior 500 errors were logged.

---

## Owner Inputs Required

| Input | Required For |
| ----- | ------------ |
| Google Search Console access | URL Inspection on 5 priority URLs |
| Hosting / Railway env review | Confirm `NEXT_PUBLIC_SITE_URL=https://pmstructure.com`; no preview noindex vars on production |
| GSC sitemap resubmit | After confirming sitemap returns HTTP 200 consistently |
| Manual URL Inspection | 5 priority URLs listed above |
| Final public/private route list | Confirm matrix CSV matches product decisions |

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026
