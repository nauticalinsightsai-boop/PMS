# Site content editor runbook

> **Architecture:** [PM_STRUCTURE_CMS_ARCHITECTURE.md](./PM_STRUCTURE_CMS_ARCHITECTURE.md)  
> **Wiring status:** [WIRING_MATRIX.md](./WIRING_MATRIX.md)  
> **Canonical plan:** [plan.md](../../plan.md) — Appendix B.

## Access

1. Open dashboard at **http://localhost:5174/dashboard** (not the marketing app on 3050).
2. Log in (Supabase user recommended for draft CMS; demo login may show empty overview if Supabase is unset).
3. Use **Admin Controls** mode for website pages, or **Overview** for Posts / Topics / Newsletter.

### Sidebar (Overview — all modes)

| Item | Route |
|------|-------|
| Dashboard | `/dashboard` |
| Posts | `/dashboard/cms/posts` |
| Topics | `/dashboard/cms/topics` |
| Newsletter | `/dashboard/booking-crm/newsletter` |
| ↳ Subscribers | `/dashboard/booking-crm/newsletter/subscribers` |
| ↳ Blogs Editor | `/dashboard/booking-crm/blogs` |

### Website pages (Admin Controls mode)

Sidebar → **Website pages** → select page. Home uses `/dashboard/site-system/home` (dedicated editor). Other pages: `/dashboard/site-system/pages/[slug]`.

## Draft vs publish

| Action | Effect |
|--------|--------|
| **Save draft** | Writes to Supabase; `is_published` stays false for that key |
| **Publish** | Sets `is_published = true` — public site reads this version |
| **Preview** | Home: `?homePreview=1`; certs: `?sitePreview=1&previewKey=...` — does not require publish |

Public site only loads **published** rows (except preview mode).

## Field keys (current)

### `@pms/site-content` (structured pages)

| Key | Editor | Public consumer |
|-----|--------|-----------------|
| `home_page_config` | Home CMS (`/dashboard/site-system/home`) | `useHomePageConfig()` |
| `certifications_hub_config` | Certifications hub editor | `Certifications.tsx` |
| `certifications_registry` | Certifications hub editor | Hub + `CertificationDetail.tsx` |
| `services_page_config` | Services editor | `PMService.tsx` |
| `store_catalog` | Store catalog editor | `StoreContent` |
| `community_page_config` | Community editor | `Community.tsx` |
| `membership_page_config` | Membership editor | `Membership.tsx` |
| `about_page_config` | About editor | `About.tsx` |
| `newsletter_hub_config` | Seed (hero); articles split — see below | `Newsletter` hero |
| `global_content` | Website data editor | `useWebsiteData()` — **legacy SEO snippets only** |
| `site_settings` | Settings | various |

### Dashboard registries (CMS)

| Key | Editor | Public consumer |
|-----|--------|-----------------|
| `cms_topics_registry` | `/dashboard/cms/topics` | not wired yet |
| `cms_posts_registry` | `/dashboard/cms/posts`, `/dashboard/booking-crm/blogs` | not wired yet |
| `newsletter_posts_registry` | `/dashboard/booking-crm/newsletter` | `/newsletter` via `getPublishedNewsletterArticles()` |

### `global_content` vs per-page documents

- **`global_content`** — flat string map for cross-page SEO snippets (`hero_badge`, etc.). Do not store full page copy here.
- **Per-page `field_key` documents** — structured JSON validated by `@pms/site-content`. Public pages load via `usePublishedSiteDocument(FIELD_KEYS.…)`.

Do not duplicate the same copy in both planes.

## Home preview

1. Edit in Home CMS.
2. Click **Preview** — iframe loads public site with preview flag.
3. Changes postMessage to iframe without publish.
4. Close preview to clear localStorage preview blob (`pms:site-preview:{field_key}`).

## Verification after publish

1. Open live URL in incognito.
2. Hard refresh.
3. Confirm change visible.
4. Run `npm run build -w @pms/frontend` before merging CMS PRs.

## Supabase setup

If dashboard shows **CMS data unavailable**:

1. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in root `.env`.
2. Restart dev server (`npm run dev:dashboard` or `npm run dev`).
3. Run seeds via `/dashboard/migrate` if tables are empty.

## Known issues

- Primary hero button may open registration modal; `primaryLink` in Home CMS may be ignored.
- Certifications / Services / Store hero fields in generic editor may not update public pages yet.
- Newsletter articles: dashboard CMS and file-based `newsletterArticles.ts` are not merged on the public site yet.
- Use **NavLinkButton** for table edit actions — `Button` + `render={<Link />}` does not navigate (Base UI limitation).
