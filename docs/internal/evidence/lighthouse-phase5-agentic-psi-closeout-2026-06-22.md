# Lighthouse Phase 5 — Agentic PSI closeout (2026-06-22)

## Summary

Fresh PageSpeed Insights run confirms **Agentic Browsing 3/3** on `https://pmstructure.com/` after hardening `llms.txt` markdown links (commit `f96fabb`).

## Baseline (Jun 16, 2026)

| Category | Mobile score | Agentic |
|----------|--------------|---------|
| Performance | 70 | — |
| Accessibility | 95 | — |
| Best Practices | 96 | — |
| SEO | 100 | — |
| **Agentic Browsing** | — | **2/3** |

**Failure:** `llms.txt` — "File does not appear to contain any links" (bare URLs, no `[text](url)` syntax).

Source: [`lighthouse-home-baseline-2026-06-16.json`](./lighthouse-home-baseline-2026-06-16.json)

## Fix shipped (2026-06-22)

Commit `f96fabb` — Harden llms.txt markdown links for Lighthouse Agentic 3/3:

- Contact lines → `[Support email](mailto:…)` and `[WhatsApp](https://wa.me/…)`
- Blockquote in-prose link → `Visit [pmstructure.com](https://pmstructure.com) …`
- Do-not-cite `/dashboard` and `/login` → markdown list links
- CI guards in `scripts/seo/ai-files-check.mjs` (markdown-link regex + bare-URL guard)

## Production verification

```text
curl -s https://pmstructure.com/llms.txt | head -5
# PM Structure
> … Visit [pmstructure.com](https://pmstructure.com) for pathways and PMP 2026 guides.
```

- HTTP 200, `Content-Length: 4141`, `last-modified: Mon, 22 Jun 2026 15:59:31 GMT`
- Contact section: markdown mailto + WhatsApp links only (no bare `https://`)
- H1: `# PM Structure` present
- Zero bare `https://` outside `[...](...)` syntax (verified via script)

## Fresh PSI (Jun 22, 2026)

| Field | Value |
|-------|-------|
| **URL** | https://pagespeed.web.dev/analysis/https-pmstructure-com/5zsumrwmrd?form_factor=mobile |
| **Captured** | Jun 22, 2026, 9:24–9:25 PM GMT+5 |
| **Lighthouse** | 13.4.0 |
| **Device** | Emulated Moto G Power, Slow 4G |
| **Performance** | 99 |
| **Accessibility** | 100 |
| **Best Practices** | 100 |
| **SEO** | 100 |
| **Agentic Browsing** | **3/3** |

Screenshot: [`psi-agentic-3of3-2026-06-22.png`](./psi-agentic-3of3-2026-06-22.png)

Agentic section: **PASSED AUDITS (3)**, no `llms.txt` link-format failure.

## Closeout

- `p5-03-verify-agentic-3-of-3` may be marked **completed** in the main Lighthouse plan.
- Conditional cache-purge / Cloudflare rule steps **not required** (PSI passed on first post-deploy run).
