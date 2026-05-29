/**
 * PM Structure public site — canonical SEO, JSON-LD, and legal entity (not personal brand site.ts).
 */
import { BRAND } from '@/lib/brand-voice';

export const PMS_SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') as string | undefined) ||
  'https://www.pmstructure.com';

export const PMS_SITE_NAME = BRAND.name;

export const PMS_SITE_DESCRIPTION =
  'Independent exam prep across PMI, PRINCE2, and Lean Six Sigma. Structured readiness pathways, regional scholarship pricing, and mentor-led support.';

/** All legal, privacy, and compliance enquiries use the support inbox. */
export const PMS_SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || 'support@pmstructure.com';

/** @deprecated Use PMS_SUPPORT_EMAIL — kept for env compatibility only. */
export const PMS_LEGAL_EMAIL =
  process.env.NEXT_PUBLIC_LEGAL_EMAIL?.trim() || PMS_SUPPORT_EMAIL;

export const PMS_LEGAL_ENTITY_NAME =
  process.env.NEXT_PUBLIC_LEGAL_ENTITY_NAME?.trim() || BRAND.fullName;

export const PMS_LEGAL_ENTITY_ADDRESS =
  process.env.NEXT_PUBLIC_LEGAL_ENTITY_ADDRESS?.trim() || '';

export const PMS_CONTACT_PHONE =
  process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || '';

/** Regional presence shown in footer and contact surfaces (not full street addresses). */
export type PmsOfficeLocation = {
  city: string;
  region: string;
};

export const PMS_OFFICE_LOCATIONS: readonly PmsOfficeLocation[] = [
  { city: 'Dubai', region: 'United Arab Emirates' },
  { city: 'London', region: 'United Kingdom' },
] as const;

export function formatOfficeLocation(loc: PmsOfficeLocation): string {
  return `${loc.city}, ${loc.region}`;
}

const PLACEHOLDER_NAME = '[Legal entity name';
const PLACEHOLDER_ADDRESS = '[Registered address';

export function isLegalEntityConfigured(): boolean {
  const name = process.env.NEXT_PUBLIC_LEGAL_ENTITY_NAME?.trim();
  const address = process.env.NEXT_PUBLIC_LEGAL_ENTITY_ADDRESS?.trim();
  if (!name || !address) return false;
  if (name.includes(PLACEHOLDER_NAME) || address.includes(PLACEHOLDER_ADDRESS)) return false;
  return true;
}

export function isContactPhoneConfigured(): boolean {
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim();
  if (!phone) return false;
  if (phone.includes('(555)') || phone.includes('123-4567')) return false;
  return true;
}

/** Controller line for privacy/terms — no bracket placeholders in published copy. */
export function formatLegalControllerLine(): string {
  if (isLegalEntityConfigured()) {
    return `${PMS_LEGAL_ENTITY_NAME}, ${PMS_LEGAL_ENTITY_ADDRESS}`;
  }
  return `${BRAND.fullName} (${BRAND.domain})`;
}

/** Default Open Graph image (1200×630 preferred; fallback to brand mark). */
export const PMS_OG_IMAGE_PATH = process.env.NEXT_PUBLIC_OG_IMAGE_PATH || '/og/default.png';

export const PMS_LOGO_PATH = '/brand/pms-logo-light.png';

export const PMS_ORGANIZATION_SAME_AS: readonly string[] = [
  PMS_SITE_URL,
  `https://${BRAND.domain}`,
];

