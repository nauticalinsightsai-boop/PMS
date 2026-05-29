import { z } from 'zod';
import { mediaRefSchema } from './media';

export const aboutPageConfigSchema = z.object({
  version: z.literal(1),
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
  }),
  mission: z.object({
    title: z.string(),
    subtitle: z.string(),
    body: z.string().optional(),
  }),
  blocks: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        image: mediaRefSchema.optional(),
        visible: z.boolean(),
      }),
    )
    .optional(),
});

export type AboutPageConfig = z.infer<typeof aboutPageConfigSchema>;

export function defaultAboutPageConfig(): AboutPageConfig {
  return {
    version: 1,
    hero: {
      badge: 'About',
      title: 'About PM Structure',
      subtitle: 'Independent certification readiness and structured project leadership.',
    },
    mission: {
      title: 'Our mission',
      subtitle: 'Prepare professionals with structure — not shortcuts.',
    },
    blocks: [],
  };
}

export function parseAboutPageConfig(raw: unknown): AboutPageConfig {
  return aboutPageConfigSchema.parse(raw);
}
