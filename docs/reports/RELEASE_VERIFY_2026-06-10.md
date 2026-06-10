# Release verification — 2026-06-10

**Branch:** local release run (not pushed)  
**Canonical:** `https://pmstructure.com`  
**Build:** 274 static pages  

---

## Automated gates

| Step | Command | Result |
|------|---------|--------|
| Build + SEO | `npm run seo:release-verify` | **PASS** (exit 0) |
| Live smoke | `npm run seo:smoke-live` | **PASS** (10/10) |
| Production SEO | `npm run seo:production-check` | **PASS** (6 URLs) |
| Render check | included in `seo:postbuild` | **PASS** (11 routes) |
| Submission lists | `npm run seo:prepare-submission-list` | **PASS** (15 URLs → `reports/seo/`) |
| AI test sheet | `npm run seo:generate-ai-test-sheet` | **PASS** (86 rows → `reports/seo/ai-answer-test-queries.csv`) |

---

## Sitemap (pre-submit)

| URL | HTTP | Notes |
|-----|------|-------|
| `https://pmstructure.com/sitemap.xml` | 200 | `application/xml`, ~35 KB |
| `https://www.pmstructure.com/sitemap.xml` | 200 | Same asset on Vercel |

**GSC/Bing entry:** submit `sitemap.xml` in the property that matches your verified host (apex or `www` prefix). Docs canonicalize to apex; use the property you own in GSC.

---

## URL pre-inspection (HTTP readiness)

Per `PMSTRUCTURE_GSC_BING_SUBMISSION_PLAN.md` — live HEAD checks on **apex** before GSC “Request indexing”:

| URL | Status |
|-----|--------|
| `/` | 200 |
| `/pmp-exam-2026` | 200 |
| `/pmp` | 200 |
| `/certifications/pmp` | 200 |
| `/faq` | 200 |
| `/answers/is-the-pmp-exam-changing-in-2026` | 200 |
| `/answers/what-are-the-pmp-eligibility-requirements` | 200 |
| `/topics/pmp-exam-2026` | 200 |
| `/topics/exam-readiness` | 200 |
| `/pmp-foundation` | 200 |
| `/legal/pricing-disclaimers` | 200 |
| `/legal/regional-pricing` | 200 |
| `/blog` | 200 |
| `/newsletter` | 200 |
| `/pmp-faq` | 200 |

**GSC/Bing URL Inspection** (render + index status): **owner manual** — use URLs in `reports/seo/google-priority-urls.txt`.

---

## Owner actions (not automated)

### Google Search Console

1. Open property (`https://pmstructure.com` or `https://www.pmstructure.com` — match verification).
2. **Sitemaps** → add: `sitemap.xml` (full URL e.g. `https://www.pmstructure.com/sitemap.xml` if `www` property).
3. **URL inspection** → each row in `reports/seo/google-priority-urls.txt` → **Request indexing** for PMP/FAQ/answer priorities.

### Bing Webmaster Tools

1. Import from GSC or verify site.
2. Submit same `sitemap.xml`.
3. URL inspection for priority list (`reports/seo/bing-priority-urls.txt`).

### AI answer baseline

Per `PMSTRUCTURE_AI_ANSWER_TESTING_SHEET.md`:

- Sheet: `reports/seo/ai-answer-test-queries.csv` (86 queries, status `NOT TESTED`).
- Run queries 1–28 (× 9 platforms, or sample 28 × 5 if time-boxed).
- Log columns: Date, Platform, Query, Cited, URL, Accuracy, False ATP, False guarantee, Fix priority, Notes.
- **Pass criteria:** ≥40% cite on top 15 PMP 2026 queries; zero false ATP/guarantee attribution.

---

## Next step

Deploy this build to production if not already live, then complete GSC/Bing sitemap submit + URL inspections + AI baseline log in owner session.
