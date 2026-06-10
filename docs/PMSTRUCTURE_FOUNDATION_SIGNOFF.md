# PM Structure — Foundation Sign-Off (Runs 2–8)

**Gate:** `preflight-07` — approve before treating SEO program as production-ready  
**Date assessed:** 2026-06-10

## Automated (must be green)

| Check | Command | Status |
|-------|---------|--------|
| Full SEO suite | `npm run seo:all` | Required green |
| Release gate | `npm run seo:release-verify` | Build + seo:all + postbuild |
| SSR body content | `npm run seo:postbuild` | 8 routes with H1 + answer body |
| Section ambience guard | `seo:section-ambience-check` | No children-in-SectionAmbience pattern |
| Content counts | answers ≥23, topics ≥17, PMP ≥21 | Via seo:answers/topics/pmp-check |

## Code deliverables (Runs 2–8)

| Run | Deliverable | Status |
|-----|-------------|--------|
| 2 | RegionGate / PublicShell SSR — crawlable marketing HTML | Done |
| 3 | Index/noindex matrix + sitemap exclusions | Done |
| 4 | Sitemap + robots | Done (monolithic; split documented) |
| 5 | Canonical helper + metadata integration | Done |
| 6 | Heading outline + h1/headings checks | Done |
| 7 | AI files (`lib/ai-files/`, llms.txt, 14 JSON feeds) | Done |
| 8 | Schema builders + JSON-LD components | Done |

## Human sign-off (operator)

- [ ] Review `PMSTRUCTURE_LEGAL_COMPLIANCE_MAP.md` — independent platform disclaimers acceptable
- [ ] Review PMP 2026 copy dates against latest PMI guidance
- [ ] Approve indexing of `/go/*` portal pages in sitemap (currently included)
- [x] Production deploy with `seo:release-verify` green
- [x] GSC verify + sitemap submit (`https://pmstructure.com`)

## Post-foundation (Runs 9–20)

Content (PMP, FAQ, answers, topics), legal alignment, validation scripts, deployment/GSC docs — **shipped**. Remaining operator: Bing import, Rich Results Test, AI baseline T+7d (`PMSTRUCTURE_AI_ANSWER_TESTING_SHEET.md`).

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Owner | | | |
| Dev | | | |
