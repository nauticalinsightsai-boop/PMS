import {
  FIELD_KEYS,
  certificationsRegistrySchema,
  type ProgrammeOfferingAssets,
} from '@pms/site-content';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';

/** Published CMS programme assets for one offering (video, PDFs, roadmap). */
export async function fetchPublishedProgrammeAssets(
  siteCertId: string,
  offeringId: string,
): Promise<ProgrammeOfferingAssets | null> {
  if (!isSupabaseConfigured || !siteCertId.trim() || !offeringId.trim()) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from('website_data')
    .select('content')
    .eq('field_key', FIELD_KEYS.CERTIFICATIONS_REGISTRY)
    .eq('is_published', true)
    .maybeSingle();

  if (error || !data?.content) return null;

  const parsed = certificationsRegistrySchema.safeParse(data.content);
  if (!parsed.success) return null;

  const entry = parsed.data.entries.find((e) => e.id === siteCertId && !e.archived);
  return entry?.programmeAssets?.[offeringId] ?? null;
}
