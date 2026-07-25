# GSC Indexation Deploy Verification — 2026-06-20

Deployment: Railway `PMS` service `82e54d29-6d8c-4feb-a5d2-547fb7b3eecf` — **SUCCESS**

## Policy update (2026-07-25)

**Published `/go/{slug}` portals are indexable again** and included in XML sitemap (scope-41 via `getPublishedGoChannelSlugs()`).

| Surface | Robots | XML sitemap |
|---------|--------|-------------|
| Published `/go/{slug}` | `index,follow` | Yes (priority 0.6) |
| `/go` exact | redirect → `/go/website`; exact path stays noindex | No |
| `?preview=1` / draft portals | `noindex,nofollow` | No (not in published slug list) |

June 20 blanket noindex for `/go/*` is **reversed**. Soft-noindex rows for published portals were removed from `gsc-crawled-not-indexed-noindex.ts`. HTML sitemap stays lean (no full `/go` list).

## Code changes shipped (2026-06-20 — historical)

- `/go/*` removed from XML sitemap (~41 URLs)
- `/go/*` pages emit `noindex, nofollow`
- Indexation strategy matrix updated (222 rows; 0 portal rows in sitemap)
- P0 submission list: `reports/seo/google-priority-urls.txt` (9 URLs)

## Live audit results (post-deploy 2026-06-20)

| Check | Result |
|-------|--------|
| `seo:smoke-live` | 10/10 OK |
| `seo:audit-indexability` | 26 passed |
| `seo:audit-indexation-strategy --base=...` | Repo + live OK |
| `seo:production-check` | OK (6 URLs) |
| `/go/website` noindex | OK (at that time) |
| `sitemap.xml` excludes `/go/` | OK (0 matches) |
| `sitemap.xml` URL count | **161** `<loc>` entries |

## Owner actions (GSC UI — manual)

1. **URL Inspection** — test these 5 URLs in GSC:
   - https://pmstructure.com/
   - https://pmstructure.com/certifications/pmp
   - https://pmstructure.com/pmp-exam-2026
   - https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026
   - https://pmstructure.com/faq

2. **Resubmit sitemap** — GSC → Sitemaps → `sitemap.xml` only (after 2026-07-25: expect ~+41 `/go/*` URLs)

3. **Request indexing** — P0 list in `reports/seo/google-priority-urls.txt` (max ~10/day); optionally sample published portals (`/go/website`, `/go/linkedin`, `/go/youtube`)

4. **Export Pages report** → update `docs/internal/pmstructure-indexation-control-matrix.csv` `Current_Status`

5. **Manual Actions** — confirm none in GSC

6. **Classify 184 URLs** — see bucket table in `PMSTRUCTURE_SEARCH_CONSOLE_CHECKLIST.md`

## Bing / IndexNow

- Bing WTM: import from GSC; submit `https://pmstructure.com/sitemap.xml`
- IndexNow: requires `INDEXNOW_KEY` env + `frontend/public/{key}.txt` on production before `npm run seo:indexnow -- --send`

## Weekly monitoring (weeks 1–8)

| Week | Action |
|------|--------|
| 1 | GSC Pages export; compare indexed vs 184 baseline |
| 2 | Re-inspect 3 P0 URLs with Last crawled N/A |
| 4 | Regenerate control matrix CSV; update checklist status log |
| 8+ | Monitor P1 cluster; do not bulk-request all 184 |

## Notes

- `www.pmstructure.com` returns Cloudflare 403 from this environment; apex `https://pmstructure.com` is canonical and healthy.
- Success criteria (updated 2026-07-25): P0 indexed in 2–4 weeks; published `/go/*` → index + sitemap; draft/preview stay noindex.
