import { normalizeScholarshipMarket } from '@/lib/scholarship-core';
import { resolveScholarshipRouteIdentity } from '@/lib/scholarship-pricing';
import { recordScholarshipEvent } from '@/lib/scholarship-store';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const eventName = body.eventName;
    const offeringId = typeof body.offeringId === 'string' ? body.offeringId : '';
    const siteCertId = typeof body.siteCertId === 'string' ? body.siteCertId.toLowerCase() : '';
    const tierSlug = typeof body.tierSlug === 'string' ? body.tierSlug.toLowerCase() : '';
    const market = normalizeScholarshipMarket(typeof body.market === 'string' ? body.market : '');
    if (eventName !== 'scholarship_page_view' || !market) {
      return Response.json({ error: 'Invalid scholarship event.' }, { status: 400 });
    }
    if (!resolveScholarshipRouteIdentity({ offeringId, siteCertId, tierSlug, market })) {
      return Response.json({ error: 'Unsupported scholarship route.' }, { status: 404 });
    }
    await recordScholarshipEvent({ eventName, offeringId, market });
    return Response.json({ recorded: true });
  } catch (error) {
    console.error('[scholarship/events] event write failed', error);
    return Response.json({ error: 'Event service unavailable.' }, { status: 503 });
  }
}
