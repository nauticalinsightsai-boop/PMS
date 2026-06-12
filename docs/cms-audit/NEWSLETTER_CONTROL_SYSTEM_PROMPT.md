# Website Tab (1) — Newsletter Control System Prompt

Use this prompt when building, reviewing, or extending the **Website** dashboard tab on PM Structure. There is **one** content system for email + public newsletter pages — not separate blog, article, or generic “posts” products.

---

## 0. Scope

| In scope | Out of scope |
|----------|----------------|
| Media library (images for newsletters + site) | Booking CRM tab |
| Newsletter list, create, edit, publish | Social Media Management tab |
| Newsletter subscribers | Legacy `cms_posts_registry` UI |
| | Mock blog editors, “articles”, “insights” |

**Tab:** Website (first header tab)  
**Default route:** `/dashboard/site-system/media-library`  
**Canonical data key:** `newsletter_posts_registry` (`FIELD_KEYS.NEWSLETTER_POSTS_REGISTRY`)

---

## 1. Navigation (Website tab only)

Sidebar must show **exactly**:

1. **Media library** → `/dashboard/site-system/media-library`
2. **Newsletter** → `/dashboard/site-system/newsletter`
   - **Subscribers** → `/dashboard/site-system/newsletter/subscribers`

No other Website sidebar items. Do not add “Posts”, “Topics”, “Blogs Editor”, “Articles”, or “Insights”.

---

## 2. Terminology (mandatory)

| Use | Never use in UI or docs for this system |
|-----|----------------------------------------|
| Newsletter | Blog, blogs, article, articles, post (standalone), insights |
| Newsletters (plural) | Blog posts, articles list |
| New Newsletter | New Article, New Post |
| Edit Newsletter | Edit Article, Edit Post |
| Newsletter Name | Article title (unless quoting SEO field labels) |
| Subscribers | Members list (for this screen) |
| Topics (comma-separated tags on a newsletter) | Categories (unless user-facing marketing copy elsewhere) |

Internal code may keep `NewsletterPost` types — **user-facing strings must say “newsletter”.**

Public URLs: `/newsletter/[slug]` only (not `/blog/...`).

---

## 3. Routes

| Action | Dashboard route |
|--------|-----------------|
| List | `/dashboard/site-system/newsletter` |
| Create | `/dashboard/site-system/newsletter/new` |
| Edit | `/dashboard/site-system/newsletter/[id]/edit` |
| Subscribers | `/dashboard/site-system/newsletter/subscribers` |
| Media | `/dashboard/site-system/media-library` |

**Redirects (permanent):** All legacy paths redirect to the canonical newsletter routes:

- `/dashboard/cms/posts`, `/dashboard/cms/topics`
- `/dashboard/site-system/blogs` and `/dashboard/booking-crm/blogs*`
- `/dashboard/booking-crm/newsletter*` → `/dashboard/site-system/newsletter*`
- `/dashboard/newsletter` → `/dashboard/site-system/newsletter`

Constants: `dashboard/frontend/constants/websiteCmsPaths.ts`

---

## 4. Data model

**Registry:** `newsletter_posts_registry` (version 1, array of newsletters)

Per newsletter fields (see `@pms/site-content/newsletter-posts`):

- `id`, `title`, `slug`, `description`
- `topics[]` (string tags, comma-entered in editor)
- `status`: `draft` | `published` | `scheduled`
- `featuredImageUrl`, SEO fields (`metaTitle`, `metaDescription`)
- Rich content blocks as defined in schema
- `publishedAt`, `updatedAt`

**Subscribers:** separate table/API (not the posts registry).

**Media:** Supabase `site-media` bucket via `/admin/api/cms/media`.

---

## 5. UI flows

### 5.1 Newsletter list

- Search: “Search newsletters by name…”
- Primary CTA: **New Newsletter**
- Table columns: #, Name, Slug, Topics, Status, Actions (edit, view public, delete)
- Empty state: “No newsletters found” / “Create a new newsletter”
- Delete confirm: “Delete newsletter?”

### 5.2 Newsletter editor

- Breadcrumb: Dashboard → Newsletter → New | Edit
- H1: **New Newsletter** | **Edit Newsletter**
- Save: **Create Newsletter** | **Update Newsletter**
- Sections: Basic Information, Feature Image, SEO Details, Content
- Field label: **Newsletter Name** (not “title” in UI)
- Public preview link: `{SITE_URL}/newsletter/{slug}`

### 5.3 Subscribers

- Breadcrumb parent: **Newsletter**
- Manage opt-in list; link back to **Newsletter** list

### 5.4 Media library

- Copy references **newsletters** (not blog posts) when describing usage

---

## 6. API & auth

- Load/save draft + publish: `GET/POST /admin/api/cms/website-data` with `fieldKey: newsletter_posts_registry`
- Media: `/admin/api/cms/media`
- All mutations: `requireDashboardMutationAuth`

---

## 7. Duplicates policy

**Single source of truth:** `NewsletterPostsList` + `NewsletterPostEditor` + `useNewsletterPosts`.

Do not ship parallel UIs:

- ~~`PostsList` / `PostEditor` for `/dashboard/cms/posts`~~
- ~~`/dashboard/site-system/blogs`~~
- ~~`BlogEditor` mock~~
- ~~`NewsletterManagement` stats hub~~

If legacy `cms_posts_registry` data exists, migrate into `newsletter_posts_registry` once — do not expose two editors.

---

## 8. Acceptance checklist

- [ ] Website sidebar shows only Media library + Newsletter (+ Subscribers)
- [ ] No “blog”, “article”, or standalone “post” in dashboard UI strings
- [ ] Legacy URLs redirect to newsletter routes
- [ ] Public pages only under `/newsletter/[slug]`
- [ ] One registry key in Supabase for published content
- [ ] Feature images pickable from Media library

---

## 9. Copy-paste contractor prompt

```
Build/maintain the PM Structure Website tab (tab 1) as a single Newsletter Control System.

Navigation: Media library; Newsletter (with Subscribers sub-item only).
Routes under /dashboard/site-system/newsletter/* and media-library.
Data: newsletter_posts_registry in website_data; public site /newsletter/[slug].

Rules:
- User-facing copy must always say "newsletter" / "newsletters" — never blog, article, post, or insights.
- No duplicate editors (remove cms/posts, blogs, mock BlogEditor from nav and product).
- Newsletter list + editor + subscribers are the only content workflows in this tab.
- Use websiteCmsPaths.ts for all dashboard links.
- Legacy paths redirect to canonical newsletter routes.

Match existing components: NewsletterPostsList, NewsletterPostEditor, NewsletterSubscribers, MediaLibraryPage.
Auth via dashboard session; publish via cms/website-data API.
```

See also: [MEDIA_LIBRARY_CONTROL_SYSTEM_PROMPT.md](./MEDIA_LIBRARY_CONTROL_SYSTEM_PROMPT.md) for centralized media hub spec.
