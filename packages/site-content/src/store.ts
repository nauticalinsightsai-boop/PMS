import { z } from 'zod';
import { mediaRefSchema } from './media';

export const storeCatalogSchema = z.object({
  version: z.literal(1),
  hero: z
    .object({
      badge: z.string(),
      title: z.string(),
      subtitle: z.string(),
    })
    .optional(),
  categories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      sortOrder: z.number(),
    }),
  ),
  products: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      categoryId: z.string(),
      price: z.number(),
      currency: z.string(),
      displayPrice: z.string(),
      badge: z.string().optional(),
      rating: z.number().optional(),
      reviewCount: z.number().optional(),
      image: mediaRefSchema.optional(),
      imageUrl: z.string().optional(),
      visible: z.boolean(),
      sortOrder: z.number(),
    }),
  ),
});

export type StoreCatalog = z.infer<typeof storeCatalogSchema>;

export function defaultStoreCatalog(): StoreCatalog {
  const categories = [
    { id: 'all', name: 'All Resources', sortOrder: 0 },
    { id: 'mock-exams', name: 'Mock Exams', sortOrder: 1 },
    { id: 'templates', name: 'Templates', sortOrder: 2 },
    { id: 'planners', name: 'Planners', sortOrder: 3 },
    { id: 'bundles', name: 'Bundles', sortOrder: 4 },
    { id: 'study-packs', name: 'Study Packs', sortOrder: 5 },
  ];

  return {
    version: 1,
    hero: {
      badge: 'Resource store',
      title: 'Professional PM resources',
      subtitle: 'Mock exams, templates, planners, and study packs.',
    },
    categories,
    products: [
      {
        id: 'pmp-mock-pack',
        title: 'PMP® 2026 Mock Exam Pack',
        description: '5 full-length exams with detailed explanations for every question.',
        categoryId: 'mock-exams',
        price: 49.99,
        currency: 'USD',
        displayPrice: '$49.99',
        badge: 'Popular',
        rating: 4.9,
        reviewCount: 1240,
        imageUrl: 'https://picsum.photos/seed/exam/400/500',
        visible: true,
        sortOrder: 0,
      },
      {
        id: 'pmo-templates',
        title: 'PMO Governance Templates',
        description: '50+ professional templates for reporting, risk, and stakeholder management.',
        categoryId: 'templates',
        price: 79.99,
        currency: 'USD',
        displayPrice: '$79.99',
        badge: 'New',
        rating: 4.8,
        reviewCount: 850,
        imageUrl: 'https://picsum.photos/seed/templates/400/500',
        visible: true,
        sortOrder: 1,
      },
      {
        id: 'agile-planner',
        title: 'Agile Career Planner 2026',
        description: 'Digital planner designed for Scrum Masters and Agile Coaches.',
        categoryId: 'planners',
        price: 24.99,
        currency: 'USD',
        displayPrice: '$24.99',
        rating: 4.7,
        reviewCount: 420,
        imageUrl: 'https://picsum.photos/seed/planner/400/500',
        visible: true,
        sortOrder: 2,
      },
      {
        id: 'exam-bundle',
        title: 'Comprehensive Exam Prep Bundle',
        description: 'Includes Mock Exams, Study Guides, and Flashcards for PMP & CAPM.',
        categoryId: 'bundles',
        price: 149.99,
        currency: 'USD',
        displayPrice: '$149.99',
        badge: 'Save 30%',
        rating: 4.9,
        reviewCount: 2100,
        imageUrl: 'https://picsum.photos/seed/bundle/400/500',
        visible: true,
        sortOrder: 3,
      },
      {
        id: 'risk-pack',
        title: 'Risk Management Study Pack',
        description: 'Specialized resources for the PMI-RMP certification exam.',
        categoryId: 'study-packs',
        price: 34.99,
        currency: 'USD',
        displayPrice: '$34.99',
        rating: 4.8,
        reviewCount: 310,
        imageUrl: 'https://picsum.photos/seed/risk/400/500',
        visible: true,
        sortOrder: 4,
      },
      {
        id: 'lss-green-kit',
        title: 'Six Sigma Green Belt Kit',
        description: 'Complete toolkit for Lean Six Sigma Green Belt candidates.',
        categoryId: 'study-packs',
        price: 59.99,
        currency: 'USD',
        displayPrice: '$59.99',
        rating: 4.6,
        reviewCount: 180,
        imageUrl: 'https://picsum.photos/seed/sigma/400/500',
        visible: true,
        sortOrder: 5,
      },
    ],
  };
}

export function parseStoreCatalog(raw: unknown): StoreCatalog {
  return storeCatalogSchema.parse(raw);
}
