/**
 * Send a test email via SMTP.
 *
 * Usage:
 *   node scripts/test-smtp.mjs
 *   node scripts/test-smtp.mjs you@example.com
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { loadMonorepoEnv, applyToProcessEnv } from './lib/monorepo-env.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

applyToProcessEnv(loadMonorepoEnv());

const to =
  process.argv[2]?.trim() ||
  process.env.DASHBOARD_ADMIN_EMAILS?.split(',')[0]?.trim() ||
  process.env.SMTP_USER?.trim();

if (!to) {
  console.error('Usage: node scripts/test-smtp.mjs you@example.com');
  process.exit(1);
}

const smtpHost = process.env.SMTP_HOST?.trim();
const fromEmail = process.env.AUTH_EMAIL_FROM?.trim() || process.env.SMTP_USER?.trim();
const fromName = process.env.AUTH_EMAIL_FROM_NAME?.trim() || 'PM Structure';
const subject = 'PM Structure: email test';
const text = 'If you received this, SMTP email (OTP + password reset + order confirmations) is configured correctly.';

if (!smtpHost || !fromEmail || !process.env.SMTP_USER?.trim() || !process.env.SMTP_PASS?.trim()) {
  console.error('Set SMTP_HOST, SMTP_USER, SMTP_PASS, and AUTH_EMAIL_FROM in repo root .env.local first.');
  process.exit(1);
}

try {
  const nodemailer = await import('nodemailer');
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true';
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER.trim(),
      pass: process.env.SMTP_PASS.trim(),
    },
  });
  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    text,
    html: `<p>${text}</p>`,
  });
  console.log(`SMTP test email sent to ${to} via ${smtpHost}:${port}`);
} catch (err) {
  console.error('Send failed:', err instanceof Error ? err.message : err);
  process.exit(1);
}
