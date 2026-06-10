# Run 18 — Deployment Readiness Report

**Date:** 2026-06-10

## Pre-deploy verification (automated)

- [x] `npm run build -w @pms/frontend` — 252 static pages (23 answers + 17 topic hubs)
- [x] `npm run seo:all` — 17 checks green (incl. `section-ambience-check`)
- [x] AI files regenerated on prebuild
- [x] `global-error.tsx` fixes Next.js 500.html build on Windows

## Pre-deploy (manual before prod)

- [ ] Production env vars verified
- [x] `npm run seo:render-check` after build — 8 routes (H1 + content in static HTML)
- [ ] Smoke test enroll/checkout noindex in view-source

## Post-deploy (manual)

- [ ] GSC/Bing sitemap submit per `PMSTRUCTURE_GSC_BING_SUBMISSION_PLAN.md`
- [ ] Rich Results Test on `/faq`, `/certifications/pmp`
- [ ] AI answer baseline per `PMSTRUCTURE_AI_ANSWER_TESTING_SHEET.md`

See `docs/PMSTRUCTURE_DEPLOYMENT_CHECKLIST.md` for full 35-item list.
