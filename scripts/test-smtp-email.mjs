#!/usr/bin/env node
/**
 * Send a test email via SMTP (same path as login OTP).
 * Usage: node scripts/test-smtp-email.mjs [to@email.com]
 */
import nodemailer from 'nodemailer';
import { loadMonorepoEnv, applyToProcessEnv } from './lib/monorepo-env.mjs';

applyToProcessEnv(loadMonorepoEnv());

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const to =
  args[0]?.trim() ||
  process.env.AUTH_EMAIL_FROM?.trim() ||
  process.env.SMTP_USER?.trim();

const host = process.env.SMTP_HOST?.trim();
const user = process.env.SMTP_USER?.trim();
const pass = process.env.SMTP_PASS?.trim();
const from = process.env.AUTH_EMAIL_FROM?.trim() || user;
const fromName = process.env.AUTH_EMAIL_FROM_NAME?.trim() || 'PM Structure';

if (!host || !user || !pass || !from) {
  console.error('SMTP_HOST, SMTP_USER, SMTP_PASS, AUTH_EMAIL_FROM required in .env.local');
  process.exit(1);
}

const simulateCloud = process.argv.includes('--cloud');
if (simulateCloud) {
  process.env.RAILWAY_ENVIRONMENT = 'production';
}

const envPort = process.env.SMTP_PORT?.trim();
const isGmail = /gmail\.com$/i.test(host) || host === 'smtp.gmail.com';
const port = envPort ? Number(envPort) : simulateCloud && isGmail ? 465 : 587;
const secure = process.env.SMTP_SECURE === 'true' || port === 465;

const t0 = Date.now();
const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass },
  connectionTimeout: 20_000,
  greetingTimeout: 20_000,
  socketTimeout: 20_000,
  pool: false,
  ...(secure ? {} : { requireTLS: true }),
});

try {
  await transporter.sendMail({
    from: `"${fromName}" <${from}>`,
    to,
    subject: 'PM Structure SMTP test (OTP path)',
    text: `Test code 123456 — ${new Date().toISOString()}\nCloud simulation: ${simulateCloud}`,
  });
  console.log(`OK — SMTP sent to ${to} in ${Date.now() - t0}ms (${host}:${port} secure=${secure})`);
} catch (e) {
  console.error(`FAIL (${Date.now() - t0}ms):`, e instanceof Error ? e.message : e);
  process.exit(1);
}
