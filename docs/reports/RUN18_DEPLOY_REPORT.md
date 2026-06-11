# Run 18. Deployment Readiness Report

**Date:** 2026-06-10  
**Status:** Production live. GSC submitted

## Pre-deploy verification (automated)

- [x] `npm run build -w @pms/frontend`: 252 static pages (23 answers + 17 topic hubs)
- [x] `npm run seo:all`: 17 checks green (incl. `section-ambience-check`)
- [x] AI files regenerated on prebuild
- [x] `global-error.tsx` fixes Next.js 500.html build on Windows

## Pre-deploy (manual)

- [x] Production env vars verified (`NEXT_PUBLIC_SITE_URL=https://pmstructure.com`)
- [x] `npm run seo:render-check` after build: 8 routes (H1 + content in static HTML)
- [x] `npm run seo:release-verify`: full gate green (2026-06-10)

## Post-deploy

- [x] Deploy to `https://pmstructure.com` (Vercel Production, commit `0f117e7+`)
- [x] `npm run seo:smoke-live`: 10/10
- [x] GSC ownership verified + `sitemap.xml` submitted
- [ ] Rich Results Test on `/faq`, `/certifications/pmp`, one answer page
- [ ] Bing Webmaster import from GSC
- [ ] AI answer baseline per `PMSTRUCTURE_AI_ANSWER_TESTING_SHEET.md` (T+7d after sitemap)

See `docs/PMSTRUCTURE_DEPLOYMENT_CHECKLIST.md` for full list.