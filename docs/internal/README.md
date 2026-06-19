# Internal business controls

Files in this folder are **internal only**. They are not published on the public PM Structure website.

Do not:

- link these files from public navigation, footer, or homepage;
- add public routes that expose burn-rate or financial data;
- copy these files into `frontend/public/` or any deployable static asset path.

Monthly burn review: see `PMSTRUCTURE_BURN_CONTROL.md` and `pmstructure-burn-tracker-template.csv`.

Monthly revenue-gate review: see `PMSTRUCTURE_REVENUE_GATES.md` and `pmstructure-revenue-gates-template.csv`.

Kill/pivot review: see `PMSTRUCTURE_KILL_PIVOT_THRESHOLDS.md`, `pmstructure-kill-pivot-review-template.csv`, and `PMSTRUCTURE_FUNNEL_DIAGNOSIS_PLAYBOOK.md`.

90-day marketing schedule: see `PMSTRUCTURE_90_DAY_MARKETING_SCHEDULE.md` and `pmstructure-90-day-marketing-schedule.csv`.

Canonical host / redirects: see `PMSTRUCTURE_REDIRECT_DEPLOYMENT_NOTE.md`.

Performance budget: see `PMSTRUCTURE_PERFORMANCE_BUDGET.md`.

Analytics setup (GA4 base tracking): see `PMSTRUCTURE_ANALYTICS_SETUP.md`.

Analytics / conversion system (B03): see `PMSTRUCTURE_ANALYTICS_CONVERSION_SYSTEM.md`, `pmstructure-event-map.csv`, `PMSTRUCTURE_GA4_GSC_REPORTING_QA.md`, and `pmstructure-offline-conversion-template.csv`.

Conversion tracking (T-013): see `PMSTRUCTURE_CONVERSION_TRACKING_PLAN.md`.

XML sitemap (T-015): see `PMSTRUCTURE_SITEMAP_NOTES.md`.

Search Console sitemap submission (T-016): see `PMSTRUCTURE_SEARCH_CONSOLE_SUBMISSION.md`.

Robots.txt sitemap reference (T-017): see `PMSTRUCTURE_ROBOTS_SITEMAP_CHECK.md` and `.cursor/plans/t-017_robots_sitemap.plan.md`.

Owner GSC/Bing UI steps (5 min): see `PMSTRUCTURE_OWNER_SEO_UI_CHECKLIST.md`.

Keyword & anchor map Phase Two (T-022): see `PMSTRUCTURE_KEYWORD_ANCHOR_MAP_PHASE_2.md`, `pmstructure-keyword-anchor-map-phase-2.csv`, and `.cursor/plans/t-022_keyword_anchor_map.plan.md`.

Indexability / sandbox check (T-025): see `PMSTRUCTURE_INDEXABILITY_SANDBOX_CHECK.md`, `pmstructure-indexability-matrix.csv`, and `.cursor/plans/t-025_indexability_check.plan.md`.

Mixed content / insecure URLs (T-028): see `PMSTRUCTURE_MIXED_CONTENT_AUDIT.md` and `.cursor/plans/t-028_mixed_content_fix.plan.md`.

Technical hygiene, backup, editability, plugins (B09): see `PMSTRUCTURE_TECHNICAL_HYGIENE.md`, `pmstructure-technical-hygiene-audit.csv`, `pmstructure-plugin-applicability-matrix.csv`, `PMSTRUCTURE_EDITING_GUIDE.md`, and `PMSTRUCTURE_BACKUP_RESTORE_RUNBOOK.md`. Audits: `npm run audit:technical-hygiene`, `npm run audit:links`, `npm run seo:audit-insecure-content`.

Competitor research and SERP benchmarking (B10): see `PMSTRUCTURE_COMPETITOR_BENCHMARK.md`, `pmstructure-competitor-benchmark.csv`, `pmstructure-competitor-metrics.csv`, `pmstructure-keyword-gap-benchmark.csv`, `pmstructure-offer-comparison-benchmark.csv`, and `pmstructure-claims-risk-benchmark.csv`. Audit: `npm run audit:competitor-benchmark`.

PMP 2026 content engine (B11): see `PMSTRUCTURE_CONTENT_ENGINE.md`, `PMSTRUCTURE_PMP_2026_FACT_LOCK.md`, `pmstructure-content-inventory.csv`, `pmstructure-pmp-2026-source-review.csv`, `pmstructure-answer-library.csv`, and `pmstructure-90-day-content-calendar.csv`. Cross-link editorial calendar to `PMSTRUCTURE_90_DAY_MARKETING_SCHEDULE.md` (marketing ops). Audit: `npm run audit:content-engine`.

PMP 2026 owner validation (post-B11): see `pmstructure-owner-validation-register.csv`, `pmstructure-legal-disclaimer-review.csv`, `pmstructure-regional-route-approval.csv`, `pmstructure-author-reviewer-registry.csv`, and `PMSTRUCTURE_B03_GSC_GA4_VALIDATION_CHECKLIST.md`.

Offer, trust, CTA, and regional positioning (B12): see `PMSTRUCTURE_OFFER_TRUST_SYSTEM.md`, `PMSTRUCTURE_CORPORATE_COHORT_BRIEF.md`, `pmstructure-cta-inventory.csv`, `pmstructure-offer-package-matrix.csv`, `pmstructure-testimonial-verification.csv`, `pmstructure-community-platform-decision.csv`, `pmstructure-regional-positioning-rules.csv`, and `pmstructure-scholarship-rules.csv`. Audit: `npm run audit:offer-trust`.

Reporting, weekly SEO dashboard, scan links, monthly audit, and QA sign-off (B13): see `PMSTRUCTURE_REPORTING_QA_SYSTEM.md`, `PMSTRUCTURE_WEEKLY_REPORT_TEMPLATE.md`, `pmstructure-weekly-seo-dashboard.csv`, `pmstructure-result-scan-links.csv`, `pmstructure-monthly-technical-audit.csv`, and `pmstructure-qa-signoff-register.csv`. Audits: `npm run audit:reporting-qa`, `npm run audit:weekly-seo-health`.

Local / brand SEO, GBP deferrals, citations, favicon, social, site search (B14): see `PMSTRUCTURE_LOCAL_BRAND_SEO_SYSTEM.md`, `pmstructure-local-seo-applicability.csv`, `pmstructure-gbp-readiness-checklist.csv`, `pmstructure-citation-nap-register.csv`, `pmstructure-social-link-register.csv`, and `pmstructure-site-search-decision.csv`. Audit: `npm run audit:local-brand-seo`.

Site architecture (T-032): see `PMSTRUCTURE_SITE_ARCHITECTURE.md`, `pmstructure-site-architecture.csv`, and `.cursor/plans/t-032_site_architecture_6ad6b920.plan.md`.

302 redirect audit (T-037): see `PMSTRUCTURE_302_REDIRECT_AUDIT.md`, `pmstructure-302-redirect-audit.csv`.

Redirect / URL canonicalization (B05): see `PMSTRUCTURE_REDIRECT_URL_CANONICALIZATION.md`, `pmstructure-redirect-map.csv`, `pmstructure-302-audit.csv`, `pmstructure-410-review.csv`, and `frontend/content/redirects/inventory.ts`.

Indexation strategy (T-038): see `PMSTRUCTURE_INDEXATION_STRATEGY.md`, `pmstructure-indexation-strategy.csv`, and `frontend/content/indexation/strategy.ts`.

Crawl / sitemap / indexation control (B04): see `PMSTRUCTURE_CRAWL_INDEXATION_CONTROL.md`, `pmstructure-indexation-control-matrix.csv`, and `PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md`.

Architecture, keywords, and on-page SEO (B06): see `PMSTRUCTURE_ARCHITECTURE_ON_PAGE_SEO.md`, `pmstructure-keyword-url-map.csv`, `pmstructure-on-page-seo-audit.csv`, `pmstructure-internal-link-map.csv`, and `pmstructure-breadcrumb-map.csv`. Audit: `npm run seo:audit-on-page-seo`.

Final crawl fixes, priority URL QA, A–Z closeout, digital PR register (B15): see `PMSTRUCTURE_FINAL_CRAWL_CLOSEOUT.md`, `pmstructure-crawl-findings-register.csv`, `pmstructure-priority-url-qa.csv`, `pmstructure-legacy-url-decision-register.csv`, `pmstructure-a-z-implementation-closeout.csv`, `pmstructure-digital-pr-backlink-register.csv`, `pmstructure-final-owner-action-list.csv`, and `.cursor/plans/b15_final_crawl_closeout.plan.md`. Audits: `npm run seo:audit-crawl-indexation`, `npm run seo:t022-live-qa`, `npm run seo:smoke-live`.

Performance, PageSpeed, images, caching (B08): see `PMSTRUCTURE_PERFORMANCE_SYSTEM.md`, `PMSTRUCTURE_PERFORMANCE_BUDGET.md`, `pmstructure-performance-audit.csv`, `pmstructure-image-optimization-inventory.csv`, and `pmstructure-third-party-script-inventory.csv`. Audits: `npm run audit:performance-assets`, `npm run optimize:brand-icons` (owner-run asset refresh).
