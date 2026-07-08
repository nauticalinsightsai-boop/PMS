#!/usr/bin/env node
/**
 * Production platform smoke: marketing site, admin, auth, checkout, support chat.
 * Usage: node scripts/production-platform-smoke.mjs [--base=https://pmstructure.com]
 */
const baseArg = process.argv.find((a) => a.startsWith('--base='));
const base = (baseArg?.slice(7) ?? 'https://pmstructure.com').replace(/\/$/, '');

const checks = [];

function record(name, ok, detail, ms) {
  checks.push({ name, ok, detail, ms });
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name} (${ms}ms) — ${detail}`);
}

async function timed(name, fn) {
  const t0 = Date.now();
  try {
    const result = await fn();
    record(name, result.ok, result.detail, Date.now() - t0);
    return result;
  } catch (e) {
    record(name, false, e instanceof Error ? e.message : String(e), Date.now() - t0);
    return { ok: false };
  }
}

async function get(path) {
  const res = await fetch(`${base}${path}`, { redirect: 'follow' });
  return res;
}

async function post(path, body, headers = {}) {
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { res, json };
}

console.log(`production-platform-smoke: ${base}\n`);

await timed('site_home', async () => {
  const res = await get('/');
  return { ok: res.status === 200, detail: `HTTP ${res.status}` };
});

await timed('admin_login_page', async () => {
  const res = await get('/admin/login');
  return { ok: res.status === 200, detail: `HTTP ${res.status}` };
});

await timed('admin_dashboard_page', async () => {
  const res = await get('/admin/dashboard');
  return { ok: res.status === 200, detail: `HTTP ${res.status}` };
});

await timed('stripe_publishable_key', async () => {
  const res = await get('/config/stripe');
  const json = await res.json().catch(() => ({}));
  const key = json.publishableKey ?? '';
  const ok = res.status === 200 && key.startsWith('pk_');
  return { ok, detail: ok ? `${key.slice(0, 12)}…` : JSON.stringify(json) };
});

await timed('auth_session_unauthorized', async () => {
  const res = await get('/admin/api/auth/session');
  const json = await res.json().catch(() => ({}));
  const ok = res.status === 401 && json.error === 'Unauthorized';
  return { ok, detail: `HTTP ${res.status}` };
});

await timed('auth_login_rejects_bad_password', async () => {
  const { res, json } = await post(
    '/admin/api/auth/login',
    { email: 'nauticalinsights.ai@gmail.com', password: 'wrong-password-smoke' },
    { Origin: base },
  );
  const ok = res.status === 401 && json.error === 'Invalid email or password';
  return { ok, detail: `HTTP ${res.status}` };
});

await timed('support_chat_llm', async () => {
  const { res, json } = await post('/api/support/chat', {
    messages: [{ role: 'user', content: 'What is PMP in one sentence?' }],
  });
  const ok = res.status === 200 && typeof json.reply === 'string' && json.reply.length > 10;
  const badLocalhost = json.reply?.includes('localhost');
  return {
    ok: ok && !badLocalhost,
    detail: badLocalhost
      ? 'reply contains localhost URL'
      : ok
        ? `reply ${json.reply.length} chars`
        : JSON.stringify(json).slice(0, 120),
  };
});

await timed('checkout_seat_deposit_route', async () => {
  const res = await fetch(`${base}/api/checkout/seat-deposit`, { method: 'GET' });
  const ok = res.status === 405;
  return { ok, detail: `HTTP ${res.status} (405 = route exists)` };
});

await timed('form_submission', async () => {
  const stamp = Date.now();
  const { res, json } = await post('/api/interactions', {
    source: 'contact',
    subject: `Platform smoke ${stamp}`,
    email: `platform-smoke+${stamp}@pmstructure.com`,
    payload: {
      formId: 'platform_smoke',
      formLabel: 'Platform smoke',
      placement: 'production_smoke',
      pagePath: '/contact',
      fullName: 'Platform Smoke',
      message: 'Automated production verification',
    },
  });
  const ok = res.status === 201 && json.success === true && json.id;
  const sheets =
    json.sheetsSynced === true
      ? 'sheets synced'
      : json.sheetsSyncPending === true
        ? 'sheets pending'
        : 'sheets NOT configured';
  return { ok, detail: `id=${json.id ?? 'n/a'} ${sheets}` };
});

const failed = checks.filter((c) => !c.ok);
const sheetsCheck = checks.find((c) => c.name === 'form_submission');
const sheetsOk =
  sheetsCheck?.detail?.includes('sheets synced') || sheetsCheck?.detail?.includes('sheets pending');

console.log('\n--- summary ---');
console.log(`passed: ${checks.length - failed.length}/${checks.length}`);
if (sheetsCheck && !sheetsOk) {
  console.log('WARN  Google Sheets not configured on production — set GOOGLE_SHEETS_* on Railway and redeploy');
}
if (failed.length) {
  console.log('failed:', failed.map((f) => f.name).join(', '));
  process.exit(1);
}
