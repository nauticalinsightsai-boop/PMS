# Phase 6 — Stretch / conditional notes (2026-06-22)

Post-fix CLI home (`https://pmstructure.com/`): Perf **57**, LCP **4.36s**, TBT **~1032ms** (desktop throttle).

## p6-01 Logo quality — **done**

`BrandLogo.tsx`: `quality={70}` on priority wordmarks.

## p6-02 Render-blocking CSS — **deferred**

Measured ~240–490ms in Jun 16 PSI. Mobile LCP still >2.5s on CLI; critical CSS inline not implemented (risk to `globals.css` lock). Revisit if mobile PSI LCP remains >2.5s after hero fix.

## p6-03 Legacy polyfills (~12 KiB chunk 3131) — **deferred**

Browserslist modernization needs product sign-off (may drop older mobile browsers).

## p6-04 Security headers — **deferred**

CSP, HSTS preload, COOP, XFO, Trusted Types: configure at **Cloudflare/Namecheap** — not in `next.config.ts`.

## p6-05 Unused JS (~57 KiB) — **conditional, not triggered**

Chunks 6963, 7531. Mobile Perf <85 on PSI → audit dynamic imports in a follow-up.

## p6-06 Long tasks — **conditional**

4–6 tasks (3131, 241, 2498, webpack). TBT high on CLI; address if mobile PSI TBT >200ms.

## p6-07 DOM size — **documented**

Homepage ~1,140 elements, depth 18 (Jun 16 PSI). No section removal; lazy sections already use `LazyWhenVisible` / dynamic imports.
