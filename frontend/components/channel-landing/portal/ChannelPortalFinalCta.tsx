'use client'

import PortalSection from '@/components/channel-landing/portal/primitives/PortalSection'
import PortalSiteChips from '@/components/channel-landing/portal/PortalSiteChips'
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'
import { isConversionEnabledForChannel } from '@/lib/channel-landing-pages/portalConversionPacks'
import { portalSpacing } from '@/lib/channel-landing-pages/portalSpacing'
import { CTAS } from '@/lib/brand-voice'
import { PMS_SUPPORT_EMAIL } from '@/config/pms-site'
import { trackContactClick } from '@/lib/analytics/track-contact-click'

type Props = PortalSectionProps

const SUPPORT_MAILTO = `mailto:${PMS_SUPPORT_EMAIL}`

export default function ChannelPortalFinalCta({ page, theme, sectionOrder }: Props) {
  if (!isConversionEnabledForChannel(page.channelId)) return null

  const heading = page.conversion?.finalCtaHeading
  const body = page.conversion?.finalCtaBody
  const emailLabel = CTAS.portalEmailSupport

  return (
    <PortalSection
      theme={theme}
      sectionOrder={sectionOrder}
      title={heading ?? undefined}
      titleVariant="tier"
      className={`${portalSpacing.sectionDivider} mb-0`}
    >
      <div className="flex flex-col gap-4 w-full">
        {body ? (
          <p className="text-body w-full" style={{ color: theme.textMuted }}>
            {body}
          </p>
        ) : null}
        <PortalSiteChips
          page={page}
          theme={theme}
          proFinalRow
          mentorCta={{
            label: emailLabel,
            href: SUPPORT_MAILTO,
            onClick: () =>
              trackContactClick({
                contactMethod: 'email',
                contactContext: 'support',
                ctaText: emailLabel,
              }),
          }}
        />
      </div>
    </PortalSection>
  )
}
