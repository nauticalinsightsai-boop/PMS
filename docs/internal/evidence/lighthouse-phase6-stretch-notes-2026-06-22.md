# Phase 6 — Stretch / conditional notes (2026-06-22, updated plan closeout)

## Latest production CLI (`lighthouse-home-plan-closeout-mobile.json`)

Perf **60**, LCP **6.0s**, TBT **540ms**, A11y/BP/SEO **100**. Best run post cookie-defer: Perf **70**, LCP **4.0s**.

`lighthouse:sample` production (2026-06-22): home Perf **61**, LCP **4.15s**.

## p6-01 Logo quality — **done**

`BrandLogo.tsx`: `quality={70}` on priority wordmarks.

## p6-02 Render-blocking CSS — **deferred**

Measured ~240–490ms in Jun 16 PSI. Critical CSS inline not implemented.

## p6-03 Legacy polyfills (~12 KiB chunk 3131) — **deferred**

Browserslist modernization needs product sign-off.

## p6-04 Security headers — **deferred**

CSP, HSTS preload, COOP, XFO, Trusted Types: Cloudflare/Namecheap.

## p6-05 Unused JS — **done (partial)**

`WebsiteCalendlyButton` moved to `dynamic()` in `Home.tsx` (matches `Certifications.tsx` pattern). Further chunk trimming if Perf still &lt;85 after PSI.

## p6-06 Long tasks — **documented**

TBT 540–1060ms on CLI; monitor on PSI field data.

## p6-07 DOM size — **documented**

Homepage ~1,140 elements, depth 18. Lazy sections use `LazyWhenVisible` / dynamic imports.
