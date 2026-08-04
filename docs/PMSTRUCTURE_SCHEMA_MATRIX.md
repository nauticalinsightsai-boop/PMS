# PM Structure. Schema Matrix

**Implementation:** [`frontend/lib/schema/index.ts`](../frontend/lib/schema/index.ts), [`frontend/components/seo/`](../frontend/components/seo/)

## Global (all public pages via PublicShell)

| Type | @id | Status |
|------|-----|--------|
| Organization | `{site}/#organization` | live |
| WebSite | `{site}/#website` | live |

## Per-route matrix

| Route pattern | Schema types | Component / builder | Status |
|---------------|--------------|---------------------|--------|
| `/` | Organization, WebSite | OrganizationJsonLd | live; WebPage TODO |
| `/faq` | FAQPage | FaqJsonLd | live: must match crawlable FAQ DOM |
| `/pmp-faq` | FAQPage | PmpFaqPageJsonLd | live: published PMP FAQs only |
| `/certifications/[id]` | WebPage, BreadcrumbList | CertJsonLd | live — no Course (OPEN-01) |
| `/about`, `/contact`, marketing | WebPage, Breadcrumb | buildWebPageSchema | planned |
| `/blog/[slug]` | Article, Breadcrumb | planned Run 8+ | missing |
| `/newsletter/[slug]` | Article | planned | missing |
| `/legal/*` | WebPage | planned | missing |
| `/go/[channel]` | WebPage + optional FAQ | planned | missing |
| `/pmp*` | WebPage, Article/Course, FAQPage, Breadcrumb | Pmp*JsonLd | live |
| `/answers/[slug]` | Article, WebPage, FAQPage, Breadcrumb | AnswerJsonLd | live |
| `/topics/[slug]` | CollectionPage, ItemList, Breadcrumb | TopicHubJsonLd | live |

## Compliance rules

- No `EducationalOrganization` unless owner confirms accreditation (OPEN-08: Organization only until ATP/accreditation is formally confirmed)
- Course schema: no invented ratings, dates, instructors, PMI official claims
- FAQPage: only FAQs visible in page HTML (including `FaqCrawlableContent`)
- Provider references use `@id` → Organization

## Offer / regional pricing schema (Run 14)

| Rule | Status |
|------|--------|
| No `Offer` / `AggregateOffer` on `/certifications/*` with live matrix prices | enforced |
| No `price` / `priceCurrency` on `Course` JSON-LD | enforced |
| Regional tuition explained in visible HTML + `/legal/regional-pricing` | live |
| `pricing-policy.json` for AI citation: not a substitute for Offer schema | live |
| Future static global reference `Offer` only after legal sign-off | TODO |

**Rationale:** Regional scholarship amounts change by region, cohort, and verification. Emitting volatile Offer schema risks rich-result penalties and misquotes in AI answers.

## FAQ schema alignment (Run 8 close-out)

| Source | DOM | Schema |
|--------|-----|--------|
| FAQ accordion (visible tab) | Subset | Must match OR |
| FaqCrawlableContent (sr-only) | All FAQs | All FAQs OK if crawlable block present |

**Current:** `FaqCrawlableContent` renders all FAQs → `FaqJsonLd` all entries is aligned.

## Validation

- Manual: Google Rich Results Test on `/faq`, `/certifications/pmp`
- Planned: `npm run seo:schema-check` (Run 17)