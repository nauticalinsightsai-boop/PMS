# Run 8. Schema Report

**Date:** 2026-06-10  
**Status:** Complete

## JSON-LD coverage

| Surface | Types |
|---------|-------|
| Global | Organization + EducationalOrganization, WebSite |
| Homepage | WebPage |
| About | WebPage, Organization, BreadcrumbList |
| Certifications hub | WebPage, CollectionPage, BreadcrumbList |
| Cert detail | Course, BreadcrumbList |
| FAQ | FAQPage (published + schema-eligible only) |
| Blog / newsletter articles | Article, WebPage, BreadcrumbList |
| Blog index | CollectionPage |
| Legal hub + slugs | WebPage, BreadcrumbList |
| PM Service | Service, WebPage, BreadcrumbList |
| PMP cluster / courses / services | WebPage, Article, FAQPage via `PmpPageJsonLd`, `PmpCourseJsonLd`, `PmpServiceJsonLd` |
| Answers | WebPage, FAQPage via `AnswerJsonLd` |
| Topics | WebPage, CollectionPage via `TopicHubJsonLd` |

## Guards

- No Offer/AggregateOffer with regional prices
- No AggregateRating or fake reviews
- No Course schema on enroll/LMS routes
- FAQ schema uses `isFaqSchemaEligible` published entries only
- Article schema: no invented dates or authors
- All URLs use `PMS_SITE_URL` / canonical helpers

## Validation

```bash
npm run seo:schema-check
npm run seo:schema-guards-check
npm run seo:release-verify
```

## Rich Results Test (operator)

Post-deploy manual check:

- https://pmstructure.com/faq
- https://pmstructure.com/certifications/pmp
- https://pmstructure.com/answers/is-the-pmp-exam-changing-in-2026

Tool: https://search.google.com/test/rich-results