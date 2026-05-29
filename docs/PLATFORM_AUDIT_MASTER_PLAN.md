# Platform Audit Master Plan (v3 — complete)

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

- [ ] **P0.001** Create this file as repo mirror (done when approved)
- [ ] **P0.002** Create `docs/audits/PLATFORM_AUDIT_SCORECARD.md`
- [ ] **P0.003** Record git SHA, Node, npm versions
- [ ] **P0.004** Env checklist template (Stripe, Supabase, Sheets, Calendly) — no secrets committed
- [ ] **P0.005** Port map: 3000/3001/3002/3050/5174 + conflict resolution
- [ ] **P0.006** Index link: PRE_LAUNCH_LEGAL_SEO, LEGAL_FAQ, PORTAL_CONVERSION, BOOKING_CRM_REPLICATION, REGIONAL_AVAILABILITY
- [ ] **P0.007** Run `node scripts/generate-audit-plan-todos.mjs` → sync Cursor plan todos
- [ ] **P0.008** Severity rubric P0–P3 + segment owners
- [ ] **P0.009** Deep-dive report template in `docs/audits/`
- [ ] **P0.010** Tracker labels/milestones for audit program

---

## Phase 1 — Automated gates (one checkbox per command)

- [ ] **P1.001** `npm run build`
- [ ] **P1.002** `npm run lint`
- [ ] **P1.003** `npm run validate:regional`
- [ ] **P1.004** `npm run qa:regional`
- [ ] **P1.005** `npm run test:regional`
- [ ] **P1.006** `npm run test:legal-seo`
- [ ] **P1.007** `node scripts/legal-seo-check.mjs`
- [ ] **P1.008** `npm run audit:images`
- [ ] **P1.009** `npm run spot-check:checkout-api`
- [ ] **P1.010** `npm run spot-check:india-pmp`
- [ ] **P1.011** `npm run verify:regional-dev`
- [ ] **P1.012** Update scorecard with all Phase 1 results

---

# PART A — Architecture and backend

## A1 — Monorepo structure (A1.001–A1.020)

- [ ] **A1.001** Verify 6 workspaces in root package.json
- [ ] **A1.002** Map duplicated logic: frontend vs dashboard vs packages
- [ ] **A1.003** `@pms/booking-crm` single source for channel/portal
- [ ] **A1.004** `@pms/ui` adoption vs local `components/ui`
- [ ] **A1.005** `sheets-env.ts` dashboard frontend vs backend drift
- [ ] **A1.006** `data/channel-landing-pages.json` ↔ `packages/booking-crm/data/`
- [ ] **A1.007** `sync:portal-data` in deploy checklist
- [ ] **A1.008** Regional JSON ↔ Supabase (`sync-regional-catalogue-to-supabase.mjs`)
- [ ] **A1.009** `siteData.certifications[].id` ↔ matrix offeringIds
- [ ] **A1.010** Dual lockfile / `outputFileTracingRoot` warnings
- [ ] **A1.011** Env naming: `NEXT_PUBLIC_API_URL`, `BACKEND_URL`, `DEV_*`
- [ ] **A1.012** `BOOKING_CRM_REPLICATION_MAP.md` vs code
- [ ] **A1.013** `PORTAL_CONVERSION_ENABLED_WAVE` vs `portalConversionPacks.ts`
- [ ] **A1.014** Dashboard UI parity plan vs `@pms/ui` completion
- [ ] **A1.015** Inventory `scripts/migrate-portal-*` (one-time vs repeatable)
- [ ] **A1.016** `packages/regional-catalogue` role and build
- [ ] **A1.017** `channel-context-briefs.json` usage
- [ ] **A1.018** Calendly URLs: package vs `frontend/lib/calendly`
- [ ] **A1.019** `getGoSlugRedirects()` vs sitemap published slugs
- [ ] **A1.020** Import cycle scan all workspaces

## A2 — API contracts (A2.001–A2.034)

Site API (`backend/app/api/`):

- [ ] **A2.001** `/api/health`
- [ ] **A2.002** `/api/catalogue`
- [ ] **A2.003** `/api/catalogue/offerings/[id]`
- [ ] **A2.004** `/api/checkout/create`
- [ ] **A2.005** `/api/checkout/session/[id]`
- [ ] **A2.006** `/api/stripe/webhook` (signature, idempotency, orders)
- [ ] **A2.007** `/api/consultation`
- [ ] **A2.008** `/api/waitlist`
- [ ] **A2.009** `/api/scholarship-review`
- [ ] **A2.010** `/api/interactions`
- [ ] **A2.011** `/api/region/verify`
- [ ] **A2.012** `/api/regions`
- [ ] **A2.013** `/api/profile/region`

Dashboard API:

- [ ] **A2.014** `/api/admin/consultations`
- [ ] **A2.015** `/api/admin/consultations/[id]/approve`
- [ ] **A2.016** `/api/admin/orders`
- [ ] **A2.017** `/api/admin/scholarship-review`
- [ ] **A2.018** `/api/admin/verification-logs`
- [ ] **A2.019** `/api/interactions` (admin)
- [ ] **A2.020** `/api/interactions/sheets`
- [ ] **A2.021** `/api/interactions/sheets/export`
- [ ] **A2.022** `/api/interactions/[id]/retry-sheets`
- [ ] **A2.023** `/api/interactions/export`
- [ ] **A2.024** `/api/profile/region` (dashboard)

Other:

- [ ] **A2.025** Dashboard `channel-landing-pages` GET/POST + auth
- [ ] **A2.026** Frontend `/api/*` rewrite → backend
- [ ] **A2.027** Dashboard API proxy config
- [ ] **A2.028** `dev-gateway.mjs` routing matrix
- [ ] **A2.029** Production: dash API not on public domain
- [ ] **A2.030** Consistent error JSON
- [ ] **A2.031** Correct HTTP status codes
- [ ] **A2.032** Rate limit public POSTs
- [ ] **A2.033** No PII in logs
- [ ] **A2.034** OpenAPI-style route inventory doc

## A3 — Auth (A3.001–A3.016)

- [ ] **A3.001** Supabase env on dashboard
- [ ] **A3.002** Login flow
- [ ] **A3.003** Update-password flow
- [ ] **A3.004** ProtectedRoute all `/dashboard/*`
- [ ] **A3.005** Demo login disabled in prod
- [ ] **A3.006** Logout from DashboardLayout
- [ ] **A3.007** admin-guard frontend
- [ ] **A3.008** admin-guard backend parity
- [ ] **A3.009** channel-landing POST rejects anon
- [ ] **A3.010** Dev bypass blocked in prod
- [ ] **A3.011** RLS website_data published read
- [ ] **A3.012** RLS form_submissions public insert
- [ ] **A3.013** RLS authenticated read/update
- [ ] **A3.014** Regional tables RLS (if any)
- [ ] **A3.015** Service role server-only
- [ ] **A3.016** Pen-test admin mutations

## A4 — Data (A4.001–A4.012)

- [ ] **A4.001** Migration `20240517000000_initial_schema.sql`
- [ ] **A4.002** Migration `20260523100000_regional_catalogue.sql`
- [ ] **A4.003** Migration `20260523100001_seed_regions.sql`
- [ ] **A4.004** Migration `20260523100002_catalogue_meta.sql`
- [ ] **A4.005** Fresh DB + migrate smoke test
- [ ] **A4.006** website_data field_key consumers
- [ ] **A4.007** Checkout order before Stripe session
- [ ] **A4.008** Webhook updates orders.status
- [ ] **A4.009** form_submissions.sheets_status lifecycle
- [ ] **A4.010** Channel JSON write path
- [ ] **A4.011** Regional Supabase sync integrity
- [ ] **A4.012** Backup/restore procedure

## A5 — Integrations (A5.001–A5.016)

- [ ] **A5.001** STRIPE_SECRET_KEY server-only
- [ ] **A5.002** STRIPE_WEBHOOK_SECRET configured
- [ ] **A5.003** Stripe success/cancel URLs per env
- [ ] **A5.004** Stripe amounts match matrix usdCents
- [ ] **A5.005** Stripe refund/chargeback policy
- [ ] **A5.006** Calendly NEXT_PUBLIC_* overrides
- [ ] **A5.007** Calendly tier → event type mapping
- [ ] **A5.008** Calendly UTM / booking notes channel evidence
- [ ] **A5.009** Portal embed opens correct Calendly URL
- [ ] **A5.010** GOOGLE_SHEETS service account auth
- [ ] **A5.011** GOOGLE_SHEETS_SPREADSHEET_ID + RANGE
- [ ] **A5.012** Sheets → Supabase fallback
- [ ] **A5.013** retry-sheets route
- [ ] **A5.014** NEXT_PUBLIC_INTERACTIONS_REALTIME_CHANNEL
- [ ] **A5.015** Dashboard realtime refresh on submit
- [ ] **A5.016** Sheets export CSV columns complete

## A6 — Build (A6.001–A6.010)

- [ ] **A6.001** Build `@pms/frontend`
- [ ] **A6.002** Build `@pms/backend`
- [ ] **A6.003** Build `@pms/dashboard-frontend`
- [ ] **A6.004** Build `@pms/dashboard-backend`
- [ ] **A6.005** Lint all four apps
- [ ] **A6.006** SSG all `/go/[channel]` slugs
- [ ] **A6.007** `clean:next` runbook documented
- [ ] **A6.008** Types: OfferingStatus
- [ ] **A6.009** Types: ChannelLandingPage vs JSON
- [ ] **A6.010** Types: RegionId exhaustiveness

## A7 — Legacy / orphans (A7.001–A7.040)

Redirects:

- [ ] **A7.001** `/store` → community store view
- [ ] **A7.002** `/compare` → certifications/compare
- [ ] **A7.003** `/privacy` → legal/privacy
- [ ] **A7.004** `/legalhub` → `/legal`
- [ ] **A7.005** `/legal/pricing` → pricing-disclaimers
- [ ] **A7.006** Legacy `/go/*` slug redirects

Dashboard middleware:

- [ ] **A7.007** members-revenue → booking-crm
- [ ] **A7.008** CTA page strips category/channel query

Placeholder pages (must document ship vs build):

- [ ] **A7.009** `/dashboard/control-tower`
- [ ] **A7.010** `/dashboard/migrate`
- [ ] **A7.011** `/dashboard/site-system/analytics`
- [ ] **A7.012** `/dashboard/booking-crm/users`
- [ ] **A7.013** `/dashboard/site-system/security`
- [ ] **A7.014** `/dashboard/booking-crm/members`
- [ ] **A7.015** `/dashboard/booking-crm/monetization`
- [ ] **A7.016** `/dashboard/site-system/seo`

Other:

- [ ] **A7.017** `OfferingCtaButtons.tsx` dead code
- [ ] **A7.018** Orphan `gw-*` classes grep
- [ ] **A7.019** DASHBOARD_ROUTES vs pages 404
- [ ] **A7.020** PUBLIC_SITE_PAGES vs editors
- [ ] **A7.021** Unused export scan booking-crm #1
- [ ] **A7.022** Unused export scan booking-crm #2
- [ ] **A7.023** Unused export scan booking-crm #3
- [ ] **A7.024** Unused export scan booking-crm #4
- [ ] **A7.025** Unused export scan booking-crm #5
- [ ] **A7.026** Unused export scan booking-crm #6
- [ ] **A7.027** Unused export scan booking-crm #7
- [ ] **A7.028** Unused export scan booking-crm #8
- [ ] **A7.029** Unused export scan booking-crm #9
- [ ] **A7.030** Unused export scan booking-crm #10
- [ ] **A7.031** Unused export scan booking-crm #11
- [ ] **A7.032** Unused export scan booking-crm #12
- [ ] **A7.033** Unused export scan booking-crm #13
- [ ] **A7.034** Unused export scan booking-crm #14
- [ ] **A7.035** Unused export scan booking-crm #15
- [ ] **A7.036** Unused export scan booking-crm #16
- [ ] **A7.037** Unused export scan booking-crm #17
- [ ] **A7.038** Unused export scan booking-crm #18
- [ ] **A7.039** Unused export scan booking-crm #19
- [ ] **A7.040** Unused export scan booking-crm #20

---

# PART B — UI / UX

## B1 — Design system (B1.001–B1.022)

- [ ] **B1.001** `packages/ui` globals.css tokens
- [ ] **B1.002** Montserrat fonts export
- [ ] **B1.003** Button brand + brandOutline
- [ ] **B1.004** StatChip
- [ ] **B1.005** AlertDialog
- [ ] **B1.006** GlassCard
- [ ] **B1.007** CTAButton adapter
- [ ] **B1.008** z-modal + modal-scrim
- [ ] **B1.009** Toast semantic tokens
- [ ] **B1.010** Theme key `theme` unified
- [ ] **B1.011** Website imports `@pms/ui`
- [ ] **B1.012** Dashboard imports `@pms/ui`
- [ ] **B1.013** Portal uses GlassCard / portal tokens
- [ ] **B1.014** Adoption matrix spreadsheet
- [ ] **B1.015** Grep hardcoded slate vs semantic
- [ ] **B1.016** Dashboard components/ui migration backlog
- [ ] **B1.017** Dialog/Sheet parity
- [ ] **B1.018** motion-reduce on shell
- [ ] **B1.019** README token mapping accuracy
- [ ] **B1.020** Dark mode parity both apps
- [ ] **B1.021** Border radius scale consistency
- [ ] **B1.022** Deep-dive: complete ui package migration

## B2 — Navigation (B2.001–B2.020)

- [ ] **B2.001** Website navbar + active states
- [ ] **B2.002** Website footer entity/email env
- [ ] **B2.003** Region selector modal persistence
- [ ] **B2.004** Mobile menu complete
- [ ] **B2.005** Dashboard sidebar collapse/hover
- [ ] **B2.006** Dashboard three modes (publisher/bookings/website)
- [ ] **B2.007** View Site link URL
- [ ] **B2.008** Logout DropdownMenu
- [ ] **B2.009** Mobile sidebar overlay + a11y
- [ ] **B2.010** Portal site chips links
- [ ] **B2.011** Gateway :3000 vs direct :3050 parity test
- [ ] **B2.012** Cross-link: cert hub to detail
- [ ] **B2.013** Cross-link: detail to compare
- [ ] **B2.014** Cross-link: compare to contact
- [ ] **B2.015** Cross-link: contact to checkout
- [ ] **B2.016** Cross-link: footer legal links
- [ ] **B2.017** Cross-link: footer region link
- [ ] **B2.018** Cross-link: membership from nav
- [ ] **B2.019** Cross-link: community from nav
- [ ] **B2.020** Cross-link: newsletter from nav

## B3 — Page templates (every route)

Website:

- [ ] **B3.001** `/` Home
- [ ] **B3.002** `/about`
- [ ] **B3.003** `/certifications`
- [ ] **B3.004** `/certifications/compare`
- [ ] **B3.005** `/certifications/pmp` (sample flagship)
- [ ] **B3.006** `/certifications/capm` (allowlist edge)
- [ ] **B3.007** `/certifications/pmi-rmp` (no mastery)
- [ ] **B3.008** `/checkout`
- [ ] **B3.009** `/checkout/success`
- [ ] **B3.010** `/checkout/cancel`
- [ ] **B3.011** `/contact`
- [ ] **B3.012** `/faq`
- [ ] **B3.013** `/legal` hub
- [ ] **B3.014** `/membership`
- [ ] **B3.015** `/community`
- [ ] **B3.016** `/newsletter` + one slug
- [ ] **B3.017** `/pm-service`
- [ ] **B3.018** `/go/website`
- [ ] **B3.019** `/go/linkedin`
- [ ] **B3.020** `/go/tiktok` (impulse tier pricing)
- [ ] **B3.021** `not-found` + `error` pages

Dashboard functional (non-placeholder):

- [ ] **B3.022** `/login`
- [ ] **B3.023** `/login/update-password`
- [ ] **B3.024** `/dashboard`
- [ ] **B3.025** `/dashboard/site-system/home`
- [ ] **B3.026** `/dashboard/booking-crm/cta`
- [ ] **B3.027** `/dashboard/booking-crm/interactions/sheets`
- [ ] **B3.028** `/dashboard/booking-crm/consultations`
- [ ] **B3.029** `/dashboard/booking-crm/bookings`
- [ ] **B3.030** `/dashboard/booking-crm/verification-logs`
- [ ] **B3.031** `/dashboard/booking-crm/scholarship-review`
- [ ] **B3.032** `/dashboard/account/region`
- [ ] **B3.033** `/dashboard/site-system/settings`
- [ ] **B3.034** `/dashboard/site-system/pages/[slug]` sample

## B4 — CMS / admin (B4.001–B4.020)

- [ ] **B4.001** HomeCmsEditor Tabs
- [ ] **B4.002** Home preview Dialog
- [ ] **B4.003** ChannelLandingEditor save round-trip
- [ ] **B4.004** Channel preview URL `?preview=1`
- [ ] **B4.005** CTACollection category Dialog
- [ ] **B4.006** CTACollection channel manage Dialog
- [ ] **B4.007** Delete category AlertDialog
- [ ] **B4.008** Delete channel AlertDialog
- [ ] **B4.009** InteractionsSheetsRecords Sheet detail
- [ ] **B4.010** Sheets export
- [ ] **B4.011** Sheets search/filter
- [ ] **B4.012** Consultations queue UI
- [ ] **B4.013** Bookings queue UI
- [ ] **B4.014** Verification logs UI
- [ ] **B4.015** Scholarship review UI
- [ ] **B4.016** SyncStatusIndicator
- [ ] **B4.017** AdminCmsFilterToolbar
- [ ] **B4.018** EmptyState / PageSkeleton
- [ ] **B4.019** BlogEditor + NewsletterManagement
- [ ] **B4.020** Publish vs draft banner behavior

## B5 — Responsive (B5.001–B5.020)

Gate URLs at 320, 390, 768, 1024, 1440:

- [ ] **B5.001** / @ 320px
- [ ] **B5.002** / @ 390px
- [ ] **B5.003** / @ 768px
- [ ] **B5.004** / @ 1024px
- [ ] **B5.005** / @ 1440px
- [ ] **B5.006** /certifications/pmp @ 320px
- [ ] **B5.007** /certifications/pmp @ 390px
- [ ] **B5.008** /certifications/pmp @ 768px
- [ ] **B5.009** /certifications/pmp @ 1024px
- [ ] **B5.010** /certifications/pmp @ 1440px
- [ ] **B5.011** /go/website @ 320px
- [ ] **B5.012** /go/website @ 390px
- [ ] **B5.013** /go/website @ 768px
- [ ] **B5.014** /go/website @ 1024px
- [ ] **B5.015** /go/website @ 1440px
- [ ] **B5.016** Portal sticky CTA clearance
- [ ] **B5.017** Compare table horizontal scroll
- [ ] **B5.018** Checkout form mobile
- [ ] **B5.019** Dashboard sidebar mobile
- [ ] **B5.020** Region modal mobile

## B6 — Accessibility (B6.001–B6.025)

- [ ] **B6.001** axe `/`
- [ ] **B6.002** axe `/certifications/pmp`
- [ ] **B6.003** axe `/checkout`
- [ ] **B6.004** axe `/faq`
- [ ] **B6.005** axe `/legal/privacy`
- [ ] **B6.006** axe `/go/website`
- [ ] **B6.007** axe `/dashboard/login`
- [ ] **B6.008** Keyboard dialog focus trap
- [ ] **B6.009** PortalExpandableSection aria-expanded
- [ ] **B6.010** Form labels contact/login/checkout
- [ ] **B6.011** Contrast home hero
- [ ] **B6.012** Contrast portal CTA
- [ ] **B6.013** motion-reduce portal
- [ ] **B6.014** Heading order home
- [ ] **B6.015** Heading order cert
- [ ] **B6.016** Skip link (if any)
- [ ] **B6.017** Focus visible buttons
- [ ] **B6.018** Live region toasts
- [ ] **B6.019** aria-live sheets
- [ ] **B6.020** Table scope compare
- [ ] **B6.021** Link text descriptiveness
- [ ] **B6.022** Image decorative alt
- [ ] **B6.023** Form error announcements
- [ ] **B6.024** Modal aria-labelledby
- [ ] **B6.025** Dashboard login labels

## B7 — Performance (B7.001–B7.012)

- [ ] **B7.001** Lighthouse `/` mobile
- [ ] **B7.002** Lighthouse `/` desktop
- [ ] **B7.003** Lighthouse `/certifications/pmp`
- [ ] **B7.004** Lighthouse `/go/website`
- [ ] **B7.005** Lighthouse `/checkout`
- [ ] **B7.006** Bundle size outliers from build log
- [ ] **B7.007** `audit:images`
- [ ] **B7.008** Font FOUC script
- [ ] **B7.009** regional-catalogue.json parse cost
- [ ] **B7.010** Portal theme hook perf
- [ ] **B7.011** Dashboard realtime subscription cleanup
- [ ] **B7.012** SEO Lighthouse ≥90 sample URLs

---

# PART C — Conversion

## C1 — Portal (42 channels × 2 modes + flow)

**Flow (all channels):**

- [ ] **C1.F01** `usesProConsultationPortalLayout` true
- [ ] **C1.F02** `PROFESSIONAL_FLOW` section order
- [ ] **C1.F03** Presence strip (no sticky top hero)
- [ ] **C1.F04** In-column hero stack
- [ ] **C1.F05** `portal-website` shell + ambience
- [ ] **C1.F06** `PortalSiteChips` under qualification
- [ ] **C1.F07** `engagementLinks` false in hero
- [ ] **C1.F08** mentor-intro → Talk to a mentor
- [ ] **C1.F09** career-pathway → Book pathway session
- [ ] **C1.F10** No Best for / Outcome on tier cards
- [ ] **C1.F11** BRAND.fullName in hero
- [ ] **C1.F12** No "Independent" in marketing copy
- [ ] **C1.F13** Fix `vk` missing copy pack
- [ ] **C1.F14** Sticky mobile CTA
- [ ] **C1.F15** Preview banner `?preview=1`

**Per channel (live + preview):** all 42 slugs — see **Appendix E** (todo ids `c1-live-{slug}`, `c1-preview-{slug}`).

## C2 — Certification pathways (27 certs × regions)

**27 certs × 5 passes each** — see **Appendix F** (todo ids `c2-{id}-pathway`, `c2-{id}-{region}`).

Global:

- [ ] **C2.G01** `resolveTierPathwayCta` labels (View and enroll / Book consultation)
- [ ] **C2.G02** `pathway-from-catalogue.test.ts` all certs
- [ ] **C2.G03** `pathway-tier-allowlist.ts`
- [ ] **C2.G04** Bottom banner foundation CTA label
- [ ] **C2.G05** Programme preview modal all offeringIds

## C3 — Checkout (C3.001–C3.015)

- [ ] **C3.001** `/checkout?offering=` resolves
- [ ] **C3.002** scholarship_verify gate
- [ ] **C3.003** global_checkout fallback
- [ ] **C3.004** create session API
- [ ] **C3.005** Stripe Checkout UI
- [ ] **C3.006** success page
- [ ] **C3.007** cancel page
- [ ] **C3.008** webhook → order paid
- [ ] **C3.009** admin orders queue
- [ ] **C3.010** E2E foundation tier test mode
- [ ] **C3.011** E2E professional consult path
- [ ] **C3.012** E2E mastery consult path
- [ ] **C3.013** Membership pricing at checkout
- [ ] **C3.014** Membership Stripe price IDs
- [ ] **C3.015** Membership success/cancel copy

## C4 — Brand voice (C4.001–C4.012)

- [ ] **C4.001** Grep banned: draft template
- [ ] **C4.002** Grep banned: counsel review
- [ ] **C4.003** Grep banned: legal@pmstructure
- [ ] **C4.004** Grep banned: (placeholder)
- [ ] **C4.005** Grep banned: Template reference only
- [ ] **C4.006** Grep banned: confirm with local counsel
- [ ] **C4.007** Grep banned: Clarity call
- [ ] **C4.008** Grep banned: Independent (marketing)
- [ ] **C4.009** `brand-voice.ts` CTAS used in UI
- [ ] **C4.010** No "Clarity call"
- [ ] **C4.011** No marketing "Independent"
- [ ] **C4.012** Channel editor placeholder copy audit

## C5 — Regional UX (C5.001–C5.012)

- [ ] **C5.001** Region selector global on PMP
- [ ] **C5.002** Region selector eu on PMP
- [ ] **C5.003** Region selector uk on PMP
- [ ] **C5.004** Region selector india on PMP
- [ ] **C5.005** Region selector pakistan on PMP
- [ ] **C5.006** Region selector gcc on PMP
- [ ] **C5.007** Compare matrix status chips
- [ ] **C5.008** Mastery unavailable messages India/Pakistan
- [ ] **C5.009** GCC country sub-selector
- [ ] **C5.010** Scholarship label chips
- [ ] **C5.011** Global reference pricing display
- [ ] **C5.012** Footer link to regional-pricing legal

## C6 — CRM handoff (C6.001–C6.010)

- [ ] **C6.001** Contact → sheets
- [ ] **C6.002** Consultation → consultations queue
- [ ] **C6.003** Scholarship → scholarship queue
- [ ] **C6.004** Waitlist → sheets/contact
- [ ] **C6.005** Region verify → verification logs
- [ ] **C6.006** Checkout → orders
- [ ] **C6.007** Sheets retry
- [ ] **C6.008** Export CSV
- [ ] **C6.009** Realtime refresh
- [ ] **C6.010** Approve consultation flow

---

# PART D — Content / legal / SEO

## D1 — Legal (17 slugs + regional privacy)

- [ ] **D1.terms** `/legal/terms`
- [ ] **D1.privacy** `/legal/privacy` hub
- [ ] **D1.cookies** `/legal/cookies`
- [ ] **D1.services** `/legal/services`
- [ ] **D1.pricing-disclaimers** `/legal/pricing-disclaimers`
- [ ] **D1.refunds** `/legal/refunds`
- [ ] **D1.membership-terms** `/legal/membership-terms`
- [ ] **D1.regional-pricing** `/legal/regional-pricing`
- [ ] **D1.accessibility** `/legal/accessibility`
- [ ] **D1.acceptable-use** `/legal/acceptable-use`
- [ ] **D1.marketing** `/legal/marketing`
- [ ] **D1.subprocessors** `/legal/subprocessors`
- [ ] **D1.dmca** `/legal/dmca`
- [ ] **D1.tax** `/legal/tax`
- [ ] **D1.security** `/legal/security`
- [ ] **D1.complaints** `/legal/complaints`
- [ ] **D1.ai** `/legal/ai`
- [ ] **D1.dpa** `/legal/dpa`
- [ ] **D1.privacy.eu** `/legal/privacy/eu`
- [ ] **D1.privacy.uk** `/legal/privacy/uk`
- [ ] **D1.privacy.india** `/legal/privacy/india`
- [ ] **D1.privacy.pakistan** `/legal/privacy/pakistan`
- [ ] **D1.privacy.gcc** `/legal/privacy/gcc`
- [ ] **D1.privacy.global** baseline sections
- [ ] **D1.privacy.gcc-countries** all GCC country slugs in sitemap
- [ ] **D1.redirects** legalhub, `/privacy`, pricing alias
- [ ] **D1.support-email** support@pmstructure.com only (no legal@)

## D2 — SEO (D2.001–D2.022)

- [ ] **D2.001** sitemap.xml includes certs, go, legal, newsletter
- [ ] **D2.002** robots.txt
- [ ] **D2.003** llms.txt if used
- [ ] **D2.004** canonicals www.pmstructure.com
- [ ] **D2.005** generateMetadata home
- [ ] **D2.006** generateMetadata certifications
- [ ] **D2.007** generateMetadata pmp
- [ ] **D2.008** generateMetadata checkout
- [ ] **D2.009** generateMetadata faq
- [ ] **D2.010** generateMetadata legal
- [ ] **D2.011** generateMetadata go/website
- [ ] **D2.011** Organization JSON-LD
- [ ] **D2.012** Course JSON-LD cert pages
- [ ] **D2.013** FAQPage JSON-LD
- [ ] **D2.014** OG default.png exists
- [ ] **D2.015** Post-deploy: Rich Results test home
- [ ] **D2.016** Post-deploy: Rich Results test cert
- [ ] **D2.017** Post-deploy: Screaming Frog crawl
- [ ] **D2.018** Post-deploy: AI spot-check brand
- [ ] **D2.019** Post-deploy: Bing Webmaster
- [ ] **D2.020** Post-deploy: GSC coverage
- [ ] **D2.021** Post-deploy: hreflang (if any)
- [ ] **D2.022** Post-deploy: 404 sitemap orphans

## D3 — FAQ (D3.001–D3.010)

- [ ] **D3.001** FAQ count ≥65 (`legal-seo.test.ts`)
- [ ] **D3.002** All clusters present per [FAQ_ANSWER_SPEC.md](FAQ_ANSWER_SPEC.md)
- [ ] **D3.003** Tab navigation keyboard + aria
- [ ] **D3.004** Search/filter returns relevant results
- [ ] **D3.005** FAQPage JSON-LD on `/faq`
- [ ] **D3.006** No banned draft strings in `content/faq/data.ts`
- [ ] **D3.007** support@pmstructure.com in privacy/support clusters (not legal@)
- [ ] **D3.008** Cross-links from cert pages to relevant FAQ anchors
- [ ] **D3.009** Regional pricing FAQ aligns with matrix
- [ ] **D3.010** Scholarship / verification FAQ matches live flows

## D4 — CMS drift (11 PUBLIC_SITE_PAGES slugs)

- [ ] **D4.001** `home` — HomeCms vs `/`
- [ ] **D4.002** `certifications` — hub copy vs live
- [ ] **D4.003** `pm-service` — services page
- [ ] **D4.004** `newsletter` — listing + sample article
- [ ] **D4.005** `community` — community + store view
- [ ] **D4.006** `store` — `/community?view=store`
- [ ] **D4.007** `about`
- [ ] **D4.008** `compare` — `/certifications/compare`
- [ ] **D4.009** `faq`
- [ ] **D4.010** `contact`
- [ ] **D4.011** `membership`
- [ ] **D4.012** Publish banner / draft state documented per page

## D5 — Media (D5.001–D5.010)

- [ ] **D5.001** `npm run audit:images` pass
- [ ] **D5.002** No picsum / placeholder URLs in production paths
- [ ] **D5.003** OG `default.png` exists and referenced
- [ ] **D5.004** Cert / pathway hero images have alt text
- [ ] **D5.005** Portal channel images optimized (webp where applicable)
- [ ] **D5.006** Family logos (PMI, AXELOS, etc.) license/display correct
- [ ] **D5.007** Newsletter article images
- [ ] **D5.008** Favicon / apple-touch-icon set
- [ ] **D5.009** Video embeds (webinar portal) poster + captions policy
- [ ] **D5.010** Dashboard CMS upload paths documented

---

# PART E — Data integrity

## E1 — 55 offerings

- [ ] **E1.000** validate-regional-catalogue.mjs pass
- [ ] **E1.000b** qa-regional-matrix.mjs pass

All 55 `offeringId` rows — see **Appendix G** (todo ids `e1-{offeringId}`).

## E2 — 42 channels

See **Appendix H** (todo ids `e2-{slug}`).

## E3 — 27 certs

See **Appendix I** (todo ids `e3-{id}`).

## E4 — CRM replication map (E4.001–E4.010)

- [ ] **E4.001** `/dashboard/booking-crm/cta` loads
- [ ] **E4.002** `/dashboard/booking-crm/interactions/sheets` loads
- [ ] **E4.003** `/go/linkedin` published render
- [ ] **E4.004** `/go/linkedin?preview=1` draft behavior
- [ ] **E4.005** POST channel-landing-pages auth
- [ ] **E4.006** Legacy members-revenue redirect
- [ ] **E4.007** Repository single source `packages/booking-crm`
- [ ] **E4.008** Sheets dual-source API parity
- [ ] **E4.009** `NEXT_PUBLIC_MARKETING_SITE_URL` share links
- [ ] **E4.010** BOOKING_CRM_REPLICATION_MAP status table current

---

# PART F — Security / ops

## F1 — Env (F1.001–F1.015)

- [ ] **F1.001** `frontend/.env.example` complete
- [ ] **F1.002** `backend/.env.example` complete
- [ ] **F1.003** `dashboard/frontend/.env.example` complete
- [ ] **F1.004** `dashboard/backend/.env.example` complete
- [ ] **F1.005** No `.env` committed (gitignore)
- [ ] **F1.006** Stripe keys server-only
- [ ] **F1.007** Supabase anon vs service role separation
- [ ] **F1.008** Google Sheets credentials path documented
- [ ] **F1.009** Calendly public URLs only in `NEXT_PUBLIC_*`
- [ ] **F1.010** `NEXT_PUBLIC_ALLOW_DEMO_LOGIN` prod off
- [ ] **F1.011** Railway / prod env checklist
- [ ] **F1.012** `DEV_*` gateway vars local only
- [ ] **F1.013** `BACKEND_URL` vs `NEXT_PUBLIC_API_URL` matrix
- [ ] **F1.014** CORS / same-origin dashboard API
- [ ] **F1.015** Secret rotation runbook stub

## F2 — Security (F2.001–F2.010)

- [ ] **F2.001** **P0:** Stripe webhook signature verification ([backend/app/api/stripe/webhook/route.ts](../backend/app/api/stripe/webhook/route.ts))
- [ ] **F2.002** Webhook idempotency (duplicate events)
- [ ] **F2.003** Admin routes reject unauthenticated
- [ ] **F2.004** XSS review CMS rich text fields
- [ ] **F2.005** SSRF review external URL fetchers
- [ ] **F2.006** `npm audit` — document accepted risks
- [ ] **F2.007** Security headers (CSP, HSTS) production
- [ ] **F2.008** Cookie flags Supabase session
- [ ] **F2.009** File upload limits (if any)
- [ ] **F2.010** Dependency review `@supabase`, `stripe`, `xlsx`

## F3 — Test files (F3.001–F3.020)

- [ ] **F3.001** `frontend/lib/pathway-tier-outcomes.test.ts`
- [ ] **F3.002** `frontend/lib/pathway-programme-preview.test.ts`
- [ ] **F3.003** `frontend/lib/pathway-tier-cta.test.ts`
- [ ] **F3.004** `frontend/lib/cohort-intake-schedule.test.ts`
- [ ] **F3.005** `frontend/lib/dossier-text-bullets.test.ts`
- [ ] **F3.006** `frontend/lib/membership-regional-pricing.test.ts`
- [ ] **F3.007** `frontend/lib/membership-plans.test.ts`
- [ ] **F3.008** `frontend/lib/regional-checkout.integration.test.ts`
- [ ] **F3.009** `frontend/lib/regional-catalogue.test.ts`
- [ ] **F3.010** `frontend/lib/regional-fx-rates.test.ts`
- [ ] **F3.011** `frontend/content/legal/index.test.ts`
- [ ] **F3.012** `frontend/lib/compare-certifications.test.ts`
- [ ] **F3.013** `frontend/lib/price-parser.test.ts`
- [ ] **F3.014** `frontend/lib/certification-enrollment.test.ts`
- [ ] **F3.015** `frontend/lib/regional-price-display.test.ts`
- [ ] **F3.016** `frontend/lib/legal-seo.test.ts`
- [ ] **F3.017** `packages/booking-crm/.../portalConversionPacks.test.ts`
- [ ] **F3.018** `dashboard/frontend/lib/interactions/request-ip.test.ts`
- [ ] **F3.019** `dashboard/backend/lib/interactions/request-ip.test.ts`
- [ ] **F3.020** Gap: add `pathway-from-catalogue.test.ts` all certs + backend API tests

## F4 — Deploy readiness (F4.001–F4.008)

- [ ] **F4.001** `npm run build` CI gate
- [ ] **F4.002** Supabase migrations applied prod
- [ ] **F4.003** `npm run sync:portal-data` in deploy
- [ ] **F4.004** `sync-regional-catalogue-to-supabase.mjs` runbook
- [ ] **F4.005** Health check `/api/health` monitored
- [ ] **F4.006** Rollback procedure documented
- [ ] **F4.007** `clean:next` on failed deploy
- [ ] **F4.008** Multi-service Railway topology verified

## F5 — Observability (F5.001–F5.008)

- [ ] **F5.001** `frontend/app/error.tsx` + `not-found.tsx`
- [ ] **F5.002** Dashboard error boundaries
- [ ] **F5.003** API routes return structured errors
- [ ] **F5.004** Failed sheets status visible in CRM UI
- [ ] **F5.005** Loading skeletons on slow queues
- [ ] **F5.006** Toast on channel save failure
- [ ] **F5.007** Checkout error user messaging
- [ ] **F5.008** Log redaction review (no PII)

## F6 — Doc drift (F6.001–F6.008)

- [ ] **F6.001** [BOOKING_CRM_REPLICATION_MAP.md](BOOKING_CRM_REPLICATION_MAP.md)
- [ ] **F6.002** [PORTAL_CONVERSION_PLAN.md](PORTAL_CONVERSION_PLAN.md)
- [ ] **F6.003** [PRE_LAUNCH_LEGAL_SEO_AUDIT.md](PRE_LAUNCH_LEGAL_SEO_AUDIT.md)
- [ ] **F6.004** [REGIONAL_AVAILABILITY_IMPLEMENTATION_PLAN.md](REGIONAL_AVAILABILITY_IMPLEMENTATION_PLAN.md)
- [ ] **F6.005** [LEGAL_FAQ_CONTENT_AUDIT.md](LEGAL_FAQ_CONTENT_AUDIT.md)
- [ ] **F6.006** Root README dev ports
- [ ] **F6.007** `packages/ui/README.md` token map
- [ ] **F6.008** Archive or mark stale `docs/*.md` with dates

---

# Phase 8 — Deep dives

- [ ] **DD.001** Portal 42 slugs + Calendly all tier types
- [ ] **DD.002** Pathway 27 certs × regions
- [ ] **DD.003** Checkout Stripe E2E
- [ ] **DD.004** Security webhook + admin guards
- [ ] **DD.005** A11y gate URLs
Conditional deep dives **DD.006–DD.032** — see **Appendix K** (one per segment if Warn/Fail)

---

# Phase 9 — Remediation

- [ ] **R.001** P0 backlog prioritized
- [ ] **R.002** Fix sprint 1
- [ ] **R.003** Re-run Phase 1
- [ ] **R.004** Final scorecard
- [ ] **R.005** Counsel gate
- [ ] **R.006** GSC/Bing sitemap

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

- [ ] **C1.website.live** `/go/website`
- [ ] **C1.website.preview** `/go/website?preview=1`
- [ ] **C1.webinar.live** `/go/webinar`
- [ ] **C1.webinar.preview** `/go/webinar?preview=1`
- [ ] **C1.medium.live** `/go/medium`
- [ ] **C1.medium.preview** `/go/medium?preview=1`
- [ ] **C1.substack.live** `/go/substack`
- [ ] **C1.substack.preview** `/go/substack?preview=1`
- [ ] **C1.beehiiv.live** `/go/beehiiv`
- [ ] **C1.beehiiv.preview** `/go/beehiiv?preview=1`
- [ ] **C1.ghost.live** `/go/ghost`
- [ ] **C1.ghost.preview** `/go/ghost?preview=1`
- [ ] **C1.hashnode.live** `/go/hashnode`
- [ ] **C1.hashnode.preview** `/go/hashnode?preview=1`
- [ ] **C1.notion-public.live** `/go/notion-public`
- [ ] **C1.notion-public.preview** `/go/notion-public?preview=1`
- [ ] **C1.linkedin.live** `/go/linkedin`
- [ ] **C1.linkedin.preview** `/go/linkedin?preview=1`
- [ ] **C1.twitter.live** `/go/twitter`
- [ ] **C1.twitter.preview** `/go/twitter?preview=1`
- [ ] **C1.instagram.live** `/go/instagram`
- [ ] **C1.instagram.preview** `/go/instagram?preview=1`
- [ ] **C1.facebook.live** `/go/facebook`
- [ ] **C1.facebook.preview** `/go/facebook?preview=1`
- [ ] **C1.reddit.live** `/go/reddit`
- [ ] **C1.reddit.preview** `/go/reddit?preview=1`
- [ ] **C1.threads.live** `/go/threads`
- [ ] **C1.threads.preview** `/go/threads?preview=1`
- [ ] **C1.quora.live** `/go/quora`
- [ ] **C1.quora.preview** `/go/quora?preview=1`
- [ ] **C1.bluesky.live** `/go/bluesky`
- [ ] **C1.bluesky.preview** `/go/bluesky?preview=1`
- [ ] **C1.mastodon.live** `/go/mastodon`
- [ ] **C1.mastodon.preview** `/go/mastodon?preview=1`
- [ ] **C1.pinterest.live** `/go/pinterest`
- [ ] **C1.pinterest.preview** `/go/pinterest?preview=1`
- [ ] **C1.vk.live** `/go/vk`
- [ ] **C1.vk.preview** `/go/vk?preview=1`
- [ ] **C1.youtube.live** `/go/youtube`
- [ ] **C1.youtube.preview** `/go/youtube?preview=1`
- [ ] **C1.tiktok.live** `/go/tiktok`
- [ ] **C1.tiktok.preview** `/go/tiktok?preview=1`
- [ ] **C1.snapchat.live** `/go/snapchat`
- [ ] **C1.snapchat.preview** `/go/snapchat?preview=1`
- [ ] **C1.vimeo.live** `/go/vimeo`
- [ ] **C1.vimeo.preview** `/go/vimeo?preview=1`
- [ ] **C1.spotify.live** `/go/spotify`
- [ ] **C1.spotify.preview** `/go/spotify?preview=1`
- [ ] **C1.apple-podcasts.live** `/go/apple-podcasts`
- [ ] **C1.apple-podcasts.preview** `/go/apple-podcasts?preview=1`
- [ ] **C1.amazon-audible.live** `/go/amazon-audible`
- [ ] **C1.amazon-audible.preview** `/go/amazon-audible?preview=1`
- [ ] **C1.google-podcasts.live** `/go/google-podcasts`
- [ ] **C1.google-podcasts.preview** `/go/google-podcasts?preview=1`
- [ ] **C1.podbean.live** `/go/podbean`
- [ ] **C1.podbean.preview** `/go/podbean?preview=1`
- [ ] **C1.soundcloud.live** `/go/soundcloud`
- [ ] **C1.soundcloud.preview** `/go/soundcloud?preview=1`
- [ ] **C1.email.live** `/go/email`
- [ ] **C1.email.preview** `/go/email?preview=1`
- [ ] **C1.whatsapp.live** `/go/whatsapp`
- [ ] **C1.whatsapp.preview** `/go/whatsapp?preview=1`
- [ ] **C1.telegram.live** `/go/telegram`
- [ ] **C1.telegram.preview** `/go/telegram?preview=1`
- [ ] **C1.discord.live** `/go/discord`
- [ ] **C1.discord.preview** `/go/discord?preview=1`
- [ ] **C1.slack.live** `/go/slack`
- [ ] **C1.slack.preview** `/go/slack?preview=1`
- [ ] **C1.google-search.live** `/go/google-search`
- [ ] **C1.google-search.preview** `/go/google-search?preview=1`
- [ ] **C1.youtube-search.live** `/go/youtube-search`
- [ ] **C1.youtube-search.preview** `/go/youtube-search?preview=1`
- [ ] **C1.podcast-directories.live** `/go/podcast-directories`
- [ ] **C1.podcast-directories.preview** `/go/podcast-directories?preview=1`
- [ ] **C1.bing-search.live** `/go/bing-search`
- [ ] **C1.bing-search.preview** `/go/bing-search?preview=1`
- [ ] **C1.ai-visibility.live** `/go/ai-visibility`
- [ ] **C1.ai-visibility.preview** `/go/ai-visibility?preview=1`
- [ ] **C1.rss-feeds.live** `/go/rss-feeds`
- [ ] **C1.rss-feeds.preview** `/go/rss-feeds?preview=1`
- [ ] **C1.content-aggregators.live** `/go/content-aggregators`
- [ ] **C1.content-aggregators.preview** `/go/content-aggregators?preview=1`
- [ ] **C1.api-ai-fed.live** `/go/api-ai-fed`
- [ ] **C1.api-ai-fed.preview** `/go/api-ai-fed?preview=1`

## Appendix F — C2 per-cert pathway × regions

- [ ] **C2.capm.pathway** Tier cards + PathwayTierCta
- [ ] **C2.capm.global** Region global
- [ ] **C2.capm.india** Region india
- [ ] **C2.capm.pakistan** Region pakistan
- [ ] **C2.capm.gcc** Region gcc
- [ ] **C2.pmp.pathway** Tier cards + PathwayTierCta
- [ ] **C2.pmp.global** Region global
- [ ] **C2.pmp.india** Region india
- [ ] **C2.pmp.pakistan** Region pakistan
- [ ] **C2.pmp.gcc** Region gcc
- [ ] **C2.pmi-acp.pathway** Tier cards + PathwayTierCta
- [ ] **C2.pmi-acp.global** Region global
- [ ] **C2.pmi-acp.india** Region india
- [ ] **C2.pmi-acp.pakistan** Region pakistan
- [ ] **C2.pmi-acp.gcc** Region gcc
- [ ] **C2.pmi-rmp.pathway** Tier cards + PathwayTierCta
- [ ] **C2.pmi-rmp.global** Region global
- [ ] **C2.pmi-rmp.india** Region india
- [ ] **C2.pmi-rmp.pakistan** Region pakistan
- [ ] **C2.pmi-rmp.gcc** Region gcc
- [ ] **C2.pmi-pba.pathway** Tier cards + PathwayTierCta
- [ ] **C2.pmi-pba.global** Region global
- [ ] **C2.pmi-pba.india** Region india
- [ ] **C2.pmi-pba.pakistan** Region pakistan
- [ ] **C2.pmi-pba.gcc** Region gcc
- [ ] **C2.pmi-sp.pathway** Tier cards + PathwayTierCta
- [ ] **C2.pmi-sp.global** Region global
- [ ] **C2.pmi-sp.india** Region india
- [ ] **C2.pmi-sp.pakistan** Region pakistan
- [ ] **C2.pmi-sp.gcc** Region gcc
- [ ] **C2.pmi-pmocp.pathway** Tier cards + PathwayTierCta
- [ ] **C2.pmi-pmocp.global** Region global
- [ ] **C2.pmi-pmocp.india** Region india
- [ ] **C2.pmi-pmocp.pakistan** Region pakistan
- [ ] **C2.pmi-pmocp.gcc** Region gcc
- [ ] **C2.pmi-cp.pathway** Tier cards + PathwayTierCta
- [ ] **C2.pmi-cp.global** Region global
- [ ] **C2.pmi-cp.india** Region india
- [ ] **C2.pmi-cp.pakistan** Region pakistan
- [ ] **C2.pmi-cp.gcc** Region gcc
- [ ] **C2.pmi-cpmai.pathway** Tier cards + PathwayTierCta
- [ ] **C2.pmi-cpmai.global** Region global
- [ ] **C2.pmi-cpmai.india** Region india
- [ ] **C2.pmi-cpmai.pakistan** Region pakistan
- [ ] **C2.pmi-cpmai.gcc** Region gcc
- [ ] **C2.gpm-b.pathway** Tier cards + PathwayTierCta
- [ ] **C2.gpm-b.global** Region global
- [ ] **C2.gpm-b.india** Region india
- [ ] **C2.gpm-b.pakistan** Region pakistan
- [ ] **C2.gpm-b.gcc** Region gcc
- [ ] **C2.pgmp.pathway** Tier cards + PathwayTierCta
- [ ] **C2.pgmp.global** Region global
- [ ] **C2.pgmp.india** Region india
- [ ] **C2.pgmp.pakistan** Region pakistan
- [ ] **C2.pgmp.gcc** Region gcc
- [ ] **C2.pfmp.pathway** Tier cards + PathwayTierCta
- [ ] **C2.pfmp.global** Region global
- [ ] **C2.pfmp.india** Region india
- [ ] **C2.pfmp.pakistan** Region pakistan
- [ ] **C2.pfmp.gcc** Region gcc
- [ ] **C2.prince2.pathway** Tier cards + PathwayTierCta
- [ ] **C2.prince2.global** Region global
- [ ] **C2.prince2.india** Region india
- [ ] **C2.prince2.pakistan** Region pakistan
- [ ] **C2.prince2.gcc** Region gcc
- [ ] **C2.prince2-practitioner.pathway** Tier cards + PathwayTierCta
- [ ] **C2.prince2-practitioner.global** Region global
- [ ] **C2.prince2-practitioner.india** Region india
- [ ] **C2.prince2-practitioner.pakistan** Region pakistan
- [ ] **C2.prince2-practitioner.gcc** Region gcc
- [ ] **C2.prince2-agile.pathway** Tier cards + PathwayTierCta
- [ ] **C2.prince2-agile.global** Region global
- [ ] **C2.prince2-agile.india** Region india
- [ ] **C2.prince2-agile.pakistan** Region pakistan
- [ ] **C2.prince2-agile.gcc** Region gcc
- [ ] **C2.prince2-agile-practitioner.pathway** Tier cards + PathwayTierCta
- [ ] **C2.prince2-agile-practitioner.global** Region global
- [ ] **C2.prince2-agile-practitioner.india** Region india
- [ ] **C2.prince2-agile-practitioner.pakistan** Region pakistan
- [ ] **C2.prince2-agile-practitioner.gcc** Region gcc
- [ ] **C2.msp.pathway** Tier cards + PathwayTierCta
- [ ] **C2.msp.global** Region global
- [ ] **C2.msp.india** Region india
- [ ] **C2.msp.pakistan** Region pakistan
- [ ] **C2.msp.gcc** Region gcc
- [ ] **C2.mop.pathway** Tier cards + PathwayTierCta
- [ ] **C2.mop.global** Region global
- [ ] **C2.mop.india** Region india
- [ ] **C2.mop.pakistan** Region pakistan
- [ ] **C2.mop.gcc** Region gcc
- [ ] **C2.mor.pathway** Tier cards + PathwayTierCta
- [ ] **C2.mor.global** Region global
- [ ] **C2.mor.india** Region india
- [ ] **C2.mor.pakistan** Region pakistan
- [ ] **C2.mor.gcc** Region gcc
- [ ] **C2.p3o.pathway** Tier cards + PathwayTierCta
- [ ] **C2.p3o.global** Region global
- [ ] **C2.p3o.india** Region india
- [ ] **C2.p3o.pakistan** Region pakistan
- [ ] **C2.p3o.gcc** Region gcc
- [ ] **C2.lss-white.pathway** Tier cards + PathwayTierCta
- [ ] **C2.lss-white.global** Region global
- [ ] **C2.lss-white.india** Region india
- [ ] **C2.lss-white.pakistan** Region pakistan
- [ ] **C2.lss-white.gcc** Region gcc
- [ ] **C2.lss-yellow.pathway** Tier cards + PathwayTierCta
- [ ] **C2.lss-yellow.global** Region global
- [ ] **C2.lss-yellow.india** Region india
- [ ] **C2.lss-yellow.pakistan** Region pakistan
- [ ] **C2.lss-yellow.gcc** Region gcc
- [ ] **C2.lss-green.pathway** Tier cards + PathwayTierCta
- [ ] **C2.lss-green.global** Region global
- [ ] **C2.lss-green.india** Region india
- [ ] **C2.lss-green.pakistan** Region pakistan
- [ ] **C2.lss-green.gcc** Region gcc
- [ ] **C2.lss-black.pathway** Tier cards + PathwayTierCta
- [ ] **C2.lss-black.global** Region global
- [ ] **C2.lss-black.india** Region india
- [ ] **C2.lss-black.pakistan** Region pakistan
- [ ] **C2.lss-black.gcc** Region gcc
- [ ] **C2.lss-master.pathway** Tier cards + PathwayTierCta
- [ ] **C2.lss-master.global** Region global
- [ ] **C2.lss-master.india** Region india
- [ ] **C2.lss-master.pakistan** Region pakistan
- [ ] **C2.lss-master.gcc** Region gcc
- [ ] **C2.lss-champion.pathway** Tier cards + PathwayTierCta
- [ ] **C2.lss-champion.global** Region global
- [ ] **C2.lss-champion.india** Region india
- [ ] **C2.lss-champion.pakistan** Region pakistan
- [ ] **C2.lss-champion.gcc** Region gcc
- [ ] **C2.foundation-direct.pathway** Tier cards + PathwayTierCta
- [ ] **C2.foundation-direct.global** Region global
- [ ] **C2.foundation-direct.india** Region india
- [ ] **C2.foundation-direct.pakistan** Region pakistan
- [ ] **C2.foundation-direct.gcc** Region gcc

## Appendix G — E1 per offeringId (55 rows)

- [ ] **E1.capm-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmp-preparation-foundation** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmp-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmp-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pgmp-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pgmp-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pfmp-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pfmp-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-acp-preparation-foundation** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-acp-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-acp-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-rmp-preparation-foundation** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-rmp-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-rmp-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-sp-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-sp-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-pba-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-pba-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-cp-preparation-foundation** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-cp-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-cp-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-pmocp-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-pmocp-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-cpmai-preparation-foundation** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-cpmai-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.pmi-cpmai-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.prince2-7-foundation-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.prince2-7-practitioner-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.prince2-7-practitioner-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.prince2-agile-foundation-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.prince2-agile-practitioner-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.prince2-agile-practitioner-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.msp-foundation-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.msp-practitioner-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.msp-practitioner-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.mop-foundation-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.mop-practitioner-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.mop-practitioner-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.m-o-r-foundation-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.m-o-r-4-practitioner-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.m-o-r-4-practitioner-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.p3o-foundation-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.p3o-practitioner-preparation-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.p3o-practitioner-preparation-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.six-sigma-champion-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.six-sigma-champion-mastery_corporate** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.six-sigma-white-belt-foundation** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.six-sigma-yellow-belt-foundation** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.six-sigma-yellow-belt-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.six-sigma-green-belt-foundation** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.six-sigma-green-belt-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.six-sigma-green-belt-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.six-sigma-black-belt-professional** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.six-sigma-black-belt-mastery** Matrix row: 6 regions, price, CTA routing
- [ ] **E1.six-sigma-master-black-belt-mastery_advisory** Matrix row: 6 regions, price, CTA routing

## Appendix H — E2 per-channel data (42)

- [ ] **E2.website** JSON, publish, conversion pack, sync
- [ ] **E2.webinar** JSON, publish, conversion pack, sync
- [ ] **E2.medium** JSON, publish, conversion pack, sync
- [ ] **E2.substack** JSON, publish, conversion pack, sync
- [ ] **E2.beehiiv** JSON, publish, conversion pack, sync
- [ ] **E2.ghost** JSON, publish, conversion pack, sync
- [ ] **E2.hashnode** JSON, publish, conversion pack, sync
- [ ] **E2.notion-public** JSON, publish, conversion pack, sync
- [ ] **E2.linkedin** JSON, publish, conversion pack, sync
- [ ] **E2.twitter** JSON, publish, conversion pack, sync
- [ ] **E2.instagram** JSON, publish, conversion pack, sync
- [ ] **E2.facebook** JSON, publish, conversion pack, sync
- [ ] **E2.reddit** JSON, publish, conversion pack, sync
- [ ] **E2.threads** JSON, publish, conversion pack, sync
- [ ] **E2.quora** JSON, publish, conversion pack, sync
- [ ] **E2.bluesky** JSON, publish, conversion pack, sync
- [ ] **E2.mastodon** JSON, publish, conversion pack, sync
- [ ] **E2.pinterest** JSON, publish, conversion pack, sync
- [ ] **E2.vk** JSON, publish, conversion pack, sync
- [ ] **E2.youtube** JSON, publish, conversion pack, sync
- [ ] **E2.tiktok** JSON, publish, conversion pack, sync
- [ ] **E2.snapchat** JSON, publish, conversion pack, sync
- [ ] **E2.vimeo** JSON, publish, conversion pack, sync
- [ ] **E2.spotify** JSON, publish, conversion pack, sync
- [ ] **E2.apple-podcasts** JSON, publish, conversion pack, sync
- [ ] **E2.amazon-audible** JSON, publish, conversion pack, sync
- [ ] **E2.google-podcasts** JSON, publish, conversion pack, sync
- [ ] **E2.podbean** JSON, publish, conversion pack, sync
- [ ] **E2.soundcloud** JSON, publish, conversion pack, sync
- [ ] **E2.email** JSON, publish, conversion pack, sync
- [ ] **E2.whatsapp** JSON, publish, conversion pack, sync
- [ ] **E2.telegram** JSON, publish, conversion pack, sync
- [ ] **E2.discord** JSON, publish, conversion pack, sync
- [ ] **E2.slack** JSON, publish, conversion pack, sync
- [ ] **E2.google-search** JSON, publish, conversion pack, sync
- [ ] **E2.youtube-search** JSON, publish, conversion pack, sync
- [ ] **E2.podcast-directories** JSON, publish, conversion pack, sync
- [ ] **E2.bing-search** JSON, publish, conversion pack, sync
- [ ] **E2.ai-visibility** JSON, publish, conversion pack, sync
- [ ] **E2.rss-feeds** JSON, publish, conversion pack, sync
- [ ] **E2.content-aggregators** JSON, publish, conversion pack, sync
- [ ] **E2.api-ai-fed** JSON, publish, conversion pack, sync

## Appendix I — E3 per-cert catalogue (27)

- [ ] **E3.capm** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.pmp** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.pmi-acp** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.pmi-rmp** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.pmi-pba** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.pmi-sp** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.pmi-pmocp** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.pmi-cp** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.pmi-cpmai** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.gpm-b** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.pgmp** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.pfmp** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.prince2** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.prince2-practitioner** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.prince2-agile** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.prince2-agile-practitioner** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.msp** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.mop** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.mor** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.p3o** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.lss-white** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.lss-yellow** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.lss-green** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.lss-black** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.lss-master** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.lss-champion** siteData, matrix, compare, pathway, enrollment
- [ ] **E3.foundation-direct** siteData, matrix, compare, pathway, enrollment

## Appendix J — Scorecard sign-offs (32)

- [ ] **SC.A1** A1 segment signed off in scorecard
- [ ] **SC.A2** A2 segment signed off in scorecard
- [ ] **SC.A3** A3 segment signed off in scorecard
- [ ] **SC.A4** A4 segment signed off in scorecard
- [ ] **SC.A5** A5 segment signed off in scorecard
- [ ] **SC.A6** A6 segment signed off in scorecard
- [ ] **SC.A7** A7 segment signed off in scorecard
- [ ] **SC.B1** B1 segment signed off in scorecard
- [ ] **SC.B2** B2 segment signed off in scorecard
- [ ] **SC.B3** B3 segment signed off in scorecard
- [ ] **SC.B4** B4 segment signed off in scorecard
- [ ] **SC.B5** B5 segment signed off in scorecard
- [ ] **SC.B6** B6 segment signed off in scorecard
- [ ] **SC.B7** B7 segment signed off in scorecard
- [ ] **SC.C1** C1 segment signed off in scorecard
- [ ] **SC.C2** C2 segment signed off in scorecard
- [ ] **SC.C3** C3 segment signed off in scorecard
- [ ] **SC.C4** C4 segment signed off in scorecard
- [ ] **SC.C5** C5 segment signed off in scorecard
- [ ] **SC.C6** C6 segment signed off in scorecard
- [ ] **SC.D1** D1 segment signed off in scorecard
- [ ] **SC.D2** D2 segment signed off in scorecard
- [ ] **SC.D3** D3 segment signed off in scorecard
- [ ] **SC.D4** D4 segment signed off in scorecard
- [ ] **SC.D5** D5 segment signed off in scorecard
- [ ] **SC.E1** E1 segment signed off in scorecard
- [ ] **SC.E2** E2 segment signed off in scorecard
- [ ] **SC.E3** E3 segment signed off in scorecard
- [ ] **SC.E4** E4 segment signed off in scorecard
- [ ] **SC.F1** F1 segment signed off in scorecard
- [ ] **SC.F2** F2 segment signed off in scorecard
- [ ] **SC.F3** F3 segment signed off in scorecard
- [ ] **SC.F4** F4 segment signed off in scorecard
- [ ] **SC.F5** F5 segment signed off in scorecard
- [ ] **SC.F6** F6 segment signed off in scorecard

## Appendix K — Conditional deep dives DD.006–032

- [ ] **DD.A1** Deep dive if A1 scored Warn/Fail
- [ ] **DD.A2** Deep dive if A2 scored Warn/Fail
- [ ] **DD.A3** Deep dive if A3 scored Warn/Fail
- [ ] **DD.A4** Deep dive if A4 scored Warn/Fail
- [ ] **DD.A5** Deep dive if A5 scored Warn/Fail
- [ ] **DD.A6** Deep dive if A6 scored Warn/Fail
- [ ] **DD.A7** Deep dive if A7 scored Warn/Fail
- [ ] **DD.B1** Deep dive if B1 scored Warn/Fail
- [ ] **DD.B2** Deep dive if B2 scored Warn/Fail
- [ ] **DD.B3** Deep dive if B3 scored Warn/Fail
- [ ] **DD.B4** Deep dive if B4 scored Warn/Fail
- [ ] **DD.B5** Deep dive if B5 scored Warn/Fail
- [ ] **DD.B6** Deep dive if B6 scored Warn/Fail
- [ ] **DD.B7** Deep dive if B7 scored Warn/Fail
- [ ] **DD.C1** Deep dive if C1 scored Warn/Fail
- [ ] **DD.C2** Deep dive if C2 scored Warn/Fail
- [ ] **DD.C3** Deep dive if C3 scored Warn/Fail
- [ ] **DD.C4** Deep dive if C4 scored Warn/Fail
- [ ] **DD.C5** Deep dive if C5 scored Warn/Fail
- [ ] **DD.C6** Deep dive if C6 scored Warn/Fail
- [ ] **DD.D1** Deep dive if D1 scored Warn/Fail
- [ ] **DD.D2** Deep dive if D2 scored Warn/Fail
- [ ] **DD.D3** Deep dive if D3 scored Warn/Fail
- [ ] **DD.D4** Deep dive if D4 scored Warn/Fail
- [ ] **DD.D5** Deep dive if D5 scored Warn/Fail
- [ ] **DD.E1** Deep dive if E1 scored Warn/Fail
- [ ] **DD.E2** Deep dive if E2 scored Warn/Fail
- [ ] **DD.E3** Deep dive if E3 scored Warn/Fail
- [ ] **DD.E4** Deep dive if E4 scored Warn/Fail
- [ ] **DD.F1** Deep dive if F1 scored Warn/Fail
- [ ] **DD.F2** Deep dive if F2 scored Warn/Fail
- [ ] **DD.F3** Deep dive if F3 scored Warn/Fail
- [ ] **DD.F4** Deep dive if F4 scored Warn/Fail
- [ ] **DD.F5** Deep dive if F5 scored Warn/Fail
- [ ] **DD.F6** Deep dive if F6 scored Warn/Fail

## Appendix D — Cursor todo sync

- **968 todos** in [`platform_audit_master_fbbe4d03.plan.md`](file:///c:/Users/Sh3ik/.cursor/plans/platform_audit_master_fbbe4d03.plan.md) frontmatter (1:1 with checkboxes + SC + conditional DD).
- Re-sync: `node scripts/generate-audit-plan-todos.mjs` (Agent mode).
