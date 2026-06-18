# PM Structure — Robots Sitemap Check

## Purpose

This document records the robots.txt sitemap discovery check for PM Structure.

This is an internal technical SEO document. Do not publish it as a public page.

---

## Required Robots URL

```txt
https://pmstructure.com/robots.txt
```

---

## Required Sitemap Line

```txt
Sitemap: https://pmstructure.com/sitemap.xml
```

---

## Preferred Host

```txt
https://pmstructure.com
```

---

## Rule

Robots.txt must point crawlers to the canonical XML sitemap using the preferred HTTPS non-www host.

Do not use:

```txt
Sitemap: https://www.pmstructure.com/sitemap.xml
Sitemap: http://pmstructure.com/sitemap.xml
Sitemap: http://www.pmstructure.com/sitemap.xml
```

---

## Implementation

| Item | Location |
| ---- | -------- |
| Robots generator | `frontend/app/robots.ts` |
| Site URL (sitemap line host) | `frontend/config/pms-site.ts` → `PMS_SITE_URL` |
| Sitemap generator (T-015) | `frontend/app/sitemap.ts` |
| Repo validation | `npm run seo:robots-check` |
| Plan file | `.cursor/plans/t-017_robots_sitemap.plan.md` |

Dynamic robots output (production, verified 18 June 2026):

```txt
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://pmstructure.com/sitemap.xml
```

---

## Verification Commands

Run after deployment:

```bash
curl -I https://pmstructure.com/robots.txt
```

Expected:

```txt
HTTP 200
Content-Type: text/plain
```

Then run:

```bash
curl https://pmstructure.com/robots.txt
```

Expected line:

```txt
Sitemap: https://pmstructure.com/sitemap.xml
```

Then run:

```bash
curl -I https://pmstructure.com/sitemap.xml
```

Expected after T-015:

```txt
HTTP 200
Content-Type: application/xml or text/xml
```

Automated repo check:

```bash
npm run seo:robots-check
```

### AC-10 verification (18 June 2026)

| Check | Result |
| ----- | ------ |
| `npm run build -w @pms/frontend` | Pass (297 pages; `/robots.txt`, `/sitemap.xml` routes present) |
| `npm run lint` | Pre-existing frontend ESLint errors (unrelated to robots/sitemap); not introduced by T-017 |
| `npm run seo:smoke-live` | Pass (10/10) |

---

## Checklist

1. Robots.txt returns HTTP 200.
2. Robots.txt contains exactly one correct sitemap line unless multiple real sitemap files exist.
3. Sitemap URL uses `https://pmstructure.com`.
4. Sitemap URL does not use `www`.
5. Sitemap URL does not use `http`.
6. Robots.txt does not block `/sitemap.xml`.
7. Robots.txt does not block important public pages.
8. Sitemap exists and returns XML.
9. Sitemap URLs match the preferred canonical host.
10. Search Console can fetch the sitemap.

### T-017 verification (18 June 2026)

| # | Check | Status |
| - | ----- | ------ |
| 1 | Robots HTTP 200 | Pass |
| 2 | Single sitemap line | Pass |
| 3–5 | Apex HTTPS, no www/http in sitemap line | Pass |
| 6 | `/sitemap.xml` not disallowed | Pass |
| 7 | Public routes not blocked (`/`, `/certifications/`, `/answers/`, `/topics/`, `/faq`) | Pass |
| 8 | Sitemap returns XML | Pass |
| 9 | Sitemap `<loc>` uses apex host | Pass |
| 10 | GSC fetch | Owner — see T-016 submission log |

---

## Follow-Up

If robots.txt is correct but sitemap.xml is missing, complete:

```txt
T-015 — XML Sitemap Exists
```

If sitemap exists but is not submitted, complete:

```txt
T-016 — XML Sitemap Submitted to Search Console
```

**T-015 status:** Complete — `frontend/app/sitemap.ts` live at `https://pmstructure.com/sitemap.xml`.

**T-016 status:** GSC submit reported by owner; confirm Success in Search Console UI.

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026

---

## Related Docs

| Doc | Purpose |
| --- | ------- |
| `PMSTRUCTURE_SITEMAP_NOTES.md` | Sitemap policy (T-015) |
| `PMSTRUCTURE_SEARCH_CONSOLE_SUBMISSION.md` | GSC/Bing submission (T-016) |
