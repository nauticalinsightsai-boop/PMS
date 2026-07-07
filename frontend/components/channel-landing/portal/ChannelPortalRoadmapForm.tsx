'use client'

import dynamic from 'next/dynamic'
import { CERT_ROADMAP_FORM_ANCHOR } from '@/lib/cert-program-offer'
import { portalSpacing } from '@/lib/channel-landing-pages/portalSpacing'
import PortalCard from '@/components/channel-landing/portal/primitives/PortalCard'
import PortalSectionHead from '@/components/channel-landing/portal/primitives/PortalSectionHead'
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'

const PmpRoadmapLeadForm = dynamic(
  () =>
    import('@/components/forms/PmpRoadmapLeadForm').then((mod) => ({
      default: mod.PmpRoadmapLeadForm,
    })),
  { ssr: false },
)

const PORTAL_ROADMAP_FORM_TITLE = 'Build your PM roadmap'
const PORTAL_ROADMAP_FORM_SUBTITLE_DESKTOP =
  "Share your experience: we'll map a study plan for you."
const PORTAL_ROADMAP_FORM_SUBTITLE_MOBILE = "we'll map a study plan for you."

export default function ChannelPortalRoadmapForm({
  page,
  theme,
  sectionOrder,
  portalLayoutChrome,
}: PortalSectionProps) {
  return (
    <section className={portalSpacing.section} style={{ order: sectionOrder }}>
      <div id={CERT_ROADMAP_FORM_ANCHOR} className="relative scroll-mt-40 lg:scroll-mt-48 w-full min-w-0">
        <PortalSectionHead
          theme={theme}
          titleId="channel-portal-title"
          titleAs="p"
          title={PORTAL_ROADMAP_FORM_TITLE}
          subtitle={
            <>
              <span className="sm:hidden">{PORTAL_ROADMAP_FORM_SUBTITLE_MOBILE}</span>
              <span className="hidden sm:inline">{PORTAL_ROADMAP_FORM_SUBTITLE_DESKTOP}</span>
            </>
          }
        />
        <PortalCard theme={theme} portalLayoutChrome={portalLayoutChrome} className="p-0 sm:p-0 overflow-hidden">
          <PmpRoadmapLeadForm
            placement="channel_portal"
            variant="hero"
            portalTheme={theme}
            portalChannelId={page.channelId}
            portalLandingSlug={page.slug}
            omitPortalSectionHead
          />
        </PortalCard>
      </div>
    </section>
  )
}
