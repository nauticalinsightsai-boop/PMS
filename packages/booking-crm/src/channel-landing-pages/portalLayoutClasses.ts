import type { PortalLayoutVariant } from './platformOfferPack'

/** One consultation-portal column width for every channel slug (webinar, social, impulse, etc.). */
export const PORTAL_SHELL_MAX_WIDTH_CLASS = 'max-w-4xl mx-auto w-full min-w-0'

/**
 * Main portal column — same width on mobile and desktop for all layout variants.
 * `layoutVariant` is kept for call-site compatibility; bold/impulse no longer narrows the shell.
 */
export function portalShellMaxWidthClass(_layoutVariant?: PortalLayoutVariant): string {
  return PORTAL_SHELL_MAX_WIDTH_CLASS
}

/** Presence strip inner row — matches {@link portalShellMaxWidthClass}. */
export function portalPresenceStripWidthClass(layoutVariant?: PortalLayoutVariant): string {
  return portalShellMaxWidthClass(layoutVariant)
}

/** Booking form sits in the same column; slightly narrower fields on large screens only. */
export function portalFormMaxWidthClass(): string {
  return 'max-w-2xl mx-auto w-full min-w-0'
}
