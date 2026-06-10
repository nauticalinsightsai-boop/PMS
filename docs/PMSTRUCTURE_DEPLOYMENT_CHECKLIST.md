# PM Structure — Deployment Checklist

**Run:** 18 (Phase 17)  
**Site:** https://www.pmstructure.com

## Pre-deploy (17)

1. [ ] Branch merged to release; changelog notes PMP/FAQ/answer/topic routes if applicable
2. [ ] `npm ci` (or clean install) on deploy host
3. [ ] Production env vars set (`NEXT_PUBLIC_SITE_URL`, Supabase, Stripe, etc.)
4. [ ] `npm run build -w @pms/frontend` succeeds with zero errors
5. [ ] `npm run seo:all` green (audit + 17 checks + AI files + legal-seo)
6. [ ] `npm run seo:postbuild` after build — 8 routes with H1 + answer body in static HTML
7. [ ] All 14 AI files present (`entity.json`, `ai-profile.json`, `courses.json`, `certifications.json`, `learning-pathways.json`, `pmp-2026.json`, `pmp-keywords.json`, `pmp-faq.json`, `pmp-routes.json`, `faq.json`, `answers.json`, `topics.json`, `pricing-policy.json`, `llms.txt`) — run `npm run seo:generate-ai-files`
8. [ ] Spot-check `/pmp-exam-2026`, `/pmp`, `/certifications/pmp`, `/faq` (pmp-2026 tab)
9. [ ] Spot-check 2× `/answers/*` and 2× `/topics/*` — single H1, canonical, breadcrumbs
10. [ ] `/legal/pricing-disclaimers` and `/legal/regional-pricing` render; footer legal links work
11. [ ] Enroll/checkout routes (`/enroll/*`, `/checkout/*`) have `noindex` in metadata
12. [ ] Canonical strips `currency`, `region`, UTM params (view-source on cert page with query string)
13. [ ] No secrets or `.env.local` in deploy artifact
14. [ ] `robots.txt` allows indexable routes; disallows admin/dashboard if applicable
15. [ ] Sitemap generator includes PMP cluster, answers, topics, courses, legal
16. [ ] Smoke: region modal + pricing on `/certifications/pmp` (client)
17. [ ] Rollback plan documented (previous deploy tag / Railway rollback)

## Post-deploy (18)

1. [ ] Production homepage loads; view-source shows server-rendered H1
2. [ ] `https://www.pmstructure.com/sitemap.xml` returns 200; spot-check new URLs
3. [ ] `https://www.pmstructure.com/robots.txt` references sitemap
4. [ ] Google Rich Results Test: `/faq` (FAQPage)
5. [ ] Rich Results Test: `/certifications/pmp` (Course/Offer where applicable)
6. [ ] Rich Results Test: one `/answers/*` page (Article + FAQ if present)
7. [ ] Manual mobile check: `/pmp-exam-2026` CTA → cert or course path
8. [ ] Enroll → payment → success flow (test mode or staging card if prod)
9. [ ] LMS access email/link after test enrollment (if in scope)
10. [ ] GSC property verified; sitemap submitted ([GSC plan](./PMSTRUCTURE_GSC_BING_SUBMISSION_PLAN.md))
11. [ ] Bing Webmaster sitemap submitted
12. [ ] URL inspection: `/`, `/pmp-exam-2026`, `/faq`, one answer, one topic
13. [ ] Monitor 404s / 5xx first 24h (hosting dashboard)
14. [ ] Run AI answer baseline ([testing sheet](./PMSTRUCTURE_AI_ANSWER_TESTING_SHEET.md)) within 7 days
15. [ ] Confirm `llms.txt` and `/entity.json` reachable for crawlers
16. [ ] Social/OG preview spot-check (homepage + one PMP page)
17. [ ] Team notified: conversion paths, regional pricing, disclaimer links live
18. [ ] Phase execution board updated; plan Run 18–20 marked complete

## Commands

```bash
npm run seo:release-verify   # build + seo:all + postbuild (one shot)
npm run seo:smoke-urls       # print post-deploy inspection URLs
npm run seo:smoke-live       # HTTP 200 + H1 + canonical on live site
```

CI: `.github/workflows/seo-release.yml` runs the same verify on `frontend/**` changes.
