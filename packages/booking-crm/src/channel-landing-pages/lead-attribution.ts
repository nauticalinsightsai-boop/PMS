export type LeadAttributionSource =
  | 'channel_portal'
  | 'contact'
  | 'newsletter'
  | 'blog'
  | 'engagement_modal'
  | 'home'

export type LeadAttribution = {
  source: LeadAttributionSource
  channelId?: string
  channelKey?: string
  landingSlug?: string
  tierId?: string
  tierTitle?: string
  pagePath?: string
  referrer?: string
}

export function buildLeadAttribution(
  partial: LeadAttribution
): LeadAttribution & { capturedAt: string } {
  return {
    ...partial,
    referrer: partial.referrer ?? (typeof document !== 'undefined' ? document.referrer : undefined),
    capturedAt: new Date().toISOString(),
  }
}

/** Extract human-readable origin from interaction payload (CRM / sheets). */
export function originLabelFromPayload(payload: Record<string, unknown>): string {
  if (typeof payload.originLabel === 'string' && payload.originLabel.trim()) {
    return payload.originLabel.trim()
  }
  const attr = payload.attribution
  if (attr && typeof attr === 'object' && !Array.isArray(attr)) {
    return attributionOriginLabel(attr as LeadAttribution)
  }
  if (typeof payload.channelKey === 'string' || typeof payload.channelId === 'string') {
    const ch = String(payload.channelKey ?? payload.channelId)
    const tier = typeof payload.tierId === 'string' ? ` · ${payload.tierId}` : ''
    const slug = typeof payload.landingSlug === 'string' ? ` /go/${payload.landingSlug}` : ''
    return `Portal${slug} (${ch})${tier}`
  }
  if (typeof payload.sourcePage === 'string') {
    return `Contact · ${payload.sourcePage}`
  }
  return ''
}

export function attributionOriginLabel(attr: LeadAttribution): string {
  if (attr.source === 'channel_portal' && attr.channelId) {
    const tier = attr.tierId ? ` · ${attr.tierId}` : ''
    return `Portal /go/${attr.landingSlug ?? attr.channelId}${tier}`
  }
  const labels: Record<LeadAttributionSource, string> = {
    channel_portal: 'Consultation portal',
    contact: 'Contact page',
    newsletter: 'Newsletter',
    blog: 'Blog / insights',
    engagement_modal: 'Engagement modal',
    home: 'Home',
  }
  return labels[attr.source] ?? attr.source
}
