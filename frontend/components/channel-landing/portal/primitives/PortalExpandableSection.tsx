'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'
import { cn } from '@/lib/utils'

type Props = {
  theme: PlatformPortalTheme
  sectionOrder: number
  label: string
  hint?: string
  children: ReactNode
  className?: string
  defaultExpanded?: boolean
  /** Rendered below collapsible content (e.g. site shortcut chips). */
  afterLabel?: ReactNode
}

/** Engagement-style expand/collapse — click or hover to open, closes on leave/outside click. */
export default function PortalExpandableSection({
  theme,
  sectionOrder,
  label,
  hint = 'Review before booking',
  children,
  className = '',
  defaultExpanded = false,
  afterLabel,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsExpanded(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsExpanded(false), 200)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sectionRef.current && !sectionRef.current.contains(e.target as Node)) {
        setIsExpanded(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`mb-6 sm:mb-8 w-full ${className}`.trim()}
      style={{ order: sectionOrder }}
    >
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="group flex flex-col items-start gap-1 text-left cursor-pointer w-full bg-transparent border-0 pb-2 pt-0 px-0 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40 rounded-sm"
          aria-expanded={isExpanded}
        >
        <div className="flex items-center gap-2 w-full">
          <span className="portal-section-eyebrow mb-0" style={{ color: theme.textMuted }}>
            {label}
          </span>
          <ChevronDown
            size={16}
            className="shrink-0 ml-auto transition-transform duration-300"
            style={{
              color: theme.textMuted,
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
            aria-hidden
          />
        </div>
        {hint ? (
          <span className="text-[0.625rem]" style={{ color: theme.textMuted }}>
            {hint}
          </span>
        ) : null}
        </button>
      </div>

      <div
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
        aria-hidden={!isExpanded}
      >
        <div className={cn('min-h-0 overflow-hidden', !isExpanded && 'pointer-events-none')}>
          <div
            className="pt-3 w-full rounded-lg border p-5 sm:p-6"
            style={{
              borderColor: theme.cardBorder,
              backgroundColor: theme.surface,
            }}
          >
            {children}
          </div>
        </div>
      </div>

      {afterLabel ? <div className="pt-3 w-full">{afterLabel}</div> : null}
    </section>
  )
}
