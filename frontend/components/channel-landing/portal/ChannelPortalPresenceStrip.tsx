'use client'

import PlatformChannelIcon from '@/components/admin/PlatformChannelIcon'
import ChannelPortalThemeToggle from '@/components/channel-landing/portal/ChannelPortalThemeToggle'
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'
import { getChannelProfileUrl } from '@/constants/socialProfiles'
import { portalPresenceStripWidthClass } from '@/lib/channel-landing-pages/portalLayoutClasses'

export default function ChannelPortalPresenceStrip({
  theme,
  sectionOrder,
  channelId,
  layoutVariant,
  colorMode,
  onSetColorMode,
}: PortalSectionProps) {
  const isInstagram = channelId === 'instagram'
  const useStoryRing = isInstagram || layoutVariant === 'bold'
  const profileUrl = getChannelProfileUrl(channelId)
  const presenceLabel = theme.presenceTag === 'Site' ? 'official website' : theme.presenceTag

  return (
    <div
      className={`portal-presence-strip sticky top-0 z-[60] shrink-0 border-b py-3${isInstagram ? ' portal-presence-instagram' : ''}`}
      style={{
        order: sectionOrder,
        backgroundColor: theme.surface,
        borderColor: theme.cardBorder,
      }}
    >
      <div
        className={`flex items-center justify-between gap-3 px-4 sm:px-5 ${portalPresenceStripWidthClass(layoutVariant)}`}
      >
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 min-w-0 rounded-md transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: theme.primary }}
          aria-label={`Open ${presenceLabel} profile`}
        >
          {useStoryRing ? (
            <div className="portal-story-ring shrink-0">
              <div
                className="portal-story-ring-inner flex items-center justify-center"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: theme.surface,
                  color: theme.primary,
                }}
              >
                <PlatformChannelIcon name={theme.iconName} size={24} />
              </div>
            </div>
          ) : (
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 40,
                height: 40,
                borderRadius: theme.radius,
                backgroundColor: theme.primary,
                color: theme.primaryForeground,
              }}
            >
              <PlatformChannelIcon name={theme.iconName} size={22} />
            </div>
          )}
          <div className="min-w-0">
            <p
              className="text-meta font-semibold tracking-wide"
              style={{ color: theme.text }}
            >
              {presenceLabel}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: theme.textMuted }}>
              Mentor-led certification prep
            </p>
          </div>
        </a>

        <div className="flex items-center gap-2 shrink-0">
          {isInstagram && (
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 hidden sm:inline"
              style={{
                borderRadius: theme.radius,
                background: theme.recommendedBg,
                color: theme.recommendedText ?? theme.primaryForeground,
              }}
            >
              Live
            </span>
          )}
          {onSetColorMode ? (
            <ChannelPortalThemeToggle
              theme={theme}
              colorMode={colorMode}
              onSetMode={onSetColorMode}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
