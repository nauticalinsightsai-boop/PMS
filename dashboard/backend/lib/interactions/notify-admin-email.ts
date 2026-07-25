import { sendAuthEmail, isEmailConfigured } from '@/lib/auth/send-email';
import { FORM_SOURCE_LABELS } from '@/lib/interactions/types';
import type { InteractionSource } from '@/lib/interactions/types';

type InteractionAdminEmailParams = {
  source: InteractionSource;
  subject: string;
  email: string;
  metadata: Record<string, unknown>;
  idempotencyKey?: string;
};

export type InteractionAdminEmailResult =
  | { delivered: true; error: null }
  | { delivered: false; error: string };

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

/** Deliver an admin ping and return an operations-safe result. */
export async function sendInteractionAdminEmail(
  params: InteractionAdminEmailParams,
): Promise<InteractionAdminEmailResult> {
  if (params.metadata.booking_id) {
    return { delivered: false, error: 'booking_bridge_notification_skipped' };
  }
  if (!isEmailConfigured()) {
    return { delivered: false, error: 'admin_email_not_configured' };
  }

  const adminTo = resolveInteractionsAdminEmail();
  if (!adminTo) {
    return { delivered: false, error: 'admin_email_recipient_not_configured' };
  }

  const label = FORM_SOURCE_LABELS[params.source] ?? params.source;
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

  try {
    await sendAuthEmail({
      to: adminTo,
      subject: mailSubject,
      text,
      idempotencyKey: params.idempotencyKey,
    });
    return { delivered: true, error: null };
  } catch {
    return { delivered: false, error: 'admin_email_delivery_failed' };
  }
}

/** Compatibility fire-and-forget wrapper for non-outbox callers. */
export function scheduleInteractionAdminEmail(
  params: InteractionAdminEmailParams,
): void {
  void sendInteractionAdminEmail(params);
}
