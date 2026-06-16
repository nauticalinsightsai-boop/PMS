type SendParams = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

function fromHeader(): { email: string; name: string } {
  return {
    email:
      process.env.ORDER_EMAIL_FROM?.trim() ||
      process.env.AUTH_EMAIL_FROM?.trim() ||
      process.env.SMTP_USER?.trim() ||
      '',
    name:
      process.env.ORDER_EMAIL_FROM_NAME?.trim() ||
      process.env.AUTH_EMAIL_FROM_NAME?.trim() ||
      'PM Structure',
  };
}

async function sendViaSmtp(params: SendParams): Promise<void> {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) throw new Error('SMTP_HOST is not configured');
  const from = fromHeader();
  if (!from.email) throw new Error('AUTH_EMAIL_FROM or SMTP_USER is not configured');

  const nodemailer = await import('nodemailer');
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true';
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER?.trim(),
      pass: process.env.SMTP_PASS?.trim(),
    },
  });

  await transporter.sendMail({
    from: `"${from.name}" <${from.email}>`,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html ?? params.text,
  });
}

export async function sendTransactionalEmail(params: SendParams): Promise<void> {
  await sendViaSmtp(params);
}

export function isTransactionalEmailConfigured(): boolean {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from =
    process.env.ORDER_EMAIL_FROM?.trim() ||
    process.env.AUTH_EMAIL_FROM?.trim() ||
    user;
  return Boolean(host && user && pass && from);
}

export function logTransactionalEmailForDev(to: string, subject: string, text: string): void {
  if (process.env.NODE_ENV !== 'development') return;
  console.log(`\n[order-email] Dev preview for ${to}\nSubject: ${subject}\n${text}\n`);
}
