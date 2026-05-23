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
# Add Supabase keys + DATABASE_URL (for migrations)

npm install
npm run db:migrate          # applies supabase/migrations/*.sql (needs DATABASE_URL)
cp .env.example frontend/.env.local   # or set NEXT_PUBLIC_API_URL=http://localhost:3001
npm run dev
```

## Scripts

```bash
npm run dev              # all four Next.js apps
npm run dev:frontend     # site only
npm run dev:backend      # public API only
npm run dev:dashboard    # dashboard UI + API
npm run build            # production build all packages
npm run import:regional  # Excel matrix → frontend/data/regional-catalogue.json
npm run validate:regional
npm run test:regional    # vitest: 55 offerings, PMP/CAPM/India rules
npm run sync:regional    # optional: JSON → Supabase catalogue_meta (needs DATABASE_URL)
npm run spot-check:india-pmp  # CLI: validate India PMP ₹ prices + membership math
npm run spot-check:checkout-api  # CLI: checkout API 80% membership (needs backend :3001)
npm run qa:regional         # CLI: 55 offerings × 6 regions
npm run verify:regional-dev # spot-check + qa + optional :3000/:3050 + checkout API probes
npm run setup:env           # copy .env.example → .env if missing
```

### Regional pricing matrix

1. Apply DB: `npm run db:migrate` (or run SQL files in Supabase SQL Editor in filename order).
2. Set `NEXT_PUBLIC_API_URL=http://localhost:3001` in `frontend/.env.local` (see `.env.example`).
3. Place `PM_Structure_Regional_Availability_Matrix.xlsx` (or set `REGIONAL_MATRIX_XLSX_PATH`).
4. After Excel edits: `npm run import:regional` → `npm run validate:regional` → commit `frontend/data/regional-catalogue.json`.
5. For live checkout: set `STRIPE_SECRET_KEY` in `backend/.env.local` (mock sessions when unset).
6. Full spec: `docs/REGIONAL_AVAILABILITY_IMPLEMENTATION_PLAN.md`.

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
