import type { Interaction } from '@/services/InteractionService';

export type NewsletterSubscriberStatus = 'active' | 'inactive';

export type NewsletterSubscriber = {
  id: string;
  email: string;
  createdAt: string;
  source: string;
  status: NewsletterSubscriberStatus;
};

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

/** Derive signup location (e.g. footer, newsletter page) from payload/metadata. */
export function subscriberSignupSource(row: Interaction): string {
  const payload = row.payload ?? {};
  const metadata = row.metadata ?? {};

  return (
    readString(payload.signupSource) ??
    readString(payload.formLocation) ??
    readString(payload.origin) ??
    readString(metadata.signupSource) ??
    readString(metadata.formLocation) ??
    readString(metadata.origin) ??
    readString(metadata.page) ??
    'website'
  );
}

export function subscriberStatus(row: Interaction): NewsletterSubscriberStatus {
  const status =
    readString(row.metadata?.status)?.toLowerCase() ??
    readString(row.payload?.status)?.toLowerCase();

  if (status === 'inactive' || status === 'unsubscribed') {
    return 'inactive';
  }
  return 'active';
}

export function toNewsletterSubscriber(row: Interaction): NewsletterSubscriber {
  return {
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
    source: subscriberSignupSource(row),
    status: subscriberStatus(row),
  };
}
