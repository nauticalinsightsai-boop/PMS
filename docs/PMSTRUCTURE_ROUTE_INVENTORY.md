# PM Structure — Route Inventory

**Canonical host:** `https://pmstructure.com` (apex; `www` → 301)  
**Updated:** v2 Phases 10–19 (2026-06-10)  
**Source:** `frontend/app/`, `content/pmp`, `content/faq`, `content/answers`, `content/topics`

## Column legend

| Col | Meaning |
|-----|---------|
| Index | `yes` / `no` / `conditional` |
| Sitemap | In `sitemap.xml` today |
| Schema | JSON-LD types on page |
| Status | `live` / `redirect` / `planned` |

---

## Live public marketing routes (`frontend/app/(site)/`)

| Path | Index | Sitemap | Title pattern | H1 target | Schema | Status |
|------|-------|---------|---------------|-----------|--------|--------|
| `/` | yes | yes | PMP & project management exam prep | PMP & project management exam prep | Org, WebSite (global) | live |
| `/about` | yes | yes | About | About PM Structure | WebPage (planned) | live |
| `/contact` | yes | yes | Contact | Contact us | WebPage (planned) | live |
| `/faq` | yes | yes | FAQ | FAQ — certifications & support | FAQPage | live |
| `/pmp-faq` | yes | yes | PMP FAQ | PMP exam FAQ hub | FAQPage | live |
| `/answers` | yes | yes | Answers | Direct answers index | WebPage | live |
| `/answers/[slug]` | yes | yes | Answer title | Question H1 | FAQPage + Article | live (35) |
| `/topics` | yes | yes | Topics | Knowledge hubs | WebPage | live |
| `/topics/[slug]` | yes | yes | Hub title | Hub H1 | WebPage | live (26) |
| `/membership` | yes | yes | Membership | Membership tiers | WebPage (planned) | live |
| `/community` | yes | yes | Community | Community & resources | WebPage (planned) | live |
| `/pm-service` | yes | yes | PM advisory | PM advisory services | Service (planned) | live |
| `/certifications` | yes | yes | Certifications | Find your pathway | WebPage (planned) | live |
| `/certifications/compare` | yes | yes | Compare | Compare certification pathways | WebPage (planned) | live |
| `/certifications/[id]` | yes | yes | {cert} exam preparation | {cert} pathway | Course, Breadcrumb | live (27 certs) |
| `/blog` | yes | yes | Blog | Blog | WebPage (planned) | live |
| `/blog/[slug]` | yes | yes | Article title | Article H1 | Article (planned) | live |
| `/newsletter` | yes | yes | Newsletter | Newsletter | WebPage (planned) | live |
| `/newsletter/[slug]` | yes | yes | Issue title | Issue H1 | Article (planned) | live |
| `/legal` | yes | yes | Legal hub | Legal information | WebPage (planned) | live |
| `/legal/terms` | yes | yes | Terms | Terms of service | WebPage (planned) | live |
| `/legal/privacy` | yes | yes | Privacy | Privacy policy | WebPage (planned) | live |
| `/legal/privacy/[region]` | yes | yes | Regional privacy | Regional privacy | WebPage (planned) | live |
| `/legal/privacy/gcc` | yes | yes | GCC privacy | GCC privacy | WebPage (planned) | live |
| `/legal/privacy/gcc/[country]` | yes | yes | Country privacy | Country privacy | WebPage (planned) | live |
| `/legal/cookies` | yes | yes | Cookies | Cookie policy | WebPage (planned) | live |
| `/legal/services` | yes | yes | Services | Services terms | WebPage (planned) | live |
| `/legal/pricing-disclaimers` | yes | yes | Pricing disclaimers | Pricing disclaimers | WebPage (planned) | live |
| `/legal/[slug]` | yes | yes | Dynamic legal | Document H1 | WebPage (planned) | live (13 slugs) |

## Noindex / utility routes

| Path | Index | Sitemap | Robots | Status |
|------|-------|---------|--------|--------|
| `/certifications/[id]/[tier]/enroll` | no | no | noindex,nofollow | live |
| `/certifications/[id]/[tier]/enroll/success` | no | no | noindex,nofollow | live |
| `/checkout` | no | no | noindex,nofollow | live |
| `/checkout/cancel` | no | no | noindex,nofollow | live |
| `/checkout/success` | no | no | noindex,nofollow | live |
| `/compare` | no | no | redirect → `/certifications/compare` | live |
| `/store` | no | no | redirect → `/community?view=store` | live |

## Go portals (`frontend/app/go/`)

| Path | Index | Sitemap | Notes | Status |
|------|-------|---------|-------|--------|
| `/go` | no | no | Index redirect/hub | live |
| `/go/[channel]` | conditional | if published | Per-channel metadata in `go/[channel]/page.tsx` | live (~41 channels) |

## Admin (`frontend/app/admin/`)

| Path | Index | Sitemap | Notes |
|------|-------|---------|-------|
| `/admin/**` | no | no | `robots: noindex` on admin layout |

## PMP cluster (live — v2 Phase 10)

| Path | Index | Sitemap | Schema | Status |
|------|-------|---------|--------|--------|
| `/pmp` | yes | yes | WebPage + FAQPage (related) | live |
| `/pmp-faq` | yes | yes | FAQPage | live |
| `/pmp-exam-2026` | yes | yes | Article + FAQPage (related) | live |
| `/pmp-current-vs-new-exam` | yes | yes | Article + FAQPage | live |
| `/pmp-before-8-july-2026` | yes | yes | Article + FAQPage | live |
| `/pmp-after-9-july-2026` | yes | yes | Article + FAQPage | live |
| `/pmp-exam-timeline-2026` | yes | yes | Article + FAQPage | live |
| `/pmp-new-exam-domain-weighting` | yes | yes | Article + FAQPage | live |
| `/pmp-people-domain` | yes | yes | Article + FAQPage | live |
| `/pmp-process-domain` | yes | yes | Article + FAQPage | live |
| `/pmp-business-environment-domain` | yes | yes | Article + FAQPage | live |
| `/pmp-agile-hybrid-predictive` | yes | yes | Article + FAQPage | live |
| `/pmp-ai-sustainability-value-delivery` | yes | yes | Article + FAQPage | live |
| `/pmp-study-plan-2026` | yes | yes | Article + FAQPage | live |
| `/pmp-foundation` | yes | yes | Course + FAQPage | live |
| `/pmp-professional` | yes | yes | Course + FAQPage | live |
| `/pmp-mastery` | yes | yes | Course + FAQPage | live |
| `/pmp-readiness-diagnostic` | yes | yes | Service + FAQPage | live |
| `/pmp-scenario-practice` | yes | yes | Service + FAQPage | live |
| `/pmp-mock-exam` | yes | yes | Service + FAQPage | live |
| `/pmp-enrollment` | yes | yes | Service + FAQPage | live |
| `/pmp-q-and-a-support` | yes | yes | Service + FAQPage | live |

## Certification IDs (live `/certifications/[id]`)

`capm`, `pmp`, `pmi-acp`, `pgmp`, `pfmp`, `pmi-cp`, `pmi-pba`, `pmi-rmp`, `pmi-sp`, `dasm`, `dassm`, `prince2`, `prince2-agile`, `msp`, `mop`, `mov`, `p3o`, `itil`, `cobit`, `togaf`, `safe-agilist`, `safe-practitioner`, `lss-yellow`, `lss-green`, `lss-black`, `cspo`, `csm` (verify against `siteData.certifications`)

## Cross-references

- Indexing: [`PMSTRUCTURE_INDEXING_MATRIX.md`](PMSTRUCTURE_INDEXING_MATRIX.md)
- Sitemap: [`PMSTRUCTURE_SITEMAP_PLAN.md`](PMSTRUCTURE_SITEMAP_PLAN.md)
- Headings: [`PMSTRUCTURE_HEADING_SERP_ONPAGE_SEO_PLAN.md`](PMSTRUCTURE_HEADING_SERP_ONPAGE_SEO_PLAN.md)
- Schema: [`PMSTRUCTURE_SCHEMA_MATRIX.md`](PMSTRUCTURE_SCHEMA_MATRIX.md)
