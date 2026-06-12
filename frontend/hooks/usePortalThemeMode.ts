'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  defaultPortalColorMode,
  MARKETING_SITE_THEME_STORAGE_KEY,
  portalThemeStorageKey,
  type PortalColorMode,
} from '@/lib/channel-landing-pages/platformThemeModes'

function readStoredPortalColorMode(channelId: string): PortalColorMode {
  const fallback = defaultPortalColorMode(channelId)
  try {
    const stored = localStorage.getItem(portalThemeStorageKey(channelId))
    if (stored === 'light' || stored === 'dark') return stored

    if (channelId === 'website') {
      const siteTheme = localStorage.getItem(MARKETING_SITE_THEME_STORAGE_KEY)
      if (siteTheme === 'dark') return 'dark'
      if (siteTheme === 'light') return 'light'
    }
  } catch {
    /* ignore */
  }
  return fallback
}

export function usePortalThemeMode(channelId: string) {
  const [colorMode, setColorModeState] = useState<PortalColorMode>(() =>
    defaultPortalColorMode(channelId)
  )
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setColorModeState(readStoredPortalColorMode(channelId))
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
    colorMode: hydrated ? colorMode : defaultPortalColorMode(channelId),
    setColorMode,
    toggleColorMode,
    hydrated,
  }
}
