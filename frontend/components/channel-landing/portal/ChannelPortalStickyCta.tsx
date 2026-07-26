'use client'

import { useEffect, useState } from 'react'
import { CERT_ROADMAP_FORM_ANCHOR } from '@/lib/cert-program-offer'
import { pickReadableForeground } from '@/lib/channel-landing-pages/contrastUtils'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'

type Props = {
  theme: PlatformPortalTheme
}

export default function ChannelPortalStickyCta({ theme }: Props) {
  const [formIsVisible, setFormIsVisible] = useState(false)
  const bg = theme.recommendedBg
  const solidBg =
    typeof bg === 'string' && !bg.includes('gradient')
      ? bg
      : theme.primary
  const fg = theme.recommendedText ?? pickReadableForeground(solidBg)

  useEffect(() => {
    let cancelled = false
    let observer: IntersectionObserver | null = null

    const attach = () => {
      const target = document.getElementById(CERT_ROADMAP_FORM_ANCHOR)
      if (!target || cancelled) return false
      observer = new IntersectionObserver(
        ([entry]) => setFormIsVisible(entry.isIntersecting),
        { threshold: 0.2 },
      )
      observer.observe(target)
      return true
    }

    if (attach()) {
      return () => {
        cancelled = true
        observer?.disconnect()
      }
    }

    // Form can mount after the sticky bar (portal hydration order).
    const mo = new MutationObserver(() => {
      if (attach()) mo.disconnect()
    })
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      cancelled = true
      mo.disconnect()
      observer?.disconnect()
    }
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)')
    const syncReservedSpace = () => {
      const reserve = media.matches && !formIsVisible ? '4.5rem' : '0px'
      document.documentElement.style.setProperty('--portal-sticky-cta-height', reserve)
    }
    syncReservedSpace()
    media.addEventListener('change', syncReservedSpace)
    return () => {
      media.removeEventListener('change', syncReservedSpace)
      document.documentElement.style.setProperty('--portal-sticky-cta-height', '0px')
    }
  }, [formIsVisible])

  const scrollToRoadmap = () => {
    document.getElementById(CERT_ROADMAP_FORM_ANCHOR)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  if (formIsVisible) return null

  return (
    <div
      className="portal-sticky-cta fixed bottom-0 left-0 right-0 z-40 p-3 sm:hidden border-t"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.cardBorder,
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      }}
    >
      <button
        type="button"
        onClick={scrollToRoadmap}
        className="flex min-h-12 w-full items-center justify-center px-4 py-2.5 text-body-sm font-semibold transition-opacity hover:opacity-90"
        style={{
          borderRadius: theme.radius,
          background: bg,
          color: fg,
        }}
      >
        Build my roadmap
      </button>
    </div>
  )
}
