'use client'

import PortalButton from '@/components/channel-landing/portal/primitives/PortalButton'
import PortalSection from '@/components/channel-landing/portal/primitives/PortalSection'
import PortalSiteChips from '@/components/channel-landing/portal/PortalSiteChips'
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'
import { isConversionEnabledForChannel } from '@/lib/channel-landing-pages/portalConversionPacks'

type Props = PortalSectionProps & {
  onPrimaryClick: () => void
  scheduleCta?: string
}

export default function ChannelPortalFinalCta({
  page,
  theme,
  sectionOrder,
  portalLayoutChrome,
  onPrimaryClick,
  scheduleCta,
}: Props) {
  if (!isConversionEnabledForChannel(page.channelId)) return null
  const heading = page.conversion?.finalCtaHeading
  const body = page.conversion?.finalCtaBody
  const label = page.conversion?.finalCtaLabel ?? scheduleCta
  if (!label?.trim()) return null

  return (
    <PortalSection
      theme={theme}
      sectionOrder={sectionOrder}
      title={heading ?? undefined}
      titleVariant="tier"
      className="border-t pt-8"
    >
      <div className="flex flex-col gap-4 w-full">
        {body ? (
          <p className="text-body w-full" style={{ color: theme.textMuted }}>
            {body}
          </p>
        ) : null}
        {portalLayoutChrome ? (
          <PortalSiteChips
            page={page}
            theme={theme}
            includeCompare
            proFinalRow
            mentorCta={{ label, onClick: onPrimaryClick }}
          />
        ) : (
          <PortalButton theme={theme} variant="recommended" onClick={onPrimaryClick}>
            {label}
          </PortalButton>
        )}
      </div>
    </PortalSection>
  )
}
