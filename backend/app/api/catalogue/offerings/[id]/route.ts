import { getOfferingById } from '@/lib/regional-catalogue';
import { jsonError, jsonOk } from '@/lib/response-helpers.js';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const offering = getOfferingById(id);
  if (!offering) return jsonError('Offering not found', 404);
  return jsonOk({ offering });
}
