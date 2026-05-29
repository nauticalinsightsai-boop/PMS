'use client'

import PortalExpandableSection from '@/components/channel-landing/portal/primitives/PortalExpandableSection'
import PortalValueAccordionItem from '@/components/channel-landing/portal/primitives/PortalValueAccordionItem'
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'
import { isConversionEnabledForChannel } from '@/lib/channel-landing-pages/portalConversionPacks'

const MAX_VALUE_ITEMS = 3
const VALUE_ACCORDION_GROUP = 'portal-value-included'

function QualList({
  items,
  marker,
  markerColor,
  textColor,
}: {
  items: string[]
  marker: string
  markerColor: string
  textColor: string
}) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-body-sm leading-relaxed" style={{ color: textColor }}>
          <span
            className="shrink-0 w-5 text-center font-semibold tabular-nums"
            style={{ color: markerColor }}
            aria-hidden
          >
            {marker}
          </span>
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function ChannelPortalQualification({
  page,
  theme,
  sectionOrder,
  proPortalShell,
}: PortalSectionProps) {
  if (!isConversionEnabledForChannel(page.channelId)) return null
  const forList = page.conversion?.qualificationFor?.slice(0, 4)
  const notFor = page.conversion?.qualificationNotFor?.slice(0, 4)
  const intro = proPortalShell ? page.conversion?.credibilityBody : undefined
  const valueCards = page.conversion?.valueCards?.slice(0, MAX_VALUE_ITEMS)
  const riskLine = page.conversion?.riskReversal?.trim()
  if (!forList?.length && !notFor?.length && !valueCards?.length && !intro && !riskLine) return null

  return (
    <PortalExpandableSection
      theme={theme}
      sectionOrder={sectionOrder}
      label="Who this is for"
      hint="Certification goals · mentor fit · what is included"
      defaultExpanded={false}
    >
      {riskLine ? (
        <p className="text-body-sm mb-4 leading-relaxed" style={{ color: theme.textMuted }}>
          {riskLine}
        </p>
      ) : null}
      {intro ? (
        <p className="text-body-sm mb-4 w-full leading-relaxed" style={{ color: theme.textMuted }}>
          {intro}
        </p>
      ) : null}
      {valueCards?.length ? (
        <div className="w-full mb-5">
          <p
            className="portal-section-eyebrow"
            style={{ color: theme.textMuted }}
          >
            Included in the session
          </p>
          <div className="w-full">
            {valueCards.map((card) => (
              <PortalValueAccordionItem
                key={card.title}
                theme={theme}
                title={card.title}
                body={card.body}
                groupName={`${VALUE_ACCORDION_GROUP}-${page.channelId}`}
              />
            ))}
          </div>
        </div>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 w-full">
        {forList?.length ? (
          <div
            className="sm:pr-5 sm:border-r min-w-0"
            style={{ borderColor: theme.cardBorder }}
          >
            <p className="text-body-sm font-medium mb-3" style={{ color: theme.text }}>
              Good fit
            </p>
            <QualList
              items={forList}
              marker="+"
              markerColor={theme.primary}
              textColor={theme.textMuted}
            />
          </div>
        ) : null}
        {notFor?.length ? (
          <div className="min-w-0">
            <p className="text-body-sm font-medium mb-3" style={{ color: theme.textMuted }}>
              Not a fit
            </p>
            <QualList
              items={notFor}
              marker="−"
              markerColor={theme.textMuted}
              textColor={theme.textMuted}
            />
          </div>
        ) : null}
      </div>
    </PortalExpandableSection>
  )
}

