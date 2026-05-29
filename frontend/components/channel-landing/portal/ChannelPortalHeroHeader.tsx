'use client'

import { BadgeCheck, MapPin } from 'lucide-react'
import PlatformChannelIcon from '@/components/admin/PlatformChannelIcon'
import PortalHeaderUtilities from '@/components/channel-landing/portal/PortalHeaderUtilities'
import PortalButton from '@/components/channel-landing/portal/primitives/PortalButton'
import { BRAND } from '@/lib/brand-voice'
import { resolveScheduleTierCta } from '@/lib/channel-landing-pages/channelPortalCopy'
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'
import { pickReadableForeground } from '@/lib/channel-landing-pages/contrastUtils'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'

function availabilityPillStyle(theme: PlatformPortalTheme) {
  const bg = theme.surfaceMuted
  return {
    borderRadius: theme.radius,
    backgroundColor: bg,
    color: pickReadableForeground(bg),
    border: `1px solid ${theme.cardBorder}`,
  }
}

function HeroSyncAside({
  page,
  theme,
}: {
  page: PortalSectionProps['page']
  theme: PortalSectionProps['theme']
}) {
  if (!page.showSyncBanner) return null

  return (
    <div
      className="shrink-0 p-3 sm:p-3.5 w-full sm:w-auto sm:max-w-[220px]"
      style={{
        borderRadius: theme.radiusLg,
        border: `1px solid ${theme.cardBorder}`,
        backgroundColor: theme.surface,
      }}
    >
      <p
        className="text-[10px] font-mono uppercase tracking-wider mb-1"
        style={{ color: theme.textMuted }}
      >
        {page.syncBannerLabel}
      </p>
      <p className="text-meta" style={{ color: theme.text }}>
        Google &amp; Outlook Calendar
      </p>
      {page.availabilityLabel ? (
        <p className="mt-2 inline-flex text-meta px-3 py-1" style={availabilityPillStyle(theme)}>
          {page.availabilityLabel}
        </p>
      ) : null}
    </div>
  )
}

export default function ChannelPortalHeroHeader({
  page,
  theme,
  sectionOrder,
  isImpulseFlow,
  proPortalShell,
  isLeadHero = false,
  onBookMentor,
  scheduleCta: scheduleCtaProp,
  topBar = false,
}: PortalSectionProps) {
  const showEngagementLinks = !proPortalShell
  const scheduleCta =
    scheduleCtaProp ??
    resolveScheduleTierCta(page.channelId, page.primaryButtonText ?? theme.scheduleTierCta)
  const brandLabel = BRAND.name
  if (isImpulseFlow) {
    return (
      <header
        className={`portal-hero-compact flex flex-col gap-3 w-full text-left${
          isLeadHero ? ' pb-5 mb-2' : ' py-5 mt-2 border-t'
        }`}
        style={{
          order: sectionOrder,
          borderColor: theme.cardBorder,
        }}
      >
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 w-full gap-3 sm:flex-1">
            <div className="portal-story-ring shrink-0">
              <div
                className="portal-story-ring-inner flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: theme.primary,
                  color: theme.primaryForeground,
                }}
              >
                <PlatformChannelIcon name={theme.iconName} size={24} />
              </div>
            </div>
            <div className="flex min-w-0 w-full max-w-full flex-1 flex-col items-start">
              <div className="flex w-full flex-wrap items-center justify-start gap-1.5">
                <span
                  className="text-body font-semibold"
                  style={{ color: theme.text, fontFamily: theme.fontFamily }}
                >
                  {brandLabel}
                </span>
                <BadgeCheck size={16} style={{ color: theme.verifiedColor }} aria-label="Verified" />
              </div>
              <p className="mt-0.5 w-full text-body-sm leading-relaxed" style={{ color: theme.textMuted }}>
                Mentor-led certification preparation &amp; career guidance
              </p>
              {page.availabilityLabel && (
                <p className="mt-1 w-full text-[11px]" style={{ color: pickReadableForeground(theme.surface) }}>
                  {page.availabilityLabel}
                </p>
              )}
            </div>
          </div>
          <PortalHeaderUtilities
            page={page}
            theme={theme}
            engagementLinks={showEngagementLinks}
            className="w-full sm:w-auto"
          />
        </div>
        {onBookMentor ? (
          <PortalButton theme={theme} variant="recommended" className="w-full sm:w-auto" onClick={onBookMentor}>
            {scheduleCta}
          </PortalButton>
        ) : null}
      </header>
    )
  }

  return (
    <header
      className={`flex flex-col gap-4 w-full${
        topBar ? '' : isLeadHero ? ' mb-6 sm:mb-8' : ' mb-8 sm:mb-10'
      }`}
      style={{ order: topBar ? undefined : sectionOrder }}
    >
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 w-full gap-3 sm:gap-4 sm:flex-1">
          <div className="shrink-0">
            <div
              className="flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: theme.radiusLg,
                backgroundColor: theme.primary,
                color: theme.primaryForeground,
              }}
              aria-hidden
            >
              <PlatformChannelIcon name={theme.iconName} size={24} />
            </div>
          </div>
          <div className="min-w-0 w-full max-w-full flex-1">
            <div className="flex w-full flex-wrap items-center gap-1.5">
              <p
                className="text-body-lg font-semibold"
                style={{ color: theme.text, fontFamily: theme.fontFamily }}
              >
                {brandLabel}
              </p>
              <BadgeCheck
                size={18}
                className="shrink-0"
                style={{ color: theme.verifiedColor }}
                aria-label="Verified"
              />
            </div>
            <p className="mt-0.5 w-full text-body-sm leading-relaxed" style={{ color: theme.textMuted }}>
              Mentor-led certification preparation &amp; career guidance
            </p>
            <p className="mt-1 flex w-full flex-wrap items-center gap-2">
              <span
                className="inline-flex w-full items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider sm:w-auto"
                style={{ color: theme.textMuted }}
              >
                <MapPin size={10} className="shrink-0 opacity-90" aria-hidden />
                Global learners
              </span>
            </p>
          </div>
        </div>
        <PortalHeaderUtilities
          page={page}
          theme={theme}
          engagementLinks={showEngagementLinks}
          className="w-full sm:w-auto"
        />
      </div>
      {onBookMentor ? (
        <PortalButton theme={theme} variant="recommended" className="w-full sm:w-auto" onClick={onBookMentor}>
          {scheduleCta}
        </PortalButton>
      ) : null}
      {page.showSyncBanner ? <HeroSyncAside page={page} theme={theme} /> : null}
    </header>
  )
}
