# PM Structure — Google Search Console Checklist

## Purpose

This document records Search Console verification, sitemap submission, sitemap error review, and manual-actions checks for PM Structure.

This is an internal SEO operations document. Do not publish it as a public page.

**Related docs:**

- [`docs/PMSTRUCTURE_GOOGLE_SEARCH_CONSOLE_CHECKLIST.md`](../PMSTRUCTURE_GOOGLE_SEARCH_CONSOLE_CHECKLIST.md) — root-level checklist with smoke-test evidence
- [`PMSTRUCTURE_SEARCH_CONSOLE_SUBMISSION.md`](PMSTRUCTURE_SEARCH_CONSOLE_SUBMISSION.md) — T-016 submission log
- [`PMSTRUCTURE_CRAWL_INDEXATION_CONTROL.md`](PMSTRUCTURE_CRAWL_INDEXATION_CONTROL.md) — B04 crawl governance
- [`pmstructure-indexation-control-matrix.csv`](pmstructure-indexation-control-matrix.csv) — import GSC Pages statuses here

---

## Preferred Property

Preferred:

```txt
Domain property: pmstructure.com
```

Also useful:

```txt
URL-prefix property: https://pmstructure.com
```

---

## Sitemap URL

```txt
https://pmstructure.com/sitemap.xml
```

In GSC Sitemaps report, submit only: `sitemap.xml`

---

## Manual Steps

1. Open [Google Search Console](https://search.google.com/search-console).
2. Verify the pmstructure.com property (HTML file `google5780310dc725cd18.html` exists in repo — confirm with owner).
3. Submit `sitemap.xml`.
4. Confirm sitemap status is **Success** (or monitor Discovered URLs growth).
5. Check sitemap errors.
6. Open **Security & Manual Actions** → **Manual Actions**.
7. Confirm Manual Actions status (screenshot/log required).
8. Inspect priority URLs:
   - https://pmstructure.com/
   - https://pmstructure.com/certifications/pmp
   - https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026
   - https://pmstructure.com/topics/pmp-exam-2026
   - https://pmstructure.com/faq
9. Export **Pages** report (indexed + excluded).
10. Add real statuses to `pmstructure-indexation-control-matrix.csv` `Current_Status` column.

**Never request indexing** for checkout, payment, success, cancel, login, dashboard, or admin URLs.

---

## Do Not Claim Without Evidence

Do not claim:

- sitemap submitted and fully processed,
- no sitemap errors,
- no manual penalties,
- pages indexed,

unless Search Console confirms it.

---

## Status Log

| Date | Item | Status | Evidence | Owner |
|------|------|--------|----------|-------|
| 2026-06-18 | GSC property verified | Pending owner confirmation | HTML verification file in repo | Sheikh / Mahaa |
| 2026-06-18 | Sitemap submitted | Pending owner confirmation | T-016 log; GSC status Pending (~15 discovered vs ~187 URLs) | Sheikh / Mahaa |
| 2026-06-18 | Sitemap errors checked | Pending owner confirmation | Requires GSC UI after deploy | Sheikh / Mahaa |
| 2026-06-18 | Manual Actions checked | Pending owner confirmation | Requires GSC Security & Manual Actions | Sheikh / Mahaa |
| 2026-06-18 | Priority URL inspections | Pending owner confirmation | See manual steps above | Sheikh / Mahaa |
| 2026-06-18 | Pages report exported to CSV | Pending owner confirmation | Import into control matrix | Sheikh / Mahaa |

---

## Remaining Owner Actions

1. Re-check sitemap until **Success**; investigate discovered URL gap
2. URL Inspection on 5 P0 URLs
3. Manual Actions review with screenshot
4. Export Pages report → update matrix CSV
5. Review `/go/*` crawl budget and needs_review content pages
6. Bing Webmaster Tools: import from GSC if not already done

---

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026
