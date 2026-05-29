'use client'

import { type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'
import { usePortalDwellOpen } from '@/hooks/usePortalDwellOpen'
import { cn } from '@/lib/utils'

type Props = {
  theme: PlatformPortalTheme
  sectionOrder: number
  label: string
  hint?: string
  children: ReactNode
  className?: string
  defaultExpanded?: boolean
  /** Rendered inside hover zone below collapsible content. */
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
  const { open, rootRef, onPointerEnter, onPointerLeave, onToggleClick } = usePortalDwellOpen()
  const isExpanded = open || defaultExpanded

  return (
    <section
      className={`mb-6 sm:mb-8 w-full flex flex-col gap-3 ${className}`.trim()}
      style={{ order: sectionOrder }}
    >
      <div
        ref={rootRef}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <button
          type="button"
          onClick={onToggleClick}
          className="group flex flex-col items-start gap-1 text-left cursor-pointer w-full bg-transparent border-0 pb-2 pt-0 px-0 outline-none focus:outline-none rounded-sm"
          style={{
            boxShadow: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.primary}66`
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none'
          }}
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
                color: theme.text,
              }}
            >
              {children}
            </div>
          </div>
        </div>

        {afterLabel ? <div className="pt-3 w-full">{afterLabel}</div> : null}
      </div>
    </section>
  )
}
