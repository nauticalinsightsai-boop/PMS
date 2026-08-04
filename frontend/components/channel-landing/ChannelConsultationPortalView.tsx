'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSetPortalRegionTheme } from '@/contexts/PortalRegionThemeContext'
import type { ChannelLandingPage } from '@/types/channelLandingPage'
import { usePortalThemeMode } from '@/hooks/usePortalThemeMode'
import {
  getPlatformOfferPack,
  PROFESSIONAL_FLOW,
  usesPortalWebsiteLayoutChrome,
  usesProConsultationPortalLayout,
  type PortalSectionId,
} from '@/lib/channel-landing-pages/platformOfferPack'
import { portalShellMaxWidthClass } from '@/lib/channel-landing-pages/portalLayoutClasses'
import { portalSpacing } from '@/lib/channel-landing-pages/portalSpacing'
import { resolveScheduleTierCta } from '@/lib/channel-landing-pages/channelPortalCopy'
import {
  resolvePortalTheme,
  portalThemeToCssVars,
} from '@/lib/channel-landing-pages/resolvePortalTheme'
import ChannelPortalSocialFooter from '@/components/channel-landing/ChannelPortalSocialFooter'
import ChannelPortalPresenceStrip from '@/components/channel-landing/portal/ChannelPortalPresenceStrip'
import ChannelPortalHeroHeader from '@/components/channel-landing/portal/ChannelPortalHeroHeader'
import ChannelPortalContextSection from '@/components/channel-landing/portal/ChannelPortalContextSection'
import ChannelPortalRoadmapForm from '@/components/channel-landing/portal/ChannelPortalRoadmapForm'
import ChannelPortalWebinarMedia from '@/components/channel-landing/portal/ChannelPortalWebinarMedia'
import ChannelPortalTiersSection from '@/components/channel-landing/portal/ChannelPortalTiersSection'
import ChannelPortalQualification from '@/components/channel-landing/portal/ChannelPortalQualification'
import ChannelPortalSocialProof from '@/components/channel-landing/portal/ChannelPortalSocialProof'
import ChannelPortalFaq from '@/components/channel-landing/portal/ChannelPortalFaq'
import ChannelPortalFinalCta from '@/components/channel-landing/portal/ChannelPortalFinalCta'
import ChannelPortalStickyCta from '@/components/channel-landing/portal/ChannelPortalStickyCta'
import PortalFeaturedPathways from '@/components/channel-landing/portal/PortalFeaturedPathways'
import PortalPathwayActions from '@/components/channel-landing/portal/PortalPathwayActions'
import { scheduleTierClick } from '@/components/channel-landing/portal/scheduleTierClick'
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'
import { preloadCalendlyPopupHostStyles } from '@/lib/calendly/popup-enhancements'
import { preloadCalendlyPopupWidget } from '@/lib/calendly/open-themed-popup'

type Props = {
  page: ChannelLandingPage
  isPreview?: boolean
}

function flowSectionOrder(flow: PortalSectionId[], id: PortalSectionId): number {
  const i = flow.indexOf(id)
  return i >= 0 ? i : 99
}

/**
 * Instagram reference structure for all scope-41 /go/{slug} portals:
 * presence → hero → context → roadmap form → pathways → tiers → credibility tabs →
 * qualification → FAQ → final CTA → footer. Marketing gradient/orbs only on website/webinar.
 */
export default function ChannelConsultationPortalView({ page, isPreview }: Props) {
  const { colorMode, setColorMode } = usePortalThemeMode(page.channelId)
  const setPortalRegionTheme = useSetPortalRegionTheme()
  const tiersRef = useRef<HTMLDivElement>(null)
  const [roadmapSubmitted, setRoadmapSubmitted] = useState(false)
  const theme = useMemo(
    () => resolvePortalTheme(page.channelId, colorMode, page.subtitle),
    [page.channelId, page.subtitle, colorMode]
  )

  useEffect(() => {
    if (!roadmapSubmitted) return
    const frame = window.requestAnimationFrame(() => {
      document
        .querySelector('.portal-featured-pathways')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [roadmapSubmitted])

  useEffect(() => {
    setPortalRegionTheme(theme)
    return () => setPortalRegionTheme(null)
  }, [theme, setPortalRegionTheme])

  useEffect(() => {
    preloadCalendlyPopupHostStyles()
    preloadCalendlyPopupWidget()
  }, [])
  const cssVars = useMemo(() => portalThemeToCssVars(theme), [theme])
  const pack = useMemo(() => getPlatformOfferPack(page.channelId), [page.channelId])
  const flow = pack?.flowOrder ?? PROFESSIONAL_FLOW
  const sectionOrder = (id: PortalSectionId) => flowSectionOrder(flow, id)
  const tiers = page.consultationTiers ?? []
  const scheduleCta = resolveScheduleTierCta(page.channelId, page.primaryButtonText ?? theme.scheduleTierCta)
  const layoutVariant = pack?.layoutVariant ?? 'minimal'
  const portalLayoutChrome = usesPortalWebsiteLayoutChrome(page.channelId)
  const marketingAmbience = usesProConsultationPortalLayout(page.channelId)
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
    if (discoveryTier) scheduleTierClick(page, discoveryTier, { theme, colorMode })
    else scrollToTiers()
  }, [page, discoveryTier, scrollToTiers, theme, colorMode])

  const sectionProps: PortalSectionProps = {
    page,
    theme,
    sectionOrder: 0,
    channelId: page.channelId,
    layoutVariant,
    isImpulseFlow: false,
    portalLayoutChrome,
    marketingAmbience,
    isLeadHero: false,
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
      case 'roadmap_form':
        return (
          <ChannelPortalRoadmapForm
            key={id}
            {...props}
            onSubmitted={() => setRoadmapSubmitted(true)}
          />
        )
      case 'webinar_media':
        return isWebinarPortal ? <ChannelPortalWebinarMedia key={id} {...props} /> : null
      case 'featured_pathways':
        if (!roadmapSubmitted) return null
        return <PortalFeaturedPathways key={id} page={page} theme={theme} sectionOrder={order} />
      case 'tiers':
        return (
          <div key={id} ref={tiersRef} style={{ order }}>
            <ChannelPortalTiersSection {...props} tiers={tiers} scheduleCta={scheduleCta} />
          </div>
        )
      case 'social_proof':
        return <ChannelPortalSocialProof key={id} {...props} />
      case 'qualification':
        return <ChannelPortalQualification key={id} {...props} />
      case 'faq':
        return <ChannelPortalFaq key={id} {...props} />
      case 'pathway_actions':
        return <PortalPathwayActions key={id} page={page} theme={theme} sectionOrder={order} />
      case 'final_cta':
        return <ChannelPortalFinalCta key={id} {...props} />
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
      className={`portal-root relative z-10 ${portalSpacing.root}${marketingAmbience ? ' portal-website selection:bg-brand-orange selection:text-white' : ''}${isWebinarPortal ? ' portal-webinar' : ''}${page.channelId === 'beehiiv' ? ' portal-beehiiv' : ''}${page.channelId === 'linkedin' ? ' portal-linkedin' : ''}`}
      style={{
        fontFamily: marketingAmbience ? undefined : theme.fontFamily,
        backgroundColor: marketingAmbience ? undefined : theme.background,
        color: theme.text,
        ...cssVars,
      }}
      data-platform={theme.channelId}
      data-layout={layoutVariant}
      data-color-mode={colorMode}
    >
      {marketingAmbience ? (
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
            portalLayoutChrome ? ' relative' : ' sticky top-0'
          }`}
          role="status"
        >
          Draft preview: not visible to the public until you publish.
        </div>
      )}

      <ChannelPortalPresenceStrip {...sectionProps} sectionOrder={sectionOrder('presence')} />

      <div className={`${contentWidth} ${portalSpacing.content}`}>
        {flow.map((id) => renderFlowSection(id))}
      </div>

      <ChannelPortalStickyCta theme={theme} />
    </div>
  )
}
