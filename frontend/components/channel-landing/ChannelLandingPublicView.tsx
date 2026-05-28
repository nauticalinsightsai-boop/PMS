'use client'

import React, { useState } from 'react'
import { Anchor, CheckCircle } from 'lucide-react'
import type { ChannelLandingPage } from '@/types/channelLandingPage'
import { submitPublicInteraction } from '@/lib/interactions/submit-public'
import { BRAND_NAV_LOGO } from '@/lib/brand/site-logo'
import CTAButton from '@/components/ui/buttons/CTAButton'

type Props = {
  page: ChannelLandingPage
}

export default function ChannelLandingPublicView({ page }: Props) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [hp, setHp] = useState('')

  const themeClass =
    page.theme === 'dark'
      ? 'bg-slate-950 text-slate-100'
      : page.theme === 'light'
        ? 'bg-white text-slate-900'
        : 'bg-brand-subtle text-brand-text'

  const cardClass =
    page.theme === 'dark'
      ? 'bg-slate-900/80 border-slate-700'
      : 'bg-white/90 dark:bg-slate-900/70 border-brand-border/40'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !firstName || !whatsapp) return
    setSubmitting(true)
    const res = await submitPublicInteraction({
      source: 'contact',
      subject: `Channel landing — ${page.label}${page.subtitle ? ` (${page.subtitle})` : ''}`,
      email,
      website: hp,
      payload: {
        firstName,
        lastName,
        whatsappNumber: whatsapp,
        company: page.collectCompany ? company : undefined,
        message: message || `Booking request via ${page.label} landing page`,
        channelKey: page.channelKey,
        landingSlug: page.slug,
      },
    })
    setSubmitting(false)
    if (res.ok) setSubmitted(true)
  }

  const primaryHref =
    page.primaryAction === 'external_link' && page.externalUrl
      ? page.externalUrl
      : page.primaryAction === 'contact_link'
        ? `/contact?service=${encodeURIComponent(page.contactService || 'Advisory')}`
        : undefined

  return (
    <div className={`min-h-screen ${themeClass}`}>
      <div className="max-w-xl mx-auto px-4 py-10 sm:py-14">
        {page.showLogo && (
          <div className="flex items-center gap-2 mb-8">
            <Anchor className="text-brand-accent" size={22} aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BRAND_NAV_LOGO.light} alt="Sheikh M. Abdullah" className="h-8 w-auto dark:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BRAND_NAV_LOGO.dark} alt="Sheikh M. Abdullah" className="h-8 w-auto hidden dark:block" />
          </div>
        )}

        <article className={`r-card p-6 sm:p-8 border shadow-raised ${cardClass}`}>
          <p className="text-meta text-brand-muted uppercase tracking-wider mb-2">{page.label}</p>
          {page.subtitle ? (
            <p className="text-meta text-brand-accent mb-3">{page.subtitle}</p>
          ) : null}
          <h1 className="text-h2 sm:text-h1 text-brand-text mb-3">{page.headline}</h1>
          {page.subheadline ? (
            <p className="text-body text-brand-muted mb-4">{page.subheadline}</p>
          ) : null}
          {page.body ? (
            <div className="text-body-sm text-brand-text whitespace-pre-wrap mb-6">{page.body}</div>
          ) : null}

          {submitted ? (
            <div className="flex items-start gap-3 p-4 r-card-sm bg-emerald-500/10 text-emerald-800 dark:text-emerald-200">
              <CheckCircle size={20} className="shrink-0" aria-hidden />
              <p className="text-body-sm">Thank you. Your request was received. We will follow up shortly.</p>
            </div>
          ) : page.showBookingForm && page.primaryAction === 'booking_form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full p-3 r-input bg-white/70 dark:bg-slate-900/60 text-brand-text text-body-sm"
                />
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full p-3 r-input bg-white/70 dark:bg-slate-900/60 text-brand-text text-body-sm"
                />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-3 r-input bg-white/70 dark:bg-slate-900/60 text-brand-text text-body-sm"
              />
              <input
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="WhatsApp / phone"
                className="w-full p-3 r-input bg-white/70 dark:bg-slate-900/60 text-brand-text text-body-sm"
              />
              {page.collectCompany && (
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company (optional)"
                  className="w-full p-3 r-input bg-white/70 dark:bg-slate-900/60 text-brand-text text-body-sm"
                />
              )}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What would you like to discuss?"
                rows={4}
                className="w-full p-3 r-input bg-white/70 dark:bg-slate-900/60 text-brand-text text-body-sm resize-y"
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
              <CTAButton type="submit" variant="primary" disabled={submitting} className="w-full">
                {submitting ? 'Sending…' : page.primaryButtonText}
              </CTAButton>
            </form>
          ) : primaryHref ? (
            <a href={primaryHref} target={primaryHref.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
              <CTAButton variant="primary" className="w-full">
                {page.primaryButtonText}
              </CTAButton>
            </a>
          ) : null}
        </article>

        <p className="text-meta text-center text-brand-muted mt-8">
          Sheikh M. Abdullah · Strategic advisory
        </p>
      </div>
    </div>
  )
}
