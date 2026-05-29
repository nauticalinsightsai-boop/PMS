import { z } from 'zod';
import { mediaRefSchema } from './media';

export const primaryActionSchema = z.enum(['link', 'register_modal', 'contact']);

export const homeHeroSlideSchema = z.object({
  id: z.number(),
  visible: z.boolean(),
  heading: z.string(),
  description: z.string(),
  primaryCta: z.string(),
  primaryAction: primaryActionSchema.default('register_modal'),
  primaryLink: z.string(),
  secondaryCta: z.string(),
  secondaryLink: z.string(),
  heroImage: mediaRefSchema.optional(),
});

export const homeCtaBlockSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  ctaText: z.string(),
  ctaLink: z.string(),
});

export const homeLatestNewsItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  link: z.string().optional(),
  visible: z.boolean(),
});

export const homeFootprintEntrySchema = z.object({
  id: z.string(),
  category: z.string(),
  item: z.string(),
  location: z.string(),
  year: z.string().optional(),
  isActive: z.boolean(),
});

export const homeSectionsSchema = z.object({
  latestNews: z.boolean().default(true),
  featuredPathways: z.boolean().default(true),
  programFamilies: z.boolean().default(true),
  insightsBand: z.boolean().default(true),
  membership: z.boolean().default(true),
  community: z.boolean().default(true),
  testimonials: z.boolean().default(true),
  globalFootprint: z.boolean().default(true),
  finalCta: z.boolean().default(true),
});

export const programFamilyIdSchema = z.enum(['PMI', 'PRINCE2', 'SixSigma']);

export const homeProgramFamilySchema = z.object({
  familyId: programFamilyIdSchema,
  visible: z.boolean(),
  titleOverride: z.string().optional(),
  descriptionOverride: z.string().optional(),
});

export const membershipTierIdSchema = z.enum(['starter', 'professional', 'mastery']);

export const homeMembershipSchema = z.object({
  sectionTitle: z.string().optional(),
  sectionSubtitle: z.string().optional(),
  highlightedTierId: membershipTierIdSchema.default('professional'),
  visibleTierIds: z.array(z.string()).default(['starter', 'professional', 'mastery']),
  showBenefitsGrid: z.boolean().default(true),
  benefits: z
    .array(
      z.object({
        title: z.string(),
        desc: z.string(),
        iconKey: z.string(),
      }),
    )
    .optional(),
});

export const homeTestimonialSchema = z.object({
  id: z.string(),
  quote: z.string(),
  name: z.string(),
  role: z.string(),
  visible: z.boolean(),
  avatarUrl: z.string().optional(),
});

export const homeInsightsBandSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  items: z.array(
    z.object({
      title: z.string(),
      desc: z.string(),
      href: z.string(),
    }),
  ),
});

export const homePageConfigV2Schema = z.object({
  version: z.literal(2),
  heroSlides: z.array(homeHeroSlideSchema).min(1),
  stats: z.object({
    professionalsCount: z.number().int().nonnegative(),
    professionalsLabel: z.string().optional(),
  }),
  sections: homeSectionsSchema,
  featuredPathways: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    certIds: z.array(z.string()).max(6),
  }),
  programFamilies: z.array(homeProgramFamilySchema),
  membership: homeMembershipSchema,
  testimonials: z.array(homeTestimonialSchema).optional(),
  insightsBand: homeInsightsBandSchema.optional(),
  instituteSection: z
    .object({
      type: z.enum(['institute', 'engagement', 'speaking']),
      institute: homeCtaBlockSchema,
      engagement: homeCtaBlockSchema,
      speaking: homeCtaBlockSchema,
    })
    .optional(),
  featuredItems: z
    .object({
      showProjects: z.boolean(),
      showConsultancies: z.boolean(),
      showVentures: z.boolean(),
      selectedProjectIds: z.array(z.string()),
      selectedConsultancyIds: z.array(z.string()),
      selectedVentureIds: z.array(z.string()),
    })
    .optional(),
  latestNewsVisible: z.boolean().optional(),
  latestNews: z.array(homeLatestNewsItemSchema).optional(),
  globalFootprint: z.array(homeFootprintEntrySchema).optional(),
});

export type HomePageConfigV2 = z.infer<typeof homePageConfigV2Schema>;
export type HomeHeroSlide = z.infer<typeof homeHeroSlideSchema>;
export type HomeSections = z.infer<typeof homeSectionsSchema>;

/** Legacy v1 shape (no version field) */
export type HomePageConfigV1 = {
  heroSlides: Array<{
    id: number;
    visible: boolean;
    heading: string;
    description: string;
    primaryCta: string;
    primaryLink: string;
    secondaryCta: string;
    secondaryLink: string;
    primaryAction?: 'link' | 'register_modal' | 'contact';
  }>;
  instituteSection?: HomePageConfigV2['instituteSection'];
  featuredItems?: HomePageConfigV2['featuredItems'];
  latestNewsVisible?: boolean;
  latestNews?: HomePageConfigV2['latestNews'];
  globalFootprint?: HomePageConfigV2['globalFootprint'];
};

export const DEFAULT_HOME_SECTIONS: HomeSections = {
  latestNews: true,
  featuredPathways: true,
  programFamilies: true,
  insightsBand: true,
  membership: true,
  community: true,
  testimonials: true,
  globalFootprint: true,
  finalCta: true,
};

export const DEFAULT_HOME_MEMBERSHIP_BENEFITS = [
  { title: 'Course Discounts', desc: 'Up to 30% off all certification prep courses.', iconKey: 'trophy' },
  { title: 'Premium Resources', desc: 'Access to 500+ templates and study guides.', iconKey: 'book' },
  { title: 'CV Maker Access', desc: 'Professional PM-focused resume builder.', iconKey: 'file' },
  { title: 'Member-Only Tools', desc: 'Advanced study planners and ROI calculators.', iconKey: 'layout' },
  { title: 'Community Access', desc: 'Priority entry to private study circles.', iconKey: 'users' },
  { title: 'Expert Webinars', desc: 'Monthly live sessions with industry veterans.', iconKey: 'zap' },
];

export const DEFAULT_HOME_INSIGHTS: z.infer<typeof homeInsightsBandSchema> = {
  title: 'Insights for the Future of Project Leadership',
  subtitle:
    'The project management landscape is evolving. We provide the guidance you need to navigate AI integration and hybrid methodologies.',
  items: [
    {
      title: 'AI in Project Management',
      desc: 'How to leverage generative AI for planning and risk assessment.',
      href: '/newsletter/ai-augmented-project-manager',
    },
    {
      title: '2026 Salary Trends',
      desc: 'The latest data on certification ROI across global markets.',
      href: '/newsletter/2026-pmp-exam-changes',
    },
    {
      title: 'Hybrid Leadership',
      desc: 'Mastering the balance between predictive and agile frameworks.',
      href: '/newsletter/hybrid-methodologies-enterprise',
    },
  ],
};

export function defaultHomePageConfigV2(): HomePageConfigV2 {
  return {
    version: 2,
    heroSlides: [
      {
        id: 1,
        visible: true,
        heading: 'Prepare with structure. Lead with confidence.',
        description:
          'Independent certification readiness pathways across PMI, PRINCE2, and Lean Six Sigma — built for professionals who want clarity, not chaos.',
        primaryCta: 'Book a consultation',
        primaryAction: 'contact',
        primaryLink: '/contact?topic=consultation',
        secondaryCta: 'Find a pathway',
        secondaryLink: '/certifications',
      },
    ],
    stats: {
      professionalsCount: 1284,
      professionalsLabel: 'professionals in the network',
    },
    sections: { ...DEFAULT_HOME_SECTIONS },
    featuredPathways: {
      title: 'Featured Pathways',
      subtitle: 'Structured readiness routes across PMI, PRINCE2, and Lean Six Sigma.',
      certIds: ['pmp', 'prince2', 'lss-green'],
    },
    programFamilies: [
      { familyId: 'PMI', visible: true },
      { familyId: 'PRINCE2', visible: true },
      { familyId: 'SixSigma', visible: true },
    ],
    membership: {
      sectionTitle: 'Membership Plans',
      sectionSubtitle: 'Unlock structured tools, community access, and certification discounts.',
      highlightedTierId: 'professional',
      visibleTierIds: ['starter', 'professional', 'mastery'],
      showBenefitsGrid: true,
      benefits: DEFAULT_HOME_MEMBERSHIP_BENEFITS,
    },
    testimonials: [
      {
        id: '1',
        quote:
          'The PM Structure PMP pathway gave me a structured study rhythm, weak-area tracking, and mentor-style review.',
        name: 'Sarah Jenkins',
        role: 'Senior PM at TechCorp',
        visible: true,
      },
      {
        id: '2',
        quote:
          'The PMI-ACP readiness support focused on scenarios and weak-area revision, not random videos.',
        name: 'Michael Chen',
        role: 'Agile Coach',
        visible: true,
      },
    ],
    insightsBand: DEFAULT_HOME_INSIGHTS,
    instituteSection: {
      type: 'institute',
      institute: { title: 'Institute', subtitle: '', description: '', ctaText: '', ctaLink: '' },
      engagement: { title: 'Engagement', subtitle: '', description: '', ctaText: '', ctaLink: '' },
      speaking: { title: 'Speaking', subtitle: '', description: '', ctaText: '', ctaLink: '' },
    },
    featuredItems: {
      showProjects: true,
      showConsultancies: true,
      showVentures: false,
      selectedProjectIds: [],
      selectedConsultancyIds: [],
      selectedVentureIds: [],
    },
    latestNewsVisible: true,
    latestNews: [],
    globalFootprint: [],
  };
}

export function normalizeHomeConfigV1ToV2(raw: unknown): HomePageConfigV2 {
  const base = defaultHomePageConfigV2();
  if (!raw || typeof raw !== 'object') return base;

  const v1 = raw as HomePageConfigV1 & Partial<HomePageConfigV2>;
  if (v1.version === 2) {
    const parsed = homePageConfigV2Schema.safeParse(v1);
    if (parsed.success) return parsed.data;
  }

  const heroSlides = Array.isArray(v1.heroSlides)
    ? v1.heroSlides.map((slide, idx) => ({
        id: slide.id ?? idx + 1,
        visible: slide.visible ?? true,
        heading: slide.heading ?? '',
        description: slide.description ?? '',
        primaryCta: slide.primaryCta ?? base.heroSlides[0].primaryCta,
        primaryAction: slide.primaryAction ?? inferPrimaryAction(slide.primaryLink),
        primaryLink: slide.primaryLink ?? '/contact?topic=consultation',
        secondaryCta: slide.secondaryCta ?? base.heroSlides[0].secondaryCta,
        secondaryLink: slide.secondaryLink ?? '/certifications',
      }))
    : base.heroSlides;

  const legacyFeaturedIds = [
    ...(v1.featuredItems?.selectedProjectIds ?? []),
    ...(v1.featuredItems?.selectedConsultancyIds ?? []),
    ...(v1.featuredItems?.selectedVentureIds ?? []),
  ];

  return {
    ...base,
    heroSlides,
    stats: v1.stats ?? base.stats,
    sections: { ...base.sections, ...(v1.sections ?? {}) },
    featuredPathways: {
      ...base.featuredPathways,
      ...(v1.featuredPathways ?? {}),
      certIds:
        v1.featuredPathways?.certIds?.length
          ? v1.featuredPathways.certIds.slice(0, 6)
          : legacyFeaturedIds.length
            ? legacyFeaturedIds.slice(0, 6)
            : base.featuredPathways.certIds,
    },
    programFamilies: v1.programFamilies?.length ? v1.programFamilies : base.programFamilies,
    membership: { ...base.membership, ...(v1.membership ?? {}) },
    testimonials: v1.testimonials ?? base.testimonials,
    insightsBand: v1.insightsBand ?? base.insightsBand,
    instituteSection: v1.instituteSection ?? base.instituteSection,
    featuredItems: v1.featuredItems ?? base.featuredItems,
    latestNewsVisible: v1.latestNewsVisible ?? base.latestNewsVisible,
    latestNews: v1.latestNews ?? base.latestNews,
    globalFootprint: v1.globalFootprint ?? base.globalFootprint,
  };
}

function inferPrimaryAction(link?: string): 'link' | 'register_modal' | 'contact' {
  if (!link) return 'register_modal';
  if (link.includes('contact')) return 'contact';
  if (link.startsWith('/')) return 'link';
  return 'register_modal';
}

export function parseHomePageConfig(raw: unknown): HomePageConfigV2 {
  const normalized = normalizeHomeConfigV1ToV2(raw);
  return homePageConfigV2Schema.parse(normalized);
}

export function safeParseHomePageConfig(raw: unknown) {
  return homePageConfigV2Schema.safeParse(normalizeHomeConfigV1ToV2(raw));
}
