# FAQ Expansion Map (Phase 10)

## Hub routes

| Route | Role |
|-------|------|
| `/pmp-faq` | Primary PMP FAQ hub (89 published PMP FAQs, 27 categories) |
| `/faq` | General hub; PMP-first tab order; links to `/pmp-faq` |

## Category model

27 `PmpCategoryId` values in `frontend/content/faq/pmp-categories.ts`.

## Schema

Published PMP FAQs on `/pmp-faq` and visible related FAQs on PMP surfaces merge into FAQPage JSON-LD.

## Validation

`npm run seo:faq-check` — minimum 83 PMP FAQs, 27 categories, `/pmp-faq` route, surface relatedPage coverage.
