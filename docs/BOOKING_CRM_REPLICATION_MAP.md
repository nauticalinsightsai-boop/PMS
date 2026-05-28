# Booking CRM replication map (PMS)

Recreate the X1 Booking CRM experience on PMS with feature parity: CTA management, slug management, interactions/sheets, redirects, and `/go/{channel}` publication.

## Canonical URLs

| Surface | URL |
|--------|-----|
| CTA Management | `/dashboard/booking-crm/cta` |
| Sheets records | `/dashboard/booking-crm/interactions/sheets` |
| Public portal | `http://localhost:3000/go/{channel}` |
| Channel API | `/api/channel-landing-pages` (dashboard frontend — local route) |

**Redirect helpers:** `dashboard/frontend/lib/dashboard/bookingCrmRedirects.ts`  
**Legacy alias:** `/dashboard/members-revenue/*` → `/dashboard/booking-crm/*`

## Architecture

| Layer | Path | Role |
|-------|------|------|
| Shared package | `packages/booking-crm` | Types, repository, PMS portal template v2, JSON read/write |
| Marketing | `frontend/app/go/[channel]` | SSR public portals |
| Dashboard UI | `dashboard/frontend/components/booking-crm/` | CTACollection, ChannelLandingEditor, InteractionsSheetsRecords |
| Dashboard API | `dashboard/frontend/app/api/channel-landing-pages` | GET/POST mutations (auth guard) |
| Dashboard backend | `dashboard/backend/app/api/interactions/sheets` | Google Sheets + Supabase fallback |
| Data | `data/channel-landing-pages.json`, `data/channel-context-briefs.json` | Repo-root JSON |

## Implementation status (May 2026)

| Area | Status |
|------|--------|
| Phase A routing | Done |
| `@pms/booking-crm` package | Done |
| PMS template v2 migration | Done (`scripts/migrate-channel-landing-pages-to-pms-template.ts`) |
| `/go/[channel]` + portal UI | Done |
| PortalFeaturedPathways / chips | Done |
| `frontend/app/sitemap.ts` | Done |
| CTA Management UI | Done (`CTACollection`) |
| Sheets records UI | Done (`InteractionsSheetsRecords`) |
| Dual-source sheets API | Done (X1 routes ported to dashboard backend) |
| Phase 7 OPT-PORTAL | Done | [PORTAL_CONVERSION_PLAN.md](./PORTAL_CONVERSION_PLAN.md) |

## Environment

| Variable | Purpose |
|----------|---------|
| `GOOGLE_SHEETS_*` | Sheets primary source (X1 contract) |
| `NEXT_PUBLIC_SUPABASE_URL` | Dashboard auth + `form_submissions` fallback |
| `NEXT_PUBLIC_MARKETING_SITE_URL` | Share URLs from dashboard (`http://localhost:3000`) |

## X1 source index

| Responsibility | X1 path | PMS path |
|----------------|---------|----------|
| CTACollection | `src/page-modules/admin/CTACollection.tsx` | `dashboard/frontend/components/booking-crm/CTACollection.tsx` |
| Channel editor | `ChannelLandingEditor.tsx` | `dashboard/frontend/components/booking-crm/ChannelLandingEditor.tsx` |
| Sheets UI | `InteractionsSheetsRecords.tsx` | `dashboard/frontend/components/booking-crm/InteractionsSheetsRecords.tsx` |
| Channel API | `app/api/channel-landing-pages/route.ts` | `dashboard/frontend/app/api/channel-landing-pages/route.ts` |
| Public go | `app/go/[slug]/page.tsx` | `frontend/app/go/[channel]/page.tsx` |
| Repository | `src/lib/channel-landing-pages/repository.ts` | `packages/booking-crm/src/channel-landing-pages/repository.ts` |

See also: [booking-crm-platform-catalog.md](./booking-crm-platform-catalog.md)

## Validation checklist

- [ ] `/dashboard/booking-crm/cta` loads CTA manager
- [ ] `/dashboard/booking-crm/interactions/sheets` loads sheets table
- [ ] `http://localhost:3000/go/linkedin` renders published portal
- [ ] `http://localhost:3000/go/linkedin?preview=1` shows draft when unpublished
- [ ] POST `/api/channel-landing-pages` requires auth
- [ ] Legacy `/dashboard/members-revenue/cta` redirects
