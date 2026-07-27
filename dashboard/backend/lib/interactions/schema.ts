import { z } from 'zod';

import { INTERACTION_SOURCES } from './types';

export const interactionSourceSchema = z.enum(INTERACTION_SOURCES);

const publicTrackingSchema = z.object({
  consent_analytics: z.boolean().optional(),
  consent_marketing: z.boolean().optional(),
  ga_client_id: z.string().trim().max(255).optional(),
  landing_page: z.string().trim().max(500).optional(),
  first_utm_source: z.string().trim().max(500).optional(),
  first_utm_medium: z.string().trim().max(500).optional(),
  first_utm_campaign: z.string().trim().max(500).optional(),
  first_utm_term: z.string().trim().max(500).optional(),
  first_utm_content: z.string().trim().max(500).optional(),
  utm_source: z.string().trim().max(500).optional(),
  utm_medium: z.string().trim().max(500).optional(),
  utm_campaign: z.string().trim().max(500).optional(),
  utm_term: z.string().trim().max(500).optional(),
  utm_content: z.string().trim().max(500).optional(),
  first_gclid: z.string().trim().max(500).optional(),
  first_gbraid: z.string().trim().max(500).optional(),
  first_wbraid: z.string().trim().max(500).optional(),
  first_fbclid: z.string().trim().max(500).optional(),
  first_msclkid: z.string().trim().max(500).optional(),
  gclid: z.string().trim().max(500).optional(),
  gbraid: z.string().trim().max(500).optional(),
  wbraid: z.string().trim().max(500).optional(),
  fbclid: z.string().trim().max(500).optional(),
  msclkid: z.string().trim().max(500).optional(),
});

/** Public POST body for /api/interactions */
export const publicInteractionBodySchema = z.object({
  source: interactionSourceSchema,
  subject: z.string().trim().min(1).max(500),
  email: z.string().trim().email().max(320),
  clientSubmissionId: z
    .string()
    .trim()
    .min(16)
    .max(128)
    .regex(/^[A-Za-z0-9._:-]+$/)
    .optional(),
  payload: z.record(z.string(), z.unknown()).optional().default({}),
  /** Explicit trusted tracking channel. Form payload fields cannot override it. */
  tracking: publicTrackingSchema.optional().default({}),
  /** Honeypot: must be empty (bots often fill hidden fields). */
  website: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
});

/** Known optional keys inside `payload` for consent auditing (not enforced on every source). */
export type InteractionConsentPayload = {
  marketingConsent?: boolean;
  privacyConsent?: boolean;
  consentVersion?: string;
  consentRecordedAt?: string;
};

export type PublicInteractionBody = z.infer<typeof publicInteractionBodySchema>;
