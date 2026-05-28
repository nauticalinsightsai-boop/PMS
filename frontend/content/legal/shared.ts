import {
  formatLegalControllerLine,
  PMS_SUPPORT_EMAIL,
} from '@/config/pms-site';

export const LEGAL_LAST_UPDATED = '2026-05-23';

/** Single inbox for legal, privacy, billing, and compliance. */
export const LEGAL_SUPPORT_EMAIL = PMS_SUPPORT_EMAIL;

/** @deprecated Alias — use LEGAL_SUPPORT_EMAIL */
export const LEGAL_CONTACT_EMAIL = LEGAL_SUPPORT_EMAIL;

export const LEGAL_CONTROLLER_LINE = formatLegalControllerLine();

/** @deprecated Use LEGAL_CONTROLLER_LINE */
export const LEGAL_CONTROLLER_PLACEHOLDER = LEGAL_CONTROLLER_LINE;

export function legalSupportSection(topic: string): string {
  return `For questions about ${topic}, email ${LEGAL_SUPPORT_EMAIL} with your region and order email if applicable.`;
}

export function section(id: string, heading: string, body: string) {
  return { id, heading, body };
}
