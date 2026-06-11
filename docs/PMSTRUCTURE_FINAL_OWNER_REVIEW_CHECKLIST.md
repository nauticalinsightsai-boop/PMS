# PM Structure. Final Owner Review Checklist

**Audit date:** 2026-06-10  
**Purpose:** Human sign-off before treating v2 SEO/AEO/GEO stack as production-complete.

Mark each item after review. Do not check items you have not personally verified.

---

## Brand & positioning

- [ ] Homepage copy reflects independent exam-prep platform (not PMI/PRINCE2 official provider)
- [ ] About page positioning is accurate
- [ ] No implied PMI ATP or authorized-partner status anywhere on live site
- [ ] No guaranteed pass or 100% pass language on live site
- [ ] Independent-platform disclaimer is visible where appropriate (footer, legal, pricing)

---

## PMP 2026 authority cluster

- [ ] `/pmp` hub copy and CTAs are accurate
- [ ] `/pmp-exam-2026` claims match verifiable PMI ECO guidance
- [ ] `/pmp-current-vs-new-exam` transition dates are correct (before 8 Jul / after 9 Jul 2026)
- [ ] `/pmp-before-8-july-2026` and `/pmp-after-9-july-2026` advice is responsible
- [ ] `/pmp-new-exam-domain-weighting` domain weights cited or qualified appropriately
- [ ] `/pmp-business-environment-domain` content is accurate
- [ ] Internal links between PMP cluster pages work on live site

---

## Course pathways & pricing

- [ ] `/pmp-foundation`, `/pmp-professional`, `/pmp-mastery` descriptions are accurate
- [ ] `/pmp-readiness-diagnostic` and `/pmp-scenario-practice` service descriptions are accurate
- [ ] Regional pricing notes and disclaimers (`/legal/regional-pricing`, `/legal/pricing-disclaimers`) are acceptable
- [ ] Pricing values unchanged from approved business figures (no accidental edits)
- [ ] Scholarship/regional tier messaging is clear

---

## FAQ & answer content

- [ ] `/pmp-faq`: spot-check 10 high-traffic questions for accuracy
- [ ] `/faq`: general certification FAQs are accurate
- [ ] Sample `/answers/*` pages (at least 5): no unsafe claims
- [ ] Sample `/topics/*` hubs (at least 5): internal links and summaries correct
- [ ] FAQ denying guarantee / ATP / affiliation reads clearly to a lay reader

---

## Legal & compliance

- [ ] `/legal/privacy`: reviewed (or scheduled for counsel review)
- [ ] `/legal/terms`: reviewed
- [ ] `/legal/refunds`: business refund/cancellation rules finalized
- [ ] `/legal/cookies`: cookie policy acceptable
- [ ] `/legal/services`: services terms acceptable
- [ ] Trademark disclaimers (PMI, PRINCE2, ITIL, etc.) present where needed
- [ ] Form privacy links work (`/contact`, diagnostic, newsletter)

---

## Conversion & payment

- [ ] PMP diagnostic CTA works end-to-end
- [ ] Pathway enrollment CTAs route correctly
- [ ] Payment/checkout flow tested live (success + cancel)
- [ ] `/checkout`, `/checkout/success`, `/checkout/cancel` confirmed noindex on live site
- [ ] Enroll success page confirmed noindex on live site
- [ ] Calendly/booking links open correct events
- [ ] Analytics events do not capture PII (review conversion event map)

---

## AI public files

- [ ] `/llms.txt`: approved public summary and deny-list
- [ ] `/entity.json`: entity description accurate
- [ ] `/ai-profile.json`: no unsafe claims
- [ ] `/pmp-faq.json`, `/faq.json`: answers match live pages
- [ ] `/pmp-2026.json`: dates and disclaimers acceptable
- [ ] `/pricing-policy.json`: disclaimer acceptable
- [ ] No private URLs (checkout, admin, dashboard, session) promoted as cite targets

---

## Deployment decision

- [ ] Read `PMSTRUCTURE_FINAL_DEPLOYMENT_DECISION.md`
- [ ] Read `PMSTRUCTURE_FINAL_FIX_BACKLOG.md`: agree on priority fixes
- [ ] Read `PMSTRUCTURE_FINAL_GO_LIVE_CONTROL_CENTER.md`: agree on overall status
- [ ] Approve deploy of v2 build to production
- [ ] Approve GSC/Bing submission after deploy
- [ ] Approve AI testing baseline schedule

---

## Sign-off

| Role | Name | Date | Decision |
|------|------|------|----------|
| Owner | | | ☐ Approve deploy ☐ Deploy with warnings ☐ Block |
| Legal (if engaged) | | | ☐ Reviewed ☐ Pending |
| Technical lead | | | ☐ Build verified ☐ SEO gates verified |

**Notes:**