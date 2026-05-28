import type { ChannelLandingPage } from '../types/channelLandingPage'

/** Canonical public path — always `/go/{slug}` (no preview query). */
export function buildGoPagePath(page: Pick<ChannelLandingPage, 'slug'>): string | null {
  const slug = page.slug?.trim()
  if (!slug) return null
  return `/go/${slug}`
}

/** Draft preview path for the editor Preview button only. */
export function buildPreviewGoPagePath(page: Pick<ChannelLandingPage, 'slug'>): string | null {
  const path = buildGoPagePath(page)
  if (!path) return null
  return `${path}?preview=1`
}

export function buildFullShareUrl(
  page: Pick<ChannelLandingPage, 'slug'>,
  siteOrigin: string
): string | null {
  const path = buildGoPagePath(page)
  if (!path) return null
  const base = siteOrigin.replace(/\/$/, '')
  return `${base}${path}`
}

export function buildFullPreviewUrl(
  page: Pick<ChannelLandingPage, 'slug'>,
  siteOrigin: string
): string | null {
  const path = buildPreviewGoPagePath(page)
  if (!path) return null
  const base = siteOrigin.replace(/\/$/, '')
  return `${base}${path}`
}
