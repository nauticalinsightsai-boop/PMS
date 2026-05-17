# PMS

The Future of Project Leadership — certification pathways, premium resources, and a global PM community.

## Monorepo structure

| Path | Description | Port |
|------|-------------|------|
| `frontend/` | Public marketing website (React + Vite) | 5173 |
| `backend/` | Public API (Express) — form submissions, health | 3001 |
| `dashboard/frontend/` | Admin dashboard (React + Vite) | 5174 |
| `dashboard/backend/` | Dashboard API (Express) — interactions inbox, export | 3002 |
| `supabase/migrations/` | Postgres schema (website_data, form_submissions) | — |

## Tech stack

- **Frontend**: React 19, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express, TypeScript
- **Database**: Supabase (Postgres + Auth + RLS)

## Getting started

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in `SUPABASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` from your [Supabase](https://supabase.com) project.

2. Apply database migrations (Supabase SQL editor or CLI):

   ```bash
   # Run supabase/migrations/20240517000000_initial_schema.sql in your project
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run everything:

   ```bash
   npm run dev
   ```

   Or run individually:

   ```bash
   npm run dev:backend      # API :3001
   npm run dev:frontend     # Site :5173
   npm run dev:dashboard    # Dashboard UI :5174 + API :3002
   ```

## Demo dashboard login

Without Supabase configured, use **admin@pms.os** / **admin** on the dashboard (`http://localhost:5174`).

## License

MIT
