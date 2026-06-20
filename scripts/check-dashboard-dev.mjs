/**
 * Pre-flight check for local dashboard development.
 * Usage: npm run check:dashboard-dev
 */
import { loadMonorepoEnv } from './lib/monorepo-env.mjs';

const env = loadMonorepoEnv();

function isMissing(val) {
  const s = val?.trim() ?? '';
  return !s || s.includes('placeholder');
}

const issues = [];

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
if (isMissing(supabaseUrl)) {
  issues.push('SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is empty in repo root .env.local');
}
if (isMissing(env.SUPABASE_SERVICE_ROLE_KEY)) {
  issues.push('SUPABASE_SERVICE_ROLE_KEY is empty in repo root .env.local');
}
if (isMissing(env.AUTH_SESSION_SECRET)) {
  issues.push('AUTH_SESSION_SECRET is empty in repo root .env.local');
}

async function probeDashboardApi() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch('http://localhost:3002/api/auth/session', { signal: ctrl.signal });
    return { reachable: true, status: res.status };
  } catch {
    return { reachable: false, status: 0 };
  } finally {
    clearTimeout(timer);
  }
}

console.log('=== Dashboard dev check ===\n');

if (issues.length === 0) {
  console.log('✓ Required env vars present (Supabase URL, service role key, AUTH_SESSION_SECRET)\n');
} else {
  console.log('✗ Missing or empty configuration:\n');
  for (const issue of issues) {
    console.log(`  • ${issue}`);
  }
  console.log(`
Fix:
  1. Open repo root .env.local and set real values from your Supabase project
     (Dashboard → Settings → API: Project URL, anon key, service_role key).
  2. Set AUTH_SESSION_SECRET to a long random string (e.g. openssl rand -hex 32).
  3. Run: npm run db:setup   (or npm run db:migrate) if tables are missing.
`);
}

const api = await probeDashboardApi();
if (api.reachable) {
  console.log(`✓ Dashboard API reachable at http://localhost:3002 (HTTP ${api.status})`);
} else {
  console.log('○ Dashboard API not running on http://localhost:3002 (optional until you use the admin UI)');
  console.log('  Start full stack: npm run dev');
  console.log('  Or dashboard only: npm run dev:dashboard');
  console.log('  Then open: http://localhost:3000/admin\n');
}

if (issues.length > 0) {
  console.log('Data endpoints will return 503 "Database not configured" until Supabase vars are set.\n');
  process.exit(1);
}

console.log('\nDashboard dev environment looks ready.\n');
