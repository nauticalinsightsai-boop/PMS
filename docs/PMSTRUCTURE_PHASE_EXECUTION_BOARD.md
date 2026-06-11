# PM Structure. Phase Execution Board

**Last updated:** 2026-06-10: v2 Phases 10-19 implementation pass (PMP FAQ hub, answer pages, topic hubs, validation scripts, deployment docs)

| v2 Phase | Name | Status |
|----------|------|--------|
| 10 | PMP FAQ dominance (`/pmp-faq`) | 🟢 |
| 11 | Answer pages (30+ slugs) | 🟢 |
| 12 | Topic hubs (26) | 🟢 |
| 13 | Regional pricing SEO | 🟢 |
| 14 | Conversion tracking events | 🟢 |
| 15 | Footer legal links | 🟢 |
| 16 | Validation scripts + reports | 🟢 |
| 17 | Pre-deployment audit docs | 🟢 |
| 18 | GSC/Bing submission docs | 🟢 |
| 19 | AI testing docs + generators | 🟢 |

| Run | Phase | Name | Status |
|-----|-------|------|--------|
| 0-5 | 1-4 | Docs, crawl, index, sitemap, canonical | 🟢 |
| 6 | 5 | Headings + `seo:headings-check` | 🟢 |
| 7 | 6 | AI files + `lib/ai-files/` + generated `llms.txt` | 🟢 |
| 8 | 7 | Schema (Org, WebPage, Article, Service, Collection) | 🟢 |
| 9-16 | 8-15 | PMP, FAQ, answers, topics, legal, validation | 🟢 |
| 17 | 16 | Validation scripts (17 `seo:*` checks + render-check) | 🟢 |
| 18 | 17 | Deployment + production smoke | 🟢 |
| 19 | 18 | GSC verify + sitemap submit | 🟢 |
| 20 | 19 | AI testing sheet + baseline schedule | 🟢 |
|: | Sign-off | `preflight-07-foundation-signoff` | 🟢 |

## Commands

```bash
npm run seo:release-verify
npm run seo:smoke-live
npm run seo:smoke-urls
npm run seo:indexnow          # optional, after INDEXNOW_KEY set
npm run seo:mark-plan-todos            # sync phase_10_pmp_faq plan YAML
```

## Operator follow-up

- Bing Webmaster import
- Rich Results Test (see `RUN8_SCHEMA_REPORT.md`)
- AI baseline ~2026-06-17
- Optional IndexNow after key configured