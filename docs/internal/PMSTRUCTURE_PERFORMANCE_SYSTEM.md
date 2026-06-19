# PM Structure — Performance, PageSpeed, Image, Cache, CDN, and Hosting System

## Purpose

This document defines PM Structure's performance optimization system.

This is an internal technical SEO and UX document. Do not publish it as a public page.

**Related internal docs:**

- Performance budget: [`PMSTRUCTURE_PERFORMANCE_BUDGET.md`](PMSTRUCTURE_PERFORMANCE_BUDGET.md)
- Analytics / conversion (B03): [`PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md`](PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md)
- On-page SEO / alt text (B06): [`PMSTRUCTURE_ARCHITECTURE_ON_PAGE_SEO.md`](PMSTRUCTURE_ARCHITECTURE_ON_PAGE_SEO.md)

**B08 audit artifacts:**

- [`pmstructure-performance-audit.csv`](pmstructure-performance-audit.csv)
- [`pmstructure-image-optimization-inventory.csv`](pmstructure-image-optimization-inventory.csv)
- [`pmstructure-third-party-script-inventory.csv`](pmstructure-third-party-script-inventory.csv)

**Audit command:** `npm run audit:performance-assets`

---

## Priority Funnel

PMP 2026 Readiness Pathway

## Priority Pages

- `/`
- `/certifications`
- `/certifications/pmp`
- `/certifications/compare`
- `/topics/pmp-exam-2026`
- `/answers/is-the-pmp-exam-changing-in-2026`
- `/faq`
- `/community`
- `/membership`
- `/pm-service`

---

## Stack Summary (B08)

| Item | Status |
|------|--------|
| Framework | Next.js 15 App Router (`frontend/app/(site)/`) |
| Package manager | npm workspaces |
| WordPress | **No** — T-073 Smush and T-080 WP Fastest Cache **N/A** |
| Primary hosting | **Vercel** ([`frontend/vercel.json`](../frontend/vercel.json), [`docs/DEPLOYMENT_VERCEL.md`](../docs/DEPLOYMENT_VERCEL.md)) |
| Alternate / env | Railway referenced for some prod env vars |
| CDN | **Vercel Edge CDN** when deployed on Vercel (host-managed) |
| Compression | **Brotli/Gzip automatic** on Vercel for text assets |
| Cache headers | `_next/static/*` immutable (platform default); optional long-cache for versioned `/brand/*` and `/images/marketing/*` in [`frontend/next.config.ts`](../frontend/next.config.ts) |

---

## Core Web Vitals Targets

- LCP ≤ 2.5 seconds
- INP ≤ 200 milliseconds
- CLS ≤ 0.1

Internal stretch target:

- Aim for about 1.9 seconds LCP/page load where practical on priority landing pages.

## Lighthouse / PageSpeed Targets (stretch)

- Mobile Performance: 85+
- Desktop Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

Do not chase perfect scores at the expense of conversion, tracking, or design.

---

## Optimization Order

1. LCP image and hero section (brand icon in roadmap form mark).
2. Image compression and responsive sizing.
3. CLS from images, fonts, cards, forms, and embeds.
4. JavaScript and third-party scripts.
5. Font loading.
6. Cache headers.
7. Compression.
8. CDN/static asset delivery.
9. Hosting/server response time.

---

## Image Rules

- Use WebP/AVIF where practical (`frontend/public/images/marketing/` pipeline via `scripts/generate-marketing-images.mjs`).
- Brand form icons: WebP + optimized PNG at 128px max (`scripts/optimize-brand-icons.mjs`).
- Resize images to display dimensions.
- Set width and height (or `next/image`).
- Lazy-load below-fold images.
- **Do not lazy-load the LCP form brand mark** (`BrandIconMark` with `priority`).
- Keep meaningful alt text (B06).
- Do not use unlicensed external images.

Original oversized icons backed up as `pms-icon.source.png` / `pms-icon-dark.source.png` in `frontend/public/brand/`.

---

## LCP Notes (Priority Funnel)

Homepage and `/certifications/pmp` LCP candidates:

- Hero **text** (H1) — no hero photo on homepage.
- **`BrandIconMark`** in roadmap form header — uses `priority`; optimized WebP in B08.

---

## Font Rules

- Montserrat via `next/font/google` in [`packages/ui/src/fonts.ts`](../packages/ui/src/fonts.ts).
- Weights **400, 600, 700, 800, 900** retained — `font-extrabold` (800) and `font-black` (900) used in UI.
- `display: 'swap'` configured.

---

## Third-Party Scripts

See [`pmstructure-third-party-script-inventory.csv`](pmstructure-third-party-script-inventory.csv).

- GA4: consent-gated, single loader (B03) — do not duplicate.
- Calendly: on-demand on booking click only.
- Stripe: checkout pages only.
- Support chat: dynamic import, user-opened.

No GTM. No preconnect to GA before consent.

---

## Cache Rules

| Asset type | Policy |
|------------|--------|
| `_next/static/*` | Long-cache immutable (Vercel default) |
| `/brand/*`, `/images/marketing/*` | `public, max-age=31536000, immutable` when version query or deploy hash applies |
| HTML / SSR pages | Dynamic — do not publicly cache personalized or auth pages |
| `/checkout`, `/membership/checkout`, `/admin`, `/api/*` | **Never** publicly cache |

---

## Compression Rules

Use Brotli/Gzip for HTML, CSS, JS, JSON, SVG, TXT on Vercel.

Do not compress already-compressed media (jpg, png, webp, avif, woff2, mp4).

---

## CDN Rules

Use Vercel Edge CDN when deployed on Vercel.

Do not migrate CDN/hosting without owner approval.

Document purge: new deploy invalidates; bump `BRAND_ICON_ASSET_VERSION` for brand icon cache bust.

---

## WordPress Plugin Rule

**N/A** — PM Structure is Next.js, not WordPress.

- T-073 Smush → use `scripts/generate-marketing-images.mjs`, `scripts/optimize-brand-icons.mjs`, `next/image`.
- T-080 WP Fastest Cache → use Vercel/platform cache + Next config headers.

---

## Known P1/P2 Costs (Document, Not Fixed in B08)

- Full client `PublicShell` hydration.
- `motion/react` on homepage hero.
- Channel portal logo PNGs under `images/logo/` (250–580 KB) — `/go/*` only.
- PublicShell SSR refactor — P2 owner decision.

---

## Manual QA — Lighthouse / PageSpeed

**Before data:** First baseline created during B08 — populate [`pmstructure-performance-audit.csv`](pmstructure-performance-audit.csv) after live run.

### Steps

1. Deploy or run production build locally (`npm run build -w @pms/frontend` then `npm run start -w @pms/frontend`).
2. Open Chrome DevTools → Lighthouse.
3. Test **mobile** and **desktop** for:
   - `https://pmstructure.com/`
   - `https://pmstructure.com/certifications/pmp`
   - `https://pmstructure.com/topics/pmp-exam-2026`
   - `https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026`
   - `https://pmstructure.com/faq`
4. Record Performance, LCP, INP/TBT, CLS in audit CSV.
5. Verify: menu, roadmap form, Calendly booking click, GA consent + event (B03 checklist).

### Also use

- Chrome DevTools Performance tab
- Network tab (transfer size, cache headers)
- WebPageTest (optional, post-deploy)

---

## Owner / Hosting Actions Required

1. Confirm Montserrat weight trim — **800/900 in use; keep all weights**
2. Approve brand icon WebP format (implemented B08 with PNG fallback)
3. Run live Lighthouse post-deploy and paste scores into audit CSV
4. Confirm production host (Vercel vs Railway) for CDN/cache verification
5. Channel logo PNG compression — separate batch if `/go/*` portals need speed work

---

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026
