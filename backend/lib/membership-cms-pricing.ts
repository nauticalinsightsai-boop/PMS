import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import type { MembershipTierId, MembershipBilling } from '@/lib/membership-checkout-price';

type CmsMembershipPricing = {
  professional?: { monthlyUsd?: number; yearlyUsd?: number };
  mastery?: { monthlyUsd?: number; yearlyUsd?: number };
};

/**
 * Read the published membership base USD price for a tier/billing from
 * website_data (membership_page_config). Returns null to fall back to the
 * built-in PRICING when the CMS value is missing or storage is unavailable.
 */
export async function getCmsMembershipUsd(
  tier: MembershipTierId,
  billing: MembershipBilling,
): Promise<number | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabaseAdmin
      .from('website_data')
      .select('content')
      .eq('field_key', 'membership_page_config')
      .eq('is_published', true)
      .maybeSingle();
    if (error || !data) return null;

    const pricing = (data.content as { pricing?: CmsMembershipPricing } | null)?.pricing;
    const row = pricing?.[tier];
    const usd = billing === 'monthly' ? row?.monthlyUsd : row?.yearlyUsd;
    return typeof usd === 'number' && Number.isFinite(usd) && usd > 0 ? usd : null;
  } catch {
    return null;
  }
}
