# PM Structure — Regional Pricing SEO Plan

**Run:** 14 (Phase 13)  
**Site:** https://www.pmstructure.com  
**Status:** Implemented 2026-06-10

## Goals

1. Regional pricing must not block SSR or crawlability (Run 2).
2. No duplicate indexable URLs from `?currency=`, `?region=`, or similar params.
3. Checkout, enrollment, and payment completion routes stay `noindex,nofollow`.
4. Legal policy, FAQs, and `pricing-policy.json` stay aligned for humans and AI crawlers.
5. No `Offer` schema with volatile regional prices until legal approves static values.

## Architecture (current)

| Layer | File | SEO behavior |
|-------|------|----------------|
| SSR shell | `RegionGate.tsx` | Renders children immediately; modal is non-blocking |
| Region state | `RegionContext.tsx` | `isReady` defaults `true`; global fallback until stored region loads |
| Pricing display | `useRegionalOffering`, `RegionalPrice` | Client-hydrated; not in canonical URL |
| Catalogue | `data/regional-catalogue.json` | Source of regional matrix (55 offerings, 6 regions) |
| Canonical | `lib/canonical.ts` | Strips `currency`, `region`, `regionId`, `gcc`, etc. |
| Indexing | `lib/indexing-metadata.ts` | `/checkout`, `/enroll` patterns → noindex |
| Legal | `/legal/regional-pricing`, `/legal/pricing-disclaimers` | Indexable policy pages |
| AI feed | `public/pricing-policy.json` | Generated on prebuild |
| Compliance UI | `PricingComplianceNote` | On FAQ, certs, membership, compare |

## Canonical & query parameters

**Stripped from canonical URLs** (`STRIPPED_QUERY_PARAM_KEYS`):

- UTM / ads: `utm_*`, `gclid`, `fbclid`, `msclkid`, `ref`, `source`
- UI state: `tab`, `view`, `offering`, `session`, `session_id`
- **Regional (Run 14):** `currency`, `region`, `regionId`, `gcc`, `gccCountry`, `country`, `residence`, `billing`

**Rule:** Indexable pages always canonicalize to path-only URLs on `https://www.pmstructure.com`.

## Indexing matrix (pricing surfaces)

| Route | Index | Sitemap | Notes |
|-------|-------|---------|-------|
| `/certifications/*` | yes | yes | Prices hydrate client-side |
| `/membership` | yes | yes | Regional membership amounts |
| `/pmp-*` pathway pages | yes | yes | Pricing note blocks, no live Offer schema |
| `/checkout` | **no** | no | `robots: noindex,nofollow` |
| `/checkout/success`, `/cancel` | **no** | no | Completion pages |
| `/certifications/*/…/enroll` | **no** | no | Pattern in `NOINDEX_PATH_PATTERNS` |
| `/legal/regional-pricing` | yes | yes | Policy authority page |

## Schema rules (Offer)

- **Do not** emit `Offer` or `AggregateOffer` with regional list prices in JSON-LD.
- **Do not** invent `price`, `priceCurrency`, or sale end dates on `Course` schema.
- **OK:** `Course` + `provider` → Organization; pricing explained in visible HTML + legal pages.
- **Future:** Static global reference price in schema only after legal sign-off.

Documented in [`PMSTRUCTURE_SCHEMA_MATRIX.md`](PMSTRUCTURE_SCHEMA_MATRIX.md).

## FAQ & answer surfaces

- Pricing cluster in `/faq` (tab: Pricing & membership)
- PMP 2026 pricing FAQs in `pmp2026` cluster
- `/answers/how-does-regional-pricing-work-for-pmp`
- `public/faq.json`, `public/pmp-faq.json`, `public/pricing-policy.json`

## Validation

```bash
npm run seo:regional-pricing-check   # Run 14 guard
npm run seo:check                    # includes regional check
npm run build -w @pms/frontend       # regenerates pricing-policy.json
```

**Manual checks**

- [ ] View source on `/certifications/pmp` — body HTML present before hydration
- [ ] `?currency=AED` on homepage — canonical still `https://www.pmstructure.com/`
- [ ] Checkout and enroll routes show `noindex` in metadata
- [ ] Region modal does not replace page body with loading text

## Related docs

- [`PMSTRUCTURE_INDEXING_MATRIX.md`](PMSTRUCTURE_INDEXING_MATRIX.md)
- [`PMSTRUCTURE_SCHEMA_MATRIX.md`](PMSTRUCTURE_SCHEMA_MATRIX.md)
- [`PMSTRUCTURE_VALIDATION_SCRIPTS_PLAN.md`](PMSTRUCTURE_VALIDATION_SCRIPTS_PLAN.md)

## Run 14 checklist

- [x] RegionGate non-blocking SSR
- [x] Currency/region query params stripped from canonical keys
- [x] Checkout / enroll noindex confirmed
- [x] Regional pricing FAQ expansion
- [x] `pricing-policy.json` aligned with legal URLs
- [x] `REGIONAL_PRICING_SEO_PLAN.md` created
- [x] `seo:regional-pricing-check` script
