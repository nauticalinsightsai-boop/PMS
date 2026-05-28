# Pre-launch Legal, SEO & AEO Audit

Canonical site: **https://www.pmstructure.com** (`NEXT_PUBLIC_SITE_URL`)

## Automated commands

```bash
npm run test:legal-seo
node scripts/legal-seo-check.mjs
npm run test:regional
npm run build -w @pms/frontend
```

## Launch gates

| Gate | Status | Owner |
|------|--------|-------|
| `/legalhub` → `/legal` redirects | Code | — |
| 15+ legal routes (publication copy, no draft banner) | Code | — |
| All compliance contact → support@pmstructure.com | Code | — |
| FAQ ≥65 + tabbed UX + FAQPage JSON-LD | Code | — |
| No banned draft/counsel/placeholder strings in legal+FAQ | Code | — |
| Full sitemap + robots + llms.txt | Code | — |
| Per-page metadata + canonicals | Code | — |
| Organization + Course JSON-LD | Code | — |
| OG default image | `public/og/default.png` | Design |
| Footer entity/phone from env (hidden until set) | Set `NEXT_PUBLIC_*` | You |
| No picsum on cert detail hero | Code | — |
| External counsel review (off-site) | Manual | Counsel |
| GSC/Bing sitemap submit | Post-deploy | You |
| Lighthouse SEO ≥90 (sample URLs) | Manual | You |

## Manual checks (post-deploy)

- [ ] Screaming Frog: no critical 404s on `/legal/*`, `/faq`, certs
- [ ] Google Rich Results Test: `/faq`, `/certifications/pmp`
- [ ] axe/WAVE: `/legal`, `/checkout`, region modal
- [ ] `/faq` tabs show one section at a time; search works cross-tab
- [ ] AI spot-check: “PM Structure regional pricing”, “PMP India cost”

## Content audit log

See [LEGAL_FAQ_CONTENT_AUDIT.md](./LEGAL_FAQ_CONTENT_AUDIT.md) and [FAQ_ANSWER_SPEC.md](./FAQ_ANSWER_SPEC.md).

## hreflang

Single English site; region selector is for pricing only — **no hreflang** implemented.
