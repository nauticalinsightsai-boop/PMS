#!/usr/bin/env node
/**
 * Diagnose new-device login OTP email delivery.
 * Usage:
 *   node scripts/check-login-otp.mjs
 *   TEST_ADMIN_PASSWORD='...' node scripts/check-login-otp.mjs --probe-production
 */
import { createClient } from '@supabase/supabase-js';
import { loadMonorepoEnv, applyToProcessEnv } from './lib/monorepo-env.mjs';

applyToProcessEnv(loadMonorepoEnv());

const probeProduction = process.argv.includes('--probe-production');
const adminEmail =
  process.env.DASHBOARD_ADMIN_EMAILS?.split(',')[0]?.trim() || 'nauticalinsights.ai@gmail.com';
const password = process.env.TEST_ADMIN_PASSWORD?.trim();

function cloudEmailReady() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.AUTH_EMAIL_FROM?.trim() || user;
  return Boolean(host && user && pass && from);
}

async function auditSummary() {
  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    db: { schema: 'dashboard_one' },
  });
  const { data: settings } = await db
    .from('login_security_settings')
    .select('email_new_device_login_enabled,sms_new_device_login_enabled')
    .maybeSingle();
  const { data: otpSent } = await db
    .from('auth_audit_log')
    .select('created_at,metadata')
    .eq('event_type', 'login_otp_sent')
    .order('created_at', { ascending: false })
    .limit(3);
  const { count: trustedCount } = await db
    .from('trusted_login_fingerprints')
    .select('id', { count: 'exact', head: true })
    .eq('email', adminEmail);

  return { settings, otpSent, trustedCount: trustedCount ?? 0 };
}

async function probeProductionLogin() {
  if (!password) {
    console.log('\nSkip production probe — set TEST_ADMIN_PASSWORD to test live OTP send.');
    return;
  }
  const base = process.env.PROBE_BASE_URL?.trim() || 'https://pmstructure.com';
  const t0 = Date.now();
  const res = await fetch(`${base}/admin/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: base },
    body: JSON.stringify({ email: adminEmail, password }),
  });
  const json = await res.json().catch(() => ({}));
  const ms = Date.now() - t0;
  console.log(`\nProduction login probe (${ms}ms) HTTP ${res.status}:`);
  console.log(JSON.stringify(json, null, 2));
  if (res.status === 503 && json.error?.includes('OTP')) {
    console.log('\n→ OTP email failed on production — check SMTP_* on Railway and redeploy.');
  } else if (json.requiresOtp && json.otpChannels?.email) {
    console.log('\n→ OTP email send succeeded — check inbox/spam for', adminEmail);
  }
}

async function main() {
  console.log('Login OTP diagnostic\n');
  console.log('Admin email:', adminEmail);
  console.log('Local SMTP:', cloudEmailReady() ? 'configured' : 'missing');
  console.log('Production email ready (SMTP):', cloudEmailReady() ? 'yes (vars in .env.local)' : 'no');

  const { settings, otpSent, trustedCount } = await auditSummary();
  console.log('\nSupabase security settings:');
  console.log('  email_new_device_login_enabled:', settings?.email_new_device_login_enabled);
  console.log('  sms_new_device_login_enabled:', settings?.sms_new_device_login_enabled);
  console.log('  trusted devices for admin:', trustedCount);

  console.log('\nRecent login_otp_sent (production audit):');
  if (!otpSent?.length) console.log('  (none)');
  else for (const row of otpSent) console.log(' ', row.created_at, row.metadata?.otpChannels);

  if (probeProduction) await probeProductionLogin();

  if (!cloudEmailReady()) {
    console.log('\nFix: set SMTP_HOST, SMTP_USER, SMTP_PASS, AUTH_EMAIL_FROM in .env.local');
    console.log('  Gmail on Railway: SMTP_PORT=465, SMTP_SECURE=true, App Password');
    console.log('  npm run apply:railway && npm run railway:setup');
  }
}

main().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
