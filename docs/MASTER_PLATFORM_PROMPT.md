# MASTER PROMPT: Full Platform — Personal Brand CMS + Dashboard + Public Site

Validated against the PM Structure (`pmstructure.com`) monorepo. Adapt branding: **SMA.OS** in generic specs = your dashboard product name; this repo uses **PM Structure** (public) + **PMS.OS** (dashboard footer).

Use as a contractor brief, v0/Cursor seed, or replication guide. Combine with companion specs in §19.

---

## 0. Monorepo architecture (PM Structure pattern)

```
npm run dev  →  dev gateway :3000
  ├── Marketing site     frontend/          :3050   (public pages + /admin/* bundled)
  ├── Public API         backend/           :3001   (/api/* except admin)
  ├── Dashboard UI       dashboard/frontend :5174   (/admin via basePath)
  └── Dashboard API      dashboard/backend  :3002   (/admin/api/*)
```

| Rule | Detail |
|------|--------|
| Single env | Repo root `.env.local` only — all apps load via `scripts/load-monorepo-env.cjs` |
| Admin URL | Production: `https://your-domain.com/admin/*` (`NEXT_PUBLIC_BASE_PATH=/admin`) |
| Admin bundle | `scripts/sync-admin-into-frontend.mjs` re-exports dashboard routes into `frontend/app/admin/` for single-domain deploy |
| Workspaces | `@pms/frontend`, `@pms/backend`, `@pms/dashboard-frontend`, `@pms/dashboard-backend`, `@pms/ui`, `@pms/site-content`, `@pms/booking-crm`, `@pms/regional-catalogue` |

---

## 1. Platform goals

| Goal | Implementation |
|------|----------------|
| Fast public site | CMS in **Supabase `public.website_data`** (JSONB field keys); optional `data/*.json` + seed scripts for dev |
| Single admin dashboard | One shell: top tabs + left sidebar + main content |
| Draft / publish CMS | **Save Draft**, **Publish**, **Preview**, reorder — envelope `{ draft, published }` per field key |
| Lead capture | All forms → Supabase `form_submissions` → optional **Google Sheets** append (async) |
| Search visibility | **Sitemap + robots + canonical + JSON-LD** live; **IndexNow** via deploy script; **Google Indexing API** = optional future |
| Secure admin | `dashboard_one` password auth + **SMS OTP (Twilio)** and/or **email OTP** on new device/IP |
| Regional commerce | Catalogue per region, Stripe checkout, verification logs (PM Structure extension) |

---

## 2. Tech stack

- **Framework:** Next.js 15 App Router, React 19, TypeScript, Tailwind 4
- **Database:** Supabase Postgres
  - **`public`:** `website_data`, `form_submissions`, `regions`, `orders`, `verification_logs`, `course_offerings`, …
  - **`dashboard_one`:** auth credentials, OTP, audit log (exposed in Supabase API settings)
  - **`storage`:** `site-media` bucket
  - *(Not separate `home`/`discover`/`portfolio` schemas — CMS is JSONB in `website_data`)*
- **Auth:** HMAC session cookie `gw_dashboard_session` + `localStorage.auth_api_token` Bearer; **not** Supabase Auth for admin login
- **Email:** Resend **or** SMTP (SMTP wins if both set) — reset, OTP email, login alerts
- **SMS:** Twilio — login step-up only (`TWILIO_*`)
- **Payments:** Stripe webhooks → engagement bookings → `form_submissions`
- **Sheets:** Google Sheets API (service account JWT via `fetch`, append-only)
- **Analytics:** GA4 (`NEXT_PUBLIC_GA_MEASUREMENT_ID`), consent-gated
- **Deploy:** Vercel (marketing + optional split admin projects) or unified single app

---

## 3. Public website pages

### 3A. Generic personal-brand spec (template)

| Page | Route | CMS module |
|------|-------|------------|
| Home | `/` | `home_page_config` |
| Discover | `/discover` | profile / credentials *(template route)* |
| Engagement | `/engagement` | services / scopes *(template route)* |
| Portfolio | `/portfolio` + sub-routes | projects / ventures / consultancies |
| Media | `/media` | speaking appearances |
| Insights | `/insights/*` | blog streams |
| Contact | `/contact` | → interactions pipeline |
| Knowledge | `/knowledge` | courses catalog |
| Legal / FAQ | `/legal`, `/faq` | legal docs + FAQ |

### 3B. PM Structure actual routes (reference implementation)

| Area | Routes |
|------|--------|
| Core | `/`, `/about`, `/contact`, `/faq`, `/membership`, `/community`, `/pm-service` |
| Certifications | `/certifications`, `/certifications/compare`, `/certifications/[id]`, enroll flows (noindex) |
| Content | `/blog`, `/blog/[slug]`, `/newsletter`, `/newsletter/[slug]` |
| SEO hubs | `/answers`, `/answers/[slug]` (~35 pages), `/topics`, `/topics/[slug]` (~26 hubs) |
| PMP cluster | `/pmp`, `/pmp-faq`, `/pmp-exam-2026`, 20+ authority/course/service pages |
| Legal | `/legal`, `/legal/privacy`, regional privacy variants, `/legal/[slug]` |
| Portals | `/go`, `/go/[channel]` (~41 channel landing pages) |
| Checkout | `/checkout`, `/checkout/success`, `/checkout/cancel` (noindex) |
| Feeds | `/rss.xml`, `/sitemap.xml`, `/robots.txt` |
| AI visibility | `/ai-profile.json`, `/answers.json`, `/pmp-2026.json`, etc. (`npm run seo:generate-ai-files`) |

**Note:** `/discover`, `/engagement`, `/portfolio` as **standalone public URLs** are **not** in PM Structure — equivalent content lives in **home sections** + `/certifications` + `/pm-service` + site-system CMS editors.

---

## 4. Dashboard shell

### Top header (~75px)

- Logo + product name (`.OS` accent optional)
- **3 section tabs:**

| # | Label (desktop) | Mobile | Default route |
|---|-----------------|--------|---------------|
| 1 | Social Media Management | Social | `/dashboard/social-media-management/schedule-calendar` |
| 2 | Booking CRM | Booking | `/dashboard/booking-crm/cta` |
| 3 | Admin Controls | Admin | `/dashboard` or `/dashboard/site-system/home` |

- Right: Theme · **View Site** · Avatar · Logout

### Left sidebar per tab

**Tab 1 — Social Media Management**

| Item | Route |
|------|-------|
| Topic Planner | `/dashboard/social-media-management/topic-planner` |
| Schedule Calendar *(default)* | `/dashboard/social-media-management/schedule-calendar` |
| Link Ups | `/dashboard/social-media-management/link-ups` |

**Tab 2 — Booking CRM**

| Item | Route | Notes |
|------|-------|-------|
| CTA Management | `/dashboard/booking-crm/cta` | Channel landing editor |
| Interaction Inbox | `/dashboard/booking-crm/interactions/inbox` | Supabase source of truth |
| Sheets Records | `/dashboard/booking-crm/interactions/sheets` | Google Sheet mirror |
| Consultations | `/dashboard/booking-crm/consultations` | |
| Bookings | `/dashboard/booking-crm/bookings` | |
| Verification logs | `/dashboard/booking-crm/verification-logs` | Regional ID verification |
| Scholarship review | `/dashboard/booking-crm/scholarship-review` | |
| Newsletter | `/dashboard/booking-crm/newsletter` | + subscribers, blogs editor |
| Account region | `/dashboard/account/region` | |

**Legacy redirects:** `/dashboard/members-revenue/*` → `/dashboard/booking-crm/*`; `/dashboard/booking-crm/interactions` → sheets page.

**Tab 3 — Admin Controls**

| Section | Items |
|---------|-------|
| Overview | Dashboard · Media library · Posts · Topics · Newsletter |
| Website pages | One editor per public page (`/dashboard/site-system/pages/[slug]`) |
| Dedicated | Home (`/dashboard/site-system/home`), SEO, Security, Analytics, Settings |
| System | Data Migration (`/dashboard/migrate`) |

**CMS button bar (editable pages):** Save Draft · Publish · Preview · Drag reorder  
**Pattern:** `POST /api/cms/website-data` with `intent: saveDraft | publish` and `fieldKey`.

---

## 5. Tab 1 — Social Media Management

**Default:** Schedule Calendar — week kanban (Post row ~42% + Generation row ~58%), Day/Week/Month, filters, Activity Feed + Next 7 Days sidebar (320px xl+), capacity settings, brand chips (PMS/NI/INT/GFW).

**Also:** Topic Planner, Link Ups (placeholders OK initially).

**UI tokens:** `gw-accent-primary`, `gw-bg-primary`, flat `bg-background` on social tab (no nested gradient shell).

---

## 6. Tab 2 — Booking CRM + Google Sheets

### 6A. Interaction Inbox

- **Route:** `/dashboard/booking-crm/interactions/inbox`
- **API:** `GET /api/interactions` (admin Bearer)
- **Columns:** Date · Source · Subject · Email · Payload · Sheets badge · Retry
- **Filters:** source · sheets status · search · date range · group by · export CSV/XLSX
- **Realtime:** `useInteractionBroadcast` on channel `interaction-events:{CHANNEL_ID}`

### 6B. Sheets Records

- **Route:** `/dashboard/booking-crm/interactions/sheets`
- **API:** `GET /api/interactions/sheets`, export routes
- **Features:** auto-refresh 45s · stats by source · detail modal · open spreadsheet

### 6C. Pipeline

```
POST /api/interactions  (public, marketing backend :3001 or /api via gateway)
  → rate limit + honeypot (website, company)
  → Zod: source | subject | email | payload
  → INSERT public.form_submissions
  → fire-and-forget: Google Sheets append (7 cols)
  → UPDATE sheets_synced_at | sheets_sync_error | sheets_sync_attempts
  → pingInteractionSubscribers() Broadcast refresh
```

**Google Sheet columns A–G:**  
`created_at | source | subject | email | payload_json | metadata_json | submission_id`

**Sources (4):** `contact` · `subscription` · `meeting_booking` · `documentation_request`

**Engagement bridge:** Stripe/Calendly confirmed booking → `logEngagementMeetingInteraction()` with `metadata.booking_id` dedupe.

**Retry:** `POST /api/interactions/:id/retry-sheets`

**RLS:** enabled on `form_submissions`; **no** anon SELECT — service role + admin API only.

---

## 7. Tab 3 — Admin Controls (CMS)

### CMS storage model

- Table: `public.website_data` — rows keyed by `field_key`, JSONB `draft` + `published`
- Keys in `@pms/site-content` — e.g. `home_page_config`, `global_content`, `cms_posts_registry`, `cms_topics_registry`, `newsletter_posts_registry`, per-page configs

### API routes (dashboard backend, `/admin/api/*` in prod)

| Method | Route | Purpose |
|--------|-------|---------|
| GET/POST | `/api/cms/website-data` | List / saveDraft / publish by `fieldKey` |
| GET/POST/DELETE | `/api/cms/media` | `site-media` bucket |
| GET/POST | `/api/channel-landing-pages` | Portal JSON for `/go/*` |
| GET/POST | `/api/interactions/*` | Inbox + sheets |
| GET | `/api/admin/consultations`, `scholarship-review`, `verification-logs`, `orders` | CRM queues |

**Auth guard:** `requireDashboardMutationAuth` on all mutators.

### Media Library

- Route: `/dashboard/site-system/media-library`
- Upload to Supabase Storage `site-media`
- Link assets to CMS entities (page, section, sourceType, sourceId)
- Replace / delete / alt text

### Insights / Blog / Newsletter

- Posts: `/dashboard/cms/posts` → `cms_posts_registry` → public `/blog/[slug]`
- Topics: `/dashboard/cms/topics` → topic hubs
- Newsletter: `/dashboard/booking-crm/newsletter` → `/newsletter/[slug]`

---

## 8. Authentication & security

### Login (`/admin/login`)

1. Email + password → `POST /admin/api/auth/login`
2. `NEXT_PUBLIC_AUTH_USE_API_LOGIN=true` (use `isApiLoginEnabled()` dev fallback)
3. Allowlist: `DASHBOARD_ADMIN_EMAILS` + `constants/admin-users.ts`
4. Password: `dashboard_one.user_credentials` (scrypt)
5. New device/IP → SMS OTP (Twilio) and/or email OTP
6. Success → `gw_dashboard_session` httpOnly cookie + `auth_api_token` in localStorage
7. Redirect: `window.location.assign` to `/admin/dashboard` (full page)

### Env

```env
AUTH_SESSION_SECRET=
AUTH_BOOTSTRAP_SECRET=
DASHBOARD_ADMIN_EMAILS=
NEXT_PUBLIC_AUTH_USE_API_LOGIN=true
AUTH_ALLOWED_ORIGINS=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_MESSAGING_SERVICE_SID=
RESEND_API_KEY=
```

See `docs/auth/AUTH_SYSTEM.md` for full route list.

---

## 9. Regional catalogue & checkout (PM Structure extension)

| Feature | Route/API |
|---------|-----------|
| Regional matrix | `@pms/regional-catalogue`, `npm run import:regional` |
| Public checkout | `/checkout`, `POST /api/checkout/create` |
| Stripe webhook | `/api/webhooks/stripe` |
| Dashboard | `/dashboard/account/region` |

---

## 10. Channel landing portals (`/go/*`)

- Package: `@pms/booking-crm`
- Dashboard editor: `/dashboard/booking-crm/cta` + `/cta/[channelKey]`
- Forms on portals → `meeting_booking` interactions

---

## 11. SEO & indexing

### Live

- Dynamic `/sitemap.xml`, `/robots.txt`
- Per-page canonical, OG/Twitter, JSON-LD
- `npm run seo:all` validation suite
- `.github/workflows/seo-release.yml`
- `npm run seo:generate-ai-files`

### IndexNow (optional)

```env
INDEXNOW_KEY=your32charkey
```

Host `public/{INDEXNOW_KEY}.txt`, run `scripts/seo/indexnow.mjs`.

### Not in code (optional future)

- Google Indexing API
- Split sitemap index
- Live `POST /api/seo/index` webhook

---

## 12. Data seeding & Supabase

```bash
npm run db:migrate
npm run db:apply-auth
npm run seed:site-content
npm run env:link
```

**Migrate UI:** `/dashboard/migrate`

**Expose schema:** Supabase Dashboard → API → add `dashboard_one`

---

## 13. Env vars master list

See `.env.example` in repo root for the canonical template.

---

## 14. What NOT to build

- Public `/signup`
- TOTP authenticator (SMS/email OTP only)
- Bidirectional Google Sheets sync
- `postgres_changes` realtime on `form_submissions` (use Broadcast)
- Separate CMS REST per post/topic (use `website_data` registries)
- Social API auto-posting (calendar = planning unless extended)

---

## 15. Companion specs

| Doc | Topic |
|-----|-------|
| `docs/interactions/INTERACTIONS_SETUP.md` | Interactions + Sheets + SMTP pings |
| `docs/auth/AUTH_SYSTEM.md` | Login, OTP, bootstrap |
| `docs/BOOKING_CRM_REPLICATION_MAP.md` | CTA + portals |
| `docs/PMSTRUCTURE_ROUTE_INVENTORY.md` | All public routes |
| `docs/PMSTRUCTURE_SEO_AEO_GEO_AI_VISIBILITY_MASTER_PLAN.md` | SEO program |

For deep UI rebuilds, also use separate prompts for **Schedule Calendar** and **Google Sheets pipeline** (7-column inbox + mirror).

---

## 16. Spec corrections (common mistakes)

| Wrong | Correct in this repo |
|-------|----------------------|
| `SMA.OS` only | **PM Structure** public + **PMS.OS** dashboard |
| `/dashboard/admin-controls` | `/dashboard/site-system/*`, `/dashboard/cms/*` |
| `/dashboard/booking-crm/cta-management` | `/dashboard/booking-crm/cta` |
| `/api/home-config` | `/api/cms/website-data` + `fieldKey` |
| Multi-schema CMS DB | `public.website_data` JSONB |
| Google Indexing on every publish | SEO scripts + optional IndexNow |
| Inbox at sheets URL only | Inbox = `/dashboard/booking-crm/interactions/inbox` |
