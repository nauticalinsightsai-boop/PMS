# Keyword SEO URL redirect architecture

**Decision:** All 70 Keyword Plan SEO URLs consolidate into existing hubs via permanent 301 redirects (except `/pmp-mock-exam`, which stays live). No new commercial landing pages.

## Flow

1. User hits a workbook SEO slug (e.g. `/online-pmp-course`).
2. Next.js `redirects()` in `frontend/next.config.ts` issues a **301** to the hub with `?from={slug}`.
3. Hub pages mount `KeywordLeadPopup` (`frontend/components/seo/KeywordLeadPopup.tsx`).
4. Popup offers: details form → `/api/interactions`, WhatsApp mentor link, Calendly schedule.

## Registry

| Artifact | Path |
|----------|------|
| Source of truth (code) | `frontend/content/seo/keyword-redirect-map.ts` |
| CSV export | `docs/internal/pmstructure-keyword-redirect-map.csv` |
| Indexation | `REDIRECT_PATHS` in `frontend/content/indexation/strategy.ts` (excludes sources from sitemap) |

## Destination hubs

| Hub | Role |
|-----|------|
| `/certifications/pmp` | PMP commercial / geo / fees / guides |
| `/certifications` | Course hub (`/all-courses` + adjacent courses) |
| `/pm-service` | Corporate / workshops (canonical; `/project-management-services` 301s here) |
| `/pmp-mock-exam` | KEEP + receives `/pmp-practice-questions` |
| `/pmp-study-plan-2026` | Receives `/pmp-study-plan` |

## Ads / legacy aliases (extra 301s)

| Source | Destination |
|--------|-------------|
| `/pmp-certification-training` | `/certifications/pmp` |
| `/corporate-training` | `/pm-service` |
| `/project-management-services` | `/pm-service` |

Registry: `docs/internal/pmstructure-ads-landing-registry.csv`

## OA-008

Geo **page builds** cancelled. Geo **slug 301s** to hubs are allowed. See `docs/internal/evidence/OA-008-GEO-REDIRECTS-ALLOWED.md`.

## Popup trigger

- Any hub with `?from=` matching a keyword slug.
- `/pmp-mock-exam` also opens on direct visits (lead magnet).
- Frequency cap: once per session + 7-day dismiss TTL in `localStorage`.
