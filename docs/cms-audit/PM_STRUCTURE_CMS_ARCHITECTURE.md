# PM Structure — dashboard-controlled CMS architecture

Handoff document for extending the **PM Structure** monorepo (`@pms/*`). Describes how public pages, the admin dashboard, and Supabase storage connect today, and what to build next.

**Related:** [EDITOR_RUNBOOK.md](./EDITOR_RUNBOOK.md) · [WIRING_MATRIX.md](./WIRING_MATRIX.md) · [plan.md](../../plan.md)

---

## Repo layout

| App | Path | Dev port | Role |
|-----|------|----------|------|
| Marketing site | `frontend/` (`@pms/frontend`) | **3000** (gateway) or **3050** direct | Public routes under `app/(site)/` |
| Marketing API | `backend/` (`@pms/backend`) | **3001** | Checkout, regions, public `form_submissions` |
| Dashboard UI | `dashboard/frontend/` (`@pms/dashboard-frontend`) | **5174** | All `/dashboard/**` CMS + CRM |
| Dashboard API | `dashboard/backend/` (`@pms/dashboard-backend`) | **3002** | Interactions, admin mutations (rewritten from dashboard as `/api/*`) |
| Shared content | `packages/site-content/` | — | Zod schemas, seeds, `FIELD_KEYS` |
| Shared UI | `packages/ui/` | — | Tailwind globals, Button, etc. |
| Booking CRM | `packages/booking-crm/` | — | CTA, channel landing (`/go/*`) |

**Dev:** `npm run dev` from repo root (gateway + all apps). Dashboard only: `npm run dev:dashboard`.

**Important:** `/dashboard` lives on **5174**, not the marketing app. Do not expect CMS on port 3050.

---

## Core idea

- **One dashboard editor per public page** (or content domain).
- **Draft vs published:** Supabase table `website_data`:
  - `field_key` (string, unique)
  - `content` (jsonb)
  - `is_published` (boolean)
  - `updated_at`
- Dashboard **Save Draft** → upsert row, `is_published: false`.
- Dashboard **Publish** → set `is_published: true` for that `field_key`.
- Public site reads **published rows only** via `usePublishedSiteDocument()` (marketing `frontend/`).
- Dashboard reads **draft** via `WebsiteDataService.getData('draft')` (`dashboard/frontend/services/WebsiteDataService.ts`).

**Current gap:** CMS writes go **client → Supabase** (anon key + RLS), not per-resource REST APIs like `GET /api/home-config?view=published`. Booking CRM uses `dashboard/backend` APIs. When extending, either keep this pattern or migrate domain-by-domain to authenticated API routes.

---

## Public page ↔ dashboard ↔ storage

| Public route | What users see | Dashboard editor | Storage `field_key` / source | Public consumer |
|---|---|---|---|---|
| `/` | Home hero, sections, featured certs, CTA | `/dashboard/site-system/home` | `home_page_config` | `Home.tsx` + `useHomePageConfig()` |
| `/certifications` | Cert hub, filters, listings | `/dashboard/site-system/pages/certifications` | `certifications_hub_config`, `certifications_registry` | `Certifications.tsx` |
| `/certifications/[id]` | Pathway detail | (registry + hub) | `certifications_registry` | `CertificationDetail.tsx` |
| `/certifications/compare` | Compare tool | `/dashboard/site-system/pages/compare` | page config / seeds | Compare page |
| `/pm-service` | Services copy | `/dashboard/site-system/pages/pm-service` | `services_page_config` | `PMService.tsx` |
| `/community` | Community hub | `/dashboard/site-system/pages/community` | `community_page_config` | `Community.tsx` |
| `/store` or `/community?view=store` | Resource store | `/dashboard/site-system/pages/store` | `store_catalog` | `StoreContent` |
| `/about` | About | `/dashboard/site-system/pages/about` | `about_page_config` | `About.tsx` |
| `/membership` | Membership | `/dashboard/site-system/pages/membership` | `membership_page_config` | `Membership.tsx` |
| `/faq` | FAQ | `/dashboard/site-system/pages/faq` | page document or seed | FAQ page |
| `/contact` | Contact | `/dashboard/site-system/pages/contact` | page document or seed | Contact page |
| `/newsletter` | Newsletter hub | `/dashboard/booking-crm/newsletter` | `newsletter_hub_config` + `newsletter_posts_registry` + file seed | `getPublishedNewsletterArticles()` |
| `/newsletter/[slug]` | Article | `/dashboard/booking-crm/newsletter/[id]/edit` | same | article detail page |
| `/legal/*` | Legal | — | `frontend/content/legal/` (file-based) | legal routes |
| `/go/[slug]` | Channel portals | marketing app | `data/channel-landing-pages.json` | `frontend/app/go/` |
| Site snippets | SEO badges | `/dashboard/site-system/website-data` | `global_content` | `useWebsiteData()` — legacy only |
| Settings | Nav, footer | `/dashboard/site-system/settings` | `site_settings` | various |
| **Posts** | (future blog) | `/dashboard/cms/posts` | `cms_posts_registry` | not wired to marketing yet |
| **Topics** | taxonomy | `/dashboard/cms/topics` | `cms_topics_registry` | not wired yet |
| **Blogs & Insights** | same posts | `/dashboard/booking-crm/blogs` | `cms_posts_registry` | not wired yet |
| **Subscribers** | signup list | `/dashboard/booking-crm/newsletter/subscribers` | `form_submissions` via dashboard API | public `/api/interactions` |
| **CTAs** | sitewide CTAs | `/dashboard/booking-crm/cta` | `@pms/booking-crm` | marketing site |
| **SEO** | meta health | `/dashboard/site-system/seo` | partial | `robots.ts`, page meta |
| **Seed / sync** | migrate seeds | `/dashboard/migrate` | `@pms/site-content/seeds` | read-only |

**Sidebar:** `dashboard/frontend/constants/dashboardRoutes.ts` + `constants/publicSitePages.ts`.

**Overview nav (always visible):** Dashboard · Posts · Topics · Newsletter (Subscribers, Blogs Editor).

**Website mode:** **Website pages** from `PUBLIC_SITE_PAGES`. **System:** Security, SEO, Analytics, Settings, Data Migration.

---

## Data flow

```
Dashboard editor (dashboard/frontend)
  → useSiteDocumentDraft / useNewsletterPosts / useCmsPosts / useCmsTopics
  → WebsiteDataService.saveDraft(field_key, content)
  → WebsiteDataService.publish(field_key)
  → Supabase public.website_data

Marketing page (frontend)
  → usePublishedSiteDocument(FIELD_KEYS.*)
  → WebsiteDataService.getData('published')
  → Zod parse via @pms/site-content getSchemaForFieldKey()
```

### Preview (Home + Certifications)

1. Save draft → `localStorage` key `pms:site-preview:{field_key}`
2. Open public URL with `?sitePreview=1&previewKey=...` or `?homePreview=1`
3. Public hook reads localStorage before published fetch

### Write

1. Edit in dashboard state.
2. **Save Draft** → `WebsiteDataService.saveDraft`.
3. **Publish** → `saveDraft` then `publish(field_key)`.
4. (Future) revalidate / IndexNow after publish.

### Read rules

- **Public:** published only; no dashboard draft; no localStorage except explicit preview query params.
- **Dashboard:** `getData('draft')`; auto-seed from `@pms/site-content/seeds` when row missing.

---

## `@pms/site-content` field keys

`packages/site-content/src/keys.ts`:

| Key | Purpose |
|-----|---------|
| `home_page_config` | Home CMS |
| `certifications_hub_config` | Cert hub UI |
| `certifications_registry` | Cert listings / detail |
| `services_page_config` | PM Service page |
| `store_catalog` | Resource store |
| `community_page_config` | Community |
| `membership_page_config` | Membership |
| `about_page_config` | About |
| `newsletter_hub_config` | Newsletter hero |
| `global_content` | Legacy flat SEO snippets only |
| `site_settings` | Site-wide settings |

**Dashboard-only registries** (`dashboard/frontend/lib/`):

| Key | Purpose |
|-----|---------|
| `cms_topics_registry` | Topics CMS |
| `cms_posts_registry` | Posts + Blogs editor |
| `newsletter_posts_registry` | Newsletter articles CMS |

Each structured page has a **Zod schema** in `packages/site-content/src/*.ts`.

---

## Dashboard UX

- **Mode toggles:** Publisher | Booking CRM | Admin Controls (`DashboardModeContext`).
- **Sidebar:** collapsible, hover-expand (`DashboardLayout.tsx`).
- **Editors:** Save Draft, Publish, toasts, preview where implemented.
- **Topics-style CMS:** Posts, Topics, Newsletter — list + create/edit (Basic Info, Feature Image, SEO, Content).
- **Navigation:** use `NavLinkButton` for edit links — **not** `Button render={<Link />}` (Base UI breaks link navigation).

---

## Auth & environment

```env
# Marketing
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# Dashboard
DASHBOARD_BACKEND_URL=http://localhost:3002
NEXT_PUBLIC_MARKETING_SITE_URL=http://localhost:3000

# Supabase (required for CMS)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Optional demo admin (dev)
# NEXT_PUBLIC_ALLOW_DEMO_LOGIN=true
```

**RLS:** `website_data` published rows readable by anon; drafts need authenticated Supabase session. Demo login may not load draft CMS rows — use real Supabase auth for full editing.

---

## Extension checklist

1. ~~Wire `newsletter_posts_registry` to public `/newsletter`~~ (merged with file seed via `frontend/lib/newsletter/articles.ts`).
2. Complete FAQ / Contact / Compare editors → public wiring.
3. Implement or remove stub routes (`/dashboard/site-system/portfolio`, `media`, `insights` — currently redirect/placeholder).
4. Optional: CMS API layer on `dashboard/backend` with `{ intent: 'saveDraft' | 'publish' }`.
5. Enhance `/dashboard/migrate` with published counts per `field_key`.
6. SEO revalidate hook after `WebsiteDataService.publish`.
7. Tests: `@pms/site-content` schemas, slug helpers.

---

## Pitfalls

- Do not bind public pages to dashboard draft or localStorage (except `?previewKey=`).
- One `field_key` per page/domain — no mega JSON blob.
- `global_content` is legacy; do not duplicate structured page copy there.
- Newsletter content is split across file seed, dashboard registry, and hub config — consolidate when wiring public site.
- Home primary CTA may ignore `primaryLink` until fixed (see EDITOR_RUNBOOK).

---

## Key file reference

| Concern | Path |
|---------|------|
| Sidebar routes | `dashboard/frontend/constants/dashboardRoutes.ts` |
| Public page list | `dashboard/frontend/constants/publicSitePages.ts` |
| Field keys + schemas | `packages/site-content/src/` |
| CMS read/write | `dashboard/frontend/services/WebsiteDataService.ts` |
| Public published read | `frontend/lib/usePublishedSiteDocument.ts` |
| Home editor | `dashboard/frontend/components/pages/admin/HomeCmsEditor.tsx` |
| Posts / Topics CMS | `dashboard/frontend/components/pages/admin/cms/` |
| Newsletter CMS | `dashboard/frontend/components/pages/admin/Newsletter*.tsx` |
| Nav link buttons | `dashboard/frontend/components/ui/nav-link-button.tsx` |
| Supabase schema | `supabase/migrations/20240517000000_initial_schema.sql` |

---

## Stack summary

**Next.js 15 App Router monorepo, TypeScript, Tailwind, Supabase `website_data` JSON documents keyed by `field_key`, shared `@pms/site-content` schemas, separate dashboard on port 5174, marketing on 3000, draft/publish via `WebsiteDataService`, public reads published only via `usePublishedSiteDocument`.**
