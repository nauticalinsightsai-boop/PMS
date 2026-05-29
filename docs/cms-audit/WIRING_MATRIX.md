# CMS wiring matrix

> **Canonical copy:** [plan.md](../../plan.md) — Appendix A. Update both when wiring changes.

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Wired to published Supabase data |
| ⚠️ | Partially wired (fallbacks / mixed sources) |
| ❌ | Not wired — hardcoded or wrong source |
| 🔧 | Dashboard field exists but frontend ignores it |

## Matrix

| Page | Route | Dashboard editor | `home_page_config` | `global_content` | Hardcoded source |
|------|-------|------------------|--------------------|------------------|------------------|
| Home | `/` | HomeCmsEditor + global | ⚠️ Hero/CTA partial; primary link bug | ⚠️ Badge, frameworks, membership titles | Stats, families, featured default, testimonials |
| Certifications | `/certifications` | WebsiteDataEditor | ❌ | 🔧 `certifications_*` unused | `siteData`, `FAMILY_FEATURED_CERT_IDS` |
| Cert detail | `/certifications/[id]` | — | ❌ | ❌ | `siteData` + `regional-catalogue` |
| Services | `/pm-service` | WebsiteDataEditor | ❌ | 🔧 `pm_service_*` unused | `PMService.tsx` services array |
| Community | `/community` | WebsiteDataEditor | ❌ | ⚠️ Hero + mentorship | Feature cards, stats |
| Store | `/community?view=store` | WebsiteDataEditor (store slug) | ❌ | 🔧 `store_*` unused | `Store.tsx` products |
| Newsletter | `/newsletter` | `/dashboard/booking-crm/newsletter` | ⚠️ | ❌ | `newsletter_posts_registry` (published) merged with `newsletterArticles.ts` seed |
| Posts (CMS) | `/blog` | `/dashboard/cms/posts` | ❌ | ❌ | `cms_posts_registry` (published) merged with `blogArticles.ts` seed |
| Topics (CMS) | — | `/dashboard/cms/topics` | ❌ | ❌ | `cms_topics_registry` (topic labels on blog) |
| Blogs editor | — | `/dashboard/booking-crm/blogs` | ❌ | ❌ | same as `cms_posts_registry` |
| Subscribers | — | `/dashboard/booking-crm/newsletter/subscribers` | — | — | `form_submissions` via dashboard API |
| Membership | `/membership` | WebsiteDataEditor | ❌ | ⚠️ Hero + benefits titles | `membershipTiers`, pricing libs |
| About | `/about` | WebsiteDataEditor | ❌ | ⚠️ Mission + story | Layout/images |
| FAQ | `/faq` | WebsiteDataEditor | ❌ | ✅ Title, subtitle, badge | `content/faq/data.ts` body |
| Contact | `/contact` | WebsiteDataEditor | ❌ | ✅ Title/subtitle | Form structure |
| Compare | `/certifications/compare` | WebsiteDataEditor | ❌ | ✅ Hero badge/title/subtitle | Compare lib + siteData |

## `global_content` keys used on frontend

| Key | Page(s) |
|-----|---------|
| `hero_badge`, `hero_title`, `hero_subtitle` | Home (fallback if home_page_config empty) |
| `cta_primary`, `cta_secondary` | Home (fallback) |
| `frameworks_title`, `frameworks_subtitle` | Home |
| `membership_title`, `membership_subtitle` | Home |
| `community_*` | Community |
| `community_mentorship_*` | Community |
| `membership_hero_*`, `membership_benefits_*` | Membership |
| `mission_*`, `story_*` | About |
| `contact_*` | Contact |
| `faq_title`, `faq_subtitle`, `faq_badge` | FAQ |
| `compare_badge`, `compare_title`, `compare_subtitle` | Compare |

## Dashboard-only keys (not read by frontend)

From `websitePageConfigs.ts` — saved to `global_content` but **not referenced in `frontend/`**:

- `certifications_badge`, `certifications_title`, `certifications_subtitle`, `certifications_list_*`
- `pm_service_badge`, `pm_service_title`, `pm_service_subtitle`
- `newsletter_badge`, `newsletter_title`, `newsletter_subtitle`
- `store_badge`, `store_title`, `store_subtitle`
- `compare_*`, `membership_hero_*` (partial — some membership keys used)

## Priority fixes

1. **P0:** Home primary CTA link (`T-020`, `T-021`)
2. **P1:** Wire or remove dead `websitePageConfigs` keys for certifications + services
3. **P1:** Home stats + featured pathways picker (Phase 1)
