---
name: T-022 Keyword Anchor Map
overview: Create internal Phase Two keyword/anchor documentation (MD + CSV), add a typed SEO config module as the code source of truth, align priority page metadata and internal links with the PMP 2026 funnel, and fix safe weak anchors—without inventing keyword volume or exposing internal docs.
todos:
  - id: ask-q1-framework
    content: "Ask Q1: Identify framework (Next.js App Router)"
    status: completed
  - id: ask-q2-metadata
    content: "Ask Q2: Where metadata is generated (site-metadata.ts, per-route page.tsx)"
    status: completed
  - id: ask-q3-hardcoded
    content: "Ask Q3: Titles/descriptions hardcoded vs data-driven (mixed TS content + page.tsx)"
    status: completed
  - id: ask-q4-canonical
    content: "Ask Q4: Canonicals global per page via buildPageMetadata + canonical.ts"
    status: completed
  - id: ask-q5-og-twitter
    content: "Ask Q5: OG/Twitter generated per page in buildPageMetadata"
    status: completed
  - id: ask-q6-cert-model
    content: "Ask Q6: Certification page data model (siteData + buildCertMetadata)"
    status: completed
  - id: ask-q7-answer-model
    content: "Ask Q7: Answer page data model (content/answers/types.ts + pages.ts)"
    status: completed
  - id: ask-q8-topic-model
    content: "Ask Q8: Topic page data model (content/topics/types.ts + hubs.ts)"
    status: completed
  - id: ask-q9-faq-model
    content: "Ask Q9: FAQ data model (content/faq + FaqPageJsonLd)"
    status: completed
  - id: ask-q10-links-hardcoded
    content: "Ask Q10: Internal links hardcoded in components + content arrays"
    status: completed
  - id: ask-q11-related-blocks
    content: "Ask Q11: Related-link blocks present (AnswerPage, TopicHubPage, LegalRelatedLinks)"
    status: completed
  - id: ask-q12-breadcrumbs
    content: "Ask Q12: Breadcrumbs present (nav + JSON-LD on topics/PMP/legal/certs)"
    status: completed
  - id: ask-q13-schema
    content: "Ask Q13: Schema generated from page data (FaqPageJsonLd, CertJsonLd, etc.)"
    status: completed
  - id: ask-q14-sitemap
    content: "Ask Q14: Sitemap separate from keyword map (app/sitemap.ts)"
    status: completed
  - id: ask-q15-duplicate-titles
    content: "Ask Q15: Duplicate/generic titles on compare, certs, membership (documented gaps)"
    status: completed
  - id: ask-q16-missing-meta
    content: "Ask Q16: Missing meta descriptions inventory (priority pages have descriptions)"
    status: completed
  - id: ask-q17-missing-h1
    content: "Ask Q17: H1 gaps (/certifications/pmp defaults to PMP Pathway not spec H1)"
    status: completed
  - id: ask-q18-weak-anchors
    content: "Ask Q18: Weak anchors inventory (Read More Home, Learn More PMService)"
    status: completed
  - id: ask-q19-www-links
    content: "Ask Q19: www absolute internal links (none found in priority funnel)"
    status: completed
  - id: ask-q20-agent-safe
    content: "Ask Q20: Agent can safely add SEO fields and internal-link blocks"
    status: completed
  - id: internal-md
    content: "Create docs/internal/PMSTRUCTURE_KEYWORD_ANCHOR_MAP_PHASE_2.md (full spec template: purpose, strategic focus, mapping rule, priority keyword table, planned pages, anchor rules, internal link map, metadata drafts)"
    status: completed
  - id: internal-csv
    content: "Create docs/internal/pmstructure-keyword-anchor-map-phase-2.csv with spec header + all 16 CSV rows"
    status: completed
  - id: internal-readme
    content: Link T-022 docs in docs/internal/README.md
    status: completed
  - id: internal-owner-inputs
    content: "Document owner inputs still required in internal MD (volume, difficulty, CPC, regions, pricing, waitlist, community platform, testimonials)"
    status: completed
  - id: plan-file-repo
    content: Copy/sync plan to .cursor/plans/t-022_keyword_anchor_map.plan.md in repo
    status: completed
  - id: seo-types-module
    content: "Add frontend/content/seo/phase-2-page-seo.ts with PageSeoConfig + RelatedLink types"
    status: completed
  - id: seo-phase2-map
    content: "Populate PHASE_2_PAGE_SEO for all 16 priority URLs (primaryKeyword unique per page)"
    status: completed
  - id: seo-get-helper
    content: "Add getPhase2Seo(path) helper for pages and validation script"
    status: completed
  - id: related-links-component
    content: "Create frontend/components/seo/RelatedGuidesLinks.tsx (title, links, skip current path, relative URLs, accessible)"
    status: completed
  - id: metadata-home
    content: "Verify / metadata matches spec (T169_SEO); add optional homepage related-links block"
    status: completed
  - id: metadata-certifications-hub
    content: "Update /certifications title, description, H1 per spec drafts"
    status: completed
  - id: metadata-cert-pmp
    content: "Update /certifications/pmp SEO title, meta description, H1 to PMP 2026 Readiness Pathway (buildCertMetadata override)"
    status: completed
  - id: metadata-answer-pmp-change
    content: "Update /answers/is-the-pmp-exam-changing-in-2026 title, description, H1 per spec"
    status: completed
  - id: metadata-topic-pmp-2026
    content: "Update /topics/pmp-exam-2026 title, description, H1 per spec (PMP Exam 2026 Guide)"
    status: completed
  - id: metadata-faq
    content: "Update /faq SEO title and meta description per spec (PM Structure FAQ framing)"
    status: completed
  - id: metadata-compare
    content: "Update /certifications/compare SEO title and meta description per spec"
    status: completed
  - id: metadata-pmi-rmp
    content: "Update /certifications/pmi-rmp SEO title and meta description per spec"
    status: completed
  - id: metadata-prince2
    content: "Update /certifications/prince2-practitioner SEO title and meta description per spec"
    status: completed
  - id: metadata-lss-yellow
    content: "Update /certifications/lss-yellow SEO title and meta description per spec"
    status: completed
  - id: metadata-lss-black
    content: "Update /certifications/lss-black SEO title and meta description per spec"
    status: completed
  - id: metadata-membership
    content: "Update /membership SEO title and meta description per spec"
    status: completed
  - id: metadata-community
    content: "Update /community SEO title and meta description per spec"
    status: completed
  - id: metadata-newsletter
    content: "Update /newsletter SEO title and meta description per spec"
    status: completed
  - id: metadata-pm-service
    content: "Update /pm-service SEO title and meta description per spec"
    status: completed
  - id: metadata-legal-terms
    content: "Update /legal/terms metadata (low SEO priority, trust page)"
    status: completed
  - id: metadata-legal-privacy
    content: "Update /legal/privacy metadata (low SEO priority, trust page)"
    status: completed
  - id: links-home-to-pmp
    content: "Homepage → /certifications/pmp anchor PMP 2026 Readiness Pathway"
    status: completed
  - id: links-home-to-compare
    content: "Homepage → /certifications/compare anchor compare certification pathways"
    status: completed
  - id: links-home-to-faq
    content: "Homepage → /faq anchor PM Structure FAQ (if design supports related block)"
    status: completed
  - id: links-cert-hub-to-pmp
    content: "Certifications hub → /certifications/pmp anchor PMP 2026 Readiness Pathway"
    status: completed
  - id: links-cert-hub-to-compare
    content: "Certifications hub → /certifications/compare anchor compare project management certifications"
    status: completed
  - id: links-pmp-to-answer
    content: "PMP cert page block Plan your PMP 2026 route → answer page anchor PMP exam change in 2026"
    status: completed
  - id: links-pmp-to-topic
    content: "PMP cert page → /topics/pmp-exam-2026 anchor PMP exam 2026 topic hub"
    status: completed
  - id: links-pmp-to-faq
    content: "PMP cert page → /faq anchor PMP eligibility and training-hour FAQ"
    status: completed
  - id: links-pmp-to-compare
    content: "PMP cert page → /certifications/compare anchor compare project management certifications"
    status: completed
  - id: links-answer-to-pmp
    content: "Answer page → /certifications/pmp anchor PMP 2026 Readiness Pathway"
    status: completed
  - id: links-answer-to-topic
    content: "Answer page → /topics/pmp-exam-2026 anchor PMP exam 2026 guide"
    status: completed
  - id: links-answer-to-faq
    content: "Answer page → /faq anchor PM Structure FAQ"
    status: completed
  - id: links-topic-to-pmp
    content: "Topic hub → /certifications/pmp anchor PMP 2026 Readiness Pathway"
    status: completed
  - id: links-topic-to-answer
    content: "Topic hub → answer page anchor is the PMP exam changing in 2026?"
    status: completed
  - id: links-topic-to-compare
    content: "Topic hub → /certifications/compare anchor compare project management certifications"
    status: completed
  - id: links-faq-to-pmp
    content: "FAQ page → /certifications/pmp anchor PMP 2026 Readiness Pathway"
    status: completed
  - id: links-compare-to-pmp
    content: "Compare page → /certifications/pmp anchor PMP 2026 Readiness Pathway"
    status: completed
  - id: links-compare-to-prince2
    content: "Compare page → /certifications/prince2-practitioner anchor PRINCE2 Practitioner pathway"
    status: completed
  - id: links-compare-to-pmi-rmp
    content: "Compare page → /certifications/pmi-rmp anchor PMI-RMP risk management pathway"
    status: completed
  - id: links-compare-to-lss-yellow
    content: "Compare page → /certifications/lss-yellow anchor Lean Six Sigma Yellow Belt pathway"
    status: completed
  - id: links-compare-to-lss-black
    content: "Compare page → /certifications/lss-black anchor Lean Six Sigma Black Belt pathway"
    status: completed
  - id: links-pm-service-to-pmp
    content: "PM Service → /certifications/pmp anchor PMP 2026 team readiness"
    status: completed
  - id: links-membership-to-pmp
    content: "Membership → /certifications/pmp anchor PMP 2026 Readiness Pathway"
    status: completed
  - id: links-community-to-pmp
    content: "Community → /certifications/pmp anchor PMP 2026 preparation support"
    status: completed
  - id: anchor-home-read-more
    content: "Replace Home.tsx blog card Read More with descriptive anchor"
    status: completed
  - id: anchor-pmservice-learn-more
    content: "Replace PMService.tsx Learn More with descriptive anchor"
    status: completed
  - id: anchor-inventory-doc
    content: "Document weak-anchor inventory in internal MD (flagged vs fixed)"
    status: completed
  - id: cannibalization-doc
    content: "Document cannibalization rules in internal MD (one primary keyword per page)"
    status: completed
  - id: cannibalization-enforce
    content: "Enforce no duplicate primaryKeyword in phase-2-page-seo.ts + check script"
    status: completed
  - id: canonical-apex-verify
    content: "Verify all priority pages use https://pmstructure.com canonical (no www/http)"
    status: completed
  - id: nosuffix-titles
    content: "Use buildPageMetadata noSuffix when title already includes | PM Structure"
    status: completed
  - id: schema-faq-align
    content: "Ensure FAQ schema uses visible FAQ content only (no new hidden FAQ schema)"
    status: completed
  - id: schema-no-fake-ratings
    content: "Do not add fake AggregateRating or misleading Course/Product schema"
    status: completed
  - id: sitemap-no-planned
    content: "Confirm planned URLs from spec are NOT added to sitemap.ts"
    status: completed
  - id: sitemap-no-internal
    content: "Confirm internal docs/CSV are NOT in sitemap"
    status: completed
  - id: exposure-no-public-route
    content: "Confirm keyword MD/CSV not in frontend/public or app routes"
    status: completed
  - id: exposure-no-nav-footer
    content: "Confirm internal keyword docs not linked from public nav/footer"
    status: completed
  - id: keyword-map-check-script
    content: "Add scripts/seo/keyword-map-check.mjs (routes, duplicate primaryKeyword, relative links)"
    status: completed
  - id: keyword-map-check-npm
    content: "Wire npm run seo:keyword-map-check in package.json"
    status: completed
  - id: test-keyword-map-check
    content: "Run npm run seo:keyword-map-check"
    status: completed
  - id: test-metadata-check
    content: "Run npm run seo:metadata-check"
    status: completed
  - id: test-h1-check
    content: "Run npm run seo:h1-check"
    status: completed
  - id: test-canonical-check
    content: "Run npm run seo:canonical-check"
    status: completed
  - id: test-internal-links-check
    content: "Run npm run seo:internal-links-check"
    status: completed
  - id: test-build-frontend
    content: "Run npm run build -w @pms/frontend"
    status: completed
  - id: manual-qa-7-urls
    content: "Manual QA: view-source on 7 priority URLs (title, meta, canonical, H1, links, mobile)"
    status: completed
  - id: defer-planned-routes
    content: "Defer spec planned URLs (segment pages, /compare/pmp-vs-*) — document only, no routes"
    status: completed
  - id: defer-pmp-cluster-metadata
    content: "Defer full PMP cluster metadata pass (/pmp-exam-2026, before/after July) to later phase"
    status: completed
  - id: defer-keyword-volume
    content: "Leave CSV Keyword_Volume and Keyword_Difficulty as Needs keyword research (owner fills)"
    status: completed
  - id: ac18-owner-inputs-list
    content: "Agent output: list owner inputs still required in final summary"
    status: completed
isProject: false
---

# T-022 — Keywords and Anchors Phase Two

## Ask mode findings (summary)

### Framework and metadata system

| Item | Finding |
|------|---------|
| Framework | Next.js 15 App Router in [`frontend/`](frontend/) |
| Metadata hub | [`frontend/lib/site-metadata.ts`](frontend/lib/site-metadata.ts) — `buildPageMetadata()`, `buildCertMetadata()`, `defaultSiteMetadata` |
| Canonicals | [`frontend/lib/canonical.ts`](frontend/lib/canonical.ts) + `PMS_SITE_URL` from [`frontend/config/pms-site.ts`](frontend/config/pms-site.ts) |
| Indexing | [`frontend/lib/indexing-metadata.ts`](frontend/lib/indexing-metadata.ts) |
| Sitemap | [`frontend/app/sitemap.ts`](frontend/app/sitemap.ts) — separate from page SEO copy |

Metadata is **per-route**: static `export const metadata` or `generateMetadata()` in `frontend/app/(site)/**/page.tsx`. Content models already carry `title`, `description`, and link arrays.

### Content / SEO data models (existing)

| Area | Location | SEO fields today |
|------|----------|------------------|
| Answers | [`frontend/content/answers/types.ts`](frontend/content/answers/types.ts), [`pages.ts`](frontend/content/answers/pages.ts) | `title`, `description`, `question` (H1), `relatedPages`, `relatedAnswers`, `relatedCourses`, `ctaHref`/`ctaLabel` |
| Topics | [`frontend/content/topics/types.ts`](frontend/content/topics/types.ts), [`hubs.ts`](frontend/content/topics/hubs.ts) | `title`, `description`, `h1`, `resources`, `relatedAnswers` |
| PMP cluster | [`frontend/content/pmp/pages.ts`](frontend/content/pmp/pages.ts), [`flagship-t169.ts`](frontend/content/pmp/flagship-t169.ts) | `T169_SEO`, `T169_PMP_PAGE` for `/pmp-exam-2026` cluster |
| Certifications | [`frontend/data/siteData.ts`](frontend/data/siteData.ts) + [`buildCertMetadata()`](frontend/lib/site-metadata.ts) | Generic `${cert.name} exam preparation` title; family-specific descriptions in [`t176-claims.ts`](frontend/content/t176-claims.ts) |
| FAQ | [`frontend/content/faq/`](frontend/content/faq/) + [`/faq` page](frontend/app/(site)/faq/page.tsx) | Page-level metadata; FAQ schema via [`FaqPageJsonLd`](frontend/components/seo/FaqPageJsonLd.tsx) |
| AI keyword clusters (public) | [`frontend/lib/ai-files/builders.ts`](frontend/lib/ai-files/builders.ts) → `/pmp-keywords.json` | Planning clusters only; **not** a page-level keyword map; no volume |

**No `PageSeoConfig` type or Phase Two keyword map exists yet.**

### Internal links (existing)

- Answer pages: [`AnswerPage.tsx`](frontend/components/answers/AnswerPage.tsx) — "Related pathways/guides/answers" from content arrays
- Topic hubs: [`TopicHubPage.tsx`](frontend/components/topics/TopicHubPage.tsx) — breadcrumbs + resource lists
- PMP cluster: [`PmpAuthorityPage.tsx`](frontend/components/pmp/PmpAuthorityPage.tsx) — `relatedLinks`
- Legal pattern: [`LegalRelatedLinks.tsx`](frontend/components/legal/LegalRelatedLinks.tsx) — reusable related-links block
- Guard script: [`scripts/seo/internal-links-check.mjs`](scripts/seo/internal-links-check.mjs) — homepage/footer/PMP hub only

**Gap:** Priority funnel links in task spec often point to `/certifications/pmp`, but many answer/topic links today point to `/pmp-exam-2026` cluster routes instead of the commercial cert page.

### Priority page inventory vs T-022 spec

| URL | Current title (approx) | Spec alignment | Main gap |
|-----|------------------------|----------------|----------|
| `/` | Matches `T169_SEO.homeTitle` | Good | Add optional related-links block if design allows |
| `/certifications` | "Certification pathways" | Partial | Title/description/H1 not aligned to spec drafts |
| `/certifications/pmp` | "PMP exam preparation" via `buildCertMetadata` | **Mismatch** | Spec wants "PMP 2026 Readiness Pathway"; H1 defaults to "PMP® Pathway" unless registry overrides |
| `/answers/is-the-pmp-exam-changing-in-2026` | Question as title/H1 | Good intent | Meta description differs; links miss `/certifications/pmp` and `/topics/pmp-exam-2026` with spec anchors |
| `/topics/pmp-exam-2026` | "PMP exam 2026: knowledge hub" | Partial | H1/title/description differ from spec; weak link to commercial page |
| `/faq` | "FAQ: PMP 2026, Certifications..." | Partial | Spec wants "PM Structure FAQ" framing |
| `/certifications/compare` | "Compare certifications" | **Mismatch** | Generic description; no related-links block to cert pages |
| Secondary certs (`pmi-rmp`, `prince2-practitioner`, `lss-yellow`, `lss-black`) | Generic cert metadata | Partial | Need spec titles/descriptions + compare/PMP links |
| `/membership`, `/community`, `/newsletter`, `/pm-service` | Generic marketing titles | Partial | Support-layer positioning not reflected in metadata |

### Weak anchors (inventory)

Only **2** clear in-body weak anchors found in priority surfaces:

- [`Home.tsx`](frontend/components/pages/Home.tsx) — "Read More" (blog cards)
- [`PMService.tsx`](frontend/components/pages/PMService.tsx) — "Learn More"

No widespread "click here" / "view details" in priority PMP funnel components. CTA buttons ("Get My PMP 2026 Roadmap") are intentionally short.

### Cannibalization risks (current)

```mermaid
flowchart LR
  certPmp["/certifications/pmp commercial"]
  pmpCluster["/pmp-exam-2026 cluster"]
  answerPage["/answers/is-the-pmp-exam-changing-in-2026"]
  topicHub["/topics/pmp-exam-2026"]
  certPmp -->|"should own: PMP 2026 readiness pathway"| commercialIntent[Commercial intent]
  answerPage -->|"should own: is the PMP exam changing"| infoIntent[Direct answer intent]
  topicHub -->|"should own: PMP exam 2026 hub"| hubIntent[Hub intent]
  pmpCluster -->|"overlaps topic + cert"| riskZone[Risk zone]
```

- `/pmp-exam-2026` (cluster) and `/topics/pmp-exam-2026` both target 2026 exam intent — need clear roles in map (topic hub navigates; cluster is deep guide; cert page converts).
- `buildCertMetadata('pmp')` does not use `T169_SEO.pmpTitle` — commercial page under-branded vs cluster pages.

### Public exposure risk

- Internal docs live in [`docs/internal/`](docs/internal/) — not routed, not in sitemap (confirmed by T-015/T-017 guards).
- **Do not** copy MD/CSV into `frontend/public/` or link from nav/footer.

---

## Recommended architecture

### 1. Internal docs (required by spec)

Create exactly:

- [`docs/internal/PMSTRUCTURE_KEYWORD_ANCHOR_MAP_PHASE_2.md`](docs/internal/PMSTRUCTURE_KEYWORD_ANCHOR_MAP_PHASE_2.md) — spec template content
- [`docs/internal/pmstructure-keyword-anchor-map-phase-2.csv`](docs/internal/pmstructure-keyword-anchor-map-phase-2.csv) — spec rows + `Needs keyword research` for volume/difficulty
- Link from [`docs/internal/README.md`](docs/internal/README.md)

### 2. Code source of truth (recommended)

Add [`frontend/content/seo/phase-2-page-seo.ts`](frontend/content/seo/phase-2-page-seo.ts):

```ts
export type PageSeoConfig = {
  route: string;
  pageRole: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  searchIntent?: string;
  funnelStage?: string;
  title: string;          // pass with noSuffix when includes brand
  description: string;
  h1?: string;
  canonicalPath: string;
  regionFocus?: string[];
  relatedLinks?: { href: string; label: string }[];
};
```

- Export `PHASE_2_PAGE_SEO: Record<string, PageSeoConfig>` for the 16 priority URLs in the spec CSV.
- **Do not** duplicate into public `pmp-keywords.json` (that file stays AI-oriented; no fake volume).
- Optional helper: `getPhase2Seo(path)` for pages + tests.

**Why TS constants, not CMS/MDX:** Repo already uses TypeScript content modules (`answers/pages.ts`, `topics/hubs.ts`, `flagship-t169.ts`); no CMS field layer for SEO on marketing pages. CSV remains the owner-editable export; TS module drives implementation.

### 3. Reusable internal-link component

Create [`frontend/components/seo/RelatedGuidesLinks.tsx`](frontend/components/seo/RelatedGuidesLinks.tsx) modeled on [`LegalRelatedLinks.tsx`](frontend/components/legal/LegalRelatedLinks.tsx):

- Props: `title`, `links: { href, label }[]`, optional `currentPath` to skip self-links
- Relative internal URLs only; accessible list markup
- Used on: PMP cert detail, compare, answer (priority slug), topic hub (priority slug), optionally homepage section

### 4. Metadata wiring strategy

| Page | Change |
|------|--------|
| `/` | Keep `T169_SEO` (already matches spec); reference map doc |
| `/certifications` | Update `page.tsx` metadata + server H1 if present |
| `/certifications/pmp` | Extend `buildCertMetadata('pmp')` **or** override in `generateMetadata` to use Phase 2 `title`/`description`; set PMP `detailHeroTitle` → "PMP 2026 Readiness Pathway" via [`cert-detail.ts`](frontend/lib/cert-detail.ts) / siteData or registry default |
| `/answers/[slug]` | For priority slug: align `pages.ts` title/description/links; use `noSuffix` in metadata when title includes brand |
| `/topics/[slug]` | Update `pmp-exam-2026` hub `title`, `description`, `h1` in `hubs.ts` |
| `/faq`, `/certifications/compare`, secondary certs, membership, community, newsletter, pm-service | Pull from `PHASE_2_PAGE_SEO` in respective `page.tsx` files |

**`buildPageMetadata` note:** When `title` already contains `| PM Structure`, pass `noSuffix: true` (pattern already used in answer/topic metadata).

### 5. Internal link updates (priority map)

Update content arrays / new `RelatedGuidesLinks` blocks per spec table:

- **Commercial hub:** `/certifications/pmp` ← from homepage, certifications hub, answer, topic, FAQ, compare, membership, community, pm-service
- **Answer page** → `/certifications/pmp`, `/topics/pmp-exam-2026`, `/faq` with spec anchor text
- **Topic hub** → `/certifications/pmp`, `/answers/...`, `/certifications/compare`
- **Compare** → all major cert pages with descriptive anchors
- **PMP cert detail** → add block "Plan your PMP 2026 route" linking answer/topic/FAQ/compare (replace generic "Read the PMP 2026 guide →" where appropriate)

Keep `/pmp-exam-2026` as **supporting** deep guide, not primary commercial CTA target.

### 6. Anchor cleanup (safe only)

| File | Replace |
|------|---------|
| `Home.tsx` blog card | "Read More" → article-specific label from post title or "Read article: {title}" |
| `PMService.tsx` | "Learn More" → descriptive target (e.g. "Explore project management advisory services") |

Do **not** change short CTA buttons ("Get My PMP 2026 Roadmap", "Join Waitlist").

### 7. Extend validation (optional, small)

Add [`scripts/seo/keyword-map-check.mjs`](scripts/seo/keyword-map-check.mjs):

- Assert Phase 2 priority routes have entries in `phase-2-page-seo.ts`
- Assert no duplicate `primaryKeyword` across priority map
- Assert related links use relative paths (no `www`, no `http://`)
- Wire as `npm run seo:keyword-map-check` in root [`package.json`](package.json) (only if script is added)

Existing checks to run after code changes: `seo:metadata-check`, `seo:h1-check`, `seo:internal-links-check`, `seo:canonical-check`, `npm run build -w @pms/frontend`.

---

## Pages in scope (Agent) vs later

### Update now (16 priority URLs from spec CSV)

`/`, `/certifications`, `/certifications/pmp`, priority answer, `/topics/pmp-exam-2026`, `/faq`, `/certifications/compare`, `/certifications/pmi-rmp`, `/certifications/prince2-practitioner`, `/certifications/lss-yellow`, `/certifications/lss-black`, `/membership`, `/community`, `/newsletter`, `/pm-service`, `/legal/terms`, `/legal/privacy` (metadata only, low SEO priority)

### Leave for later

- All "Planned pages to add later" in spec (do not add to sitemap)
- Full PMP cluster (`/pmp-exam-2026`, `/pmp-before-8-july-2026`, etc.) metadata pass
- Regional segment pages (`pmp-for-engineers`, GCC, South Asia) — not built
- `/compare/pmp-vs-*` routes — not built
- Bulk weak-anchor sweep across blog/newsletter/portal pages
- Keyword volume/difficulty columns — owner fills from tools

---

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Double `| PM Structure` in titles | Use `noSuffix: true` when title is pre-formatted |
| Breaking cert routing | Only metadata + link copy changes; no route changes |
| Cannibalization | Enforce one `primaryKeyword` per page in map + check script |
| Compliance claims | Reuse `T176_*` / `T169_*` compliance wording; no new guarantees |
| Exposing internal map | Docs only under `docs/internal/`; grep guard in keyword-map-check |
| Lint noise | Pre-existing frontend lint failures unrelated; run frontend build as gate |

---

## Testing plan

1. `npm run seo:keyword-map-check` (if added)
2. `npm run seo:metadata-check` + `seo:h1-check` + `seo:canonical-check`
3. `npm run seo:internal-links-check`
4. `npm run build -w @pms/frontend`
5. Manual QA on 7 URLs from spec (view-source: title, meta description, canonical, H1, internal links)

---

## Owner inputs still required (document in internal MD)

- Regional keyword research export (UAE, KSA, Qatar, Pakistan, India, UK, global)
- Search volume, difficulty, CPC — leave CSV columns as `Needs keyword research`
- Final pricing, waitlist/live status for secondary certs
- Official community platform wording
- Verified testimonials/counts

---

## Agent mode can proceed?

**Yes**, after plan approval. Scope is docs + typed SEO module + priority metadata/link alignment + 2 weak-anchor fixes. No invented volume, no public keyword pages, no planned routes in sitemap.
