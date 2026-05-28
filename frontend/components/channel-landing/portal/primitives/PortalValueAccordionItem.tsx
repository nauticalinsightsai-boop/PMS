'use client'

import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'

type Props = {
  theme: PlatformPortalTheme
  title: string
  body: string
  groupName: string
}

/** Expand/collapse value line — grouped so one open at a time in supporting browsers. */
export default function PortalValueAccordionItem({ theme, title, body, groupName }: Props) {
  return (
    <details
      name={groupName}
      className="group portal-value-accordion border-b last:border-b-0"
      style={{ borderColor: theme.cardBorder }}
    >
      <summary
        className="cursor-pointer list-none py-3.5 text-body font-medium flex justify-between gap-3"
        style={{ color: theme.text }}
      >
        <span className="min-w-0">{title}</span>
        <span
          className="text-meta shrink-0 transition-transform group-open:rotate-45"
          style={{ color: theme.textMuted }}
          aria-hidden
        >
          +
        </span>
      </summary>
      <p className="pb-4 text-body-sm leading-relaxed w-full" style={{ color: theme.textMuted }}>
        {body}
      </p>
    </details>
  )
}
