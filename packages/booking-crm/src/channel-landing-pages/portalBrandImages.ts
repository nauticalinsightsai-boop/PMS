type BrandImageMap = Record<string, string>

const DEFAULT_PORTAL_BRAND_IMAGE = '/brand/sa-ring-gradient.png'
const DEFAULT_PORTAL_HERO_IMAGE = '/brand/portal-profile-avatar.png'

/**
 * Slug-first mapping so each /go/{slug} can carry a distinct identity image.
 * Update keys here as new slugs launch.
 */
const SLUG_BRAND_IMAGES: BrandImageMap = {
  website: '/brand/sa-ring-gradient.png',
  notion: '/brand/sa-mark-gradient.png',
  'notion-public': '/brand/sa-mark-gradient.png',
}

const CHANNEL_BRAND_IMAGES: BrandImageMap = {
  website: '/brand/sa-ring-gradient.png',
  webinar: '/brand/sa-crest-anchor.png',
}

const SLUG_HERO_IMAGES: BrandImageMap = {
  website: '/brand/portal-profile-avatar.png',
}

const CHANNEL_HERO_IMAGES: BrandImageMap = {
  website: '/brand/portal-profile-avatar.png',
}

function normalizeKey(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase()
}

export function resolvePortalBrandImage(slug?: string | null, channelId?: string | null): string {
  const slugKey = normalizeKey(slug)
  const channelKey = normalizeKey(channelId)
  return (
    (slugKey ? SLUG_BRAND_IMAGES[slugKey] : undefined) ??
    (channelKey ? CHANNEL_BRAND_IMAGES[channelKey] : undefined) ??
    DEFAULT_PORTAL_BRAND_IMAGE
  )
}

export function resolvePortalHeroImage(slug?: string | null, channelId?: string | null): string {
  const slugKey = normalizeKey(slug)
  const channelKey = normalizeKey(channelId)
  return (
    (slugKey ? SLUG_HERO_IMAGES[slugKey] : undefined) ??
    (channelKey ? CHANNEL_HERO_IMAGES[channelKey] : undefined) ??
    DEFAULT_PORTAL_HERO_IMAGE
  )
}
