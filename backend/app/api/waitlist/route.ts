import { insertFormSubmission } from '@/lib/insert-form-submission';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { email, offeringId, regionId, message, website, company, ...rest } = body as Record<
    string,
    unknown
  > & {
    email?: string;
    offeringId?: string;
    regionId?: string;
    message?: string;
    website?: string;
    company?: string;
  };

  return insertFormSubmission(request, {
    source: 'waitlist',
    email,
    subject: `Waitlist: ${offeringId ?? 'general'}`,
    payload: { ...rest, offeringId, regionId, message },
    metadata: { type: 'waitlist' },
    website: website as string | undefined,
    company: company as string | undefined,
  });
}
