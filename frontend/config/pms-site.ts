/**
 * PM Structure public site: canonical SEO, JSON-LD, and legal entity (not personal brand site.ts).
 */
import { buildOnboardingCalendlyUrl } from '@/lib/calendly/onboarding-calendly-url';
import { BRAND } from '@/lib/brand-voice';
import { getOfferingById } from '@/lib/regional-catalogue';

export const PMS_SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') as string | undefined) ||
  'https://pmstructure.com';

export const PMS_SITE_NAME = BRAND.name;

export const PMS_SITE_DESCRIPTION =
  'Independent exam prep across PMI, PRINCE2, and Lean Six Sigma. Structured readiness pathways, regional scholarship pricing, and mentor-led support.';

/** All legal, privacy, and compliance enquiries use the support inbox. */
export const PMS_SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || 'support@pmstructure.com';

/** Post-checkout onboarding call (also used in confirmation emails). */
export const PMS_ONBOARDING_CALENDLY_URL =
  process.env.NEXT_PUBLIC_ONBOARDING_CALENDLY_URL?.trim() ||
  'https://calendly.com/pm-structure/talk-to-mentor';

/** Primary “Talk to Mentor” scheduling link (live Calendly event). */
export const PMS_TALK_TO_MENTOR_CALENDLY_URL =
  process.env.NEXT_PUBLIC_TALK_TO_MENTOR_CALENDLY_URL?.trim() ||
  'https://calendly.com/pm-structure/talk-to-mentor';

/** PM advisory / corporate services (live Calendly event). */
export const PMS_TALK_TO_ADVISOR_CALENDLY_URL =
  process.env.NEXT_PUBLIC_TALK_TO_ADVISOR_CALENDLY_URL?.trim() ||
  'https://calendly.com/pm-structure/talk-to-advisor';

/** @deprecated Use {@link PMS_TALK_TO_MENTOR_CALENDLY_URL}. */
export const PMS_MENTOR_CALENDLY_URL = PMS_TALK_TO_MENTOR_CALENDLY_URL;

export function getOnboardingCalendlyUrl(
  offeringId?: string | null,
  opts?: { utmSource?: string; utmMedium?: string },
): string {
  return buildOnboardingCalendlyUrl(
    offeringId,
    (id) => {
      const offering = getOfferingById(id);
      return offering ? { familyId: offering.familyId, tierId: offering.tierId } : undefined;
    },
    {
      utmSource: opts?.utmSource ?? 'success_page',
      utmMedium: opts?.utmMedium ?? 'enrollment',
    },
    PMS_ONBOARDING_CALENDLY_URL,
  );
}

/** @deprecated Use PMS_SUPPORT_EMAIL: kept for env compatibility only. */
export const PMS_LEGAL_EMAIL =
  process.env.NEXT_PUBLIC_LEGAL_EMAIL?.trim() || PMS_SUPPORT_EMAIL;

export const PMS_LEGAL_ENTITY_NAME =
  process.env.NEXT_PUBLIC_LEGAL_ENTITY_NAME?.trim() || BRAND.fullName;

export const PMS_LEGAL_ENTITY_ADDRESS =
  process.env.NEXT_PUBLIC_LEGAL_ENTITY_ADDRESS?.trim() || '';

export const PMS_CONTACT_PHONE =
  process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || '';

const DEFAULT_WHATSAPP_DISPLAY = '+44 7947 540939';
const DEFAULT_WHATSAPP_URL = 'https://wa.me/447947540939';

/** Human-readable WhatsApp number for support surfaces. */
export const PMS_WHATSAPP_DISPLAY =
  process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY?.trim() || DEFAULT_WHATSAPP_DISPLAY;

/** WhatsApp chat link (wa.me or api.whatsapp.com). */
export const PMS_WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() || DEFAULT_WHATSAPP_URL;

export function getPmsWhatsAppUrl(): string {
  return PMS_WHATSAPP_URL;
}

export function getPmsWhatsAppDisplay(): string {
  return PMS_WHATSAPP_DISPLAY;
}

export function isWhatsAppConfigured(): boolean {
  const url = PMS_WHATSAPP_URL;
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.includes('whatsapp.com') || host.includes('wa.me');
  } catch {
    return false;
  }
}

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

/** Controller line for privacy/terms: no bracket placeholders in published copy. */
export function formatLegalControllerLine(): string {
  if (isLegalEntityConfigured()) {
    return `${PMS_LEGAL_ENTITY_NAME}, ${PMS_LEGAL_ENTITY_ADDRESS}`;
  }
  return `${BRAND.fullName} (${BRAND.domain})`;
}

/** Default Open Graph image (1200×630 preferred; fallback to brand mark). */
export const PMS_OG_IMAGE_PATH = process.env.NEXT_PUBLIC_OG_IMAGE_PATH || '/og/default.png';

export const PMS_LOGO_PATH = '/brand/pms-logo-light.png';

/** Square mark for browser tab / PWA (public/brand). */
export const PMS_FAVICON_PATH = '/brand/pms-icon.png';
export const PMS_FAVICON_DARK_PATH = '/brand/pms-icon-dark.png';

export const PMS_ORGANIZATION_SAME_AS: readonly string[] = [
  PMS_SITE_URL,
  `https://${BRAND.domain}`,
];