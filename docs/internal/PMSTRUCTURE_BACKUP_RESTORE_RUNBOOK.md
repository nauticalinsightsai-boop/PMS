# PM Structure — Backup and Restore Runbook

## Purpose

This document defines the backup and rollback workflow for PM Structure.

This is an internal technical operations document. Do not publish it as a public page.

**Related:** [`PMSTRUCTURE_TECHNICAL_HYGIENE.md`](PMSTRUCTURE_TECHNICAL_HYGIENE.md) · [`../DEPLOYMENT_VERCEL.md`](../DEPLOYMENT_VERCEL.md)

---

## Stack

| Layer | Technology |
| ----- | ---------- |
| Application | Next.js 15 monorepo (npm workspaces) |
| Public site + admin | Vercel (`frontend/` project) |
| Database + auth + CMS | Supabase (Postgres) |
| Media (CMS uploads) | Supabase Storage (`site-media` bucket) |
| WordPress / UpdraftPlus | **N/A** |

---

## What is backed up

| Asset | Method | Owner |
| ----- | ------ | ----- |
| Application code | GitHub Git repository | Developer |
| Deploy history | Vercel deployment list | Developer / owner |
| Database (orders, CMS, auth, forms) | Supabase automated backups + manual SQL export | Owner |
| CMS JSON (`website_data`) | Supabase + optional `npm run seed:site-content` export | Developer |
| Channel portals | `data/channel-landing-pages.json` in Git + dashboard API | Developer |
| Static marketing assets | `frontend/public/` in Git | Developer |
| Environment variables | Vercel / Railway project settings (not in repo) | Owner |
| Google Sheets mirror | Google Drive (interactions pipeline) | Owner |

Do not store production secrets or full database dumps in the public Git repo.

---

## Backup schedule (recommended policy)

| Frequency | Scope |
| --------- | ----- |
| Continuous | Git commits on every merge |
| Daily | Supabase automated backups (platform default) |
| Before major SEO/dev releases | Manual Supabase export or snapshot note |
| Before CMS bulk edits | Export `website_data` or document field keys changed |
| Weekly | Verify latest Vercel production deploy is tagged/noted |

---

## Rollback — application (Vercel)

1. Open Vercel → PM Structure marketing project → **Deployments**.
2. Find the last known-good production deployment.
3. Click **⋯ → Promote to Production** (or Redeploy previous commit).
4. Confirm `NEXT_PUBLIC_*` env vars unchanged (especially `NEXT_PUBLIC_SITE_URL=https://pmstructure.com`).
5. Smoke test: `/`, `/certifications/pmp`, roadmap form, checkout test mode if applicable.

For Git-level rollback: revert commit on main → push → Vercel auto-deploys.

---

## Rollback — database (Supabase)

1. Supabase Dashboard → **Database → Backups** (or point-in-time recovery if enabled).
2. Owner confirms restore window with developer (downtime/data loss risk).
3. After restore, re-run `npm run db:migrate` only if migrations were applied after backup point.
4. Verify admin login, CMS publish, checkout webhook, form submissions.

**Restore test:** A backup strategy is incomplete until restore is tested at least once per quarter.

---

## Rollback — CMS content only

1. Use dashboard **Save Draft** history or re-publish prior `published` JSON from Supabase row backup.
2. Dev fallback: `npm run seed:site-content` from known snapshot (dev/staging only unless owner approves prod seed).

---

## Before major SEO / development changes

1. Confirm latest production deploy is stable.
2. Note current Git commit SHA and Vercel deployment ID.
3. Export Supabase backup or document "no DB migration in this release".
4. Confirm rollback method (Vercel promote vs Git revert).
5. Document deployment notes in PR or internal changelog.

---

## Environment variable backup

Production values live in:

- Vercel marketing project env
- Railway PMS service env (if used)
- Supabase project settings

Maintain a **private** owner spreadsheet or password manager entry listing which keys exist — never commit values to Git.

Required production URLs (all four):

```env
NEXT_PUBLIC_SITE_URL=https://pmstructure.com
NEXT_PUBLIC_API_URL=https://pmstructure.com
NEXT_PUBLIC_MARKETING_SITE_URL=https://pmstructure.com
NEXT_PUBLIC_DASHBOARD_URL=https://pmstructure.com
```

---

## UpdraftPlus (T-077)

**N/A — project is not WordPress.** Do not install UpdraftPlus. Use this runbook instead.

---

Owner: Sheikh M. Abdullah  
Technical owner: Developer  
Marketing owner: Mahaa  
Last updated: 18 June 2026
