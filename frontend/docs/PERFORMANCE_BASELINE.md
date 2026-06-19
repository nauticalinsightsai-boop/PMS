# Performance baseline

Recorded during site-wide performance implementation. Re-run `npm run build` in `frontend/` and compare First Load JS.

## Before optimization (reference snapshot)

| Route | First Load JS (approx.) |
|-------|-------------------------|
| `/certifications` | 439 kB |
| `/membership` | 351 kB |
| `/about` | 341 kB |
| `/community` | 345 kB |
| Shared | 103 kB |

## After optimization (2026-06-19 build)

| Route | Page JS | First Load JS |
|-------|---------|---------------|
| Shared | — | **103 kB** |
| `/` | 23 kB | **309 kB** |
| `/certifications` | 10.4 kB | 372 kB |
| `/certifications/pmp` | 44.1 kB | 482 kB |
| `/membership` | 9.66 kB | 341 kB |
| `/newsletter` | 15 kB | 257 kB |
| `/community` | 8.7 kB | 333 kB |
| `/about` | 4.44 kB | 329 kB |
| `/contact` | 10.6 kB | 166 kB |
| `/faq` | 13.1 kB | 251 kB |
| `/certifications/compare` | 9.31 kB | 218 kB |
| `/pm-service` | 11.9 kB | 384 kB |
| `/store` | 331 B | 104 kB (redirect shell) |
| `/blog` | 5.1 kB | 228 kB |
| `/membership/checkout` | 4.94 kB | 141 kB |

Notable deltas vs pre-optimization snapshot: certifications hub **−67 kB** First Load JS (439 → 372 kB); membership **−10 kB**; about **−12 kB**.

## Changes applied

- Selective `website_data` fetch with in-flight dedupe cache
- Server prefetch of page CMS configs + `global_content` for legacy pages
- Home: LazyMotion, single hero form, lazy below-fold sections, testimonials LazyWhenVisible
- Marketing pages: LazyMotion + `m.*`; certifications/membership below-fold LazyWhenVisible
- Dynamic imports: ResponsiveSnapScroll, Calendly button (certifications), Stripe checkout panels, community store tab
- `certification-index.ts` lean re-exports instead of `import * as siteData` on hot paths
- PublicShell: idle-deferred conversion widgets
- `optimizePackageImports` for lucide-react and motion
- GA `lazyOnload`, Montserrat weights trimmed to 400/600/700/800
- Newsletter articles `React.cache()` for SSR dedupe
- Thin `embed-types.ts` for Calendly UTM params (avoids pulling full embed-url for types)

## Lighthouse (localhost:3051 production build, 2026-06-19)

| Route | Perf score | LCP | TBT | Total weight |
|-------|------------|-----|-----|--------------|
| `/` | 71 | 6.2s | 244ms | 715 KB |
| `/certifications` | 67 | 6.5s | 379ms | 701 KB |
| `/certifications/pmp` | 70 | 6.7s | 261ms | 752 KB |
| `/newsletter` | 64 | 6.9s | 188ms | 890 KB |

Raw reports: `frontend/docs/lighthouse/*.json`

## Automated verification

```bash
npm run test:performance   # CMS + content-preservation smoke (vitest)
npm run build && npm run start:perf
npm run smoke:routes       # HTTP smoke on marketing routes
npm run lighthouse:sample  # Lighthouse on heavy routes
```

## Manual QA checklist

- [x] Home CMS preview (`?homePreview=1`), single hero form, pathways, deferred widgets — smoke tests + route HTTP
- [x] Certifications hub + `/certifications/pmp` hero form and flagship sections — smoke tests + route HTTP
- [x] Newsletter + blog articles; batched CMS fetches — unit tests + route HTTP
- [x] About, membership, community, contact, compare, FAQ — route HTTP smoke
- [x] `/community?view=store` store tab — route HTTP smoke
- [x] Membership + store checkout Stripe flows — dynamic import smoke test (manual Stripe QA still recommended)
- [x] Site renders with defaults when Supabase env unset — unit tests

## Lighthouse

Run locally on heavy routes when comparing LCP/TBT:

```bash
npx lighthouse https://localhost:3000 --only-categories=performance --view
```
