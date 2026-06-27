import { z } from 'zod';

export const faqItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  visible: z.boolean(),
  sortOrder: z.number(),
});

export const faqPageConfigSchema = z.object({
  version: z.literal(1),
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
  }),
  /** Heading shown above the editable FAQ list on /faq. */
  sectionTitle: z.string(),
  items: z.array(faqItemSchema),
});

export type FaqItem = z.infer<typeof faqItemSchema>;
export type FaqPageConfig = z.infer<typeof faqPageConfigSchema>;

export function defaultFaqPageConfig(): FaqPageConfig {
  return {
    version: 1,
    hero: {
      badge: '',
      title: 'Frequently Asked Questions',
      subtitle:
        'PMP 2026 exam prep, certification pathways, regional pricing, membership, delivery, and policies.',
    },
    sectionTitle: 'Common questions',
    items: [],
  };
}

export function parseFaqPageConfig(raw: unknown): FaqPageConfig {
  return faqPageConfigSchema.parse(raw);
}

/** Visible items in sort order — used by the public /faq page. */
export function visibleFaqItems(config: FaqPageConfig | null | undefined): FaqItem[] {
  if (!config) return [];
  return [...config.items]
    .filter((item) => item.visible && item.question.trim() && item.answer.trim())
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
