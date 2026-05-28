import { ALL_CHANNEL_TYPES } from '../constants/channelTypes'
import { ALL_CHANNELS, getChannelById } from '../constants/channelGroups'
import type { PlatformCategory } from '../types/distribution'
import { resolveChannelIdFromLegacyKey } from '../channel-landing-pages/migrateChannelPages'

/**
 * @deprecated Per-type rows — used only for distribution obligations, not CTA landing pages.
 * CTA landing pages use one page per {@link CtaChannelEntry} (channel id).
 */
export type CtaPlatformButton = {
  label: string
  channelId: string
  channelTypeId: string
  platformCategory: PlatformCategory
  typeLabel: string
}

/** One CTA landing page per platform channel (Bluesky, Facebook, …). */
export type CtaChannelEntry = {
  label: string
  channelId: string
  platformCategory: PlatformCategory
  icon: string
}

/** Top tab labels — platform category row */
export const CTA_PLATFORM_CATEGORY_TABS: { id: PlatformCategory; label: string }[] = [
  { id: 'Core / Owned Platform', label: 'Owned' },
  { id: 'Writing / Publishing', label: 'Publishing' },
  { id: 'Social Distribution', label: 'Social' },
  { id: 'Video Platform', label: 'Video' },
  { id: 'Audio / Podcast', label: 'Podcast' },
  { id: 'Community / Direct', label: 'Community' },
  { id: 'Discovery / Search', label: 'Discovery' },
  { id: 'Syndication / Automation', label: 'Syndication' },
]

function buildCtaPlatformButtons(): CtaPlatformButton[] {
  return ALL_CHANNEL_TYPES.map((ct) => {
    const channel = getChannelById(ct.channelId)
    return {
      label: channel?.label ?? ct.channelId,
      channelId: ct.channelId,
      channelTypeId: ct.id,
      platformCategory: ct.platformCategory,
      typeLabel: ct.label,
    }
  })
}

export const CTA_PLATFORM_BUTTONS: CtaPlatformButton[] = buildCtaPlatformButtons()

export function getCtaChannelsForCategory(category: PlatformCategory): CtaChannelEntry[] {
  return ALL_CHANNELS.filter((c) => c.platformCategory === category)
    .map((c) => ({
      channelId: c.id,
      label: c.label,
      platformCategory: c.platformCategory,
      icon: c.icon ?? 'Share2',
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export function getCtaChannelById(channelId: string): CtaChannelEntry | undefined {
  const resolved = resolveChannelIdFromLegacyKey(channelId)
  if (!resolved) return undefined
  const channel = getChannelById(resolved)
  if (!channel) return undefined
  return {
    channelId: channel.id,
    label: channel.label,
    platformCategory: channel.platformCategory,
    icon: channel.icon ?? 'Share2',
  }
}

/** Editor/API shape: channel id is the storage key. */
export function toCtaPlatformButton(entry: CtaChannelEntry): CtaPlatformButton {
  return {
    label: entry.label,
    channelId: entry.channelId,
    channelTypeId: entry.channelId,
    platformCategory: entry.platformCategory,
    typeLabel: '',
  }
}

export function getCategoryForChannelKey(key: string): PlatformCategory | undefined {
  return getCtaChannelById(key)?.platformCategory
}

/** Resolve channel id from legacy type id or channel id. */
export function getCtaPlatformButtonByChannelKey(key: string): CtaPlatformButton | undefined {
  const entry = getCtaChannelById(key)
  return entry ? toCtaPlatformButton(entry) : undefined
}

/** @deprecated Use getCtaChannelsForCategory */
export function getButtonsForCategory(category: PlatformCategory): CtaPlatformButton[] {
  return getCtaChannelsForCategory(category).map(toCtaPlatformButton)
}

export function getChannelIdsInCategory(
  category: PlatformCategory
): { channelId: string; label: string }[] {
  return getCtaChannelsForCategory(category).map((c) => ({
    channelId: c.channelId,
    label: c.label,
  }))
}

/** Channel count per category tab (not per-type count). */
export function getChannelCountByCategory(): Record<PlatformCategory, number> {
  const counts = {} as Record<PlatformCategory, number>
  for (const tab of CTA_PLATFORM_CATEGORY_TABS) {
    counts[tab.id] = getCtaChannelsForCategory(tab.id).length
  }
  return counts
}

/** @deprecated Channel types removed from CTA landing UI */
export function getButtonsForChannelInCategory(
  category: PlatformCategory,
  channelId: string
): CtaPlatformButton[] {
  const entry = getCtaChannelsForCategory(category).find((c) => c.channelId === channelId)
  return entry ? [toCtaPlatformButton(entry)] : []
}

export function channelTabLabel(btn: CtaPlatformButton): string {
  return btn.label.trim()
}
