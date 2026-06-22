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
| Mobile Perf ≥85 | CLI 52–58 → **70** post cookie defer (`5bb02e2`); still below target |
| Mobile LCP &lt;2.5s | ~4.0s CLI post cookie defer (was 7.3s baseline, 5.2s pre-fix) |
| Agentic 3/3 | llms.txt fixed; manual PSI |
| Cloudflare headers | p6-04 deferred |

## Evidence index

- `lighthouse-home-baseline-2026-06-16.json`
- `lighthouse-home-post-deploy-mobile-2026-06-22.json`
- `lighthouse-home-success-matrix-2026-06-22.json`
- `lighthouse-home-after-implementation-2026-06-20.json`
- Phase 0/2/3/6 markdown notes in `docs/internal/evidence/`

## p7-09 follow-up

Certifications hub + all `/certifications/[id]` detail pages: server hero shipped (`8354f4a`, `a08ca78`). Hub LCP CLI **4.4s** (was 6.0s B15). PMP detail LCP **6.4s** CLI (subtitle LCP element, ~2.6s render delay). See `lighthouse-certifications-progress-2026-06-22.json`.

## Post-closeout findings (2026-06-22)

| Finding | Action |
|---------|--------|
| Home LCP element = `cookie-consent-desc` | Defer banner 4.5s + `ssr:false` dynamic import |
| PMP LCP element = hero subtitle `<p>` | Subtitle moved to client; h1-only server hero |
| Mobile Perf ≥85 / LCP &lt;2.5s | Still open; cookie fix expected to help home most |
