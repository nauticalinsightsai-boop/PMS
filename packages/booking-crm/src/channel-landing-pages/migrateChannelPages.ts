import { CTA_PLATFORM_BUTTONS } from '../constants/ctaPlatformButtons'
import { getChannelById } from '../constants/channelGroups'
import type { ChannelLandingPage } from '../types/channelLandingPage'
import { slugifyChannelKey } from '../types/channelLandingPage'

/** Map legacy channel-type keys and slugs to platform channel id (e.g. bluesky-feed → bluesky). */
export function resolveChannelIdFromLegacyKey(key: string): string | null {
  const trimmed = key.trim()
  if (!trimmed) return null
  if (getChannelById(trimmed)) return trimmed

  const byType = CTA_PLATFORM_BUTTONS.find((b) => b.channelTypeId === trimmed)
  if (byType) return byType.channelId

  const normalized = slugifyChannelKey(trimmed)
  const bySlug = CTA_PLATFORM_BUTTONS.find(
    (b) => slugifyChannelKey(b.channelTypeId) === normalized
  )
  if (bySlug) return bySlug.channelId

  if (getChannelById(normalized)) return normalized

  return null
}

function pickPreferredPage(a: ChannelLandingPage, b: ChannelLandingPage): ChannelLandingPage {
  if (a.status === 'published' && b.status !== 'published') return a
  if (b.status === 'published' && a.status !== 'published') return b
  return a.updatedAt >= b.updatedAt ? a : b
}

/**
 * One landing page per channel (bluesky, facebook, …), not per channel type.
 * Merges legacy per-type entries into a single channel record.
 */
export function migratePagesToChannelLevel(
  pages: Record<string, ChannelLandingPage>
): { pages: Record<string, ChannelLandingPage>; changed: boolean } {
  const out: Record<string, ChannelLandingPage> = {}
  let changed = false

  for (const [key, raw] of Object.entries(pages)) {
    const channelId =
      resolveChannelIdFromLegacyKey(raw.channelId) ??
      resolveChannelIdFromLegacyKey(raw.channelKey) ??
      resolveChannelIdFromLegacyKey(key)

    if (!channelId) continue

    const channel = getChannelById(channelId)
    const normalized: ChannelLandingPage = {
      ...raw,
      channelKey: channelId,
      channelId,
      label: channel?.label ?? raw.label,
      subtitle: undefined,
      slug: slugifyChannelKey(
        resolveChannelIdFromLegacyKey(raw.slug) ? channelId : raw.slug || channelId
      ),
    }

    if (key !== channelId) changed = true
    if (raw.channelKey !== channelId || raw.subtitle) changed = true

    const existing = out[channelId]
    if (!existing) {
      out[channelId] = normalized
    } else {
      changed = true
      out[channelId] = pickPreferredPage(existing, normalized)
    }
  }

  if (Object.keys(out).length !== Object.keys(pages).length) changed = true

  return { pages: out, changed }
}
