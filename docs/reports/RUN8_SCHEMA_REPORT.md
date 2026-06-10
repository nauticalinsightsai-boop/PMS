# Run 8 — Schema Report

**Date:** 2026-06-10

## JSON-LD coverage

| Surface | Types |
|---------|-------|
| Global | Organization + EducationalOrganization, WebSite |
| Homepage | WebPage |
| About | WebPage, Organization, BreadcrumbList |
| Certifications hub | WebPage, CollectionPage, BreadcrumbList |
| Cert detail | Course, BreadcrumbList |
| FAQ | FAQPage |
| Blog / newsletter articles | Article, WebPage, BreadcrumbList |
| Blog index | CollectionPage |
| Legal hub | WebPage, BreadcrumbList |
| PM Service | Service, WebPage, BreadcrumbList |
| PMP / answers / topics | WebPage + type-specific (existing components) |

## Guards

- No Offer/AggregateOffer with regional prices
- No AggregateRating
- No Course schema on enroll/LMS routes
- FAQ schema uses `isFaqSchemaEligible` published entries only
- Article schema: no invented dates or authors

## Validation

```bash
npm run seo:schema-check
npm run build -w @pms/frontend
# Rich Results Test post-deploy on /faq, /certifications/pmp, /blog/{slug}
```
