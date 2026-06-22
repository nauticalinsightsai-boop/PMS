# Homepage Lighthouse plan — closeout (2026-06-22)

Plan: `pmstructure_lighthouse_fixes_4423e20f`. Commits: `8f15584` → `43f3dd3`.

## Targets met (production `/`, post `e001a35`)

| Target | Result |
|--------|--------|
| A11y 100 | ✓ CLI 100 |
| BP 100 | ✓ CLI 100 (region-hint proxy) |
| SEO 100 | ✓ |
| Zero console errors | ✓ post-deploy |
| Server h1 in HTML | ✓ `home-hero-title` |
| No pravatar/picsum | ✓ |
| Realtime off public home | ✓ `homePreview=1` only |

## Targets not met (documented)

| Target | Status |
|--------|--------|
| Mobile Perf ≥85 | CLI 52–58; p6 stretch |
| Mobile LCP &lt;2.5s | ~4.2–6.3s CLI (improved vs 7.3s baseline) |
| Agentic 3/3 | llms.txt fixed; manual PSI |
| Cloudflare headers | p6-04 deferred |

## Evidence index

- `lighthouse-home-baseline-2026-06-16.json`
- `lighthouse-home-post-deploy-mobile-2026-06-22.json`
- `lighthouse-home-success-matrix-2026-06-22.json`
- `lighthouse-home-after-implementation-2026-06-20.json`
- Phase 0/2/3/6 markdown notes in `docs/internal/evidence/`

## p7-09 follow-up

Certifications hub server hero shipped in separate commit (see `certifications_lighthouse_followup.plan.md`).
