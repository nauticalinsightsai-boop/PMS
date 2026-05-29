import { getChannelById, PLATFORM_CATEGORIES } from '../constants/channelGroups'
import type { PlatformCategory } from '../types/distribution'
import { publicSlugForChannel } from '../types/channelLandingPage'
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'

export type PortalGoLink = {
  channelId: string
  label: string
  href: string
  platformCategory: PlatformCategory
  iconName?: string
}

/** Public `/go/{slug}` path for a channel id (respects x, notion aliases). */
export function buildGoPathForChannelId(channelId: string): string {
  return `/go/${publicSlugForChannel(channelId)}`
}

export function getScope41PortalGoLinks(): PortalGoLink[] {
  return IMPLEMENTATION_SCOPE_41.map((channelId) => {
    const channel = getChannelById(channelId)
    return {
      channelId,
      label: channel?.label ?? channelId,
      href: buildGoPathForChannelId(channelId),
      platformCategory: channel?.platformCategory ?? 'Core / Owned Platform',
      iconName: channel?.icon,
    }
  })
}

export function groupPortalGoLinksByCategory(
  links: PortalGoLink[]
): { category: PlatformCategory; links: PortalGoLink[] }[] {
  const byCategory = new Map<PlatformCategory, PortalGoLink[]>()
  for (const link of links) {
    const list = byCategory.get(link.platformCategory) ?? []
    list.push(link)
    byCategory.set(link.platformCategory, list)
  }

  return PLATFORM_CATEGORIES.map((category) => ({
    category,
    links: (byCategory.get(category) ?? []).sort((a, b) => a.label.localeCompare(b.label)),
  })).filter((g) => g.links.length > 0)
}
