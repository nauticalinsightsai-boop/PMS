# PM Structure. Conversion Event Map

**Source:** `frontend/lib/analytics/conversion-events.ts`  
**Transport:** `trackConversionEvent` → `trackFunnelEvent` → GA4 (consent-gated)

| Event | Surface | Params |
|-------|---------|--------|
| `view_pmp_exam_2026` | `/pmp-exam-2026` | page_path |
| `view_pmp_foundation` | `/pmp-foundation` | page_path |
| `view_pmp_professional` | `/pmp-professional` | page_path |
| `view_pmp_mastery` | `/pmp-mastery` | page_path |
| `view_pmp_faq` | `/pmp-faq` | page_path |
| `view_answer_page` | `/answers/[slug]` | content_slug |
| `view_topic_hub` | `/topics/[slug]` | content_slug |
| `click_pmp_diagnostic` | Hub, authority, pathway CTAs | link_href |
| `click_enroll_pmp_foundation` | Foundation enroll CTA | link_href |
| `click_enroll_pmp_professional` | Professional enroll CTA | link_href |
| `click_enroll_pmp_mastery` | Mastery enroll CTA | link_href |
| `start_checkout` | Checkout form submit | offering_id |
| `click_payment` | Checkout form submit | offering_id |
| `view_pmp_pathway` | `/certifications/pmp` page view | page_path |
| `consultation_book` | Register modal submit, Calendly pathway popup | cert_id, offering_id, source |
| `region_select` | Region selector confirm | region_id, gcc_country |

**Validation:** `npm run seo:conversion-check`