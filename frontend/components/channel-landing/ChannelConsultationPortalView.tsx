'use client'

import React, { useCallback, useMemo, useRef } from 'react'
import type { ChannelLandingPage } from '@/types/channelLandingPage'
import { usePortalThemeMode } from '@/hooks/usePortalThemeMode'
import {
  getPlatformOfferPack,
  PROFESSIONAL_FLOW,
  usesProConsultationPortalLayout,
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
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'

type Props = {
  page: ChannelLandingPage
  isPreview?: boolean
}

function flowSectionOrder(flow: PortalSectionId[], id: PortalSectionId): number {
  const i = flow.indexOf(id)
  return i >= 0 ? i : 99
}

/**
 * All /go/{slug} portals: same PROFESSIONAL_FLOW DOM order; website/webinar use pro shell
 * (gradient + glass). Per-slug theme and copy only — no cross-slug navigation hub.
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
  const flow = pack?.flowOrder ?? PROFESSIONAL_FLOW
  const sectionOrder = (id: PortalSectionId) => flowSectionOrder(flow, id)
  const tiers = page.consultationTiers ?? []
  const scheduleCta = resolveScheduleTierCta(page.channelId, page.primaryButtonText ?? theme.scheduleTierCta)
  const layoutVariant = pack?.layoutVariant ?? 'minimal'
  const proPortalShell = usesProConsultationPortalLayout(page.channelId)
  const isWebinarPortal = page.channelId === 'webinar'

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
  const showHeroCard = sectionOrder('hero_card') < 99

  const sectionProps: PortalSectionProps = {
    page,
    theme,
    sectionOrder: 0,
    channelId: page.channelId,
    layoutVariant,
    isImpulseFlow: false,
    proPortalShell,
    isLeadHero,
    colorMode,
    onSetColorMode: setColorMode,
    onBookMentor: hasFreeIntroTier ? undefined : bookDiscovery,
    scheduleCta,
  }

  const contentWidth = portalShellMaxWidthClass(layoutVariant)

  const renderFlowSection = (id: PortalSectionId): React.ReactNode => {
    const order = sectionOrder(id)
    const props: PortalSectionProps = { ...sectionProps, sectionOrder: order }

    switch (id) {
      case 'presence':
        return null
      case 'hero':
        return <ChannelPortalHeroHeader key={id} {...props} />
      case 'context':
        return <ChannelPortalContextSection key={id} {...props} />
      case 'webinar_media':
        return isWebinarPortal ? <ChannelPortalWebinarMedia key={id} {...props} /> : null
      case 'featured_pathways':
        return <PortalFeaturedPathways key={id} page={page} theme={theme} sectionOrder={order} />
      case 'trust':
        return <ChannelPortalTrustLine key={id} {...props} />
      case 'hero_card':
        return showHeroCard ? <ChannelPortalHeroCard key={id} {...props} /> : null
      case 'tiers':
        return (
          <div key={id} ref={tiersRef} style={{ order }}>
            <ChannelPortalTiersSection {...props} tiers={tiers} scheduleCta={scheduleCta} />
          </div>
        )
      case 'social_proof':
        return <ChannelPortalSocialProof key={id} {...props} />
      case 'credibility':
        return <ChannelPortalCredibility key={id} {...props} />
      case 'qualification':
        return <ChannelPortalQualification key={id} {...props} />
      case 'faq':
        return <ChannelPortalFaq key={id} {...props} />
      case 'pathway_actions':
        return <PortalPathwayActions key={id} page={page} theme={theme} sectionOrder={order} />
      case 'form':
        return <ChannelPortalBookingForm key={id} {...props} />
      case 'final_cta':
        return (
          <ChannelPortalFinalCta
            key={id}
            {...props}
            onPrimaryClick={bookFinalCtaTier}
            scheduleCta={scheduleCta}
          />
        )
      case 'social_footer':
        return (
          <div key={id} style={{ order }}>
            <ChannelPortalSocialFooter theme={theme} />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={`portal-root relative z-10 min-h-screen flex flex-col overflow-x-hidden pb-20 sm:pb-0${proPortalShell ? ' portal-website selection:bg-brand-orange selection:text-white' : ''}${isWebinarPortal ? ' portal-webinar' : ''}${page.channelId === 'beehiiv' ? ' portal-beehiiv' : ''}`}
      style={{
        fontFamily: proPortalShell ? undefined : theme.fontFamily,
        backgroundColor: proPortalShell ? undefined : theme.background,
        color: theme.text,
        ...cssVars,
      }}
      data-platform={theme.channelId}
      data-layout={layoutVariant}
      data-color-mode={colorMode}
    >
      {proPortalShell ? (
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
            proPortalShell ? ' relative' : ' sticky top-0'
          }`}
          role="status"
        >
          Draft preview — not visible to the public until you publish.
        </div>
      )}

      <ChannelPortalPresenceStrip {...sectionProps} sectionOrder={sectionOrder('presence')} />

      <div className={`${contentWidth} flex flex-col px-4 sm:px-5 py-6 sm:py-10`}>
        {flow.map((id) => renderFlowSection(id))}
      </div>

      <ChannelPortalStickyCta
        channelId={page.channelId}
        theme={theme}
        label={scheduleCta}
        onClick={bookDiscovery}
      />
    </div>
  )
}
