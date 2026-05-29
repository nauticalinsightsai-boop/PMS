# Pathway enrollment — environment variables

Configure these on the **marketing site** service (`frontend` / `@pms/frontend`). Values are public (`NEXT_PUBLIC_*`) and baked in at build time — **redeploy after changing**.

Store secrets only in Railway or `.env.local` (never commit real URLs with tracking tokens if you prefer; the Calendly links themselves are public).

## Enrollment success & support

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_WHATSAPP_URL` | Recommended | Full `https://wa.me/…` or `https://api.whatsapp.com/send?phone=…` link. Shown on `/certifications/…/enroll/success`. |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Optional | Defaults to `support@pmstructure.com`. Success page mailto. |

## Pathway consultation Calendly (per certification × tier)

Each **Professional** and **Mastery** pathway modal button **Book consultation now** opens the URL for that cert and tier.

Naming rule:

```text
NEXT_PUBLIC_CALENDLY_PATHWAY_{SITE_CERT_ID}_{TIER_ID}
```

- `SITE_CERT_ID` — slug from `/certifications/{id}/` (hyphens → underscores, uppercase), e.g. `PMP`, `PMI_ACP`, `PRINCE2_AGILE_PRACTITIONER`
- `TIER_ID` — matrix tier: `FOUNDATION`, `PROFESSIONAL`, `MASTERY`, `MASTERY_CORPORATE`, `MASTERY_ADVISORY`

Example (flagship PMP — set these first):

```env
NEXT_PUBLIC_CALENDLY_PATHWAY_PMP_FOUNDATION=https://calendly.com/booking-sh3ikhmabz/your-pmp-foundation-event
NEXT_PUBLIC_CALENDLY_PATHWAY_PMP_PROFESSIONAL=https://calendly.com/booking-sh3ikhmabz/your-pmp-professional-event
NEXT_PUBLIC_CALENDLY_PATHWAY_PMP_MASTERY=https://calendly.com/booking-sh3ikhmabz/your-pmp-mastery-event
```

Until a variable is set, the app uses **tier-level fallbacks** (shared discovery / project review / strategy events from `frontend/lib/calendly/scheduling-urls.ts`). Production should override with dedicated events per row below.

### Full key list (51 pairs)

Regenerate after catalogue changes:

```bash
npm run print:pathway-calendly-env
npm run print:pathway-calendly-env:dotenv   # commented .env snippet
npm run print:pathway-calendly-env:md       # refresh table in this doc
```

| Env variable | Certification | Tier | Enroll URL |
|--------------|---------------|------|------------|
| `NEXT_PUBLIC_CALENDLY_PATHWAY_CAPM_PROFESSIONAL` | capm | professional | /certifications/capm/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_LSS_BLACK_MASTERY` | lss-black | mastery | /certifications/lss-black/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_LSS_BLACK_PROFESSIONAL` | lss-black | professional | /certifications/lss-black/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_LSS_CHAMPION_MASTERY_CORPORATE` | lss-champion | mastery_corporate | /certifications/lss-champion/mastery-corporate/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_LSS_CHAMPION_PROFESSIONAL` | lss-champion | professional | /certifications/lss-champion/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_LSS_GREEN_FOUNDATION` | lss-green | foundation | /certifications/lss-green/foundation/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_LSS_GREEN_MASTERY` | lss-green | mastery | /certifications/lss-green/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_LSS_GREEN_PROFESSIONAL` | lss-green | professional | /certifications/lss-green/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_LSS_MASTER_MASTERY_ADVISORY` | lss-master | mastery_advisory | /certifications/lss-master/mastery-advisory/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_LSS_WHITE_FOUNDATION` | lss-white | foundation | /certifications/lss-white/foundation/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_LSS_YELLOW_FOUNDATION` | lss-yellow | foundation | /certifications/lss-yellow/foundation/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_LSS_YELLOW_PROFESSIONAL` | lss-yellow | professional | /certifications/lss-yellow/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_MOP_MASTERY` | mop | mastery | /certifications/mop/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_MOP_PROFESSIONAL` | mop | professional | /certifications/mop/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_MOR_MASTERY` | mor | mastery | /certifications/mor/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_MOR_PROFESSIONAL` | mor | professional | /certifications/mor/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_MSP_MASTERY` | msp | mastery | /certifications/msp/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_MSP_PROFESSIONAL` | msp | professional | /certifications/msp/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_P3O_MASTERY` | p3o | mastery | /certifications/p3o/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_P3O_PROFESSIONAL` | p3o | professional | /certifications/p3o/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PFMP_MASTERY` | pfmp | mastery | /certifications/pfmp/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PFMP_PROFESSIONAL` | pfmp | professional | /certifications/pfmp/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PGMP_MASTERY` | pgmp | mastery | /certifications/pgmp/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PGMP_PROFESSIONAL` | pgmp | professional | /certifications/pgmp/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_ACP_FOUNDATION` | pmi-acp | foundation | /certifications/pmi-acp/foundation/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_ACP_MASTERY` | pmi-acp | mastery | /certifications/pmi-acp/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_ACP_PROFESSIONAL` | pmi-acp | professional | /certifications/pmi-acp/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_CP_FOUNDATION` | pmi-cp | foundation | /certifications/pmi-cp/foundation/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_CP_MASTERY` | pmi-cp | mastery | /certifications/pmi-cp/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_CP_PROFESSIONAL` | pmi-cp | professional | /certifications/pmi-cp/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_CPMAI_FOUNDATION` | pmi-cpmai | foundation | /certifications/pmi-cpmai/foundation/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_CPMAI_MASTERY` | pmi-cpmai | mastery | /certifications/pmi-cpmai/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_CPMAI_PROFESSIONAL` | pmi-cpmai | professional | /certifications/pmi-cpmai/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_PBA_MASTERY` | pmi-pba | mastery | /certifications/pmi-pba/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_PBA_PROFESSIONAL` | pmi-pba | professional | /certifications/pmi-pba/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_PMOCP_MASTERY` | pmi-pmocp | mastery | /certifications/pmi-pmocp/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_PMOCP_PROFESSIONAL` | pmi-pmocp | professional | /certifications/pmi-pmocp/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_RMP_FOUNDATION` | pmi-rmp | foundation | /certifications/pmi-rmp/foundation/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_RMP_MASTERY` | pmi-rmp | mastery | /certifications/pmi-rmp/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_RMP_PROFESSIONAL` | pmi-rmp | professional | /certifications/pmi-rmp/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_SP_MASTERY` | pmi-sp | mastery | /certifications/pmi-sp/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMI_SP_PROFESSIONAL` | pmi-sp | professional | /certifications/pmi-sp/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMP_FOUNDATION` | pmp | foundation | /certifications/pmp/foundation/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMP_MASTERY` | pmp | mastery | /certifications/pmp/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PMP_PROFESSIONAL` | pmp | professional | /certifications/pmp/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PRINCE2_PROFESSIONAL` | prince2 | professional | /certifications/prince2/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PRINCE2_AGILE_PROFESSIONAL` | prince2-agile | professional | /certifications/prince2-agile/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PRINCE2_AGILE_PRACTITIONER_MASTERY` | prince2-agile-practitioner | mastery | /certifications/prince2-agile-practitioner/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PRINCE2_AGILE_PRACTITIONER_PROFESSIONAL` | prince2-agile-practitioner | professional | /certifications/prince2-agile-practitioner/professional/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PRINCE2_PRACTITIONER_MASTERY` | prince2-practitioner | mastery | /certifications/prince2-practitioner/mastery/enroll |
| `NEXT_PUBLIC_CALENDLY_PATHWAY_PRINCE2_PRACTITIONER_PROFESSIONAL` | prince2-practitioner | professional | /certifications/prince2-practitioner/professional/enroll |

## Railway (production)

1. Open the **marketing site** service → **Variables**.
2. Add `NEXT_PUBLIC_WHATSAPP_URL` and the Calendly `NEXT_PUBLIC_CALENDLY_PATHWAY_*` keys you have events for (start with PMP trio, then roll out).
3. **Redeploy** the frontend service so Next.js picks up `NEXT_PUBLIC_*` at build time.

CLI (after `railway link` to the site service):

```bash
railway variables set NEXT_PUBLIC_WHATSAPP_URL="https://wa.me/XXXXXXXXXXX"
railway variables set NEXT_PUBLIC_CALENDLY_PATHWAY_PMP_PROFESSIONAL="https://calendly.com/booking-sh3ikhmabz/..."
```

## Local dev

Copy commented keys into `frontend/.env.local` (or root `.env.local` if your dev script loads it):

```bash
npm run print:pathway-calendly-env:dotenv >> frontend/.env.local
```

Then edit each URL and restart `npm run dev`.

## Related docs

- [ENV_CHECKLIST.md](./audits/ENV_CHECKLIST.md) — full stack env index
- Home / engagement Calendly: `NEXT_PUBLIC_CALENDLY_EVENT_URL*` in `frontend/lib/calendly/embed-url.ts`
