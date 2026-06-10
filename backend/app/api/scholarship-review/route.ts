import { insertFormSubmission } from '@/lib/insert-form-submission';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const {
    email,
    offeringId,
    regionId,
    residenceCountry,
    billingCountry,
    notes,
    website,
    company,
    ...rest
  } = body as Record<string, unknown> & {
    email?: string;
    offeringId?: string;
    regionId?: string;
    residenceCountry?: string;
    billingCountry?: string;
    notes?: string;
    website?: string;
    company?: string;
  };

  return insertFormSubmission(request, {
    source: 'scholarship_review',
    email,
    subject: `Scholarship review: ${offeringId ?? 'general'}`,
    payload: {
      ...rest,
      offeringId,
      regionId,
      residenceCountry,
      billingCountry,
      notes,
    },
    metadata: { type: 'scholarship_review', status: 'pending' },
    website: website as string | undefined,
    company: company as string | undefined,
  });
}
