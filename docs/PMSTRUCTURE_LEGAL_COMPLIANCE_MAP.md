# PM Structure — Legal & Compliance Map

**Run:** 16 (Phase 15)  
**Site:** https://www.pmstructure.com  
**Status:** Audited 2026-06-10

## Route inventory (30+ indexable legal URLs)

| Route | Type | Index | Sitemap |
|-------|------|-------|---------|
| `/legal` | Hub | yes | yes |
| `/legal/terms` | Core | yes | yes |
| `/legal/privacy` | Core (global) | yes | yes |
| `/legal/privacy/eu` | Regional addendum | yes | yes |
| `/legal/privacy/uk` | Regional addendum | yes | yes |
| `/legal/privacy/us` | Regional addendum | yes | yes |
| `/legal/privacy/gcc` | Regional addendum | yes | yes |
| `/legal/privacy/india` | Regional addendum | yes | yes |
| `/legal/privacy/pakistan` | Regional addendum | yes | yes |
| `/legal/privacy/gcc/{ae,sa,qa,bh,kw,om}` | Country supplement | yes | yes |
| `/legal/cookies` | Core | yes | yes |
| `/legal/services` | Core | yes | yes |
| `/legal/pricing-disclaimers` | Commerce | yes | yes |
| `/legal/regional-pricing` | Commerce | yes | yes |
| `/legal/refunds` | Commerce | yes | yes |
| `/legal/membership-terms` | Commerce | yes | yes |
| `/legal/tax` | Commerce | yes | yes |
| `/legal/acceptable-use` | Trust | yes | yes |
| `/legal/accessibility` | Trust | yes | yes |
| `/legal/security` | Trust | yes | yes |
| `/legal/subprocessors` | Trust | yes | yes |
| `/legal/dmca` | Trust | yes | yes |
| `/legal/complaints` | Trust | yes | yes |
| `/legal/marketing` | Comms | yes | yes |
| `/legal/ai` | Comms | yes | yes |
| `/legal/dpa` | Enterprise | yes | yes |

**Source:** `content/legal/registry.ts`, `content/legal/index.ts`, `app/sitemap.ts`

---

## Payment terms mapping

No standalone `/legal/payment-terms` route — payment terms are distributed:

| Topic | Authority page | Section |
|-------|----------------|---------|
| Checkout & billing | `/legal/terms` | §4 Payments & refunds |
| Refunds & cancellations | `/legal/refunds` | full document |
| Tax & invoicing | `/legal/tax` | full document |
| Regional pricing | `/legal/regional-pricing` | full document |
| Membership billing | `/legal/membership-terms` | full document |

---

## Required compliance phrases (marketing + PMP)

| Requirement | Where enforced |
|-------------|----------------|
| Independent exam-prep platform | `PMP_INDEPENDENT_DISCLAIMER`, `pricing-disclaimers#independent-platform`, Terms §3/§6 |
| Not PMI ATP unless confirmed | `disclaimer.ts`, FAQs, answers |
| No guaranteed pass | Terms §6, PMP FAQs, `/answers/does-pm-structure-guarantee-a-pmp-pass` |
| PMI trademark fair use | `pricing-disclaimers` §4 Trademarks & fair use |
| Exam fees excluded | `REGION_COPY.compliance`, regional pricing legal |
| Official exams via cert bodies | `pricing-disclaimers` §6 Official exams |

---

## Footer & hub links

| Surface | Links |
|---------|-------|
| Site `Footer.tsx` | FAQ, Legal hub, Privacy, Terms, Disclaimers (`FOOTER_LEGAL_LINKS`) |
| Channel portals | `PortalLegalLinks` (same constant) |
| Legal hub | `legalHubSections` — core, commerce, trust, comms |
| Resources nav | `/legal` on main footer column |

---

## PMP / AEO content compliance

- All PMP cluster, course, service, answer, and topic pages include `PMP_INDEPENDENT_DISCLAIMER`
- Authority pages link to `/legal/pricing-disclaimers#independent-platform`
- `seo:legal-compliance-check` scans PMP/answer content for banned positive claims

---

## External counsel review flag

> **Before major PMP 2026 marketing pushes or paid ads:** Have qualified counsel review PMP cluster pages, `pricing-disclaimers`, and `regional-pricing` for jurisdiction-specific claims (especially India/Pakistan scholarship, GCC, EU/UK privacy).

Internal engineering sign-off ≠ legal sign-off.

---

## Validation

```bash
npm run seo:legal-compliance-check
npm run test:legal-seo -w @pms/frontend
npm run seo:check
```

## Related docs

- [`PMSTRUCTURE_REGIONAL_PRICING_SEO_PLAN.md`](PMSTRUCTURE_REGIONAL_PRICING_SEO_PLAN.md)
- [`PMSTRUCTURE_CONVERSION_FLOW_MAP.md`](PMSTRUCTURE_CONVERSION_FLOW_MAP.md)
- [`PMSTRUCTURE_SCHEMA_MATRIX.md`](PMSTRUCTURE_SCHEMA_MATRIX.md)
