type SendParams = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

const SMTP_TIMEOUT_MS = 20_000;

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

  const from =
    process.env.RESEND_FROM?.trim() ||
    `${fromHeader().name} <${fromHeader().email || 'onboarding@resend.dev'}>`;

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

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Resend HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
}

export async function sendAuthEmail(params: SendParams): Promise<void> {
  const transport = process.env.AUTH_EMAIL_TRANSPORT?.trim().toLowerCase();
  const attempts: Array<() => Promise<void>> = [];

  if (transport === 'resend') {
    if (isResendConfigured()) attempts.push(() => sendViaResend(params));
    if (isSmtpConfigured()) attempts.push(() => sendViaSmtp(params));
  } else if (transport === 'smtp') {
    if (isSmtpConfigured()) attempts.push(() => sendViaSmtp(params));
    if (isResendConfigured()) attempts.push(() => sendViaResend(params));
  } else {
    if (isSmtpConfigured()) attempts.push(() => sendViaSmtp(params));
    if (isResendConfigured()) attempts.push(() => sendViaResend(params));
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
