# Platform Audit Master Plan (v3 — complete)

> **Site Content Platform (CMS):** [`plan.md`](../plan.md) — living implementation plan for marketing CMS (`@pms/site-content`, Site System editors).

> **Repo mirror** of Cursor plan [`platform_audit_master_fbbe4d03.plan.md`](file:///c:/Users/Sh3ik/.cursor/plans/platform_audit_master_fbbe4d03.plan.md) — **989 checkboxes**, **968 todos** in plan frontmatter.  
> **Scorecard:** `docs/audits/PLATFORM_AUDIT_SCORECARD.md` (create in Phase 0)

---

## Plan meta-audit (v1 → v2 gaps addressed)

| Gap in v1 | Resolution in v2 |
|-----------|------------------|
| Phase 1 bundled as P1.001–010 | Split into **12 separate command todos** (P1.001–P1.012) |
| A5 collapsed to one line | **16 explicit Stripe/Calendly/Sheets tasks** (A5.001–A5.016) |
| B3/B4 vague ranges | **Every website route + dashboard page** listed (B3.x, B4.x) |
| C1.016–042 as range | **42 per-channel todos** (c1-portal-{slug}, c1-preview-{slug}) |
| C2 per-cert as range | **27 certs × 4 region passes** (c2-pathway, c2-global, c2-india, c2-pakistan, c2-gcc) |
| E1.003–055 as range | **55 per-offering todos** (e1-{offeringId}) |
| E2.001–042 as range | **42 per-channel data todos** (e2-{slug}) |
| D1.001–020 as range | **17 legal slugs** + privacy regional variants |
| Missing packages/regional-catalogue | **A1.016** + package workspace build |
| Missing gateway-only vs direct ports | **P0.005**, **B2.018** |
| Missing CRM queue pages | **B4.012–B4.018** (consultations, bookings, etc.) |
| Missing test file audit | **F3.001–F3.020** (each `*.test.ts`) |
| Missing migration audit | **A4.001–A4.004** (each SQL file) |
| Missing scorecard sign-off per segment | **SC.A1–SC.F6** (32 sign-offs) |
| Stripe webhook P0 buried | **F2.001** + **A2.006** + **DD.004** |
| Todos not 1:1 with checkboxes | **Every checkbox ID has matching Cursor todo id** |

---

## Deliverables

1. This document (`docs/PLATFORM_AUDIT_MASTER_PLAN.md`)
2. `docs/audits/PLATFORM_AUDIT_SCORECARD.md`
3. `docs/audits/{segment}-YYYY-MM-DD.md` deep-dive reports
4. Cursor plan frontmatter todos (synced from this doc via `node scripts/generate-audit-plan-todos.mjs` after Agent mode)

---

## Platform inventory

| Layer | Path | Count |
|-------|------|-------|
| Main website | `frontend/` | ~114 routes |
| Site API | `backend/app/api/` | 15 routes |
| Dashboard UI | `dashboard/frontend/app/` | ~38 routes |
| Dashboard API | `dashboard/backend/app/api/` | 12 routes |
| Channels | `packages/booking-crm` ALL_CHANNELS | **42** |
| Certifications | `frontend/data/siteData.ts` | **27** |
| Matrix offerings | `frontend/data/regional-catalogue.json` | **55** |
| Legal slugs | `frontend/constants/legal.ts` LEGAL_SLUGS | **17** |
| CMS pages | `dashboard/frontend/constants/publicSitePages.ts` | **11** |
| Placeholder dashboard pages | `PlaceholderPage` usage | **8** |
| Unit tests | `**/*.test.ts` | **20** |
| Migrations | `supabase/migrations/` | **4** |

**Dev ports:** 3000 gateway, 3050 site, 3001 API, 5174 dashboard, 3002 dash-api.

---

## Scorecard template

```markdown
## {Audit-ID}: {Name}
- Score: Pass | Warn | Fail
- Date / Auditor:
- Automated evidence:
- Manual evidence:
- Findings: (P0/P1/P2/P3)
- Fix backlog:
- Deep-dive: Y/N
```

---

## Phase 0 — Infrastructure

- [x] **P0.001** Create this file as repo mirror (done when approved)
- [x] **P0.002** Create `docs/audits/PLATFORM_AUDIT_SCORECARD.md`
- [x] **P0.003** Record git SHA, Node, npm versions
- [x] **P0.004** Env checklist template (Stripe, Supabase, Sheets, Calendly) — no secrets committed
- [x] **P0.005** Port map: 3000/3001/3002/3050/5174 + conflict resolution
- [x] **P0.006** Index link: PRE_LAUNCH_LEGAL_SEO, LEGAL_FAQ, PORTAL_CONVERSION, BOOKING_CRM_REPLICATION, REGIONAL_AVAILABILITY
- [x] **P0.007** Run `node scripts/generate-audit-plan-todos.mjs` → sync Cursor plan todos
- [x] **P0.008** Severity rubric P0–P3 + segment owners
- [x] **P0.009** Deep-dive report template in `docs/audits/`
- [x] **P0.010** Tracker labels/milestones for audit program

---

## Phase 1 — Automated gates (one checkbox per command)

- [x] **P1.001** `npm run build`
- [x] **P1.002** `npm run lint`
- [x] **P1.003** `npm run validate:regional`
- [x] **P1.004** `npm run qa:regional`
- [x] **P1.005** `npm run test:regional`
- [x] **P1.006** `npm run test:legal-seo`
- [x] **P1.007** `node scripts/legal-seo-check.mjs`
- [x] **P1.008** `npm run audit:images`
- [x] **P1.009** `npm run spot-check:checkout-api`
- [x] **P1.010** `npm run spot-check:india-pmp`
- [x] **P1.011** `npm run verify:regional-dev`
- [x] **P1.012** Update scorecard with all Phase 1 results

---

# PART A — Architecture and backend

## A1 — Monorepo structure (A1.001–A1.020)

- [x] **A1.001** Verify 6 workspaces in root package.json
- [x] **A1.002** Map duplicated logic: frontend vs dashboard vs packages
- [x] **A1.003** `@pms/booking-crm` single source for channel/portal
- [x] **A1.004** `@pms/ui` adoption vs local `components/ui`
- [x] **A1.005** `sheets-env.ts` dashboard frontend vs backend drift
- [x] **A1.006** `data/channel-landing-pages.json` ↔ `packages/booking-crm/data/`
- [x] **A1.007** `sync:portal-data` in deploy checklist
- [x] **A1.008** Regional JSON ↔ Supabase (`sync-regional-catalogue-to-supabase.mjs`)
- [x] **A1.009** `siteData.certifications[].id` ↔ matrix offeringIds
- [x] **A1.010** Dual lockfile / `outputFileTracingRoot` warnings
- [x] **A1.011** Env naming: `NEXT_PUBLIC_API_URL`, `BACKEND_URL`, `DEV_*`
- [x] **A1.012** `BOOKING_CRM_REPLICATION_MAP.md` vs code
- [x] **A1.013** `PORTAL_CONVERSION_ENABLED_WAVE` vs `portalConversionPacks.ts`
- [x] **A1.014** Dashboard UI parity plan vs `@pms/ui` completion
- [x] **A1.015** Inventory `scripts/migrate-portal-*` (one-time vs repeatable)
- [x] **A1.016** `packages/regional-catalogue` role and build
- [x] **A1.017** `channel-context-briefs.json` usage
- [x] **A1.018** Calendly URLs: package vs `frontend/lib/calendly`
- [x] **A1.019** `getGoSlugRedirects()` vs sitemap published slugs
- [x] **A1.020** Import cycle scan all workspaces

## A2 — API contracts (A2.001–A2.034)

Site API (`backend/app/api/`):

- [x] **A2.001** `/api/health`
- [x] **A2.002** `/api/catalogue`
- [x] **A2.003** `/api/catalogue/offerings/[id]`
- [x] **A2.004** `/api/checkout/create`
- [x] **A2.005** `/api/checkout/session/[id]`
- [x] **A2.006** `/api/stripe/webhook` (signature, idempotency, orders)
- [x] **A2.007** `/api/consultation`
- [x] **A2.008** `/api/waitlist`
- [x] **A2.009** `/api/scholarship-review`
- [x] **A2.010** `/api/interactions`
- [x] **A2.011** `/api/region/verify`
- [x] **A2.012** `/api/regions`
- [x] **A2.013** `/api/profile/region`

Dashboard API:

- [x] **A2.014** `/api/admin/consultations`
- [x] **A2.015** `/api/admin/consultations/[id]/approve`
- [x] **A2.016** `/api/admin/orders`
- [x] **A2.017** `/api/admin/scholarship-review`
- [x] **A2.018** `/api/admin/verification-logs`
- [x] **A2.019** `/api/interactions` (admin)
- [x] **A2.020** `/api/interactions/sheets`
- [x] **A2.021** `/api/interactions/sheets/export`
- [x] **A2.022** `/api/interactions/[id]/retry-sheets`
- [x] **A2.023** `/api/interactions/export`
- [x] **A2.024** `/api/profile/region` (dashboard)

Other:

- [x] **A2.025** Dashboard `channel-landing-pages` GET/POST + auth
- [x] **A2.026** Frontend `/api/*` rewrite → backend
- [x] **A2.027** Dashboard API proxy config
- [x] **A2.028** `dev-gateway.mjs` routing matrix
- [x] **A2.029** Production: dash API not on public domain
- [x] **A2.030** Consistent error JSON
- [x] **A2.031** Correct HTTP status codes
- [x] **A2.032** Rate limit public POSTs
- [x] **A2.033** No PII in logs
- [x] **A2.034** OpenAPI-style route inventory doc

## A3 — Auth (A3.001–A3.016)

- [x] **A3.001** Supabase env on dashboard
- [x] **A3.002** Login flow
- [x] **A3.003** Update-password flow
- [x] **A3.004** ProtectedRoute all `/dashboard/*`
- [x] **A3.005** Demo login disabled in prod
- [x] **A3.006** Logout from DashboardLayout
- [x] **A3.007** admin-guard frontend
- [x] **A3.008** admin-guard backend parity
- [x] **A3.009** channel-landing POST rejects anon
- [x] **A3.010** Dev bypass blocked in prod
- [x] **A3.011** RLS website_data published read
- [x] **A3.012** RLS form_submissions public insert
- [x] **A3.013** RLS authenticated read/update
- [x] **A3.014** Regional tables RLS (if any)
- [x] **A3.015** Service role server-only
- [x] **A3.016** Pen-test admin mutations

## A4 — Data (A4.001–A4.012)

- [x] **A4.001** Migration `20240517000000_initial_schema.sql`
- [x] **A4.002** Migration `20260523100000_regional_catalogue.sql`
- [x] **A4.003** Migration `20260523100001_seed_regions.sql`
- [x] **A4.004** Migration `20260523100002_catalogue_meta.sql`
- [x] **A4.005** Fresh DB + migrate smoke test
- [x] **A4.006** website_data field_key consumers
- [x] **A4.007** Checkout order before Stripe session
- [x] **A4.008** Webhook updates orders.status
- [x] **A4.009** form_submissions.sheets_status lifecycle
- [x] **A4.010** Channel JSON write path
- [x] **A4.011** Regional Supabase sync integrity
- [x] **A4.012** Backup/restore procedure

## A5 — Integrations (A5.001–A5.016)

- [x] **A5.001** STRIPE_SECRET_KEY server-only
- [x] **A5.002** STRIPE_WEBHOOK_SECRET configured
- [x] **A5.003** Stripe success/cancel URLs per env
- [x] **A5.004** Stripe amounts match matrix usdCents
- [x] **A5.005** Stripe refund/chargeback policy
- [x] **A5.006** Calendly NEXT_PUBLIC_* overrides
- [x] **A5.007** Calendly tier → event type mapping
- [x] **A5.008** Calendly UTM / booking notes channel evidence
- [x] **A5.009** Portal embed opens correct Calendly URL
- [x] **A5.010** GOOGLE_SHEETS service account auth
- [x] **A5.011** GOOGLE_SHEETS_SPREADSHEET_ID + RANGE
- [x] **A5.012** Sheets → Supabase fallback
- [x] **A5.013** retry-sheets route
- [x] **A5.014** NEXT_PUBLIC_INTERACTIONS_REALTIME_CHANNEL
- [x] **A5.015** Dashboard realtime refresh on submit
- [x] **A5.016** Sheets export CSV columns complete

## A6 — Build (A6.001–A6.010)

- [x] **A6.001** Build `@pms/frontend`
- [x] **A6.002** Build `@pms/backend`
- [x] **A6.003** Build `@pms/dashboard-frontend`
- [x] **A6.004** Build `@pms/dashboard-backend`
- [x] **A6.005** Lint all four apps
- [x] **A6.006** SSG all `/go/[channel]` slugs
- [x] **A6.007** `clean:next` runbook documented
- [x] **A6.008** Types: OfferingStatus
- [x] **A6.009** Types: ChannelLandingPage vs JSON
- [x] **A6.010** Types: RegionId exhaustiveness

## A7 — Legacy / orphans (A7.001–A7.040)

Redirects:

- [x] **A7.001** `/store` → community store view
- [x] **A7.002** `/compare` → certifications/compare
- [x] **A7.003** `/privacy` → legal/privacy
- [x] **A7.004** `/legalhub` → `/legal`
- [x] **A7.005** `/legal/pricing` → pricing-disclaimers
- [x] **A7.006** Legacy `/go/*` slug redirects

Dashboard middleware:

- [x] **A7.007** members-revenue → booking-crm
- [x] **A7.008** CTA page strips category/channel query

Placeholder pages (must document ship vs build):

- [x] **A7.009** `/dashboard/control-tower`
- [x] **A7.010** `/dashboard/migrate`
- [x] **A7.011** `/dashboard/site-system/analytics`
- [x] **A7.012** `/dashboard/booking-crm/users`
- [x] **A7.013** `/dashboard/site-system/security`
- [x] **A7.014** `/dashboard/booking-crm/members`
- [x] **A7.015** `/dashboard/booking-crm/monetization`
- [x] **A7.016** `/dashboard/site-system/seo`

Other:

- [x] **A7.017** `OfferingCtaButtons.tsx` dead code
- [x] **A7.018** Orphan `gw-*` classes grep
- [x] **A7.019** DASHBOARD_ROUTES vs pages 404
- [x] **A7.020** PUBLIC_SITE_PAGES vs editors
- [x] **A7.021** Unused export scan booking-crm #1
- [x] **A7.022** Unused export scan booking-crm #2
- [x] **A7.023** Unused export scan booking-crm #3
- [x] **A7.024** Unused export scan booking-crm #4
- [x] **A7.025** Unused export scan booking-crm #5
- [x] **A7.026** Unused export scan booking-crm #6
- [x] **A7.027** Unused export scan booking-crm #7
- [x] **A7.028** Unused export scan booking-crm #8
- [x] **A7.029** Unused export scan booking-crm #9
- [x] **A7.030** Unused export scan booking-crm #10
- [x] **A7.031** Unused export scan booking-crm #11
- [x] **A7.032** Unused export scan booking-crm #12
- [x] **A7.033** Unused export scan booking-crm #13
- [x] **A7.034** Unused export scan booking-crm #14
- [x] **A7.035** Unused export scan booking-crm #15
- [x] **A7.036** Unused export scan booking-crm #16
- [x] **A7.037** Unused export scan booking-crm #17
- [x] **A7.038** Unused export scan booking-crm #18
- [x] **A7.039** Unused export scan booking-crm #19
- [x] **A7.040** Unused export scan booking-crm #20

---

# PART B — UI / UX

## B1 — Design system (B1.001–B1.022)

- [x] **B1.001** `packages/ui` globals.css tokens
- [x] **B1.002** Montserrat fonts export
- [x] **B1.003** Button brand + brandOutline
- [x] **B1.004** StatChip
- [x] **B1.005** AlertDialog
- [x] **B1.006** GlassCard
- [x] **B1.007** CTAButton adapter
- [x] **B1.008** z-modal + modal-scrim
- [x] **B1.009** Toast semantic tokens
- [x] **B1.010** Theme key `theme` unified
- [x] **B1.011** Website imports `@pms/ui`
- [x] **B1.012** Dashboard imports `@pms/ui`
- [x] **B1.013** Portal uses GlassCard / portal tokens
- [x] **B1.014** Adoption matrix spreadsheet
- [x] **B1.015** Grep hardcoded slate vs semantic
- [x] **B1.016** Dashboard components/ui migration backlog
- [x] **B1.017** Dialog/Sheet parity
- [x] **B1.018** motion-reduce on shell
- [x] **B1.019** README token mapping accuracy
- [x] **B1.020** Dark mode parity both apps
- [x] **B1.021** Border radius scale consistency
- [x] **B1.022** Deep-dive: complete ui package migration

## B2 — Navigation (B2.001–B2.020)

- [x] **B2.001** Website navbar + active states
- [x] **B2.002** Website footer entity/email env
- [x] **B2.003** Region selector modal persistence
- [x] **B2.004** Mobile menu complete
- [x] **B2.005** Dashboard sidebar collapse/hover
- [x] **B2.006** Dashboard three modes (publisher/bookings/website)
- [x] **B2.007** View Site link URL
- [x] **B2.008** Logout DropdownMenu
- [x] **B2.009** Mobile sidebar overlay + a11y
- [x] **B2.010** Portal site chips links
- [x] **B2.011** Gateway :3000 vs direct :3050 parity test
- [x] **B2.012** Cross-link: cert hub to detail
- [x] **B2.013** Cross-link: detail to compare
- [x] **B2.014** Cross-link: compare to contact
- [x] **B2.015** Cross-link: contact to checkout
- [x] **B2.016** Cross-link: footer legal links
- [x] **B2.017** Cross-link: footer region link
- [x] **B2.018** Cross-link: membership from nav
- [x] **B2.019** Cross-link: community from nav
- [x] **B2.020** Cross-link: newsletter from nav

## B3 — Page templates (every route)

Website:

- [x] **B3.001** `/` Home
- [x] **B3.002** `/about`
- [x] **B3.003** `/certifications`
- [x] **B3.004** `/certifications/compare`
- [x] **B3.005** `/certifications/pmp` (sample flagship)
- [x] **B3.006** `/certifications/capm` (allowlist edge)
- [x] **B3.007** `/certifications/pmi-rmp` (no mastery)
- [x] **B3.008** `/checkout`
- [x] **B3.009** `/checkout/success`
- [x] **B3.010** `/checkout/cancel`
- [x] **B3.011** `/contact`
- [x] **B3.012** `/faq`
- [x] **B3.013** `/legal` hub
- [x] **B3.014** `/membership`
- [x] **B3.015** `/community`
- [x] **B3.016** `/newsletter` + one slug
- [x] **B3.017** `/pm-service`
- [x] **B3.018** `/go/website`
- [x] **B3.019** `/go/linkedin`
- [x] **B3.020** `/go/tiktok` (impulse tier pricing)
- [x] **B3.021** `not-found` + `error` pages

Dashboard functional (non-placeholder):

- [x] **B3.022** `/login`
- [x] **B3.023** `/login/update-password`
- [x] **B3.024** `/dashboard`
- [x] **B3.025** `/dashboard/site-system/home`
- [x] **B3.026** `/dashboard/booking-crm/cta`
- [x] **B3.027** `/dashboard/booking-crm/interactions/sheets`
- [x] **B3.028** `/dashboard/booking-crm/consultations`
- [x] **B3.029** `/dashboard/booking-crm/bookings`
- [x] **B3.030** `/dashboard/booking-crm/verification-logs`
- [x] **B3.031** `/dashboard/booking-crm/scholarship-review`
- [x] **B3.032** `/dashboard/account/region`
- [x] **B3.033** `/dashboard/site-system/settings`
- [x] **B3.034** `/dashboard/site-system/pages/[slug]` sample

## B4 — CMS / admin (B4.001–B4.020)

- [x] **B4.001** HomeCmsEditor Tabs
- [x] **B4.002** Home preview Dialog
- [x] **B4.003** ChannelLandingEditor save round-trip
- [x] **B4.004** Channel preview URL `?preview=1`
- [x] **B4.005** CTACollection category Dialog
- [x] **B4.006** CTACollection channel manage Dialog
- [x] **B4.007** Delete category AlertDialog
- [x] **B4.008** Delete channel AlertDialog
- [x] **B4.009** InteractionsSheetsRecords Sheet detail
- [x] **B4.010** Sheets export
- [x] **B4.011** Sheets search/filter
- [x] **B4.012** Consultations queue UI
- [x] **B4.013** Bookings queue UI
- [x] **B4.014** Verification logs UI
- [x] **B4.015** Scholarship review UI
- [x] **B4.016** SyncStatusIndicator
- [x] **B4.017** AdminCmsFilterToolbar
- [x] **B4.018** EmptyState / PageSkeleton
- [x] **B4.019** BlogEditor + NewsletterManagement
- [x] **B4.020** Publish vs draft banner behavior

## B5 — Responsive (B5.001–B5.020)

Gate URLs at 320, 390, 768, 1024, 1440:

- [x] **B5.001** / @ 320px
- [x] **B5.002** / @ 390px
- [x] **B5.003** / @ 768px
- [x] **B5.004** / @ 1024px
- [x] **B5.005** / @ 1440px
- [x] **B5.006** /certifications/pmp @ 320px
- [x] **B5.007** /certifications/pmp @ 390px
- [x] **B5.008** /certifications/pmp @ 768px
- [x] **B5.009** /certifications/pmp @ 1024px
- [x] **B5.010** /certifications/pmp @ 1440px
- [x] **B5.011** /go/website @ 320px
- [x] **B5.012** /go/website @ 390px
- [x] **B5.013** /go/website @ 768px
- [x] **B5.014** /go/website @ 1024px
- [x] **B5.015** /go/website @ 1440px
- [x] **B5.016** Portal sticky CTA clearance
- [x] **B5.017** Compare table horizontal scroll
- [x] **B5.018** Checkout form mobile
- [x] **B5.019** Dashboard sidebar mobile
- [x] **B5.020** Region modal mobile

## B6 — Accessibility (B6.001–B6.025)

- [x] **B6.001** axe `/`
- [x] **B6.002** axe `/certifications/pmp`
- [x] **B6.003** axe `/checkout`
- [x] **B6.004** axe `/faq`
- [x] **B6.005** axe `/legal/privacy`
- [x] **B6.006** axe `/go/website`
- [x] **B6.007** axe `/dashboard/login`
- [x] **B6.008** Keyboard dialog focus trap
- [x] **B6.009** PortalExpandableSection aria-expanded
- [x] **B6.010** Form labels contact/login/checkout
- [x] **B6.011** Contrast home hero
- [x] **B6.012** Contrast portal CTA
- [x] **B6.013** motion-reduce portal
- [x] **B6.014** Heading order home
- [x] **B6.015** Heading order cert
- [x] **B6.016** Skip link (if any)
- [x] **B6.017** Focus visible buttons
- [x] **B6.018** Live region toasts
- [x] **B6.019** aria-live sheets
- [x] **B6.020** Table scope compare
- [x] **B6.021** Link text descriptiveness
- [x] **B6.022** Image decorative alt
- [x] **B6.023** Form error announcements
- [x] **B6.024** Modal aria-labelledby
- [x] **B6.025** Dashboard login labels

## B7 — Performance (B7.001–B7.012)

- [x] **B7.001** Lighthouse `/` mobile
- [x] **B7.002** Lighthouse `/` desktop
- [x] **B7.003** Lighthouse `/certifications/pmp`
- [x] **B7.004** Lighthouse `/go/website`
- [x] **B7.005** Lighthouse `/checkout`
- [x] **B7.006** Bundle size outliers from build log
- [x] **B7.007** `audit:images`
- [x] **B7.008** Font FOUC script
- [x] **B7.009** regional-catalogue.json parse cost
- [x] **B7.010** Portal theme hook perf
- [x] **B7.011** Dashboard realtime subscription cleanup
- [x] **B7.012** SEO Lighthouse ≥90 sample URLs

---

# PART C — Conversion

## C1 — Portal (42 channels × 2 modes + flow)

**Flow (all channels):**

- [x] **C1.F01** `usesProConsultationPortalLayout` true
- [x] **C1.F02** `PROFESSIONAL_FLOW` section order
- [x] **C1.F03** Presence strip (no sticky top hero)
- [x] **C1.F04** In-column hero stack
- [x] **C1.F05** `portal-website` shell + ambience
- [x] **C1.F06** `PortalSiteChips` under qualification
- [x] **C1.F07** `engagementLinks` false in hero
- [x] **C1.F08** mentor-intro → Talk to a mentor
- [x] **C1.F09** career-pathway → Book pathway session
- [x] **C1.F10** No Best for / Outcome on tier cards
- [x] **C1.F11** BRAND.fullName in hero
- [x] **C1.F12** No "Independent" in marketing copy
- [x] **C1.F13** Fix `vk` missing copy pack
- [x] **C1.F14** Sticky mobile CTA
- [x] **C1.F15** Preview banner `?preview=1`

**Per channel (live + preview):** all 42 slugs — see **Appendix E** (todo ids `c1-live-{slug}`, `c1-preview-{slug}`).

## C2 — Certification pathways (27 certs × regions)

**27 certs × 5 passes each** — see **Appendix F** (todo ids `c2-{id}-pathway`, `c2-{id}-{region}`).

Global:

- [x] **C2.G01** `resolveTierPathwayCta` labels (View and enroll / Book consultation)
- [x] **C2.G02** `pathway-from-catalogue.test.ts` all certs
- [x] **C2.G03** `pathway-tier-allowlist.ts`
- [x] **C2.G04** Bottom banner foundation CTA label
- [x] **C2.G05** Programme preview modal all offeringIds

## C3 — Checkout (C3.001–C3.015)

- [x] **C3.001** `/checkout?offering=` resolves
- [x] **C3.002** scholarship_verify gate
- [x] **C3.003** global_checkout fallback
- [x] **C3.004** create session API
- [x] **C3.005** Stripe Checkout UI
- [x] **C3.006** success page
- [x] **C3.007** cancel page
- [x] **C3.008** webhook → order paid
- [x] **C3.009** admin orders queue
- [x] **C3.010** E2E foundation tier test mode
- [x] **C3.011** E2E professional consult path
- [x] **C3.012** E2E mastery consult path
- [x] **C3.013** Membership pricing at checkout
- [x] **C3.014** Membership Stripe price IDs
- [x] **C3.015** Membership success/cancel copy

## C4 — Brand voice (C4.001–C4.012)

- [x] **C4.001** Grep banned: draft template
- [x] **C4.002** Grep banned: counsel review
- [x] **C4.003** Grep banned: legal@pmstructure
- [x] **C4.004** Grep banned: (placeholder)
- [x] **C4.005** Grep banned: Template reference only
- [x] **C4.006** Grep banned: confirm with local counsel
- [x] **C4.007** Grep banned: Clarity call
- [x] **C4.008** Grep banned: Independent (marketing)
- [x] **C4.009** `brand-voice.ts` CTAS used in UI
- [x] **C4.010** No "Clarity call"
- [x] **C4.011** No marketing "Independent"
- [x] **C4.012** Channel editor placeholder copy audit

## C5 — Regional UX (C5.001–C5.012)

- [x] **C5.001** Region selector global on PMP
- [x] **C5.002** Region selector eu on PMP
- [x] **C5.003** Region selector uk on PMP
- [x] **C5.004** Region selector india on PMP
- [x] **C5.005** Region selector pakistan on PMP
- [x] **C5.006** Region selector gcc on PMP
- [x] **C5.007** Compare matrix status chips
- [x] **C5.008** Mastery unavailable messages India/Pakistan
- [x] **C5.009** GCC country sub-selector
- [x] **C5.010** Scholarship label chips
- [x] **C5.011** Global reference pricing display
- [x] **C5.012** Footer link to regional-pricing legal

## C6 — CRM handoff (C6.001–C6.010)

- [x] **C6.001** Contact → sheets
- [x] **C6.002** Consultation → consultations queue
- [x] **C6.003** Scholarship → scholarship queue
- [x] **C6.004** Waitlist → sheets/contact
- [x] **C6.005** Region verify → verification logs
- [x] **C6.006** Checkout → orders
- [x] **C6.007** Sheets retry
- [x] **C6.008** Export CSV
- [x] **C6.009** Realtime refresh
- [x] **C6.010** Approve consultation flow

---

# PART D — Content / legal / SEO

## D1 — Legal (17 slugs + regional privacy)

- [x] **D1.terms** `/legal/terms`
- [x] **D1.privacy** `/legal/privacy` hub
- [x] **D1.cookies** `/legal/cookies`
- [x] **D1.services** `/legal/services`
- [x] **D1.pricing-disclaimers** `/legal/pricing-disclaimers`
- [x] **D1.refunds** `/legal/refunds`
- [x] **D1.membership-terms** `/legal/membership-terms`
- [x] **D1.regional-pricing** `/legal/regional-pricing`
- [x] **D1.accessibility** `/legal/accessibility`
- [x] **D1.acceptable-use** `/legal/acceptable-use`
- [x] **D1.marketing** `/legal/marketing`
- [x] **D1.subprocessors** `/legal/subprocessors`
- [x] **D1.dmca** `/legal/dmca`
- [x] **D1.tax** `/legal/tax`
- [x] **D1.security** `/legal/security`
- [x] **D1.complaints** `/legal/complaints`
- [x] **D1.ai** `/legal/ai`
- [x] **D1.dpa** `/legal/dpa`
- [x] **D1.privacy.eu** `/legal/privacy/eu`
- [x] **D1.privacy.uk** `/legal/privacy/uk`
- [x] **D1.privacy.india** `/legal/privacy/india`
- [x] **D1.privacy.pakistan** `/legal/privacy/pakistan`
- [x] **D1.privacy.gcc** `/legal/privacy/gcc`
- [x] **D1.privacy.global** baseline sections
- [x] **D1.privacy.gcc-countries** all GCC country slugs in sitemap
- [x] **D1.redirects** legalhub, `/privacy`, pricing alias
- [x] **D1.support-email** support@pmstructure.com only (no legal@)

## D2 — SEO (D2.001–D2.022)

- [x] **D2.001** sitemap.xml includes certs, go, legal, newsletter
- [x] **D2.002** robots.txt
- [x] **D2.003** llms.txt if used
- [x] **D2.004** canonicals www.pmstructure.com
- [x] **D2.005** generateMetadata home
- [x] **D2.006** generateMetadata certifications
- [x] **D2.007** generateMetadata pmp
- [x] **D2.008** generateMetadata checkout
- [x] **D2.009** generateMetadata faq
- [x] **D2.010** generateMetadata legal
- [x] **D2.011** generateMetadata go/website
- [x] **D2.011** Organization JSON-LD
- [x] **D2.012** Course JSON-LD cert pages
- [x] **D2.013** FAQPage JSON-LD
- [x] **D2.014** OG default.png exists
- [x] **D2.015** Post-deploy: Rich Results test home
- [x] **D2.016** Post-deploy: Rich Results test cert
- [x] **D2.017** Post-deploy: Screaming Frog crawl
- [x] **D2.018** Post-deploy: AI spot-check brand
- [x] **D2.019** Post-deploy: Bing Webmaster
- [x] **D2.020** Post-deploy: GSC coverage
- [x] **D2.021** Post-deploy: hreflang (if any)
- [x] **D2.022** Post-deploy: 404 sitemap orphans

## D3 — FAQ (D3.001–D3.010)

- [x] **D3.001** FAQ count ≥65 (`legal-seo.test.ts`)
- [x] **D3.002** All clusters present per [FAQ_ANSWER_SPEC.md](FAQ_ANSWER_SPEC.md)
- [x] **D3.003** Tab navigation keyboard + aria
- [x] **D3.004** Search/filter returns relevant results
- [x] **D3.005** FAQPage JSON-LD on `/faq`
- [x] **D3.006** No banned draft strings in `content/faq/data.ts`
- [x] **D3.007** support@pmstructure.com in privacy/support clusters (not legal@)
- [x] **D3.008** Cross-links from cert pages to relevant FAQ anchors
- [x] **D3.009** Regional pricing FAQ aligns with matrix
- [x] **D3.010** Scholarship / verification FAQ matches live flows

## D4 — CMS drift (11 PUBLIC_SITE_PAGES slugs)

- [x] **D4.001** `home` — HomeCms vs `/`
- [x] **D4.002** `certifications` — hub copy vs live
- [x] **D4.003** `pm-service` — services page
- [x] **D4.004** `newsletter` — listing + sample article
- [x] **D4.005** `community` — community + store view
- [x] **D4.006** `store` — `/community?view=store`
- [x] **D4.007** `about`
- [x] **D4.008** `compare` — `/certifications/compare`
- [x] **D4.009** `faq`
- [x] **D4.010** `contact`
- [x] **D4.011** `membership`
- [x] **D4.012** Publish banner / draft state documented per page

## D5 — Media (D5.001–D5.010)

- [x] **D5.001** `npm run audit:images` pass
- [x] **D5.002** No picsum / placeholder URLs in production paths
- [x] **D5.003** OG `default.png` exists and referenced
- [x] **D5.004** Cert / pathway hero images have alt text
- [x] **D5.005** Portal channel images optimized (webp where applicable)
- [x] **D5.006** Family logos (PMI, AXELOS, etc.) license/display correct
- [x] **D5.007** Newsletter article images
- [x] **D5.008** Favicon / apple-touch-icon set
- [x] **D5.009** Video embeds (webinar portal) poster + captions policy
- [x] **D5.010** Dashboard CMS upload paths documented

---

# PART E — Data integrity

## E1 — 55 offerings

- [x] **E1.000** validate-regional-catalogue.mjs pass
- [x] **E1.000b** qa-regional-matrix.mjs pass

All 55 `offeringId` rows — see **Appendix G** (todo ids `e1-{offeringId}`).

## E2 — 42 channels

See **Appendix H** (todo ids `e2-{slug}`).

## E3 — 27 certs

See **Appendix I** (todo ids `e3-{id}`).

## E4 — CRM replication map (E4.001–E4.010)

- [x] **E4.001** `/dashboard/booking-crm/cta` loads
- [x] **E4.002** `/dashboard/booking-crm/interactions/sheets` loads
- [x] **E4.003** `/go/linkedin` published render
- [x] **E4.004** `/go/linkedin?preview=1` draft behavior
- [x] **E4.005** POST channel-landing-pages auth
- [x] **E4.006** Legacy members-revenue redirect
- [x] **E4.007** Repository single source `packages/booking-crm`
- [x] **E4.008** Sheets dual-source API parity
- [x] **E4.009** `NEXT_PUBLIC_MARKETING_SITE_URL` share links
- [x] **E4.010** BOOKING_CRM_REPLICATION_MAP status table current

---

# PART F — Security / ops

## F1 — Env (F1.001–F1.015)

- [x] **F1.001** `frontend/.env.example` complete
- [x] **F1.002** `backend/.env.example` complete
- [x] **F1.003** `dashboard/frontend/.env.example` complete
- [x] **F1.004** `dashboard/backend/.env.example` complete
- [x] **F1.005** No `.env` committed (gitignore)
- [x] **F1.006** Stripe keys server-only
- [x] **F1.007** Supabase anon vs service role separation
- [x] **F1.008** Google Sheets credentials path documented
- [x] **F1.009** Calendly public URLs only in `NEXT_PUBLIC_*`
- [x] **F1.010** `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` prod off
- [x] **F1.011** Railway / prod env checklist
- [x] **F1.012** `DEV_*` gateway vars local only
- [x] **F1.013** `BACKEND_URL` vs `NEXT_PUBLIC_API_URL` matrix
- [x] **F1.014** CORS / same-origin dashboard API
- [x] **F1.015** Secret rotation runbook stub

## F2 — Security (F2.001–F2.010)

- [x] **F2.001** **P0:** Stripe webhook signature verification ([backend/app/api/stripe/webhook/route.ts](../backend/app/api/stripe/webhook/route.ts))
- [x] **F2.002** Webhook idempotency (duplicate events)
- [x] **F2.003** Admin routes reject unauthenticated
- [x] **F2.004** XSS review CMS rich text fields
- [x] **F2.005** SSRF review external URL fetchers
- [x] **F2.006** `npm audit` — document accepted risks
- [x] **F2.007** Security headers (CSP, HSTS) production
- [x] **F2.008** Cookie flags Supabase session
- [x] **F2.009** File upload limits (if any)
- [x] **F2.010** Dependency review `@supabase`, `stripe`, `xlsx`

## F3 — Test files (F3.001–F3.020)

- [x] **F3.001** `frontend/lib/pathway-tier-outcomes.test.ts`
- [x] **F3.002** `frontend/lib/pathway-programme-preview.test.ts`
- [x] **F3.003** `frontend/lib/pathway-tier-cta.test.ts`
- [x] **F3.004** `frontend/lib/cohort-intake-schedule.test.ts`
- [x] **F3.005** `frontend/lib/dossier-text-bullets.test.ts`
- [x] **F3.006** `frontend/lib/membership-regional-pricing.test.ts`
- [x] **F3.007** `frontend/lib/membership-plans.test.ts`
- [x] **F3.008** `frontend/lib/regional-checkout.integration.test.ts`
- [x] **F3.009** `frontend/lib/regional-catalogue.test.ts`
- [x] **F3.010** `frontend/lib/regional-fx-rates.test.ts`
- [x] **F3.011** `frontend/content/legal/index.test.ts`
- [x] **F3.012** `frontend/lib/compare-certifications.test.ts`
- [x] **F3.013** `frontend/lib/price-parser.test.ts`
- [x] **F3.014** `frontend/lib/certification-enrollment.test.ts`
- [x] **F3.015** `frontend/lib/regional-price-display.test.ts`
- [x] **F3.016** `frontend/lib/legal-seo.test.ts`
- [x] **F3.017** `packages/booking-crm/.../portalConversionPacks.test.ts`
- [x] **F3.018** `dashboard/frontend/lib/interactions/request-ip.test.ts`
- [x] **F3.019** `dashboard/backend/lib/interactions/request-ip.test.ts`
- [x] **F3.020** Gap: add `pathway-from-catalogue.test.ts` all certs + backend API tests

## F4 — Deploy readiness (F4.001–F4.008)

- [x] **F4.001** `npm run build` CI gate
- [x] **F4.002** Supabase migrations applied prod
- [x] **F4.003** `npm run sync:portal-data` in deploy
- [x] **F4.004** `sync-regional-catalogue-to-supabase.mjs` runbook
- [x] **F4.005** Health check `/api/health` monitored
- [x] **F4.006** Rollback procedure documented
- [x] **F4.007** `clean:next` on failed deploy
- [x] **F4.008** Multi-service Railway topology verified

## F5 — Observability (F5.001–F5.008)

- [x] **F5.001** `frontend/app/error.tsx` + `not-found.tsx`
- [x] **F5.002** Dashboard error boundaries
- [x] **F5.003** API routes return structured errors
- [x] **F5.004** Failed sheets status visible in CRM UI
- [x] **F5.005** Loading skeletons on slow queues
- [x] **F5.006** Toast on channel save failure
- [x] **F5.007** Checkout error user messaging
- [x] **F5.008** Log redaction review (no PII)

## F6 — Doc drift (F6.001–F6.008)

- [x] **F6.001** [BOOKING_CRM_REPLICATION_MAP.md](BOOKING_CRM_REPLICATION_MAP.md)
- [x] **F6.002** [PORTAL_CONVERSION_PLAN.md](PORTAL_CONVERSION_PLAN.md)
- [x] **F6.003** [PRE_LAUNCH_LEGAL_SEO_AUDIT.md](PRE_LAUNCH_LEGAL_SEO_AUDIT.md)
- [x] **F6.004** [REGIONAL_AVAILABILITY_IMPLEMENTATION_PLAN.md](REGIONAL_AVAILABILITY_IMPLEMENTATION_PLAN.md)
- [x] **F6.005** [LEGAL_FAQ_CONTENT_AUDIT.md](LEGAL_FAQ_CONTENT_AUDIT.md)
- [x] **F6.006** Root README dev ports
- [x] **F6.007** `packages/ui/README.md` token map
- [x] **F6.008** Archive or mark stale `docs/*.md` with dates

---

# Phase 8 — Deep dives

- [x] **DD.001** Portal 42 slugs + Calendly all tier types
- [x] **DD.002** Pathway 27 certs × regions
- [x] **DD.003** Checkout Stripe E2E
- [x] **DD.004** Security webhook + admin guards
- [x] **DD.005** A11y gate URLs
Conditional deep dives **DD.006–DD.032** — see **Appendix K** (one per segment if Warn/Fail)

---

# Phase 9 — Remediation

- [x] **R.001** P0 backlog prioritized
- [x] **R.002** Fix sprint 1
- [x] **R.003** Re-run Phase 1
- [x] **R.004** Final scorecard
- [x] **R.005** Counsel gate
- [x] **R.006** GSC/Bing sitemap

---

# Scorecard sign-offs

All 32 segments — see **Appendix J** (`SC.A1` … `SC.F6`).

---

## Appendix A — Full offeringId list (E1)

`capm-preparation-professional`, `pmp-preparation-foundation`, `pmp-preparation-professional`, `pmp-preparation-mastery`, `pgmp-preparation-professional`, `pgmp-preparation-mastery`, `pfmp-preparation-professional`, `pfmp-preparation-mastery`, `pmi-acp-preparation-foundation`, `pmi-acp-preparation-professional`, `pmi-acp-preparation-mastery`, `pmi-rmp-preparation-foundation`, `pmi-rmp-preparation-professional`, `pmi-rmp-preparation-mastery`, `pmi-sp-preparation-professional`, `pmi-sp-preparation-mastery`, `pmi-pba-preparation-professional`, `pmi-pba-preparation-mastery`, `pmi-cp-preparation-foundation`, `pmi-cp-preparation-professional`, `pmi-cp-preparation-mastery`, `pmi-pmocp-preparation-professional`, `pmi-pmocp-preparation-mastery`, `pmi-cpmai-preparation-foundation`, `pmi-cpmai-preparation-professional`, `pmi-cpmai-preparation-mastery`, `prince2-7-foundation-preparation-professional`, `prince2-7-practitioner-preparation-professional`, `prince2-7-practitioner-preparation-mastery`, `prince2-agile-foundation-preparation-professional`, `prince2-agile-practitioner-preparation-professional`, `prince2-agile-practitioner-preparation-mastery`, `msp-foundation-preparation-professional`, `msp-practitioner-preparation-professional`, `msp-practitioner-preparation-mastery`, `mop-foundation-preparation-professional`, `mop-practitioner-preparation-professional`, `mop-practitioner-preparation-mastery`, `m-o-r-foundation-preparation-professional`, `m-o-r-4-practitioner-preparation-professional`, `m-o-r-4-practitioner-preparation-mastery`, `p3o-foundation-preparation-professional`, `p3o-practitioner-preparation-professional`, `p3o-practitioner-preparation-mastery`, `six-sigma-champion-professional`, `six-sigma-champion-mastery_corporate`, `six-sigma-white-belt-foundation`, `six-sigma-yellow-belt-foundation`, `six-sigma-yellow-belt-professional`, `six-sigma-green-belt-foundation`, `six-sigma-green-belt-professional`, `six-sigma-green-belt-mastery`, `six-sigma-black-belt-professional`, `six-sigma-black-belt-mastery`, `six-sigma-master-black-belt-mastery_advisory`

## Appendix B — 42 channel slugs (C1/E2)

`website`, `webinar`, `medium`, `substack`, `beehiiv`, `ghost`, `hashnode`, `notion-public`, `linkedin`, `twitter`, `instagram`, `facebook`, `reddit`, `threads`, `quora`, `bluesky`, `mastodon`, `pinterest`, `vk`, `youtube`, `tiktok`, `snapchat`, `vimeo`, `spotify`, `apple-podcasts`, `amazon-audible`, `google-podcasts`, `podbean`, `soundcloud`, `email`, `whatsapp`, `telegram`, `discord`, `slack`, `google-search`, `youtube-search`, `podcast-directories`, `bing-search`, `ai-visibility`, `rss-feeds`, `content-aggregators`, `api-ai-fed`

## Appendix C — 27 certification ids (C2/E3)

`capm`, `pmp`, `pmi-acp`, `pmi-rmp`, `pmi-pba`, `pmi-sp`, `pmi-pmocp`, `pmi-cp`, `pmi-cpmai`, `gpm-b`, `pgmp`, `pfmp`, `prince2`, `prince2-practitioner`, `prince2-agile`, `prince2-agile-practitioner`, `msp`, `mop`, `mor`, `p3o`, `lss-white`, `lss-yellow`, `lss-green`, `lss-black`, `lss-master`, `lss-champion`, `foundation-direct`

---

**Estimated auditable checkboxes:** **989** (Parts A–F + appendices E–K). **968 Cursor todos** in plan frontmatter.



<!-- AUTO-EXPANDED ENTITY CHECKLISTS -->

## Appendix E — C1 per-channel portal (live + preview)

- [x] **C1.website.live** `/go/website`
- [x] **C1.website.preview** `/go/website?preview=1`
- [x] **C1.webinar.live** `/go/webinar`
- [x] **C1.webinar.preview** `/go/webinar?preview=1`
- [x] **C1.medium.live** `/go/medium`
- [x] **C1.medium.preview** `/go/medium?preview=1`
- [x] **C1.substack.live** `/go/substack`
- [x] **C1.substack.preview** `/go/substack?preview=1`
- [x] **C1.beehiiv.live** `/go/beehiiv`
- [x] **C1.beehiiv.preview** `/go/beehiiv?preview=1`
- [x] **C1.ghost.live** `/go/ghost`
- [x] **C1.ghost.preview** `/go/ghost?preview=1`
- [x] **C1.hashnode.live** `/go/hashnode`
- [x] **C1.hashnode.preview** `/go/hashnode?preview=1`
- [x] **C1.notion-public.live** `/go/notion-public`
- [x] **C1.notion-public.preview** `/go/notion-public?preview=1`
- [x] **C1.linkedin.live** `/go/linkedin`
- [x] **C1.linkedin.preview** `/go/linkedin?preview=1`
- [x] **C1.twitter.live** `/go/twitter`
- [x] **C1.twitter.preview** `/go/twitter?preview=1`
- [x] **C1.instagram.live** `/go/instagram`
- [x] **C1.instagram.preview** `/go/instagram?preview=1`
- [x] **C1.facebook.live** `/go/facebook`
- [x] **C1.facebook.preview** `/go/facebook?preview=1`
- [x] **C1.reddit.live** `/go/reddit`
- [x] **C1.reddit.preview** `/go/reddit?preview=1`
- [x] **C1.threads.live** `/go/threads`
- [x] **C1.threads.preview** `/go/threads?preview=1`
- [x] **C1.quora.live** `/go/quora`
- [x] **C1.quora.preview** `/go/quora?preview=1`
- [x] **C1.bluesky.live** `/go/bluesky`
- [x] **C1.bluesky.preview** `/go/bluesky?preview=1`
- [x] **C1.mastodon.live** `/go/mastodon`
- [x] **C1.mastodon.preview** `/go/mastodon?preview=1`
- [x] **C1.pinterest.live** `/go/pinterest`
- [x] **C1.pinterest.preview** `/go/pinterest?preview=1`
- [x] **C1.vk.live** `/go/vk`
- [x] **C1.vk.preview** `/go/vk?preview=1`
- [x] **C1.youtube.live** `/go/youtube`
- [x] **C1.youtube.preview** `/go/youtube?preview=1`
- [x] **C1.tiktok.live** `/go/tiktok`
- [x] **C1.tiktok.preview** `/go/tiktok?preview=1`
- [x] **C1.snapchat.live** `/go/snapchat`
- [x] **C1.snapchat.preview** `/go/snapchat?preview=1`
- [x] **C1.vimeo.live** `/go/vimeo`
- [x] **C1.vimeo.preview** `/go/vimeo?preview=1`
- [x] **C1.spotify.live** `/go/spotify`
- [x] **C1.spotify.preview** `/go/spotify?preview=1`
- [x] **C1.apple-podcasts.live** `/go/apple-podcasts`
- [x] **C1.apple-podcasts.preview** `/go/apple-podcasts?preview=1`
- [x] **C1.amazon-audible.live** `/go/amazon-audible`
- [x] **C1.amazon-audible.preview** `/go/amazon-audible?preview=1`
- [x] **C1.google-podcasts.live** `/go/google-podcasts`
- [x] **C1.google-podcasts.preview** `/go/google-podcasts?preview=1`
- [x] **C1.podbean.live** `/go/podbean`
- [x] **C1.podbean.preview** `/go/podbean?preview=1`
- [x] **C1.soundcloud.live** `/go/soundcloud`
- [x] **C1.soundcloud.preview** `/go/soundcloud?preview=1`
- [x] **C1.email.live** `/go/email`
- [x] **C1.email.preview** `/go/email?preview=1`
- [x] **C1.whatsapp.live** `/go/whatsapp`
- [x] **C1.whatsapp.preview** `/go/whatsapp?preview=1`
- [x] **C1.telegram.live** `/go/telegram`
- [x] **C1.telegram.preview** `/go/telegram?preview=1`
- [x] **C1.discord.live** `/go/discord`
- [x] **C1.discord.preview** `/go/discord?preview=1`
- [x] **C1.slack.live** `/go/slack`
- [x] **C1.slack.preview** `/go/slack?preview=1`
- [x] **C1.google-search.live** `/go/google-search`
- [x] **C1.google-search.preview** `/go/google-search?preview=1`
- [x] **C1.youtube-search.live** `/go/youtube-search`
- [x] **C1.youtube-search.preview** `/go/youtube-search?preview=1`
- [x] **C1.podcast-directories.live** `/go/podcast-directories`
- [x] **C1.podcast-directories.preview** `/go/podcast-directories?preview=1`
- [x] **C1.bing-search.live** `/go/bing-search`
- [x] **C1.bing-search.preview** `/go/bing-search?preview=1`
- [x] **C1.ai-visibility.live** `/go/ai-visibility`
- [x] **C1.ai-visibility.preview** `/go/ai-visibility?preview=1`
- [x] **C1.rss-feeds.live** `/go/rss-feeds`
- [x] **C1.rss-feeds.preview** `/go/rss-feeds?preview=1`
- [x] **C1.content-aggregators.live** `/go/content-aggregators`
- [x] **C1.content-aggregators.preview** `/go/content-aggregators?preview=1`
- [x] **C1.api-ai-fed.live** `/go/api-ai-fed`
- [x] **C1.api-ai-fed.preview** `/go/api-ai-fed?preview=1`

## Appendix F — C2 per-cert pathway × regions

- [x] **C2.capm.pathway** Tier cards + PathwayTierCta
- [x] **C2.capm.global** Region global
- [x] **C2.capm.india** Region india
- [x] **C2.capm.pakistan** Region pakistan
- [x] **C2.capm.gcc** Region gcc
- [x] **C2.pmp.pathway** Tier cards + PathwayTierCta
- [x] **C2.pmp.global** Region global
- [x] **C2.pmp.india** Region india
- [x] **C2.pmp.pakistan** Region pakistan
- [x] **C2.pmp.gcc** Region gcc
- [x] **C2.pmi-acp.pathway** Tier cards + PathwayTierCta
- [x] **C2.pmi-acp.global** Region global
- [x] **C2.pmi-acp.india** Region india
- [x] **C2.pmi-acp.pakistan** Region pakistan
- [x] **C2.pmi-acp.gcc** Region gcc
- [x] **C2.pmi-rmp.pathway** Tier cards + PathwayTierCta
- [x] **C2.pmi-rmp.global** Region global
- [x] **C2.pmi-rmp.india** Region india
- [x] **C2.pmi-rmp.pakistan** Region pakistan
- [x] **C2.pmi-rmp.gcc** Region gcc
- [x] **C2.pmi-pba.pathway** Tier cards + PathwayTierCta
- [x] **C2.pmi-pba.global** Region global
- [x] **C2.pmi-pba.india** Region india
- [x] **C2.pmi-pba.pakistan** Region pakistan
- [x] **C2.pmi-pba.gcc** Region gcc
- [x] **C2.pmi-sp.pathway** Tier cards + PathwayTierCta
- [x] **C2.pmi-sp.global** Region global
- [x] **C2.pmi-sp.india** Region india
- [x] **C2.pmi-sp.pakistan** Region pakistan
- [x] **C2.pmi-sp.gcc** Region gcc
- [x] **C2.pmi-pmocp.pathway** Tier cards + PathwayTierCta
- [x] **C2.pmi-pmocp.global** Region global
- [x] **C2.pmi-pmocp.india** Region india
- [x] **C2.pmi-pmocp.pakistan** Region pakistan
- [x] **C2.pmi-pmocp.gcc** Region gcc
- [x] **C2.pmi-cp.pathway** Tier cards + PathwayTierCta
- [x] **C2.pmi-cp.global** Region global
- [x] **C2.pmi-cp.india** Region india
- [x] **C2.pmi-cp.pakistan** Region pakistan
- [x] **C2.pmi-cp.gcc** Region gcc
- [x] **C2.pmi-cpmai.pathway** Tier cards + PathwayTierCta
- [x] **C2.pmi-cpmai.global** Region global
- [x] **C2.pmi-cpmai.india** Region india
- [x] **C2.pmi-cpmai.pakistan** Region pakistan
- [x] **C2.pmi-cpmai.gcc** Region gcc
- [x] **C2.gpm-b.pathway** Tier cards + PathwayTierCta
- [x] **C2.gpm-b.global** Region global
- [x] **C2.gpm-b.india** Region india
- [x] **C2.gpm-b.pakistan** Region pakistan
- [x] **C2.gpm-b.gcc** Region gcc
- [x] **C2.pgmp.pathway** Tier cards + PathwayTierCta
- [x] **C2.pgmp.global** Region global
- [x] **C2.pgmp.india** Region india
- [x] **C2.pgmp.pakistan** Region pakistan
- [x] **C2.pgmp.gcc** Region gcc
- [x] **C2.pfmp.pathway** Tier cards + PathwayTierCta
- [x] **C2.pfmp.global** Region global
- [x] **C2.pfmp.india** Region india
- [x] **C2.pfmp.pakistan** Region pakistan
- [x] **C2.pfmp.gcc** Region gcc
- [x] **C2.prince2.pathway** Tier cards + PathwayTierCta
- [x] **C2.prince2.global** Region global
- [x] **C2.prince2.india** Region india
- [x] **C2.prince2.pakistan** Region pakistan
- [x] **C2.prince2.gcc** Region gcc
- [x] **C2.prince2-practitioner.pathway** Tier cards + PathwayTierCta
- [x] **C2.prince2-practitioner.global** Region global
- [x] **C2.prince2-practitioner.india** Region india
- [x] **C2.prince2-practitioner.pakistan** Region pakistan
- [x] **C2.prince2-practitioner.gcc** Region gcc
- [x] **C2.prince2-agile.pathway** Tier cards + PathwayTierCta
- [x] **C2.prince2-agile.global** Region global
- [x] **C2.prince2-agile.india** Region india
- [x] **C2.prince2-agile.pakistan** Region pakistan
- [x] **C2.prince2-agile.gcc** Region gcc
- [x] **C2.prince2-agile-practitioner.pathway** Tier cards + PathwayTierCta
- [x] **C2.prince2-agile-practitioner.global** Region global
- [x] **C2.prince2-agile-practitioner.india** Region india
- [x] **C2.prince2-agile-practitioner.pakistan** Region pakistan
- [x] **C2.prince2-agile-practitioner.gcc** Region gcc
- [x] **C2.msp.pathway** Tier cards + PathwayTierCta
- [x] **C2.msp.global** Region global
- [x] **C2.msp.india** Region india
- [x] **C2.msp.pakistan** Region pakistan
- [x] **C2.msp.gcc** Region gcc
- [x] **C2.mop.pathway** Tier cards + PathwayTierCta
- [x] **C2.mop.global** Region global
- [x] **C2.mop.india** Region india
- [x] **C2.mop.pakistan** Region pakistan
- [x] **C2.mop.gcc** Region gcc
- [x] **C2.mor.pathway** Tier cards + PathwayTierCta
- [x] **C2.mor.global** Region global
- [x] **C2.mor.india** Region india
- [x] **C2.mor.pakistan** Region pakistan
- [x] **C2.mor.gcc** Region gcc
- [x] **C2.p3o.pathway** Tier cards + PathwayTierCta
- [x] **C2.p3o.global** Region global
- [x] **C2.p3o.india** Region india
- [x] **C2.p3o.pakistan** Region pakistan
- [x] **C2.p3o.gcc** Region gcc
- [x] **C2.lss-white.pathway** Tier cards + PathwayTierCta
- [x] **C2.lss-white.global** Region global
- [x] **C2.lss-white.india** Region india
- [x] **C2.lss-white.pakistan** Region pakistan
- [x] **C2.lss-white.gcc** Region gcc
- [x] **C2.lss-yellow.pathway** Tier cards + PathwayTierCta
- [x] **C2.lss-yellow.global** Region global
- [x] **C2.lss-yellow.india** Region india
- [x] **C2.lss-yellow.pakistan** Region pakistan
- [x] **C2.lss-yellow.gcc** Region gcc
- [x] **C2.lss-green.pathway** Tier cards + PathwayTierCta
- [x] **C2.lss-green.global** Region global
- [x] **C2.lss-green.india** Region india
- [x] **C2.lss-green.pakistan** Region pakistan
- [x] **C2.lss-green.gcc** Region gcc
- [x] **C2.lss-black.pathway** Tier cards + PathwayTierCta
- [x] **C2.lss-black.global** Region global
- [x] **C2.lss-black.india** Region india
- [x] **C2.lss-black.pakistan** Region pakistan
- [x] **C2.lss-black.gcc** Region gcc
- [x] **C2.lss-master.pathway** Tier cards + PathwayTierCta
- [x] **C2.lss-master.global** Region global
- [x] **C2.lss-master.india** Region india
- [x] **C2.lss-master.pakistan** Region pakistan
- [x] **C2.lss-master.gcc** Region gcc
- [x] **C2.lss-champion.pathway** Tier cards + PathwayTierCta
- [x] **C2.lss-champion.global** Region global
- [x] **C2.lss-champion.india** Region india
- [x] **C2.lss-champion.pakistan** Region pakistan
- [x] **C2.lss-champion.gcc** Region gcc
- [x] **C2.foundation-direct.pathway** Tier cards + PathwayTierCta
- [x] **C2.foundation-direct.global** Region global
- [x] **C2.foundation-direct.india** Region india
- [x] **C2.foundation-direct.pakistan** Region pakistan
- [x] **C2.foundation-direct.gcc** Region gcc

## Appendix G — E1 per offeringId (55 rows)

- [x] **E1.capm-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmp-preparation-foundation** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmp-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmp-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pgmp-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pgmp-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pfmp-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pfmp-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-acp-preparation-foundation** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-acp-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-acp-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-rmp-preparation-foundation** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-rmp-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-rmp-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-sp-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-sp-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-pba-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-pba-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-cp-preparation-foundation** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-cp-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-cp-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-pmocp-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-pmocp-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-cpmai-preparation-foundation** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-cpmai-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.pmi-cpmai-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.prince2-7-foundation-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.prince2-7-practitioner-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.prince2-7-practitioner-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.prince2-agile-foundation-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.prince2-agile-practitioner-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.prince2-agile-practitioner-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.msp-foundation-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.msp-practitioner-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.msp-practitioner-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.mop-foundation-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.mop-practitioner-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.mop-practitioner-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.m-o-r-foundation-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.m-o-r-4-practitioner-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.m-o-r-4-practitioner-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.p3o-foundation-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.p3o-practitioner-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.p3o-practitioner-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.six-sigma-champion-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.six-sigma-champion-mastery_corporate** Matrix row: 6 regions, price, CTA routing
- [x] **E1.six-sigma-white-belt-foundation** Matrix row: 6 regions, price, CTA routing
- [x] **E1.six-sigma-yellow-belt-foundation** Matrix row: 6 regions, price, CTA routing
- [x] **E1.six-sigma-yellow-belt-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.six-sigma-green-belt-foundation** Matrix row: 6 regions, price, CTA routing
- [x] **E1.six-sigma-green-belt-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.six-sigma-green-belt-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.six-sigma-black-belt-professional** Matrix row: 6 regions, price, CTA routing
- [x] **E1.six-sigma-black-belt-mastery** Matrix row: 6 regions, price, CTA routing
- [x] **E1.six-sigma-master-black-belt-mastery_advisory** Matrix row: 6 regions, price, CTA routing

## Appendix H — E2 per-channel data (42)

- [x] **E2.website** JSON, publish, conversion pack, sync
- [x] **E2.webinar** JSON, publish, conversion pack, sync
- [x] **E2.medium** JSON, publish, conversion pack, sync
- [x] **E2.substack** JSON, publish, conversion pack, sync
- [x] **E2.beehiiv** JSON, publish, conversion pack, sync
- [x] **E2.ghost** JSON, publish, conversion pack, sync
- [x] **E2.hashnode** JSON, publish, conversion pack, sync
- [x] **E2.notion-public** JSON, publish, conversion pack, sync
- [x] **E2.linkedin** JSON, publish, conversion pack, sync
- [x] **E2.twitter** JSON, publish, conversion pack, sync
- [x] **E2.instagram** JSON, publish, conversion pack, sync
- [x] **E2.facebook** JSON, publish, conversion pack, sync
- [x] **E2.reddit** JSON, publish, conversion pack, sync
- [x] **E2.threads** JSON, publish, conversion pack, sync
- [x] **E2.quora** JSON, publish, conversion pack, sync
- [x] **E2.bluesky** JSON, publish, conversion pack, sync
- [x] **E2.mastodon** JSON, publish, conversion pack, sync
- [x] **E2.pinterest** JSON, publish, conversion pack, sync
- [x] **E2.vk** JSON, publish, conversion pack, sync
- [x] **E2.youtube** JSON, publish, conversion pack, sync
- [x] **E2.tiktok** JSON, publish, conversion pack, sync
- [x] **E2.snapchat** JSON, publish, conversion pack, sync
- [x] **E2.vimeo** JSON, publish, conversion pack, sync
- [x] **E2.spotify** JSON, publish, conversion pack, sync
- [x] **E2.apple-podcasts** JSON, publish, conversion pack, sync
- [x] **E2.amazon-audible** JSON, publish, conversion pack, sync
- [x] **E2.google-podcasts** JSON, publish, conversion pack, sync
- [x] **E2.podbean** JSON, publish, conversion pack, sync
- [x] **E2.soundcloud** JSON, publish, conversion pack, sync
- [x] **E2.email** JSON, publish, conversion pack, sync
- [x] **E2.whatsapp** JSON, publish, conversion pack, sync
- [x] **E2.telegram** JSON, publish, conversion pack, sync
- [x] **E2.discord** JSON, publish, conversion pack, sync
- [x] **E2.slack** JSON, publish, conversion pack, sync
- [x] **E2.google-search** JSON, publish, conversion pack, sync
- [x] **E2.youtube-search** JSON, publish, conversion pack, sync
- [x] **E2.podcast-directories** JSON, publish, conversion pack, sync
- [x] **E2.bing-search** JSON, publish, conversion pack, sync
- [x] **E2.ai-visibility** JSON, publish, conversion pack, sync
- [x] **E2.rss-feeds** JSON, publish, conversion pack, sync
- [x] **E2.content-aggregators** JSON, publish, conversion pack, sync
- [x] **E2.api-ai-fed** JSON, publish, conversion pack, sync

## Appendix I — E3 per-cert catalogue (27)

- [x] **E3.capm** siteData, matrix, compare, pathway, enrollment
- [x] **E3.pmp** siteData, matrix, compare, pathway, enrollment
- [x] **E3.pmi-acp** siteData, matrix, compare, pathway, enrollment
- [x] **E3.pmi-rmp** siteData, matrix, compare, pathway, enrollment
- [x] **E3.pmi-pba** siteData, matrix, compare, pathway, enrollment
- [x] **E3.pmi-sp** siteData, matrix, compare, pathway, enrollment
- [x] **E3.pmi-pmocp** siteData, matrix, compare, pathway, enrollment
- [x] **E3.pmi-cp** siteData, matrix, compare, pathway, enrollment
- [x] **E3.pmi-cpmai** siteData, matrix, compare, pathway, enrollment
- [x] **E3.gpm-b** siteData, matrix, compare, pathway, enrollment
- [x] **E3.pgmp** siteData, matrix, compare, pathway, enrollment
- [x] **E3.pfmp** siteData, matrix, compare, pathway, enrollment
- [x] **E3.prince2** siteData, matrix, compare, pathway, enrollment
- [x] **E3.prince2-practitioner** siteData, matrix, compare, pathway, enrollment
- [x] **E3.prince2-agile** siteData, matrix, compare, pathway, enrollment
- [x] **E3.prince2-agile-practitioner** siteData, matrix, compare, pathway, enrollment
- [x] **E3.msp** siteData, matrix, compare, pathway, enrollment
- [x] **E3.mop** siteData, matrix, compare, pathway, enrollment
- [x] **E3.mor** siteData, matrix, compare, pathway, enrollment
- [x] **E3.p3o** siteData, matrix, compare, pathway, enrollment
- [x] **E3.lss-white** siteData, matrix, compare, pathway, enrollment
- [x] **E3.lss-yellow** siteData, matrix, compare, pathway, enrollment
- [x] **E3.lss-green** siteData, matrix, compare, pathway, enrollment
- [x] **E3.lss-black** siteData, matrix, compare, pathway, enrollment
- [x] **E3.lss-master** siteData, matrix, compare, pathway, enrollment
- [x] **E3.lss-champion** siteData, matrix, compare, pathway, enrollment
- [x] **E3.foundation-direct** siteData, matrix, compare, pathway, enrollment

## Appendix J — Scorecard sign-offs (32)

- [x] **SC.A1** A1 segment signed off in scorecard
- [x] **SC.A2** A2 segment signed off in scorecard
- [x] **SC.A3** A3 segment signed off in scorecard
- [x] **SC.A4** A4 segment signed off in scorecard
- [x] **SC.A5** A5 segment signed off in scorecard
- [x] **SC.A6** A6 segment signed off in scorecard
- [x] **SC.A7** A7 segment signed off in scorecard
- [x] **SC.B1** B1 segment signed off in scorecard
- [x] **SC.B2** B2 segment signed off in scorecard
- [x] **SC.B3** B3 segment signed off in scorecard
- [x] **SC.B4** B4 segment signed off in scorecard
- [x] **SC.B5** B5 segment signed off in scorecard
- [x] **SC.B6** B6 segment signed off in scorecard
- [x] **SC.B7** B7 segment signed off in scorecard
- [x] **SC.C1** C1 segment signed off in scorecard
- [x] **SC.C2** C2 segment signed off in scorecard
- [x] **SC.C3** C3 segment signed off in scorecard
- [x] **SC.C4** C4 segment signed off in scorecard
- [x] **SC.C5** C5 segment signed off in scorecard
- [x] **SC.C6** C6 segment signed off in scorecard
- [x] **SC.D1** D1 segment signed off in scorecard
- [x] **SC.D2** D2 segment signed off in scorecard
- [x] **SC.D3** D3 segment signed off in scorecard
- [x] **SC.D4** D4 segment signed off in scorecard
- [x] **SC.D5** D5 segment signed off in scorecard
- [x] **SC.E1** E1 segment signed off in scorecard
- [x] **SC.E2** E2 segment signed off in scorecard
- [x] **SC.E3** E3 segment signed off in scorecard
- [x] **SC.E4** E4 segment signed off in scorecard
- [x] **SC.F1** F1 segment signed off in scorecard
- [x] **SC.F2** F2 segment signed off in scorecard
- [x] **SC.F3** F3 segment signed off in scorecard
- [x] **SC.F4** F4 segment signed off in scorecard
- [x] **SC.F5** F5 segment signed off in scorecard
- [x] **SC.F6** F6 segment signed off in scorecard

## Appendix K — Conditional deep dives DD.006–032

- [x] **DD.A1** Deep dive if A1 scored Warn/Fail
- [x] **DD.A2** Deep dive if A2 scored Warn/Fail
- [x] **DD.A3** Deep dive if A3 scored Warn/Fail
- [x] **DD.A4** Deep dive if A4 scored Warn/Fail
- [x] **DD.A5** Deep dive if A5 scored Warn/Fail
- [x] **DD.A6** Deep dive if A6 scored Warn/Fail
- [x] **DD.A7** Deep dive if A7 scored Warn/Fail
- [x] **DD.B1** Deep dive if B1 scored Warn/Fail
- [x] **DD.B2** Deep dive if B2 scored Warn/Fail
- [x] **DD.B3** Deep dive if B3 scored Warn/Fail
- [x] **DD.B4** Deep dive if B4 scored Warn/Fail
- [x] **DD.B5** Deep dive if B5 scored Warn/Fail
- [x] **DD.B6** Deep dive if B6 scored Warn/Fail
- [x] **DD.B7** Deep dive if B7 scored Warn/Fail
- [x] **DD.C1** Deep dive if C1 scored Warn/Fail
- [x] **DD.C2** Deep dive if C2 scored Warn/Fail
- [x] **DD.C3** Deep dive if C3 scored Warn/Fail
- [x] **DD.C4** Deep dive if C4 scored Warn/Fail
- [x] **DD.C5** Deep dive if C5 scored Warn/Fail
- [x] **DD.C6** Deep dive if C6 scored Warn/Fail
- [x] **DD.D1** Deep dive if D1 scored Warn/Fail
- [x] **DD.D2** Deep dive if D2 scored Warn/Fail
- [x] **DD.D3** Deep dive if D3 scored Warn/Fail
- [x] **DD.D4** Deep dive if D4 scored Warn/Fail
- [x] **DD.D5** Deep dive if D5 scored Warn/Fail
- [x] **DD.E1** Deep dive if E1 scored Warn/Fail
- [x] **DD.E2** Deep dive if E2 scored Warn/Fail
- [x] **DD.E3** Deep dive if E3 scored Warn/Fail
- [x] **DD.E4** Deep dive if E4 scored Warn/Fail
- [x] **DD.F1** Deep dive if F1 scored Warn/Fail
- [x] **DD.F2** Deep dive if F2 scored Warn/Fail
- [x] **DD.F3** Deep dive if F3 scored Warn/Fail
- [x] **DD.F4** Deep dive if F4 scored Warn/Fail
- [x] **DD.F5** Deep dive if F5 scored Warn/Fail
- [x] **DD.F6** Deep dive if F6 scored Warn/Fail

## Appendix D — Cursor todo sync

- **968 todos** in [`platform_audit_master_fbbe4d03.plan.md`](file:///c:/Users/Sh3ik/.cursor/plans/platform_audit_master_fbbe4d03.plan.md) frontmatter (1:1 with checkboxes + SC + conditional DD).
- Re-sync: `node scripts/generate-audit-plan-todos.mjs` (Agent mode).
