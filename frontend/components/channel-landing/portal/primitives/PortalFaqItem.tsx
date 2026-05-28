'use client'

import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'

type Props = {
  theme: PlatformPortalTheme
  question: string
  answer: string
}

/** Minimal FAQ row — no card chrome (reduces “tab” noise). */
export default function PortalFaqItem({ theme, question, answer }: Props) {
  return (
    <details className="group portal-faq-item border-b last:border-b-0" style={{ borderColor: theme.cardBorder }}>
      <summary
        className="cursor-pointer list-none py-3 text-body-sm font-medium flex justify-between gap-3"
        style={{ color: theme.text }}
      >
        <span>{question}</span>
        <span
          className="text-meta shrink-0 transition-transform group-open:rotate-45"
          style={{ color: theme.textMuted }}
          aria-hidden
        >
          +
        </span>
      </summary>
      <p className="pb-3 text-body-sm leading-relaxed max-w-3xl" style={{ color: theme.textMuted }}>
        {answer}
      </p>
    </details>
  )
}
