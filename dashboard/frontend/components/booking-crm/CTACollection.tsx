'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Plus, X, Eye, EyeOff } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import PlatformChannelIcon from '@/components/admin/PlatformChannelIcon'
import {
  AdminCmsEditorShell,
  AdminCmsTabBar,
  AdminCmsFilterToolbar,
  ADMIN_CMS_FILTER_INPUT_CLASS,
  ADMIN_CMS_PREVIEW_BUTTON_CLASS,
  ADMIN_CMS_TAB_BAR_OUTER_CLASS,
  adminCmsTabButtonClass,
} from '@/components/admin/layout'
import {
  CTA_PLATFORM_CATEGORY_TABS,
  type ChannelLandingPageStatus,
  type CtaChannelEntry,
  type PlatformCategory,
  getCategoryForChannelKey,
  getChannelCountByCategory,
  getCtaChannelById,
  getCtaChannelsForCategory,
  resolveChannelIdFromLegacyKey,
  toCtaPlatformButton,
} from '@pms/booking-crm/client'
import ChannelLandingEditor, {
  type ChannelLandingEditorHandle,
  type ChannelLandingEditorMeta,
} from '@/components/booking-crm/ChannelLandingEditor'
import { BOOKING_CRM_CTA_PATH } from '@/lib/dashboard/bookingCrmRedirects'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const DEFAULT_CATEGORY = CTA_PLATFORM_CATEGORY_TABS[0].id
const CTA_COLLECTION_UI_PREFS_KEY = 'cta-collection-ui-prefs-v1'

function resolveInitialChannelId(channelParam: string | null): string {
  if (!channelParam) return ''
  return resolveChannelIdFromLegacyKey(channelParam) ?? channelParam
}

function toCustomChannelId(category: PlatformCategory, label: string): string {
  const base = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const categoryKey = category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return `custom-${categoryKey}-${base || 'channel'}`
}

export default function CTACollection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editorRef = useRef<ChannelLandingEditorHandle>(null)
  const channelFromUrl = searchParams?.get('channel') ?? null
  const categoryFromUrl = searchParams?.get('category') as PlatformCategory | null

  const [activeCategory, setActiveCategory] = useState<PlatformCategory>(() => {
    if (categoryFromUrl && CTA_PLATFORM_CATEGORY_TABS.some((c) => c.id === categoryFromUrl)) {
      return categoryFromUrl
    }
    const id = resolveInitialChannelId(channelFromUrl)
    if (id) {
      const cat = getCategoryForChannelKey(id)
      if (cat) return cat
    }
    return DEFAULT_CATEGORY
  })

  const [activeChannelId, setActiveChannelId] = useState(() => {
    const fromUrl = resolveInitialChannelId(channelFromUrl)
    if (fromUrl && getCtaChannelById(fromUrl)) return fromUrl
    return getCtaChannelsForCategory(DEFAULT_CATEGORY)[0]?.channelId ?? ''
  })

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [statusByChannel, setStatusByChannel] = useState<Record<string, ChannelLandingPageStatus>>({})
  const [hiddenCategories, setHiddenCategories] = useState<PlatformCategory[]>([])
  const [deletedCategories, setDeletedCategories] = useState<PlatformCategory[]>([])
  const [hiddenChannelsByCategory, setHiddenChannelsByCategory] = useState<
    Partial<Record<PlatformCategory, string[]>>
  >({})
  const [deletedChannelsByCategory, setDeletedChannelsByCategory] = useState<
    Partial<Record<PlatformCategory, string[]>>
  >({})
  const [showCategoryAddControls, setShowCategoryAddControls] = useState(false)
  const [categoryVisibilityDraft, setCategoryVisibilityDraft] = useState<PlatformCategory[] | null>(null)
  const [showChannelAddControls, setShowChannelAddControls] = useState(false)
  const [channelVisibilityDraft, setChannelVisibilityDraft] = useState<string[] | null>(null)
  const [newCategoryLabel, setNewCategoryLabel] = useState('')
  const [customCategoryLabels, setCustomCategoryLabels] = useState<string[]>([])
  const [newChannelLabel, setNewChannelLabel] = useState('')
  const [pendingDeleteChannel, setPendingDeleteChannel] = useState<{
    channelId: string
    channelLabel: string
    typed: string
  } | null>(null)
  const [pendingDeleteCategory, setPendingDeleteCategory] = useState<{
    categoryId: PlatformCategory
    categoryLabel: string
    typed: string
  } | null>(null)
  const [customChannelsByCategory, setCustomChannelsByCategory] = useState<
    Partial<Record<PlatformCategory, CtaChannelEntry[]>>
  >({})
  const [uiPrefsHydrated, setUiPrefsHydrated] = useState(false)
  const [meta, setMeta] = useState<ChannelLandingEditorMeta>({
    loading: true,
    saving: false,
    shareUrl: null,
    publicUrl: null,
    status: 'draft',
    hasUnsavedChanges: false,
  })

  const categoryTabItems = useMemo(() => {
    const counts = getChannelCountByCategory()
    return CTA_PLATFORM_CATEGORY_TABS.filter(
      (c) => !hiddenCategories.includes(c.id) && !deletedCategories.includes(c.id)
    ).map((c) => ({
      id: c.id,
      label: `${c.label} (${counts[c.id]})`,
    }))
  }, [hiddenCategories, deletedCategories])

  const allChannelsInCategory = useMemo(() => {
    const defaults = getCtaChannelsForCategory(activeCategory)
    const custom = customChannelsByCategory[activeCategory] ?? []
    const deleted = new Set(deletedChannelsByCategory[activeCategory] ?? [])
    return [...defaults, ...custom].filter((ch) => !deleted.has(ch.channelId))
  }, [activeCategory, customChannelsByCategory, deletedChannelsByCategory])

  const channelsInCategory = useMemo(() => {
    const all = allChannelsInCategory
    const hidden = new Set(hiddenChannelsByCategory[activeCategory] ?? [])
    return all.filter((ch) => !hidden.has(ch.channelId))
  }, [activeCategory, hiddenChannelsByCategory, allChannelsInCategory])

  const hiddenChannelsForActiveCategory = useMemo(
    () => hiddenChannelsByCategory[activeCategory] ?? [],
    [activeCategory, hiddenChannelsByCategory]
  )

  const filteredChannels = useMemo(() => {
    const q = query.trim().toLowerCase()
    return channelsInCategory.filter((ch) => {
      if (statusFilter !== 'all') {
        const st = statusByChannel[ch.channelId] ?? 'draft'
        const ok = statusFilter === 'published' ? st === 'published' : st !== 'published'
        if (!ok) return false
      }
      if (!q) return true
      return `${ch.label} ${ch.channelId}`.toLowerCase().includes(q)
    })
  }, [channelsInCategory, query, statusFilter, statusByChannel])

  const effectiveChannelId = useMemo(() => {
    if (filteredChannels.some((c) => c.channelId === activeChannelId)) return activeChannelId
    return filteredChannels[0]?.channelId ?? activeChannelId
  }, [filteredChannels, activeChannelId])

  const activeEntry = useMemo(() => {
    return (
      filteredChannels.find((c) => c.channelId === effectiveChannelId) ??
      channelsInCategory.find((c) => c.channelId === effectiveChannelId) ??
      getCtaChannelById(effectiveChannelId) ??
      filteredChannels[0] ??
      channelsInCategory[0] ??
      null
    )
  }, [effectiveChannelId, filteredChannels, channelsInCategory])

  const activePlatform = useMemo(
    () => (activeEntry ? toCtaPlatformButton(activeEntry) : null),
    [activeEntry]
  )

  const loadAllStatuses = useCallback(async () => {
    try {
      const res = await fetch('/api/channel-landing-pages', { credentials: 'include' })
      const json = await res.json()
      if (json.pages && typeof json.pages === 'object') {
        const map: Record<string, ChannelLandingPageStatus> = {}
        for (const page of Object.values(json.pages) as {
          status: ChannelLandingPageStatus
          channelId: string
        }[]) {
          if (page.channelId) map[page.channelId] = page.status
        }
        setStatusByChannel(map)
      }
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    loadAllStatuses()
  }, [loadAllStatuses])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CTA_COLLECTION_UI_PREFS_KEY)
      if (!raw) {
        setUiPrefsHydrated(true)
        return
      }
      const parsed = JSON.parse(raw) as {
        hiddenCategories?: PlatformCategory[]
        deletedCategories?: PlatformCategory[]
        hiddenChannelsByCategory?: Partial<Record<PlatformCategory, string[]>>
        deletedChannelsByCategory?: Partial<Record<PlatformCategory, string[]>>
        customCategoryLabels?: string[]
        customChannelsByCategory?: Partial<Record<PlatformCategory, CtaChannelEntry[]>>
      }
      setHiddenCategories(parsed.hiddenCategories ?? [])
      setDeletedCategories(parsed.deletedCategories ?? [])
      setHiddenChannelsByCategory(parsed.hiddenChannelsByCategory ?? {})
      setDeletedChannelsByCategory(parsed.deletedChannelsByCategory ?? {})
      setCustomCategoryLabels(parsed.customCategoryLabels ?? [])
      setCustomChannelsByCategory(parsed.customChannelsByCategory ?? {})
    } catch {
      // Ignore corrupted local prefs and continue with defaults.
    } finally {
      setUiPrefsHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!uiPrefsHydrated) return
    const payload = {
      hiddenCategories,
      deletedCategories,
      hiddenChannelsByCategory,
      deletedChannelsByCategory,
      customCategoryLabels,
      customChannelsByCategory,
    }
    window.localStorage.setItem(CTA_COLLECTION_UI_PREFS_KEY, JSON.stringify(payload))
  }, [
    uiPrefsHydrated,
    hiddenCategories,
    deletedCategories,
    hiddenChannelsByCategory,
    deletedChannelsByCategory,
    customCategoryLabels,
    customChannelsByCategory,
  ])

  useEffect(() => {
    if (!searchParams) return
    if (searchParams.has('category') || searchParams.has('channel')) {
      router.replace(BOOKING_CRM_CTA_PATH, { scroll: false })
    }
  }, [router, searchParams])

  useEffect(() => {
    const id = resolveInitialChannelId(channelFromUrl)
    if (id) {
      setActiveChannelId((prev) => (prev === id ? prev : id))
      const cat = getCategoryForChannelKey(id)
      if (cat) setActiveCategory((prev) => (prev === cat ? prev : cat))
    }
    if (
      categoryFromUrl &&
      CTA_PLATFORM_CATEGORY_TABS.some((c) => c.id === categoryFromUrl)
    ) {
      setActiveCategory((prev) => (prev === categoryFromUrl ? prev : categoryFromUrl))
    }
  }, [channelFromUrl, categoryFromUrl])

  useEffect(() => {
    if (categoryTabItems.length === 0) return
    if (categoryTabItems.some((c) => c.id === activeCategory)) return
    const nextCategory = categoryTabItems[0].id as PlatformCategory
    setActiveCategory(nextCategory)
    const first = getCtaChannelsForCategory(nextCategory)[0]
    if (first) {
      setActiveChannelId(first.channelId)
    }
  }, [categoryTabItems, activeCategory])

  useEffect(() => {
    if (filteredChannels.length === 0) return
    if (filteredChannels.some((c) => c.channelId === activeChannelId)) return
    setActiveChannelId(filteredChannels[0].channelId)
  }, [filteredChannels, activeChannelId])

  useEffect(() => {
    if (!showCategoryAddControls) {
      setCategoryVisibilityDraft(null)
      return
    }
    setCategoryVisibilityDraft([...hiddenCategories])
  }, [showCategoryAddControls, hiddenCategories])

  useEffect(() => {
    if (!showChannelAddControls) {
      setChannelVisibilityDraft(null)
      return
    }
    setChannelVisibilityDraft([...(hiddenChannelsByCategory[activeCategory] ?? [])])
  }, [showChannelAddControls, hiddenChannelsByCategory, activeCategory])

  const onCategoryChange = (categoryId: string) => {
    const category = categoryId as PlatformCategory
    setActiveCategory(category)
    setQuery('')
    const first = getCtaChannelsForCategory(category)[0]
    if (!first) return
    setActiveChannelId(first.channelId)
  }

  const onChannelChange = (channelId: string) => {
    setActiveChannelId(channelId)
  }

  const expectedDeleteCategoryPhrase = (categoryLabel: string): string => `delete ${categoryLabel}`

  const performRemoveCategoryTab = (category: PlatformCategory) => {
    if (categoryTabItems.length <= 1) return
    setDeletedCategories((prev) => (prev.includes(category) ? prev : [...prev, category]))
    setHiddenCategories((prev) => prev.filter((id) => id !== category))
    if (activeCategory === category) {
      const next = categoryTabItems.find((c) => c.id !== category)?.id as PlatformCategory | undefined
      if (next) {
        setActiveCategory(next)
        const first = getCtaChannelsForCategory(next)[0]
        if (first) {
          setActiveChannelId(first.channelId)
        }
      }
    }
  }

  const requestRemoveCategoryTab = (category: PlatformCategory) => {
    const categoryLabel = CTA_PLATFORM_CATEGORY_TABS.find((c) => c.id === category)?.label ?? category
    setPendingDeleteCategory({ categoryId: category, categoryLabel, typed: '' })
  }

  const removeCategoryTab = (category: PlatformCategory) => {
    if (categoryTabItems.length <= 1) return
    requestRemoveCategoryTab(category)
  }

  const addCustomCategoryLabel = () => {
    const label = newCategoryLabel.trim()
    if (!label) return
    setCustomCategoryLabels((prev) => (prev.includes(label) ? prev : [...prev, label]))
    setNewCategoryLabel('')
  }

  const removeCustomCategoryLabel = (label: string) => {
    const confirmed = window.confirm(`Remove "${label}" from tabs? You can add it back later.`)
    if (!confirmed) return
    setCustomCategoryLabels((prev) => prev.filter((item) => item !== label))
  }

  const toggleCategoryVisibility = (category: PlatformCategory) => {
    const currentlyHidden = (categoryVisibilityDraft ?? hiddenCategories).includes(category)
    if (!currentlyHidden && categoryTabItems.length <= 1) return

    if (currentlyHidden) {
      setCategoryVisibilityDraft((prev) => (prev ?? hiddenCategories).filter((id) => id !== category))
      setActiveCategory(category)
      const first = getCtaChannelsForCategory(category)[0]
      if (first) {
        setActiveChannelId(first.channelId)
      }
      return
    }

    setCategoryVisibilityDraft((prev) => {
      const current = prev ?? hiddenCategories
      if (current.includes(category)) return current
      return [...current, category]
    })
  }

  const saveCategoryVisibilityChanges = () => {
    setHiddenCategories(categoryVisibilityDraft ?? hiddenCategories)
    setShowCategoryAddControls(false)
    setCategoryVisibilityDraft(null)
  }

  const getChannelLabelById = (channelId: string): string =>
    channelsInCategory.find((ch) => ch.channelId === channelId)?.label ??
    allChannelsInCategory.find((ch) => ch.channelId === channelId)?.label ??
    getCtaChannelById(channelId)?.label ??
    channelId

  const expectedDeletePhrase = (channelLabel: string): string => `delete ${channelLabel}`

  const performRemoveChannelChip = (channelId: string) => {
    const isCustom = (customChannelsByCategory[activeCategory] ?? []).some((ch) => ch.channelId === channelId)
    if (isCustom) {
      removeCustomChannelLabel(channelId, { skipConfirm: true })
      return
    }
    setDeletedChannelsByCategory((prev) => {
      const current = prev[activeCategory] ?? []
      if (current.includes(channelId)) return prev
      return { ...prev, [activeCategory]: [...current, channelId] }
    })
  }

  const requestRemoveChannel = (channelId: string) => {
    const channelLabel = getChannelLabelById(channelId)
    setPendingDeleteChannel({ channelId, channelLabel, typed: '' })
  }

  const removeChannelChip = (channelId: string) => {
    if (channelsInCategory.length <= 1) return
    requestRemoveChannel(channelId)
  }

  const addCustomChannelLabel = () => {
    const label = newChannelLabel.trim()
    if (!label) return
    const channelId = toCustomChannelId(activeCategory, label)
    setCustomChannelsByCategory((prev) => {
      const current = prev[activeCategory] ?? []
      if (current.some((item) => item.channelId === channelId)) return prev
      const customEntry: CtaChannelEntry = {
        label,
        channelId,
        platformCategory: activeCategory,
        icon: 'Share2',
      }
      return { ...prev, [activeCategory]: [...current, customEntry] }
    })
    setActiveChannelId(channelId)
    setShowChannelAddControls(false)
    setNewChannelLabel('')
  }

  const removeCustomChannelLabel = (channelId: string, options?: { skipConfirm?: boolean }) => {
    const channelLabel =
      (customChannelsByCategory[activeCategory] ?? []).find((item) => item.channelId === channelId)?.label ??
      channelId
    if (!options?.skipConfirm) {
      const confirmed = window.confirm(`Remove "${channelLabel}" from channels? You can add it back later.`)
      if (!confirmed) return
    }
    setCustomChannelsByCategory((prev) => {
      const current = prev[activeCategory] ?? []
      return { ...prev, [activeCategory]: current.filter((item) => item.channelId !== channelId) }
    })
  }

  const toggleChannelVisibility = (channelId: string) => {
    const hidden = new Set(channelVisibilityDraft ?? hiddenChannelsForActiveCategory)
    const isHidden = hidden.has(channelId)
    if (!isHidden && channelsInCategory.length <= 1) return

    if (isHidden) {
      hidden.delete(channelId)
      setActiveChannelId(channelId)
    } else {
      hidden.add(channelId)
    }

    setChannelVisibilityDraft(Array.from(hidden))
  }

  const saveChannelVisibilityChanges = () => {
    const draftHidden = channelVisibilityDraft ?? []
    setHiddenChannelsByCategory((prev) => ({ ...prev, [activeCategory]: draftHidden }))
    setShowChannelAddControls(false)
    setChannelVisibilityDraft(null)
  }

  const handleMetaChange = useCallback(
    (m: ChannelLandingEditorMeta) => {
      setMeta((prev) =>
        prev.loading === m.loading &&
        prev.saving === m.saving &&
        prev.shareUrl === m.shareUrl &&
        prev.publicUrl === m.publicUrl &&
        prev.status === m.status &&
        prev.hasUnsavedChanges === m.hasUnsavedChanges
          ? prev
          : m
      )
      if (!m.loading && effectiveChannelId) {
        setStatusByChannel((prev) => {
          if (prev[effectiveChannelId] === m.status) return prev
          return { ...prev, [effectiveChannelId]: m.status }
        })
      }
    },
    [effectiveChannelId]
  )

  const afterSave = () => {
    loadAllStatuses()
    editorRef.current?.reload()
  }

  const handlePublish = async () => {
    await editorRef.current?.publish()
    afterSave()
  }

       return (
    <AdminCmsEditorShell className="admin-cta-editor">
      <div className={ADMIN_CMS_TAB_BAR_OUTER_CLASS}>
        <AdminCmsTabBar
          tabs={
            <>
              {categoryTabItems.map((tab) => {
                const active = activeCategory === tab.id
                return (
                  <div key={tab.id} className="inline-flex items-center group">
                    <button
                      type="button"
                      onClick={() => onCategoryChange(tab.id)}
                      className={adminCmsTabButtonClass(active)}
                    >
                      {tab.label}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCategoryTab(tab.id as PlatformCategory)}
                      className="ml-0 w-0 overflow-hidden p-0 rounded hover:bg-card text-muted-foreground opacity-0 pointer-events-none group-hover:w-5 group-hover:ml-1 group-hover:p-1 group-hover:opacity-100 group-hover:pointer-events-auto focus-visible:w-5 focus-visible:ml-1 focus-visible:p-1 focus-visible:opacity-100 focus-visible:pointer-events-auto transition-all duration-200"
                      title={`Remove ${tab.label}`}
                      aria-label={`Remove ${tab.label}`}
                      disabled={categoryTabItems.length <= 1}
                    >
                      <X size={12} />
                    </button>
                  </div>
                )
              })}
              {customCategoryLabels.map((label) => (
                <div key={`custom-category-${label}`} className="inline-flex items-center group">
                  <span className="px-3 py-2 text-label whitespace-nowrap text-muted-foreground border border-dashed border-muted-foreground/35 rounded">
                    {label}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCustomCategoryLabel(label)}
                    className="ml-1 p-1 rounded hover:bg-card text-muted-foreground opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
                    title={`Remove ${label}`}
                    aria-label={`Remove ${label}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </>
          }
          trailing={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCategoryAddControls((v) => !v)}
                className="inline-flex items-center justify-center w-8 h-8 rounded border border-muted-foreground/25 text-brand-orange hover:bg-card"
                aria-label="Show add category controls"
                title="Add category"
                aria-haspopup="dialog"
              >
                <Plus size={14} />
              </button>
            </div>
          }
        />
     </div>

      <AdminCmsFilterToolbar
        footerInline
        className="overflow-visible overflow-x-visible"
        filters={
          <>
            <div className="flex items-center min-w-[20rem] max-w-xl border border-slate-200/80 dark:border-slate-700 rounded bg-white/70 dark:bg-slate-900/60 backdrop-blur-md overflow-hidden">
              <div className="relative flex-1 min-w-[10rem]">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search channel…"
                  className="w-full pl-9 pr-3 py-2 text-body-sm bg-transparent border-0 focus:outline-none"
                  aria-label="Search channels"
                />
              </div>
              <div className="w-px self-stretch bg-slate-200/80 dark:bg-slate-700" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="px-3 py-2 text-body-sm text-brand-orange bg-transparent border-0 focus:outline-none"
                aria-label="Filter by publish status"
              >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft only</option>
              </select>
            </div>
            {query || statusFilter !== 'all' ? (
          <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setStatusFilter('all')
                }}
                className="px-3 py-2 text-body-sm text-brand-orange hover:text-foreground transition-colors whitespace-nowrap"
              >
                Clear filters
          </button>
            ) : null}
          </>
        }
        footer={
          <div className="flex flex-wrap items-center gap-2 w-full min-w-0">
            {filteredChannels.length > 0 ? (
              <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {filteredChannels.map((ch) => {
                  const active = effectiveChannelId === ch.channelId
                  const published = statusByChannel[ch.channelId] === 'published'
                  return (
                    <div key={ch.channelId} className="inline-flex items-center group shrink-0">
                      <button
                        type="button"
                        aria-label={`${ch.label}${published ? ', published' : ''}`}
                        onClick={() => onChannelChange(ch.channelId)}
                        className={`${adminCmsTabButtonClass(active)} inline-flex items-center gap-2 px-3 py-2 rounded border border-slate-200/80 dark:border-slate-700/80 bg-white/50 dark:bg-slate-900/40`}
                      >
                        <PlatformChannelIcon name={ch.icon} size={16} className="shrink-0" />
                        <span>{ch.label}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeChannelChip(ch.channelId)}
                        className="ml-0 w-0 overflow-hidden p-0 rounded hover:bg-card text-muted-foreground opacity-0 pointer-events-none group-hover:w-5 group-hover:ml-1 group-hover:p-1 group-hover:opacity-100 group-hover:pointer-events-auto focus-visible:w-5 focus-visible:ml-1 focus-visible:p-1 focus-visible:opacity-100 focus-visible:pointer-events-auto transition-all duration-200"
                        title={`Remove ${ch.label}`}
                        aria-label={`Remove ${ch.label}`}
                        disabled={channelsInCategory.length <= 1}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : null}
            <div className="inline-flex items-center gap-2 ml-auto relative">
              <button
                type="button"
                onClick={() => setShowChannelAddControls(true)}
                className="inline-flex items-center justify-center w-8 h-8 rounded border border-muted-foreground/25 text-brand-orange hover:bg-card"
                aria-label="Show add channel controls"
                title="Add channel"
                aria-haspopup="dialog"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        }
        actions={
          <>
            <button
              type="button"
              onClick={() => editorRef.current?.openPreview()}
              className={ADMIN_CMS_PREVIEW_BUTTON_CLASS}
            >
              Preview
            </button>
            <CTAButton
              variant="primary"
              onClick={handlePublish}
              size="sm"
              disabled={meta.saving}
              className={`shrink-0 whitespace-nowrap transition-opacity ${
                meta.saving ? 'opacity-60 cursor-not-allowed' : 'opacity-100'
              }`}
            >
              {meta.status === 'published' ? 'Update' : 'Publish'}
            </CTAButton>
          </>
        }
      />

      {filteredChannels.length === 0 ? (
        <div className="px-2 py-12 text-center">
          <p className="text-body text-muted-foreground">
            No channels match your filters in{' '}
            {CTA_PLATFORM_CATEGORY_TABS.find((c) => c.id === activeCategory)?.label ?? 'this category'}.
          </p>
          {(query || statusFilter !== 'all') && (
            <button
              type="button"
              className="mt-4 text-body-sm text-brand-orange hover:underline"
              onClick={() => {
                setQuery('')
                setStatusFilter('all')
              }}
            >
              Clear filters
            </button>
           )}
        </div>
      ) : !activePlatform ? (
        <p className="text-body-sm text-muted-foreground px-2 py-8">Select a channel to edit.</p>
      ) : (
        <GlassCard
          hover={false}
          liquid={false}
          className="p-4 md:p-6 bg-card/90 border border-muted-foreground/20"
        >
          <ChannelLandingEditor
            key={effectiveChannelId}
            ref={editorRef}
            platform={activePlatform}
            embedded
            onMetaChange={handleMetaChange}
          />
      </GlassCard>
      )}

      <Dialog
        open={showCategoryAddControls}
        onOpenChange={(open) => {
          setShowCategoryAddControls(open)
          if (!open) setCategoryVisibilityDraft(null)
        }}
      >
        <DialogContent className="max-h-[min(60vh,26rem)] max-w-md overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage categories</DialogTitle>
            <DialogDescription>Create categories and toggle visibility in the tab bar.</DialogDescription>
          </DialogHeader>
          <div>
            <p className="text-meta text-muted-foreground mb-1">Create new</p>
            <div className="flex items-center gap-2">
              <input
                value={newCategoryLabel}
                onChange={(e) => setNewCategoryLabel(e.target.value)}
                placeholder="Add new category"
                className={`${ADMIN_CMS_FILTER_INPUT_CLASS} min-w-0 flex-1`}
              />
              <button
                type="button"
                onClick={addCustomCategoryLabel}
                disabled={!newCategoryLabel.trim()}
                className="rounded border border-brand-orange/35 px-2.5 py-2 text-body-sm text-brand-orange disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
          <div className="max-h-40 overflow-y-auto pr-1 scrollbar-hide">
            <div className="flex flex-col gap-2">
              {CTA_PLATFORM_CATEGORY_TABS.filter((tab) => !deletedCategories.includes(tab.id)).map((tab) => {
                const hidden = (categoryVisibilityDraft ?? hiddenCategories).includes(tab.id)
                return (
                  <button
                    key={`manage-${tab.id}`}
                    type="button"
                    onClick={() => toggleCategoryVisibility(tab.id)}
                    className={`inline-flex w-full items-center justify-between gap-2 rounded-none border-0 border-b px-1 py-1.5 text-body-sm ${
                      hidden
                        ? 'border-muted-foreground/25 text-muted-foreground'
                        : 'border-brand-orange/30 text-brand-orange'
                    }`}
                    title={hidden ? `Show ${tab.label}` : `Hide ${tab.label}`}
                  >
                    <span>{tab.label}</span>
                    {hidden ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setCategoryVisibilityDraft([...hiddenCategories])
                setShowCategoryAddControls(false)
                setCategoryVisibilityDraft(null)
              }}
              className="px-3 py-2 text-body-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveCategoryVisibilityChanges}
              disabled={
                JSON.stringify((categoryVisibilityDraft ?? []).slice().sort()) ===
                JSON.stringify(hiddenCategories.slice().sort())
              }
              className="rounded border border-brand-orange/35 px-3 py-2 text-body-sm text-brand-orange disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showChannelAddControls}
        onOpenChange={(open) => {
          setShowChannelAddControls(open)
          if (!open) setChannelVisibilityDraft(null)
        }}
      >
        <DialogContent className="max-h-[min(60vh,26rem)] max-w-md overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage channels</DialogTitle>
            <DialogDescription>
              Create channels and toggle visibility for{' '}
              {CTA_PLATFORM_CATEGORY_TABS.find((c) => c.id === activeCategory)?.label ?? 'this category'}.
            </DialogDescription>
          </DialogHeader>
          <div>
            <p className="text-meta text-muted-foreground mb-1">Create new</p>
            <div className="flex items-center gap-2">
              <input
                value={newChannelLabel}
                onChange={(e) => setNewChannelLabel(e.target.value)}
                placeholder="Add new channel"
                className={`${ADMIN_CMS_FILTER_INPUT_CLASS} min-w-0 flex-1`}
              />
              <button
                type="button"
                onClick={addCustomChannelLabel}
                disabled={!newChannelLabel.trim()}
                className="rounded border border-brand-orange/35 px-2.5 py-2 text-body-sm text-brand-orange disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
          <div className="max-h-40 overflow-y-auto pr-1 scrollbar-hide">
            <div className="flex flex-col gap-2">
              {allChannelsInCategory.map((ch) => {
                const hidden = (channelVisibilityDraft ?? hiddenChannelsForActiveCategory).includes(
                  ch.channelId,
                )
                return (
                  <button
                    key={`manage-channel-${ch.channelId}`}
                    type="button"
                    onClick={() => toggleChannelVisibility(ch.channelId)}
                    className={`inline-flex w-full items-center justify-between gap-2 rounded-none border-0 border-b px-1 py-1.5 text-body-sm ${
                      hidden
                        ? 'border-muted-foreground/25 text-muted-foreground'
                        : 'border-brand-orange/30 text-brand-orange'
                    }`}
                    title={hidden ? `Show ${ch.label}` : `Hide ${ch.label}`}
                  >
                    <span className="text-left">{ch.label}</span>
                    {hidden ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setChannelVisibilityDraft([...(hiddenChannelsByCategory[activeCategory] ?? [])])
                setShowChannelAddControls(false)
                setChannelVisibilityDraft(null)
              }}
              className="px-3 py-2 text-body-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveChannelVisibilityChanges}
              disabled={
                JSON.stringify((channelVisibilityDraft ?? []).slice().sort()) ===
                JSON.stringify((hiddenChannelsByCategory[activeCategory] ?? []).slice().sort())
              }
              className="rounded border border-brand-orange/35 px-3 py-2 text-body-sm text-brand-orange disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!pendingDeleteCategory}
        onOpenChange={(open) => !open && setPendingDeleteCategory(null)}
        title="Delete category"
        description={
          pendingDeleteCategory ? (
            <>
              Are you sure you want to delete <strong>{pendingDeleteCategory.categoryLabel}</strong>?
              <span className="mt-2 block">
                To confirm, type:{' '}
                <code className="text-meta">
                  {expectedDeleteCategoryPhrase(pendingDeleteCategory.categoryLabel)}
                </code>
              </span>
            </>
          ) : undefined
        }
        confirmLabel="Delete"
        confirmVariant="destructive"
        confirmDisabled={
          !pendingDeleteCategory ||
          pendingDeleteCategory.typed.trim().toLowerCase() !==
            expectedDeleteCategoryPhrase(pendingDeleteCategory.categoryLabel).toLowerCase()
        }
        onConfirm={() => {
          if (!pendingDeleteCategory) return
          performRemoveCategoryTab(pendingDeleteCategory.categoryId)
          setPendingDeleteCategory(null)
        }}
      >
        {pendingDeleteCategory ? (
          <input
            value={pendingDeleteCategory.typed}
            onChange={(e) =>
              setPendingDeleteCategory((prev) => (prev ? { ...prev, typed: e.target.value } : prev))
            }
            placeholder="Type confirmation phrase"
            className={`${ADMIN_CMS_FILTER_INPUT_CLASS} w-full`}
            aria-label="Delete category confirmation text"
          />
        ) : null}
      </ConfirmDialog>

      <ConfirmDialog
        open={!!pendingDeleteChannel}
        onOpenChange={(open) => !open && setPendingDeleteChannel(null)}
        title="Delete channel"
        description={
          pendingDeleteChannel ? (
            <>
              Are you sure you want to delete <strong>{pendingDeleteChannel.channelLabel}</strong>?
              <span className="mt-2 block">
                To confirm, type:{' '}
                <code className="text-meta">
                  {expectedDeletePhrase(pendingDeleteChannel.channelLabel)}
                </code>
              </span>
            </>
          ) : undefined
        }
        confirmLabel="Delete"
        confirmVariant="destructive"
        confirmDisabled={
          !pendingDeleteChannel ||
          pendingDeleteChannel.typed.trim().toLowerCase() !==
            expectedDeletePhrase(pendingDeleteChannel.channelLabel).toLowerCase()
        }
        onConfirm={() => {
          if (!pendingDeleteChannel) return
          performRemoveChannelChip(pendingDeleteChannel.channelId)
          setPendingDeleteChannel(null)
        }}
      >
        {pendingDeleteChannel ? (
          <input
            value={pendingDeleteChannel.typed}
            onChange={(e) =>
              setPendingDeleteChannel((prev) => (prev ? { ...prev, typed: e.target.value } : prev))
            }
            placeholder="Type confirmation phrase"
            className={`${ADMIN_CMS_FILTER_INPUT_CLASS} w-full`}
            aria-label="Delete confirmation text"
          />
        ) : null}
      </ConfirmDialog>
    </AdminCmsEditorShell>
  )
}
