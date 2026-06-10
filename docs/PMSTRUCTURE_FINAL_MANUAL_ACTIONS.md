# PM Structure — Final Manual Actions

**Audit date:** 2026-06-10  
**Owner:** Site operator (not automated)  
**Rule:** Do not mark any external submission or AI test as complete until manually verified and logged.

---

## 1. Google Search Console

| # | Action | Reference doc | Status |
|---|--------|---------------|--------|
| 1.1 | Verify `https://pmstructure.com` property (DNS or HTML) | `PMSTRUCTURE_GOOGLE_SEARCH_CONSOLE_CHECKLIST.md` | **Owner pending** |
| 1.2 | Confirm apex canonical; `www` → apex 301 | GSC property settings | **Owner pending** |
| 1.3 | Submit `https://pmstructure.com/sitemap.xml` after v2 deploy | `PMSTRUCTURE_GSC_BING_SUBMISSION_PLAN.md` | **Owner pending** |
| 1.4 | URL-inspect priority list (22 PMP + FAQ + answers + topics) | `PMSTRUCTURE_PRIORITY_URL_INSPECTION_LIST.md` | **Owner pending** |
| 1.5 | Request indexing for `/pmp-faq`, `/pmp-exam-2026`, top answers | Priority list | **Owner pending** |
| 1.6 | Monitor Coverage → Excluded (noindex pages should stay excluded) | `PMSTRUCTURE_INDEXING_MONITORING_LOG.md` | **Ongoing** |
| 1.7 | Log indexed page count baseline post-deploy | Monitoring log | **Owner pending** |

---

## 2. Bing Webmaster Tools

| # | Action | Reference doc | Status |
|---|--------|---------------|--------|
| 2.1 | Import site from Google Search Console | `PMSTRUCTURE_BING_WEBMASTER_CHECKLIST.md` | **Owner pending** |
| 2.2 | Submit `sitemap.xml` | GSC/Bing submission plan | **Owner pending** |
| 2.3 | URL inspection for priority routes | Priority URL list | **Owner pending** |
| 2.4 | Optionally configure IndexNow key | `PMSTRUCTURE_INDEXNOW_PLAN.md` | **Optional** |
| 2.5 | Dry-run `npm run seo:indexnow` after key configured | IndexNow plan | **Optional** |

---

## 3. Legal

| # | Action | Reference doc | Status |
|---|--------|---------------|--------|
| 3.1 | Counsel review of `/legal/privacy` | `PMSTRUCTURE_LEGAL_COMPLIANCE_MAP.md` | **TODO_LEGAL_REVIEW** |
| 3.2 | Counsel review of `/legal/terms` | Legal compliance map | **TODO_LEGAL_REVIEW** |
| 3.3 | Business decision on refund windows (`/legal/refunds`) | Legal compliance map | **TODO_BUSINESS_DECISION** |
| 3.4 | Review payment terms linkage on enroll/checkout | Conversion flow map | **Owner pending** |
| 3.5 | Confirm independent-platform disclaimer on live pages | Compliance map | **Owner pending** |
| 3.6 | Confirm no-guarantee disclaimer visible where needed | `PMSTRUCTURE_AI_FALSE_CLAIM_RISK_LOG.md` | **Owner pending** |
| 3.7 | Trademark disclaimer (PMI, PRINCE2, etc.) | Legal pages | **Owner pending** |

---

## 4. Payment

| # | Action | Validation | Status |
|---|--------|------------|--------|
| 4.1 | Test enroll flow: `/certifications/pmp/.../enroll` | Live smoke | **NOT TESTED** |
| 4.2 | Test checkout redirect and payment completion | Live smoke | **NOT TESTED** |
| 4.3 | Confirm `/checkout/success` and `/checkout/cancel` are noindex | `seo:noindex-check` (local PASS) | **Re-verify live** |
| 4.4 | Confirm enroll success page noindex | `seo:noindex-check` (local PASS) | **Re-verify live** |
| 4.5 | Confirm no payment/session IDs in sitemap or AI files | `seo:ai-files-check` (local PASS) | **Re-verify live** |

---

## 5. Forms

| # | Action | Validation | Status |
|---|--------|------------|--------|
| 5.1 | Test PMP readiness diagnostic form submission | Manual | **NOT TESTED** |
| 5.2 | Test contact form (`/contact`) | Manual | **NOT TESTED** |
| 5.3 | Confirm privacy policy link on all forms | `seo:legal-compliance-check` (local PASS) | **Re-verify live** |
| 5.4 | Confirm no PII sent to analytics events | Conversion event map | **Owner review** |
| 5.5 | Test Calendly/booking links from pathway modals | Manual | **NOT TESTED** |

---

## 6. AI Testing

| # | Action | Reference doc | Status |
|---|--------|---------------|--------|
| 6.1 | Generate test sheet: `npm run seo:generate-ai-test-sheet` | `reports/seo/ai-answer-test-queries.csv` | **Generated — 86 queries** |
| 6.2 | Run branded/entity queries (ChatGPT, Perplexity, Gemini, Copilot) | `PMSTRUCTURE_AI_ANSWER_TESTING_PLAYBOOK.md` | **NOT TESTED** |
| 6.3 | Run PMP 2026 transition queries | `PMSTRUCTURE_AI_VISIBILITY_TEST_QUERIES.md` | **NOT TESTED** |
| 6.4 | Run compliance-risk queries (ATP, guarantee, affiliation) | False claim risk log | **NOT TESTED** |
| 6.5 | Run private URL leakage queries (checkout, admin, dashboard) | Private URL leakage monitor | **NOT TESTED** |
| 6.6 | Log results in `PMSTRUCTURE_AI_ANSWER_TESTING_SHEET.md` | Testing sheet | **NOT TESTED** |
| 6.7 | Log citations in `PMSTRUCTURE_AI_CITATION_MONITORING_LOG.md` | Citation log | **NOT TESTED** |
| 6.8 | File fixes in `PMSTRUCTURE_AI_ANSWER_FIX_BACKLOG.md` if needed | Fix backlog | **Empty pending** |

**Platforms to test (per matrix):** ChatGPT, Perplexity, Google AI Overviews, Bing Copilot, Gemini, Claude (optional).

---

## 7. Monitoring (post-deploy)

| # | Monitor | Frequency | Log file |
|---|---------|-----------|----------|
| 7.1 | GSC indexed pages vs sitemap count | Weekly | `PMSTRUCTURE_INDEXING_MONITORING_LOG.md` |
| 7.2 | Bing indexed pages | Weekly | Indexing monitoring log |
| 7.3 | Private URL leakage in SERP (`site:pmstructure.com checkout`) | Weekly | `PMSTRUCTURE_PRIVATE_URL_LEAKAGE_MONITOR.md` |
| 7.4 | False AI claims (ATP, guarantee, affiliation) | Monthly | `PMSTRUCTURE_AI_FALSE_CLAIM_RISK_LOG.md` |
| 7.5 | Crawled-not-indexed URLs in GSC | Weekly | Indexing monitoring log |
| 7.6 | Duplicate canonical issues | Weekly | GSC → Pages |
| 7.7 | Re-run `npm run seo:production-check` after deploy | Once | Deployment decision doc |

---

## Immediate sequence (recommended)

1. **Deploy v2** to `https://pmstructure.com`
2. Run `npm run seo:production-check` — expect `/pmp-faq` → 200
3. GSC sitemap re-submission
4. Bing import + sitemap
5. Priority URL inspection (top 10 routes)
6. Payment + form smoke tests
7. AI baseline (86 queries) — log as NOT TESTED until complete
8. Legal/business sign-off per owner checklist
