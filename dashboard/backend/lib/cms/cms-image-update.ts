import type { SupabaseClient } from '@supabase/supabase-js';
import { parseCmsContext, setValueAtJsonPath } from '@pms/site-content';

export async function updateCmsImageAtContext(
  admin: SupabaseClient,
  context: string,
  newUrl: string,
): Promise<{ fieldKey: string }> {
  const parsed = parseCmsContext(context);
  if (!parsed) {
    throw new Error('Could not locate this image in CMS — edit it from the page editor instead.');
  }

  const { data, error } = await admin
    .from('website_data')
    .select('content, is_published')
    .eq('field_key', parsed.fieldKey)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data?.content || typeof data.content !== 'object') {
    throw new Error(`CMS document "${parsed.fieldKey}" was not found.`);
  }

  const content = structuredClone(data.content) as Record<string, unknown>;
  if (!setValueAtJsonPath(content, parsed.path, newUrl)) {
    throw new Error('Could not update the image field in CMS content.');
  }

  const { error: saveError } = await admin.from('website_data').upsert(
    {
      field_key: parsed.fieldKey,
      content,
      is_published: data.is_published ?? false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'field_key' },
  );

  if (saveError) throw new Error(saveError.message);
  return { fieldKey: parsed.fieldKey };
}
