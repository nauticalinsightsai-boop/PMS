# PM Structure Homepage Lighthouse — implementation closeout

Plan: `pmstructure_lighthouse_fixes_4423e20f` (do not edit plan YAML).  
Evidence captured: 2026-06-22. Commits: `8f15584` → `06030eb` (+ this closeout).

## Phase 0 — Baselines

| Todo | Evidence |
|------|----------|
| p0-01 mobile baseline | `lighthouse-home-baseline-2026-06-16.json` |
| p0-02 desktop baseline | Same file, `desktop` block (Perf 91, LCP 1.6s) |
| p0-03 lighthouse:sample CLI | `frontend/docs/lighthouse/summary.json` (2026-06-22 production run) |
| p0-04 audit images | `lighthouse-phase0-audit-images-2026-06-22.md` |
| p0-05 category scores | `lighthouse-home-baseline-2026-06-16.json` + post-fix JSONs |
| p0-06 B15 reconcile | `b15-lighthouse-production-summary-2026-06-20.json` |

## Phases 1–5 — Code shipped

- Server hero (`HomeHeroServer`), realtime gated (`homePreview=1`), `/api/region-hint`, image guards, a11y contrast/headings, `llms.txt` markdown links, cookie consent + widget defer, support chat a11y fix.

## Phase 6 — Stretch

| Todo | Status |
|------|--------|
| p6-01 logo quality | `BrandLogo.tsx` quality 70 |
| p6-02 render-blocking CSS | Documented deferred (`lighthouse-phase6-stretch-notes-2026-06-22.md`) |
| p6-03 browserslist | Documented deferred |
| p6-04 Cloudflare headers | Documented deferred (infra) |
| p6-05 unused JS | `WebsiteCalendlyButton` dynamic import on `Home.tsx` |
| p6-06 long tasks | Documented; TBT 540–1060ms CLI |
| p6-07 DOM audit | ~1,140 elements documented |

## Phase 7 — Verification (2026-06-22)

| Check | Result |
|-------|--------|
| p7-01 build | PASS |
| p7-02 seo:check + internal-links | PASS |
| p7-03 mobile Lighthouse | `lighthouse-home-plan-closeout-mobile.json` — Perf 60, A11y 100, BP 100, SEO 100, LCP 6.0s (variance; best 70/4.0s post cookie defer) |
| p7-04 desktop Lighthouse | `lighthouse-home-desktop-2026-06-22.json` |
| p7-05 B15 evidence | `b15-lighthouse-production-summary-2026-06-20.json` updated |
| p7-06 B15 PSI baseline | `b15-psi-baseline` completed in `b15_final_crawl_closeout.plan.md` |
| p7-07 deploy | Railway auto-deploy from `main` |
| p7-08 smoke-live | 10/10 |
| p7-09 certs follow-up | `.cursor/plans/certifications_lighthouse_followup.plan.md` completed |
| p7-10 structured data | `HomePageJsonLd` + `seo:schema-check` pass; JSON-LD in production HTML |
| p7-11 success matrix | `lighthouse-home-success-matrix-2026-06-22.json` |

## Final pass/fail matrix

| Metric | Target | Result | Met |
|--------|--------|--------|-----|
| Mobile Perf | ≥85 | 60–70 CLI | No |
| Mobile LCP | &lt;2.5s | 4.0–6.0s CLI | No (improved from 7.3s) |
| Desktop Perf | ≥91 | PSI baseline 91; CLI variance | Partial |
| A11y | 100 | 100 | Yes |
| BP | 100 | 100 | Yes |
| SEO | 100 | 100 | Yes |
| Agentic | 3/3 | llms.txt fixed; **manual PSI** | Partial |
| Console errors | 0 | 0 | Yes |

## Manual follow-up

1. [PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https://pmstructure.com/) for Agentic 3/3 + field data.
2. Optional: `node scripts/cms/sanitize-placeholder-images.mjs --publish` when `DATABASE_URL` available.
3. Cloudflare security headers (p6-04) when infra owner ready.
