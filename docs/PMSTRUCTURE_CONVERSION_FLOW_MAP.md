# PM Structure — Conversion Flow Map

**Run:** 15 (Phase 14)  
**Site:** https://www.pmstructure.com  
**Status:** Documented 2026-06-10

## Core journeys

### 1. Organic search → PMP 2026 → diagnostic → pathway → enrollment

| Step | Indexable | Route / action |
|------|-----------|----------------|
| Landing | yes | `/`, `/pmp-exam-2026`, `/pmp` |
| Orientation | yes | `/pmp-readiness-diagnostic`, `/answers/*` |
| Tier choice | yes | `/pmp-foundation`, `/pmp-professional`, `/pmp-mastery`, `/pmp-enrollment` |
| Cert detail | yes | `/certifications/pmp` |
| Enroll | **no** | `/certifications/pmp/{tier}/enroll` |
| Checkout alt | **no** | `/checkout?offering=…` |
| Success | **no** | `/certifications/pmp/{tier}/enroll/success`, `/checkout/success` |

### 2. AI / answer citation → answer page → FAQ → diagnostic → enrollment

| Step | Route |
|------|-------|
| Citation target | `/answers/is-the-pmp-exam-changing-in-2026` (and 14 siblings) |
| Deep context | `/topics/pmp-exam-2026`, `/faq?tab=pmp-2026` |
| CTA | `/pmp-readiness-diagnostic` → `/pmp-enrollment` → noindex enroll |

### 3. Social / channel → certification → regional pricing → payment

| Step | Route |
|------|-------|
| Channel LP | `/go/[channel]` (indexable) |
| Pathway | `/certifications/{id}` |
| Region select | Client modal (`RegionContext`) — not a URL variant |
| Payment | `/certifications/{id}/{tier}/enroll` or `/checkout` |

### 4. FAQ → consultation (Calendly)

| Step | Route |
|------|-------|
| FAQ | `/faq` (consultation cluster) |
| Contact | `/contact?topic=consultation` |
| Calendly | External — `lib/calendly/scheduling-urls.ts`, pathway env vars |

### 5. Mastery / consultation-gated pathway

| Step | Route |
|------|-------|
| Cert page modal | `PathwayOfferingModal` |
| Consultation required | `/contact?topic=consultation&offering=…` or tier Calendly URL |
| After approval | Enroll unlocks → noindex enroll URL |

---

## CTA & handoff inventory

| Type | Implementation | SEO |
|------|----------------|-----|
| Tier enroll | `enrollPath()` → `/certifications/{cert}/{tier}/enroll` | noindex |
| Legacy checkout | `/checkout?offering={id}` | noindex; `offering` stripped from canonical |
| Contact / lead | `/contact` with `topic` query | indexable `/contact` |
| Calendly | `CALENDLY_DEFAULT_SCHEDULING_URLS`, pathway env | external |
| Readiness diagnostic | `/pmp-readiness-diagnostic` → `/contact` | indexable |
| LMS access | Post-payment email / admin provision | not public HTML |

**CTA resolution:** `lib/cta-router.ts`, `lib/pathway-tier-cta.ts`

---

## Completion & payment pages (noindex confirmed)

| Route | robots | Sitemap |
|-------|--------|---------|
| `/checkout` | noindex,nofollow | excluded |
| `/checkout/success` | noindex,nofollow | excluded |
| `/checkout/cancel` | noindex,nofollow | excluded |
| `/certifications/*/…/enroll` | noindex,nofollow | excluded |
| `/certifications/*/…/enroll/success` | noindex,nofollow | excluded |

---

## Trust & compliance near conversion

| Surface | Component / copy |
|---------|------------------|
| Certification pages | `PricingComplianceNote`, regional price labels |
| PMP pathway pages | `PMP_INDEPENDENT_DISCLAIMER`, `PMP_PRICING_NOTE` |
| FAQ | `PricingComplianceNote` |
| Enroll forms | Terms acceptance, region verification |
| Legal | `/legal/pricing-disclaimers`, `/legal/regional-pricing`, `/legal/terms` |

---

## Analytics event plan (document only — implement in Run 18+)

| Event | Trigger |
|-------|---------|
| `pmp_diagnostic_cta_click` | Diagnostic CTA on hub/course/answer |
| `pathway_enroll_start` | Enroll button → enroll route |
| `checkout_start` | Checkout form submit |
| `consultation_book` | Calendly link click |
| `region_select` | Region modal confirm |

Use existing analytics hook when approved; do not block SSR.

---

## Validation

- [x] Enroll/checkout/success routes in `NOINDEX_PATH_PREFIXES` / patterns
- [x] Pathway pages link to noindex enroll — not vice versa as only path
- [ ] Post-deploy: manual enroll → success flow test
- [ ] Post-deploy: Calendly links open correct tier URLs
