# PM Structure — Search Console Sitemap Submission

## Purpose

This document records the sitemap submission process for PM Structure.

This is an internal technical SEO document. Do not publish it as a public page.

---

## Preferred Property

Use one of the following in Google Search Console:

### Preferred

```txt
Domain property: pmstructure.com
```

### Acceptable

```txt
URL-prefix property: https://pmstructure.com
```

The sitemap should be submitted for the canonical preferred host:

```txt
https://pmstructure.com
```

---

## Sitemap URL

Submit:

```txt
https://pmstructure.com/sitemap.xml
```

If the property is already `https://pmstructure.com`, submitting only this relative value in the Sitemaps report is acceptable:

```txt
sitemap.xml
```

---

## Pre-Submission Checks

Before submitting, confirm:

1. `https://pmstructure.com/sitemap.xml` returns HTTP 200.
2. The sitemap uses `https://pmstructure.com` URLs only.
3. The sitemap does not include `www.pmstructure.com`.
4. The sitemap does not include `http://` URLs.
5. The sitemap does not include internal docs.
6. The sitemap does not include admin/dashboard/API routes.
7. The sitemap does not include checkout/payment/thank-you/success/cancel routes.
8. The sitemap does not include tokenized or query-parameter URLs.
9. The sitemap does not include noindex pages.
10. `https://pmstructure.com/robots.txt` includes:

```txt
Sitemap: https://pmstructure.com/sitemap.xml
```

### Automated repo checks (18 June 2026)

```bash
npm run seo:sitemap-check          # OK (26 literal paths)
npm run seo:robots-check           # OK
npm run seo:production-check       # OK (6 URLs)
npm run seo:prepare-submission-list # OK (15 priority URLs → reports/seo/)
npm run seo:smoke-live             # OK (10/10) — see docs/reports/SMOKE_LIVE_2026-06-18.md
```

### Production live verification (18 June 2026)

| Check | Result |
| ----- | ------ |
| `curl -I https://pmstructure.com/sitemap.xml` | HTTP 200, `Content-Type: application/xml` |
| Robots sitemap line | `Sitemap: https://pmstructure.com/sitemap.xml` |
| Priority URLs in sitemap | `/`, `/certifications/pmp`, `/answers/is-the-pmp-exam-changing-in-2026` — present |
| Forbidden hosts | No `localhost`, no `www.pmstructure.com` in `<loc>` entries |
| Forbidden paths | No `/admin/`, `/checkout/`, `?view=`, `invitation_token` in `<loc>` entries |

Note: XML namespace `http://www.sitemaps.org/schemas/sitemap/0.9` is expected; it is not a page URL.

---

## Manual Google Search Console Submission Steps

1. Open Google Search Console.
2. Select the `pmstructure.com` domain property, or the `https://pmstructure.com` URL-prefix property.
3. Go to **Sitemaps**.
4. Under **Add a new sitemap**, enter:

```txt
sitemap.xml
```

or the full URL:

```txt
https://pmstructure.com/sitemap.xml
```

5. Click **Submit**.
6. Confirm the sitemap status becomes **Success**.
7. If the status is not Success, open the error details and fix the sitemap or robots issue.
8. Re-submit after fixing errors.

---

## URLs to Inspect After Submission

After the sitemap is submitted, inspect these URLs in Google Search Console:

```txt
https://pmstructure.com/
https://pmstructure.com/certifications/pmp
https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026
https://pmstructure.com/topics/pmp-exam-2026
https://pmstructure.com/faq
```

For each URL, confirm:

1. URL is on Google or eligible for indexing.
2. User-declared canonical matches `https://pmstructure.com`.
3. Google-selected canonical is not the `www` version.
4. Page is not blocked by robots.txt.
5. Page is not marked noindex.
6. Page returns HTTP 200.
7. Page is mobile usable.
8. Page has no major indexing issue.

Use **Request indexing** only for the five URLs above (and other PMP/FAQ/answer priorities). Never request indexing for checkout, payment, success, cancel, login, dashboard, or admin URLs.

### Extended priority list (15 URLs)

Regenerate after route changes:

```bash
npm run seo:prepare-submission-list
```

Output: `reports/seo/google-priority-urls.txt` (same list for Bing: `bing-priority-urls.txt`).

---

## Manual Verification Commands

Run these after deployment:

```bash
curl -I https://pmstructure.com/sitemap.xml
```

Expected:

```txt
HTTP 200
Content-Type: application/xml or text/xml
```

Run:

```bash
curl https://pmstructure.com/sitemap.xml
```

Check that it includes:

```txt
https://pmstructure.com/
https://pmstructure.com/certifications/pmp
https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026
```

Check that it does not include:

```txt
www.pmstructure.com
http://
/docs/internal/
/internal/
/admin/
/dashboard/
/api/
/checkout/
/payment/
/thank-you/
/success/
/cancel/
?view=
invitation_token
```

Run:

```bash
curl https://pmstructure.com/robots.txt
```

Expected sitemap line:

```txt
Sitemap: https://pmstructure.com/sitemap.xml
```

---

## Search Console API Option

Only use API submission if Search Console API credentials and verified property access are available.

Google Search Console API sitemap submission requires authorized access and uses the Search Console API sitemap submit endpoint.

Required:

1. Verified Search Console property.
2. OAuth or service account access with permission.
3. `https://www.googleapis.com/auth/webmasters` scope.
4. Site URL matching the verified property.
5. Sitemap URL.

If credentials are not available, use manual submission.

---

## API Submission Status

| Item                             | Status                                   |
| -------------------------------- | ---------------------------------------- |
| Search Console property verified | Owner to confirm                         |
| API credentials available        | No — not in repo                         |
| API submission implemented       | Not implemented unless credentials exist |
| Manual submission required       | Yes unless API access is confirmed       |

---

## Bing Webmaster Tools Submission

Also submit the sitemap to Bing Webmaster Tools.

Steps:

1. Open Bing Webmaster Tools.
2. Select `pmstructure.com`.
3. Go to **Sitemaps**.
4. Submit:

```txt
https://pmstructure.com/sitemap.xml
```

5. Confirm fetch success.
6. Review discovered URLs.

---

## Submission Log

| Date       | Platform              | Property        | Sitemap URL                         | Submitted By              | Status                       | Notes                                                                                  |
| ---------- | --------------------- | --------------- | ----------------------------------- | ------------------------- | ---------------------------- | -------------------------------------------------------------------------------------- |
| 2026-06-18 | Google Search Console | pmstructure.com | https://pmstructure.com/sitemap.xml | Owner (reported manually) | Pending Success confirmation | Owner reported submit in GSC UI; confirm **Success** + Discovered URLs before Complete |
| 2026-06-18 | Bing Webmaster Tools  | pmstructure.com | https://pmstructure.com/sitemap.xml | Owner required            | Pending                      | Submit manually unless API access exists.                                              |

---

## Task Status (T-016)

```txt
Ready for manual submission — pre-checks passed; GSC submit reported by owner; awaiting Success confirmation in Search Console UI.
```

Cursor cannot submit to Google Search Console from this repo (no Search Console API credentials). Do not mark Complete until GSC Sitemaps report shows **Success**.

---

## Post-Submission Monitoring (30 days)

Track in Google Search Console:

- **Pages** → indexed vs not indexed (expect gradual growth; not all ~184 sitemap URLs will index)
- **Sitemaps** → Discovered URLs count after Success
- **Coverage / indexing** → excluded, crawled-not-indexed, duplicate canonical issues
- **FAQ** rich results on `/faq`
- **Crawl stats** for `/answers/*` and `/topics/*`
- Manual query checks: “PMP exam 2026”, “PMP readiness”

Re-submit sitemap after major PMP/FAQ/answer/topic releases.

---

## Owner Inputs Required

| Input                               | Required For              |
| ----------------------------------- | ------------------------- |
| Google Search Console access        | Manual sitemap submission |
| Verified `pmstructure.com` property | Sitemap submission        |
| Bing Webmaster Tools access         | Bing sitemap submission   |
| Confirmation of submission success  | Mark task complete        |
| Search Console indexing result      | Post-submission review    |
| Bing sitemap fetch result           | Post-submission review    |

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026

---

## Related Docs

| Doc | Purpose |
| --- | ------- |
| `PMSTRUCTURE_SITEMAP_NOTES.md` | Sitemap implementation (T-015) |
| `docs/PMSTRUCTURE_GOOGLE_SEARCH_CONSOLE_CHECKLIST.md` | Public GSC checklist |
| `docs/PMSTRUCTURE_GSC_BING_SUBMISSION_PLAN.md` | Public submission plan |
| `docs/PMSTRUCTURE_BING_WEBMASTER_CHECKLIST.md` | Bing checklist |

Verification file deployed: `frontend/public/google5780310dc725cd18.html`  
Bing verification file deployed: `frontend/public/BingSiteAuth.xml`
