# PM Structure. Indexing Matrix

Canonical host: `https://pmstructure.com` (`PMS_SITE_URL`)

Implementation: `frontend/lib/indexing-metadata.ts`, `frontend/lib/site-metadata.ts`, `frontend/app/sitemap.ts`, `frontend/app/robots.ts`

## Matrix columns

`Route | Route type | Index | Sitemap | Canonical | Robots meta | Title source | H1 | Schema | Notes`

---

## Core marketing

| Route | Type | Index | Sitemap | Canonical | Robots | Notes |
|-------|------|-------|---------|-----------|--------|-------|
| `/` | marketing | yes | yes | `/` | index,follow | Homepage |
| `/about` | marketing | yes | yes | `/about` | index,follow | |
| `/contact` | marketing | yes | yes | `/contact` | index,follow | |
| `/faq` | marketing | yes | yes | `/faq` | index,follow | FAQPage schema |
| `/pmp-faq` | AEO | yes | yes | `/pmp-faq` | index,follow | FAQPage (PMP only) |
| `/answers` | AEO | yes | yes | `/answers` | index,follow | WebPage index |
| `/answers/[slug]` | AEO | yes | yes | `/answers/{slug}` | index,follow | published only |
| `/topics` | AEO | yes | yes | `/topics` | index,follow | CollectionPage |
| `/topics/[slug]` | AEO | yes | yes | `/topics/{slug}` | index,follow | published hubs only |
| `/membership` | marketing | yes | yes | `/membership` | index,follow | |
| `/community` | marketing | yes | yes | `/community` | index,follow | |
| `/pm-service` | marketing | yes | yes | `/pm-service` | index,follow | |
| `/certifications` | marketing | yes | yes | `/certifications` | index,follow | |
| `/certifications/compare` | marketing | yes | yes | `/certifications/compare` | index,follow | |

## Certifications (27)

| Route | Type | Index | Sitemap | Canonical | Robots | Notes |
|-------|------|-------|---------|-----------|--------|-------|
| `/certifications/[id]` | product | yes | yes | `/certifications/{id}` | index,follow | Course schema |

## Content

| Route | Type | Index | Sitemap | Canonical | Robots | Notes |
|-------|------|-------|---------|-----------|--------|-------|
| `/blog` | content | yes | yes | `/blog` | index,follow | |
| `/blog/[slug]` | content | yes | yes | `/blog/{slug}` | index,follow | published only |
| `/newsletter` | content | yes | yes | `/newsletter` | index,follow | |
| `/newsletter/[slug]` | content | yes | yes | `/newsletter/{slug}` | index,follow | published only |

## Legal

| Route | Type | Index | Sitemap | Canonical | Robots | Notes |
|-------|------|-------|---------|-----------|--------|-------|
| `/legal` | legal | yes | yes | `/legal` | index,follow | |
| `/legal/terms` | legal | yes | yes | `/legal/terms` | index,follow | |
| `/legal/privacy` | legal | yes | yes | `/legal/privacy` | index,follow | |
| `/legal/privacy/[region]` | legal | yes | yes | path | index,follow | |
| `/legal/privacy/gcc` | legal | yes | yes | `/legal/privacy/gcc` | index,follow | |
| `/legal/privacy/gcc/[country]` | legal | yes | yes | path | index,follow | |
| `/legal/cookies` | legal | yes | yes | `/legal/cookies` | index,follow | |
| `/legal/services` | legal | yes | yes | `/legal/services` | index,follow | |
| `/legal/pricing-disclaimers` | legal | yes | yes | `/legal/pricing-disclaimers` | index,follow | |
| `/legal/[slug]` | legal | yes | yes | `/legal/{slug}` | index,follow | 13 dynamic slugs |

## Portals

| Route | Type | Index | Sitemap | Canonical | Robots | Notes |
|-------|------|-------|---------|-----------|--------|-------|
| `/go/[channel]` | portal | conditional | if published | `/go/{channel}` | per page | draft = noindex |

## Noindex utility

| Route | Type | Index | Sitemap | Canonical | Robots | Notes |
|-------|------|-------|---------|-----------|--------|-------|
| `/certifications/*/enroll` | payment | no | no | path | noindex,nofollow | |
| `/certifications/*/enroll/success` | completion | no | no | path | noindex,nofollow | |
| `/checkout` | payment | no | no | `/checkout` | noindex,nofollow | |
| `/checkout/cancel` | payment | no | no | `/checkout/cancel` | noindex,nofollow | |
| `/checkout/success` | payment | no | no | `/checkout/success` | noindex,nofollow | |
| `/compare` | redirect | no | no |: |: | → `/certifications/compare` |
| `/store` | redirect | no | no |: |: | → `/community` |

## Private

| Route | Type | Index | Sitemap | Robots | Notes |
|-------|------|-------|---------|--------|-------|
| `/admin/**` | private | no | no | noindex,nofollow | robots.txt disallow |
| `/api/**` | system | no | no |: | robots.txt disallow |

## Planned (Run 9+)

| Route | Index when live | Sitemap when live |
|-------|-----------------|-------------------|
| `/pmp`, `/pmp-2026`, `/pmp-*` | yes | yes |
| `/answers/*` | yes | yes |
| `/topics/*` | yes | yes |

---

**Robots.txt:** Disallow `/api/`, `/admin/` only. Checkout uses meta noindex.

**Sitemap:** `buildSitemapEntry()` asserts indexable paths.

**Cross-ref:** [`PMSTRUCTURE_ROUTE_INVENTORY.md`](PMSTRUCTURE_ROUTE_INVENTORY.md)