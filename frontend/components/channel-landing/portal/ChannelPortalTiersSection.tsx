'use client'

import { Clock } from 'lucide-react'
import type { ConsultationTier } from '@/types/channelLandingPage'
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'
import { scheduleTierClick } from '@/components/channel-landing/portal/scheduleTierClick'
import { pickReadableForeground } from '@/lib/channel-landing-pages/contrastUtils'
import { getTierSchedulingLine } from '@/lib/channel-landing-pages/channelPortalCopy'
import { isConversionEnabledForChannel } from '@/lib/channel-landing-pages/portalConversionPacks'
import { getLegalDocumentPath } from '@/constants/legal'

type Props = PortalSectionProps & {
  tiers: ConsultationTier[]
  scheduleCta: string
}

export default function ChannelPortalTiersSection({
  page,
  theme,
  sectionOrder,
  tiers,
  scheduleCta,
  layoutVariant,
  isImpulseFlow,
}: Props) {
  const tierHeading =
    page.channelId === 'webinar'
      ? 'Free or paid session'
      : isImpulseFlow
        ? 'Pick a session'
        : 'Select consultation tier'
  const cardLayout = isImpulseFlow ? 'portal-tier-card portal-tier-card--stacked' : 'portal-tier-card'
  const showConversionHints = isConversionEnabledForChannel(page.channelId)
  const showFormHint =
    showConversionHints && page.showBookingForm && page.primaryAction === 'booking_form'
  const tierSchedulingLine = showConversionHints ? getTierSchedulingLine(page.channelId) : ''

  return (
    <section
      className={`portal-tiers-section mt-2 sm:mt-4${isImpulseFlow ? ' portal-tiers-impulse' : ''}`}
      style={{ order: sectionOrder }}
    >
      <div className="portal-tier-section-head mb-3 sm:mb-4 space-y-1">
        <h3
          className={`font-semibold tracking-wide${isImpulseFlow ? ' text-body w-full' : ' text-meta font-mono uppercase tracking-[0.2em]'}`}
          style={{ color: isImpulseFlow ? theme.text : theme.textMuted }}
        >
          {tierHeading}
        </h3>
        {tierSchedulingLine ? (
          <p className="text-body-sm w-full leading-relaxed" style={{ color: theme.textMuted }}>
            {tierSchedulingLine}
          </p>
        ) : null}
      </div>

      {showConversionHints && showFormHint ? (
        <p className="text-meta w-full mb-4 sm:mb-6" style={{ color: theme.textMuted }}>
          Prefer email intake? Use the form below.
        </p>
      ) : null}

      <ul className="space-y-4">
        {tiers.map((tier) => (
          <li
            key={tier.id}
            className={`${cardLayout} relative p-5 sm:p-6 transition-shadow${tier.isFree ? '' : ''}`}
            style={{
              borderRadius: theme.radiusLg,
              border: tier.recommended
                ? `2px solid ${theme.primary}`
                : `1px solid ${theme.cardBorder}`,
              backgroundColor: theme.cardBg,
              boxShadow: tier.recommended ? `0 4px 20px ${theme.primary}22` : undefined,
            }}
          >
            {(tier.recommended || tier.badge) && (
              <span
                className="portal-tier-badge inline-block text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 mb-3"
                style={{
                  borderRadius: theme.radius,
                  background: theme.recommendedBg,
                  color: theme.recommendedText ?? theme.primaryForeground,
                }}
              >
                {tier.badge ?? 'Recommended'}
              </span>
            )}

            <div className="portal-tier-body flex flex-col gap-3 w-full">
              <h4
                className="portal-tier-title text-h4 leading-snug"
                style={{ color: theme.text, fontFamily: theme.fontFamily }}
              >
                {tier.title}
              </h4>

              <p
                className="portal-tier-desc text-body-sm leading-relaxed"
                style={{ color: theme.textMuted, fontFamily: theme.fontFamily }}
              >
                {tier.description}
              </p>

              <div
                className={`portal-tier-footer flex flex-col gap-3 pt-1 w-full${!isImpulseFlow ? ' sm:flex-row sm:items-center sm:justify-between' : ''}`}
              >
                <div
                  className="portal-tier-meta flex flex-wrap gap-2"
                >
                  {tier.isFree ? (
                    <span
                      className="inline-flex items-center gap-2 text-body font-semibold px-3 py-1.5"
                      style={{
                        borderRadius: theme.radius,
                        backgroundColor: theme.freeBadgeBg,
                        color: theme.freeBadgeText,
                        border: `1px solid ${theme.cardBorder}`,
                      }}
                    >
                      <Clock size={14} aria-hidden />
                      {tier.durationLabel} · Free
                    </span>
                  ) : (
                    <>
                      <span
                        className="text-body-sm font-medium tabular-nums px-3 py-1.5"
                        style={{
                          borderRadius: theme.radius,
                          backgroundColor: theme.priceBadgeBg,
                          color: theme.priceBadgeText,
                        }}
                      >
                        {tier.priceLabel}
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 text-meta px-3 py-1.5"
                        style={{
                          borderRadius: theme.radius,
                          color: theme.textMuted,
                          backgroundColor: theme.surfaceMuted,
                        }}
                      >
                        <Clock size={14} aria-hidden />
                        {tier.durationLabel}
                      </span>
                    </>
                  )}
                </div>

                {(() => {
                  const useBold = layoutVariant === 'bold' && isImpulseFlow
                  const useWebsitePrimary = page.channelId === 'website'
                  const recBg =
                    typeof theme.recommendedBg === 'string' && !theme.recommendedBg.includes('gradient')
                      ? theme.recommendedBg
                      : theme.primary
                  const btnBg = useBold || tier.recommended ? recBg : theme.primary
                  const btnFg =
                    tier.recommended || useBold
                      ? theme.recommendedText ?? pickReadableForeground(recBg)
                      : theme.primaryForeground
                  const label = tier.ctaLabel ?? scheduleCta
                  return (
                    <button
                      type="button"
                      onClick={() => scheduleTierClick(page, tier)}
                      className={
                        useBold
                          ? `portal-schedule-btn-bold w-full px-4 py-3 text-body-sm font-semibold hover:opacity-90 transition-opacity${useWebsitePrimary ? ' home-btn-primary cta-consultation text-white' : ''}`
                          : `portal-schedule-btn w-full sm:w-auto shrink-0 px-4 py-2.5 text-body-sm font-semibold hover:opacity-90 transition-opacity${useWebsitePrimary ? ' home-btn-primary cta-consultation text-white' : ''}`
                      }
                      style={{
                        borderRadius: theme.radius,
                        background: useWebsitePrimary ? undefined : btnBg,
                        color: useWebsitePrimary ? undefined : btnFg,
                        border: 'none',
                      }}
                    >
                      {label}
                    </button>
                  )
                })()}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-meta w-full mt-4 text-center leading-relaxed" style={{ color: theme.textMuted }}>
        Prices are indicative. Scheduling via Calendly. See{' '}
        <a href={getLegalDocumentPath('privacy')} className="underline hover:opacity-80" style={{ color: theme.linkColor }} target="_blank" rel="noopener noreferrer">
          Privacy
        </a>{' '}
        and{' '}
        <a href={getLegalDocumentPath('pricing-disclaimers')} className="underline hover:opacity-80" style={{ color: theme.linkColor }} target="_blank" rel="noopener noreferrer">
          Pricing
        </a>
        .
      </p>

      {showConversionHints && page.conversion?.paymentMicrocopy?.length ? (
        <p
          className="portal-booking-assurances text-[10px] sm:text-[11px] mt-4 sm:mt-5 mb-8 sm:mb-10 pt-3 border-t w-full text-center leading-snug font-normal normal-case tracking-normal opacity-90"
          style={{ borderColor: theme.cardBorder, color: theme.textMuted }}
          aria-label="Booking assurances"
        >
          {page.conversion.paymentMicrocopy.slice(0, 5).map((item, i) => (
            <span key={item}>
              {i > 0 ? <span className="mx-2 opacity-40" aria-hidden>·</span> : null}
              {item}
            </span>
          ))}
        </p>
      ) : null}
    </section>
  )
}
