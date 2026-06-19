# PM Structure — PMP 2026 Content Engine

## Purpose

This document defines PM Structure's content system for PMP 2026, answer pages, topic hubs, FAQ expansion, and publishing cadence.

This is an internal SEO, AEO, GEO, and content operations document. Do not publish it as a public page.

## First commercial focus

**PMP 2026 Readiness Pathway**

## Primary pages

| Route | Role |
|-------|------|
| `/certifications/pmp` | Commercial readiness pathway (money page) |
| `/topics/pmp-exam-2026` | Authority guide / topic hub |
| `/answers/is-the-pmp-exam-changing-in-2026` | Direct answer page (P0) |
| `/faq` | Trust, eligibility, support, and claim-safety FAQ |

## Content rule

One page should own one primary intent. Do not create multiple PMP pages competing for the same keyword.

## Content system (Ask mode summary)

- **Framework:** Next.js 15 App Router monorepo (`@pms/frontend`).
- **Page types:** Code-first TypeScript content modules (`frontend/content/*`), certification registry JSON, optional Supabase CMS for blog/newsletter only — not WordPress.
- **Answer template:** `AnswerPage` + `AnswerPageContent` in `frontend/content/answers/pages.ts` + `AnswerJsonLd`.
- **Topic hub template:** `TopicHubPage` + `TopicHubContent` in `frontend/content/topics/hubs.ts` (26 hubs).
- **FAQ:** `frontend/content/faq/data.ts` + `frontend/content/faq/pmp-2026-faqs.ts` + embed components.
- **Calendar:** Editorial calendar in `pmstructure-90-day-content-calendar.csv`; channel/marketing ops in [`PMSTRUCTURE_90_DAY_MARKETING_SCHEDULE.md`](PMSTRUCTURE_90_DAY_MARKETING_SCHEDULE.md) — cross-link only, do not duplicate row-for-row.

## PMP cluster parent / child structure (T-162)

```text
/certifications/pmp          → commercial conversion (parent)
/topics/pmp-exam-2026        → authority hub (child — informational)
/answers/*                   → direct answers (children — one question each)
/pmp-exam-2026, /pmp-*       → cluster support pages (siblings — deep guides)
/faq                         → trust layer (cross-cutting)
```

Keyword-to-URL mapping lives in B06 [`pmstructure-keyword-url-map.csv`](pmstructure-keyword-url-map.csv) — do not recreate.

## Official-source rule

PMP 2026 facts must be checked against official PMI sources before publishing.

Each factual PMP 2026 page should include:

- last reviewed date
- source note
- `dateModified` where supported
- responsible reviewer (owner action until editorial system exists)

Track claims in [`pmstructure-pmp-2026-source-review.csv`](pmstructure-pmp-2026-source-review.csv).

Verified fact lock (owner browser review): [`PMSTRUCTURE_PMP_2026_FACT_LOCK.md`](PMSTRUCTURE_PMP_2026_FACT_LOCK.md). Owner validation register: [`pmstructure-owner-validation-register.csv`](pmstructure-owner-validation-register.csv).

### Official-source update workflow

1. Owner verifies claim on PMI.org (browser — automated fetch may 403).
2. Update `Verification_Status` and `Official_Source_URL` in source-review CSV.
3. Update live copy in `answers/pages.ts`, `topics/hubs.ts`, or cluster pages only after verification.
4. Set `Last_Reviewed` and regenerate AI files via build (`seo:generate-ai-files`).

## Safe claim rule

Avoid:

- official PMI course
- PMI-approved / authorized partner
- guaranteed pass
- 35 PDUs (for PMP eligibility — use training-hour / contact-hour wording)
- exam included unless operationally true
- job/salary guarantees

Use:

- independent PMP readiness support
- structured preparation pathway
- 35 hours of project management education/training where applicable
- roadmap guidance
- mentor-guided support

See [`../../frontend/lib/ai-files/compliance.ts`](../../frontend/lib/ai-files/compliance.ts) and [`../PMSTRUCTURE_AI_FALSE_CLAIM_RISK_LOG.md`](../PMSTRUCTURE_AI_FALSE_CLAIM_RISK_LOG.md).

## Metadata fields

Priority content pages should support:

| Field | Status |
|-------|--------|
| title | Via `phase-2-page-seo.ts` + page content |
| description | Via `phase-2-page-seo.ts` + page content |
| canonical | Via `buildPageMetadata` |
| datePublished | Not formalized — owner action |
| dateModified | Optional on answer/topic types; set on PMP 2026 priority pages |
| lastReviewed | `Pmp2026ComplianceNote` + source-review CSV |
| author | **Owner action** — no formal author system yet |
| reviewer | **Owner action** |
| sourceNote | `flagship-t169.ts`, hub `sourceTodo`, answer `references` |

## Publishing cadence

For the first 90 days, prioritize:

1. PMP 2026 authority guide
2. Direct answer pages
3. FAQ expansion
4. Comparison content
5. Regional readiness content (planned — owner approval for dedicated landings)
6. Corporate readiness content
7. Social posts routing to roadmap CTA

Editorial schedule: [`pmstructure-90-day-content-calendar.csv`](pmstructure-90-day-content-calendar.csv)

## Secondary certifications (T-151)

PRINCE2, PMI-RMP, Lean Six Sigma, and PgMP remain **secondary** until PMP 2026 proof exists.

Use waitlist / preview / comparison language unless delivery is live and owner-approved.

PM Structure is currently prioritizing PMP 2026 readiness. Secondary pathways support comparison and waitlist interest only.

## Internal link minimum set (T-149)

Every PMP 2026 priority answer links to `/certifications/pmp`, `/topics/pmp-exam-2026`, and `/faq` where routes exist.

Topic hub `/topics/pmp-exam-2026` links to commercial page, flagship answer, FAQ, and `/certifications/compare`.

Commercial `/certifications/pmp` links to topic hub, flagship answer, and FAQ.

## Related batches

| Batch | Reference |
|-------|-----------|
| B06 | [`PMSTRUCTURE_KEYWORD_ANCHOR_MAP_PHASE_2.md`](PMSTRUCTURE_KEYWORD_ANCHOR_MAP_PHASE_2.md), `pmstructure-keyword-url-map.csv` |
| B10 | [`PMSTRUCTURE_COMPETITOR_BENCHMARK.md`](PMSTRUCTURE_COMPETITOR_BENCHMARK.md), `pmstructure-keyword-gap-benchmark.csv` (content priorities only) |
| B11 marketing ops | [`PMSTRUCTURE_90_DAY_MARKETING_SCHEDULE.md`](PMSTRUCTURE_90_DAY_MARKETING_SCHEDULE.md) |

## QA sign-off (T-166)

Before marking PMP content releases complete:

- [ ] `npm run audit:content-engine` passes
- [ ] `npm run seo:answers-check`, `seo:pmp-check`, `seo:topics-check` pass
- [ ] No `35 PDUs` in public question titles
- [ ] No guaranteed-pass or PMI ATP claims unless verified
- [ ] Short answer visible above fold on priority answer pages
- [ ] Roadmap CTA routes to `/certifications/pmp` form anchor
- [ ] Source-review CSV updated for any new factual claims

## Owner / Mahaa actions (post-Agent)

| Item | Status | Register |
|------|--------|----------|
| PMI PMP 2026 facts (browser) | Verified 2026-06-19 | [`PMSTRUCTURE_PMP_2026_FACT_LOCK.md`](PMSTRUCTURE_PMP_2026_FACT_LOCK.md), source-review CSV |
| July 2026 dates | Locked | Fact lock + source-review CSV |
| Exam-fee FAQ | Excluded unless offer states otherwise | [`pmstructure-legal-disclaimer-review.csv`](pmstructure-legal-disclaimer-review.csv) |
| Trademark/disclaimer legal review | **Pending legal review** | [`pmstructure-legal-disclaimer-review.csv`](pmstructure-legal-disclaimer-review.csv) |
| GSC/GA4 validation | **Pending evidence** | [`PMSTRUCTURE_B03_GSC_GA4_VALIDATION_CHECKLIST.md`](PMSTRUCTURE_B03_GSC_GA4_VALIDATION_CHECKLIST.md) |
| Regional landing routes | **Blocked** | [`pmstructure-regional-route-approval.csv`](pmstructure-regional-route-approval.csv) |
| Author/reviewer | Sheikh M. Abdullah (content); legal TBD | [`pmstructure-author-reviewer-registry.csv`](pmstructure-author-reviewer-registry.csv) |

Recheck PMI sources before each major publish cycle.

---

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 19 June 2026
