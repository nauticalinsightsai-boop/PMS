# Vercel deployment — PM Structure monorepo

Admin is served at **`https://pmstructure.com/admin`** (login at `/admin/login`). The marketing Next.js app rewrites `/admin/*` to separately deployed dashboard apps.

## Architecture

| App | Path | Vercel root directory |
|-----|------|------------------------|
| Marketing site | `/`, `/certifications`, … | `frontend` |
| Public API | `/api/*` (non-admin) | `backend` |
| Admin UI | `/admin/*` | `dashboard/frontend` |
| Admin API | `/admin/api/*` | `dashboard/backend` |

Locally, `npm run dev` gateway routes `http://localhost:3000/admin` → dashboard on `:5174`.

## Vercel projects (4)

| Project | Root directory | Example URL |
|---------|----------------|-------------|
| `pmstructure` | `frontend` | `pmstructure.com` |
| `pmstructure-api` | `backend` | `pmstructure-api.vercel.app` |
| `pmstructure-admin` | `dashboard/frontend` | `pmstructure-admin.vercel.app` |
| `pmstructure-dash-api` | `dashboard/backend` | `pmstructure-dash-api.vercel.app` |

Each folder has a `vercel.json` with monorepo install/build commands.

## Marketing site env (`frontend/`)

Set on the **pmstructure.com** project:

```env
NEXT_PUBLIC_SITE_URL=https://pmstructure.com
NEXT_PUBLIC_API_URL=https://pmstructure.com
BACKEND_URL=https://pmstructure-api.vercel.app

# Rewrites /admin → dashboard deployments (required for admin on main domain)
DASHBOARD_FRONTEND_URL=https://pmstructure-admin.vercel.app
DASHBOARD_BACKEND_URL=https://pmstructure-dash-api.vercel.app

NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Redeploy marketing after changing `DASHBOARD_*` URLs.

## Dashboard UI env (`dashboard/frontend/`)

```env
NEXT_PUBLIC_BASE_PATH=/admin
NEXT_PUBLIC_SITE_URL=https://pmstructure.com
NEXT_PUBLIC_MARKETING_SITE_URL=https://pmstructure.com
NEXT_PUBLIC_DASHBOARD_URL=https://pmstructure.com
NEXT_PUBLIC_AUTH_USE_API_LOGIN=true
DASHBOARD_BACKEND_URL=https://pmstructure-dash-api.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Dashboard API env (`dashboard/backend/`)

```env
NEXT_PUBLIC_SITE_URL=https://pmstructure.com
NEXT_PUBLIC_BASE_PATH=/admin
AUTH_SESSION_SECRET=                    # openssl rand -base64 32
AUTH_BOOTSTRAP_SECRET=                  # openssl rand -base64 32
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
DASHBOARD_ADMIN_EMAILS=nauticalinsights.ai@gmail.com
NEXT_PUBLIC_AUTH_USE_API_LOGIN=true
AUTH_ALLOWED_ORIGINS=https://pmstructure.com

# SMTP (password reset + OTP email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASS=...
AUTH_EMAIL_FROM=...
AUTH_EMAIL_FROM_NAME=PM Structure
```

Password-reset links use `{NEXT_PUBLIC_SITE_URL}{NEXT_PUBLIC_BASE_PATH}/login/update-password`.

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
curl https://pmstructure-dash-api.vercel.app/api/health
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
