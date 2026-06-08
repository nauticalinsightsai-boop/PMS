/**
 * Send a test email via SMTP (or Resend if SMTP_HOST unset).
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
const resendKey = process.env.RESEND_API_KEY?.trim();
const fromEmail = process.env.AUTH_EMAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || 'onboarding@resend.dev';
const fromName = process.env.AUTH_EMAIL_FROM_NAME?.trim() || 'PM Structure';
const subject = 'PM Structure — email test';
const text = 'If you received this, dashboard auth email (OTP + password reset) is configured correctly.';

if (!smtpHost && !resendKey) {
  console.error('Set SMTP_HOST (or RESEND_API_KEY) in repo root .env.local first.');
  process.exit(1);
}

try {
  if (smtpHost) {
    const nodemailer = await import('nodemailer');
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = process.env.SMTP_SECURE === 'true';
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER?.trim(),
        pass: process.env.SMTP_PASS?.trim(),
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
  } else {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [to],
        subject,
        text,
        html: `<p>${text}</p>`,
      }),
    });
    if (!res.ok) {
      throw new Error(`Resend failed (${res.status}): ${await res.text()}`);
    }
    console.log(`Resend test email sent to ${to}`);
  }
} catch (err) {
  console.error('Send failed:', err instanceof Error ? err.message : err);
  process.exit(1);
}
