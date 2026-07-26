import type { PortalLayoutVariant } from './platformOfferPack'

/** Fallback consultation-portal column width. */
export const PORTAL_SHELL_MAX_WIDTH_CLASS = 'max-w-4xl mx-auto w-full min-w-0'

/**
 * Match information density to the channel family instead of forcing every referral
 * into the same website-shaped column.
 */
export function portalShellMaxWidthClass(layoutVariant?: PortalLayoutVariant): string {
  switch (layoutVariant) {
    case 'bold':
    case 'professional':
      return 'max-w-5xl mx-auto w-full min-w-0'
    case 'minimal':
      return 'max-w-3xl mx-auto w-full min-w-0'
    case 'editorial':
    case 'warm':
      return PORTAL_SHELL_MAX_WIDTH_CLASS
    default:
      return PORTAL_SHELL_MAX_WIDTH_CLASS
  }
}

/** Presence strip inner row: matches {@link portalShellMaxWidthClass}. */
export function portalPresenceStripWidthClass(layoutVariant?: PortalLayoutVariant): string {
  return portalShellMaxWidthClass(layoutVariant)
}

/** Booking form sits in the same column; slightly narrower fields on large screens only. */
export function portalFormMaxWidthClass(): string {
  return 'max-w-2xl mx-auto w-full min-w-0'
}
