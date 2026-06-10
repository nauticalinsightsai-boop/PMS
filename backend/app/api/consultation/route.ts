import { insertFormSubmission } from '@/lib/insert-form-submission';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const {
    email,
    offeringId,
    regionId,
    name,
    message,
    topic,
    website,
    company,
    ...rest
  } = body as Record<string, unknown> & {
    email?: string;
    offeringId?: string;
    regionId?: string;
    name?: string;
    message?: string;
    topic?: string;
    website?: string;
    company?: string;
  };

  const payload = {
    ...rest,
    offeringId,
    regionId,
    name,
    message,
    topic,
  };

  return insertFormSubmission(request, {
    source: 'consultation',
    email,
    subject: (topic as string) ?? `Consultation: ${offeringId ?? 'pathway'}`,
    payload,
    metadata: { type: 'consultation', approvalStatus: 'pending' },
    website: website as string | undefined,
    company: company as string | undefined,
  });
}
