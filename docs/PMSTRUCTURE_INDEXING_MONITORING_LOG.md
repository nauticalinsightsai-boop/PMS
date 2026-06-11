# Indexing Monitoring Log

| Date | Platform | URL | Status | Issue | Action | Next check |
|------|----------|-----|--------|-------|--------|------------|
| 2026-06-10 | Production | https://pmstructure.com/sitemap.xml | VERIFIED |: | 203 URLs live; `seo:production-check` + `seo:smoke-live` 10/10 | Re-check after GSC submit |
| 2026-06-10 | Production | https://pmstructure.com/pmp-faq | LIVE 200 | Was 404 pre-deploy | Submit sitemap in GSC; URL-inspect + request indexing | 7 days |
| 2026-06-10 | Google | sitemap submission | MANUAL_REQUIRED | No GSC API in repo | Owner: GSC → Sitemaps → submit `sitemap.xml` | After owner confirms |
| 2026-06-10 | Bing | sitemap submission | MANUAL_REQUIRED | Bing ping returns 410 (deprecated) | Import from GSC or submit sitemap in Bing Webmaster | After GSC |
| 2026-06-10 | IndexNow | priority URLs | BLOCKED | `INDEXNOW_KEY` not set | Set key, deploy `public/{key}.txt`, run `npm run seo:indexnow -- --send` | Optional |
| 2026-06-10 | Database | `seed:site-content` | BLOCKED | No `.env.local` / `DATABASE_URL` | `cp .env.example .env.local`, configure DB, `npm run seed:site-content -- --publish` | When DB ready |