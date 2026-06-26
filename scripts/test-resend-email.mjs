#!/usr/bin/env node
/**
 * Send a test email via Resend (validates RESEND_API_KEY before Railway deploy).
 * Usage: node scripts/test-resend-email.mjs [to@email.com]
 */
import { loadMonorepoEnv, applyToProcessEnv } from './lib/monorepo-env.mjs';

applyToProcessEnv(loadMonorepoEnv());

const key = process.env.RESEND_API_KEY?.trim();
const to = process.argv[2]?.trim() || process.env.SMTP_USER?.trim() || process.env.DASHBOARD_ADMIN_EMAILS?.split(',')[0]?.trim();

if (!key) {
  console.error('RESEND_API_KEY missing — add to .env.local');
  process.exit(1);
}
if (!to) {
  console.error('Pass recipient: node scripts/test-resend-email.mjs you@example.com');
  process.exit(1);
}

const from =
  process.env.RESEND_FROM?.trim() || 'PM Structure <onboarding@resend.dev>';

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from,
    to: [to],
    subject: 'PM Structure Resend test',
    text: `Resend is configured. Time: ${new Date().toISOString()}`,
  }),
});

const body = await res.text();
if (!res.ok) {
  console.error(`Resend failed HTTP ${res.status}:`, body.slice(0, 500));
  process.exit(1);
}

console.log('OK — test email sent to', to);
console.log(body);
