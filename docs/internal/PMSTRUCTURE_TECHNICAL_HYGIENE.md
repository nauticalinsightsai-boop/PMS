# PM Structure — Technical Hygiene, Mixed Content, Plugins, and Backup System

## Purpose

This document defines PM Structure's technical hygiene rules: mixed content, wrong-host URLs, backup/restore, plugin applicability, editability, and broken-link checking.

This is an internal technical governance document. Do not publish it as a public page.

**Related batches:** T-028 mixed content · B03 analytics · B04 indexation · B05 redirects · B06 on-page SEO · B07 schema · B08 performance

**Related docs:** [`PMSTRUCTURE_MIXED_CONTENT_AUDIT.md`](PMSTRUCTURE_MIXED_CONTENT_AUDIT.md) · [`PMSTRUCTURE_EDITING_GUIDE.md`](PMSTRUCTURE_EDITING_GUIDE.md) · [`PMSTRUCTURE_BACKUP_RESTORE_RUNBOOK.md`](PMSTRUCTURE_BACKUP_RESTORE_RUNBOOK.md) · [`PMSTRUCTURE_REDIRECT_DEPLOYMENT_NOTE.md`](PMSTRUCTURE_REDIRECT_DEPLOYMENT_NOTE.md) · [`../DEPLOYMENT_VERCEL.md`](../DEPLOYMENT_VERCEL.md)

---

## Preferred Host

```txt
https://pmstructure.com
```

Non-www apex HTTPS is the canonical production host. `www.pmstructure.com` and plain HTTP redirect to apex via middleware and `frontend/next.config.ts`.

---

## Stack (not WordPress)

| Item | Value |
| ---- | ----- |
| Framework | Next.js 15 App Router (npm workspaces monorepo) |
| Hosting | Vercel (marketing + bundled admin); Railway for some prod env |
| CMS | Supabase `website_data` JSONB + code content files |
| WordPress | **No** — all WordPress plugin tasks are **N/A** |

---

## Mixed Content Rule

No internal assets, links, forms, scripts, CSS, embeds, or API calls should use insecure `http://` URLs in production.

Normal internal links should use relative URLs (`/certifications/pmp`).

Absolute URLs should use `https://pmstructure.com` only where required (canonical, OG, schema, sitemap, robots, email templates).

**Not mixed content:** SVG `xmlns="http://www.w3.org/2000/svg"` (namespace, not a network request).

Dev-only `http://localhost:*` fallbacks are intentional when env is unset locally.

**Do not** use CSP `upgrade-insecure-requests` as the only fix.

**Audits:**

```bash
npm run seo:audit-insecure-content
npm run audit:technical-hygiene
npm run seo:audit-insecure-content -- --base=https://pmstructure.com   # post-deploy
```

---

## Backup Rule

**UpdraftPlus — N/A** (project is not WordPress).

Use:

- Git repository history
- Vercel deployment rollback
- Supabase automated backups + manual export before major migrations
- CMS export via dashboard / `npm run seed:site-content`
- Environment variables documented in `.env.example` (values live in Vercel/Railway only)

See [`PMSTRUCTURE_BACKUP_RESTORE_RUNBOOK.md`](PMSTRUCTURE_BACKUP_RESTORE_RUNBOOK.md).

---

## Editability Rule

Content, metadata, navigation, and CTAs are edited via admin dashboard (`/admin`) and code files. See [`PMSTRUCTURE_EDITING_GUIDE.md`](PMSTRUCTURE_EDITING_GUIDE.md).

Do not make important SEO or compliance changes impossible for the team to maintain — but high-risk areas (schema, analytics, redirects, indexation) require developer review.

---

## Plugin Rule

Do not install WordPress plugins blindly. Yoast, WPSSO, Broken Link Checker, UpdraftPlus, Smush, and WP Fastest Cache are **N/A** for this stack.

Avoid duplicate SEO/schema/cache/image systems. B07 custom schema + Next metadata is the source of truth.

See [`pmstructure-plugin-applicability-matrix.csv`](pmstructure-plugin-applicability-matrix.csv).

---

## Broken Link Rule

Broken-link checking is required, but WordPress Broken Link Checker plugin is **N/A**.

Use:

- `npm run seo:internal-links-check`
- `npm run audit:links` (repo href scan)
- `npm run seo:smoke-urls` / `npm run seo:smoke-live` (post-deploy)
- `npm run seo:audit-redirects`
- Manual Screaming Frog / Sitebulb (owner, post-deploy)

---

## Public Exposure Rule

Do not expose internal docs, backups, secrets, logs, private CSVs, lead data, or payment data publicly.

- `docs/internal/` is **not** in `frontend/public/`
- `robots.ts` disallows `/admin/` and `/api/`
- No `.env` files committed to the repo

---

## Form / API Security

Public forms POST to same-origin relative paths (`/api/interactions`, `/api/support/chat`). Checkout uses HTTPS Stripe. No webhook secrets in client bundles. Calendly URLs normalized to HTTPS at runtime.

Do not break lead capture, payment, or booking when changing URLs.

---

## Owner / Hosting Actions

1. Confirm all four production `NEXT_PUBLIC_*_URL` vars use `https://pmstructure.com`
2. Run live mixed-content audit after deploy
3. Schedule Supabase restore test
4. Confirm Vercel rollback access
5. Do **not** install WordPress plugins

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026
