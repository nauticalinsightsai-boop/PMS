# Legal & FAQ content audit (2026-05-23)

Baseline before publication pass. Status: **HIGH** = must fix in this pass; **MED** = expand; **OK** = acceptable after rewrite.

## Legal documents

| Slug / file | Draft/counsel | Contact | Depth | Product | Status |
|-------------|---------------|---------|-------|---------|--------|
| terms | `(placeholder)` in §10 | dual inbox | OK | OK | HIGH |
| privacy/global | controller placeholder | legal@ rail | MED | OK | HIGH |
| privacy/eu, uk, us, india, pakistan | — | legal@ | thin (4§) | OK | HIGH |
| privacy/gcc | counsel template text | — | thin | OK | HIGH |
| privacy/gcc-countries (×6) | template jurisdictionNote | legal@ | thin (3§) | OK | HIGH |
| cookies | — | legal@ | MED | keys drift | MED |
| services, refunds, complaints | — | mixed | MED | OK | MED |
| dpa | template + counsel | legal@ | thin | OK | HIGH |
| membership-terms, tax, aup, ai, regional-pricing | — | no support § | thin | OK | MED |
| subprocessors | vague hosts | — | MED | OK | MED |
| shared.ts | LEGAL_DRAFT_NOTICE | — | — | — | HIGH |
| LegalDraftBanner | on all pages | — | — | — | HIGH |

## FAQ entries (59 + 8 cert-generated = 67 after certFaqs)

| Cluster | Count | Issues |
|---------|-------|--------|
| privacy | 6 | legal@ on dsar, children; thin dsar steps |
| support | 3 | dual inbox; checkout missing support@ |
| consultation | 1 | "Contact us" vague (consult-corp) |
| delivery | 1 | duration "Contact support" no email |
| All | — | Need structured lead + bullets; tab UX stacks 11 clusters |

**Gaps to add (substantive):** refund 14-day vs LMS access; cookie opt-out; membership renewal cancel; mastery consultation gate; scholarship verify failure; data hosting/subprocessors summary.

## UX

| Surface | Issue | Fix |
|---------|-------|-----|
| FAQ.tsx | All clusters rendered = long scroll | Section tabs (5 groups) |
| FAQ search | OK | Cross-tab results panel when query set |

## Resolution

All HIGH/MED items addressed in publication pass commit. Entity name/address/phone: pending user env (`NEXT_PUBLIC_LEGAL_ENTITY_*`).
