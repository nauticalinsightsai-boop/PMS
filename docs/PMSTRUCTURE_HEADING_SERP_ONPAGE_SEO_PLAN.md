# PM Structure. Heading & SERP On-Page SEO Plan

**Canonical host:** `https://www.pmstructure.com`

## Rules

1. **One `<h1>` per page** in server HTML (client hero may use `role="heading" aria-level={1}` if server H1 exists in `sr-only`)
2. **H2** = major sections; **H3** = cards, FAQ questions, pathway tiers
3. Title tag ≈ H1 intent (may include `| PM Structure` suffix via `buildPageMetadata`)
4. No empty headings; no skipped levels (H1 → H3 without H2)

## Per-page H1 targets (live routes)

| Path | H1 (target) | Status |
|------|-------------|--------|
| `/` | PMP & project management exam prep | live: `HomeServerHeading` + client aria heading |
| `/certifications` | Find your pathway | audit pending |
| `/certifications/pmp` | PMP® exam preparation (or cert name) | audit pending |
| `/certifications/compare` | Compare certification pathways | audit pending |
| `/faq` | FAQ: certifications, pricing & support | live: `FaqServerHeading` |
| `/about` | About PM Structure | audit pending |
| `/contact` | Contact PM Structure | audit pending |
| `/membership` | Membership | audit pending |
| `/community` | Built by PMs, for PMs | audit pending |
| `/pm-service` | Preparation into progress | audit pending |
| `/blog` | Blog | audit pending |
| `/legal` | Legal information | audit pending |

## Component audit

| Component | Issue | Fix |
|-----------|-------|-----|
| `Home.tsx` | Client-only H1 | Server H1 in `page.tsx`; hero uses aria heading |
| `FAQ.tsx` | Accordion hides answers | `FaqCrawlableContent` sr-only block (done) |
| `CertificationDetail` | Verify single H1 | Run 6 audit |
| `ChannelLanding` (`/go/*`) | Portal H1 | Run 6 audit |
| Legal templates | H1 per document | Run 6 audit |

## SERP targets (priority)

| Query cluster | Primary URL | H1 |
|---------------|-------------|-----|
| PMP exam prep | `/certifications/pmp` → later `/pmp` | PMP exam preparation |
| PMP 2026 changes | `/pmp-2026` (planned) | PMP exam changes 2026 |
| PRINCE2 prep | `/certifications/prince2` | PRINCE2 exam preparation |
| Regional pricing | `/legal/regional-pricing` | Regional pricing policy |

## Validation

```bash
npm run seo:h1-check    # after implementation
npm run seo:render-check  # after next build
```

## Run 6 remaining tasks

- [ ] Audit cert detail + compare headings
- [ ] Audit legal/blog/newsletter article H1/H2
- [ ] Audit `/go/*` portal headings
- [ ] Document title/H1 mismatches in ROUTE_INVENTORY