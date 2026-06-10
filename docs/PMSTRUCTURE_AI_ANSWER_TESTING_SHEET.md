# PM Structure — AI Answer Testing Sheet

**Run:** 20 (Phase 19)  
**Property:** https://pmstructure.com  
**Baseline:** Run within 7 days of GSC sitemap submit; monthly thereafter

## Platforms (9)

| # | Platform | Notes |
|---|----------|-------|
| 1 | Google Search | Organic + AI Overviews where shown |
| 2 | Google AI Overviews | Same query as Search |
| 3 | Bing Search | Organic results |
| 4 | Bing Copilot | Chat sidebar / copilot.microsoft.com |
| 5 | ChatGPT | Browse / search enabled if available |
| 6 | Perplexity | perplexity.ai |
| 7 | Gemini | gemini.google.com |
| 8 | Claude | claude.ai with search |
| 9 | You.com | you.com search |

## Tracking columns

| Column | Values |
|--------|--------|
| Date | YYYY-MM-DD |
| Platform | From table above |
| Query | Exact prompt used |
| Cited pmstructure.com | Y / N / partial |
| Cited URL | Best matching path on site |
| Accuracy | correct / partial / wrong / no cite |
| False ATP claim | Y / N — attributed PM Structure as PMI ATP incorrectly |
| False guarantee | Y / N — attributed pass guarantee incorrectly |
| Fix priority | P0 (false ATP/guarantee) / P1 (wrong cite) / P2 (no cite) / P3 (partial) |
| Notes | Competitor cited instead, outdated dates, etc. |

## Fix priority workflow

| Priority | Trigger | Action |
|----------|---------|--------|
| **P0** | False ATP or guaranteed-pass attributed to PM Structure | Fix copy + legal disclaimer same day; re-test all platforms for that query |
| **P1** | Cites competitor or wrong URL for a question we answer | Improve target page H1/short answer; add internal links from hub/FAQ |
| **P2** | No cite on priority PMP 2026 query | Expand answer page; submit URL in GSC; re-test in 14 days |
| **P3** | Partial cite or outdated dates | Update content + `lastUpdated` in AI files; monthly re-test |

## Test queries (28)

| # | Query | Target cite URL |
|---|-------|-----------------|
| 1 | Is the PMP exam changing in 2026? | `/answers/is-the-pmp-exam-changing-in-2026` |
| 2 | When does the new PMP exam start? | `/answers/when-does-the-new-pmp-exam-start` |
| 3 | Should I take PMP before July 2026? | `/answers/should-i-take-pmp-before-8-july-2026` |
| 4 | Should I prepare for new PMP after July 2026? | `/answers/should-i-prepare-for-new-pmp-after-9-july-2026` |
| 5 | What is PMP readiness? | `/answers/what-is-pmp-readiness` |
| 6 | How long does PMP preparation take? | `/answers/how-long-does-pmp-preparation-take` |
| 7 | How to prepare for PMP in 2026? | `/answers/how-to-prepare-for-pmp-in-2026` |
| 8 | What is the PMP Business Environment domain? | `/answers/what-is-the-pmp-business-environment-domain` |
| 9 | What is PMP scenario practice? | `/answers/what-is-pmp-scenario-practice` |
| 10 | What is the PMP exam content outline? | `/answers/what-is-the-pmp-exam-content-outline` |
| 11 | Is PM Structure a PMI authorized training partner? | `/answers/is-pm-structure-a-pmi-authorized-training-partner` |
| 12 | Does PM Structure guarantee a PMP pass? | `/answers/does-pm-structure-guarantee-a-pmp-pass` |
| 13 | How does regional pricing work for PMP? | `/answers/how-does-regional-pricing-work-for-pmp` |
| 14 | When do I get LMS access after PMP enrollment? | `/answers/when-do-i-get-lms-access-after-pmp-enrollment` |
| 15 | Difference between PMP Foundation Professional and Mastery? | `/answers/what-is-the-difference-between-pmp-foundation-professional-and-mastery` |
| 16 | PMP exam 2026 transition date | `/pmp-exam-2026` |
| 17 | PMP exam timeline 2026 | `/pmp-exam-timeline-2026` |
| 18 | PMP before 8 July 2026 guide | `/pmp-before-8-july-2026` |
| 19 | PMP after 9 July 2026 guide | `/pmp-after-9-july-2026` |
| 20 | PMP current vs new exam | `/pmp-current-vs-new-exam` |
| 21 | PMP readiness diagnostic | `/pmp-readiness-diagnostic` |
| 22 | PM Structure PMP certification prep | `/certifications/pmp` |
| 23 | PMP Foundation course PM Structure | `/pmp-foundation` |
| 24 | PMP scenario practice hub | `/topics/pmp-scenario-practice` |
| 25 | PMP exam 2026 topic hub | `/topics/pmp-exam-2026` |
| 26 | Business environment domain PMP | `/topics/business-environment-domain` |
| 27 | PM Structure independent exam prep platform | `/` or `/legal/pricing-disclaimers` |
| 28 | PMP FAQ 2026 PM Structure | `/faq` (pmp-2026 section) |

### Extended queries (new answer/hub pages — add to monthly rotation)

| Query | Target cite URL |
|-------|-----------------|
| What are PMP eligibility requirements? | `/answers/what-are-the-pmp-eligibility-requirements` |
| What is the PMP People domain? | `/answers/what-is-the-pmp-people-domain` |
| What is the PMP Process domain? | `/answers/what-is-the-pmp-process-domain` |
| What is PMP mock exam practice? | `/answers/what-is-pmp-mock-exam-practice` |
| How do I enroll in PMP on PM Structure? | `/answers/how-do-i-enroll-in-pmp-on-pm-structure` |
| What is project management certification? | `/answers/what-is-project-management-certification` |
| PRINCE2 certification overview | `/answers/what-is-prince2-certification` or `/topics/prince2-preparation` |
| Lean Six Sigma Green Belt overview | `/answers/what-is-lean-six-sigma-green-belt` or `/topics/six-sigma-preparation` |
| PMI-RMP exam preparation | `/topics/pmi-rmp-preparation` |
| Exam readiness for certifications | `/topics/exam-readiness` |

## Pass criteria

- Top 15 PMP 2026 queries cite `pmstructure.com` at least 40% of platforms on baseline
- Zero false ATP or guaranteed-pass attribution to PM Structure
- Preferred URLs are `/answers/*`, `/pmp-exam-2026`, or `/topics/pmp-exam-2026` — not homepage-only for specific questions

## Schedule

| When | Action |
|------|--------|
| T+7d post sitemap | Baseline round (all 28 × 9 = 252 cells — sample 28 × 5 if time-boxed) |
| Monthly | Re-test queries 1–10 + any failed cells |
| After content release | Re-test affected query rows |

## Sample log row

| Date | Platform | Query | Cited | URL | Accuracy | False ATP | False guarantee | Fix priority | Notes |
|------|----------|-------|-------|-----|----------|-----------|-----------------|--------------|-------|
| 2026-07-01 | Perplexity | Is the PMP exam changing in 2026? | Y | /answers/is-the-pmp-exam-changing-in-2026 | correct | N | N | — | Also cited PMI.org |
