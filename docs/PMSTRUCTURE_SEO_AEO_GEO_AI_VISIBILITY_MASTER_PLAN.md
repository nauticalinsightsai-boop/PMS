# PM Structure. SEO / AEO / GEO / AI Visibility Master Plan (Run 1)

**Brand:** PM Structure  
**Primary website:** https://www.pmstructure.com  
**Canonical domain (confirmed):** `https://www.pmstructure.com`  
**Scope (Run 1):** Documentation and inventory only: no runtime code, content, metadata, redirect, or component changes until a later implementation run.

**Compliance positioning:** PM Structure is an independent project management exam-prep and professional learning platform. Do not claim PMI ATP status, official PMI affiliation, official PMI training partner status, guaranteed pass, official certification provider status, or formal accreditation unless explicitly confirmed in code/content or by the owner.

---

## Terminology: SERP (not SREP)

**SERP** = Search Engine Results Page: the page Google, Bing, or another search engine shows after a query.

Example query: *"PMP exam change 2026"*

A SERP may include: AI Overview, featured snippet, PMI official page, People Also Ask, organic results, videos, related searches, and PM Structure pages if optimized.

**PM Structure objective:** appear across organic results, featured snippets, People Also Ask, AI Overview citations, Bing Copilot citations, FAQ-style results, course rich results (where eligible), and video/image surfaces.

---

## 11-layer visibility model (every indexable public page)

1. HTML content layer  
2. Heading layer (H1, H2, H3)  
3. Metadata layer (title, description, canonical, robots)  
4. Schema layer (JSON-LD)  
5. Sitemap layer  
6. Internal linking layer  
7. FAQ / answer layer  
8. AI file layer (`llms.txt`, `entity.json`, `faq.json`, `courses.json`, etc.)  
9. Conversion layer (CTA, diagnostic, enrollment, booking)  
10. Legal/compliance layer  
11. Analytics/validation layer  

---

## Supporting documentation files (create in Run 1)

| # | File |
|---|------|
| 1 | `docs/PMSTRUCTURE_SEO_AEO_GEO_AI_VISIBILITY_MASTER_PLAN.md` (this file) |
| 2 | `docs/PMSTRUCTURE_ROUTE_INVENTORY.md` |
| 3 | `docs/PMSTRUCTURE_HEADING_SERP_ONPAGE_SEO_PLAN.md` |
| 4 | `docs/PMSTRUCTURE_INDEXING_MATRIX.md` |
| 5 | `docs/PMSTRUCTURE_SITEMAP_PLAN.md` |
| 6 | `docs/PMSTRUCTURE_SCHEMA_MATRIX.md` |
| 7 | `docs/PMSTRUCTURE_AI_FILES_PLAN.md` |
| 8 | `docs/PMSTRUCTURE_FAQ_EXPANSION_MAP.md` |
| 9 | `docs/PMSTRUCTURE_ANSWER_PAGES_MAP.md` |
| 10 | `docs/PMSTRUCTURE_TOPIC_HUBS_MAP.md` |
| 11 | `docs/PMSTRUCTURE_COURSE_PAGE_MAP.md` |
| 12 | `docs/PMSTRUCTURE_CONTENT_CLUSTER_MAP.md` |
| 13 | `docs/PMSTRUCTURE_CONVERSION_FLOW_MAP.md` |
| 14 | `docs/PMSTRUCTURE_REGIONAL_PRICING_SEO_PLAN.md` |
| 15 | `docs/PMSTRUCTURE_LEGAL_COMPLIANCE_MAP.md` |
| 16 | `docs/PMSTRUCTURE_VALIDATION_SCRIPTS_PLAN.md` |
| 17 | `docs/PMSTRUCTURE_DEPLOYMENT_CHECKLIST.md` |
| 18 | `docs/PMSTRUCTURE_GSC_BING_SUBMISSION_PLAN.md` |
| 19 | `docs/PMSTRUCTURE_AI_ANSWER_TESTING_SHEET.md` |

---

## Known critical issue (P0)

The homepage and all `(site)` marketing pages may render only **"Loading your regional experience…"** before JavaScript hydration (`frontend/components/RegionGate.tsx` → `frontend/components/PublicShell.tsx`). Public indexable pages must render meaningful HTML before hydration. Regional pricing may hydrate later but must not block crawlable content.

---

# PHASE 1. FULL WEBSITE ROUTE INVENTORY

## Phase 1. Route discovery tasks

* [ ] Crawl all current app routes from the codebase (`frontend/app/**`, `dashboard/frontend/app/**`, `backend/app/api/**`, `dashboard/backend/app/api/**`)
* [ ] Identify all static routes
* [ ] Identify all dynamic routes
* [ ] Identify all API routes
* [ ] Identify all public routes
* [ ] Identify all private routes
* [ ] Identify all checkout/payment routes
* [ ] Identify all LMS/dashboard/account routes
* [ ] Identify all sitemap/robots/feed/JSON routes
* [ ] Identify all routes that render only loading/placeholder content
* [ ] Identify all routes that depend on regional/IP/currency logic before content appears
* [ ] Create `docs/PMSTRUCTURE_ROUTE_INVENTORY.md`
* [ ] Add every route to the inventory
* [ ] Add required action for every route
* [ ] Add route-priority classification (critical / high / medium / low)

## Phase 1. Marketing static routes (document each in inventory)

* [ ] Document `/`: `frontend/app/(site)/page.tsx`: homepage. RegionGate blocked: critical
* [ ] Document `/about`: `frontend/app/(site)/about/page.tsx`
* [ ] Document `/contact`: `frontend/app/(site)/contact/page.tsx`
* [ ] Document `/faq`: `frontend/app/(site)/faq/page.tsx`
* [ ] Document `/membership`: `frontend/app/(site)/membership/page.tsx`
* [ ] Document `/community`: `frontend/app/(site)/community/page.tsx`
* [ ] Document `/pm-service`: `frontend/app/(site)/pm-service/page.tsx`
* [ ] Document `/blog`: `frontend/app/(site)/blog/page.tsx`
* [ ] Document `/newsletter`: `frontend/app/(site)/newsletter/page.tsx`
* [ ] Document `/certifications`: `frontend/app/(site)/certifications/page.tsx`
* [ ] Document `/certifications/compare`: `frontend/app/(site)/certifications/compare/page.tsx`
* [ ] Document `/compare`: redirect to `/certifications/compare`
* [ ] Document `/store`: redirect to `/community?view=store`

## Phase 1. Certification detail routes (27 certs)

* [ ] Document `/certifications/capm`
* [ ] Document `/certifications/pmp`: **PMP authority anchor (current)**: critical
* [ ] Document `/certifications/pmi-acp`
* [ ] Document `/certifications/pmi-rmp`
* [ ] Document `/certifications/pmi-pba`
* [ ] Document `/certifications/pmi-sp`
* [ ] Document `/certifications/pmi-pmocp`
* [ ] Document `/certifications/pmi-cp`
* [ ] Document `/certifications/pmi-cpmai`
* [ ] Document `/certifications/gpm-b`
* [ ] Document `/certifications/pgmp`
* [ ] Document `/certifications/pfmp`
* [ ] Document `/certifications/prince2`
* [ ] Document `/certifications/prince2-practitioner`
* [ ] Document `/certifications/prince2-agile`
* [ ] Document `/certifications/prince2-agile-practitioner`
* [ ] Document `/certifications/msp`
* [ ] Document `/certifications/mop`
* [ ] Document `/certifications/mor`
* [ ] Document `/certifications/p3o`
* [ ] Document `/certifications/lss-white`
* [ ] Document `/certifications/lss-yellow`
* [ ] Document `/certifications/lss-green`
* [ ] Document `/certifications/lss-black`
* [ ] Document `/certifications/lss-master`
* [ ] Document `/certifications/lss-champion`
* [ ] Document `/certifications/foundation-direct`

## Phase 1. Enroll routes (noindex class)

* [ ] Document enroll pattern `/certifications/[id]/[tierSlug]/enroll`: `frontend/app/(site)/certifications/[id]/[tierSlug]/enroll/page.tsx`
* [ ] Document enroll success `/certifications/[id]/[tierSlug]/enroll/success`
* [ ] Inventory all tier slugs: foundation, professional, mastery, mastery-corporate, mastery-advisory
* [ ] Flag all enroll routes: noindex, sitemap exclude, conversion page

## Phase 1. Checkout routes

* [ ] Document `/checkout`: noindex (current)
* [ ] Document `/checkout/success`: **missing noindex metadata**: fix in implementation
* [ ] Document `/checkout/cancel`: **missing noindex metadata**: fix in implementation

## Phase 1. Blog routes

* [ ] Document `/blog/[slug]` dynamic route
* [ ] Document seed slug `workplace-safety-basics`
* [ ] Document draft slug `employer-compliance-checklist-2026`: noindex until published
* [ ] Inventory CMS-published blog slugs from Supabase

## Phase 1. Newsletter routes

* [ ] Document `/newsletter/[slug]` dynamic route
* [ ] Document slug `2026-pmp-exam-changes`
* [ ] Document slug `hybrid-methodologies-enterprise`
* [ ] Document slug `risk-beyond-probability-matrix`
* [ ] Document slug `ai-augmented-project-manager`
* [ ] Document slug `prince2-7th-edition-practitioner`
* [ ] Document slug `building-high-performance-pmo`
* [ ] Inventory CMS-published newsletter slugs

## Phase 1. Legal routes

* [ ] Document `/legal` hub
* [ ] Document `/legal/terms`
* [ ] Document `/legal/privacy`
* [ ] Document `/legal/cookies`
* [ ] Document `/legal/services`
* [ ] Document `/legal/pricing-disclaimers`
* [ ] Document `/legal/refunds`
* [ ] Document `/legal/membership-terms`
* [ ] Document `/legal/regional-pricing`
* [ ] Document `/legal/accessibility`
* [ ] Document `/legal/acceptable-use`
* [ ] Document `/legal/marketing`
* [ ] Document `/legal/subprocessors`
* [ ] Document `/legal/dmca`
* [ ] Document `/legal/tax`
* [ ] Document `/legal/security`
* [ ] Document `/legal/complaints`
* [ ] Document `/legal/ai`
* [ ] Document `/legal/dpa`
* [ ] Document `/legal/privacy/eu`
* [ ] Document `/legal/privacy/uk`
* [ ] Document `/legal/privacy/us`
* [ ] Document `/legal/privacy/gcc`
* [ ] Document `/legal/privacy/india`
* [ ] Document `/legal/privacy/pakistan`
* [ ] Document `/legal/privacy/gcc/ae`
* [ ] Document `/legal/privacy/gcc/sa`
* [ ] Document `/legal/privacy/gcc/qa`
* [ ] Document `/legal/privacy/gcc/bh`
* [ ] Document `/legal/privacy/gcc/kw`
* [ ] Document `/legal/privacy/gcc/om`

## Phase 1. Go channel portal routes (41 published + 1 draft)

* [ ] Document `/go` redirect to `/go/website`
* [ ] Document `/go/website`
* [ ] Document `/go/medium`
* [ ] Document `/go/substack`
* [ ] Document `/go/beehiiv`
* [ ] Document `/go/ghost`
* [ ] Document `/go/hashnode`
* [ ] Document `/go/notion`
* [ ] Document `/go/linkedin`
* [ ] Document `/go/x`
* [ ] Document `/go/instagram`
* [ ] Document `/go/facebook`
* [ ] Document `/go/reddit`
* [ ] Document `/go/threads`
* [ ] Document `/go/quora`
* [ ] Document `/go/bluesky`
* [ ] Document `/go/mastodon`
* [ ] Document `/go/pinterest`
* [ ] Document `/go/youtube`
* [ ] Document `/go/tiktok`
* [ ] Document `/go/snapchat`
* [ ] Document `/go/vimeo`
* [ ] Document `/go/spotify`
* [ ] Document `/go/apple-podcasts`
* [ ] Document `/go/amazon-audible`
* [ ] Document `/go/google-podcasts`
* [ ] Document `/go/podbean`
* [ ] Document `/go/soundcloud`
* [ ] Document `/go/email`
* [ ] Document `/go/whatsapp`
* [ ] Document `/go/telegram`
* [ ] Document `/go/discord`
* [ ] Document `/go/slack`
* [ ] Document `/go/google-search`
* [ ] Document `/go/youtube-search`
* [ ] Document `/go/podcast-directories`
* [ ] Document `/go/bing-search`
* [ ] Document `/go/ai-visibility`
* [ ] Document `/go/rss-feeds`
* [ ] Document `/go/content-aggregators`
* [ ] Document `/go/api-ai-fed`
* [ ] Document `/go/webinar`
* [ ] Document `/go/vk`: draft: noindex unless `?preview=1`

## Phase 1. SEO infrastructure routes

* [ ] Document `/sitemap.xml`: `frontend/app/sitemap.ts`
* [ ] Document `/robots.txt`: `frontend/app/robots.ts`

## Phase 1. Public API routes (`backend/app/api`)

* [ ] Document `GET /api/health`
* [ ] Document `GET /api/catalogue`
* [ ] Document `GET /api/catalogue/offerings/[id]`
* [ ] Document `GET /api/regions`
* [ ] Document `POST /api/region/verify`
* [ ] Document `POST /api/profile/region`
* [ ] Document `POST /api/interactions`
* [ ] Document `POST /api/consultation`
* [ ] Document `POST /api/scholarship-review`
* [ ] Document `POST /api/waitlist`
* [ ] Document `POST /api/checkout/create`
* [ ] Document `GET /api/checkout/session/[id]`
* [ ] Document `POST /api/stripe/webhook`

## Phase 1. Dashboard private routes (noindex class)

* [ ] Document `/login` and `/login/update-password`
* [ ] Document `/dashboard` hub
* [ ] Document all `/dashboard/booking-crm/**` routes
* [ ] Document all `/dashboard/site-system/**` routes
* [ ] Document all `/dashboard/cms/**` routes
* [ ] Document all `/dashboard/social-media-management/**` routes
* [ ] Document `/dashboard/control-tower`
* [ ] Document `/dashboard/account/region`
* [ ] Document `/dashboard/migrate`
* [ ] Document legacy `/dashboard/members-revenue/**` redirects
* [ ] Flag dashboard: noindex, robots disallow, sitemap exclude

## Phase 1. Dashboard API routes

* [ ] Inventory all `dashboard/backend/app/api/**` routes
* [ ] Classify auth-guarded vs unguarded admin endpoints
* [ ] Flag unguarded sensitive routes for security + noindex (API not indexed)

## Phase 1. Planned future routes (not yet in codebase)

* [ ] Add planned `/pmp` hub to inventory
* [ ] Add planned `/pmp-exam-2026` to inventory
* [ ] Add planned `/pmp-current-vs-new-exam`
* [ ] Add planned `/pmp-before-8-july-2026`
* [ ] Add planned `/pmp-after-9-july-2026`
* [ ] Add planned `/pmp-exam-timeline-2026`
* [ ] Add planned `/pmp-new-exam-domain-weighting`
* [ ] Add planned `/pmp-business-environment-domain`
* [ ] Add planned `/pmp-people-domain`
* [ ] Add planned `/pmp-process-domain`
* [ ] Add planned `/pmp-ai-sustainability-value-delivery`
* [ ] Add planned `/pmp-agile-hybrid-predictive`
* [ ] Add planned `/pmp-study-plan-2026`
* [ ] Add planned `/pmp-readiness-diagnostic`
* [ ] Add planned `/pmp-foundation`
* [ ] Add planned `/pmp-professional`
* [ ] Add planned `/pmp-mastery`
* [ ] Add planned `/pmp-scenario-practice`
* [ ] Add planned `/pmp-mock-exam`
* [ ] Add planned `/pmp-faq`
* [ ] Add planned `/pmp-eligibility`
* [ ] Add planned `/pmp-application-process`
* [ ] Add planned `/pmp-exam-cost`
* [ ] Add planned `/pmp-exam-format`
* [ ] Add planned `/pmp-35-contact-hours`
* [ ] Add planned `/pmp-not-official-pmi-atp`
* [ ] Add planned `/pmp-independent-exam-prep`
* [ ] Add planned `/pmp-regional-pricing`
* [ ] Add planned `/pmp-enrollment`
* [ ] Add planned `/pmp-community-support`
* [ ] Add planned `/answers` hub and all answer slugs (see Phase 11)
* [ ] Add planned `/topics` hub and all topic slugs (see Phase 12)

---

# PHASE 1A. SERP, HEADING STRUCTURE, AND ON-PAGE SEO

## Phase 1A. H1 tasks

* [ ] Add H1 extraction to the route inventory
* [ ] Record H1 count for every public route
* [ ] Flag pages with zero H1
* [ ] Flag pages with more than one H1
* [ ] Flag pages where H1 is vague
* [ ] Flag pages where H1 is "Loading," "Coming Soon," "Welcome," or similar
* [ ] Flag pages where hero cards/slides create multiple H1s
* [ ] Flag homepage H1 "Structured project management capability": recommend certification-focused H1
* [ ] Recommend corrected H1 for `/`. "Project Management Certification Preparation for PMP, PMI-RMP, PRINCE2 and Six Sigma"
* [ ] Recommend corrected H1 for every indexable certification page
* [ ] Recommend corrected H1 for every planned PMP authority page
* [ ] Ensure every course page has one clear H1 (implementation)
* [ ] Ensure every certification page has one clear H1
* [ ] Ensure every answer page uses the direct question as the H1
* [ ] Ensure every topic hub has a topic-focused H1
* [ ] Ensure every legal page has a simple legal H1
* [ ] Add automated H1 validation if feasible (`seo:h1-check`)

## Phase 1A. H2 tasks

* [ ] Add H2 extraction to the route inventory
* [ ] Record H2 count and H2 text for every public route
* [ ] Flag pages with weak or generic H2s
* [ ] Flag pages with no H2s where the page has substantial content
* [ ] Rewrite vague H2s into searchable section headings (implementation)
* [ ] Add question-based H2s to PMP 2026 pages (implementation)
* [ ] Add question-based H2s to answer pages (implementation)
* [ ] Add course-structure H2s to course pages (implementation)
* [ ] Add comparison H2s to certification comparison pages (implementation)
* [ ] Add FAQ H2s where visible FAQs exist (implementation)
* [ ] Ensure H2s align with SERP/AEO/GEO targets
* [ ] Add automated H2 validation if feasible (`seo:headings`)

## Phase 1A. H3 tasks

* [ ] Add H3 extraction to the route inventory
* [ ] Record H3 count and H3 text for every public route
* [ ] Flag pages where H3 appears before H2
* [ ] Flag skipped heading hierarchy issues
* [ ] Ensure course cards use H3 (audit `Home.tsx`, cert detail components)
* [ ] Ensure article cards use H3
* [ ] Ensure pricing tiers use H3 under pricing H2
* [ ] Ensure FAQ questions are crawlable and properly structured
* [ ] Ensure H3s support the page's SERP target
* [ ] Add automated H3/hierarchy validation if feasible

## Phase 1A. Title / meta / heading alignment

* [ ] Add title/H1 alignment check
* [ ] Add meta description/H1 alignment check
* [ ] Add H2/SERP intent alignment check
* [ ] Ensure every priority page has one primary search intent
* [ ] Ensure no two important pages target the exact same SERP intent without canonical/cluster logic
* [ ] Ensure every answer page uses a direct-question H1
* [ ] Ensure every course page uses a course-focused H1
* [ ] Ensure every topic hub uses a topic-focused H1
* [ ] Ensure every legal page uses a simple legal H1
* [ ] Fix legal static pages missing `buildPageMetadata` canonical/description

## Phase 1A. SERP / AEO / GEO inventory columns

* [ ] Add SERP target column to route inventory
* [ ] Add AEO target question column to route inventory
* [ ] Add GEO citation target column to route inventory
* [ ] Add recommended H1 column to route inventory
* [ ] Add recommended H2s column to route inventory
* [ ] Add recommended H3s column to route inventory
* [ ] Add FAQ requirement column to route inventory
* [ ] Add schema requirement column to route inventory
* [ ] Add CTA requirement column to route inventory
* [ ] Add content gap column to route inventory

## Phase 1A. Create `docs/PMSTRUCTURE_HEADING_SERP_ONPAGE_SEO_PLAN.md`

* [ ] Write SERP education section
* [ ] Write H1/H2/H3/H4 rules
* [ ] Write recommended heading patterns for homepage, PMP 2026, course, cert hub, answer, topic hub, FAQ
* [ ] Write per-priority-page SERP target table
* [ ] Write component audit list (`Home.tsx`, `CertificationDetail`, `FAQ.tsx`, hero sliders, course cards)

---

# PHASE 2. CRITICAL CRAWLABILITY AND RENDERING FIX PLAN

* [ ] Identify why the homepage renders "Loading your regional experience…" (`RegionGate.tsx` + `RegionContext.tsx`)
* [ ] Identify whether IP detection blocks page rendering
* [ ] Identify whether regional pricing logic blocks content rendering
* [ ] Identify whether client-side JavaScript controls the whole page (`PublicShell.tsx` client wrapper)
* [ ] Plan refactor so public pages server-render or statically render meaningful content
* [ ] Plan fallback default region/pricing state (global USD)
* [ ] Plan noscript fallback content
* [ ] Plan crawler-rendering validation tasks (`seo:render-check`)
* [ ] Document that `/go/*` bypasses RegionGate: more crawlable than main site
* [ ] Add implementation tasks to master plan for removing RegionGate content block

---

# PHASE 3. INDEX / NOINDEX PLAN

* [ ] Create complete indexing matrix in `docs/PMSTRUCTURE_INDEXING_MATRIX.md`
* [ ] Plan index/follow metadata for completed public authority pages
* [ ] Plan noindex/nofollow for private/payment/account/dashboard pages
* [ ] Plan noindex/follow for incomplete public pages
* [ ] Plan sitemap exclusions
* [ ] Add noindex validation tasks (`seo:noindex-check`)
* [ ] Index: homepage, about, course overview, certification overview, PMP hub, PMP 2026, FAQ, answers, topics, blog, legal, contact
* [ ] Noindex: login, account, dashboard, admin, checkout, payment, success, cancel, thank-you, LMS private, API, draft, preview, test, placeholder, loading-only, coming-soon, duplicate regional/currency URLs
* [ ] Fix `/checkout/success` and `/checkout/cancel`: add noindex metadata
* [ ] Add dashboard `/login`, `/dashboard/**`: noindex + robots disallow
* [ ] Decide indexing strategy for 41 `/go/*` channel landers (document in indexing matrix)

---

# PHASE 4. SITEMAP AND ROBOTS PLAN

* [ ] Create `docs/PMSTRUCTURE_SITEMAP_PLAN.md`
* [ ] Audit existing sitemap generation (`frontend/app/sitemap.ts`)
* [ ] Plan sitemap index `/sitemap.xml`
* [ ] Plan `/sitemap-pages.xml`
* [ ] Plan `/sitemap-courses.xml`
* [ ] Plan `/sitemap-certifications.xml`
* [ ] Plan `/sitemap-pmp.xml`
* [ ] Plan `/sitemap-rmp.xml`
* [ ] Plan `/sitemap-prince2.xml`
* [ ] Plan `/sitemap-six-sigma.xml`
* [ ] Plan `/sitemap-articles.xml`
* [ ] Plan `/sitemap-faq.xml`
* [ ] Plan `/sitemap-answers.xml`
* [ ] Plan `/sitemap-topics.xml`
* [ ] Plan `/sitemap-legal.xml`
* [ ] Plan optional `/sitemap-portals.xml` for `/go/*` channels
* [ ] Plan robots.txt rules: extend disallow for `/dashboard`, `/login`, `/admin`, enroll paths
* [ ] Add sitemap validation tasks (`seo:sitemap-check`)
* [ ] Rule: only canonical `https://www.pmstructure.com` URLs
* [ ] Rule: exclude all noindex pages
* [ ] Rule: exclude private, checkout, payment, success, cancel, dashboard, login, API, draft, preview, regional duplicate URLs
* [ ] Rule: include lastmod where available
* [ ] Rule: sitemap referenced in robots.txt

---

# PHASE 5. CANONICAL URL PLAN

* [ ] Audit all current canonical URLs
* [ ] Plan shared canonical URL helper (extend `buildPageMetadata`)
* [ ] Ensure homepage canonical is `https://www.pmstructure.com/`
* [ ] Ensure course page canonicals use exact page paths
* [ ] Ensure blog/article canonicals use exact article paths (add `buildPageMetadata` to blog/newsletter articles)
* [ ] Ensure FAQ canonicals use exact FAQ/category paths where applicable
* [ ] Ensure pricing pages have correct canonical logic
* [ ] Ensure regional/currency parameters do not create duplicate canonicals
* [ ] Ensure UTM parameters are stripped from canonical URLs
* [ ] Add canonical validation tasks (`seo:canonical-check`)
* [ ] Fix legal static pages without explicit canonical

---

# PHASE 6. AI FILE LAYER PLAN

* [ ] Create `docs/PMSTRUCTURE_AI_FILES_PLAN.md`
* [ ] Plan `llms.txt` expansion (current: `frontend/public/llms.txt`)
* [ ] Plan `entity.json`
* [ ] Plan `ai-profile.json`
* [ ] Plan `courses.json`
* [ ] Plan `certifications.json`
* [ ] Plan `learning-pathways.json`
* [ ] Plan `pmp-2026.json`
* [ ] Plan `pmp-keywords.json`
* [ ] Plan `pmp-faq.json`
* [ ] Plan `pmp-routes.json`
* [ ] Plan `faq.json` from FAQ data source
* [ ] Plan `pricing-policy.json`
* [ ] Plan `rss.xml`
* [ ] Plan `feed.xml`
* [ ] Plan optional `humans.txt`
* [ ] Rule: all canonical URLs use `https://www.pmstructure.com`
* [ ] Rule: independent-platform compliance note in all AI files
* [ ] Rule: include best pages to cite, course map, PMP 2026 map, legal limitations, lastUpdated, version
* [ ] Plan generation from structured source data (`packages/site-content`, FAQ data, regional catalogue)
* [ ] Add AI file validation tasks (`seo:ai-files-check`)

---

# PHASE 7. SCHEMA / JSON-LD PLAN

* [ ] Create `docs/PMSTRUCTURE_SCHEMA_MATRIX.md`
* [ ] Audit existing JSON-LD (`OrganizationJsonLd`, `CertJsonLd`, `FaqJsonLd`)
* [ ] Plan shared schema builder utilities
* [ ] Plan Organization schema: `@id` `https://www.pmstructure.com/#organization`
* [ ] Plan WebSite schema: `@id` `https://www.pmstructure.com/#website`
* [ ] Plan EducationalOrganization where appropriate
* [ ] Plan Course schema for every course/cert page
* [ ] Plan Offer schema for pricing/course pages
* [ ] Plan FAQPage schema for all visible FAQ blocks
* [ ] Plan BreadcrumbList schema globally
* [ ] Plan Article schema for blog, newsletter, answer pages
* [ ] Plan CollectionPage / ItemList for hub pages
* [ ] Plan AboutPage for `/about`
* [ ] Plan Service schema for diagnostic page
* [ ] Plan WebPage schema for legal pages
* [ ] Rule: schema must match visible content
* [ ] Rule: no fake reviews or AggregateRating unless verified
* [ ] Rule: no ATP/accreditation claims unless verified
* [ ] Rule: no misleading CourseInstance dates
* [ ] Rule: use canonical page URLs for mainEntityOfPage
* [ ] Rule: sameAs only for official profiles
* [ ] Add schema validation tasks (`seo:schema-check`)

---

# PHASE 8. PMP DOMINANCE AND PMP AUTHORITY PLAN

* [ ] Make `/pmp-exam-2026` the main PMP authority anchor (new page)
* [ ] Plan PMP hub `/pmp`
* [ ] Plan `/pmp-current-vs-new-exam`
* [ ] Plan `/pmp-before-8-july-2026`
* [ ] Plan `/pmp-after-9-july-2026`
* [ ] Plan `/pmp-exam-timeline-2026`
* [ ] Plan `/pmp-new-exam-domain-weighting`
* [ ] Plan `/pmp-business-environment-domain`
* [ ] Plan `/pmp-people-domain`
* [ ] Plan `/pmp-process-domain`
* [ ] Plan `/pmp-ai-sustainability-value-delivery`
* [ ] Plan `/pmp-agile-hybrid-predictive`
* [ ] Plan `/pmp-study-plan-2026`
* [ ] Plan `/pmp-readiness-diagnostic`
* [ ] Plan `/pmp-foundation`
* [ ] Plan `/pmp-professional`
* [ ] Plan `/pmp-mastery`
* [ ] Plan `/pmp-scenario-practice`
* [ ] Plan `/pmp-mock-exam`
* [ ] Plan `/pmp-faq`
* [ ] Plan `/pmp-eligibility`
* [ ] Plan `/pmp-application-process`
* [ ] Plan `/pmp-exam-cost`
* [ ] Plan `/pmp-exam-format`
* [ ] Plan `/pmp-35-contact-hours`
* [ ] Plan `/pmp-not-official-pmi-atp`
* [ ] Plan `/pmp-independent-exam-prep`
* [ ] Plan `/pmp-regional-pricing`
* [ ] Plan `/pmp-enrollment`
* [ ] Plan `/pmp-community-support`
* [ ] Plan PMP keyword map (exam, 2026, July 2026, ECO, domains, scenario, mock, readiness, etc.)
* [ ] Plan PMP AI files (`pmp-2026.json`, `pmp-faq.json`, `pmp-routes.json`, `pmp-keywords.json`)
* [ ] Plan PMP schema on all PMP pages
* [ ] Plan PMP internal linking from homepage, FAQ, certs, newsletter
* [ ] Plan PMP conversion flows (diagnostic → pathway → enroll)
* [ ] Plan PMP validation rules (`seo:pmp-check`)
* [ ] Link existing `/newsletter/2026-pmp-exam-changes` into PMP cluster

---

# PHASE 9. COURSE PAGE SYSTEM PLAN

* [ ] Create `docs/PMSTRUCTURE_COURSE_PAGE_MAP.md`
* [ ] Plan course data model (extend regional catalogue + site-content)
* [ ] Plan course page template
* [ ] Plan course category pages
* [ ] Plan PMP Foundation course page
* [ ] Plan PMP Professional course page
* [ ] Plan PMP Mastery course page
* [ ] Plan PMP Q&A / Support course page
* [ ] Plan PMP Mock Exam / Scenario Practice page
* [ ] Plan PMP Readiness Diagnostic page
* [ ] Plan PMI-RMP Foundation course page
* [ ] Plan PMI-RMP Professional course page
* [ ] Plan PMI-RMP Practice Questions page
* [ ] Plan PMI-RMP Readiness Diagnostic page
* [ ] Plan PRINCE2 Foundation course page
* [ ] Plan PRINCE2 Practitioner course page
* [ ] Plan PRINCE2 vs PMP comparison page
* [ ] Plan PRINCE2 Readiness Pathway page
* [ ] Plan Six Sigma Yellow Belt page
* [ ] Plan Six Sigma Green Belt page
* [ ] Plan Six Sigma Black Belt page
* [ ] Plan Six Sigma vs PMP page
* [ ] Plan Lean Six Sigma project examples page
* [ ] Each course page: course title block
* [ ] Each course page: who this course is for (short answer)
* [ ] Each course page: learner problem
* [ ] Each course page: outcomes
* [ ] Each course page: prerequisites
* [ ] Each course page: exam relevance
* [ ] Each course page: modules
* [ ] Each course page: delivery format
* [ ] Each course page: support included
* [ ] Each course page: estimated duration
* [ ] Each course page: pricing or CTA
* [ ] Each course page: regional pricing note
* [ ] Each course page: enrollment path
* [ ] Each course page: LMS handoff explanation
* [ ] Each course page: FAQ block
* [ ] Each course page: compliance note
* [ ] Each course page: related courses
* [ ] Each course page: related articles
* [ ] Each course page: Course + Offer + FAQPage schema
* [ ] Each course page: canonical URL
* [ ] Each course page: noindex rules for private LMS pages
* [ ] Plan Course schema
* [ ] Plan Offer schema
* [ ] Plan FAQ schema on course pages
* [ ] Plan internal links between course pages and cert hubs
* [ ] Plan comparison tables
* [ ] Plan regional pricing hydration behavior (post-SSR)
* [ ] Plan conversion CTAs
* [ ] Plan compliance disclaimers on every course page

---

# PHASE 10. FAQ EXPANSION PLAN

* [ ] Create `docs/PMSTRUCTURE_FAQ_EXPANSION_MAP.md`
* [ ] Audit existing FAQ (`frontend/content/faq/data.ts`: ~73 entries)
* [ ] Plan FAQ data model extension
* [ ] Plan FAQ hub page improvements (`/faq`)
* [ ] Plan FAQ category pages if useful
* [ ] Plan `faq.json` generation from FAQ data
* [ ] Plan FAQ schema from visible FAQ data on all FAQ-bearing pages
* [ ] Plan FAQ blocks on course pages
* [ ] Plan FAQ blocks on topic pages
* [ ] Plan FAQ blocks on answer pages
* [ ] Plan compliance review flags for FAQ answers
* [ ] Plan FAQ internal links to answers, courses, PMP cluster
* [ ] Plan FAQ validation script (`seo:faq-check`)
* [ ] Phase 1 target: 75 PMP FAQs + 40 general FAQs
* [ ] Phase 2 target: 150 PMP FAQs + 80 general FAQs
* [ ] Phase 3 target: 300 PMP FAQs (quality-gated)
* [ ] Category: PM Structure identity
* [ ] Category: PMP 2026 exam change
* [ ] Category: PMP current vs new exam
* [ ] Category: PMP eligibility
* [ ] Category: PMP application process
* [ ] Category: PMP preparation pathway
* [ ] Category: PMP Foundation / Professional / Mastery
* [ ] Category: PMP mock exams and scenario practice
* [ ] Category: PMI-RMP
* [ ] Category: PRINCE2
* [ ] Category: Six Sigma
* [ ] Category: Course access / LMS
* [ ] Category: Pricing / regional pricing
* [ ] Category: Payment / enrollment
* [ ] Category: Community / support
* [ ] Category: Diagnostic / readiness assessment
* [ ] Category: Certification compliance
* [ ] Category: Independent-platform disclaimer
* [ ] Category: Refund/cancellation
* [ ] Category: Technical support

---

# PHASE 11. ANSWER PAGES PLAN

* [ ] Create `docs/PMSTRUCTURE_ANSWER_PAGES_MAP.md`
* [ ] Plan answer page data model
* [ ] Plan answer page template
* [ ] Plan answer hub `/answers`
* [ ] Plan `/answers/is-the-pmp-exam-changing-in-2026`
* [ ] Plan `/answers/when-does-the-new-pmp-exam-start`
* [ ] Plan `/answers/should-i-take-pmp-before-8-july-2026`
* [ ] Plan `/answers/should-i-prepare-for-new-pmp-after-9-july-2026`
* [ ] Plan `/answers/what-is-the-pmp-business-environment-domain`
* [ ] Plan `/answers/how-to-prepare-for-pmp-in-2026`
* [ ] Plan `/answers/what-is-pmp-readiness`
* [ ] Plan `/answers/how-long-does-pmp-preparation-take`
* [ ] Plan `/answers/what-is-pmp-scenario-practice`
* [ ] Plan `/answers/what-is-the-pmp-exam-content-outline`
* [ ] Plan `/answers/what-is-pm-structure`
* [ ] Plan `/answers/is-pm-structure-official-pmi-atp`
* [ ] Plan `/answers/what-is-project-management-certification`
* [ ] Plan `/answers/what-is-project-governance`
* [ ] Plan `/answers/what-is-risk-management-certification`
* [ ] Plan `/answers/what-is-pmi-rmp`
* [ ] Plan `/answers/what-is-prince2`
* [ ] Plan `/answers/what-is-six-sigma`
* [ ] Plan `/answers/pmp-vs-prince2`
* [ ] Plan `/answers/pmp-vs-pmi-rmp`
* [ ] Plan `/answers/six-sigma-vs-pmp`
* [ ] Plan `/answers/how-regional-pricing-works`
* [ ] Plan `/answers/how-lms-access-works`
* [ ] Plan internal links from answers to courses, FAQ, PMP hub
* [ ] Plan Article schema on answer pages
* [ ] Plan FAQPage schema on answer pages
* [ ] Plan BreadcrumbList schema on answer pages
* [ ] Plan sitemap inclusion rules for answers
* [ ] Plan noindex for draft answer pages

---

# PHASE 12. TOPIC HUBS PLAN

* [ ] Create `docs/PMSTRUCTURE_TOPIC_HUBS_MAP.md`
* [ ] Plan topic hub data model
* [ ] Plan topic hub template
* [ ] Plan topic index `/topics`
* [ ] Plan `/topics/pmp-exam-preparation`
* [ ] Plan `/topics/pmp-exam-2026`
* [ ] Plan `/topics/project-management-certification`
* [ ] Plan `/topics/project-governance`
* [ ] Plan `/topics/agile-project-management`
* [ ] Plan `/topics/hybrid-project-management`
* [ ] Plan `/topics/risk-management`
* [ ] Plan `/topics/pmi-rmp`
* [ ] Plan `/topics/prince2`
* [ ] Plan `/topics/six-sigma`
* [ ] Plan `/topics/exam-readiness`
* [ ] Plan `/topics/scenario-based-practice`
* [ ] Plan `/topics/business-environment-domain`
* [ ] Plan `/topics/value-delivery`
* [ ] Plan `/topics/ai-in-project-management`
* [ ] Plan `/topics/sustainability-in-project-management`
* [ ] Plan internal links from hubs to answers, courses, FAQ
* [ ] Plan CollectionPage or Article schema
* [ ] Plan FAQPage schema on hubs
* [ ] Plan sitemap entries for topics
* [ ] Plan noindex for incomplete hubs

---

# PHASE 13. CONTENT CLUSTER MAP PLAN

* [ ] Create `docs/PMSTRUCTURE_CONTENT_CLUSTER_MAP.md`
* [ ] Cluster 1: PMP Exam 2026 Transition: pillar `/pmp-exam-2026`
* [ ] Cluster 2: PMP Preparation Pathway: pillar `/pmp`
* [ ] Cluster 3: PMP Foundation / Professional / Mastery
* [ ] Cluster 4: PMP Scenario Practice and Mock Exams
* [ ] Cluster 5: PMI-RMP Preparation
* [ ] Cluster 6: PRINCE2 Preparation
* [ ] Cluster 7: Six Sigma Preparation
* [ ] Cluster 8: Project Governance and Delivery Judgment
* [ ] Cluster 9: Agile/Hybrid Project Management
* [ ] Cluster 10: Regional pricing and learner access
* [ ] Assign pillar pages per cluster
* [ ] Assign supporting pages per cluster
* [ ] Assign FAQs per cluster
* [ ] Assign answer pages per cluster
* [ ] Assign topic hubs per cluster
* [ ] Assign course CTAs per cluster
* [ ] Add cluster internal linking rules
* [ ] Add publishing priority per cluster

---

# PHASE 14. REGIONAL PRICING AND CURRENCY SEO PLAN

* [ ] Create `docs/PMSTRUCTURE_REGIONAL_PRICING_SEO_PLAN.md`
* [ ] Audit current regional pricing logic (`RegionContext`, `RegionGate`, `regional-catalogue.json`)
* [ ] Identify whether IP detection blocks rendering
* [ ] Plan default pricing fallback (global)
* [ ] Plan server-rendered public content before region hydration
* [ ] Plan currency hydration after content loads
* [ ] Plan noindex for payment/checkout links
* [ ] Plan canonical rules for currency parameters
* [ ] Plan pricing FAQ expansion
* [ ] Plan regional pricing policy page alignment (`/legal/regional-pricing`)
* [ ] Plan `pricing-policy.json` AI file
* [ ] Plan Offer schema rules with regional pricing disclaimers
* [ ] Plan duplicate-index prevention for country/currency variants
* [ ] Rule: do not block content behind IP detection
* [ ] Rule: do not render only loading screen while detecting region
* [ ] Rule: default content loads globally; pricing hydrates later

---

# PHASE 15. CONVERSION FLOW MAP PLAN

* [ ] Create `docs/PMSTRUCTURE_CONVERSION_FLOW_MAP.md`
* [ ] Map flow: organic search → PMP 2026 page → diagnostic → PMP pathway → enrollment
* [ ] Map flow: AI answer citation → answer page → FAQ → diagnostic → booking/enrollment
* [ ] Map flow: social visitor → go portal / course page → regional pricing → payment
* [ ] Map flow: course page → LMS handoff
* [ ] Map flow: FAQ → consultation booking (Calendly)
* [ ] Map flow: community page → signup
* [ ] Map flow: diagnostic page → lead capture → recommended pathway
* [ ] Map all CTAs (Book consultation, Find pathway, Enroll, Subscribe, Join community)
* [ ] Map all forms (`/api/interactions`, `/api/consultation`, scholarship-review, waitlist)
* [ ] Map Calendly links from booking-crm package
* [ ] Map payment links (`/api/checkout/create`, Stripe)
* [ ] Map LMS handoff explanation on course/enroll pages
* [ ] Map thank-you pages (enroll success, checkout success)
* [ ] Plan noindex for thank-you/payment pages
* [ ] Plan lead form tracking
* [ ] Plan event tracking
* [ ] Plan conversion metadata
* [ ] Plan UTM handling
* [ ] Plan privacy/legal disclosure near forms
* [ ] Plan FAQ links near conversion points
* [ ] Plan trust/compliance note near payment/enrollment

---

# PHASE 16. LEGAL AND COMPLIANCE PLAN

* [ ] Create `docs/PMSTRUCTURE_LEGAL_COMPLIANCE_MAP.md`
* [ ] Audit all existing legal pages (~27 routes)
* [ ] Plan independent exam-prep disclaimer prominence
* [ ] Plan no guaranteed pass disclaimer
* [ ] Plan PMI trademark/fair-use caution
* [ ] Plan payment terms (map to existing or new slug)
* [ ] Plan refund/cancellation policy (`/legal/refunds`)
* [ ] Plan regional pricing policy (`/legal/regional-pricing`)
* [ ] Plan LMS access terms
* [ ] Plan AI chat disclaimer (`/legal/ai` exists: verify content)
* [ ] Plan privacy wording for forms, analytics, payment, LMS, email
* [ ] Plan cookie policy (`/legal/cookies`)
* [ ] Plan legal footer links on all public pages
* [ ] Plan noindex for payment/checkout pages
* [ ] Plan legal canonical URLs on all legal pages
* [ ] Plan legal sitemap inclusion
* [ ] Gap: standalone `/legal/independent-platform-disclaimer` (or equivalent section)
* [ ] Gap: `/legal/payment-terms` if not covered by terms/refunds

---

# PHASE 17. VALIDATION SCRIPTS PLAN

* [ ] Create `docs/PMSTRUCTURE_VALIDATION_SCRIPTS_PLAN.md`
* [ ] Plan script directory `scripts/seo/`
* [ ] Plan `seo:audit` script
* [ ] Plan `seo:render-check` script
* [ ] Plan `seo:canonical-check` script
* [ ] Plan `seo:noindex-check` script
* [ ] Plan `seo:sitemap-check` script
* [ ] Plan `seo:schema-check` script
* [ ] Plan `seo:ai-files-check` script
* [ ] Plan `seo:faq-check` script
* [ ] Plan `seo:internal-links-check` script
* [ ] Plan `seo:course-check` script
* [ ] Plan `seo:headings` script
* [ ] Plan `seo:h1-check` script
* [ ] Plan `seo:pmp-check` script
* [ ] Plan `seo:all` meta-script (runs all checks)
* [ ] Plan route scan module
* [ ] Plan HTML render scan module
* [ ] Plan canonical scan module
* [ ] Plan sitemap scan module
* [ ] Plan schema scan module
* [ ] Plan noindex scan module
* [ ] Plan AI file scan module
* [ ] Plan compliance phrase scan module (no ATP, no guaranteed pass)
* [ ] Plan heading scan module
* [ ] Plan PMP page scan module
* [ ] Plan report output format (JSON + human-readable)
* [ ] Plan npm scripts in root `package.json`
* [ ] Plan pre-deployment validation command
* [ ] Validation: homepage must not render only "Loading your regional experience…"
* [ ] Validation: public pages must have meaningful HTML
* [ ] Validation: every indexable page exactly one H1
* [ ] Validation: no H1 contains "Loading your regional experience."
* [ ] Validation: no H1 contains "Coming Soon."
* [ ] Validation: no vague-only H1 ("Welcome," "Home," "Overview")
* [ ] Validation: every course page course-specific H1
* [ ] Validation: every answer page question-based H1
* [ ] Validation: every topic hub topic-focused H1
* [ ] Validation: substantial pages have at least two useful H2s
* [ ] Validation: card components do not output H1
* [ ] Validation: hero sliders do not output multiple H1s
* [ ] Validation: title tag and H1 aligned
* [ ] Validation: meta description and page intent aligned
* [ ] Validation: no noindex page in sitemap
* [ ] Validation: no payment/private page in sitemap
* [ ] Validation: no course page missing canonical
* [ ] Validation: no course page missing title/description
* [ ] Validation: no key page missing schema
* [ ] Validation: no FAQ schema item invisible on page
* [ ] Validation: no AI file uses wrong canonical
* [ ] Validation: no official accreditation claim unless allowed
* [ ] Validation: no "guaranteed pass" claim unless approved
* [ ] Validation: no placeholder page indexable
* [ ] Validation: no loading-only page indexable
* [ ] Validation: robots.txt references canonical sitemap
* [ ] Validation: sitemap URLs use `https://www.pmstructure.com`
* [ ] Validation: regional pricing parameters do not create duplicate sitemap URLs

---

# PHASE 18. DEPLOYMENT CHECKLIST PLAN

* [ ] Create `docs/PMSTRUCTURE_DEPLOYMENT_CHECKLIST.md`

## Pre-deployment

* [ ] Build passes
* [ ] Typecheck passes
* [ ] Lint passes
* [ ] SEO validation passes (`seo:all`)
* [ ] Homepage renders meaningful HTML
* [ ] Course pages render meaningful HTML
* [ ] Sitemap validates
* [ ] robots.txt validates
* [ ] Schema validates
* [ ] AI files load
* [ ] FAQ JSON loads
* [ ] Payment pages noindex
* [ ] Dashboard/login noindex
* [ ] No placeholder pages indexed
* [ ] No duplicate regional URLs in sitemap
* [ ] Legal pages accessible
* [ ] Conversion flows tested

## Post-deployment

* [ ] Test homepage
* [ ] Test PMP 2026 page
* [ ] Test PMP course pages
* [ ] Test FAQ
* [ ] Test diagnostic
* [ ] Test pricing
* [ ] Test payment handoff
* [ ] Test LMS handoff
* [ ] Test sitemap
* [ ] Test robots
* [ ] Test llms.txt
* [ ] Test entity.json
* [ ] Test courses.json
* [ ] Test pmp-2026.json
* [ ] Test schema (Rich Results Test)
* [ ] Test noindex pages
* [ ] Test GSC URL inspection

---

# PHASE 19. GOOGLE SEARCH CONSOLE AND BING PLAN

* [ ] Create `docs/PMSTRUCTURE_GSC_BING_SUBMISSION_PLAN.md`
* [ ] Add domain property for pmstructure.com in GSC
* [ ] Add URL-prefix property for `https://www.pmstructure.com`
* [ ] Submit sitemap index and all child sitemaps
* [ ] Inspect homepage in GSC
* [ ] Inspect PMP 2026 page in GSC
* [ ] Inspect PMP hub in GSC
* [ ] Inspect PMP Foundation in GSC
* [ ] Inspect PMP Professional in GSC
* [ ] Inspect PMP Mastery in GSC
* [ ] Inspect FAQ in GSC
* [ ] Inspect diagnostic in GSC
* [ ] Inspect topic hub in GSC
* [ ] Inspect answer page in GSC
* [ ] Request indexing for priority pages
* [ ] Monitor duplicate pages in GSC
* [ ] Monitor crawled-not-indexed in GSC
* [ ] Monitor discovered-not-indexed in GSC
* [ ] Monitor page with redirect in GSC
* [ ] Monitor noindex coverage in GSC
* [ ] Monitor search queries in GSC
* [ ] Add pmstructure.com in Bing Webmaster
* [ ] Submit sitemap in Bing
* [ ] Inspect homepage in Bing
* [ ] Inspect PMP 2026 page in Bing
* [ ] Inspect course pages in Bing
* [ ] Plan IndexNow if appropriate
* [ ] Submit key URLs in Bing
* [ ] Monitor Bing visibility
* [ ] Monitor Copilot/AI references

---

# PHASE 20. AI ANSWER TESTING PLAN

* [ ] Create `docs/PMSTRUCTURE_AI_ANSWER_TESTING_SHEET.md`
* [ ] Add query list (brand, PMP, other certs, conversion)
* [ ] Add monthly test schedule
* [ ] Add weekly PMP test schedule
* [ ] Add issue categories
* [ ] Add correction workflow
* [ ] Add content update workflow
* [ ] Add schema update workflow
* [ ] Add FAQ update workflow
* [ ] Add answer page update workflow

## Test platforms

* [ ] Google Search
* [ ] Google AI Overviews (where available)
* [ ] Bing
* [ ] Bing Copilot
* [ ] ChatGPT search/browsing (where available)
* [ ] Perplexity
* [ ] Gemini
* [ ] Claude search (if available)
* [ ] You.com (if relevant)

## Brand test queries

* [ ] What is PM Structure?
* [ ] Is PM Structure an official PMI ATP?
* [ ] Is PM Structure independent?
* [ ] What does PM Structure offer?
* [ ] Who is PM Structure for?

## PMP test queries

* [ ] Is the PMP exam changing in 2026?
* [ ] When does the new PMP exam launch?
* [ ] Should I take PMP before 8 July 2026?
* [ ] Should I prepare for the PMP exam after 9 July 2026?
* [ ] What are the new PMP domain weights?
* [ ] What is the Business Environment domain in the new PMP exam?
* [ ] How should I prepare for PMP in 2026?
* [ ] What is PM Structure PMP Foundation?
* [ ] What is PM Structure PMP Professional?
* [ ] What is PM Structure PMP Mastery?
* [ ] Does PM Structure offer PMP scenario practice?
* [ ] Does PM Structure provide PMP readiness diagnostics?

## Other certification test queries

* [ ] What is PMI-RMP?
* [ ] Does PM Structure offer PMI-RMP preparation?
* [ ] What is PRINCE2?
* [ ] What is Six Sigma?
* [ ] PMP vs PRINCE2
* [ ] PMP vs PMI-RMP
* [ ] Six Sigma vs PMP

## Conversion test queries

* [ ] How can I enroll in PM Structure?
* [ ] How does PM Structure regional pricing work?
* [ ] How does PM Structure LMS access work?
* [ ] How can I book a consultation with PM Structure?

## Per-test tracking fields

* [ ] Platform
* [ ] Query
* [ ] Date
* [ ] PMStructure.com cited? yes/no
* [ ] Correct page cited? yes/no
* [ ] Answer accurate? yes/no
* [ ] Compliance risk? yes/no
* [ ] False official affiliation? yes/no
* [ ] Hallucinated guarantee? yes/no
* [ ] Missing source? yes/no
* [ ] Required fix
* [ ] Content gap
* [ ] Priority

---

# APPENDIX A: 25-point deliverable summary

1. **Files to create:** 19 PMSTRUCTURE docs (this master plan + 18 siblings)
2. **Files inspected:** `frontend/app/**`, `frontend/components/seo/**`, `frontend/content/faq/**`, `frontend/content/legal/**`, `packages/site-content/**`, `docs/PRE_LAUNCH_LEGAL_SEO_AUDIT.md`, `scripts/legal-seo-check.mjs`
3. **Route inventory summary:** ~110-120 current indexable URLs; 50+ private dashboard routes; 13 public API routes; 70+ planned routes
4. **Critical crawlability risk:** RegionGate client-only spinner on all `(site)` pages
5. **Heading/SERP risks:** Vague homepage H1; legal pages missing canonicals; no Article schema on content pages
6. **Missing page categories:** PMP cluster, answers, topics, dedicated courses, diagnostic
7. **Missing course pages:** 15+ dedicated tier landing URLs
8. **Missing PMP 2026 cluster:** 29 authority pages
9. **Missing FAQ categories:** PMP 2026 depth, diagnostic, LMS handoff, independent disclaimer
10. **Missing answer pages:** 23 priority slugs
11. **Missing topic hubs:** 17 hubs
12. **Missing schema types:** WebSite, Article, Offer, CollectionPage, Service on most pages
13. **Missing AI files:** 11+ JSON/feed files beyond llms.txt
14. **Missing sitemap structure:** 12 additional sitemaps + index
15. **Index/noindex risks:** checkout success/cancel, dashboard, unguarded admin APIs
16. **Regional pricing risks:** content blocked behind RegionGate; no SSR fallback
17. **Conversion flow risks:** multiple entry points not unified in SEO layer
18. **Legal/compliance risks:** need explicit independent-platform disclaimer prominence
19. **Validation scripts needed:** 14 `seo:*` scripts beyond legal-seo-check
20. **Deployment risks:** no pre-deploy render check; single sitemap may exceed limits at scale
21. **GSC/Bing requirements:** property setup, 13-sitemap submit, 15+ priority URL inspections
22. **AI answer testing requirements:** 28+ queries, monthly schedule, correction workflow
23. **Total tasks in this master plan:** 500+ checkboxes (see sections above; sibling docs add route-level rows)
24. **Implementation order:** P0 crawlability → P0 noindex gaps → P1 PMP hub → P2 AEO → P3 schema/AI → P4 hubs → P5 validation/ops
25. **Human decisions:** www confirmed; go-portal indexing, privacy indexing, PMP URL strategy still open

---

# APPENDIX B. Recommended implementation order (post-documentation)

| Wave | Focus |
|------|-------|
| **Run 1** | Create all 19 PMSTRUCTURE documentation files with full inventories |
| **P0** | RegionGate / SSR crawlability fix |
| **P0** | Checkout success/cancel + dashboard noindex |
| **P1** | Canonical alignment on legal/blog/newsletter |
| **P1** | `/pmp-exam-2026` + PMP hub `/pmp` |
| **P2** | Answer pages + FAQ expansion phase 1 |
| **P2** | Schema expansion (WebSite, Article, Offer) |
| **P3** | AI JSON file generation |
| **P3** | Split sitemaps |
| **P4** | Topic hubs + content clusters |
| **P4** | Validation scripts + `seo:all` |
| **P5** | GSC/Bing submission + AI answer testing |

---

*End of master plan. Run 1 documentation. Sibling files carry route-level row tasks and expanded per-page SERP/heading matrices.*