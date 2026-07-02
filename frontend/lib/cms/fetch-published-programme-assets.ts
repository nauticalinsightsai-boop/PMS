import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  FIELD_KEYS,
  certificationsRegistrySchema,
  type ProgrammeOfferingAssets,
} from '@pms/site-content';

function websiteDataClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (url && serviceRole && !serviceRole.includes('placeholder')) {
    return createClient(url, serviceRole, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (url && anon && !anon.includes('placeholder')) {
    return createClient(url, anon);
  }
  return null;
}

/** Published CMS programme assets for one offering (video, PDFs, roadmap). */
export async function fetchPublishedProgrammeAssets(
  siteCertId: string,
  offeringId: string,
): Promise<ProgrammeOfferingAssets | null> {
  const client = websiteDataClient();
  if (!client || !siteCertId.trim() || !offeringId.trim()) {
    return null;
  }

  const { data, error } = await client
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
