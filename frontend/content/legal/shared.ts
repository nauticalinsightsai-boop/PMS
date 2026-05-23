import { BRAND } from '@/lib/brand-voice';

export const LEGAL_LAST_UPDATED = '2026-05-23';

export const LEGAL_CONTACT_EMAIL = 'legal@pmstructure.com';

export const LEGAL_SUPPORT_EMAIL = 'support@pmstructure.com';

export const LEGAL_CONTROLLER_PLACEHOLDER = `[Legal entity name and registered address for ${BRAND.name} — to be confirmed by counsel]`;

export const LEGAL_DRAFT_NOTICE =
  'This document is a draft template for internal review. It does not constitute legal advice. Have qualified counsel review before publication.';

export function section(id: string, heading: string, body: string) {
  return { id, heading, body };
}
