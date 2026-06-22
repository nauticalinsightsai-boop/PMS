# Phase 3 — Homepage realtime subscriber audit (2026-06-22)

## Homepage mount tree

- `app/(site)/layout.tsx` → `PublicShell` — **no** `useWebsiteDataRealtime`
- `app/(site)/page.tsx` → `Home` → `useHomePageConfig` — **only** realtime on `/` (gated: `enabled={isPreview}`)

## Other `useWebsiteDataRealtime` call sites (not on `/`)

| Hook / module | Routes |
|---------------|--------|
| `useBlogPosts` | `/blog` |
| `useNewsletterArticles` | newsletter |
| `useNewsletterPageData` | `/newsletter` |
| `useNewsletterHubConfig` | newsletter hub |
| `useNewsletterCategories` | newsletter |
| `usePublishedSiteDocument` | various CMS pages |
| `WebsiteDataService.useWebsiteData` | **unused** on marketing shell |

## ipapi.co

- `RegionContext` idle-defers `fetchIpRegionHint`
- `region-geo.ts` adds 24h `sessionStorage` cache (`pms_ip_region_hint_v1`)
- **No** `preconnect` to ipapi.co (per plan p3-05)

## Result

Public homepage no longer opens Supabase Realtime WebSocket unless `?homePreview=1`.
