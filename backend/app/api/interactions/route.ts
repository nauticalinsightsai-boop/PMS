import { insertFormSubmission } from '@/lib/insert-form-submission';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const {
    source = 'contact',
    subject,
    email,
    payload = {},
    metadata = {},
    website = '',
    company = '',
  } = body as {
    source?: string;
    subject?: string;
    email?: string;
    payload?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    website?: string;
    company?: string;
  };

  return insertFormSubmission(request, {
    source,
    subject,
    email,
    payload,
    metadata,
    website,
    company,
  });
}
