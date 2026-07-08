import type { CtaPlatformButton } from '../constants/ctaPlatformButtons'
import { getCtaPlatformButtonByChannelKey } from '../constants/ctaPlatformButtons'
import {
  DEFAULT_CONSULTATION_TIERS,
  type ChannelLandingPage,
} from '../types/channelLandingPage'
import {
  getPlatformPortalCopy,
  getScheduleTierCta,
  isGenericPlatformHeadline,
} from './platformThemes'
import { resolveScheduleTierCta } from './channelPortalCopy'
import { getPackConsultationTiers } from './platformOfferPack'
import { mergePortalConversion } from './portalConversionPacks'
import { getChannelPortalCopy } from './channelPortalCopy'
import { getCertificationPortalSurface } from './portalCertificationCopy'
import { usesPortalWebsiteLayoutChrome } from './platformOfferPack'

const GENERIC_INTRO_CTAS = new Set([
  'talk to a mentor',
  'schedule a call with a mentor',
  'schedule inline',
  'schedule consultation',
  'schedule a mentor call',
  'schedule a mentor intro',
])

function isGenericIntroCta(label: string | undefined, channelId: string): boolean {
  const trimmed = label?.trim()
  if (!trimmed) return true
  if (usesPortalWebsiteLayoutChrome(channelId)) return false
  return GENERIC_INTRO_CTAS.has(trimmed.toLowerCase())
}
import { migratePageToPmsPortalTemplate, publicTierIdsForChannel } from '../pmsPortalTemplate'
import { getLearnerPortalSurfaceCopy } from './portalLearnerCopy'
import { normalizePortalCopyDeep } from './copyNormalize'

const EVIDENCE_SNIPPET: Record<string, string> = {
  webinar: 'the webinar title or replay link',
  website: 'the page or asset on the site',
}

export function buildPortalDefaults(btn: CtaPlatformButton): Partial<ChannelLandingPage> {
  const copy = getPlatformPortalCopy(btn)
  const tiers = getPackConsultationTiers(btn.channelId)

  return {
    contextLabel: copy.contextLabel,
    headline: copy.headline,
    subheadline: copy.subheadline,
    body: '',
    targetMessage: copy.targetMessage,
    showSyncBanner: true,
    syncBannerLabel: 'Sync system',
    availabilityLabel: copy.availabilityLabel,
    consultationTiers: tiers,
    showBookingForm: true,
    primaryAction: 'booking_form',
    primaryButtonText: getScheduleTierCta(btn.channelId),
  }
}

/** Fill portal fields for stored pages created before consultation layout. */
export function enrichChannelLandingPage(page: ChannelLandingPage): ChannelLandingPage {
  const migrated = migratePageToPmsPortalTemplate(page)
  const btn = getCtaPlatformButtonByChannelKey(migrated.channelKey)
  const copy = btn ? getPlatformPortalCopy(btn) : null

  const evidence =
    EVIDENCE_SNIPPET[migrated.channelId] ?? `what brought you from ${migrated.label ?? migrated.channelId}`
  const surface = getLearnerPortalSurfaceCopy(
    migrated.channelId,
    migrated.label ?? migrated.channelId,
    evidence
  )
  const channelCopy = getChannelPortalCopy(migrated.channelId)
  const certSurface = getCertificationPortalSurface(migrated.channelId)

  return normalizePortalCopyDeep({
    ...migrated,
    contextLabel: migrated.contextLabel || channelCopy?.contextLabel || copy?.contextLabel || '',
    headline: certSurface.headline,
    subheadline: certSurface.subheadline,
    targetMessage: certSurface.targetMessage,
    showSyncBanner: migrated.showSyncBanner ?? false,
    syncBannerLabel: migrated.syncBannerLabel || '',
    availabilityLabel:
      migrated.availabilityLabel || channelCopy?.availabilityLabel || surface.availabilityLabel,
    consultationTiers: mergeTierCtaLabels(
      consultationTiersForChannel(
        getPackConsultationTiers(migrated.channelId, migrated.consultationTiers),
        migrated.channelId,
      ),
      migrated.channelId,
    ),
    webinarAbout: migrated.webinarAbout,
    webinarVideoUrl: migrated.webinarVideoUrl,
    conversion: mergePortalConversion(migrated.channelId, migrated.conversion),
    showBookingForm: migrated.showBookingForm ?? true,
  })
}

function mapStoredTierId(id: string): string {
  if (id === 'discovery') return 'mentor-intro'
  if (id === 'executive') return 'career-pathway'
  if (id === 'design-review') return 'services-detail'
  return id
}

function consultationTiersForChannel(
  tiers: ChannelLandingPage['consultationTiers'],
  channelId: string
): ChannelLandingPage['consultationTiers'] {
  const allowed = new Set(publicTierIdsForChannel(channelId))
  return tiers.filter((t) => allowed.has(mapStoredTierId(t.id)))
}

function mergeTierCtaLabels(tiers: ChannelLandingPage['consultationTiers'], channelId: string) {
  const copy = getChannelPortalCopy(channelId)
  const baseCta = copy?.scheduleTierCta ?? resolveScheduleTierCta(channelId)
  const layoutChrome = usesPortalWebsiteLayoutChrome(channelId)
  const introCta = layoutChrome ? 'Talk to a mentor' : baseCta
  return consultationTiersForChannel(tiers, channelId).map((t) => {
    if (t.ctaLabel && !isGenericIntroCta(t.ctaLabel, channelId)) return t
    if (channelId === 'webinar') {
      if (t.id === 'discovery' || t.id === 'mentor-intro')
        return { ...t, ctaLabel: introCta }
      if (t.id === 'executive' || t.id === 'career-pathway')
        return { ...t, ctaLabel: 'Schedule a pathway session', badge: t.badge ?? 'Most Popular' }
    }
    if (t.id === 'discovery' || t.id === 'mentor-intro') {
      return { ...t, ctaLabel: introCta }
    }
    if (t.id === 'executive' || t.id === 'career-pathway') {
      return { ...t, ctaLabel: 'Schedule a pathway session', badge: t.badge ?? 'Most Popular' }
    }
    if (t.id === 'design-review' || t.id === 'services-detail') {
      const servicesCta = usesPortalWebsiteLayoutChrome(channelId)
        ? 'Talk to an expert'
        : 'Talk to an advisor'
      return { ...t, ctaLabel: t.ctaLabel ?? servicesCta }
    }
    return t
  })
}

export function mergeChannelLandingPage(
  page: ChannelLandingPage | null,
  btn: CtaPlatformButton
): ChannelLandingPage {
  const base = buildPortalDefaults(btn)
  const now = new Date().toISOString()
  if (!page) {
    return enrichChannelLandingPage({
      channelKey: btn.channelId,
      channelId: btn.channelId,
      label: btn.label,
      slug: btn.channelId,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      headline: base.headline ?? `${btn.label}. Schedule a mentor call`,
      subheadline: base.subheadline ?? '',
      body: '',
      contextLabel: base.contextLabel ?? '',
      targetMessage: base.targetMessage ?? '',
      showSyncBanner: base.showSyncBanner ?? true,
      syncBannerLabel: base.syncBannerLabel ?? 'Sync system',
      availabilityLabel: base.availabilityLabel ?? 'Accepting advisory roles',
      consultationTiers: base.consultationTiers ?? DEFAULT_CONSULTATION_TIERS,
      primaryButtonText: getScheduleTierCta(btn.channelId),
      primaryAction: 'booking_form',
      contactService: 'Advisory',
      showBookingForm: true,
      collectCompany: false,
      theme: 'brand',
      showLogo: true,
    })
  }

  const useBaseHeadline = !page.headline?.trim() || isGenericPlatformHeadline(page)
  const useBaseTarget = !page.targetMessage?.trim()

  return enrichChannelLandingPage({
    ...page,
    contextLabel: page.contextLabel || base.contextLabel || '',
    headline: useBaseHeadline ? (base.headline ?? page.headline) : page.headline,
    targetMessage: useBaseTarget ? (base.targetMessage ?? '') : page.targetMessage,
    showSyncBanner: page.showSyncBanner ?? true,
    syncBannerLabel: page.syncBannerLabel || base.syncBannerLabel || 'Sync system',
    availabilityLabel: page.availabilityLabel || base.availabilityLabel || 'Accepting advisory roles',
    consultationTiers: mergeTierCtaLabels(
      getPackConsultationTiers(
        page.channelId,
        page.consultationTiers?.length ? page.consultationTiers : base.consultationTiers
      ),
      page.channelId
    ),
    conversion: mergePortalConversion(page.channelId, page.conversion),
    showBookingForm: page.showBookingForm ?? true,
    primaryButtonText: resolveScheduleTierCta(page.channelId, page.primaryButtonText),
  })
}