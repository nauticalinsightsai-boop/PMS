'use client'



import PortalSection from '@/components/channel-landing/portal/primitives/PortalSection'

import PortalSiteChips from '@/components/channel-landing/portal/PortalSiteChips'

import type { PortalSectionProps } from '@/components/channel-landing/portal/types'

import { isConversionEnabledForChannel } from '@/lib/channel-landing-pages/portalConversionPacks'

import { portalSpacing } from '@/lib/channel-landing-pages/portalSpacing'
import { CTAS } from '@/lib/brand-voice'

import { PMS_SUPPORT_EMAIL } from '@/config/pms-site'

import { pickReadableForeground } from '@/lib/channel-landing-pages/contrastUtils'



type Props = PortalSectionProps



const SUPPORT_MAILTO = `mailto:${PMS_SUPPORT_EMAIL}`



export default function ChannelPortalFinalCta({

  page,

  theme,

  sectionOrder,

  portalLayoutChrome,

}: Props) {

  if (!isConversionEnabledForChannel(page.channelId)) return null

  const heading = page.conversion?.finalCtaHeading

  const body = page.conversion?.finalCtaBody

  const emailLabel = CTAS.portalEmailSupport

  const mentorBg =

    typeof theme.recommendedBg === 'string' && !theme.recommendedBg.includes('gradient')

      ? theme.recommendedBg

      : theme.primary

  const mentorFg = theme.recommendedText ?? pickReadableForeground(mentorBg)



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

        {portalLayoutChrome ? (

          <PortalSiteChips

            page={page}

            theme={theme}

            proFinalRow

            mentorCta={{ label: emailLabel, href: SUPPORT_MAILTO }}

          />

        ) : (

          <a

            href={SUPPORT_MAILTO}

            className="inline-flex w-full sm:w-auto items-center justify-center px-4 py-2.5 text-body-sm font-semibold hover:opacity-90 transition-opacity"

            style={{

              borderRadius: theme.radius,

              background: mentorBg,

              color: mentorFg,

            }}

          >

            {emailLabel}

          </a>

        )}

      </div>

    </PortalSection>

  )

}


