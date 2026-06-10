# Live smoke test — 2026-06-10

**Base:** https://pmstructure.com  
**Passed:** 10/10  
**Status:** PASS

## Routes

| Path | HTTP | Notes |
|------|------|-------|
| `/` | 200 | H1 + canonical |
| `/faq` | 200 | H1 + canonical |
| `/pmp-exam-2026` | 200 | H1 + canonical |
| `/answers/is-the-pmp-exam-changing-in-2026` | 200 | H1 + "short answer" |
| `/topics/pmp-exam-2026` | 200 | H1 + canonical |
| `/certifications/pmp` | 200 | H1 + canonical |
| `/sitemap.xml` | 200 | ~181 URLs |
| `/robots.txt` | 200 | Points to apex sitemap |
| `/llms.txt` | 200 | AI discovery |
| `/entity.json` | 200 | Entity feed |

## Context

- GSC property verified + `sitemap.xml` submitted (operator, same day)
- `seo:release-verify` green after final deploy
