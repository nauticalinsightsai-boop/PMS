'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Globe,
  Home,
  Image,
  Newspaper,
  Plus,
  Quote,
  Save,
  Send,
  Trash2,
  TrendingUp,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CTAButton } from '@/components/ui/CTAButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SyncStatusIndicator, SyncStatus } from '@/components/shared/SyncStatusIndicator';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import { siteUrl } from '@/lib/site-config';
import { HOME_COPY, CTAS } from '@/lib/brand-voice';
import { MediaPicker } from './site-content/MediaPicker';
import {
  defaultHomePageConfigV2,
  normalizeHomeConfigV1ToV2,
  validateFieldContent,
  FIELD_KEYS,
  type HomePageConfigV2,
} from '@pms/site-content';

type CmsTab =
  | 'hero'
  | 'cta'
  | 'stats'
  | 'sections'
  | 'featured'
  | 'families'
  | 'membership'
  | 'testimonials'
  | 'insights'
  | 'latest-news'
  | 'global-footprint';

type HomePageConfig = HomePageConfigV2;

const HOME_CONFIG_KEY = FIELD_KEYS.HOME_PAGE_CONFIG;
const PREVIEW_KEY = 'home_page_preview_config_v1';
const HOME_PREVIEW_MESSAGE = 'pms:home-preview-config';

const defaultConfig: HomePageConfig = defaultHomePageConfigV2();

const KNOWN_CERT_IDS = [
  'pmp', 'capm', 'pmi-rmp', 'pmi-acp', 'prince2', 'prince2-practitioner', 'prince2-agile',
  'lss-green', 'lss-yellow', 'lss-black', 'lss-white',
];

const tabItems: Array<{ id: CmsTab; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { id: 'hero', label: 'Hero', icon: Home },
  { id: 'stats', label: 'Stats', icon: Users },
  { id: 'sections', label: 'Sections', icon: Eye },
  { id: 'featured', label: 'Featured pathways', icon: Image },
  { id: 'families', label: 'Program families', icon: Globe },
  { id: 'membership', label: 'Membership', icon: Trophy },
  { id: 'testimonials', label: 'Testimonials', icon: Quote },
  { id: 'insights', label: 'Insights band', icon: TrendingUp },
  { id: 'cta', label: 'CTA', icon: ArrowRight },
  { id: 'latest-news', label: 'Latest News', icon: Newspaper },
  { id: 'global-footprint', label: 'Global Footprint', icon: Globe },
];

function normalizeConfig(raw: unknown): HomePageConfig {
  return normalizeHomeConfigV1ToV2(raw);
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function HomeCmsEditor() {
  const [activeTab, setActiveTab] = useState<CmsTab>('hero');
  const [config, setConfig] = useState<HomePageConfig>(defaultConfig);
  const [baseline, setBaseline] = useState<string>(JSON.stringify(defaultConfig));
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [lastSynced, setLastSynced] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [newNews, setNewNews] = useState({ title: '', description: '', link: '' });
  const [newFootprint, setNewFootprint] = useState({ category: '', item: '', location: '', year: '' });
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const rows = await WebsiteDataService.getData('draft');
        const row = rows.find((item) => item.field_key === HOME_CONFIG_KEY);
        const nextConfig = normalizeConfig(row?.content);
        setConfig(nextConfig);
        setBaseline(JSON.stringify(nextConfig));
        setLastSynced(row?.updated_at ? new Date(row.updated_at) : undefined);
        setSyncStatus('synced');
      } catch (error) {
        console.error('Failed to load home config', error);
        setSyncStatus('error');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const hasChanges = useMemo(() => JSON.stringify(config) !== baseline, [config, baseline]);

  const filteredHeroSlides = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return config.heroSlides;
    return config.heroSlides.filter((slide) =>
      [slide.heading, slide.description, slide.primaryCta, slide.secondaryCta, slide.primaryLink, slide.secondaryLink]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [config.heroSlides, search]);

  const filteredNews = useMemo(() => {
    const q = search.trim().toLowerCase();
    const items = config.latestNews ?? [];
    if (!q) return items;
    return items.filter((item) =>
      [item.title, item.description, item.link ?? ''].join(' ').toLowerCase().includes(q),
    );
  }, [config.latestNews, search]);

  const filteredFootprint = useMemo(() => {
    const q = search.trim().toLowerCase();
    const items = config.globalFootprint ?? [];
    if (!q) return items;
    return items.filter((entry) =>
      [entry.category, entry.item, entry.location, entry.year ?? ''].join(' ').toLowerCase().includes(q),
    );
  }, [config.globalFootprint, search]);

  const updateHeroSlide = (id: number, patch: Partial<HomePageConfig['heroSlides'][number]>) => {
    setConfig((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide)),
    }));
  };

  type HomeCtaBlock = NonNullable<HomePageConfig['instituteSection']>['institute'];

  const updateCtaBlock = (key: 'institute' | 'engagement' | 'speaking', patch: Partial<HomeCtaBlock>) => {
    setConfig((prev) => ({
      ...prev,
      instituteSection: {
        ...(prev.instituteSection ?? defaultConfig.instituteSection!),
        [key]: { ...(prev.instituteSection?.[key] ?? defaultConfig.instituteSection![key]), ...patch },
      },
    }));
  };

  const handleSaveDraft = async () => {
    setSyncStatus('syncing');
    try {
      await WebsiteDataService.saveDraft(HOME_CONFIG_KEY, config as unknown as Record<string, unknown>);
      setBaseline(JSON.stringify(config));
      setSyncStatus('synced');
      setLastSynced(new Date());
    } catch (error) {
      console.error('Failed to save draft', error);
      setSyncStatus('error');
    }
  };

  const handlePublish = async () => {
    const check = validateFieldContent(HOME_CONFIG_KEY, config);
    if (!check.success) {
      setSyncStatus('error');
      alert('Publish blocked: home config failed validation.');
      return;
    }
    setSyncStatus('syncing');
    try {
      await WebsiteDataService.saveDraft(HOME_CONFIG_KEY, config as unknown as Record<string, unknown>);
      await WebsiteDataService.publish(HOME_CONFIG_KEY);
      setBaseline(JSON.stringify(config));
      setSyncStatus('synced');
      setLastSynced(new Date());
    } catch (error) {
      console.error('Failed to publish', error);
      setSyncStatus('error');
    }
  };

  const openPreview = () => {
    localStorage.setItem(PREVIEW_KEY, JSON.stringify(config));
    setPreviewKey((prev) => prev + 1);
    setIsPreviewOpen(true);
  };

  const postPreviewConfig = () => {
    previewIframeRef.current?.contentWindow?.postMessage(
      { type: HOME_PREVIEW_MESSAGE, config },
      siteUrl.replace(/\/$/, ''),
    );
  };

  useEffect(() => {
    if (!isPreviewOpen) return;
    const timer = window.setTimeout(postPreviewConfig, 300);
    return () => window.clearTimeout(timer);
  }, [config, isPreviewOpen, previewKey]);

  const closePreview = () => {
    localStorage.removeItem(PREVIEW_KEY);
    setIsPreviewOpen(false);
  };

  const addNewsItem = () => {
    if (!newNews.title.trim() || !newNews.description.trim()) return;
    setConfig((prev) => ({
      ...prev,
      latestNews: [
        ...(prev.latestNews ?? []),
        {
          id: newId(),
          title: newNews.title.trim(),
          description: newNews.description.trim(),
          link: newNews.link.trim(),
          visible: true,
        },
      ],
    }));
    setNewNews({ title: '', description: '', link: '' });
  };

  const addFootprint = () => {
    if (!newFootprint.item.trim() || !newFootprint.location.trim()) return;
    setConfig((prev) => ({
      ...prev,
      globalFootprint: [
        ...(prev.globalFootprint ?? []),
        {
          id: newId(),
          category: newFootprint.category.trim(),
          item: newFootprint.item.trim(),
          location: newFootprint.location.trim(),
          year: newFootprint.year.trim(),
          isActive: true,
        },
      ],
    }));
    setNewFootprint({ category: '', item: '', location: '', year: '' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange" />
      </div>
    );
  }

  const activeCtaType = config.instituteSection?.type ?? 'institute';
  const activeCtaBlock = config.instituteSection?.[activeCtaType];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 space-y-4 pb-8">
        <header className="pt-2">
          <h1 className="text-3xl font-black tracking-tight">Homepage CMS</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Edit public homepage sections. Draft saves to Supabase; Publish makes them live.
          </p>
        </header>

        <div className="sticky top-0 z-20 bg-background py-3 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value as CmsTab);
                setSearch('');
              }}
              className="min-w-0 flex-1"
            >
              <TabsList variant="line" className="h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0 no-scrollbar">
                {tabItems.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground data-active:bg-brand-orange/15 data-active:text-brand-orange"
                    >
                      <Icon size={14} />
                      {tab.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <SyncStatusIndicator status={syncStatus} lastSynced={lastSynced} onManualSync={handleSaveDraft} />
              <CTAButton size="sm" variant="secondary" onClick={openPreview}>
                Preview
              </CTAButton>
              <CTAButton
                size="sm"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={!hasChanges}
                className={!hasChanges ? 'opacity-50' : ''}
              >
                <Save size={14} className="mr-2" />
                Save Draft
              </CTAButton>
              <CTAButton size="sm" variant="primary" onClick={handlePublish}>
                <Send size={14} className="mr-2" />
                Publish
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 pb-3 flex flex-wrap gap-2 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search in current tab..."
            className="w-56 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          ) : null}
        </div>

        <GlassCard variant="raised" className="p-4 md:p-6 space-y-4">
          {activeTab === 'hero' && (
            <div className="space-y-3">
              {filteredHeroSlides.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hero slides match your search.</p>
              ) : (
                filteredHeroSlides.map((slide) => (
                  <div key={slide.id} className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black uppercase tracking-widest">Slide {slide.id}</p>
                      <button
                        type="button"
                        onClick={() => updateHeroSlide(slide.id, { visible: !slide.visible })}
                        className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground"
                      >
                        {slide.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        {slide.visible ? 'Visible' : 'Hidden'}
                      </button>
                    </div>
                    <textarea
                      value={slide.heading}
                      onChange={(e) => updateHeroSlide(slide.id, { heading: e.target.value })}
                      placeholder="Heading"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                    />
                    <textarea
                      value={slide.description}
                      onChange={(e) => updateHeroSlide(slide.id, { description: e.target.value })}
                      placeholder="Description"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm h-24 outline-none focus:ring-1 focus:ring-brand-orange"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        value={slide.primaryCta}
                        onChange={(e) => updateHeroSlide(slide.id, { primaryCta: e.target.value })}
                        placeholder="Primary CTA"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                      />
                      <select
                        value={slide.primaryAction ?? 'register_modal'}
                        onChange={(e) =>
                          updateHeroSlide(slide.id, {
                            primaryAction: e.target.value as 'link' | 'register_modal' | 'contact',
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                      >
                        <option value="register_modal">Open registration modal</option>
                        <option value="contact">Link to contact / consultation</option>
                        <option value="link">Custom link</option>
                      </select>
                      <input
                        value={slide.primaryLink}
                        onChange={(e) => updateHeroSlide(slide.id, { primaryLink: e.target.value })}
                        placeholder="Primary Link"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange md:col-span-2"
                      />
                      <input
                        value={slide.secondaryCta}
                        onChange={(e) => updateHeroSlide(slide.id, { secondaryCta: e.target.value })}
                        placeholder="Secondary CTA"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                      />
                      <input
                        value={slide.secondaryLink}
                        onChange={(e) => updateHeroSlide(slide.id, { secondaryLink: e.target.value })}
                        placeholder="Secondary Link"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                      />
                      <div className="md:col-span-2">
                        <MediaPicker
                          label="Hero image URL"
                          value={slide.heroImage?.url ?? ''}
                          onChange={(url) =>
                            updateHeroSlide(slide.id, {
                              heroImage: url.trim()
                                ? { id: `hero-${slide.id}`, url: url.trim(), alt: slide.heading }
                                : undefined,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'cta' && activeCtaBlock && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['institute', 'engagement', 'speaking'] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setConfig((prev) => ({
                        ...prev,
                        instituteSection: {
                          ...(prev.instituteSection ?? defaultConfig.instituteSection!),
                          type: key,
                        },
                      }))
                    }
                    className={`text-left p-4 rounded-2xl border transition-colors ${
                      activeCtaType === key
                        ? 'border-brand-orange bg-brand-orange/10'
                        : 'border-white/10 bg-white/5 hover:border-brand-orange/40'
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest">{key}</p>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {config.instituteSection?.[key]?.title || 'No title set yet'}
                    </p>
                  </button>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest">Edit {activeCtaType} content</h3>
                <input
                  value={activeCtaBlock.subtitle}
                  onChange={(e) => updateCtaBlock(activeCtaType, { subtitle: e.target.value })}
                  placeholder="Subtitle"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                />
                <input
                  value={activeCtaBlock.title}
                  onChange={(e) => updateCtaBlock(activeCtaType, { title: e.target.value })}
                  placeholder="Title"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                />
                <textarea
                  value={activeCtaBlock.description}
                  onChange={(e) => updateCtaBlock(activeCtaType, { description: e.target.value })}
                  placeholder="Description"
                  className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    value={activeCtaBlock.ctaLink}
                    onChange={(e) => updateCtaBlock(activeCtaType, { ctaLink: e.target.value })}
                    placeholder="CTA link"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                  />
                  <input
                    value={activeCtaBlock.ctaText}
                    onChange={(e) => updateCtaBlock(activeCtaType, { ctaText: e.target.value })}
                    placeholder="CTA text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest">Professionals count</span>
                <input
                  type="number"
                  value={config.stats.professionalsCount}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      stats: { ...prev.stats, professionalsCount: Number(e.target.value) || 0 },
                    }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest">Label</span>
                <input
                  value={config.stats.professionalsLabel ?? ''}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      stats: { ...prev.stats, professionalsLabel: e.target.value },
                    }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
                />
              </label>
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(config.sections).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2 text-sm capitalize">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        sections: { ...prev.sections, [key]: e.target.checked },
                      }))
                    }
                  />
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
              ))}
            </div>
          )}

          {activeTab === 'featured' && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">Select up to 6 certification pathways (by cert ID).</p>
              <div className="flex flex-wrap gap-2">
                {KNOWN_CERT_IDS.map((certId) => {
                  const selected = config.featuredPathways.certIds.includes(certId);
                  return (
                    <button
                      key={certId}
                      type="button"
                      onClick={() =>
                        setConfig((prev) => {
                          const ids = prev.featuredPathways.certIds;
                          const next = selected ? ids.filter((id) => id !== certId) : [...ids, certId].slice(0, 6);
                          return { ...prev, featuredPathways: { ...prev.featuredPathways, certIds: next } };
                        })
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                        selected ? 'border-brand-orange bg-brand-orange/15 text-brand-orange' : 'border-white/10'
                      }`}
                    >
                      {certId}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs font-mono text-muted-foreground">
                Selected: {config.featuredPathways.certIds.join(', ') || 'none'}
              </p>
            </div>
          )}

          {activeTab === 'families' && (
            <div className="space-y-4">
              {config.programFamilies.map((family, idx) => (
                <div key={family.familyId} className="p-4 rounded-2xl border border-white/10 space-y-3">
                  <label className="flex items-center gap-2 text-sm font-bold">
                    <input
                      type="checkbox"
                      checked={family.visible}
                      onChange={(e) =>
                        setConfig((prev) => {
                          const next = [...prev.programFamilies];
                          next[idx] = { ...next[idx], visible: e.target.checked };
                          return { ...prev, programFamilies: next };
                        })
                      }
                    />
                    {family.familyId}
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'membership' && (
            <div className="space-y-4">
              <input
                value={config.membership.sectionTitle ?? ''}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    membership: { ...prev.membership, sectionTitle: e.target.value },
                  }))
                }
                placeholder="Section title"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
              />
              <textarea
                value={config.membership.sectionSubtitle ?? ''}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    membership: { ...prev.membership, sectionSubtitle: e.target.value },
                  }))
                }
                placeholder="Section subtitle"
                className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
              />
              <label className="text-xs font-bold uppercase">Highlighted tier</label>
              <select
                value={config.membership.highlightedTierId}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    membership: {
                      ...prev.membership,
                      highlightedTierId: e.target.value as 'starter' | 'professional' | 'mastery',
                    },
                  }))
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
              >
                <option value="starter">Starter</option>
                <option value="professional">Professional</option>
                <option value="mastery">Mastery</option>
              </select>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="space-y-3">
              {(config.testimonials ?? []).map((t, idx) => (
                <div key={t.id} className="p-4 rounded-2xl border border-white/10 space-y-2">
                  <textarea
                    value={t.quote}
                    onChange={(e) =>
                      setConfig((prev) => {
                        const list = [...(prev.testimonials ?? [])];
                        list[idx] = { ...list[idx], quote: e.target.value };
                        return { ...prev, testimonials: list };
                      })
                    }
                    className="w-full h-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm"
                  />
                  <input
                    value={t.name}
                    onChange={(e) =>
                      setConfig((prev) => {
                        const list = [...(prev.testimonials ?? [])];
                        list[idx] = { ...list[idx], name: e.target.value };
                        return { ...prev, testimonials: list };
                      })
                    }
                    placeholder="Name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-4">
              <input
                value={config.insightsBand?.title ?? ''}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    insightsBand: { ...(prev.insightsBand ?? { items: [] }), title: e.target.value, items: prev.insightsBand?.items ?? [] },
                  }))
                }
                placeholder="Band title"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm"
              />
              {(config.insightsBand?.items ?? []).map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-white/10 space-y-2">
                  <input
                    value={item.title}
                    onChange={(e) =>
                      setConfig((prev) => {
                        const items = [...(prev.insightsBand?.items ?? [])];
                        items[idx] = { ...items[idx], title: e.target.value };
                        return { ...prev, insightsBand: { ...(prev.insightsBand ?? { items: [] }), items } };
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm"
                  />
                  <input
                    value={item.href}
                    onChange={(e) =>
                      setConfig((prev) => {
                        const items = [...(prev.insightsBand?.items ?? [])];
                        items[idx] = { ...items[idx], href: e.target.value };
                        return { ...prev, insightsBand: { ...(prev.insightsBand ?? { items: [] }), items } };
                      })
                    }
                    placeholder="Link"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'latest-news' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest">Latest News</h3>
                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, latestNewsVisible: !prev.latestNewsVisible }))}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  {config.latestNewsVisible ? 'Visible' : 'Hidden'}
                </button>
              </div>
              <div className="p-4 rounded-2xl border border-brand-orange/40 bg-brand-orange/5 space-y-3">
                <input
                  value={newNews.title}
                  onChange={(e) => setNewNews((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Title"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                />
                <textarea
                  value={newNews.description}
                  onChange={(e) => setNewNews((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Description"
                  className="w-full h-20 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                />
                <input
                  value={newNews.link}
                  onChange={(e) => setNewNews((prev) => ({ ...prev, link: e.target.value }))}
                  placeholder="Optional Link"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                />
                <CTAButton size="sm" onClick={addNewsItem}>
                  <Plus size={14} className="mr-2" />
                  Add News Item
                </CTAButton>
              </div>
              <div className="space-y-3">
                {filteredNews.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl border border-white/10 bg-white/5">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="font-bold">{item.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        {item.link ? <p className="text-xs mt-2 text-brand-orange">{item.link}</p> : null}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            latestNews: (prev.latestNews ?? []).filter((news) => news.id !== item.id),
                          }))
                        }
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'global-footprint' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <input
                  value={newFootprint.category}
                  onChange={(e) => setNewFootprint((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Category"
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                />
                <input
                  value={newFootprint.item}
                  onChange={(e) => setNewFootprint((prev) => ({ ...prev, item: e.target.value }))}
                  placeholder="Item"
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                />
                <input
                  value={newFootprint.location}
                  onChange={(e) => setNewFootprint((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Location"
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                />
                <input
                  value={newFootprint.year}
                  onChange={(e) => setNewFootprint((prev) => ({ ...prev, year: e.target.value }))}
                  placeholder="Year"
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
                />
                <CTAButton size="sm" onClick={addFootprint}>
                  <Plus size={14} className="mr-2" />
                  Add
                </CTAButton>
              </div>
              <div className="space-y-2">
                {filteredFootprint.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 rounded-xl border border-white/10 bg-white/5 items-center"
                  >
                    <p className="text-sm md:col-span-2">{entry.item}</p>
                    <p className="text-xs text-muted-foreground">{entry.category || '-'}</p>
                    <p className="text-xs text-muted-foreground">{entry.location}</p>
                    <p className="text-xs text-muted-foreground">{entry.year || '-'}</p>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            globalFootprint: (prev.globalFootprint ?? []).map((f) =>
                              f.id === entry.id ? { ...f, isActive: !f.isActive } : f,
                            ),
                          }))
                        }
                        className="text-xs font-bold text-muted-foreground hover:text-foreground"
                      >
                        {entry.isActive ? 'On map' : 'Hidden'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            globalFootprint: (prev.globalFootprint ?? []).filter((f) => f.id !== entry.id),
                          }))
                        }
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={(open) => !open && closePreview()}>
        <DialogContent
          showCloseButton={false}
          className="flex h-[min(85vh,760px)] w-[min(96vw,80rem)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none"
        >
          <DialogHeader className="flex flex-row items-center justify-between gap-4 border-b border-border px-4 py-3">
            <DialogTitle className="text-sm font-bold uppercase tracking-widest">Home Preview</DialogTitle>
            <div className="flex items-center gap-2">
              <CTAButton size="sm" variant="outline" onClick={() => setPreviewKey((prev) => prev + 1)}>
                Refresh
              </CTAButton>
              <CTAButton size="sm" variant="outline" onClick={handleSaveDraft}>
                Save Draft
              </CTAButton>
              <CTAButton size="sm" onClick={handlePublish}>
                Publish
              </CTAButton>
              <button
                type="button"
                onClick={closePreview}
                className="rounded-lg p-2 hover:bg-muted"
                aria-label="Close preview"
              >
                <X size={16} />
              </button>
            </div>
          </DialogHeader>
          <iframe
            ref={previewIframeRef}
            key={previewKey}
            src={`${siteUrl.replace(/\/$/, '')}/?homePreview=1`}
            title="Home preview"
            onLoad={postPreviewConfig}
            className="min-h-0 flex-1 bg-white"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
