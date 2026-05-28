import { z } from 'zod';

import { INTERACTION_SOURCES } from '@/lib/interactions/types';

export const interactionSourceSchema = z.enum(INTERACTION_SOURCES);

/** Public POST body for /api/interactions */
export const publicInteractionBodySchema = z.object({
  source: interactionSourceSchema,
  subject: z.string().trim().min(1).max(500),
  email: z.string().trim().email().max(320),
  payload: z.record(z.string(), z.unknown()).optional().default({}),
  /** Honeypot — must be empty (bots often fill hidden fields). */
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
