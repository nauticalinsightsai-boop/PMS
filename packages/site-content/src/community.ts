import { z } from 'zod';

export const communityPageConfigSchema = z.object({
  version: z.literal(1),
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
  }),
  network: z.object({
    title: z.string(),
    subtitle: z.string(),
    memberCount: z.number().optional(),
    features: z.array(z.object({ title: z.string(), iconKey: z.string() })),
    ctaText: z.string(),
    ctaHref: z.string(),
  }),
  storeIntro: z
    .object({
      title: z.string(),
      subtitle: z.string(),
      visible: z.boolean(),
    })
    .optional(),
});

export type CommunityPageConfig = z.infer<typeof communityPageConfigSchema>;

export function defaultCommunityPageConfig(): CommunityPageConfig {
  return {
    version: 1,
    hero: {
      badge: 'Community',
      title: 'Join the Global PM Network',
      subtitle: 'Connect with professionals in our Slack-based community.',
    },
    network: {
      title: 'Join the Global PM Network',
      subtitle: "Don't study in isolation. Connect with professionals in our Slack-based community.",
      memberCount: 1284,
      features: [
        { title: 'Slack Community', iconKey: 'message' },
        { title: 'Study Circles', iconKey: 'users' },
        { title: 'Peer Discussions', iconKey: 'message' },
        { title: 'Live Sessions', iconKey: 'calendar' },
      ],
      ctaText: 'Join Community',
      ctaHref: '/community',
    },
    storeIntro: {
      title: 'Resource Store',
      subtitle: 'Mock exams, templates, and study packs for certification prep.',
      visible: true,
    },
  };
}

export function parseCommunityPageConfig(raw: unknown): CommunityPageConfig {
  return communityPageConfigSchema.parse(raw);
}
