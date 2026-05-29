'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'
import { PORTAL_WEBSITE_ADVISORY_SERVICES } from '@/lib/channel-landing-pages/portalAdvisoryServices'

type Props = {
  theme: PlatformPortalTheme
  description: string
}

export default function PortalAdvisoryServicesReveal({ theme, description }: Props) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setOpen(false), 400)
  }, [clearCloseTimer])

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer])

  return (
    <div
      className="portal-advisory-services-reveal w-full min-h-[3.25rem] cursor-default"
      onPointerEnter={() => {
        clearCloseTimer()
        setOpen(true)
      }}
      onPointerLeave={scheduleClose}
      onClick={() => {
        clearCloseTimer()
        setOpen((v) => !v)
      }}
      onFocusCapture={() => {
        clearCloseTimer()
        setOpen(true)
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) scheduleClose()
      }}
    >
      {open ? (
        <ul className="space-y-2.5" role="list" aria-label="Advisory services">
          {PORTAL_WEBSITE_ADVISORY_SERVICES.map((service) => (
            <li key={service.title} className="text-body-sm leading-relaxed">
              <span className="font-semibold" style={{ color: theme.text, fontFamily: theme.fontFamily }}>
                {service.title}
              </span>
              <span style={{ color: theme.textMuted, fontFamily: theme.fontFamily }}>
                {' '}
                — {service.description}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <p
            className="portal-tier-desc text-body-sm leading-relaxed"
            style={{ color: theme.textMuted, fontFamily: theme.fontFamily }}
          >
            {description}
          </p>
          <p className="text-meta mt-1.5" style={{ color: theme.textMuted, fontFamily: theme.fontFamily }}>
            Hover to view services
          </p>
        </>
      )}
    </div>
  )
}
