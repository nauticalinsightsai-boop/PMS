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
  story: z
    .object({
      title: z.string(),
      text1: z.string(),
      text2: z.string(),
    })
    .default({
      title: 'Our Story',
      text1: '',
      text2: '',
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
      subtitle: 'Prepare professionals with structure: not shortcuts.',
    },
    story: {
      title: 'Our Story',
      text1:
        'PM Structure began as a structured study circle for busy project professionals preparing for PMI exams. The gap was never lack of material: it was lack of pathway, accountability, and readiness measurement.',
      text2:
        'Today we support learners and teams across regions with independent exam-preparation pathways, advisory services, and practical tools. Our focus remains certification readiness, governance thinking, and delivery discipline.',
    },
    blocks: [],
  };
}

export function parseAboutPageConfig(raw: unknown): AboutPageConfig {
  const result = aboutPageConfigSchema.safeParse(raw);
  if (result.success) return result.data;
  return defaultAboutPageConfig();
}
