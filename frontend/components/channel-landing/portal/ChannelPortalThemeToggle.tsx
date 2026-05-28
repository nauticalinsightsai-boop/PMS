'use client'

import { Moon, Sun } from 'lucide-react'
import type { PortalColorMode } from '@/lib/channel-landing-pages/platformThemeModes'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'

type Props = {
  theme: PlatformPortalTheme
  colorMode: PortalColorMode
  onSetMode: (mode: PortalColorMode) => void
}

export default function ChannelPortalThemeToggle({ theme, colorMode, onSetMode }: Props) {
  return (
    <div
      className="portal-theme-toggle flex shrink-0 rounded-full p-0.5"
      role="group"
      aria-label="Color mode"
      style={{
        backgroundColor: theme.surfaceMuted,
        border: `1px solid ${theme.cardBorder}`,
      }}
    >
      <button
        type="button"
        onClick={() => onSetMode('dark')}
        className="portal-theme-toggle-btn flex items-center justify-center w-8 h-8 rounded-full transition-opacity"
        style={{
          backgroundColor: colorMode === 'dark' ? theme.primary : 'transparent',
          color: colorMode === 'dark' ? theme.primaryForeground : theme.textMuted,
        }}
        aria-pressed={colorMode === 'dark'}
        aria-label="Dark mode"
        title="Dark mode"
      >
        <Moon size={14} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => onSetMode('light')}
        className="portal-theme-toggle-btn flex items-center justify-center w-8 h-8 rounded-full transition-opacity"
        style={{
          backgroundColor: colorMode === 'light' ? theme.primary : 'transparent',
          color: colorMode === 'light' ? theme.primaryForeground : theme.textMuted,
        }}
        aria-pressed={colorMode === 'light'}
        aria-label="Light mode"
        title="Light mode"
      >
        <Sun size={14} aria-hidden />
      </button>
    </div>
  )
}
