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
| Agentic Browsing 3/3 | ✓ Fresh PSI 2026-06-22 (LH 13.4.0); commits `f96fabb`, `34ac9ff` |

## Targets not met (documented)

| Target | Status |
|--------|--------|
| Mobile Perf ≥85 | CLI **68–70** post cookie defer (`5bb02e2`); PSI mobile **99** (2026-06-22) |
| Mobile LCP &lt;2.5s | CLI **4.0–4.4s** post cookie defer (was 7.3s baseline); PSI **1.4s** (2026-06-22) |
| Cloudflare headers | p6-04 deferred |
| A11y 96 regression | SupportChatWidget `aria-hidden` + focusable children; fixed in next commit |

## Evidence index

- `lighthouse-home-baseline-2026-06-16.json`
- `lighthouse-home-post-deploy-mobile-2026-06-22.json`
- `lighthouse-home-success-matrix-2026-06-22.json`
- `lighthouse-home-after-implementation-2026-06-20.json`
- Phase 0/2/3/6 markdown notes in `docs/internal/evidence/`
- `lighthouse-phase5-agentic-psi-closeout-2026-06-22.md`
- `lighthouse-phase5-agentic-verified-2026-06-22.json`
- `psi-agentic-3of3-2026-06-22.png`

## p7-09 follow-up

Certifications hub + all `/certifications/[id]` detail pages: server hero shipped (`8354f4a`, `a08ca78`). Hub LCP CLI **4.4s** (was 6.0s B15). PMP detail LCP **6.4s** CLI (subtitle LCP element, ~2.6s render delay). See `lighthouse-certifications-progress-2026-06-22.json`.

## Post-closeout findings (2026-06-22)

| Finding | Action |
|---------|--------|
| Home LCP element = `cookie-consent-desc` | Defer banner 4.5s + `ssr:false` dynamic import |
| PMP LCP element = hero subtitle `<p>` | Server `line-clamp-2` subtitle; h1 wins LCP on a63de43 (5.9s) |
| Support chat A11y 96 | Closed panel had `aria-hidden` + focusable controls; unmount when closed |
