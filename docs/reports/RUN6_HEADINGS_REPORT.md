# Run 6. Headings & SERP Report

**Date:** 2026-06-10

## Completed

- Homepage: server H1 via `HomeServerHeading`; hero visual title uses aria-hidden mirror
- FAQ: server H1 via `FaqServerHeading`; client hero mirrors visually
- About: values section H2 (sr-only) before value card H3s
- Contact: H2 for contact information and send-a-message sections
- CertificationDetail: sr-only H2 "Certification details" before dossier H3 block
- Compare: sr-only H2 "Comparison matrix" before comparison table
- Certifications catalog: sr-only H2 "Browse certification pathways" + pathway card H3s
- Validation: `npm run seo:headings-check` + `seo:h1-check`

## Also completed (follow-up)

- ArticleCard: `CardTitle` → semantic `<h3>` in `NewsletterComponents.tsx` (blog + newsletter)
- Store grid: sr-only H2 "Browse certification resources" + product titles as `<h3>`
- Community store tab inherits `StoreContent` heading outline

## Commands

```bash
npm run seo:headings-check
npm run seo:h1-check
npm run seo:render-check  # after build
```