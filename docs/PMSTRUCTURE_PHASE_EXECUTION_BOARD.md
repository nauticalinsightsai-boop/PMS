# PM Structure — Phase Execution Board

**Last updated:** 2026-06-10 — **FINAL — all runs 0–20 complete; human sign-off closed**

| Run | Phase | Name | Status |
|-----|-------|------|--------|
| 0–5 | 1–4 | Docs, crawl, index, sitemap, canonical | 🟢 |
| 6 | 5 | Headings + `seo:headings-check` | 🟢 |
| 7 | 6 | AI files + `lib/ai-files/` + generated `llms.txt` | 🟢 |
| 8 | 7 | Schema (Org, WebPage, Article, Service, Collection) | 🟢 |
| 9–16 | 8–15 | PMP, FAQ, answers, topics, legal, validation | 🟢 |
| 17 | 16 | Validation scripts (17 `seo:*` checks + render-check) | 🟢 |
| 18 | 17 | Deployment + production smoke | 🟢 |
| 19 | 18 | GSC verify + sitemap submit | 🟢 |
| 20 | 19 | AI testing sheet + baseline schedule | 🟢 |
| — | Sign-off | `preflight-07-foundation-signoff` | 🟢 |

## Commands

```bash
npm run seo:release-verify
npm run seo:smoke-live
npm run seo:smoke-urls
npm run seo:indexnow          # optional, after INDEXNOW_KEY set
node scripts/seo/mark-plan-todos.mjs   # sync Cursor plan YAML
```

## Operator follow-up

- Bing Webmaster import
- Rich Results Test (see `RUN8_SCHEMA_REPORT.md`)
- AI baseline ~2026-06-17
- Optional IndexNow after key configured
