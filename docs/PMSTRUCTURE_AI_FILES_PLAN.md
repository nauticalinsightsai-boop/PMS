# PM Structure. AI Files Plan

**Canonical host:** `https://www.pmstructure.com`  
**Generator:** [`frontend/scripts/generate-ai-files.mjs`](../frontend/scripts/generate-ai-files.mjs) (runs on `prebuild`)

## Live files (`frontend/public/`)

| File | Purpose | Regenerate |
|------|---------|------------|
| `llms.txt` | AI crawler manifest | manual + link to JSON |
| `entity.json` | Brand entity, topics, compliance | prebuild script |
| `ai-profile.json` | Pointer to entity + llms | prebuild |
| `courses.json` | All cert pathways | prebuild |
| `certifications.json` | Cert list | prebuild |
| `learning-pathways.json` | Pathway enroll patterns | prebuild |
| `pricing-policy.json` | Regional pricing summary | prebuild |
| `faq.json` | Full FAQ export | prebuild |
| `pmp-faq.json` | PMP-filtered FAQs | prebuild |
| `pmp-2026.json` | Planned page metadata | prebuild: status `planned` |
| `pmp-keywords.json` | Keyword clusters | prebuild |
| `pmp-routes.json` | Route map live vs planned | prebuild |

## Commands

```bash
npm run seo:generate-ai-files
```

## Compliance in generated JSON

- `entity.compliance.pmiAtpClaim: false`
- `pmp-2026.officialSourceTodo` on unverified PMI claims
- No guaranteed pass language
- URLs use `PMS_SITE_URL` only (no checkout/admin)

## Regeneration triggers

| Event | Action |
|-------|--------|
| FAQ data change | prebuild auto |
| New cert in siteData | prebuild auto |
| PMP routes ship (Run 9+) | Update `pmp-routes.json` status fields |
| Phase 10 FAQs | Expand `pmp-faq.json` count |

## Planned (not yet live)

- `feeds/pmp-articles.json`: after blog/PMP content
- `openapi` / MCP: out of scope

## TODO

- [ ] Add `frontend/lib/ai-files/compliance.ts` shared constants (optional)
- [ ] Align `pmp-routes.json` with Run 9 URL decision (`/pmp-2026` vs `/pmp-exam-2026`)
- [ ] `seo:ai-files-check` script (Run 17)