import { verifyRegion } from '@/lib/verify-region';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { jsonError, jsonOk } from '@/lib/response-helpers.js';
import type { RegionId } from '@/lib/regional-catalogue';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { regionId, residenceCountry, billingCountry, gccCountry, userId } = body as {
    regionId?: RegionId;
    residenceCountry?: string;
    billingCountry?: string;
    gccCountry?: string | null;
    userId?: string | null;
  };

  if (!regionId || !residenceCountry || !billingCountry) {
    return jsonError('regionId, residenceCountry, and billingCountry are required', 400);
  }

  const forwarded = request.headers.get('x-forwarded-for');
  const clientIp = forwarded?.split(',')[0]?.trim() ?? null;

  const result = verifyRegion({
    regionId,
    residenceCountry,
    billingCountry,
    gccCountry,
    clientIp,
  });

  if (isSupabaseConfigured) {
    await supabaseAdmin.from('verification_logs').insert({
      user_id: userId ?? null,
      region_id: regionId,
      residence_country: residenceCountry,
      billing_country: billingCountry,
      verified: result.verified,
      payload: { gccCountry, clientIp, scholarshipEligible: result.scholarshipEligible, mismatch: result.mismatch },
    });
  }

  return jsonOk({ result });
}
