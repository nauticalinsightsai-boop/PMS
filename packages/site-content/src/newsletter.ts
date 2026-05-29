import { z } from 'zod';

export const newsletterHubConfigSchema = z.object({
  version: z.literal(1),
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
  }),
  /** Phase 7: when deferred, articles stay file-based */
  source: z.enum(['file', 'supabase']).default('file'),
});

export type NewsletterHubConfig = z.infer<typeof newsletterHubConfigSchema>;

export function defaultNewsletterHubConfig(): NewsletterHubConfig {
  return {
    version: 1,
    hero: {
      badge: 'Newsletter',
      title: 'The Structure Report',
      subtitle: 'Weekly deep-dives on methodology, leadership, and career growth.',
    },
    source: 'file',
  };
}

export function parseNewsletterHubConfig(raw: unknown): NewsletterHubConfig {
  return newsletterHubConfigSchema.parse(raw);
}
