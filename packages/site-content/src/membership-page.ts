import { z } from 'zod';

export const membershipPageConfigSchema = z.object({
  version: z.literal(1),
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
  }),
  tiers: z.array(
    z.object({
      id: z.enum(['starter', 'professional', 'mastery']),
      visible: z.boolean(),
      highlight: z.boolean().optional(),
      titleOverride: z.string().optional(),
      descriptionOverride: z.string().optional(),
    }),
  ),
  benefits: z.array(z.object({ title: z.string(), desc: z.string(), iconKey: z.string() })).optional(),
});

export type MembershipPageConfig = z.infer<typeof membershipPageConfigSchema>;

export function defaultMembershipPageConfig(): MembershipPageConfig {
  return {
    version: 1,
    hero: {
      badge: 'Membership',
      title: 'Membership Plans',
      subtitle: 'Unlock structured tools, community access, and certification discounts.',
    },
    tiers: [
      { id: 'starter', visible: true },
      { id: 'professional', visible: true, highlight: true },
      { id: 'mastery', visible: true },
    ],
  };
}

export function parseMembershipPageConfig(raw: unknown): MembershipPageConfig {
  return membershipPageConfigSchema.parse(raw);
}
