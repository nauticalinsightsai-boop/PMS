# PM Structure — Offer, Trust, CTA, Community, Regional Positioning, and Scholarship System

## Purpose

This document defines PM Structure's commercial offer structure, CTA hierarchy, trust layer, founder/mentor proof, community story, GCC positioning, South Asia positioning, corporate cohort package, and scholarship rules.

This is an internal commercial, UX, and trust-governance document. Do not publish it as a public page.

## First Commercial Focus

PMP 2026 Readiness Pathway

## Primary CTA

Get My PMP 2026 Roadmap

## Secondary CTA

Talk to a Mentor

## Commercial Hierarchy

1. PMP 2026 Readiness Pathway
2. PMP 2026 roadmap request
3. Mentor/review call
4. Corporate PMP 2026 cohort
5. Membership/community support layer
6. Secondary certification waitlists/previews
7. Resource store preview/waitlist

## Membership Rule

Membership should not be the main product yet.

It should support the PMP readiness pathway as a community/resource/accountability layer.

## Resource Store Rule

If resources are not ready to purchase, use Preview, Join Waitlist, Notify Me, or Request Access.

Do not use Buy Now unless payment and delivery are ready.

## Community Rule

Use one clear community-platform story.

Do not mention Slack, Skool, Circle, Discord, or other platforms as live unless true.

Do not link broken invitation-token URLs publicly.

See `pmstructure-community-platform-decision.csv` for owner decision status.

## Testimonial Rule

Testimonials must be verified, permission-approved, anonymized with permission, clearly illustrative, or removed.

Do not publish fake testimonials.

See `pmstructure-testimonial-verification.csv`.

## Founder / Mentor Trust Rule

Use real credentials and experience.

Do not exaggerate authority.

Do not claim official PMI instructor/provider status unless verified.

Public founder block requires owner approval (see `pmstructure-author-reviewer-registry.csv`).

Implementation: `frontend/components/trust/FounderTrustBlock.tsx` exists with `FOUNDER_TRUST_PUBLIC_MOUNT_APPROVED = false` — do not mount on public routes until owner approves credentials.

## GCC Positioning Rule

Position GCC as structured readiness and career mobility, not cheap PMP videos.

No fake physical office claims. Regional landing routes remain **Blocked** per `pmstructure-regional-route-approval.csv`.

## South Asia Positioning Rule

Position South Asia as career mobility and international readiness, not low-price training.

## Corporate Cohort Rule

Corporate cohort package should focus on team readiness, exam-version alignment, accountability, and practical project delivery context.

Public launch requires owner approval. See `PMSTRUCTURE_CORPORATE_COHORT_BRIEF.md`.

## Scholarship Rule

Scholarships must have rules.

Do not create random discounts or low-value regional positioning.

See `pmstructure-scholarship-rules.csv`.

## Claims Rule

Avoid:

- PMI-approved
- official PMI course
- authorized training partner
- guaranteed pass
- 35 PDUs as PMP eligibility wording
- fake reviews or ratings

Use:

- independent PMP readiness support
- structured preparation pathway
- project management education/training hours where applicable
- readiness roadmap
- mentor-guided support

## Cross-links

- B10 offer benchmark: `pmstructure-offer-comparison-benchmark.csv`
- B11 fact lock: `PMSTRUCTURE_PMP_2026_FACT_LOCK.md`
- B11 content engine: `PMSTRUCTURE_CONTENT_ENGINE.md`
- B03 analytics: `PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md`
- Legal review: `pmstructure-legal-disclaimer-review.csv`
- Regional routes: `pmstructure-regional-route-approval.csv`

## Owner status (B12)

| Item | Owner | Status |
|------|-------|--------|
| Skool live vs waitlist-only | Sheikh M. Abdullah | Needs owner review |
| Founder credentials public display | Sheikh M. Abdullah | Blocked until approved |
| Testimonial verify/remove | Sheikh M. Abdullah | Needs owner review |
| Member counts / store ratings | Sheikh M. Abdullah / Mahaa | Removed or relabeled in B12 |
| Corporate cohort launch | Sheikh M. Abdullah | Proposed only |
| Scholarship numbers | Sheikh M. Abdullah | Draft CSV only |
| Legal/trademark final wording | Legal reviewer TBD | Pending |

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 19 June 2026
