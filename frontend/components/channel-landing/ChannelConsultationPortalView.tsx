'use client'

import React, { useCallback, useMemo, useRef } from 'react'
import type { ChannelLandingPage } from '@/types/channelLandingPage'
import { usePortalThemeMode } from '@/hooks/usePortalThemeMode'
import {
  getPlatformOfferPack,
  isImpulseLayoutChannel,
  type PortalSectionId,
} from '@/lib/channel-landing-pages/platformOfferPack'
import { portalShellMaxWidthClass } from '@/lib/channel-landing-pages/portalLayoutClasses'
import { resolveScheduleTierCta } from '@/lib/channel-landing-pages/channelPortalCopy'
import {
  resolvePortalTheme,
  portalThemeToCssVars,
} from '@/lib/channel-landing-pages/resolvePortalTheme'
import ChannelPortalSocialFooter from '@/components/channel-landing/ChannelPortalSocialFooter'
import ChannelPortalPresenceStrip from '@/components/channel-landing/portal/ChannelPortalPresenceStrip'
import ChannelPortalHeroHeader from '@/components/channel-landing/portal/ChannelPortalHeroHeader'
import ChannelPortalContextSection from '@/components/channel-landing/portal/ChannelPortalContextSection'
import ChannelPortalWebinarMedia from '@/components/channel-landing/portal/ChannelPortalWebinarMedia'
import ChannelPortalTiersSection from '@/components/channel-landing/portal/ChannelPortalTiersSection'
import ChannelPortalTrustLine from '@/components/channel-landing/portal/ChannelPortalTrustLine'
import ChannelPortalBookingForm from '@/components/channel-landing/portal/ChannelPortalBookingForm'
import ChannelPortalQualification from '@/components/channel-landing/portal/ChannelPortalQualification'
import ChannelPortalSocialProof from '@/components/channel-landing/portal/ChannelPortalSocialProof'
import ChannelPortalCredibility from '@/components/channel-landing/portal/ChannelPortalCredibility'
import ChannelPortalFaq from '@/components/channel-landing/portal/ChannelPortalFaq'
import ChannelPortalFinalCta from '@/components/channel-landing/portal/ChannelPortalFinalCta'
import ChannelPortalStickyCta from '@/components/channel-landing/portal/ChannelPortalStickyCta'
import PortalFeaturedPathways from '@/components/channel-landing/portal/PortalFeaturedPathways'
import PortalPathwayActions from '@/components/channel-landing/portal/PortalPathwayActions'
import ChannelPortalHeroCard from '@/components/channel-landing/portal/ChannelPortalHeroCard'
import { scheduleTierClick } from '@/components/channel-landing/portal/scheduleTierClick'

type Props = {
  page: ChannelLandingPage
  isPreview?: boolean
}

const LEGACY_FLOW: PortalSectionId[] = [
  'presence',
  'hero',
  'context',
  'tiers',
  'social_proof',
  'faq',
  'final_cta',
  'social_footer',
]

function flowSectionOrder(flow: PortalSectionId[], id: PortalSectionId): number {
  const i = flow.indexOf(id)
  return i >= 0 ? i : 99
}

/**
 * Conversion flow: presence → hero (Region/Store/Member) → context → certs → hero card → tiers → proof → FAQ.
 * Website uses presence strip + in-flow hero (not sticky top bar). No hero CTA when a free intro tier exists.
 */
export default function ChannelConsultationPortalView({ page, isPreview }: Props) {
  const { colorMode, setColorMode } = usePortalThemeMode(page.channelId)
  const tiersRef = useRef<HTMLDivElement>(null)
  const theme = useMemo(
    () => resolvePortalTheme(page.channelId, colorMode, page.subtitle),
    [page.channelId, page.subtitle, colorMode]
  )
  const cssVars = useMemo(() => portalThemeToCssVars(theme), [theme])
  const pack = useMemo(() => getPlatformOfferPack(page.channelId), [page.channelId])
  const flow = pack?.flowOrder ?? LEGACY_FLOW
  const sectionOrder = (id: PortalSectionId) => flowSectionOrder(flow, id)
  const tiers = page.consultationTiers ?? []
  const scheduleCta = resolveScheduleTierCta(page.channelId, page.primaryButtonText ?? theme.scheduleTierCta)
  const layoutVariant = pack?.layoutVariant ?? 'minimal'
  const isImpulseFlow = isImpulseLayoutChannel(page.channelId)
  const isWebinarPortal = page.channelId === 'webinar'
  const isWebsitePortal = page.channelId === 'website'

  const discoveryTier =
    tiers.find((t) => t.id === 'mentor-intro') ??
    tiers.find((t) => t.id === 'discovery') ??
    tiers[0]
  const hasFreeIntroTier = Boolean(discoveryTier?.isFree)

  const scrollToTiers = useCallback(() => {
    tiersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const bookDiscovery = useCallback(() => {
    if (discoveryTier) scheduleTierClick(page, discoveryTier)
    else scrollToTiers()
  }, [page, discoveryTier, scrollToTiers])

  const bookFinalCtaTier = useCallback(() => {
    if (discoveryTier) scheduleTierClick(page, discoveryTier)
    else scrollToTiers()
  }, [page, discoveryTier, scrollToTiers])

  const isLeadHero = sectionOrder('hero') < sectionOrder('context')
  /** Website: presence strip + in-column hero per wireframe. Other pro portals: sticky top hero bar. */
  const stickyTopHero = !isImpulseFlow && !isWebsitePortal
  const pinHeroToViewport = stickyTopHero
  const heroCardOrder = sectionOrder('hero_card')
  const showHeroCard = heroCardOrder < 99

  const sectionProps = {
    page,
    theme,
    sectionOrder: 0,
    channelId: page.channelId,
    layoutVariant,
    isImpulseFlow,
    isLeadHero,
    colorMode,
    onSetColorMode: setColorMode,
    onBookMentor: hasFreeIntroTier ? undefined : bookDiscovery,
  }

  const contentWidth = portalShellMaxWidthClass(layoutVariant)

  const contextOrder = sectionOrder('context')
  const afterContextOrder = contextOrder + (isWebinarPortal ? 1 : 0.5)
  const pathwaysOrder = isWebsitePortal && showHeroCard ? heroCardOrder - 0.5 : afterContextOrder
  const trustOrder = isWebsitePortal ? sectionOrder('trust') : afterContextOrder + 0.45
  const tiersOrder = isWebsitePortal ? sectionOrder('tiers') : afterContextOrder + 0.5

  return (
    <div
      className={`portal-root relative z-10 min-h-screen flex flex-col overflow-x-hidden pb-20 sm:pb-0${isImpulseFlow ? ' portal-impulse-flow' : ''}${isWebsitePortal ? ' portal-website selection:bg-brand-orange selection:text-white' : ''}${isWebinarPortal ? ' portal-webinar' : ''}${page.channelId === 'beehiiv' ? ' portal-beehiiv' : ''}`}
      style={{
        fontFamily: isWebsitePortal ? undefined : theme.fontFamily,
        backgroundColor: isWebsitePortal ? undefined : theme.background,
        color: theme.text,
        ...cssVars,
      }}
      data-platform={theme.channelId}
      data-layout={layoutVariant}
      data-color-mode={colorMode}
    >
      {isWebsitePortal ? (
        <div className="portal-website-ambience" aria-hidden>
          <div className="portal-website-orb portal-website-orb--orange" />
          <div className="portal-website-orb portal-website-orb--purple" />
          <div className="portal-website-orb portal-website-orb--purple-soft" />
          <div className="portal-website-orb portal-website-orb--cyan" />
        </div>
      ) : null}
      {isPreview && (
        <div
          className={`portal-preview-banner z-50 text-center text-meta font-medium py-2.5 px-4${
            pinHeroToViewport || isWebsitePortal ? ' relative' : ' sticky top-0'
          }`}
          role="status"
        >
          Draft preview — not visible to the public until you publish.
        </div>
      )}

      {stickyTopHero ? (
        <div
          className={`portal-top-hero shrink-0 border-b${pinHeroToViewport ? ' sticky top-0 z-[60]' : ''}`}
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.cardBorder,
          }}
        >
          <div className={`${contentWidth} px-4 sm:px-5 py-3 sm:py-4`}>
            <ChannelPortalHeroHeader {...sectionProps} sectionOrder={0} topBar />
          </div>
        </div>
      ) : (
        <ChannelPortalPresenceStrip {...sectionProps} sectionOrder={sectionOrder('presence')} />
      )}

      <div className={`${contentWidth} px-4 sm:px-5 py-6 sm:py-10 flex flex-col`}>
        {isWebsitePortal ? (
          <div className="flex flex-col">
            <ChannelPortalHeroHeader {...sectionProps} sectionOrder={0} />
            <ChannelPortalContextSection {...sectionProps} sectionOrder={0} />
            <PortalFeaturedPathways page={page} theme={theme} />
            {showHeroCard ? <ChannelPortalHeroCard {...sectionProps} sectionOrder={0} /> : null}
            <ChannelPortalTrustLine {...sectionProps} sectionOrder={0} />
            <div ref={tiersRef}>
              <ChannelPortalTiersSection
                {...sectionProps}
                sectionOrder={0}
                tiers={tiers}
                scheduleCta={scheduleCta}
              />
            </div>
          </div>
        ) : (
          <>
            {!stickyTopHero ? (
              <ChannelPortalHeroHeader {...sectionProps} sectionOrder={sectionOrder('hero')} />
            ) : null}
            <ChannelPortalContextSection {...sectionProps} sectionOrder={sectionOrder('context')} />
            {isWebinarPortal ? (
              <ChannelPortalWebinarMedia
                {...sectionProps}
                sectionOrder={sectionOrder('context') + 0.5}
              />
            ) : null}
            <div style={{ order: pathwaysOrder }}>
              <PortalFeaturedPathways page={page} theme={theme} />
            </div>
            {showHeroCard ? (
              <ChannelPortalHeroCard {...sectionProps} sectionOrder={heroCardOrder} />
            ) : null}
            <ChannelPortalTrustLine {...sectionProps} sectionOrder={trustOrder} />
            <div ref={tiersRef} style={{ order: tiersOrder }}>
              <ChannelPortalTiersSection
                {...sectionProps}
                sectionOrder={0}
                tiers={tiers}
                scheduleCta={scheduleCta}
              />
            </div>
          </>
        )}
        <ChannelPortalSocialProof {...sectionProps} sectionOrder={sectionOrder('social_proof')} />
        <ChannelPortalCredibility {...sectionProps} sectionOrder={sectionOrder('credibility')} />
        <ChannelPortalQualification {...sectionProps} sectionOrder={sectionOrder('qualification')} />
        <ChannelPortalFaq {...sectionProps} sectionOrder={sectionOrder('faq')} />
        <PortalPathwayActions
          page={page}
          theme={theme}
          sectionOrder={sectionOrder('faq') + 0.5}
        />
        <ChannelPortalBookingForm {...sectionProps} sectionOrder={sectionOrder('form')} />
        <ChannelPortalFinalCta
          {...sectionProps}
          sectionOrder={sectionOrder('final_cta')}
          onPrimaryClick={bookFinalCtaTier}
        />
        <div style={{ order: sectionOrder('social_footer') }}>
          <ChannelPortalSocialFooter theme={theme} />
        </div>
      </div>

      <ChannelPortalStickyCta
        channelId={page.channelId}
        theme={theme}
        label="Talk to a mentor"
        onClick={bookDiscovery}
      />
    </div>
  )
}
