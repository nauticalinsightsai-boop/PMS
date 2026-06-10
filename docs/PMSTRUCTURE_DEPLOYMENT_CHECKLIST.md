# PM Structure — Deployment Checklist

**Run:** 18 (Phase 17)  
**Site:** https://pmstructure.com

## Pre-deploy (17)

1. [x] Branch merged to `main`; SEO program shipped
2. [x] `npm ci` / install on deploy host (Vercel)
3. [x] Production env: `NEXT_PUBLIC_SITE_URL=https://pmstructure.com`
4. [x] `npm run build -w @pms/frontend` — 252 pages
5. [x] `npm run seo:all` green
6. [x] `npm run seo:postbuild` — 8 SSR routes
7. [x] AI files + generated `llms.txt` (`npm run seo:generate-ai-files`)
8. [x] Spot-check PMP cluster + FAQ
9. [x] Spot-check answers + topics
10. [x] Legal disclaimers + regional pricing pages
11. [x] Enroll/checkout `noindex`
12. [x] Canonical strips query params
13. [x] No secrets in artifact
14. [x] `robots.txt` + sitemap
15. [x] Sitemap includes PMP, answers, topics, legal
16. [ ] Smoke: region modal + pricing on `/certifications/pmp` (manual)
17. [x] Rollback via Vercel previous deployment

## Post-deploy (18)

1. [x] Homepage SSR H1 in view-source
2. [x] `https://pmstructure.com/sitemap.xml` — ~181 URLs
3. [x] `https://pmstructure.com/robots.txt`
4. [ ] Rich Results Test: `/faq`
5. [ ] Rich Results Test: `/certifications/pmp`
6. [ ] Rich Results Test: one `/answers/*`
7. [ ] Mobile CTA check `/pmp-exam-2026`
8. [ ] Enroll → payment → success (test mode)
9. [ ] LMS access after test enrollment
10. [x] GSC verified + sitemap submitted
11. [ ] Bing Webmaster import from GSC
12. [ ] GSC URL inspection on priority URLs
13. [ ] Monitor 404/5xx 24h
14. [ ] AI baseline by ~2026-06-17
15. [x] `llms.txt` + `entity.json` live
16. [ ] OG preview spot-check
17. [ ] Team notified
18. [x] Phase board + reports updated

### Optional: IndexNow (Bing)

```bash
# 1. Set INDEXNOW_KEY in Vercel (8–128 hex chars)
# 2. Run once locally to create public/{key}.txt, commit, deploy
INDEXNOW_KEY=yourkey npm run seo:indexnow
# 3. After each major release:
INDEXNOW_KEY=yourkey npm run seo:indexnow
```

## Commands

```bash
npm run seo:release-verify
npm run seo:smoke-urls
npm run seo:smoke-live
npm run seo:indexnow   # after INDEXNOW_KEY configured
```

CI: `.github/workflows/seo-release.yml`
