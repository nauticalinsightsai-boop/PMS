import { sendAuthEmail, isEmailConfigured } from '@/lib/auth/send-email';
import type { InteractionSource } from '@/lib/interactions/types';

const SOURCE_LABELS: Record<InteractionSource, string> = {
  contact: 'Contact',
  subscription: 'Subscription',
  meeting_booking: 'Meeting / booking',
  documentation_request: 'Documentation',
};

export function resolveInteractionsAdminEmail(): string | null {
  const candidates = [
    process.env.INTERACTIONS_ADMIN_EMAIL,
    process.env.DISCOVERY_CALL_ADMIN_EMAIL,
    process.env.SMTP_USER,
    process.env.AUTH_EMAIL_FROM,
  ];
  for (const raw of candidates) {
    const email = raw?.trim().toLowerCase();
    if (email && email.includes('@')) return email;
  }
  return null;
}

/** Fire-and-forget admin ping when a new lead is stored. Skips engagement booking bridge rows. */
export function scheduleInteractionAdminEmail(params: {
  source: InteractionSource;
  subject: string;
  email: string;
  metadata: Record<string, unknown>;
}): void {
  if (params.metadata.booking_id) return;
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[interactions] Admin email not configured — skipping lead ping', {
        source: params.source,
        email: params.email,
      });
    }
    return;
  }

  const adminTo = resolveInteractionsAdminEmail();
  if (!adminTo) {
    console.warn('[interactions] No admin inbox resolved — set INTERACTIONS_ADMIN_EMAIL or SMTP_USER');
    return;
  }

  const label = SOURCE_LABELS[params.source] ?? params.source;
  const mailSubject = `[New lead] ${params.subject} — ${params.email}`;
  const text = [
    `New ${label} submission`,
    '',
    `Subject: ${params.subject}`,
    `Email: ${params.email}`,
    `Source: ${params.source}`,
    '',
    'View in Interaction Inbox: /admin/dashboard/booking-crm/interactions/inbox',
  ].join('\n');

  void sendAuthEmail({ to: adminTo, subject: mailSubject, text }).catch((err) => {
    console.error('[interactions] Admin lead ping failed', err);
  });
}
