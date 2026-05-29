'use client'

import { Star } from 'lucide-react'
import GlassCard from '@/components/ui/cards/GlassCard'
import { BRAND } from '@/lib/brand-voice'
import { getChannelPortalCopy } from '@/lib/channel-landing-pages/channelPortalCopy'
import { meetsContrast, pickReadableForeground } from '@/lib/channel-landing-pages/contrastUtils'
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'

export default function ChannelPortalHeroCard({ page, theme, sectionOrder, portalLayoutChrome }: PortalSectionProps) {
  const useSiteGlass = Boolean(portalLayoutChrome)
  const channelCopy = getChannelPortalCopy(page.channelId)
  const heroTitle = channelCopy?.heroCardTitle ?? theme.heroCardTitle
  const heroBody = channelCopy?.heroCardBody ?? theme.heroCardBody
  const badgeBg = theme.cardBg.startsWith('#') && theme.cardBg.length === 7 ? theme.cardBg : '#0F172A'
  const badgeText =
    theme.primary.startsWith('#') &&
    theme.primary.length === 7 &&
    meetsContrast(theme.primary, badgeBg, 4.5)
      ? theme.primary
      : pickReadableForeground(badgeBg)
  const badgeBorder =
    theme.cardBorder.startsWith('#') && theme.cardBorder.length === 7
      ? theme.cardBorder
      : `${badgeText}66`

  const inner = (
    <>
      <span
        className="inline-flex items-center gap-1.5 text-meta px-3 py-1 mb-4"
        style={
          useSiteGlass
            ? {
                borderRadius: theme.radius,
                border: `1px solid ${theme.cardBorder}`,
                color: badgeText,
                backgroundColor: `${badgeBg}80`,
                borderColor: badgeBorder,
              }
            : {
                borderRadius: theme.radius,
                border: `1px solid ${theme.heroText}33`,
                color: theme.heroText,
                opacity: 0.9,
              }
        }
      >
        <Star size={12} aria-hidden />
        {BRAND.name} · mentor booking
      </span>
      <h3
        className="text-h3 mb-2"
        style={{
          fontFamily: theme.fontFamily,
          color: useSiteGlass ? theme.text : theme.heroText,
        }}
      >
        {heroTitle}
      </h3>
      <p
        className="text-body-sm max-w-2xl"
        style={{ color: useSiteGlass ? theme.textMuted : theme.heroText, opacity: useSiteGlass ? 1 : 0.9 }}
      >
        {heroBody}
      </p>
    </>
  )

  if (useSiteGlass) {
    return (
      <GlassCard
        elevation="raised"
        liquid
        liquidIntensity={0.9}
        className="mb-2 sm:mb-2.5 p-6 sm:p-8 portal-website-hero-card portal-hero-card"
        style={{
          order: sectionOrder,
          borderRadius: theme.radiusLg,
          backgroundColor: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
        }}
        data-portal-glass="true"
      >
        {inner}
      </GlassCard>
    )
  }

  return (
    <div
      className="portal-hero-card p-6 sm:p-8 mb-2 sm:mb-2.5 shadow-xl"
      style={{
        order: sectionOrder,
        borderRadius: theme.radiusLg,
        background: theme.heroBg,
        color: theme.heroText,
      }}
    >
      {inner}
    </div>
  )
}
