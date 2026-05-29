# Site content editor runbook

> **Canonical copy:** [plan.md](../../plan.md) — Appendix B.

## Access

1. Open dashboard (Website mode).
2. Sidebar → **Website pages** → select page.
3. Home uses `/dashboard/site-system/home` (dedicated editor).

## Draft vs publish

| Action | Effect |
|--------|--------|
| **Save draft** | Writes to Supabase; `is_published` stays false for that key (or draft row updated) |
| **Publish** | Sets `is_published = true` — public site reads this version |
| **Preview** | Home: opens site with `?homePreview=1` — does not require publish |

Public site only loads **published** rows (except preview mode).

## Field keys (current)

| Key | Editor | Public consumer |
|-----|--------|-----------------|
| `home_page_config` | Home CMS (`/dashboard/site-system/home`) | `useHomePageConfig()` |
| `certifications_hub_config` | Certifications hub editor | `Certifications.tsx` |
| `certifications_registry` | Seed / future registry editor | Hub listing filter |
| `services_page_config` | Services editor | `PMService.tsx` |
| `store_catalog` | Store catalog editor | `StoreContent` |
| `community_page_config` | Generic page editor (Phase 5) | `Community.tsx` |
| `membership_page_config` | Generic page editor (Phase 5) | `Membership.tsx` |
| `about_page_config` | Generic page editor (Phase 5) | `About.tsx` |
| `newsletter_hub_config` | Seed (articles remain file-based) | `Newsletter` hero |
| `global_content` | Generic flat text editor | `useWebsiteData()` — **legacy SEO snippets only** |

### `global_content` vs per-page documents

- **`global_content`** — flat string map merged into `useWebsiteData().get('hero_badge')` style lookups. Use only for cross-page SEO snippets (hero badge, frameworks title, etc.).
- **Per-page `field_key` documents** — structured JSON validated by `@pms/site-content` schemas. Each page editor saves one document; public pages load via `usePublishedSiteDocument(FIELD_KEYS.…)`.

Do not duplicate the same copy in both planes. Prefer structured per-page keys for page-specific content.

## Home preview

1. Edit in Home CMS.
2. Click **Preview** — iframe loads public site with preview flag.
3. Changes postMessage to iframe without publish.
4. Close preview to clear localStorage preview blob.

## Verification after publish

1. Open live URL in incognito.
2. Hard refresh.
3. Confirm change visible.
4. Run `npm run build -w @pms/frontend` before merging CMS PRs.

## Known issues (audit 2026-05-29)

- Primary hero button always opens registration modal; `primaryLink` in Home CMS is ignored until T-021 ships.
- Certifications / Services / Store hero fields in generic editor do not update public pages yet.
