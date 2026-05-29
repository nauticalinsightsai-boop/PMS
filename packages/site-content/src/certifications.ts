import { z } from 'zod';

export const certFamilyIdSchema = z.enum(['PMI', 'PRINCE2', 'SixSigma', 'FoundationDirect']);

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
  /** Detail page hero — overrides siteData when published */
  detailHeroTitle: z.string().optional(),
  detailHeroSubtitle: z.string().optional(),
  outputValue: z.string().optional(),
  recommendedCta: z.string().optional(),
  targetAudience: z.string().optional(),
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
      title: 'Find your certification pathway',
      subtitle: 'Structured readiness across PMI, PRINCE2, and Lean Six Sigma.',
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
