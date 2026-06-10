# PM Structure — Implementation Risk Register

| ID | Risk | Likelihood | Impact | Affected phases | Mitigation | Owner |
|----|------|------------|--------|-----------------|------------|-------|
| R01 | Homepage renders only "Loading your regional experience…" | High (current) | Critical | All | Run 2 RegionGate refactor | Dev |
| R02 | Dashboard/login indexed without noindex | High (current) | High | 3, 18 | Run 3 layout metadata + robots | Dev |
| R03 | checkout/success/cancel missing noindex | High (current) | High | 3 | Run 3 metadata exports | Dev |
| R04 | robots.txt disallow blocks noindex meta crawl on /checkout | Medium | Medium | 3 | Remove checkout from disallow; use meta only | Dev |
| R05 | 41 `/go/*` pages dilute SEO crawl budget | Medium | Medium | 3, 8 | Separate sitemap-portals or noindex strategy | Owner |
| R06 | www vs apex canonical confusion | Low | Medium | 4, 6 | Owner confirmed www | Owner |
| R07 | Regional pricing creates duplicate indexed URLs | Low | High | 4, 13 | Canonical strip; client-only hydration | Dev |
| R08 | FAQ schema for invisible FAQs | Medium | High | 7, 10 | Schema only matches visible DOM | Dev |
| R09 | False PMI ATP / guaranteed pass in AI files or copy | Medium | Critical | 6, 8–12, 15 | Compliance phrase scan; legal review | Legal |
| R10 | AggregateRating schema without verified reviews | Low | High | 7 | Block until review source exists | Dev |
| R11 | PMP 2026 content outdated vs PMI official changes | Medium | High | 8–12 | TODO_REFERENCE fields; review schedule | Content |
| R12 | Single monolithic sitemap exceeds limits | Medium | Medium | 3 | Split sitemaps per plan | Dev |
| R13 | Heading fixes break visual design | Medium | Low | 5 | Separate visual size from semantic level | Dev |
| R14 | SSR refactor breaks Calendly/payment/LMS | Medium | High | 2, 14 | Run 2 validation suite | Dev |
| R15 | AI files contradict live page content | Medium | High | 6 | Generate from same source as CMS | Dev |
| R16 | Missing route inventory causes index mistakes | High | Medium | 3–5 | Complete ROUTE_INVENTORY in Run 3 | Dev |
| R17 | Placeholder pages accidentally indexed | Medium | Medium | 3, 5 | noindex,follow + sitemap exclude | Dev |
| R18 | Legal pages missing canonical | High (current) | Medium | 4 | buildPageMetadata on all legal | Dev |
| R19 | Blog/newsletter drafts in sitemap | Low | Medium | 3 | CMS published filter (verify) | Dev |
| R20 | Unguarded dashboard API endpoints | Medium | High | 3, 15 | Security fix separate from SEO | Dev |
| R21 | AI answer engines cite wrong page | High | Medium | 19 | Answer pages + llms.txt best pages | SEO |
| R22 | GSC submitted before crawlability fix | Medium | Critical | 18 | Gate GSC on Run 2 + seo:all | Owner |
| R23 | Content phases ship without validation scripts | Medium | High | 16–17 | Run 17 before major content deploy | Dev |
| R24 | H1 "Structured project management capability" weak for SERP | High (current) | Medium | 5, 8 | Phase 5 + homepage copy alignment | Content |
| R25 | Enroll URLs leak into sitemap | Low | High | 3 | assertIndexableForSitemap helper | Dev |

---

## Risk response playbook

| Severity | Action |
|----------|--------|
| Critical | Block deploy; fix before next phase |
| High | Fix in current phase or document explicit acceptance |
| Medium | Mitigate in phase; monitor in Phase 19 AI testing |
| Low | Backlog; note in phase report |

---

## Warnings (do not ignore)

1. **Do not submit GSC/Bing (Phase 18) until Run 2 and Run 3 complete.**
2. **Do not generate pmp-faq.json (Phase 6) until Phase 10 FAQ data model exists.**
3. **Do not add FAQPage schema to pages without visible FAQ blocks.**
4. **Do not claim PMI ATP or guaranteed pass in any PMP 2026 content without owner written approval.**
5. **Do not rebuild all 13 sitemaps in Run 3 — minimal sitemap filter only until Phase 3.**
