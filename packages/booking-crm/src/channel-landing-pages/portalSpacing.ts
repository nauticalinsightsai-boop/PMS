/**
 * Shared vertical rhythm for all /go/{slug} portal pages.
 * Import these instead of one-off pt-[14px] / pb-0 tweaks per section.
 */
export const portalSpacing = {
  /** Outer portal shell (sticky CTA clearance on mobile). */
  root: 'min-h-screen flex flex-col overflow-x-hidden pb-[4.5rem] sm:pb-8',
  /** Main content column inside max-width shell. */
  content: 'flex flex-col px-4 sm:px-5 py-6 sm:py-8',
  /** Standard gap between stacked sections. */
  section: 'mb-6 sm:mb-8',
  /** Section separated by a top rule (final CTA, footer, etc.). */
  sectionDivider: 'border-t pt-6',
  /** Social footer block. */
  footer: 'mt-6 pt-6 pb-0',
  footerBlock: 'mb-4',
  /** Attribution, social chips, legal row (matches portal section subtitles). */
  footerCompact: 'text-body-sm leading-relaxed',
  /** Horizontal inset for portal form fields + CTA (matches PortalCard). */
  portalFormInset: 'px-4 sm:px-5',
  /** Glass / hero cards in the portal flow. */
  heroCard: 'p-5 sm:p-6 mb-3 sm:mb-4',
  /** Compact pathway summary row inside a card. */
  pathwaySummary: 'px-4 py-3 sm:px-5 sm:py-3.5',
  /** Expanded pathway detail panel below the grid row. */
  pathwayExpand: 'pt-4',
  /** Prep / tuition / membership chips in pathway detail cards. */
  metaChip:
    'flex w-full min-w-0 h-[3.3125rem] flex-col gap-0.5 px-3 py-2 text-left justify-center sm:flex-1 sm:basis-0',
  /** Row wrapping prep / tuition / membership chips. */
  metaChipRow: 'flex flex-col sm:flex-row gap-2 w-full items-stretch',
  /** Pathway detail typography (no site muted-foreground). */
  detailBody: 'text-xs leading-relaxed',
  detailMeta: 'text-xs leading-snug',
  detailValue: 'text-xs font-semibold leading-tight tabular-nums',
} as const
