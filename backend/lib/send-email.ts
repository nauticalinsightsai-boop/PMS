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
      'onboarding@resend.dev',
    name:
      process.env.ORDER_EMAIL_FROM_NAME?.trim() ||
      process.env.AUTH_EMAIL_FROM_NAME?.trim() ||
      'PM Structure',
  };
}

async function sendViaResend(params: SendParams): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) throw new Error('RESEND_API_KEY is not configured');
  const from = fromHeader();
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${from.name} <${from.email}>`,
      to: [params.to],
      subject: params.subject,
      text: params.text,
      html: params.html ?? `<p>${params.text}</p>`,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend failed (${res.status}): ${body}`);
  }
}

export async function sendTransactionalEmail(params: SendParams): Promise<void> {
  await sendViaResend(params);
}

export function isTransactionalEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function logTransactionalEmailForDev(to: string, subject: string, text: string): void {
  if (process.env.NODE_ENV !== 'development') return;
  console.log(`\n[order-email] Dev preview for ${to}\nSubject: ${subject}\n${text}\n`);
}
