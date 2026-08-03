import {
  defaultNewsletterHubConfig,
  parseNewsletterHubConfig,
  type NewsletterHubConfig,
} from '@pms/site-content/newsletter';
import { FIELD_KEYS } from '@pms/site-content/keys';
import { getOptionalServerSupabase } from '@/lib/cms/optional-server-supabase';

export type { NewsletterHubConfig };
export { defaultNewsletterHubConfig };

export async function loadNewsletterHubConfig(): Promise<NewsletterHubConfig> {
  const client = getOptionalServerSupabase();
  if (!client) return defaultNewsletterHubConfig();

  try {
    const { data, error } = await client
      .from('website_data')
      .select('content')
      .eq('field_key', FIELD_KEYS.NEWSLETTER_HUB_CONFIG)
      .eq('is_published', true)
      .maybeSingle();

    if (error || !data?.content) return defaultNewsletterHubConfig();
    return parseNewsletterHubConfig(data.content);
  } catch {
    return defaultNewsletterHubConfig();
  }
}
