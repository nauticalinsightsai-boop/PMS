'use client'

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Copy, Check, ExternalLink, Globe } from 'lucide-react'
import PlatformChannelIcon from '@/components/admin/PlatformChannelIcon'
import { getChannelById } from '@pms/booking-crm/client'
import type { CtaPlatformButton } from '@pms/booking-crm/client'
import type {
  ChannelLandingPage,
  ChannelLandingPageStatus,
  ChannelLandingPrimaryAction,
  ConsultationTier,
} from '@pms/booking-crm/client'
import { mergeChannelLandingPage } from '@pms/booking-crm/client'
import {
  assertTierDurationsValid,
  parseMinutesFromDurationLabel,
  TIER_DURATION_LIMITS,
} from '@pms/booking-crm/client'
import { lintChannelLandingPageDraft } from '@pms/booking-crm/client'
import { buildFullPreviewUrl, buildFullShareUrl } from '@pms/booking-crm/client'
import { useNotification } from '@/contexts/NotificationContext'
import { marketingSiteUrl } from '@/lib/site-config'

export type ChannelLandingEditorMeta = {
  loading: boolean
  saving: boolean
  /** Canonical /go/{slug} link (no preview query). */
  shareUrl: string | null
  publicUrl: string | null
  status: ChannelLandingPageStatus
  hasUnsavedChanges: boolean
}

export type ChannelLandingEditorHandle = {
  saveDraft: () => Promise<void>
  publish: () => Promise<void>
  unpublish: () => Promise<void>
  openPreview: () => void
  copyPublicLink: () => Promise<void>
  reload: () => Promise<void>
  getMeta: () => ChannelLandingEditorMeta
}

type Props = {
  platform: CtaPlatformButton
  embedded?: boolean
  onMetaChange?: (meta: ChannelLandingEditorMeta) => void
}

const emptyDraft = (platform: CtaPlatformButton): ChannelLandingPage =>
  mergeChannelLandingPage(null, platform)

function snapshot(page: ChannelLandingPage): string {
  return JSON.stringify(page)
}

const ChannelLandingEditor = forwardRef<ChannelLandingEditorHandle, Props>(function ChannelLandingEditor(
  { platform, embedded = false, onMetaChange },
  ref
) {
  const { addNotification } = useNotification()
  const channel = getChannelById(platform.channelId)
  const [draft, setDraft] = useState<ChannelLandingPage>(() => emptyDraft(platform))
  const [savedSnapshot, setSavedSnapshot] = useState('')
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [publicUrl, setPublicUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const draftRef = useRef(draft)
  draftRef.current = draft

  const hasUnsavedChanges = savedSnapshot !== '' && snapshot(draft) !== savedSnapshot

  const resolvedShareUrl = shareUrl ?? buildFullShareUrl(draft, marketingSiteUrl)

  const emitMeta = useCallback(() => {
    onMetaChange?.({
      loading,
      saving,
      shareUrl: resolvedShareUrl,
      publicUrl,
      status: draft.status,
      hasUnsavedChanges,
    })
  }, [loading, saving, resolvedShareUrl, publicUrl, draft.status, hasUnsavedChanges, onMetaChange])

  useEffect(() => {
    emitMeta()
  }, [emitMeta])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/channel-landing-pages?channelKey=${encodeURIComponent(platform.channelId)}`,
        { credentials: 'include' }
      )
      const json = await res.json()
      if (json.page) {
        const merged = mergeChannelLandingPage(json.page, platform)
        setDraft(merged)
        setSavedSnapshot(snapshot(merged))
        setShareUrl(json.shareUrl ?? json.publicUrl ?? null)
        setPublicUrl(json.publicUrl ?? null)
      } else {
        const empty = emptyDraft(platform)
        setDraft(empty)
        setSavedSnapshot(snapshot(empty))
        setShareUrl(null)
        setPublicUrl(null)
      }
    } catch {
      addNotification('error', 'Could not load page settings')
    } finally {
      setLoading(false)
    }
  }, [platform, addNotification])

  useEffect(() => {
    load()
  }, [load])

  const personaIssues = useMemo(
    () =>
      lintChannelLandingPageDraft({
        headline: draft.headline,
        subheadline: draft.subheadline,
        targetMessage: draft.targetMessage,
        contextLabel: draft.contextLabel,
        primaryButtonText: draft.primaryButtonText,
      }),
    [draft.headline, draft.subheadline, draft.targetMessage, draft.contextLabel, draft.primaryButtonText]
  )

  const save = useCallback(
    async (intent: 'saveDraft' | 'publish' | 'unpublish') => {
      if (intent !== 'unpublish') {
        try {
          assertTierDurationsValid(draftRef.current.consultationTiers ?? [])
        } catch (e) {
          addNotification(
            'error',
            e instanceof Error ? e.message : 'Tier durations must match 15–30 / 30–45 / 60–90 min bands'
          )
          return
        }
      }
      setSaving(true)
      try {
        const res = await fetch('/api/channel-landing-pages', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelKey: platform.channelId,
            channelId: platform.channelId,
            label: platform.label,
            intent,
            page: draftRef.current,
          }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Save failed')
        if (json.page) {
          setDraft(json.page)
          setSavedSnapshot(snapshot(json.page))
        }
        setShareUrl(json.shareUrl ?? json.publicUrl ?? null)
        setPublicUrl(json.publicUrl ?? null)
        if (intent === 'publish') {
          addNotification('success', 'Published. Copy the public link from the toolbar.')
        } else if (intent === 'unpublish') {
          addNotification('info', 'Unpublished — link no longer works.')
        } else {
          addNotification('success', 'Draft saved')
        }
      } catch (e: unknown) {
        addNotification('error', e instanceof Error ? e.message : 'Save failed')
      } finally {
        setSaving(false)
      }
    },
    [platform, addNotification]
  )

  const copyPublicLink = useCallback(async () => {
    const link = resolvedShareUrl ?? buildFullShareUrl(draftRef.current, marketingSiteUrl)
    if (!link) {
      addNotification('warning', 'Set a URL slug, then save draft to get a shareable link.')
      return
    }
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      addNotification('success', 'Link copied — paste on your platforms')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      addNotification('error', 'Could not copy link')
    }
  }, [resolvedShareUrl, addNotification])

  const openPreview = useCallback(() => {
    const link = buildFullPreviewUrl(draftRef.current, marketingSiteUrl)
    if (!link) {
      addNotification('warning', 'Set a URL slug under Consultation portal, then save draft.')
      return
    }
    window.open(link, '_blank', 'noopener,noreferrer')
    if (hasUnsavedChanges) {
      addNotification(
        'info',
        'Save draft so the shared page shows your latest consultation tiers and copy.'
      )
    }
  }, [hasUnsavedChanges, addNotification])

  useImperativeHandle(
    ref,
    () => ({
      saveDraft: () => save('saveDraft'),
      publish: () => save('publish'),
      unpublish: () => save('unpublish'),
      openPreview,
      copyPublicLink,
      reload: load,
      getMeta: () => ({
        loading,
        saving,
        shareUrl: resolvedShareUrl,
        publicUrl,
        status: draft.status,
        hasUnsavedChanges,
      }),
    }),
    [
      save,
      openPreview,
      copyPublicLink,
      load,
      loading,
      saving,
      resolvedShareUrl,
      publicUrl,
      draft.status,
      hasUnsavedChanges,
    ]
  )

  const update = <K extends keyof ChannelLandingPage>(key: K, value: ChannelLandingPage[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  const updateTier = (tierId: string, patch: Partial<ConsultationTier>) => {
    setDraft((d) => {
      const tiers = [...(d.consultationTiers ?? [])]
      const index = tiers.findIndex((t) => t.id === tierId)
      if (index < 0) return d
      tiers[index] = { ...tiers[index], ...patch }
      return { ...d, consultationTiers: tiers }
    })
  }

  if (loading) {
    return <p className="text-body text-muted-foreground py-8">Loading channel settings…</p>
  }

  return (
    <div className={embedded ? 'w-full' : 'max-w-3xl animate-in fade-in duration-300'}>
      {!embedded && (
        <header className="flex flex-wrap items-start gap-4 mb-8">
          <div
            className="p-3 rounded-lg shrink-0"
            style={{ backgroundColor: `${channel?.color ?? '#6B7280'}22`, color: channel?.color }}
          >
            <PlatformChannelIcon name={channel?.icon} size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-h1 text-foreground">{platform.label}</h1>
          </div>
        </header>
      )}

      {personaIssues.length > 0 && (
        <ul className="mb-6 p-4 r-card border border-amber-500/40 bg-amber-500/5 space-y-2">
          {personaIssues.map((issue, i) => (
            <li
              key={`${issue.field}-${i}`}
              className={`text-meta ${issue.severity === 'error' ? 'text-red-600' : 'text-amber-700'}`}
            >
              <span className="font-mono">{issue.field}</span>: {issue.message}
            </li>
          ))}
        </ul>
      )}

      {embedded && (
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-muted-foreground/10">
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '0.75rem',
              backgroundColor: '#004B8E',
              color: '#F4F4F5',
            }}
          >
            <PlatformChannelIcon name={channel?.icon} size={22} />
          </div>
          <div>
            <h2 className="text-h3 text-foreground">{platform.label}</h2>
            <p className="text-meta text-muted-foreground mt-0.5">
              Status:{' '}
              <span
                className={
                  draft.status === 'published' ? 'text-emerald-600 font-medium' : 'text-foreground'
                }
              >
                {draft.status === 'published' ? 'Published' : 'Draft'}
              </span>
              {hasUnsavedChanges ? <span className="text-amber-600 ml-2">· Unsaved changes</span> : null}
            </p>
          </div>
        </div>
      )}

      {resolvedShareUrl && (
        <div className="mb-6 p-4 r-card border border-emerald-500/30 bg-emerald-500/5">
          <p className="text-label font-medium text-foreground mb-2 flex items-center gap-2">
            <Globe size={16} className="text-emerald-600" aria-hidden />
            Portal link
          </p>
          <p className="text-meta text-muted-foreground mb-2">
            Canonical /go/ URL for this channel. Use Preview in the toolbar to see draft changes;
            publish before visitors see live content on this link.
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            <code className="flex-1 min-w-0 text-meta break-all text-brand-orange">
              {resolvedShareUrl}
            </code>
            <button
              type="button"
              onClick={copyPublicLink}
              aria-label={copied ? 'Link copied' : 'Copy portal link'}
              title={copied ? 'Copied' : 'Copy link'}
              className="inline-flex items-center justify-center shrink-0 p-2 r-card-sm text-label bg-card hover:bg-brand-orange/10 text-brand-orange"
            >
              {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
            </button>
            {!embedded ? (
              <a
                href={resolvedShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 r-card-sm text-label text-brand-orange hover:bg-brand-orange/10"
              >
                Open
                <ExternalLink size={14} aria-hidden />
              </a>
            ) : null}
          </div>
        </div>
      )}

      <div className="space-y-8">
        <section className="space-y-4">
          <h3 className="text-h4 text-foreground">Consultation portal</h3>
          <p className="text-body-sm text-muted-foreground">
            Only the fields below appear on the live /go/ page. Context label and headline are stored
            for legacy data but not rendered.
          </p>
          <label className="block">
            <span className="text-meta text-muted-foreground">Subheadline (shown under profile)</span>
            <input
              value={draft.subheadline}
              onChange={(e) => update('subheadline', e.target.value)}
              className="mt-1 w-full p-3 r-input bg-card text-foreground"
            />
          </label>
          {platform.channelId === 'webinar' ? (
            <>
              <label className="block">
                <span className="text-meta text-muted-foreground">
                  Webinar overview (what it covers — shown on /go/webinar)
                </span>
                <textarea
                  value={draft.webinarAbout ?? ''}
                  onChange={(e) => update('webinarAbout', e.target.value)}
                  rows={5}
                  className="mt-1 w-full p-3 r-input bg-card text-foreground resize-y"
                  placeholder="Topic, audience, outcomes, and what attendees should prepare."
                />
              </label>
              <label className="block">
                <span className="text-meta text-muted-foreground">
                  Briefing video URL (YouTube or Vimeo)
                </span>
                <input
                  value={draft.webinarVideoUrl ?? ''}
                  onChange={(e) => update('webinarVideoUrl', e.target.value)}
                  className="mt-1 w-full p-3 r-input bg-card text-foreground font-mono text-meta"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </label>
            </>
          ) : (
            <label className="block">
              <span className="text-meta text-muted-foreground">Body (optional)</span>
              <textarea
                value={draft.body}
                onChange={(e) => update('body', e.target.value)}
                rows={5}
                className="mt-1 w-full p-3 r-input bg-card text-foreground resize-y"
              />
            </label>
          )}
          <label className="block">
            <span className="text-meta text-muted-foreground">Target message (callout box)</span>
            <textarea
              value={draft.targetMessage}
              onChange={(e) => update('targetMessage', e.target.value)}
              rows={2}
              className="mt-1 w-full p-3 r-input bg-card text-foreground resize-y"
            />
          </label>
          <label className="block">
            <span className="text-meta text-muted-foreground">Availability pill</span>
            <input
              value={draft.availabilityLabel}
              onChange={(e) => update('availabilityLabel', e.target.value)}
              className="mt-1 w-full p-3 r-input bg-card text-foreground"
            />
          </label>
          <label className="block">
            <span className="text-meta text-muted-foreground">URL slug (path after /go/)</span>
            <input
              value={draft.slug}
              onChange={(e) => update('slug', e.target.value)}
              className="mt-1 w-full p-3 r-input bg-card text-foreground font-mono text-meta"
            />
          </label>
        </section>

        <section className="space-y-4">
          <h3 className="text-h4 text-foreground">Consultation tiers</h3>
          <p className="text-body-sm text-muted-foreground">
            {platform.channelId === 'webinar'
              ? 'Webinar portals use three tiers: Free Mentor Intro, Career & Pathway Session, and Services Discussion. Pack prices apply on publish.'
              : 'Pack prices and durations apply on publish. Override titles, descriptions, and optional tier CTA labels below.'}
          </p>
          {(draft.consultationTiers ?? [])
            .filter((t) => platform.channelId !== 'webinar' || t.id !== 'design-review')
            .map((tier) => (
            <div key={tier.id} className="p-4 r-card border border-muted-foreground/15 space-y-3">
              <p className="text-label text-foreground">
                {platform.channelId === 'webinar'
                  ? tier.id === 'discovery'
                    ? 'Free webinar session'
                    : 'Paid webinar session'
                  : tier.id === 'discovery'
                    ? 'Discovery (all platforms)'
                    : tier.id === 'executive'
                      ? `Executive · ${platform.label}`
                      : `Design review · ${platform.label}`}
                {tier.recommended ? (
                  <span className="text-orange-600 text-meta ml-2">· Recommended</span>
                ) : null}
              </p>
              <input
                value={tier.title}
                onChange={(e) => updateTier(tier.id, { title: e.target.value })}
                className="w-full p-2 r-input bg-card text-foreground text-body-sm"
                placeholder="Title"
              />
              <textarea
                value={tier.description}
                onChange={(e) => updateTier(tier.id, { description: e.target.value })}
                rows={2}
                className="w-full p-2 r-input bg-card text-foreground text-body-sm resize-y"
                placeholder="Description"
              />
              <input
                value={tier.bestFor ?? ''}
                onChange={(e) => updateTier(tier.id, { bestFor: e.target.value })}
                className="w-full p-2 r-input bg-card text-foreground text-body-sm"
                placeholder="Best for"
              />
              <input
                value={tier.outcome ?? ''}
                onChange={(e) => updateTier(tier.id, { outcome: e.target.value })}
                className="w-full p-2 r-input bg-card text-foreground text-body-sm"
                placeholder="Outcome"
              />
              <input
                value={tier.ctaLabel ?? ''}
                onChange={(e) => updateTier(tier.id, { ctaLabel: e.target.value })}
                className="w-full p-2 r-input bg-card text-foreground text-body-sm"
                placeholder="Tier CTA label"
              />
              <input
                value={tier.scheduleUrl ?? ''}
                onChange={(e) => updateTier(tier.id, { scheduleUrl: e.target.value })}
                className="w-full p-2 r-input bg-card text-foreground text-body-sm font-mono"
                placeholder="Calendly URL (optional)"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={tier.durationLabel}
                  onChange={(e) => updateTier(tier.id, { durationLabel: e.target.value })}
                  className="p-2 r-input bg-card text-foreground text-body-sm"
                  placeholder="Duration"
                />
                {(() => {
                  const limits = TIER_DURATION_LIMITS[tier.id as keyof typeof TIER_DURATION_LIMITS]
                  const mins = parseMinutesFromDurationLabel(tier.durationLabel)
                  if (!limits || mins == null) return null
                  if (mins < limits.min || mins > limits.max) {
                    return (
                      <p className="text-meta text-amber-600 col-span-2">
                        Use {limits.min}–{limits.max} minutes for {tier.id}
                      </p>
                    )
                  }
                  return null
                })()}
                <input
                  value={tier.priceLabel}
                  onChange={(e) => updateTier(tier.id, { priceLabel: e.target.value })}
                  className="p-2 r-input bg-card text-foreground text-body-sm"
                  placeholder="Price label"
                />
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h3 className="text-h4 text-foreground">Action & booking</h3>
          <label className="block">
            <span className="text-meta text-muted-foreground">
              Stored primary button text (legacy — tier buttons use pack CTA)
            </span>
            <input
              value={draft.primaryButtonText}
              onChange={(e) => update('primaryButtonText', e.target.value)}
              className="mt-1 w-full p-3 r-input bg-card text-foreground"
              placeholder="Reserve your slot"
            />
          </label>
          <label className="block">
            <span className="text-meta text-muted-foreground">What happens when visitors click</span>
            <select
              value={draft.primaryAction}
              onChange={(e) => update('primaryAction', e.target.value as ChannelLandingPrimaryAction)}
              className="mt-1 w-full p-3 r-input bg-card text-foreground"
            >
              <option value="booking_form">Show booking form on this page</option>
              <option value="contact_link">Link to site contact page</option>
              <option value="external_link">Open external URL</option>
            </select>
          </label>
          {draft.primaryAction === 'external_link' && (
            <label className="block">
              <span className="text-meta text-muted-foreground">External URL</span>
              <input
                value={draft.externalUrl ?? ''}
                onChange={(e) => update('externalUrl', e.target.value)}
                className="mt-1 w-full p-3 r-input bg-card text-foreground"
                placeholder="https://"
              />
            </label>
          )}
          {draft.primaryAction === 'contact_link' && (
            <label className="block">
              <span className="text-meta text-muted-foreground">Contact service preset</span>
              <input
                value={draft.contactService ?? ''}
                onChange={(e) => update('contactService', e.target.value)}
                className="mt-1 w-full p-3 r-input bg-card text-foreground"
              />
            </label>
          )}
          <label className="flex items-center gap-2 text-body-sm text-foreground">
            <input
              type="checkbox"
              checked={draft.showBookingForm}
              onChange={(e) => update('showBookingForm', e.target.checked)}
            />
            Show optional booking form below tier cards
          </label>
          <label className="flex items-center gap-2 text-body-sm text-foreground">
            <input
              type="checkbox"
              checked={draft.collectCompany}
              onChange={(e) => update('collectCompany', e.target.checked)}
            />
            Ask for company name
          </label>
        </section>

        <section className="space-y-4">
          <h3 className="text-h4 text-foreground">Conversion sections</h3>
          <p className="text-body-sm text-muted-foreground">
            Credibility tabs, Before you book, FAQ, assurances under tiers, and final CTA come from the
            pack. Trust line is no longer shown. Risk reversal lives inside Before you book.
          </p>
          <label className="block">
            <span className="text-meta text-muted-foreground">Final CTA label (sticky + footer button)</span>
            <input
              value={draft.conversion?.finalCtaLabel ?? ''}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  conversion: { ...d.conversion, finalCtaLabel: e.target.value },
                }))
              }
              className="mt-1 w-full p-3 r-input bg-card text-foreground"
            />
          </label>
          <label className="block">
            <span className="text-meta text-muted-foreground">Risk reversal</span>
            <textarea
              value={draft.conversion?.riskReversal ?? ''}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  conversion: { ...d.conversion, riskReversal: e.target.value },
                }))
              }
              rows={2}
              className="mt-1 w-full p-3 r-input bg-card text-foreground text-body-sm resize-y"
            />
          </label>
        </section>

        <section className="space-y-4">
          <h3 className="text-h4 text-foreground">Display</h3>
          <label className="block">
            <span className="text-meta text-muted-foreground">Theme</span>
            <select
              value={draft.theme}
              onChange={(e) => update('theme', e.target.value as ChannelLandingPage['theme'])}
              className="mt-1 w-full p-3 r-input bg-card text-foreground"
            >
              <option value="brand">Brand</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-body-sm text-foreground">
            <input
              type="checkbox"
              checked={draft.showLogo}
              onChange={(e) => update('showLogo', e.target.checked)}
            />
            Show logo on public page
          </label>
        </section>
      </div>

      {!embedded && (
        <div className="flex flex-wrap gap-3 mt-10 pt-8 border-t border-muted-foreground/15">
          <button type="button" className="px-4 py-2 r-card-sm text-label" disabled={saving} onClick={() => save('saveDraft')}>
            Save draft
          </button>
          <button type="button" className="px-4 py-2 r-card-sm text-label bg-brand-orange text-white" disabled={saving} onClick={() => save('publish')}>
            Publish
          </button>
        </div>
      )}
    </div>
  )
})

export default ChannelLandingEditor
