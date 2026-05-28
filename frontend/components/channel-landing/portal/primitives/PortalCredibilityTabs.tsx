'use client'

import { useState } from 'react'
import type { PortalProofMetric, PortalSocialProofItem } from '@/types/channelLandingPage'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'
import { getCredibilityTabLabels } from '@/lib/channel-landing-pages/portalConversionPacks'

type TabId = 'metrics' | 'quotes'

type Props = {
  theme: PlatformPortalTheme
  channelId: string
  channelLabel?: string
  metrics: PortalProofMetric[]
  quotes: PortalSocialProofItem[]
}

export default function PortalCredibilityTabs({
  theme,
  channelId,
  channelLabel = '',
  metrics,
  quotes,
}: Props) {
  const hasMetrics = metrics.length > 0
  const hasQuotes = quotes.length > 0
  const labels = getCredibilityTabLabels(channelId, channelLabel)
  const [activeTab, setActiveTab] = useState<TabId>(hasQuotes ? 'quotes' : 'metrics')

  if (!hasMetrics && !hasQuotes) return null

  const showTabs = hasMetrics && hasQuotes

  return (
    <div className="portal-credibility-tabs w-full">
      {showTabs ? (
        <div
          className="portal-credibility-tablist flex w-full p-1 mb-4 gap-1"
          style={{
            borderRadius: theme.radiusLg,
            backgroundColor: theme.surfaceMuted,
            border: `1px solid ${theme.cardBorder}`,
          }}
          role="tablist"
          aria-label="Credibility"
        >
          {hasQuotes ? (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'quotes'}
              id="portal-cred-tab-quotes"
              aria-controls="portal-cred-panel-quotes"
              onClick={() => setActiveTab('quotes')}
              className="portal-credibility-tab flex-1 min-w-0 px-4 py-2 text-meta font-medium transition-all duration-200"
              style={{
                borderRadius: theme.radius,
                backgroundColor: activeTab === 'quotes' ? theme.surface : 'transparent',
                color: activeTab === 'quotes' ? theme.text : theme.textMuted,
                boxShadow: activeTab === 'quotes' ? `0 1px 3px ${theme.cardBorder}` : undefined,
              }}
            >
              {labels.quotes}
            </button>
          ) : null}
          {hasMetrics ? (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'metrics'}
              id="portal-cred-tab-metrics"
              aria-controls="portal-cred-panel-metrics"
              onClick={() => setActiveTab('metrics')}
              className="portal-credibility-tab flex-1 min-w-0 px-4 py-2 text-meta font-medium transition-all duration-200"
              style={{
                borderRadius: theme.radius,
                backgroundColor: activeTab === 'metrics' ? theme.surface : 'transparent',
                color: activeTab === 'metrics' ? theme.text : theme.textMuted,
                boxShadow: activeTab === 'metrics' ? `0 1px 3px ${theme.cardBorder}` : undefined,
              }}
            >
              {labels.metrics}
            </button>
          ) : null}
        </div>
      ) : null}

      {hasQuotes && (!showTabs || activeTab === 'quotes') ? (
        <div
          id="portal-cred-panel-quotes"
          role="tabpanel"
          aria-labelledby={showTabs ? 'portal-cred-tab-quotes' : undefined}
          className="portal-credibility-panel w-full"
        >
          <ul
            className={`w-full m-0 p-0 list-none ${
              quotes.length > 1 ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : ''
            }`}
          >
            {quotes.map((q, i) => (
              <li key={`${q.quote.slice(0, 24)}-${i}`}>
                <figure
                  className="m-0 h-full p-4 sm:p-5"
                  style={{
                    borderRadius: theme.radiusLg,
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.cardBorder}`,
                  }}
                >
                  <blockquote className="m-0">
                    <p className="text-body-sm leading-relaxed" style={{ color: theme.text }}>
                      {q.quote}
                    </p>
                  </blockquote>
                  {q.name || q.role ? (
                    <figcaption className="mt-3 space-y-0.5">
                      {q.name ? (
                        <p className="text-meta font-medium" style={{ color: theme.text }}>
                          {q.name}
                        </p>
                      ) : null}
                      {q.title ? (
                        <p className="text-meta" style={{ color: theme.textMuted }}>
                          {q.title}
                        </p>
                      ) : q.role ? (
                        <p className="text-meta" style={{ color: theme.textMuted }}>
                          {q.role}
                        </p>
                      ) : null}
                    </figcaption>
                  ) : null}
                </figure>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {hasMetrics && (!showTabs || activeTab === 'metrics') ? (
        <div
          id="portal-cred-panel-metrics"
          role="tabpanel"
          aria-labelledby={showTabs ? 'portal-cred-tab-metrics' : undefined}
          className="portal-credibility-panel w-full"
        >
          <dl className="portal-credibility-metrics grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="min-w-0 p-3 sm:p-4"
                style={{
                  borderRadius: theme.radius,
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.cardBorder}`,
                }}
              >
                <dt className="text-meta leading-snug mb-1" style={{ color: theme.textMuted }}>
                  {m.label}
                </dt>
                <dd
                  className="text-body font-medium leading-snug"
                  style={{ color: theme.text, fontFamily: theme.fontFamily }}
                >
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </div>
  )
}
