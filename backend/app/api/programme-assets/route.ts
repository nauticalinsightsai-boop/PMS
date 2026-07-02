import { fetchPublishedProgrammeAssets } from '@/lib/cms/fetch-published-programme-assets';
import { jsonError } from '@/lib/response-helpers.js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siteCertId = searchParams.get('siteCertId')?.trim();
  const offeringId = searchParams.get('offeringId')?.trim();

  if (!siteCertId || !offeringId) {
    return jsonError('siteCertId and offeringId are required', 400);
  }

  const assets = await fetchPublishedProgrammeAssets(siteCertId, offeringId);

  return Response.json(
    { assets: assets ?? {} },
    {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    },
  );
}
