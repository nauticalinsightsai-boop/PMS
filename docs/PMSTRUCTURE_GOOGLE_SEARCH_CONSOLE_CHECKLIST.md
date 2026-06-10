# Google Search Console Checklist

**Property:** https://pmstructure.com  
**Status labels:** READY | MANUAL_REQUIRED | BLOCKED | COMPLETE | NOT_APPLICABLE

## 1. Property setup

- [ ] MANUAL_REQUIRED — Domain property `pmstructure.com` (DNS TXT recommended)
- [ ] MANUAL_REQUIRED — URL-prefix `https://pmstructure.com` optional
- [x] COMPLETE — HTML file verification exists (`google5780310dc725cd18.html`) — confirm with owner

## 2. Pre-submission

- [x] COMPLETE — `npm run seo:production-check` PASS (2026-06-10): `/`, `/sitemap.xml`, `/robots.txt`, `/pmp-faq`, `/faq`, `/llms.txt` all 200

## 3. Sitemap submission (owner manual)

1. Open [Google Search Console](https://search.google.com/search-console) → select property `pmstructure.com` or `https://pmstructure.com`.
2. Go to **Sitemaps** in the left menu.
3. In **Add a new sitemap**, enter only: `sitemap.xml` (not a full URL path to a file upload).
4. Click **Submit**. GSC resolves it to `https://pmstructure.com/sitemap.xml`.
5. After submit, confirm status moves from **Couldn't fetch** → **Success** (or **Discovered URLs** > 0 / **Indexed** growing over 7–14 days).
6. Re-submit after major v2 releases (PMP FAQ, answers, topics).

**v1 Run 19 status:** GSC property verified + sitemap submitted per owner — mark **MANUAL_REQUIRED** for v2 re-submit after this deploy.

## 4. Priority URL inspection

See [PMSTRUCTURE_PRIORITY_URL_INSPECTION_LIST.md](./PMSTRUCTURE_PRIORITY_URL_INSPECTION_LIST.md).

**Never request indexing** for checkout, payment, success, cancel, login, dashboard, or admin URLs.

## 5. Monitoring (30 days)

Track: indexed, discovered-not-indexed, crawled-not-indexed, duplicates, manual actions.
