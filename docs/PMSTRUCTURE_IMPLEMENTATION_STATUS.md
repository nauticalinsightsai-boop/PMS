# PM Structure SEO/AEO. Implementation Status

**As of:** 2026-06-10  
**Plan:** `phase_10_pmp_faq_ec05a6c5` (Phases 10-19 v2)  
**Program status:** **v2 implementation complete**: operator follow-up for deploy verification + AI baseline

## Shipped in codebase (v2)

| Area | Delivered |
|------|-----------|
| PMP FAQ hub | `/pmp-faq`: 89 PMP FAQs, 27 categories, FAQPage JSON-LD |
| Answer pages | 35 `/answers/*` with spec H2s, compliance cautions, `/pmp-faq` CTAs |
| Topic hubs | 26 `/topics/*` with grouped index, related FAQs, planned-hub noindex |
| PMP cluster | 22 routes (hub + cluster + pathways + services) |
| FAQ surface tags | 5-10 related FAQs per live PMP route |
| Conversion events | `view_*`, `click_enroll_*`, `consultation_book`, `region_select` |
| Validation | 25+ `seo:*` checks + `render-check` (11 routes) + `faq-surface-tags` |
| AI testing | 86-query test sheet generator (`seo:generate-ai-test-sheet`) |
| Docs | Deployment, GSC/Bing, AI testing, legal/compliance maps |

## Automated gates

| Command | Status |
|---------|--------|
| `npm run seo:release-verify` | PASS (274 pages) |
| `npm run seo:generate-ai-test-sheet` | PASS (86 queries) |
| `npm run seo:prepare-submission-list` | Ready |
| `npm run seo:production-check` | Run after v2 deploy |

## Operator follow-up (not blocking code)

| Step | Status |
|------|--------|
| Deploy v2 to `https://pmstructure.com` | Pending owner |
| `npm run seo:production-check` after deploy | MANUAL_REQUIRED |
| GSC sitemap re-submit after v2 | MANUAL_REQUIRED |
| Bing Webmaster import from GSC | MANUAL_REQUIRED |
| AI baseline per `PMSTRUCTURE_AI_ANSWER_TESTING_PLAYBOOK.md` | MANUAL_REQUIRED (~2026-06-17) |
| IndexNow send after `INDEXNOW_KEY` configured | Optional |

## Deferred (future)

- Sitemap index split when URL count > 500
- FAQ phase 2 expansion beyond 89 PMP entries
- Lawyer review of legal copy (`TODO_LEGAL_REVIEW` in compliance map)