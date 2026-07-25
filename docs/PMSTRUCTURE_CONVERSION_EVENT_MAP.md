# PM Structure. Conversion Event Map

## T-013 — PMP 2026 funnel (primary)

**Source:** `frontend/lib/analytics/pms-events.ts`, `push-event.ts`  
**Transport:** `pushAnalyticsEvent` → `trackFunnelEvent` → GA4 (consent-gated)

| Event | Surface | Params (non-PII) |
|-------|---------|------------------|
| `pms_roadmap_cta_click` | Roadmap CTAs (nav, hero, cert, footer bar) | cta_text, cta_location, offer_id, page_path |
| `pmp_roadmap_form_start` | `PmpRoadmapLeadForm` first interaction | form_id, form_placement, region_group |
| `pmp_roadmap_fit_complete` | Roadmap fit step completed once per form session | form_id, lead_field, lead_objective |
| `pmp_roadmap_eligibility_complete` | Roadmap eligibility step completed once per form session | form_id, education_band, experience_band, training_status, exam_timeline |
| `generate_lead` | Any public lead persisted by the interaction API (`201`) | form_id, lead_source, form_placement, region_group |
| `select_content` | Booking CTA click | content_type, booking_type, destination, item_id |
| `booking_confirmed` | Trusted appointment confirmation | booking_status, content_type, event_id |
| `pms_contact_click` | mailto, WhatsApp (high-intent surfaces) | contact_method, contact_context |
| `pms_waitlist_join` | `WaitlistForm` success | waitlist_type, offer_name |
| `begin_checkout` | Live checkout / Stripe embed | offering_id, package_type, items |
| `purchase` | Verified Stripe success pages | transaction_id, package_type, items |

**Lead source of truth:** shared public-interaction helper after authoritative `201` persistence. Browser and Meta use the same opaque event ID for deduplication.

---

## Phase 14 — Page / enroll diagnostics (retained)

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
| `view_pmp_pathway` | `/certifications/pmp` page view | page_path |
| `region_select` | Region selector confirm | region_id, gcc_country |

**Validation:** `npm run seo:conversion-check`
