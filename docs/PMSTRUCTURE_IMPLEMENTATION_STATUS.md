# PM Structure SEO/AEO — Implementation Status

**As of:** 2026-06-10  
**Plan:** `seo_aeo_master_docs_37e5bd87` (Cursor plan — do not edit plan YAML; use this doc + `seo:all` as truth)

## Shipped in codebase

| Area | Delivered |
|------|-----------|
| Crawlability / SSR | RegionGate fix; SectionAmbience SSR pattern; `section-ambience-check` |
| Index / canonical | `indexing-metadata.ts`, sitemap filters, canonical helper |
| PMP cluster | 21 routes + hub |
| FAQ | 75 PMP 2026 FAQs |
| Answer pages | 23 `/answers/*` |
| Topic hubs | 17 `/topics/*` |
| Course pathways | 8 dedicated routes |
| Schema | Org, WebSite, WebPage, Article, FAQPage, Course, Service, Collection |
| AI files | 14 files + `lib/ai-files/` builders |
| Validation | 17 `seo:*` checks + render-check (8 routes) |
| Release | `seo:release-verify`, CI workflow, `seo:smoke-live` |
| Internal linking | Footer + homepage → `/pmp-exam-2026`, `/answers`, `/topics` (guarded by `internal-links-check`) |

## Post-deploy (operator)

1. `npm run seo:release-verify` on release branch  
2. Deploy to `https://www.pmstructure.com`  
3. `npm run seo:smoke-live` — must pass before GSC submit  
4. GSC + Bing sitemap per `PMSTRUCTURE_GSC_BING_SUBMISSION_PLAN.md`  
5. Rich Results Test (FAQ, cert PMP, one answer)  
6. AI baseline per `PMSTRUCTURE_AI_ANSWER_TESTING_SHEET.md` (T+7d)

## Deferred (documented, not blocking)

- Sitemap index split (monolithic OK at current scale)  
- FAQ phase 2 (150) / phase 3 (300)  
- IndexNow for Bing (optional in GSC plan)  
- `/go/*` indexing priority tuning

## Sign-off

See `PMSTRUCTURE_FOUNDATION_SIGNOFF.md` for automated + human gates.
