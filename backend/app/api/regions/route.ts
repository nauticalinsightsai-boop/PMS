import { getCatalogue } from '@/lib/regional-catalogue';
import { jsonOk } from '@/lib/response-helpers.js';

export async function GET() {
  const { regions, regionIds, websiteCopy } = getCatalogue();
  return jsonOk({ regions, regionIds, websiteCopy });
}
