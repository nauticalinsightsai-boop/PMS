'use client'

import { useState } from 'react'
import { submitPublicInteraction } from '@/lib/interactions/submit-public'
import {
  attributionOriginLabel,
  buildLeadAttribution,
} from '@/lib/channel-landing-pages/lead-attribution'
import CTAButton from '@/components/ui/buttons/CTAButton'
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'
import { portalFormMaxWidthClass } from '@/lib/channel-landing-pages/portalLayoutClasses'

export default function ChannelPortalBookingForm({ page, theme, sectionOrder }: PortalSectionProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [visitorWebsite, setVisitorWebsite] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [hp, setHp] = useState('')
  const [privacyConsent, setPrivacyConsent] = useState(false)

  if (!page.showBookingForm || page.primaryAction !== 'booking_form') return null

  const inputStyle: React.CSSProperties = {
    borderRadius: theme.radius,
    border: `1px solid ${theme.cardBorder}`,
    backgroundColor: theme.surface,
    color: theme.text,
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !firstName || !whatsapp || !privacyConsent) return
    setSubmitting(true)
    const attribution = buildLeadAttribution({
      source: 'channel_portal',
      channelId: page.channelId,
      channelKey: page.channelKey,
      landingSlug: page.slug,
      pagePath: typeof window !== 'undefined' ? window.location.pathname : undefined,
    })
    const res = await submitPublicInteraction({
      source: 'meeting_booking',
      subject: `Portal booking — ${page.label}${page.subtitle ? ` (${page.subtitle})` : ''}`,
      email,
      website: hp,
      payload: {
        firstName,
        lastName,
        whatsappNumber: whatsapp,
        visitorWebsite: visitorWebsite.trim() || undefined,
        company: page.collectCompany ? company : undefined,
        message: message || `Booking request via ${page.label} portal`,
        channelKey: page.channelKey,
        channelId: page.channelId,
        landingSlug: page.slug,
        attribution,
        originLabel: attributionOriginLabel(attribution),
      },
    })
    setSubmitting(false)
    if (res.ok) setSubmitted(true)
  }

  return (
    <section
      className="mt-12 pt-10"
      style={{
        order: sectionOrder,
        borderTop: `1px solid ${theme.cardBorder}`,
      }}
    >
      <h4 className="text-h4 mb-4" style={{ color: theme.text }}>
        Request via form
      </h4>
      {submitted ? (
        <p className="text-body-sm" style={{ color: theme.primary }}>
          Thank you — we will follow up shortly.
        </p>
      ) : (
        <form onSubmit={handleFormSubmit} className={`space-y-3 ${portalFormMaxWidthClass()}`}>
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="w-full p-3 text-body-sm"
              style={inputStyle}
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className="w-full p-3 text-body-sm"
              style={inputStyle}
            />
          </div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 text-body-sm"
            style={inputStyle}
          />
          <input
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="WhatsApp / phone"
            className="w-full p-3 text-body-sm"
            style={inputStyle}
          />
          <input
            type="url"
            value={visitorWebsite}
            onChange={(e) => setVisitorWebsite(e.target.value)}
            placeholder="Your website or project URL (optional)"
            className="w-full p-3 text-body-sm"
            style={inputStyle}
          />
          {page.collectCompany && (
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company (optional)"
              className="w-full p-3 text-body-sm"
              style={inputStyle}
            />
          )}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What would you like to discuss?"
            rows={4}
            className="w-full p-3 text-body-sm resize-y"
            style={inputStyle}
          />
          <input
            type="text"
            name="website"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
          />
          <label className="flex items-start gap-2 text-meta cursor-pointer" style={{ color: theme.textMuted }}>
            <input
              type="checkbox"
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 shrink-0"
              required
            />
            <span>
              I agree to the{' '}
              <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: theme.linkColor }}>
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="/legal/services" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: theme.linkColor }}>
                Services Terms
              </a>
              .
            </span>
          </label>
          <CTAButton type="submit" variant="primary" disabled={submitting || !privacyConsent}>
            {submitting ? 'Sending…' : page.primaryButtonText}
          </CTAButton>
        </form>
      )}
    </section>
  )
}
