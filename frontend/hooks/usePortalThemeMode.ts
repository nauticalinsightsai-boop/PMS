'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_PORTAL_COLOR_MODE,
  portalThemeStorageKey,
  type PortalColorMode,
} from '@/lib/channel-landing-pages/platformThemeModes'

export function usePortalThemeMode(channelId: string) {
  const [colorMode, setColorModeState] = useState<PortalColorMode>(DEFAULT_PORTAL_COLOR_MODE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(portalThemeStorageKey(channelId))
      if (stored === 'light' || stored === 'dark') {
        setColorModeState(stored)
      }
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [channelId])

  const setColorMode = useCallback(
    (mode: PortalColorMode) => {
      setColorModeState(mode)
      try {
        localStorage.setItem(portalThemeStorageKey(channelId), mode)
      } catch {
        /* ignore */
      }
    },
    [channelId]
  )

  const toggleColorMode = useCallback(() => {
    setColorMode(colorMode === 'dark' ? 'light' : 'dark')
  }, [colorMode, setColorMode])

  return {
    colorMode: hydrated ? colorMode : DEFAULT_PORTAL_COLOR_MODE,
    setColorMode,
    toggleColorMode,
    hydrated,
  }
}
