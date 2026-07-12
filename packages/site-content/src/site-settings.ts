import { z } from 'zod';

export const siteSettingsSchema = z.object({
  version: z.literal(1),
  general: z.object({
    platformName: z.string(),
    domain: z.string(),
    publicDescription: z.string(),
  }),
  profile: z.object({
    displayName: z.string(),
    professionalTitle: z.string(),
  }),
  notifications: z.object({
    emailAlerts: z.boolean(),
    smsOtp: z.boolean(),
    systemLogs: z.boolean(),
  }),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export function defaultSiteSettings(): SiteSettings {
  return {
    version: 1,
    general: {
      platformName: 'PM Structure',
      domain: 'pmstructure.com',
      publicDescription:
        'Independent certification readiness and structured project management education.',
    },
    profile: {
      displayName: 'Sheikh M. Abdullah',
      professionalTitle: 'Founder',
    },
    notifications: {
      emailAlerts: true,
      smsOtp: true,
      systemLogs: true,
    },
  };
}

export function parseSiteSettings(raw: unknown): SiteSettings {
  const result = siteSettingsSchema.safeParse(raw);
  if (result.success) return result.data;
  return defaultSiteSettings();
}
