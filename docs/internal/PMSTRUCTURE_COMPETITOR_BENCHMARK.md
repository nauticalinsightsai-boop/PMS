# PM Structure — Competitor Benchmark and Reference Analysis

## Purpose

This document benchmarks PM Structure against official certification sources, PMP training competitors, and content/reference pages.

This is an internal strategy and SEO document. Do not publish it as a public page.

**Related:** [`pmstructure-keyword-url-map.csv`](pmstructure-keyword-url-map.csv) (B06) · [`PMSTRUCTURE_90_DAY_MARKETING_SCHEDULE.md`](PMSTRUCTURE_90_DAY_MARKETING_SCHEDULE.md) (B11 reference) · [`../PMSTRUCTURE_AI_FALSE_CLAIM_RISK_LOG.md`](../PMSTRUCTURE_AI_FALSE_CLAIM_RISK_LOG.md) · [`../../frontend/lib/ai-files/compliance.ts`](../../frontend/lib/ai-files/compliance.ts)

---

## First Commercial Focus

```txt
PMP 2026 Readiness Pathway
```

---

## Preferred PM Structure Host

```txt
https://pmstructure.com
```

---

## Competitor / Reference Set

| ID | Brand | URL | Source type |
|----|-------|-----|-------------|
| PMI-PMP | PMI PMP | https://www.pmi.org/certifications/project-management-pmp | Official body |
| PMI-ATP | PMI Authorized Training Partners | https://www.pmi.org/learning/authorized-training-partners | Official body |
| PMTRAINING | PMTraining | https://www.pmtraining.com/ | Commercial training |
| SIMPLILEARN | Simplilearn PMP | https://www.simplilearn.com/project-management/pmp-certification-training | Commercial training |
| COURSERA | Coursera PMP search | https://www.coursera.org/courses?query=pmp | Marketplace / aggregator |
| KNOWLEDGEHUT | KnowledgeHut PMP | https://www.knowledgehut.com/project-management/pmp-certification-training | Commercial training |
| IPM-GUIDE | Institute Project Management | https://instituteprojectmanagement.com/blog/best-project-management-certification-2026-expert-guide/ | Content / thought leadership |
| PRINCE2 | PRINCE2 official | https://www.prince2.com/ | Official body (PRINCE2) |
| SIXSIGMA | Six Sigma Council | https://www.sixsigmacouncil.org/ | Official body (Six Sigma) |
| PMSTRUCTURE | PM Structure | https://pmstructure.com/certifications/pmp | Own-site benchmark |

---

## URL 1–5 metrics mapping (T-129–T-132)

No pre-existing audit file defined URL 2–5. Proposed mapping for [`pmstructure-competitor-metrics.csv`](pmstructure-competitor-metrics.csv):

| Slot | Competitor | URL |
|------|------------|-----|
| URL 1 | PMI PMP (official) | https://www.pmi.org/certifications/project-management-pmp |
| URL 2 | PMTraining | https://www.pmtraining.com/ |
| URL 3 | Simplilearn PMP | https://www.simplilearn.com/project-management/pmp-certification-training |
| URL 4 | Coursera PMP query | https://www.coursera.org/courses?query=pmp |
| URL 5 | KnowledgeHut PMP | https://www.knowledgehut.com/project-management/pmp-certification-training |

---

## Research Rule

Do not invent competitor data.

Use only:

- live page verification (where fetch succeeds),
- repo-verified PM Structure data,
- uploaded/exported files (none in repo at B10 creation),
- SERP screenshots (owner),
- Semrush/Ahrefs/Keyword Planner exports (owner),
- crawl / PageSpeed / GSC exports (owner).

Mark missing fields as `TBD — requires owner research` or `TBD — requires tool export`.

**Automated fetch note (B10):** `pmi.org` returned **403 Forbidden** to automated fetch — PMI PMP and PMI ATP rows need owner browser capture.

---

## Positioning Rule

PM Structure should not try to look like a generic low-cost PMP course provider.

Primary positioning:

Structured PMP 2026 readiness support for serious project professionals, with roadmap guidance, mentor/author trust, practical project-management context, and regional relevance for GCC/South Asia/global professionals.

---

## What PM Structure Should Own

- PMP 2026 transition clarity (current vs updated exam route)
- Roadmap-based readiness (form + mentor support)
- Engineering / project-delivery professional angle
- GCC career-mobility angle
- Corporate cohort readiness (`/pm-service`)
- Compliance-safe certification support (independent prep disclaimers)
- Practical project governance perspective
- Mentor/founder credibility

---

## What PM Structure Should Avoid

- Fake official PMI approval or ATP language
- Unauthorized partner language
- Guaranteed-pass claims
- Fake student counts or review/rating claims
- Cheap-course-only positioning
- Confusing membership as the main product too early
- Launching too many certification hubs at once before PMP proof

---

## Gap analysis (qualitative)

| Dimension | PM Structure | vs typical commercial competitor | Action |
|-----------|--------------|-------------------------------|--------|
| PMP 2026 specificity | Strong — `/certifications/pmp`, topic hub | Parity on transition messaging | B11 content calendar |
| Roadmap-first CTA | Strong — Get My PMP 2026 Roadmap | Differentiator vs generic Enroll | Keep |
| Official-body disclaimers | Strong — FAQ, compliance.ts | Competitors often overclaim ATP | Do not do — maintain |
| Verified social proof | Gap — no public review count | Competitors show ratings/student counts | Needs evidence |
| SEO tool metrics | Unknown | Unknown | Owner: Semrush/Ahrefs |
| Comparison content | `/certifications/compare` exists | Competitors use heavy tables | Calendar — no copy |
| GCC / engineer angles | Calendar planned | Regional landing pages common | Owner decision |

---

## Output Documents

- [`pmstructure-competitor-benchmark.csv`](pmstructure-competitor-benchmark.csv)
- [`pmstructure-competitor-metrics.csv`](pmstructure-competitor-metrics.csv)
- [`pmstructure-keyword-gap-benchmark.csv`](pmstructure-keyword-gap-benchmark.csv)
- [`pmstructure-offer-comparison-benchmark.csv`](pmstructure-offer-comparison-benchmark.csv)
- [`pmstructure-claims-risk-benchmark.csv`](pmstructure-claims-risk-benchmark.csv)

Audit: `npm run audit:competitor-benchmark`

---

## Owner / Mahaa research checklist

1. Export Semrush or Ahrefs for PMTraining, Simplilearn, KnowledgeHut, pmstructure.com — fill metrics CSV.
2. Manual browser capture: PMI PMP + PMI ATP pages (403 blocked automated fetch).
3. Coursera PMP SERP screenshot + note top 3 listings (fetch captured listing structure only).
4. Screaming Frog or Sitebulb crawl of priority competitor URLs (structure only — no copy paste).
5. GSC queries report for PM Structure PMP cluster — validate keyword gap priorities.
6. Legal review before any **public** competitor comparison page.
7. Verified testimonial / case study collection — do not publish competitor-style student counts.

---

## Copyright / trademark safety

Do not copy competitor text, images, logos, or tables into public pages. Use generic descriptions in internal docs only.

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026
