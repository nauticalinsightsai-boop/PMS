import type { LeadAttribution } from './channel-landing-pages/lead-attribution'
import { attributionOriginLabel } from './channel-landing-pages/lead-attribution'

/** Human-readable labels for `form_submissions.source` values. */
export const FORM_SOURCE_LABELS: Record<string, string> = {
  contact: 'Contact',
  meeting_booking: 'Meeting / booking',
  subscription: 'Newsletter',
  documentation_request: 'Documentation',
  pmp_roadmap_lead: 'PMP roadmap lead',
  cert_roadmap_lead: 'Certification roadmap',
  consultation: 'Pathway consultation',
  waitlist: 'Waitlist',
  scholarship_review: 'Scholarship review',
}

export function submissionSourceLabel(source: string): string {
  const key = source.trim()
  if (!key) return '-'
  return FORM_SOURCE_LABELS[key] ?? key.replace(/_/g, ' ')
}

export type WebsiteFormContextInput = {
  formId: string
  formLabel?: string
  pagePath?: string
  placement?: string
  siteCertId?: string
  certName?: string
  offeringId?: string
  tierLabel?: string
  regionId?: string
  certificationInterest?: string
  channelKey?: string
  landingSlug?: string
  topic?: string
  attribution?: LeadAttribution
}

function resolveOriginLabel(input: WebsiteFormContextInput, pagePath?: string): string {
  if (input.formLabel?.trim()) {
    const cert = input.certName?.trim()
    const interest = input.certificationInterest?.trim()
    const tier = input.tierLabel?.trim()
    const parts = [input.formLabel.trim()]
    if (cert) parts.push(cert)
    else if (interest) parts.push(interest)
    if (tier) parts.push(tier)
    if (input.placement?.trim()) parts.push(`(${input.placement.trim()})`)
    if (pagePath) parts.push(`· ${pagePath}`)
    return parts.join(' · ')
  }

  if (input.attribution) {
    const base = attributionOriginLabel(input.attribution)
    return pagePath ? `${base} · ${pagePath}` : base
  }

  if (input.siteCertId || input.certName) {
    const cert = input.certName ?? input.siteCertId ?? 'Certification'
    const place = input.placement ? ` · ${input.placement}` : ''
    return `${cert}${place}${pagePath ? ` · ${pagePath}` : ''}`
  }

  if (input.channelKey || input.landingSlug) {
    const slug = input.landingSlug ? `/go/${input.landingSlug}` : ''
    return `Channel${slug} (${input.channelKey ?? 'portal'})${pagePath ? ` · ${pagePath}` : ''}`
  }

  if (pagePath) return `Website · ${pagePath}`
  return 'Website'
}

/** Standard attribution fields merged into every public form payload. */
export function buildWebsiteFormContext(
  input: WebsiteFormContextInput,
): Record<string, unknown> {
  const pagePath =
    input.pagePath ??
    (typeof window !== 'undefined' ? window.location.pathname : undefined)
  const pageUrl =
    typeof window !== 'undefined' && pagePath
      ? `${window.location.origin}${pagePath}`
      : undefined

  const originLabel = resolveOriginLabel(input, pagePath)

  return {
    formId: input.formId,
    formLabel: input.formLabel,
    placement: input.placement,
    pagePath,
    pageUrl,
    siteCertId: input.siteCertId,
    certName: input.certName,
    offeringId: input.offeringId,
    tierLabel: input.tierLabel,
    regionId: input.regionId,
    certificationInterest: input.certificationInterest,
    channelKey: input.channelKey,
    landingSlug: input.landingSlug,
    topic: input.topic,
    originLabel,
    attribution: input.attribution,
    submittedAt: new Date().toISOString(),
  }
}

export function pagePathFromPayload(payload: Record<string, unknown>): string {
  if (typeof payload.pagePath === 'string' && payload.pagePath.trim()) {
    return payload.pagePath.trim()
  }
  const attr = payload.attribution
  if (attr && typeof attr === 'object' && !Array.isArray(attr)) {
    const p = (attr as LeadAttribution).pagePath
    if (typeof p === 'string' && p.trim()) return p.trim()
  }
  if (typeof payload.sourcePage === 'string') return payload.sourcePage.trim()
  return ''
}

export function certNameFromPayload(payload: Record<string, unknown>): string {
  if (typeof payload.certName === 'string' && payload.certName.trim()) {
    return payload.certName.trim()
  }
  if (typeof payload.certificationInterest === 'string' && payload.certificationInterest.trim()) {
    return payload.certificationInterest.trim()
  }
  if (typeof payload.siteCertId === 'string' && payload.siteCertId.trim()) {
    return payload.siteCertId.trim()
  }
  return ''
}

export function formIdFromPayload(payload: Record<string, unknown>): string {
  if (typeof payload.formId === 'string' && payload.formId.trim()) {
    return payload.formId.trim()
  }
  if (typeof payload.placement === 'string' && payload.placement.trim()) {
    return payload.placement.trim()
  }
  return ''
}

const CONTEXT_PAYLOAD_KEYS = new Set([
  'formId',
  'formLabel',
  'placement',
  'pagePath',
  'pageUrl',
  'siteCertId',
  'certName',
  'offeringId',
  'tierLabel',
  'regionId',
  'certificationInterest',
  'channelKey',
  'landingSlug',
  'channelId',
  'topic',
  'originLabel',
  'origin_label',
  'attribution',
  'submittedAt',
  'sourcePage',
])

const FIELD_LABELS: Record<string, string> = {
  fullName: 'Full name',
  name: 'Name',
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  phone: 'Phone',
  phoneFull: 'Phone (full)',
  phoneCountryCode: 'Country code',
  phoneCountryPrefix: 'Dial prefix',
  whatsapp: 'WhatsApp',
  whatsappNumber: 'WhatsApp / phone',
  role: 'Role / job title',
  jobExperienceYears: 'Years of experience',
  dailyStudyTime: 'Daily study time',
  certificationInterest: 'Certification interest',
  certificationInterestType: 'Interest type',
  message: 'Message',
  notes: 'Notes',
  company: 'Company',
  visitorWebsite: 'Website',
  offeringId: 'Offering',
  regionId: 'Region',
}

function formatFieldValue(value: unknown): string {
  if (value == null || value === '') return ''
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  if (Array.isArray(value)) return value.map((v) => formatFieldValue(v)).filter(Boolean).join(', ')
  return JSON.stringify(value)
}

/** User-entered form fields from payload (excludes attribution/context keys). */
export function formFieldsFromPayload(
  payload: Record<string, unknown>,
): Array<{ key: string; label: string; value: string }> {
  const rows: Array<{ key: string; label: string; value: string }> = []
  for (const [key, raw] of Object.entries(payload)) {
    if (CONTEXT_PAYLOAD_KEYS.has(key)) continue
    const value = formatFieldValue(raw)
    if (!value) continue
    rows.push({
      key,
      label: FIELD_LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim(),
      value,
    })
  }
  return rows
}
