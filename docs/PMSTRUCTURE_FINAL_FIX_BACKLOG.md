# PM Structure. Final Fix Backlog

**Audit date:** 2026-06-10  
**Ordered by severity** (critical → low)

---

## Critical

*No critical code blockers identified.*

---

## High

| Fix ID | Severity | Category | Affected route/file | Issue | Why it matters | Recommended fix | Owner | Status | Dependency | Validation | Effort | Deploy blocker |
|--------|----------|----------|---------------------|-------|----------------|-----------------|-------|--------|------------|------------|--------|----------------|
| FIX-H01 | high | deployment | `https://pmstructure.com/pmp-faq` | Returns 404 on production | Core v2 PMP FAQ hub missing from live site | Deploy current build | Owner/DevOps | open | v2 deploy | `npm run seo:production-check` | S | **yes** (for v2 go-live completeness) |
| FIX-H02 | high | GSC/Bing | GSC property | v2 sitemap not re-submitted post-deploy | New URLs may index slowly | Submit `sitemap.xml` in GSC | Owner | open | FIX-H01 | GSC sitemap status | S | no |
| FIX-H03 | high | AI answer testing | `reports/seo/ai-answer-test-queries.csv` | 86 queries all `NOT TESTED` | No verified AI citation baseline | Run playbook across platform matrix | Owner | open | FIX-H01 | Manual log update | M | no |

---

## Medium

| Fix ID | Severity | Category | Affected route/file | Issue | Why it matters | Recommended fix | Owner | Status | Dependency | Validation | Effort | Deploy blocker |
|--------|----------|----------|---------------------|-------|----------------|-----------------|-------|--------|------------|------------|--------|----------------|
| FIX-M01 | medium | GSC/Bing | Bing Webmaster | Site not imported from GSC | Bing coverage gap | Import from GSC per checklist | Owner | open |: | Bing dashboard | S | no |
| FIX-M02 | medium | legal/compliance | `docs/PMSTRUCTURE_LEGAL_COMPLIANCE_MAP.md` | `TODO_LEGAL_REVIEW` outstanding | Counsel not engaged | Schedule legal review | Owner/Legal | open |: | Sign-off in map | M | no |
| FIX-M03 | medium | legal/compliance | `/legal/refunds` | `TODO_BUSINESS_DECISION` on refund windows | Business rules undefined | Owner defines policy | Owner | open |: | Policy doc update | M | no |
| FIX-M04 | medium | conversion | checkout/enroll flow | Manual payment smoke not recorded | Revenue path unverified live | Test enroll → checkout → success/cancel | Owner/QA | open | FIX-H01 | Manual smoke doc | M | no |
| FIX-M05 | medium | deployment | `PMSTRUCTURE_DEPLOYMENT_RISK_REGISTER.md` | Enroll/payment smoke NOT TESTED | Risk undocumented post-deploy | Record smoke results | Owner | open | FIX-M04 | Risk register | S | no |
| FIX-M06 | medium | indexing | Production post-deploy | Priority URL inspection not run | Index lag for new surfaces | GSC URL inspection per priority list | Owner | open | FIX-H01 | GSC coverage | M | no |
| FIX-M07 | medium | AI files | `llms.txt` | Lists `/checkout`, `/admin` in deny section | Correct as deny-list; monitor for mis-citation | Run AI leakage queries in baseline | Owner | open | FIX-H03 | AI test sheet G8 | S | no |

---

## Low

| Fix ID | Severity | Category | Affected route/file | Issue | Why it matters | Recommended fix | Owner | Status | Dependency | Validation | Effort | Deploy blocker |
|--------|----------|----------|---------------------|-------|----------------|-----------------|-------|--------|------------|------------|--------|----------------|
| FIX-L01 | low | validation scripts | `frontend/components/pages/Community.tsx` | ESLint unused `CardTitle` | Lint gate fails | Remove unused import | Dev | open |: | `npm run lint` | S | no |
| FIX-L02 | low | schema | `components/seo/*JsonLd.tsx` | TS union mismatch on FAQPage graph push | Typecheck noise | Widen graph type or split builders | Dev | open |: | `tsc --noEmit` | M | no |
| FIX-L03 | low | metadata | Various map docs | Stale counts (23 answers, 17 topics) | Operator confusion | Update map docs to 35/26/89 | Dev | open |: | Doc review | S | no |
| FIX-L04 | low | headings | `/about`, `/blog/*` | WebPage schema marked planned in matrix | Non-PMP surfaces lower priority | Phase 2 schema pass | Dev | backlog |: | schema-check | M | no |
| FIX-L05 | low | deployment | IndexNow | `INDEXNOW_KEY` not configured | Faster Bing discovery optional | Configure key + dry-run test | Owner | open | FIX-H01 | `npm run seo:indexnow` | S | no |
| FIX-L06 | low | regional pricing | Docs canonical | Some docs reference `www.pmstructure.com` | Minor canonical drift in docs | Align docs to apex | Dev | open |: | Doc grep | S | no |

---

## Safe / no fix required (audit notes)

| Finding | Classification |
|---------|----------------|
| "Does PM Structure guarantee PMP…" FAQ questions | **Safe disclaimer**: answers deny guarantee |
| "official PMI" in FAQ answers | **Safe**: refers users to PMI.org, not PM Structure claims |
| `llms.txt` deny-list mentions checkout/admin | **Safe**: do-not-cite block, not promotion |
| RegionGate | **Safe**: non-blocking SSR; render-check confirmed |
| Compliance scan (`seo:compliance-check`) | **PASS** |