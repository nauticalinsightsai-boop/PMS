import { getCatalogue } from '@/lib/regional-catalogue';
import { jsonOk } from '@/lib/response-helpers.js';

export async function GET() {
  const cat = getCatalogue();
  return jsonOk({
    meta: cat.meta,
    offerings: cat.offerings,
    offeringCount: cat.offerings.length,
  });
}
