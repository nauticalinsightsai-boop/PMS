# PM Structure — Phase Prompts (Copy-Paste for Cursor)

Use one prompt per implementation run. Do not combine phases unless explicitly noted.

**Global constraints for every implementation run:**
- PM Structure is an independent exam-prep platform — no PMI ATP, no guaranteed pass claims unless owner confirms.
- Canonical domain: `https://www.pmstructure.com`
- Implement ONLY the phase named in the prompt.
- Read listed docs first; inspect codebase if missing.
- Deliver phase output report at end; stop after phase complete.

---

## Run 2 — Critical Crawlability Fix

```
You are working in the PMStructure.com codebase (Next.js 15, frontend/).

Implement ONLY Run 2: Critical Crawlability and Rendering Fix.

Read: docs/PMSTRUCTURE_SEO_AEO_GEO_AI_VISIBILITY_MASTER_PLAN.md (Phase 2), docs/PMSTRUCTURE_REMAINING_IMPLEMENTATION_PLAN.md, and the Run 2 section in the Cursor plan file.

Root cause: RegionGate.tsx wraps all (site) pages via PublicShell.tsx — crawlers see only "Loading your regional experience…" before hydration.

Goals:
- Public indexable pages render meaningful HTML before JS hydration.
- Regional pricing/CTAs may hydrate after; must not block core content.
- Do NOT build PMP pages, FAQ expansion, schema system, or sitemap rebuild.

Key files: RegionGate.tsx, PublicShell.tsx, RegionContext.tsx, (site)/layout.tsx, Home.tsx, CertificationDetail.tsx, Membership.tsx, ProgramEnrollmentForm.tsx.

Validate: build, lint, view-source homepage without JS, no full-page loading text.

Deliver 13-point report from plan. Stop after this phase.
```

---

## Run 3 — Index / Noindex Control

```
Implement ONLY Run 3: Index / Noindex Control System in PMStructure.com codebase.

Prerequisite: Run 2 crawlability fix must be complete.

Read: docs/PMSTRUCTURE_REMAINING_IMPLEMENTATION_PLAN.md, create docs/PMSTRUCTURE_INDEXING_MATRIX.md.

Goals:
- index,follow on public authority pages (explicit via indexing-metadata helper).
- noindex,nofollow on dashboard, login, checkout, success, cancel, enroll, enroll/success.
- Update sitemap.ts to exclude noindex routes.
- Review robots.ts — do not disallow /checkout if it blocks noindex meta crawl.

Do NOT: build PMP pages, full 13-sitemap split, schema expansion.

Create frontend/lib/indexing-metadata.ts. Update dashboard/frontend/app/layout.tsx robots.

Deliver 14-point report. Stop after this phase.
```

---

## Run 4 — Phase 3: Sitemap + Robots

```
Implement ONLY Phase 3: Sitemap + Robots for PMStructure.com (Next.js 15 App Router).

Prerequisites: Run 2 (crawlability) + Run 3 (index/noindex + INDEXING_MATRIX) complete.

Read: docs/PMSTRUCTURE_INDEXING_MATRIX.md, docs/PMSTRUCTURE_SITEMAP_PLAN.md, docs/PMSTRUCTURE_PHASE_EXECUTION_BOARD.md, docs/PMSTRUCTURE_IMPLEMENTATION_RISK_REGISTER.md, Cursor plan Run 4 section.

PRIMARY GOAL: Sitemap includes ONLY indexable canonical public URLs. Exclude noindex, private, payment, checkout, success/cancel/thank-you, dashboard/login/admin, API, draft, placeholder, UTM/regional duplicates.

CANONICAL: Use PMS_SITE_URL from frontend/config/pms-site.ts (currently https://www.pmstructure.com). Do not hardcode a second domain.

SITEMAP ARCHITECTURE (prefer Option A, fallback Option B):
- Option A: /sitemap.xml index + sitemap-pages.xml, sitemap-certifications.xml, sitemap-articles.xml, sitemap-legal.xml, optional sitemap-portals.xml; TODO stubs for pmp/answers/topics/courses until routes exist.
- Option B: Single filtered sitemap.xml + document split in SITEMAP_PLAN.md.

Fix lastmod: stop using new Date() on every entry; use CMS dates or omit.

ROBOTS.TXT:
- Sitemap: {PMS_SITE_URL}/sitemap.xml
- Allow: /
- Remove disallow on /checkout (crawlers need noindex meta from Run 3)
- Safe disallow: /api/, /admin/, /dashboard/, /login/ if noindex on those pages
- Do not block /_next/static or public assets

Create: frontend/lib/sitemap/* helpers, scripts/seo/sitemap-check.mjs, npm run seo:sitemap-check.

Do NOT: build PMP/FAQ/answer/topic pages, schema, AI files, change pricing/course/legal copy, change index rules except sitemap consistency.

Validate: 12 manual grep checks (checkout, payment, dashboard, login, thank, success, cancel, api absent from sitemap). Build + lint.

Deliver 14-point report. Stop after this phase only.
```

---

## Run 5 — Phase 4: Canonical System

```
You are working inside the PMStructure.com codebase (Next.js 15 App Router, frontend/).

Implement ONLY this phase: PHASE 4 — CANONICAL URL SYSTEM.

Do NOT implement unrelated SEO phases, PMP pages, FAQ expansion, answer pages, topic hubs, full schema, AI files, course content changes, pricing values, or legal language (unless required for canonical safety).

PRIMARY GOAL: Clean canonical URL system so Google, Bing, AI crawlers, and answer engines understand the representative URL for every indexable public page.

Prevent duplicate indexing from: www vs non-www, http vs https, trailing slash inconsistencies, UTM/tracking/region/currency/payment/session parameters, duplicate course/category paths, landing-page variants, query-string versions of public pages.

READ FIRST (if present):
- docs/PMSTRUCTURE_SEO_AEO_GEO_AI_VISIBILITY_MASTER_PLAN.md
- docs/PMSTRUCTURE_ROUTE_INVENTORY.md
- docs/PMSTRUCTURE_INDEXING_MATRIX.md
- docs/PMSTRUCTURE_SITEMAP_PLAN.md
- docs/PMSTRUCTURE_HEADING_SERP_ONPAGE_SEO_PLAN.md
- docs/PMSTRUCTURE_PHASE_EXECUTION_BOARD.md
- docs/PMSTRUCTURE_DEPENDENCY_MAP.md
- docs/PMSTRUCTURE_IMPLEMENTATION_RISK_REGISTER.md
- docs/PMSTRUCTURE_VALIDATION_SCRIPTS_PLAN.md
- docs/PMSTRUCTURE_DEPLOYMENT_CHECKLIST.md
- Cursor plan seo_aeo_master_docs_37e5bd87.plan.md → RUN 5 section

Prerequisites: Run 2 (SSR), Run 3 (index/noindex), Run 4 (sitemap).

CANONICAL DOMAIN:
- Single source of truth: PMS_SITE_URL from frontend/config/pms-site.ts (currently https://www.pmstructure.com).
- User spec may say apex pmstructure.com — use env, do not hardcode two domains in page files.
- All canonicals: HTTPS, no UTM, no region/currency/session/checkout tokens.
- Do not canonicalize private/dashboard/account/payment/checkout/success/cancel/thank-you/API/draft/preview/loading pages as authority pages.

SCOPE — existing routes only: homepage, about, certifications, blog, newsletter, legal (all variants), faq, contact, community, membership, pm-service, /go/* portals. Future /pmp*, /answers/*, /topics/* — document TODO only, do not create.

TECHNICAL (Next.js App Router):
- Create frontend/lib/canonical.ts: canonicalUrl(), stripQueryParams(), STRIPPED_QUERY_KEYS.
- Integrate into frontend/lib/site-metadata.ts buildPageMetadata (alternates.canonical + openGraph.url).
- Fix gaps: legal/terms, privacy, cookies, services, pricing-disclaimers (title only today); legal/privacy/[region], gcc/[country]; blog/[slug], newsletter/[slug]; go/[channel] (prefer absolute canonical).
- Sitemap entries MUST use same canonicalUrl() as metadata (Run 4 helpers).
- Middleware/next.config: document www/http/trailing-slash; only implement safe redirects; do not break checkout/payment/API.

REGIONAL PRICING: Client-side RegionContext — canonical strips ?currency=, ?region=, ?country=; do not break pricing widgets.

UTM/TRACKING: Strip utm_*, gclid, fbclid, msclkid from canonical; runtime navigation unchanged for analytics.

PAYMENT: checkout/enroll remain noindex; excluded from sitemap; self-canonical with noindex OK; do not normalize session tokens.

VALIDATION: npm run build, lint, seo:canonical-check; manual: homepage, cert, faq, legal, blog; ?utm_source=test and ?currency=AED confirm clean canonical; sitemap === canonical; checkout flow intact.

DELIVER 16-point report from Cursor plan Run 5. Stop after this phase only.
```

---

## Run 6 — Phase 5: H1/H2/H3 Headings

```
You are working inside the PMStructure.com codebase (Next.js 15 App Router, frontend/).

Implement ONLY this phase: PHASE 5 — H1 / H2 / H3 HEADING STRUCTURE FIXES.

Do NOT implement unrelated SEO phases, new PMP pages, FAQ expansion, answer pages, topic hubs, AI files, full schema, pricing values, payment logic, or course business logic. Do not rewrite entire website content unless required for heading clarity.

PRIMARY GOAL: Fix heading hierarchy on existing public indexable pages so crawlers, AI systems, search engines, and screen readers understand page structure.

Every indexable public page should have: exactly one H1; useful H2s; H3s under relevant H2s; no multiple unrelated H1s; no missing H1s; no "Loading," "Welcome," "Home," or "Coming Soon" as H1; no decorative headings; no card H1s; no hero slider multiple H1s.

READ FIRST (if present):
- docs/PMSTRUCTURE_SEO_AEO_GEO_AI_VISIBILITY_MASTER_PLAN.md
- docs/PMSTRUCTURE_ROUTE_INVENTORY.md
- docs/PMSTRUCTURE_HEADING_SERP_ONPAGE_SEO_PLAN.md
- docs/PMSTRUCTURE_INDEXING_MATRIX.md
- docs/PMSTRUCTURE_SITEMAP_PLAN.md
- docs/PMSTRUCTURE_PHASE_EXECUTION_BOARD.md
- docs/PMSTRUCTURE_DEPENDENCY_MAP.md
- docs/PMSTRUCTURE_IMPLEMENTATION_RISK_REGISTER.md
- docs/PMSTRUCTURE_VALIDATION_SCRIPTS_PLAN.md
- docs/PMSTRUCTURE_DEPLOYMENT_CHECKLIST.md
- Cursor plan seo_aeo_master_docs_37e5bd87.plan.md → RUN 6 section

Prerequisites: Run 2 (SSR headings visible); Run 3 (index/noindex matrix).

SCOPE — existing pages only: /, /about, /contact, /faq, /community, /membership, /pm-service, /certifications/*, /blog, /newsletter, /legal/*, /go/*. Do NOT create /pmp*, /answers/*, /topics/* — document templates only.

SKIP (no heading SEO): checkout, enroll, dashboard, login, admin, draft portals. Confirm noindex.

GLOBAL RULES: H1=page topic; H2=major section/search question; H3=subsection/card/FAQ question; CardTitle stays div (ui/card.tsx); visual styling ≠ semantic level.

KNOWN GAPS:
- Home.tsx H1 = "Structured project management capability" (HOME_COPY.heroTitle) — replace with recommended certification-focused H1.
- FAQ.tsx: cluster H2s OK; AccordionTrigger questions need H3 or crawlable question markup.
- CertificationDetail.tsx: good H1 pattern; audit H2 labels.
- No PMP dedicated routes exist yet.

HOMEPAGE recommended H1: Project Management Certification Preparation for PMP, PMI-RMP, PRINCE2 and Six Sigma
HOMEPAGE H2s: What is PM Structure?; PMP Exam Preparation; PMP Exam Change 2026; Foundation/Professional/Mastery; PMI-RMP/PRINCE2/Six Sigma; Scenario Practice; Regional Pricing; FAQ
Pathway cards → H3.

COMPONENT AUDIT: Home hero, CertificationDetail, PathwayFeaturedCard, FamilyExploreCard, CertificationPathway, FAQ FaqAccordionList, channel ChannelLandingPublicView, NewsletterComponents.

TITLE/META: Document title/H1 mismatches; fix only safe obvious cases via buildPageMetadata; no wholesale meta rewrites.

VALIDATION: npm run build, lint, seo:h1-check, seo:headings; grep <h1; manual outline on homepage, cert, faq, legal; disable JS check (Run 2); no visual regression.

DELIVER 14-point report from Cursor plan Run 6. Stop after this phase only.
```

---

## Run 7 — Phase 6: AI Files

```
You are working inside the PMStructure.com codebase (Next.js 15, frontend/).

Implement ONLY this phase: PHASE 6 — AI FILES / MACHINE-READABLE VISIBILITY LAYER.

Do NOT implement unrelated SEO phases, new PMP pages, FAQ expansion, answer pages, topic hubs, full schema, pricing/payment/course logic changes, or unsupported claims.

PRIMARY GOAL: Public AI-readable files for Google, Bing, AI Overviews, Copilot, ChatGPT, Perplexity, Gemini, AI crawlers, and structured parsers.

READ FIRST (if present): MASTER_PLAN, ROUTE_INVENTORY, INDEXING_MATRIX, SITEMAP_PLAN, HEADING_SERP, AI_FILES_PLAN, COURSE_PAGE_MAP, FAQ_EXPANSION_MAP, ANSWER_PAGES_MAP, TOPIC_HUBS_MAP, CONTENT_CLUSTER_MAP, PHASE_EXECUTION_BOARD, DEPENDENCY_MAP, RISK_REGISTER, VALIDATION_SCRIPTS_PLAN, DEPLOYMENT_CHECKLIST, Cursor plan RUN 7 section.

Prerequisites: Run 5 canonical URLs (canonicalUrl/PMS_SITE_URL in all JSON).

COMPLIANCE: PM Structure = independent exam-prep platform. Do NOT claim PMI ATP, official partner, guaranteed pass, or official certification provider unless owner confirmed. Use safe language: preparation support, readiness pathway, scenario practice.

CANONICAL: All URLs via PMS_SITE_URL / canonicalUrl() — HTTPS, no UTM/currency/checkout/dashboard/session/noindex citation URLs.

REQUIRED FILES:
- /llms.txt (expand existing frontend/public/llms.txt)
- /entity.json, /ai-profile.json, /courses.json, /certifications.json, /learning-pathways.json
- /pricing-policy.json, /pmp-2026.json, /pmp-keywords.json, /pmp-faq.json, /pmp-routes.json, /faq.json
- /rss.xml, /feed.xml if blog+newsletter published content exists
- /humans.txt optional

DATA SOURCES (generate from source, do not duplicate hardcoded):
- frontend/content/faq/data.ts (FAQ_ENTRIES)
- frontend/data/siteData.ts (27 certifications)
- packages/site-content, blog/posts.ts, newsletter/articles.ts
- frontend/config/pms-site.ts (PMS_SITE_URL, PMS_SUPPORT_EMAIL)

PMP ROUTES: /pmp, /pmp-exam-2026, etc. do NOT exist — mark status planned in JSON; cite live /certifications/pmp; TODO in AI_FILES_PLAN.

IMPLEMENTATION:
- frontend/lib/ai-files/ builders + compliance constants
- scripts/generate-ai-files.mjs → frontend/public/
- scripts/seo/ai-files-check.mjs + npm run seo:ai-files-check
- pmp-2026.json: officialSourceTodo for unverified claims; domain weights only if verified
- pmp-keywords.json: planning map only — no fake volume/ranking
- faq.json/pmp-faq.json: schemaEligible only for published visible FAQs

SECURITY SCAN: no private data, payment/session URLs, dashboard/admin, secrets, guaranteed pass, unsupported PMI claims.

VALIDATION: all files load publicly; JSON validates; grep official PMI/guaranteed/checkout/dashboard/session; build/lint/typecheck; seo:ai-files-check.

DELIVER 13-point report from Cursor plan Run 7. Stop after this phase only.
```

---

## Run 8 — Phase 7: Schema / JSON-LD

```
You are working inside the PMStructure.com codebase (Next.js 15 App Router, frontend/).

Implement ONLY this phase: PHASE 7 — SCHEMA / JSON-LD STRUCTURED DATA SYSTEM.

Do NOT implement unrelated SEO phases, new PMP pages, FAQ expansion, answer/topic pages, pricing/payment/course logic changes, or fake reviews/ratings/accreditation/unsupported claims.

PRIMARY GOAL: Reliable JSON-LD so Google, Bing, AI search, answer engines, and parsers understand PM Structure entity, courses, FAQs, articles, breadcrumbs, and hubs.

READ FIRST (if present): MASTER_PLAN, SCHEMA_MATRIX, ROUTE_INVENTORY, INDEXING_MATRIX, AI_FILES_PLAN, COURSE_PAGE_MAP, FAQ_EXPANSION_MAP, ANSWER_PAGES_MAP, TOPIC_HUBS_MAP, HEADING_SERP, PHASE_EXECUTION_BOARD, DEPENDENCY_MAP, RISK_REGISTER, VALIDATION_SCRIPTS, DEPLOYMENT_CHECKLIST, Cursor plan RUN 8 section.

Also inspect AI files if created: llms.txt, entity.json, faq.json, pmp-faq.json, courses.json.

Prerequisites: Run 5 canonical URLs; Run 6 headings align with schema names; Run 7 AI file consistency; Run 2 SSR (JSON-LD not behind RegionGate).

COMPLIANCE: Independent exam-prep platform. NO PMI ATP, official partner, guaranteed pass, AggregateRating, fake reviews, fake dates, fake instructors, fake accreditation. Schema must match VISIBLE page content only.

STABLE @id (use PMS_SITE_URL): #organization, #website, #webpage, [path]#course, /faq#faqpage, [path]#article, [path]#breadcrumb

CURRENT STATE:
- OrganizationJsonLd in PublicShell (no @id)
- CertJsonLd Course+Breadcrumb on /certifications/[id]
- FaqJsonLd on /faq — BUG: getFaqForSchema() exports ALL FAQs; must fix to visible FAQs only
- Missing: WebSite, WebPage, Article, CollectionPage, Offer (likely omit)

IMPLEMENTATION:
- Create frontend/lib/schema/ builders + JsonLdScript component
- Refactor components/seo/*.tsx to use builders
- Homepage: Organization + WebSite + WebPage
- /certifications hub: CollectionPage + ItemList
- /blog/[slug], /newsletter/[slug]: Article (real dates only)
- /legal/*: WebPage + BreadcrumbList
- FAQPage: visible FAQs only; exclude draft/planned
- Offer: omit unless price stable in SSR HTML; document decision
- PMP routes (/pmp*): document TODO — routes do not exist
- NO schema on checkout, enroll, dashboard, login, admin, API

VALIDATION: seo:schema-check; view-source homepage/cert/faq/legal; grep PMI ATP/guaranteed/checkout/dashboard; build/lint; Rich Results Test post-deploy.

DELIVER 16-point report from Cursor plan Run 8. Stop after this phase only.
```

---

## Run 9 — Phase 8: PMP 2026 Authority Cluster

```
Implement ONLY Phase 8: PMP 2026 authority cluster for PMStructure.com.

Prerequisites: Runs 2, 3, 4, 5, 7.

Read: docs/PMSTRUCTURE_CONTENT_CLUSTER_MAP.md, docs/PMSTRUCTURE_REMAINING_IMPLEMENTATION_PLAN.md Phase 8.

Build routes under frontend/app/(site)/pmp/:
- /pmp (hub)
- /pmp-exam-2026 (main anchor — prioritize quality)
- /pmp-current-vs-new-exam, /pmp-before-8-july-2026, /pmp-after-9-july-2026
- /pmp-exam-timeline-2026, /pmp-new-exam-domain-weighting
- Domain pages: business-environment, people, process, ai-sustainability-value-delivery, agile-hybrid-predictive
- /pmp-study-plan-2026

Each page: H1/H2 per HEADING plan, direct answer block, comparison tables, FAQ section, Article+FAQPage schema, internal links to /certifications/pmp and future course pages, independent-platform disclaimer, TODO_REFERENCE for PMI official sources.

Add to sitemap-pmp.xml. Link from homepage and /certifications/pmp.

Do NOT: build all 300 FAQs or answer pages in this run. Stop after phase.
```

---

## Run 10 — Phase 9: PMP Course / Pathway Pages

```
You are working inside the PMStructure.com codebase (Next.js 15 App Router, frontend/).

Implement ONLY this phase: PHASE 9 — PMP COURSE / PATHWAY PAGES.

Do NOT: full FAQ expansion, answer pages, topic hubs, payment provider changes, pricing value changes, private LMS exposure, ATP/guaranteed-pass claims, fabricated modules/prices/dates/instructors/reviews.

PRIMARY GOAL: Build/optimize PMP pathway pages for Foundation, Professional, Mastery, Diagnostic, Scenario Practice, Mock Exam, Q&A Support, enrollment, LMS handoff, regional pricing note, current vs new exam guidance.

READ FIRST: COURSE_PAGE_MAP, CONTENT_CLUSTER, CONVERSION_FLOW, REGIONAL_PRICING, LEGAL_COMPLIANCE, SCHEMA_MATRIX, AI_FILES_PLAN, HEADING_SERP, INDEXING_MATRIX, SITEMAP_PLAN, Cursor plan RUN 10 section + AI JSON files if exist.

Prerequisites: Run 9 (/pmp hub + 2026 cluster), Run 5 canonical, Run 6 headings, Run 8 schema, Run 7 AI files.

COMPLIANCE: Independent exam-prep. No PMI ATP, official partner, guaranteed pass. Standard disclaimer on every page.

MVP MINIMUM (implement first): /pmp-foundation, /pmp-professional, /pmp-mastery, /pmp-readiness-diagnostic, /pmp-scenario-practice. Document mock-exam, q-and-a-support, enrollment as follow-up if not content-ready. NO empty placeholder pages.

ENROLL HANDOFF: CTAs → /certifications/pmp/{foundation|professional|mastery}/enroll (noindex). Data from regional-catalogue, pathway-tier-outcomes, programme-preview — do not invent modules.

GLOBAL PER PAGE: H1+H2s, short answer, who for/not for, outcomes, modules (existing data), current/new exam relevance, regional pricing note, LMS handoff, FAQ preview, compliance, canonical, index, sitemap, Course+FAQPage(visible)+Breadcrumb schema.

PAGES: Full H1/title/meta/H2 specs in Cursor plan for foundation, professional, mastery, diagnostic, scenario-practice.

COMPARISON TABLE: Reusable crawlable HTML table on /pmp + course pages (Foundation, Professional, Mastery, Diagnostic, Scenario, Mock rows).

PATHWAY SELECTOR: Static OK; crawlable core; no indexable thank-you pages.

FAQ PREVIEWS: Small visible blocks including ATP and guarantee compliance answers. Not full 75-FAQ expansion.

INTERNAL LINKS: Cross-link all live pathway pages; /pmp and /pmp-exam-2026 link in; homepage/faq link out.

AI FILES: Regenerate courses.json, learning-pathways.json, pmp-routes.json, pmp-faq.json, llms.txt — live=available, unbuilt=planned.

VALIDATION: each live page loads; H1/meta/canonical/sitemap; grep ATP/guaranteed; enroll+LMS work; build/lint.

DELIVER 19-point report from Cursor plan Run 10. Stop after this phase only.
```

---

## Run 11 — Phase 10: PMP FAQ Dominance

```
Implement ONLY Phase 10: PMP FAQ expansion Phase 1 (75 PMP FAQs + compliance flags).

Read: docs/PMSTRUCTURE_FAQ_EXPANSION_MAP.md, docs/FAQ_ANSWER_SPEC.md.

Extend frontend/content/faq/data.ts. Add PMP categories. Surface on /faq and PMP pages. Update pmp-faq.json via generate script.

Compliance: no ATP, no guaranteed pass. sourceUrl and relatedPage fields.

Do NOT: ship Phase 2 (150) in same run. Stop after phase.
```

---

## Run 12 — Phase 11: PMP Answer Pages

```
Implement ONLY Phase 11: Answer page system at /answers/[slug].

Template: question H1, short answer, detailed answer, related courses, FAQs, CTA, Article+FAQPage+Breadcrumb schema.

Build 10 priority PMP answers from ANSWER_PAGES_MAP. Add /answers index. sitemap-answers.xml entries.

Prerequisites: Phases 8–10. Stop after phase.
```

---

## Run 13 — Phase 12: PMP Topic Hubs

```
Implement ONLY Phase 12: Topic hubs at /topics and /topics/[slug].

Build 11 priority hubs from TOPIC_HUBS_MAP. CollectionPage schema. Link to answers, courses, PMP cluster.

Prerequisites: Phases 8, 11. Stop after phase.
```

---

## Run 14 — Phase 13: Regional Pricing SEO

```
Implement ONLY Phase 13: Regional pricing SEO safety audit and docs.

Confirm Run 2 non-blocking behavior. Document Offer schema rules. Expand regional pricing FAQ. Align pricing-policy.json and /legal/regional-pricing.

Read: docs/PMSTRUCTURE_REGIONAL_PRICING_SEO_PLAN.md. No pricing value changes unless needed for fallback display.

Stop after phase.
```

---

## Run 15 — Phase 14: Conversion Flow Tracking

```
Implement ONLY Phase 14: Conversion flow map and event tracking plan.

Read: docs/PMSTRUCTURE_CONVERSION_FLOW_MAP.md.

Map all CTAs, forms, Calendly, payment, LMS handoff. Document analytics events. Confirm completion pages noindex. Add compliance notes near forms.

Implementation may be analytics hooks only — no business logic changes.

Stop after phase.
```

---

## Run 16 — Phase 15: Legal / Compliance

```
Implement ONLY Phase 15: Legal/compliance documentation and gap fixes.

Read: docs/PMSTRUCTURE_LEGAL_COMPLIANCE_MAP.md.

Audit existing /legal routes. Add independent-platform disclaimer page or section. Ensure no guaranteed pass language. PMI fair-use note. Footer legal links audit.

Do NOT rewrite legal counsel-approved text without approval. Flag counsel review items.

Stop after phase.
```

---

## Run 17 — Phase 16: Validation Scripts

```
Implement ONLY Phase 16: SEO validation script suite in scripts/seo/.

Implement all seo:* scripts from VALIDATION_SCRIPTS_PLAN. npm run seo:all aggregates checks.

Wire into package.json. Document in VALIDATION_SCRIPTS_PLAN.md.

Stop after phase.
```

---

## Run 18 — Phase 17: Deployment Checklist

```
Implement ONLY Phase 17: Finalize docs/PMSTRUCTURE_DEPLOYMENT_CHECKLIST.md and integrate seo:all as pre-deploy gate.

Document pre/post deploy steps. No new features.

Stop after phase.
```

---

## Run 19 — Phase 18: GSC / Bing Submission

```
This is an operational run (mostly manual). Execute docs/PMSTRUCTURE_GSC_BING_SUBMISSION_PLAN.md.

Prerequisites: Production deploy with Runs 2–8+ complete, sitemap live.

Add GSC/Bing properties, submit sitemaps, URL inspect priority list, set up monitoring. Document results in GSC plan doc.

Stop after checklist executed.
```

---

## Run 20 — Phase 19: AI Answer Testing

```
Operational run: execute docs/PMSTRUCTURE_AI_ANSWER_TESTING_SHEET.md.

Run priority PMP queries across Google, Bing, Copilot, Perplexity, ChatGPT, Gemini. Record citations, accuracy, compliance risks. Schedule monthly retest.

No code unless sheet template needs formatting. Stop after first test cycle documented.
```

---

## Recommended next implementation phase (after this planning run)

**Run 2 — Critical Crawlability and Rendering Fix** (use Run 2 prompt above).

Blockers: None for starting Run 2.  
Warnings: Do not skip to Phase 8 PMP content before Runs 2–3.
