# Phase 1 — Hero LCP audit (2026-06-22)

## Pre-fix (Jun 16 PSI)

- LCP element: visible **client** `h1` in `Home.tsx`
- Element render delay: **~2320ms** (mobile), ~2460ms (desktop)
- `HomeServerHeading.tsx` sr-only duplicate removed

## Post-fix

| Item | Status |
|------|--------|
| `HomeHeroServer.tsx` server badge + `h1#home-hero-title` | Shipped |
| `page.tsx` children pattern into `Home` | Shipped (`578abbd`) |
| Duplicate client `h1` removed | Shipped |
| Hero `m.div` `initial={false}` | Shipped |
| `HomeHeroAccentRotator` `initial={false}` | Shipped |
| Hero form `min-h-[420px]` skeleton | Shipped |
| Hero form no scale on first paint | Shipped (no motion wrapper on hero placement) |

## Local / CLI LCP verification (p1-10)

Target LCP &lt;2.5s **not met** on CLI (variance 4.0–6.0s). Best post cookie-defer run: **4.0s** with hero `h1` as LCP element. Cookie consent defer (`5bb02e2`) was the largest single LCP win.
