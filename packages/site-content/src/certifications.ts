import { z } from 'zod';

export const certFamilyIdSchema = z.enum(['PMI', 'PRINCE2', 'SixSigma', 'FoundationDirect']);

export const certificationTierPricingSchema = z.object({
  duration: z.string(),
  price: z.number(),
});

export const certificationPathwayOutcomesSchema = z.object({
  foundation: z.array(z.string()).optional(),
  professional: z.array(z.string()).optional(),
  mastery: z.array(z.string()).optional(),
});

/** Cloudflare R2 (or legacy Supabase) programme assets for pathway modal (per offering id). */
export const programmeOfferingAssetsSchema = z.object({
  guidePdfUrl: z.string().optional(),
  guidePdfPath: z.string().optional(),
  slidesPdfUrl: z.string().optional(),
  slidesPdfPath: z.string().optional(),
  videoUrl: z.string().optional(),
  videoPath: z.string().optional(),
  videoEmbedUrl: z.string().optional(),
  infographicUrl: z.string().optional(),
  infographicPath: z.string().optional(),
});

export type ProgrammeOfferingAssets = z.infer<typeof programmeOfferingAssetsSchema>;

export function offeringIdForCertTier(
  certId: string,
  tier: 'foundation' | 'professional' | 'mastery',
): string {
  const slug =
    tier === 'mastery' ? 'mastery' : tier === 'professional' ? 'professional' : 'foundation';
  return `${certId}-preparation-${slug}`;
}

export const certificationRegistryEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  familyId: certFamilyIdSchema,
  desc: z.string(),
  color: z.string().optional(),
  gradient: z.string().optional(),
  hidden: z.boolean().default(false),
  archived: z.boolean().default(false),
  sortOrder: z.number().optional(),
  /** Display / list pricing (Foundation · Professional · Elite tiers on cards). */
  pricing: z
    .object({
      Foundation: certificationTierPricingSchema,
      Professional: certificationTierPricingSchema,
      Elite: certificationTierPricingSchema,
    })
    .optional(),
  /** Detail page hero: overrides siteData when published */
  detailHeroTitle: z.string().optional(),
  detailHeroSubtitle: z.string().optional(),
  outputValue: z.string().optional(),
  recommendedCta: z.string().optional(),
  targetAudience: z.string().optional(),
  prerequisites: z.string().optional(),
  examFormat: z.string().optional(),
  registrationSteps: z.string().optional(),
  officialFee: z.string().optional(),
  trainingPriceRange: z.string().optional(),
  learningOutcomes: z.array(z.string()).optional(),
  pathwayOutcomes: certificationPathwayOutcomesSchema.optional(),
  suggestedResources: z.array(z.string()).optional(),
  regionalDemand: z.string().optional(),
  /** Keyed by offering id, e.g. pmp-preparation-foundation */
  programmeAssets: z.record(z.string(), programmeOfferingAssetsSchema).optional(),
});

export const certificationsRegistrySchema = z.object({
  version: z.literal(1),
  entries: z.array(certificationRegistryEntrySchema),
});

export type CertificationRegistryEntry = z.infer<typeof certificationRegistryEntrySchema>;
export type CertificationsRegistry = z.infer<typeof certificationsRegistrySchema>;

export const pathwayFamilyTabSchema = z.enum(['PMI', 'PRINCE2', 'SixSigma']);

export type PathwayFamilyTab = z.infer<typeof pathwayFamilyTabSchema>;

export const certificationsHubConfigSchema = z.object({
  version: z.literal(1),
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
  }),
  listing: z.object({
    title: z.string(),
    subtitle: z.string(),
  }),
  families: z.record(
    pathwayFamilyTabSchema,
    z.object({
      visible: z.boolean(),
      flagshipCertIds: z.tuple([z.string(), z.string(), z.string()]),
      sortOrder: z.enum(['flagship-first', 'alpha', 'enrollment']).default('flagship-first'),
    }),
  ),
});

export type CertificationsHubConfig = z.infer<typeof certificationsHubConfigSchema>;

export const DEFAULT_FLAGSHIP_CERT_IDS = {
  PMI: ['pmp', 'pmi-rmp', 'capm'] as [string, string, string],
  PRINCE2: ['prince2', 'prince2-practitioner', 'prince2-agile'] as [string, string, string],
  SixSigma: ['lss-green', 'lss-yellow', 'lss-black'] as [string, string, string],
};

export function defaultCertificationsHubConfig(): CertificationsHubConfig {
  return {
    version: 1,
    hero: {
      badge: 'Certification pathways',
      title: 'Project Management Courses',
      subtitle:
        'Explore PMP, Agile, Primavera P6, risk management and Microsoft Project training with live classes and expert support.',
    },
    listing: {
      title: 'All pathways',
      subtitle: 'Browse flagship routes and extended options by family.',
    },
    families: {
      PMI: { visible: true, flagshipCertIds: DEFAULT_FLAGSHIP_CERT_IDS.PMI, sortOrder: 'flagship-first' },
      PRINCE2: {
        visible: true,
        flagshipCertIds: DEFAULT_FLAGSHIP_CERT_IDS.PRINCE2,
        sortOrder: 'flagship-first',
      },
      SixSigma: {
        visible: true,
        flagshipCertIds: DEFAULT_FLAGSHIP_CERT_IDS.SixSigma,
        sortOrder: 'flagship-first',
      },
    },
  };
}

export function parseCertificationsHubConfig(raw: unknown): CertificationsHubConfig {
  return certificationsHubConfigSchema.parse(raw);
}

export function parseCertificationsRegistry(raw: unknown): CertificationsRegistry {
  return certificationsRegistrySchema.parse(raw);
}