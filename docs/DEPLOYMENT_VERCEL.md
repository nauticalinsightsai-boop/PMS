# Vercel deployment. PM Structure monorepo

Admin lives at **`https://pmstructure.com/admin/login`** on the **same domain** as the marketing site.

## Recommended: 2 Vercel projects (marketing + public API)

| App | URL path | Vercel root directory |
|-----|----------|------------------------|
| Marketing site + admin UI + admin API | `/`, `/admin/*` | `frontend` |
| Public API | `/api/*` (non-admin) | `backend` |

Before each build, `frontend` runs `scripts/sync-admin-into-frontend.mjs`, which mounts dashboard pages and API routes under `frontend/app/admin/`. **Do not set `DASHBOARD_FRONTEND_URL` or `DASHBOARD_BACKEND_URL`** on the marketing project unless you use the optional split deploy below.

### Marketing site env (`frontend/` project)

```env
NEXT_PUBLIC_SITE_URL=https://pmstructure.com
NEXT_PUBLIC_API_URL=https://pmstructure.com
NEXT_PUBLIC_DASHBOARD_URL=https://pmstructure.com
NEXT_PUBLIC_BASE_PATH=/admin
BACKEND_URL=https://pmstructure-api.vercel.app

NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Auth + admin API (bundled under /admin/api on this same deployment)
AUTH_SESSION_SECRET=                    # openssl rand -base64 32
AUTH_BOOTSTRAP_SECRET=                  # openssl rand -base64 32
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_AUTH_USE_API_LOGIN=true
DASHBOARD_ADMIN_EMAILS=nauticalinsights.ai@gmail.com

# SMTP (password reset + OTP email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASS=...
AUTH_EMAIL_FROM=...
AUTH_EMAIL_FROM_NAME=PM Structure
```

Redeploy the marketing project after env changes.

### Public API env (`backend/` project)

Same Supabase keys as above. Set `AUTH_ALLOWED_ORIGINS=https://pmstructure.com` if auth routes are used from the public API.

```env
STRIPE_SECRET_KEY=sk_live_...          # or sk_test_... while testing
STRIPE_WEBHOOK_SECRET=whsec_...        # Stripe Dashboard → Webhooks → signing secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

Webhook URL for production: `https://pmstructure.com/api/stripe/webhook` (event: `checkout.session.completed`).

Redeploy the **backend** project after adding Stripe env vars.

## Optional: 4 Vercel projects (split admin)

Use this only if you want admin on separate deployments. Set on the **marketing** project:

```env
DASHBOARD_FRONTEND_URL=https://pmstructure-admin.vercel.app
DASHBOARD_BACKEND_URL=https://pmstructure-dash-api.vercel.app
```

| Project | Root directory |
|---------|----------------|
| `pmstructure-admin` | `dashboard/frontend` |
| `pmstructure-dash-api` | `dashboard/backend` |

Each folder has a `vercel.json` with monorepo install/build commands. See dashboard env blocks in git history or `.env.example` comments if you need the split setup.

## Bootstrap admin password

```bash
curl -X POST https://pmstructure.com/admin/api/auth/bootstrap-password \
  -H "Content-Type: application/json" \
  -H "x-bootstrap-secret: YOUR_AUTH_BOOTSTRAP_SECRET" \
  -d '{"email":"nauticalinsights.ai@gmail.com","password":"YourSecurePassword12+"}'
```

## Post-deploy checks

```bash
curl -I https://pmstructure.com/
curl -I https://pmstructure.com/admin/login
curl https://pmstructure.com/admin/api/auth/session
```

Sign in at **https://pmstructure.com/admin/login**.

## Supabase

1. Expose schema **`dashboard_one`** in Supabase API settings.
2. `npm run db:migrate` then `npm run db:check-supabase`.

See `docs/auth/AUTH_SYSTEM.md` for auth details.

## Legacy paths

These redirect to `/admin/*` on the marketing site:

- `/login` → `/admin/login`
- `/dashboard` → `/admin/dashboard`