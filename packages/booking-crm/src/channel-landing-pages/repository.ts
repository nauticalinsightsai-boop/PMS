import {
  readChannelLandingPagesFile,
  writeChannelLandingPagesFile,
} from '../dataFileUtils'
import {
  type ChannelLandingPage,
  defaultChannelLandingPage,
  publicSlugForChannel,
  slugifyChannelKey,
} from '../types/channelLandingPage'
import { enrichChannelLandingPage, mergeChannelLandingPage } from './portalDefaults'
import { assertTierDurationsValid } from './tierDuration'
import {
  getCtaPlatformButtonByChannelKey,
} from '../constants/ctaPlatformButtons'
import {
  migratePagesToChannelLevel,
  resolveChannelIdFromLegacyKey,
} from './migrateChannelPages'
import { assertPmsPortalTemplate } from '../pmsPortalTemplate'

function loadPages(): Record<string, ChannelLandingPage> {
  const file = readChannelLandingPagesFile()
  const { pages, changed } = migratePagesToChannelLevel(file.pages)
  if (changed) {
    writeChannelLandingPagesFile({ pages })
  }
  return pages
}

export function getAllChannelLandingPages(): Record<string, ChannelLandingPage> {
  return loadPages()
}

export function getChannelLandingPageByKey(channelKey: string): ChannelLandingPage | null {
  const channelId = resolveChannelIdFromLegacyKey(channelKey) ?? channelKey
  const page = loadPages()[channelId]
  return page ? enrichChannelLandingPage(page) : null
}

export function getPublishedChannelLandingPageBySlug(slug: string): ChannelLandingPage | null {
  const normalized = slug.toLowerCase().trim()
  const pages = loadPages()
  for (const page of Object.values(pages)) {
    if (page.status === 'published' && page.slug.toLowerCase() === normalized) {
      return enrichChannelLandingPage(page)
    }
  }
  return null
}

/** Draft or published — used for shareable `/go/{slug}?preview=1` links. */
export function getChannelLandingPageBySlug(slug: string): ChannelLandingPage | null {
  const normalized = slug.toLowerCase().trim()
  const pages = loadPages()
  for (const page of Object.values(pages)) {
    if (page.slug.toLowerCase() === normalized) {
      return enrichChannelLandingPage(page)
    }
  }
  return null
}

/**
 * Resolve a `/go/[slug]` page from saved data or platform defaults (preview only).
 * Slug is the channel id (e.g. `bluesky`, `facebook`). Legacy type slugs redirect to channel.
 */
export function resolveChannelLandingPageForGo(
  slug: string,
  options: { preview: boolean }
): ChannelLandingPage | null {
  const normalized = slug.toLowerCase().trim()
  const channelId = resolveChannelIdFromLegacyKey(normalized) ?? normalized

  const pages = loadPages()
  for (const page of Object.values(pages)) {
    const matchesSlug =
      page.slug.toLowerCase() === normalized ||
      publicSlugForChannel(page.channelId, page.slug) === normalized
    if (!matchesSlug) continue
    if (options.preview || page.status === 'published') {
      return enrichChannelLandingPage(page)
    }
  }

  if (options.preview) {
    const saved = getChannelLandingPageBySlug(normalized) ?? getChannelLandingPageByKey(channelId)
    if (saved) return saved
  } else {
    const published = getPublishedChannelLandingPageBySlug(normalized)
    if (published) return published
    const byChannelSlug = loadPages()
    for (const page of Object.values(byChannelSlug)) {
      if (page.status === 'published' && page.channelId === channelId) {
        return enrichChannelLandingPage(page)
      }
    }
  }

  if (!options.preview) return null

  const btn = getCtaPlatformButtonByChannelKey(channelId)
  if (btn) {
    return {
      ...mergeChannelLandingPage(null, btn),
      slug: slugifyChannelKey(channelId),
      status: 'draft',
    }
  }

  return null
}

export function ensureUniqueSlug(slug: string, exceptChannelKey?: string): string {
  const base = slugifyChannelKey(slug)
  const pages = loadPages()
  let candidate = base
  let n = 2
  while (true) {
    const taken = Object.values(pages).some(
      (p) => p.slug === candidate && p.channelKey !== exceptChannelKey
    )
    if (!taken) return candidate
    candidate = `${base}-${n}`
    n++
  }
}

export function upsertChannelLandingPage(
  channelKey: string,
  patch: Partial<ChannelLandingPage> & {
    channelId: string
    label: string
    subtitle?: string
  },
  intent: 'saveDraft' | 'publish'
): { page: ChannelLandingPage; publicUrl: string | null } {
  const channelId = resolveChannelIdFromLegacyKey(channelKey) ?? channelKey
  const file = readChannelLandingPagesFile()
  const { pages: migrated } = migratePagesToChannelLevel(file.pages)
  const existing = migrated[channelId]
  const now = new Date().toISOString()

  let page: ChannelLandingPage = existing
    ? {
        ...existing,
        ...patch,
        channelKey: channelId,
        channelId: patch.channelId,
        subtitle: undefined,
        updatedAt: now,
      }
    : {
        ...defaultChannelLandingPage({
          channelKey: channelId,
          channelId: patch.channelId,
          label: patch.label,
        }),
        ...patch,
        channelKey: channelId,
        channelId: patch.channelId,
        subtitle: undefined,
        updatedAt: now,
      }

  if (patch.slug !== undefined) {
    page.slug = ensureUniqueSlug(patch.slug, channelId)
  } else if (!existing) {
    page.slug = ensureUniqueSlug(channelId, channelId)
  }

  if (intent === 'publish') {
    page.status = 'published'
    page.publishedAt = now
    page.slug = ensureUniqueSlug(page.slug, channelId)
  } else {
    page.status = 'draft'
  }

  if (page.consultationTiers?.length) {
    assertTierDurationsValid(page.consultationTiers)
  }

  if (intent === 'publish') {
    assertPmsPortalTemplate(page)
  }

  const nextPages = { ...migrated }
  for (const key of Object.keys(nextPages)) {
    if (resolveChannelIdFromLegacyKey(key) === channelId && key !== channelId) {
      delete nextPages[key]
    }
  }
  nextPages[channelId] = page
  writeChannelLandingPagesFile({ pages: nextPages })

  const publicUrl =
    page.status === 'published' ? `/go/${page.slug}` : null

  return { page, publicUrl }
}

export function unpublishChannelLandingPage(channelKey: string): ChannelLandingPage | null {
  const channelId = resolveChannelIdFromLegacyKey(channelKey) ?? channelKey
  const pages = loadPages()
  const page = pages[channelId]
  if (!page) return null
  page.status = 'draft'
  page.updatedAt = new Date().toISOString()
  writeChannelLandingPagesFile({ pages: { ...pages, [channelId]: page } })
  return page
}
