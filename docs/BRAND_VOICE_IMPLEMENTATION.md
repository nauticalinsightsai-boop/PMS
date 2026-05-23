# PM Structure brand voice — implementation status

**Source documents (in repo):**
- [`docs/PM_STRUCTURE_BRAND_VOICE.md`](./PM_STRUCTURE_BRAND_VOICE.md) — voice, CTAs, compliance, tone
- [`docs/PM_STRUCTURE_BRAND_VISUAL_SYSTEM.md`](./PM_STRUCTURE_BRAND_VISUAL_SYSTEM.md) — colors, gradients, typography
- Code: `frontend/lib/brand-voice.ts`, `frontend/lib/brand-visual.ts`, `frontend/app/globals.css`
- CMS defaults: `dashboard/frontend/constants/brandVoiceCmsDefaults.ts`

## Principles

- **Brand name:** PM Structure (not PMStructure in prose)
- **Position:** Independent exam-prep & readiness support
- **Tiers (display):** Foundation → Professional → **Mastery**
- **No:** guaranteed pass, official PMI/PRINCE2 provider claims (unless accredited), hype CTAs

## Rollout phases

### Phase 1 — Complete

- [x] `brand-voice.ts` + `brand-visual.ts`
- [x] Layout metadata, Navbar, Footer (+ accreditation disclaimer)
- [x] `siteData.ts` — hero CTA, featured, membership, testimonials, footer links
- [x] Home, Certifications (incl. pathway consultation block), FAQ, CertificationDetail, Compare
- [x] Community, Store, About, PM Service, Membership, Newsletter
- [x] Register modal, dashboard Home CMS defaults, dashboard meta titles
- [x] Banned-phrase pass on user-facing components (see below)

### Phase 2 — CMS seed (manual / script)

- [ ] Publish `BRAND_VOICE_CMS_DEFAULTS` rows to Supabase `website_data`
- [ ] Re-save home hero slides in dashboard if old copy is still published

### Phase 3 — Deep `siteData` certification copy

- [ ] Rewrite all certification `desc`, `recommendedCTA`, `outputValue` fields (40+ entries)
- [ ] Newsletter post titles/excerpts in `newsletterPosts`

### Phase 4 — QA grep (run before release)

```bash
# From repo root — user-facing frontend
rg -i "unlock your|guaranteed pass|pass on first|get started free|game changer|official pmi training|join elite|pmstructure" frontend/components frontend/data --glob "*.{tsx,ts}"
```

Allowed: `support@pmstructure.com`, `www.PMStructure.com`, FAQ answer mentioning "does not offer guaranteed pass"

## Banned → preferred

| Avoid | Use |
|-------|-----|
| Get Started Free | Book consultation |
| Unlock your potential | Measurable progress / structured access |
| Pass Guarantee | Readiness review & mock practice |
| Join Elite | Join Mastery |
| Foundation Direct (prominent) | Pathway consultation / Compare pathways |
