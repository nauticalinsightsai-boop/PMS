# PM Structure — Owner SEO UI Checklist (5 minutes)

Internal only. Do not publish.

Complete these steps in your browser while logged into the accounts that own `pmstructure.com`.

**Technical prerequisites (already deployed):**

| Asset | URL | Status |
| ----- | --- | ------ |
| Robots + sitemap line | https://pmstructure.com/robots.txt | Live — `Sitemap: https://pmstructure.com/sitemap.xml` |
| XML sitemap | https://pmstructure.com/sitemap.xml | Live — HTTP 200 |
| Google verification | https://pmstructure.com/google5780310dc725cd18.html | Deployed |
| Bing verification | https://pmstructure.com/BingSiteAuth.xml | Deployed |

---

## 1. Bing Webmaster Tools (~2 min)

1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters) → **Sign In**.
2. **Add a site** → enter `https://pmstructure.com` (or import from Google Search Console if offered).
3. Choose **XML file** verification → **Verify** (file is already at site root; do not re-upload).
4. After verified → **Sitemaps** → **Submit sitemap** → enter:

   ```txt
   https://pmstructure.com/sitemap.xml
   ```

5. Confirm fetch success and URLs discovered within 48–72 hours.

---

## 2. Google Search Console — sitemap (~1 min)

1. Open [Google Search Console](https://search.google.com/search-console).
2. Select property **`pmstructure.com`** (domain) or **`https://pmstructure.com`** (URL prefix).
3. **Sitemaps** → if not submitted, enter `sitemap.xml` → **Submit**.
4. Confirm status = **Success** (not “Couldn’t fetch” or stuck Pending).
5. Note **Discovered URLs** count (reply to developer for submission log).

---

## 3. Google Search Console — URL Inspection (~2 min)

For each URL: **URL Inspection** → paste URL → confirm index allowed + apex canonical → **Request indexing**.

```txt
https://pmstructure.com/
https://pmstructure.com/certifications/pmp
https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026
https://pmstructure.com/topics/pmp-exam-2026
https://pmstructure.com/faq
```

Never request indexing for checkout, payment, success, cancel, login, dashboard, or admin URLs.

Extended list (15 URLs): run `npm run seo:prepare-submission-list` → `reports/seo/google-priority-urls.txt`.

---

## 4. Reply to developer (copy/paste template)

```txt
GSC sitemap status: Success / Pending / Error
GSC discovered URLs: [number]
Bing verified: Yes / No
Bing sitemap submitted: Yes / No
Bing URLs discovered: [number or pending]
```

Developer will update:

- `docs/internal/PMSTRUCTURE_SEARCH_CONSOLE_SUBMISSION.md` (T-016)
- `.cursor/plans/t-017_robots_sitemap.plan.md` (owner todos)

---

## Related internal docs

| Task | Doc |
| ---- | --- |
| T-015 Sitemap | `PMSTRUCTURE_SITEMAP_NOTES.md` |
| T-016 GSC/Bing submission | `PMSTRUCTURE_SEARCH_CONSOLE_SUBMISSION.md` |
| T-017 Robots sitemap line | `PMSTRUCTURE_ROBOTS_SITEMAP_CHECK.md` |

Owner: Sheikh M. Abdullah  
Last updated: 18 June 2026
