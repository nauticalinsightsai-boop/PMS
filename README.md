# PMS

Project Management certification platform: **Next.js** monorepo (TypeScript + JavaScript).

## Structure

| Package | Stack | Internal port (dev) |
|---------|--------|----------------------|
| **Dev gateway** (`npm run dev`) | Routes all traffic | **3000** (use this in the browser) |
| `frontend/` | Next.js 15, public site | 3050 |
| `backend/` | Next.js 15 API routes | 3001 |
| `dashboard/frontend/` | Next.js 15 admin UI | 5174 |
| `dashboard/backend/` | Next.js 15 dashboard API | 3002 |
| `supabase/migrations/` | Postgres schema | - |

## Tech

- **UI**: React 19, Tailwind CSS v4, shadcn/ui, Motion
- **Data**: Supabase (Postgres, Auth, RLS)
- **Languages**: TypeScript (primary), JavaScript (shared helpers in `lib/*.js`)

## Setup

```bash
cp .env.example .env.local
# Add Supabase keys + DATABASE_URL + auth secrets (one file for the whole monorepo)

npm install
npm run env:link          # merge app env files → root .env.local + symlink all apps
npm run db:migrate        # applies supabase/migrations/*.sql (needs DATABASE_URL)
npm run dev
```

**One env file locally:** edit **repo root `.env.local` only**: no `.env.local` in `frontend/`, `backend/`, or `dashboard/*`. All apps load it via `next.config.ts`. Run `npm run env:link` once to remove old per-folder copies. On Vercel, set vars per project: see `docs/DEPLOYMENT_VERCEL.md`.

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
npm run verify:regional-dev # spot-check + qa + optional :3000 + checkout API probes
npm run setup:env           # copy .env.example → .env if missing
```

### Regional pricing matrix

1. Apply DB: `npm run db:migrate` (or run SQL files in Supabase SQL Editor in filename order).
2. Set `NEXT_PUBLIC_API_URL=http://localhost:3000` in `frontend/.env.local` (see `.env.example`; gateway proxies to API on :3001).
3. Place `PM_Structure_Regional_Availability_Matrix.xlsx` (or set `REGIONAL_MATRIX_XLSX_PATH`).
4. After Excel edits: `npm run import:regional` → `npm run validate:regional` → commit `frontend/data/regional-catalogue.json`.
5. Checkout records enrollment requests in Supabase: no card payment integration.
6. Full spec: `docs/REGIONAL_AVAILABILITY_IMPLEMENTATION_PLAN.md`.

## URLs (local dev)

Use **http://localhost:3000** for everything in the browser (`npm run dev` starts the gateway plus all apps):

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Main website |
| http://localhost:3000/admin | Admin login & dashboard |
| http://localhost:3000/admin/login | Admin sign-in |
| http://localhost:3000/go/[channel] | Booking CRM channel portals |

Do not browse internal ports (3050, 5174, 3001, 3002) directly: they are proxied through :3000.

## Production (Vercel)

Admin lives at **`/admin`** on the main domain (e.g. `https://pmstructure.com/admin/login`). The marketing app rewrites that path to separately deployed dashboard services.

Full setup: **`docs/DEPLOYMENT_VERCEL.md`**.

```bash
npm run dev          # gateway + all services
npm run dev:website  # marketing site only (still use :3000 if gateway is running)
```

## Demo login

Dashboard: **admin@pms.os** / **admin** (works without Supabase configured).

## License

MIT
