---
name: Certifications Lighthouse Follow-up
overview: "Follow-up from homepage Lighthouse plan (p7-09). Target /certifications and /certifications/pmp — B15 pre-fix evidence Perf 51/LCP 6.0s and Perf 65/LCP 6.5s."
todos:
  - id: c0-01-baseline
    content: Record post-homepage-ship Lighthouse CLI for /certifications and /certifications/pmp
    status: pending
  - id: c1-01-hero-lcp
    content: Audit certifications hub hero LCP element (likely client-rendered heading)
    status: pending
  - id: c1-02-pmp-detail-lcp
    content: Audit /certifications/pmp LCP element and cert hero layout
    status: pending
  - id: c2-01-shared-images
    content: Apply store/testimonial image sanitization patterns on cert pages if needed
    status: pending
  - id: c3-01-verify
    content: Production PSI mobile on /certifications and /certifications/pmp after fixes
    status: pending
isProject: false
---

# Certifications routes — Lighthouse follow-up

Deferred from `pmstructure_lighthouse_fixes` p7-09. Homepage `/` shipped first (commits `8f15584`, `578abbd`).

**Pre-fix B15 CLI** (`b15-lighthouse-production-summary-2026-06-20.json`):

| Route | Perf | LCP |
|-------|------|-----|
| `/certifications` | 51 | 6.0s |
| `/certifications/pmp` | 65 | 6.5s |
