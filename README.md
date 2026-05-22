# PMS

Project Management certification platform — **Next.js** monorepo (TypeScript + JavaScript).

## Structure

| Package | Stack | Port |
|---------|--------|------|
| `frontend/` | Next.js 15 (App Router, TypeScript) — public site | 3000 |
| `backend/` | Next.js 15 API routes (TypeScript + `.js` helpers) | 3001 |
| `dashboard/frontend/` | Next.js 15 admin UI (TypeScript) | 5174 |
| `dashboard/backend/` | Next.js 15 dashboard API (TypeScript + `.js` helpers) | 3002 |
| `supabase/migrations/` | Postgres schema | — |

## Tech

- **UI**: React 19, Tailwind CSS v4, shadcn/ui, Motion
- **Data**: Supabase (Postgres, Auth, RLS)
- **Languages**: TypeScript (primary), JavaScript (shared helpers in `lib/*.js`)

## Setup

```bash
cp .env.example .env
# Add Supabase keys, then run migration SQL in supabase/migrations/

npm install
npm run dev
```

## Scripts

```bash
npm run dev              # all four Next.js apps
npm run dev:frontend     # site only
npm run dev:backend      # public API only
npm run dev:dashboard    # dashboard UI + API
npm run build            # production build all packages
```

## URLs (local dev) — open the website, not the API

| Open this | Do not use for browsing |
|-----------|-------------------------|
| **http://localhost:3050** — main website (Home, Certifications, …) | ~~http://localhost:3001~~ (API only, auto-redirects to site) |
| Footer → **Admin Dashboard** | ~~http://localhost:3002~~ (dashboard API, auto-redirects) |

```bash
npm run dev          # all services
npm run dev:website  # main site only (port 3050)
```

## Demo login

Dashboard: **admin@pms.os** / **admin** (works without Supabase configured).

## License

MIT
