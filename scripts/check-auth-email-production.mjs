#!/usr/bin/env node
/**
 * Diagnose auth email (Resend + SMTP) and probe production forgot-password.
 * Usage:
 *   node scripts/check-auth-email-production.mjs
 *   node scripts/check-auth-email-production.mjs --email=you@example.com
 */
import { loadMonorepoEnv, applyToProcessEnv } from './lib/monorepo-env.mjs';

applyToProcessEnv(loadMonorepoEnv());

const email =
  process.argv.find((a) => a.startsWith('--email='))?.split('=')[1]?.trim() ||
  process.env.DASHBOARD_ADMIN_EMAILS?.split(',')[0]?.trim() ||
  'nauticalinsights.ai@gmail.com';
const base = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://pmstructure.com';

const key = process.env.RESEND_API_KEY?.trim();
const from = process.env.RESEND_FROM?.trim() || 'PM Structure <onboarding@resend.dev>';
const verified = process.env.RESEND_DOMAIN_VERIFIED?.trim().toLowerCase() === 'true';

console.log('=== Auth email check ===\n');
console.log('Recipient:', email);
console.log('RESEND_FROM:', from);
console.log('RESEND_DOMAIN_VERIFIED:', verified);
console.log('SMTP:', process.env.SMTP_HOST ? `${process.env.SMTP_HOST}:${process.env.SMTP_PORT || 587}` : '(unset)');

if (from.includes('@pmstructure.com') && !verified) {
  console.log('\n⚠ RESEND_FROM uses pmstructure.com but domain is not marked verified.');
  console.log('  → Verify at https://resend.com/domains');
  console.log('  → Add DNS records at your registrar (pmstructure.com uses registrar-servers.com)');
  console.log('  → Then set RESEND_DOMAIN_VERIFIED=true and RESEND_FROM=PM Structure <noreply@pmstructure.com>');
}

if (key) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: verified && from.includes('@pmstructure.com') ? from : 'PM Structure <onboarding@resend.dev>',
      to: [email],
      subject: 'PM Structure auth email diagnostic',
      text: `Diagnostic send at ${new Date().toISOString()}`,
    }),
  });
  const body = await res.text();
  console.log('\nResend test:', res.status, body.slice(0, 280));
  if (!res.ok && body.includes('only send testing emails')) {
    console.log('\n✗ Resend test mode blocks this recipient until pmstructure.com is verified.');
  } else if (res.ok) {
    console.log('\n✓ Resend can deliver to this address.');
  }
}

const forgot = await fetch(`${base.replace(/\/$/, '')}/admin/api/auth/forgot-password`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Origin: base.replace(/\/$/, ''),
  },
  body: JSON.stringify({ email }),
}).catch((err) => ({ ok: false, status: 0, json: async () => ({ error: String(err) }) }));

const forgotData = await forgot.json?.().catch?.(() => ({}));
console.log('\nProduction forgot-password:', forgot.status, forgotData);

if (forgot.status === 200) {
  console.log('\n✓ Reset email accepted (check inbox).');
} else {
  console.log('\n✗ Production reset email failed — deploy latest send-email fix + verify Resend domain.');
  process.exit(1);
}
