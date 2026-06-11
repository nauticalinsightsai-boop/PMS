# AI answer baseline: 2026-06-10

**Reference:** `PMSTRUCTURE_AI_ANSWER_TESTING_SHEET.md`  
**Test sheet:** `reports/seo/ai-answer-test-queries.csv` (86 rows)  
**Status:** **Pre-reqs complete: manual platform testing not started**

---

## Automated pre-requisites (done)

| Item | Status |
|------|--------|
| `npm run seo:generate-ai-test-sheet` | 86 queries generated |
| AI files on live (`/llms.txt`, `/entity.json`) | smoke-live PASS |
| Priority answer URLs live 200 | verified 2026-06-10 |

---

## Manual baseline (owner)

Run within 7 days of GSC sitemap submit. Minimum sample: **queries 1-15** from testing sheet × platforms **1-5** (Google Search, AI Overviews, Bing, Copilot, Perplexity).

### Priority compliance queries (run first)

| # | Query | Target URL | False ATP | False guarantee |
|---|-------|------------|-----------|-----------------|
| 11 | Is PM Structure a PMI authorized training partner? | `/answers/is-pm-structure-a-pmi-authorized-training-partner` |: |: |
| 12 | Does PM Structure guarantee a PMP pass? | `/answers/does-pm-structure-guarantee-a-pmp-pass` |: |: |

### Log template

| Date | Platform | Query | Cited | URL | Accuracy | False ATP | False guarantee | Fix priority | Notes |
|------|----------|-------|-------|-----|----------|-----------|-----------------|--------------|-------|
| 2026-06-10 |: |: |: |: |: |: |: |: | Baseline not started: fill after GSC submit |

### Pass criteria (from sheet)

- Top 15 PMP 2026 queries cite `pmstructure.com` on ≥40% of platforms
- Zero false ATP or guaranteed-pass attribution to PM Structure

---

## After logging

Update `reports/seo/ai-answer-test-queries.csv` `status` column from `NOT TESTED` → `PASS` / `FAIL` / `PARTIAL` per query group.