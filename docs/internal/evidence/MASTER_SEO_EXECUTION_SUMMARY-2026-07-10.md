# Master SEO plan execution summary — 2026-07-10

## Shipped in code (deploy required for live 301s)

| Deliverable | Location |
|-------------|----------|
| 70 keyword SEO URL redirects + 3 aliases | `frontend/content/seo/keyword-redirect-map.ts` → `next.config.ts` |
| Indexation exclude | `REDIRECT_PATHS` via `getKeywordRedirectPathMap()` |
| CSV registries | `docs/internal/pmstructure-keyword-redirect-map.csv`, `pmstructure-ads-landing-registry.csv` |
| Keyword URL map merge | `docs/internal/pmstructure-keyword-url-map.csv` (Status=Redirect) |
| Architecture + OA-008 | `docs/internal/PMSTRUCTURE_KEYWORD_REDIRECT_ARCHITECTURE.md`, `evidence/OA-008-GEO-REDIRECTS-ALLOWED.md` |
| Lead popup | `frontend/components/seo/KeywordLeadPopup.tsx` in `PublicShell` |
| Hub SEO tweaks | mock exam + study plan H1/meta; `/topics` title; PMP secondary keywords |
| Visible breadcrumbs | Cert detail + `/certifications` hub |
| Validation | `seo:keyword-map-check` extended; `npm run seo:all` PASS |
| Baselines | `docs/internal/evidence/baselines-2026-07-10/` |
| Plan statuses | 522 completed / 209 cancelled / 0 pending in `pm_structure_master_seo_e3724eee.plan.md` |

## Flow

`SEO slug` → **301** → hub `?from=slug` → **KeywordLeadPopup** (form / WhatsApp / Calendly)

## Owner-gated (cancelled in todo list; checklist)

See `docs/internal/evidence/MASTER_SEO_OWNER_GATES-2026-07-10.md`:

- GSC / Bing / GA4 screenshots
- Social publish + ads flights
- Legal sign-off artifacts
- Screaming Frog full crawl import

## Next step for you

1. Deploy frontend so 301s go live.
2. Spot-check: `/online-pmp-course` → `/certifications/pmp?from=online-pmp-course` + popup.
3. Work through owner gates checklist with evidence attachments.
