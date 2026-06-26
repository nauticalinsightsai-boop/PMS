type SendParams = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

const SMTP_TIMEOUT_MS = 30_000;
const RESEND_DEV_FROM = 'PM Structure <onboarding@resend.dev>';

function isCloudRuntime(): boolean {
  return Boolean(
    process.env.RAILWAY_ENVIRONMENT ||
      process.env.RAILWAY_SERVICE_ID ||
      process.env.RAILWAY_PROJECT_ID ||
      process.env.VERCEL ||
      process.env.FLY_APP_NAME,
  );
}

function fromHeader(): { email: string; name: string } {
  return {
    email: process.env.AUTH_EMAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || '',
    name: process.env.AUTH_EMAIL_FROM_NAME?.trim() || 'PM Structure',
  };
}

function isSmtpConfigured(): boolean {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.AUTH_EMAIL_FROM?.trim() || user;
  return Boolean(host && user && pass && from);
}

function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function resendDomainVerified(): boolean {
  return process.env.RESEND_DOMAIN_VERIFIED?.trim().toLowerCase() === 'true';
}

/** Gmail on cloud hosts: port 465 + SSL is more reliable than 587 STARTTLS. */
function smtpTransportOptions(): { host: string; port: number; secure: boolean } {
  const host = process.env.SMTP_HOST?.trim() ?? '';
  const envPort = process.env.SMTP_PORT?.trim();
  const envSecure = process.env.SMTP_SECURE?.trim();

  if (envPort) {
    return {
      host,
      port: Number(envPort),
      secure: envSecure === 'true' || envPort === '465',
    };
  }

  const isGmail = /gmail\.com$/i.test(host) || host === 'smtp.gmail.com';
  if (isCloudRuntime() && isGmail) {
    return { host, port: 465, secure: true };
  }

  return { host, port: 587, secure: envSecure === 'true' };
}

function resendFromCandidates(): string[] {
  const custom = process.env.RESEND_FROM?.trim();
  const candidates: string[] = [];

  if (custom && (resendDomainVerified() || !custom.includes('@pmstructure.com'))) {
    candidates.push(custom);
  } else if (custom) {
    console.warn(
      '[send-email] RESEND_FROM uses pmstructure.com but RESEND_DOMAIN_VERIFIED is not true — using Resend sandbox sender first',
    );
  }

  candidates.push(RESEND_DEV_FROM);

  if (!isCloudRuntime()) {
    const local = fromHeader();
    if (local.email) candidates.push(`${local.name} <${local.email}>`);
  }

  return [...new Set(candidates)];
}

function resendRecipientHint(body: string): string | null {
  if (body.includes('only send testing emails to your own email address')) {
    return 'Resend is in test mode: verify pmstructure.com at resend.com/domains, set RESEND_DOMAIN_VERIFIED=true, then use noreply@pmstructure.com as the sender.';
  }
  if (body.includes('domain is not verified')) {
    return 'Verify pmstructure.com in the Resend dashboard and add the DNS records at your domain registrar.';
  }
  return null;
}

async function sendViaSmtp(params: SendParams): Promise<void> {
  const from = fromHeader();
  if (!from.email) throw new Error('AUTH_EMAIL_FROM or SMTP_USER is not configured');

  const { host, port, secure } = smtpTransportOptions();
  if (!host) throw new Error('SMTP_HOST is not configured');

  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER?.trim(),
      pass: process.env.SMTP_PASS?.trim(),
    },
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
    pool: false,
    family: 4,
    ...(secure ? {} : { requireTLS: true }),
  });

  await transporter.sendMail({
    from: `"${from.name}" <${from.email}>`,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html ?? params.text,
  });
}

async function sendViaResend(params: SendParams): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) throw new Error('RESEND_API_KEY is not configured');

  const candidates = resendFromCandidates();
  let lastError = '';

  for (const from of candidates) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        subject: params.subject,
        text: params.text,
        html: params.html ?? params.text,
      }),
      signal: AbortSignal.timeout(SMTP_TIMEOUT_MS),
    });

    if (res.ok) return;

    const body = await res.text().catch(() => '');
    lastError = `Resend HTTP ${res.status}: ${body.slice(0, 300)}`;
    const hint = resendRecipientHint(body);
    if (hint) lastError = `${lastError} — ${hint}`;

    const retryFrom =
      res.status === 403 &&
      (body.includes('domain is not verified') ||
        body.includes('not verified') ||
        body.includes('validation_error'));

    if (retryFrom && from !== candidates[candidates.length - 1]) {
      console.error('[send-email] Resend rejected sender, trying fallback:', from);
      continue;
    }

    throw new Error(lastError);
  }

  throw new Error(lastError || 'Resend send failed');
}

export async function sendAuthEmail(params: SendParams): Promise<void> {
  const transport = process.env.AUTH_EMAIL_TRANSPORT?.trim().toLowerCase();
  const onCloud = isCloudRuntime();
  const attempts: Array<() => Promise<void>> = [];

  const smtpOk = isSmtpConfigured();
  const resendOk = isResendConfigured();
  const resendReady = resendOk && (resendDomainVerified() || !onCloud);

  if (transport === 'smtp') {
    if (smtpOk) attempts.push(() => sendViaSmtp(params));
  } else if (transport === 'resend') {
    if (resendOk) attempts.push(() => sendViaResend(params));
    if (smtpOk) attempts.push(() => sendViaSmtp(params));
  } else if (onCloud && resendReady) {
    attempts.push(() => sendViaResend(params));
    if (smtpOk) attempts.push(() => sendViaSmtp(params));
  } else {
    if (smtpOk) attempts.push(() => sendViaSmtp(params));
    if (resendOk) attempts.push(() => sendViaResend(params));
  }

  if (!attempts.length) {
    throw new Error('Email is not configured (set SMTP_HOST/SMTP_USER/SMTP_PASS or RESEND_API_KEY)');
  }

  const errors: string[] = [];
  for (const attempt of attempts) {
    try {
      await attempt();
      return;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(msg);
      console.error('[send-email]', msg);
    }
  }

  throw new Error(`Could not send email (${errors.join(' | ')})`);
}

export function isEmailConfigured(): boolean {
  return isSmtpConfigured() || isResendConfigured();
}

function shouldLogAuthEmailInDev(): boolean {
  return (
    process.env.NODE_ENV === 'development' &&
    (process.env.AUTH_DEV_LOG_RESET_LINK === 'true' || process.env.AUTH_DEV_LOG_OTP === 'true')
  );
}

export async function sendPasswordResetEmail(to: string, link: string): Promise<void> {
  const subject = 'Reset your PM Structure dashboard password';
  const text = `Use this link to reset your password (valid 1 hour):\n\n${link}\n\nIf you did not request this, ignore this email.`;
  const html = `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
  <p style="margin:0 0 16px;font-size:15px;color:#334155">Reset your PM Structure dashboard password:</p>
  <p style="margin:0 0 20px"><a href="${link}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:12px">Reset password</a></p>
  <p style="margin:0 0 12px;font-size:13px;color:#64748b">This link expires in 1 hour. If the button does not work, copy and paste this URL:</p>
  <p style="margin:0;font-size:12px;word-break:break-all;color:#64748b">${link}</p>
</div>`;
  await sendAuthEmail({ to, subject, text, html });
}

/** Login OTP: plain text + simple HTML for inbox clients. */
export async function sendLoginOtpEmail(to: string, code: string): Promise<void> {
  const subject = 'Your PM Structure login code';
  const text = `Your verification code is ${code}. It expires in 10 minutes.\n\nIf you did not try to sign in, ignore this email.`;
  const html = `<div style="font-family:system-ui,sans-serif;max-width:420px;margin:0 auto;padding:24px">
  <p style="margin:0 0 16px;font-size:15px;color:#334155">Use this code to finish signing in to the PM Structure dashboard:</p>
  <p style="margin:0 0 20px;font-size:32px;font-weight:700;letter-spacing:0.25em;color:#0f172a">${code}</p>
  <p style="margin:0;font-size:13px;color:#64748b">Expires in 10 minutes. If you did not request this, you can ignore this email.</p>
</div>`;
  await sendAuthEmail({ to, subject, text, html });
}

export function logLoginOtpForDev(email: string, code: string): void {
  if (!shouldLogAuthEmailInDev()) return;
  console.log(`\n[login-otp] Dev OTP for ${email}: ${code}\n`);
}
