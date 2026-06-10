# PM Structure — Remaining Implementation Plan (Phases 3–19)

**Status:** **Implementation complete (2026-06-10)** — code, validation, and ops docs shipped. Post-deploy: GSC/Bing submit, Rich Results Test, AI answer baseline.  
**Prerequisites:** Run 2 (SSR/crawl) and Run 3 (index/noindex) — **done**

**Canonical domain (owner confirmed):** `https://www.pmstructure.com`  
**Brand:** PM Structure — independent project management exam-prep and professional learning platform.

---

## 11-layer visibility model (every indexable public page)

1. HTML content layer  
2. Heading layer (H1, H2, H3)  
3. Metadata layer (title, description, canonical, robots)  
4. Schema layer (JSON-LD)  
5. Sitemap layer  
6. Internal linking layer  
7. FAQ / answer layer  
8. AI file layer (`llms.txt`, `entity.json`, `faq.json`, `courses.json`, `pmp-2026.json`, etc.)  
9. Conversion layer (CTA, diagnostic, enrollment, booking)  
10. Legal/compliance layer  
11. Validation/testing layer  

**Compliance:** Do not claim official PMI ATP, official PMI affiliation, guaranteed pass, or official certification provider status unless owner confirms.

---

## Missing input docs (create before or during each phase)

| Doc | Status |
|-----|--------|
| `PMSTRUCTURE_SEO_AEO_GEO_AI_VISIBILITY_MASTER_PLAN.md` | **Exists** |
| `PMSTRUCTURE_ROUTE_INVENTORY.md` | **Exists** (Run 0) |
| `PMSTRUCTURE_HEADING_SERP_ONPAGE_SEO_PLAN.md` | **Exists** (Run 0) |
| `PMSTRUCTURE_INDEXING_MATRIX.md` | **Exists** (expanded Run 0) |
| `PMSTRUCTURE_SITEMAP_PLAN.md` | **Exists** (Run 0) |
| `PMSTRUCTURE_SCHEMA_MATRIX.md` | **Exists** (Run 0) |
| `PMSTRUCTURE_AI_FILES_PLAN.md` | **Exists** (Run 0) |
| `PMSTRUCTURE_FAQ_EXPANSION_MAP.md` | **Exists** (75 PMP FAQs phase 1) |
| `PMSTRUCTURE_ANSWER_PAGES_MAP.md` | **Exists** (23 live) |
| `PMSTRUCTURE_TOPIC_HUBS_MAP.md` | **Exists** (17 live) |
| `PMSTRUCTURE_COURSE_PAGE_MAP.md` | **Exists** (8 pathway routes) |
| `PMSTRUCTURE_CONTENT_CLUSTER_MAP.md` | **Exists** |
| `PMSTRUCTURE_VALIDATION_SCRIPTS_PLAN.md` | **Exists** (17 checks + render) |
| `PMSTRUCTURE_CONVERSION_FLOW_MAP.md` | **Exists** |
| `PMSTRUCTURE_REGIONAL_PRICING_SEO_PLAN.md` | **Exists** |
| `PMSTRUCTURE_LEGAL_COMPLIANCE_MAP.md` | **Exists** |
| `PMSTRUCTURE_DEPLOYMENT_CHECKLIST.md` | **Exists** |
| `PMSTRUCTURE_GSC_BING_SUBMISSION_PLAN.md` | **Exists** |
| `PMSTRUCTURE_AI_ANSWER_TESTING_SHEET.md` | **Exists** |

---

# PHASE 3 — SITEMAP + ROBOTS

**Run ID:** Run 4  
**Objective:** Create a crawler-safe sitemap index and robots system.  
**Why it matters:** Crawlers and AI systems discover URLs via sitemap; incorrect inclusion wastes crawl budget and indexes private/conversion pages.

**Input docs:** `INDEXING_MATRIX`, `SITEMAP_PLAN`, `DEPLOYMENT_CHECKLIST`  
**Files likely affected:** `frontend/app/sitemap.ts`, `frontend/app/sitemap-*.ts` (new), `frontend/app/robots.ts`, `scripts/seo/sitemap-check.mjs`

**Dependencies:** Run 3 (index/noindex matrix final)

### Tasks

* [ ] Review current sitemap generation (`frontend/app/sitemap.ts`)
* [ ] Review current robots.txt (`frontend/app/robots.ts`)
* [ ] Ensure sitemap includes only indexable canonical URLs
* [ ] Exclude checkout/payment/success/cancel/thank-you pages
* [ ] Exclude login/account/dashboard/admin pages
* [ ] Exclude LMS-private pages
* [ ] Exclude API routes
* [ ] Exclude draft/preview/test routes
* [ ] Exclude loading-only/coming-soon/placeholder pages
* [ ] Add sitemap index `/sitemap.xml`
* [ ] Add `sitemap-pages.xml`
* [ ] Add `sitemap-certifications.xml`
* [ ] Add `sitemap-pmp.xml` (when PMP routes exist)
* [ ] Add `sitemap-faq.xml`
* [ ] Add `sitemap-answers.xml`
* [ ] Add `sitemap-topics.xml`
* [ ] Add `sitemap-articles.xml`
* [ ] Add `sitemap-legal.xml`
* [ ] Optional: `sitemap-portals.xml` for `/go/*`
* [ ] Ensure robots.txt references canonical sitemap
* [ ] Ensure robots.txt does not block pages that need noindex crawled
* [ ] Add `seo:sitemap-check` validation
* [ ] Update `docs/PMSTRUCTURE_SITEMAP_PLAN.md`

**Risks:** Single monolithic sitemap at scale; robots disallow on `/checkout` blocking noindex meta crawl  
**Validation:** Fetch sitemap URLs; assert no noindex paths; Rich Results optional  
**Stop condition:** Sitemap + robots implemented and validated in dedicated phase only  
**Expected output:** 13-sitemap architecture live, validation script passing  
**Human decisions:** Index 41 `/go/*` channel pages in sitemap or separate lower-priority sitemap  
**Full Run 4 spec:** Cursor plan `seo_aeo_master_docs_37e5bd87.plan.md` → RUN 4 — SITEMAP + ROBOTS (complete checklist, Option A/B, validation, 14-point report)  
**Canonical:** Use `PMS_SITE_URL` from `frontend/config/pms-site.ts` (www confirmed; not hardcoded apex unless env changes)

---

# PHASE 4 — CANONICAL SYSTEM

**Run ID:** Run 5  
**Objective:** One clean canonical URL system across all indexable public routes.  
**Why it matters:** Prevents duplicate indexing from www/non-www, http/https, trailing slashes, UTM, region, currency, session, and query-string variants.

**Input docs:** `ROUTE_INVENTORY`, `INDEXING_MATRIX`, `SITEMAP_PLAN`, `REGIONAL_PRICING_SEO_PLAN`, `VALIDATION_SCRIPTS_PLAN`  
**Files likely affected:** `frontend/lib/canonical.ts` (new), `frontend/lib/site-metadata.ts`, `frontend/lib/sitemap/*`, all `generateMetadata` pages, legal static pages, `scripts/seo/canonical-check.mjs`

**Dependencies:** Run 2 (SSR), Run 3 (index matrix), Phase 3 / Run 4 (sitemap URLs must match canonicals)

**Full Run 5 spec:** Cursor plan `seo_aeo_master_docs_37e5bd87.plan.md` → RUN 5 — CANONICAL URL SYSTEM (complete checklist, gaps audit, 16-point report)

**Canonical domain:** `PMS_SITE_URL` from `frontend/config/pms-site.ts` (www confirmed in codebase; user specs sometimes say apex — env is source of truth)

### Known gaps (pre-implementation audit)

| Route | Issue |
|-------|-------|
| `/legal/terms`, `/privacy`, `/cookies`, `/services`, `/pricing-disclaimers` | Metadata title only — no `alternates.canonical` |
| `/legal/privacy/[region]`, `/legal/privacy/gcc/[country]` | No canonical |
| `/blog/[slug]`, `/newsletter/[slug]` | No explicit canonical (metadataBase only) |
| `/go/[channel]` | Relative canonical — verify absolute resolution |
| `/store` | Redirects to `/community?view=store` — canonical should be `/community` |

### Implementation tasks

* [ ] Identify current metadata/SEO utilities (`site-metadata.ts`, `buildPageMetadata`)
* [ ] Identify all route definitions and canonical coverage
* [ ] Create `frontend/lib/canonical.ts` — `canonicalUrl`, `stripQueryParams`, `STRIPPED_QUERY_KEYS`
* [ ] Integrate helper into `buildPageMetadata` (canonical + openGraph.url)
* [ ] Strip UTM: utm_source, utm_medium, utm_campaign, utm_content, utm_term
* [ ] Strip tracking: gclid, fbclid, msclkid
* [ ] Strip region/currency: region, country, currency, pricing
* [ ] Strip session/payment: session_id, session, token, checkout
* [ ] Homepage → `{PMS_SITE_URL}/`
* [ ] Certifications → `/certifications/{id}`
* [ ] FAQ → `/faq`
* [ ] Legal → all ~27 routes with clean path canonicals
* [ ] Blog/newsletter articles → `/blog/{slug}`, `/newsletter/{slug}`
* [ ] Go portals → `/go/{channel}`
* [ ] Future PMP/answers/topics — TODO in ROUTE_INVENTORY only
* [ ] Noindex pages (checkout, enroll) — not authority canonicals; self-canonical + noindex OK
* [ ] Sitemap URLs === canonical URLs (shared function)
* [ ] Document URL normalization (www, https, trailing slash) — minimal safe redirects only
* [ ] Regional pricing: widgets hydrate without changing canonical
* [ ] Add `scripts/seo/canonical-check.mjs` + `npm run seo:canonical-check`
* [ ] Update ROUTE_INVENTORY, INDEXING_MATRIX, SITEMAP_PLAN, master plan Phase 4 checkboxes

### Validation (10 manual + automated)

1. Homepage canonical in view-source  
2. `/certifications/pmp` canonical  
3. `/faq` canonical  
4. `/legal/terms` canonical (currently missing)  
5. `/blog/{slug}` canonical  
6. `/?utm_source=test` → clean homepage canonical  
7. `?currency=AED` → clean path canonical  
8. Sitemap URL matches page canonical  
9. Checkout flow not broken  
10. No redirect loops  

**Risks:** www vs apex mismatch; `/store` query redirect; breaking payment session URLs  
**Stop condition:** Canonical system implemented + 16-point report; do not start Phase 5 headings  
**Human decisions:** www vs apex redirect; noindex self-canonical vs omit tag; `/store` redirect behavior  

---

# PHASE 5 — H1/H2/H3 HEADING FIXES

**Run ID:** Run 6  
**Objective:** Fix heading hierarchy on existing public indexable pages for SEO, SERP, AEO, GEO, accessibility, and AI readability.  
**Why it matters:** Headings are the primary outline for answer engines and screen readers.

**Input docs:** `HEADING_SERP_ONPAGE_SEO_PLAN`, `ROUTE_INVENTORY`, `INDEXING_MATRIX`, `VALIDATION_SCRIPTS_PLAN`, `DEPLOYMENT_CHECKLIST`  
**Files likely affected:** `Home.tsx`, `brand-voice.ts`, `CertificationDetail.tsx`, `Certifications.tsx`, `Compare.tsx`, `FAQ.tsx`, `PathwayFeaturedCard.tsx`, `FamilyExploreCard.tsx`, `CertificationPathway.tsx`, legal/blog/newsletter/community pages, `ChannelLandingPublicView.tsx`, `scripts/seo/headings-check.mjs`, `scripts/seo/h1-check.mjs`

**Dependencies:** Run 2 (SSR content visible); Run 3 (index/noindex — skip checkout/enroll/dashboard)

**Full Run 6 spec:** Cursor plan `seo_aeo_master_docs_37e5bd87.plan.md` → RUN 6 — H1/H2/H3 HEADING STRUCTURE FIXES (complete checklist, codebase audit, 14-point report)

### Known gaps (pre-implementation audit)

| Area | Issue |
|------|-------|
| `Home.tsx` | H1 = "Structured project management capability" — vague; needs certification-focused H1 |
| `FAQ.tsx` | H1 generic; AccordionTrigger questions not H3 — crawlability risk |
| `CardTitle` | Already `<div>` — good; promote visible card titles to H3 under section H2 |
| PMP routes | Do not exist — document heading templates only |
| `RegionGate` | Loading text in `<p>` — Run 2 removes gate; verify no loading H1 |

### Global rules

* One indexable page = one H1 describing page topic
* H2 = major section or search question; H3 = subsection/card/FAQ question
* No Welcome/Home/Loading/Coming Soon/Overview as H1
* Card titles → H3 or non-heading; hero sliders → one H1 only
* Skip noindex: checkout, enroll, dashboard, login

### Homepage targets

**H1:** Project Management Certification Preparation for PMP, PMI-RMP, PRINCE2 and Six Sigma  
**H2s:** What is PM Structure?; PMP Exam Preparation; PMP Exam Change 2026; Foundation/Professional/Mastery; PMI-RMP/PRINCE2/Six Sigma; Scenario Practice; Regional Pricing; FAQ  
**H3s:** PMP Foundation, Professional, Mastery, Scenario Practice, Readiness Diagnostic (under pathway section)

### Implementation tasks

* [ ] Component audit: Hero, cards, FAQ accordion, channel landing
* [ ] Optional `SectionHeading.tsx` with `as`/`level` prop
* [ ] Fix homepage H1 + section H2s + pathway card H3s
* [ ] Fix certification hub H1/H2/H3 (27 certs via `CertificationDetail.tsx`)
* [ ] Fix FAQ H1 rename; category H2s; question H3/crawlability
* [ ] Fix legal H1/H2/H3 (`LegalDocumentLayout.tsx`)
* [ ] Fix blog/newsletter article hierarchy
* [ ] Fix About, Contact, Community, Membership, PMService, `/go/*` portals
* [ ] Document PMP/answer/topic heading templates — no new pages
* [ ] Title/meta: document mismatches; fix safe cases only
* [ ] Add `seo:h1-check` and `seo:headings` scripts
* [ ] Update HEADING_SERP, ROUTE_INVENTORY, PHASE_EXECUTION_BOARD, master plan

### Validation (10 manual + automated)

1. Homepage outline — one meaningful H1  
2. `/certifications/pmp` outline  
3. `/faq` — questions crawlable in view-source  
4. `/legal/terms` outline  
5. `/blog/{slug}` outline  
6. Disable JS — headings visible (Run 2)  
7. Ripgrep `<h1`  
8. Ripgrep "Loading your regional experience"  
9. Cards not outputting H1  
10. Hero carousel not multiple H1s  

**Stop condition:** Heading fixes implemented + 14-point report; do not start Phase 6 AI files  
**Human decisions:** Homepage H1 exact wording; FAQ H3 vs sr-only; CMS vs code default for hero title; optimize all 41 `/go/*` vs subset  

---

# PHASE 6 — AI FILES

**Run ID:** Run 7  
**Objective:** Public AI-readable machine-readable visibility layer for crawlers, AI search, and answer engines.  
**Why it matters:** `llms.txt`, `entity.json`, PMP JSON files, and feeds improve AI citation accuracy and structured extraction.

**Input docs:** `AI_FILES_PLAN`, `FAQ_EXPANSION_MAP`, `COURSE_PAGE_MAP`, `INDEXING_MATRIX`, `VALIDATION_SCRIPTS_PLAN`  
**Files likely affected:** `frontend/public/llms.txt`, `frontend/public/*.json`, `frontend/lib/ai-files/*`, `scripts/generate-ai-files.mjs`, `scripts/seo/ai-files-check.mjs`

**Dependencies:** Run 5 (canonical URLs in JSON); Run 3 (noindex routes for doNotCite lists)

**Full Run 7 spec:** Cursor plan `seo_aeo_master_docs_37e5bd87.plan.md` → RUN 7 — AI FILES (100+ granular todos in plan frontmatter)

### Current state

| Asset | Status |
|-------|--------|
| `frontend/public/llms.txt` | Exists — basic; needs expansion |
| All other AI JSON/XML | Missing |
| FAQ source | `content/faq/data.ts` (~73 entries) |
| PMP dedicated routes | **Missing** — mark `planned` in JSON |

### Compliance (mandatory in every file)

* Independent exam-prep platform — no PMI ATP, no guaranteed pass, no official partner claims unless owner confirms
* Safe: preparation support, readiness pathway, scenario practice, diagnostic readiness
* Unsafe: official PMP training provider, PMI-approved, guaranteed pass, certified by PMI

### Required public files (14+)

* [ ] `/llms.txt` — expand with disclaimer, PMP cluster, cite/exclude lists, lastUpdated
* [ ] `/entity.json` — brand entity, topics, certifications, compliance, bestPagesToCite
* [ ] `/ai-profile.json` — summary, audience, pmpPriority, recommendedCitations, doNotCite
* [ ] `/courses.json` — from site-content; status available/planned; PMP priority
* [ ] `/certifications.json` — PMP strongest; PMI-RMP, PRINCE2, Six Sigma
* [ ] `/learning-pathways.json` — PMP tiers + other cert pathways
* [ ] `/pricing-policy.json` — regional pricing; checkout/payment noindex
* [ ] `/pmp-2026.json` — planned if route missing; officialSourceTodo; no fabricated claims
* [ ] `/pmp-keywords.json` — keyword groups; no fake volume/ranking
* [ ] `/pmp-faq.json` — from existing PMP FAQs; schemaEligible only if published
* [ ] `/pmp-routes.json` — live `/certifications/pmp` + planned route map
* [ ] `/faq.json` — full FAQ index; must match visible /faq content
* [ ] `/rss.xml`, `/feed.xml` — if blog+newsletter published content exists
* [ ] `/humans.txt` — optional

### Implementation architecture

* [ ] `frontend/lib/ai-files/` builders + compliance constants
* [ ] `scripts/generate-ai-files.mjs` → `frontend/public/`
* [ ] `npm run generate:ai-files` + `npm run seo:ai-files-check`
* [ ] All URLs via `canonicalUrl()` / `PMS_SITE_URL`
* [ ] Security scan: no private data, payment/dashboard URLs, secrets, unsupported claims

### Validation (12 manual + automated)

1. Open `/llms.txt`, `/entity.json`, `/pmp-2026.json`, `/pmp-keywords.json`, `/pmp-faq.json`, `/pmp-routes.json`  
2. Grep AI files: "official PMI", "guaranteed", "checkout", "dashboard", "session"  
3. JSON parse all files; build/lint/typecheck; `seo:ai-files-check`  

**Stop condition:** AI files implemented + 13-point report; do not start Phase 7 schema  
**Human decisions:** www vs apex in AI files; static vs route handlers; include planned PMP entries vs omit; prebuild regeneration  

---

# PHASE 7 — SCHEMA / JSON-LD SYSTEM

**Run ID:** Run 8  
**Objective:** Reliable JSON-LD structured data matching visible page content.  
**Why it matters:** Rich results, AI parsers, and trust signals depend on accurate compliant schema.

**Input docs:** `SCHEMA_MATRIX`, `ROUTE_INVENTORY`, `INDEXING_MATRIX`, `AI_FILES_PLAN`, `VALIDATION_SCRIPTS_PLAN`  
**Files likely affected:** `frontend/lib/schema/*`, `frontend/components/seo/*.tsx`, page layouts, `scripts/seo/schema-check.mjs`

**Dependencies:** Run 5 (canonical URLs); Run 6 (H1/title alignment); Run 7 (AI file consistency); Run 2 (SSR JSON-LD)

**Full Run 8 spec:** Cursor plan `seo_aeo_master_docs_37e5bd87.plan.md` → RUN 8 — SCHEMA / JSON-LD (75+ granular todos in plan frontmatter)

### Current state (codebase audit)

| Component | Status | Gap |
|-----------|--------|-----|
| `OrganizationJsonLd` | Global via PublicShell | No `@id`; may be client-blocked (Run 2) |
| `CertJsonLd` | `/certifications/[id]` | Course + Breadcrumb; no `@id`, no WebPage |
| `FaqJsonLd` | `/faq` | **All FAQs in schema** — may not match visible tabbed FAQs |
| WebSite, WebPage, Article, CollectionPage | Missing | Must add |
| `frontend/lib/schema/` | Missing | Create shared builders |

### Compliance (mandatory)

* Independent platform — no PMI ATP, guaranteed pass, fake AggregateRating/reviews/dates/instructors
* Schema must match **visible** page content only
* No schema on checkout, enroll, dashboard, login, admin, API

### Stable @id values (via PMS_SITE_URL)

`#organization`, `#website`, `#webpage`, `[path]#course`, `/faq#faqpage`, `[path]#article`, `[path]#breadcrumb`

### Schema by page type

| Page | Types |
|------|-------|
| `/` | Organization, WebSite, WebPage |
| `/certifications/[id]` | Course, BreadcrumbList, WebPage |
| `/certifications` | CollectionPage, ItemList |
| `/faq` | FAQPage (visible only), WebPage, BreadcrumbList |
| `/blog/[slug]`, `/newsletter/[slug]` | Article, BreadcrumbList |
| `/legal/*` | WebPage, BreadcrumbList |
| `/about` | AboutPage, Organization, BreadcrumbList |
| `/pmp*` | Document TODO — routes N/A |

### Implementation tasks

* [ ] Create `frontend/lib/schema/` builders + `JsonLdScript`
* [ ] Refactor existing seo components to use builders
* [ ] Fix FaqJsonLd visible-FAQ filter (critical)
* [ ] Add WebSite + WebPage on homepage
* [ ] Add Article on blog/newsletter
* [ ] Add CollectionPage on cert hub
* [ ] Add WebPage + Breadcrumb on legal pages
* [ ] Offer schema: audit regional pricing; omit unless safe
* [ ] PMP schema: document TODO for Phase 8–9 routes
* [ ] `seo:schema-check` + SCHEMA_MATRIX update

### Validation (10 manual + automated)

1. Homepage JSON-LD Organization + WebSite  
2. `/certifications/pmp` Course schema  
3. `/faq` FAQPage matches visible FAQs  
4. `/legal/terms` WebPage + Breadcrumb  
5. Grep "PMI ATP", "guaranteed pass"  
6. Grep checkout/dashboard in schema  
7. `seo:schema-check`  
8. Build/lint/typecheck  
9. Rich Results Test (post-deploy)  
10. Schema.org validator (post-deploy)  

**Stop condition:** Schema implemented + 16-point report; do not start Phase 8 PMP pages  
**Human decisions:** Organization vs EducationalOrganization; FAQ tab vs full schema; Offer omit vs membership; Org in server layout vs PublicShell  

---

# PHASE 8 — PMP 2026 AUTHORITY CLUSTER

**Run ID:** Run 9  
**Objective:** Make PMP the dominant authority cluster.  
**Why it matters:** Primary organic and AI visibility engine for PMStructure.com.

**Input docs:** `CONTENT_CLUSTER_MAP`, `HEADING_SERP_PLAN`, `SCHEMA_MATRIX`  
**Files likely affected:** `frontend/app/(site)/pmp/**` (new routes), content modules, `pmp-2026.json`

**Dependencies:** Run 2, Run 3, Phase 4–7 foundations

### Core pages to build

* [ ] `/pmp` — hub
* [ ] `/pmp-exam-2026` — **main authority anchor**
* [ ] `/pmp-current-vs-new-exam`
* [ ] `/pmp-before-8-july-2026`
* [ ] `/pmp-after-9-july-2026`
* [ ] `/pmp-exam-timeline-2026`
* [ ] `/pmp-new-exam-domain-weighting`
* [ ] `/pmp-business-environment-domain`
* [ ] `/pmp-people-domain`
* [ ] `/pmp-process-domain`
* [ ] `/pmp-ai-sustainability-value-delivery`
* [ ] `/pmp-agile-hybrid-predictive`
* [ ] `/pmp-study-plan-2026`

### Per-page requirements

* [ ] Direct answer block at top
* [ ] Current vs new exam comparison
* [ ] Before 8 July / from 9 July guidance
* [ ] Domain weighting section
* [ ] PMP pathway selector CTA
* [ ] Internal links to Foundation, Professional, Mastery
* [ ] TODO_REFERENCE / official source notes (no false affiliation)
* [ ] Independent-platform compliance note
* [ ] Article + FAQPage + Breadcrumb schema
* [ ] Sitemap entry in `sitemap-pmp.xml`

**Stop condition:** PMP 2026 cluster live, validated, linked from homepage and `/certifications/pmp`  

---

# PHASE 9 — PMP COURSE / PATHWAY PAGES

**Run ID:** Run 10  
**Objective:** PMP commercial/course pathway system — Foundation, Professional, Mastery, Diagnostic, Scenario, Mock, Q&A, enrollment, LMS handoff.  
**Dependencies:** Run 9 (PMP hub + 2026 cluster); Runs 5–8 (canonical, headings, AI files, schema)

**Full Run 10 spec:** Cursor plan `seo_aeo_master_docs_37e5bd87.plan.md` → RUN 10 — PMP COURSE / PATHWAY PAGES (95 granular todos)

### MVP minimum (implement first)

1. `/pmp-foundation` 2. `/pmp-professional` 3. `/pmp-mastery` 4. `/pmp-readiness-diagnostic` 5. `/pmp-scenario-practice`

**Follow-up if not content-ready:** `/pmp-mock-exam`, `/pmp-q-and-a-support` (or `/pmp-community-support`), `/pmp-enrollment`

**Enroll handoff:** `/certifications/pmp/{foundation|professional|mastery}/enroll` — **noindex**

### Per-page requirements

* H1/title/meta per plan spec | useful H2s | short answer block
* Who for / not for | outcomes | modules from existing data only
* Current vs new PMP exam relevance | pathway comparison table
* Regional pricing note (no value changes) | LMS handoff | FAQ preview
* Compliance disclaimer | canonical | index | sitemap
* Course + FAQPage (visible) + Breadcrumb schema — **no fake Offer/ratings**

### Shared components

* `PmpPathwayComparisonTable` (crawlable HTML)
* Pathway selector (static recommendations OK; crawlable core)
* FAQ previews with ATP/guarantee compliance answers

### AI files + docs

Regenerate `courses.json`, `learning-pathways.json`, `pmp-routes.json`, `pmp-faq.json`, `llms.txt`. Update COURSE_PAGE_MAP, CONVERSION_FLOW_MAP, ROUTE_INVENTORY, INDEXING_MATRIX.

**Stop condition:** MVP pathway pages live + 19-point report; do not start Phase 10 FAQ expansion  

---

# PHASE 10 — PMP FAQ DOMINANCE

**Run ID:** Run 11  
**Objective:** PMP as strongest FAQ category for AEO.  
**Targets:** Phase 1: 75 PMP FAQs; Phase 2: 150; Phase 3: 300 (quality-gated)

**Input docs:** `FAQ_EXPANSION_MAP`, `FAQ_ANSWER_SPEC.md`  
**Files likely affected:** `frontend/content/faq/data.ts`, `pmp-faq.json`, PMP page FAQ blocks

### FAQ categories (20)

* [ ] PMP Exam Change 2026
* [ ] Current PMP Exam Before 8 July 2026
* [ ] New PMP Exam From 9 July 2026
* [ ] PMP Exam Content Outline
* [ ] PMP Domain Weighting
* [ ] People / Process / Business Environment domains
* [ ] AI, Sustainability and Value Delivery
* [ ] PMP Eligibility, Application, 35 Contact Hours
* [ ] PMP Study Plan, Scenario Practice, Mock Exams, Readiness Diagnostic
* [ ] PMP Foundation / Professional / Mastery
* [ ] PMP Pricing and Regional Access
* [ ] LMS Access, Independent Platform Disclaimer

### Tasks

* [ ] PMP FAQ data model with compliance flags
* [ ] Add to `/faq` hub + PMP pages
* [ ] `sourceUrl` / `TODO_REFERENCE` fields
* [ ] `relatedCourse` / `relatedPage` fields
* [ ] Generate `pmp-faq.json`
* [ ] FAQPage schema only for visible FAQs

**Stop condition:** Phase 1 FAQ count met; compliance review passed  

---

# PHASE 11 — PMP ANSWER PAGES

**Run ID:** Run 12  
**Objective:** Direct-question pages for AI/search (`/answers/[slug]`).  
**Dependencies:** Phase 8–10 content

### Priority slugs

* [ ] `is-the-pmp-exam-changing-in-2026`
* [ ] `when-does-the-new-pmp-exam-start`
* [ ] `should-i-take-pmp-before-8-july-2026`
* [ ] `should-i-prepare-for-new-pmp-after-9-july-2026`
* [ ] `what-is-the-pmp-business-environment-domain`
* [ ] `how-to-prepare-for-pmp-in-2026`
* [ ] `what-is-pmp-readiness`
* [ ] `how-long-does-pmp-preparation-take`
* [ ] `what-is-pmp-scenario-practice`
* [ ] `what-is-the-pmp-exam-content-outline`
* [ ] Plus general answers from master plan (PM Structure identity, comparisons, regional pricing, LMS)

### Template

* [ ] Exact question as H1
* [ ] Short answer + detailed answer
* [ ] Related PMP courses + FAQs + CTA
* [ ] Article + FAQPage + BreadcrumbList schema

**Stop condition:** Answer template + 10 priority PMP answers live  

---

# PHASE 12 — PMP TOPIC HUBS

**Run ID:** Run 13  
**Objective:** Topical authority at `/topics/[slug]`.  
**Dependencies:** Phases 8, 11

### Priority hubs

* [ ] `/topics` index
* [ ] `pmp-exam-preparation`, `pmp-exam-2026`, `pmp-readiness`, `pmp-scenario-practice`
* [ ] `business-environment-domain`, `value-delivery`, `ai-in-project-management`, `sustainability-in-project-management`
* [ ] `agile-project-management`, `hybrid-project-management`, `project-governance`

### Tasks

* [ ] Topic hub template
* [ ] Definition, why it matters, PM Structure viewpoint
* [ ] Related courses, answers, FAQs, CTA
* [ ] CollectionPage + FAQPage schema
* [ ] Sitemap entries

**Stop condition:** Topic hub system live with 11+ priority hubs  

---

# PHASE 13 — REGIONAL PRICING SEO

**Run ID:** Run 14  
**Objective:** Regional pricing SEO-safe after Run 2 fix.  
**Dependencies:** Run 2, Run 3, Phase 4

### Tasks

* [ ] Confirm regional pricing does not block rendering
* [ ] Confirm currency does not create duplicate indexable pages
* [ ] Confirm payment URLs noindex
* [ ] Expand regional pricing FAQ
* [ ] Align `/legal/regional-pricing` policy page
* [ ] Publish `pricing-policy.json`
* [ ] Define Offer schema rules with disclaimers
* [ ] Document in `REGIONAL_PRICING_SEO_PLAN.md`

**Stop condition:** Regional pricing documented and validated  

---

# PHASE 14 — CONVERSION FLOW TRACKING

**Run ID:** Run 15  
**Objective:** Map and instrument conversion paths.  
**Input docs:** `CONVERSION_FLOW_MAP`

### Core journeys

* [ ] Organic → PMP 2026 → diagnostic → pathway → enrollment
* [ ] AI answer → answer page → FAQ → diagnostic → enrollment
* [ ] Social → course → regional pricing → payment
* [ ] FAQ → Calendly consultation
* [ ] Diagnostic → lead capture → pathway

### Tasks

* [ ] Map CTAs, forms, Calendly, payment, LMS handoff
* [ ] Confirm completion pages noindex
* [ ] Event tracking plan (analytics)
* [ ] Privacy/legal disclosures near forms
* [ ] Trust/compliance note near payment/enrollment

**Stop condition:** `CONVERSION_FLOW_MAP.md` complete + tracking hooks specified  

---

# PHASE 15 — LEGAL / COMPLIANCE

**Run ID:** Run 16  
**Objective:** Trust pages and misleading-claim prevention.  
**Dependencies:** Can parallel Phase 8+ content

### Required coverage

* [ ] `/legal/privacy`, `/terms`, `/cookies` (exist)
* [ ] `/legal/refunds` (exists as refunds slug)
* [ ] Independent-platform disclaimer (new or section)
* [ ] `/legal/ai` (exists)
* [ ] Regional pricing policy (`/legal/regional-pricing` exists)
* [ ] Payment terms (map or create)
* [ ] No guaranteed pass disclaimer
* [ ] PMI trademark fair-use caution
* [ ] Legal footer links on all public pages

**Stop condition:** `LEGAL_COMPLIANCE_MAP.md` complete; counsel review flagged  

---

# PHASE 16 — VALIDATION SCRIPTS

**Run ID:** Run 17  
**Objective:** Automate SEO/AEO/GEO safety checks.  
**Dependencies:** All prior phases define rules to validate

### Scripts (`scripts/seo/`)

* [ ] `seo:audit`, `seo:render-check`, `seo:canonical-check`, `seo:noindex-check`
* [ ] `seo:sitemap-check`, `seo:schema-check`, `seo:ai-files-check`
* [ ] `seo:faq-check`, `seo:internal-links-check`, `seo:course-check`
* [ ] `seo:headings`, `seo:h1-check`, `seo:pmp-check`, `seo:all`

**Stop condition:** `seo:all` runs in CI pre-deploy  

---

# PHASE 17 — DEPLOYMENT CHECKLIST

**Run ID:** Run 18  
**Objective:** Pre/post deploy gate.  
**Dependencies:** Phase 16

### Pre-deploy (all must pass)

* [ ] Build, typecheck, lint, `seo:all`
* [ ] Homepage meaningful HTML, sitemap/robots/schema/AI files valid
* [ ] Payment/dashboard noindex; no placeholders indexed

**Stop condition:** `DEPLOYMENT_CHECKLIST.md` complete and used on each release  

---

# PHASE 18 — GSC / BING SUBMISSION

**Run ID:** Run 19  
**Objective:** Search Console + Bing operational runbook.  
**Dependencies:** Phase 3 sitemap live, Phase 8+ priority URLs exist

### Tasks

* [ ] GSC domain + URL-prefix properties
* [ ] Submit sitemap index + child sitemaps
* [ ] URL inspection: homepage, PMP 2026, PMP hub, Foundation/Professional/Mastery, FAQ, diagnostic, answer pages
* [ ] Monitor duplicates, crawled-not-indexed, discovered-not-indexed
* [ ] Bing Webmaster + sitemap + IndexNow consideration

**Stop condition:** `GSC_BING_SUBMISSION_PLAN.md` executed post-deploy  

---

# PHASE 19 — AI ANSWER TESTING

**Run ID:** Run 20  
**Objective:** Track AI/search citation accuracy.  
**Dependencies:** Phases 6–12 content live

### Platforms

Google Search, AI Overviews, Bing, Copilot, ChatGPT, Perplexity, Gemini, Claude, You.com

### Priority PMP queries (15+)

Listed in `PMSTRUCTURE_AI_ANSWER_TESTING_SHEET.md`

### Track per test

platform, query, date, cited Y/N, correct page, accuracy, false affiliation, false guarantee, fix, priority

**Stop condition:** Monthly test schedule operational  

---

## Recommended execution sequence summary

| Run | Phase | Name |
|-----|-------|------|
| 2 | — | Crawlability fix |
| 3 | — | Index/noindex |
| 4 | 3 | Sitemap + robots |
| 5 | 4 | Canonical system |
| 6 | 5 | Headings |
| 7 | 6 | AI files |
| 8 | 7 | Schema |
| 9 | 8 | PMP 2026 cluster |
| 10 | 9 | PMP course pages |
| 11 | 10 | PMP FAQ |
| 12 | 11 | Answer pages |
| 13 | 12 | Topic hubs |
| 14 | 13 | Regional pricing SEO |
| 15 | 14 | Conversion tracking |
| 16 | 15 | Legal/compliance |
| 17 | 16 | Validation scripts |
| 18 | 17 | Deployment checklist |
| 19 | 18 | GSC/Bing |
| 20 | 19 | AI answer testing |

*Phases 13–15 can partially parallel after Phase 9.*
