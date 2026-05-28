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
  Save,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CTAButton } from '@/components/ui/CTAButton';
import { SyncStatusIndicator, SyncStatus } from '@/components/shared/SyncStatusIndicator';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import { siteUrl } from '@/lib/site-config';
import { HOME_COPY, CTAS } from '@/lib/brand-voice';

type CmsTab = 'hero' | 'cta' | 'featured' | 'latest-news' | 'global-footprint';

interface HeroSlide {
  id: number;
  visible: boolean;
  heading: string;
  description: string;
  primaryCta: string;
  primaryLink: string;
  secondaryCta: string;
  secondaryLink: string;
}

interface CtaBlock {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

interface LatestNewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  visible: boolean;
}

interface FootprintEntry {
  id: string;
  category: string;
  item: string;
  location: string;
  year: string;
  isActive: boolean;
}

interface HomePageConfig {
  heroSlides: HeroSlide[];
  instituteSection: {
    type: 'institute' | 'engagement' | 'speaking';
    institute: CtaBlock;
    engagement: CtaBlock;
    speaking: CtaBlock;
  };
  featuredItems: {
    showProjects: boolean;
    showConsultancies: boolean;
    showVentures: boolean;
    selectedProjectIds: string[];
    selectedConsultancyIds: string[];
    selectedVentureIds: string[];
  };
  latestNews: LatestNewsItem[];
  latestNewsVisible: boolean;
  globalFootprint: FootprintEntry[];
}

const HOME_CONFIG_KEY = 'home_page_config';
const PREVIEW_KEY = 'home_page_preview_config_v1';
const HOME_PREVIEW_MESSAGE = 'pms:home-preview-config';

const defaultCtaBlock = (title: string): CtaBlock => ({
  title,
  subtitle: '',
  description: '',
  ctaText: '',
  ctaLink: '',
});

const defaultConfig: HomePageConfig = {
  heroSlides: [
    {
      id: 1,
      visible: true,
      heading: HOME_COPY.heroTitle,
      description: HOME_COPY.heroSubtitle,
      primaryCta: CTAS.pathwayConsultation,
      primaryLink: '/contact',
      secondaryCta: CTAS.findPathway,
      secondaryLink: '/certifications',
    },
  ],
  instituteSection: {
    type: 'institute',
    institute: defaultCtaBlock('Institute'),
    engagement: defaultCtaBlock('Engagement'),
    speaking: defaultCtaBlock('Speaking'),
  },
  featuredItems: {
    showProjects: true,
    showConsultancies: true,
    showVentures: false,
    selectedProjectIds: [],
    selectedConsultancyIds: [],
    selectedVentureIds: [],
  },
  latestNews: [],
  latestNewsVisible: true,
  globalFootprint: [],
};

const tabItems: Array<{ id: CmsTab; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { id: 'hero', label: 'Hero', icon: Home },
  { id: 'cta', label: 'CTA', icon: ArrowRight },
  { id: 'featured', label: 'Featured Portfolio', icon: Image },
  { id: 'latest-news', label: 'Latest News', icon: Newspaper },
  { id: 'global-footprint', label: 'Global Footprint', icon: Globe },
];

function normalizeConfig(raw: unknown): HomePageConfig {
  if (!raw || typeof raw !== 'object') return defaultConfig;
  const parsed = raw as Partial<HomePageConfig>;
  return {
    heroSlides:
      Array.isArray(parsed.heroSlides) && parsed.heroSlides.length > 0
        ? parsed.heroSlides.map((slide, idx) => ({
            id: slide?.id ?? idx + 1,
            visible: Boolean(slide?.visible ?? true),
            heading: slide?.heading ?? '',
            description: slide?.description ?? '',
            primaryCta: slide?.primaryCta ?? '',
            primaryLink: slide?.primaryLink ?? '',
            secondaryCta: slide?.secondaryCta ?? '',
            secondaryLink: slide?.secondaryLink ?? '',
          }))
        : defaultConfig.heroSlides,
    instituteSection: {
      type: parsed.instituteSection?.type ?? 'institute',
      institute: { ...defaultCtaBlock('Institute'), ...parsed.instituteSection?.institute },
      engagement: { ...defaultCtaBlock('Engagement'), ...parsed.instituteSection?.engagement },
      speaking: { ...defaultCtaBlock('Speaking'), ...parsed.instituteSection?.speaking },
    },
    featuredItems: {
      showProjects: parsed.featuredItems?.showProjects ?? true,
      showConsultancies: parsed.featuredItems?.showConsultancies ?? true,
      showVentures: parsed.featuredItems?.showVentures ?? false,
      selectedProjectIds: parsed.featuredItems?.selectedProjectIds ?? [],
      selectedConsultancyIds: parsed.featuredItems?.selectedConsultancyIds ?? [],
      selectedVentureIds: parsed.featuredItems?.selectedVentureIds ?? [],
    },
    latestNews: Array.isArray(parsed.latestNews)
      ? parsed.latestNews.map((item) => ({
          id: item.id,
          title: item.title ?? '',
          description: item.description ?? '',
          link: item.link ?? '',
          visible: item.visible ?? true,
        }))
      : [],
    latestNewsVisible: parsed.latestNewsVisible ?? true,
    globalFootprint: Array.isArray(parsed.globalFootprint)
      ? parsed.globalFootprint.map((entry) => ({
          id: entry.id,
          category: entry.category ?? '',
          item: entry.item ?? '',
          location: entry.location ?? '',
          year: entry.year ?? '',
          isActive: entry.isActive ?? true,
        }))
      : [],
  };
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
    if (!q) return config.latestNews;
    return config.latestNews.filter((item) =>
      [item.title, item.description, item.link].join(' ').toLowerCase().includes(q),
    );
  }, [config.latestNews, search]);

  const filteredFootprint = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return config.globalFootprint;
    return config.globalFootprint.filter((entry) =>
      [entry.category, entry.item, entry.location, entry.year].join(' ').toLowerCase().includes(q),
    );
  }, [config.globalFootprint, search]);

  const updateHeroSlide = (id: number, patch: Partial<HeroSlide>) => {
    setConfig((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide)),
    }));
  };

  const updateCtaBlock = (key: 'institute' | 'engagement' | 'speaking', patch: Partial<CtaBlock>) => {
    setConfig((prev) => ({
      ...prev,
      instituteSection: {
        ...prev.instituteSection,
        [key]: { ...prev.instituteSection[key], ...patch },
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
        ...prev.latestNews,
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
        ...prev.globalFootprint,
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gw-accent-primary" />
      </div>
    );
  }

  const activeCtaType = config.instituteSection.type;
  const activeCtaBlock = config.instituteSection[activeCtaType];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 space-y-4 pb-8">
        <header className="pt-2">
          <h1 className="text-3xl font-black tracking-tight">Homepage CMS</h1>
          <p className="text-gw-text-secondary text-sm mt-1">
            Edit public homepage sections. Draft saves to Supabase; Publish makes them live.
          </p>
        </header>

        <div className="sticky top-0 z-20 bg-gw-bg-primary py-3 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar min-w-0">
              {tabItems.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearch('');
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-gw-accent-primary/15 text-gw-accent-primary'
                        : 'text-gw-text-secondary hover:text-gw-text-primary hover:bg-white/5'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

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
            className="w-56 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-xs font-bold text-gw-text-secondary hover:text-gw-text-primary"
            >
              Clear
            </button>
          ) : null}
        </div>

        <GlassCard variant="raised" className="p-4 md:p-6 space-y-4">
          {activeTab === 'hero' && (
            <div className="space-y-3">
              {filteredHeroSlides.length === 0 ? (
                <p className="text-sm text-gw-text-secondary">No hero slides match your search.</p>
              ) : (
                filteredHeroSlides.map((slide) => (
                  <div key={slide.id} className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black uppercase tracking-widest">Slide {slide.id}</p>
                      <button
                        type="button"
                        onClick={() => updateHeroSlide(slide.id, { visible: !slide.visible })}
                        className="inline-flex items-center gap-2 text-xs font-bold text-gw-text-secondary hover:text-gw-text-primary"
                      >
                        {slide.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        {slide.visible ? 'Visible' : 'Hidden'}
                      </button>
                    </div>
                    <textarea
                      value={slide.heading}
                      onChange={(e) => updateHeroSlide(slide.id, { heading: e.target.value })}
                      placeholder="Heading"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                    />
                    <textarea
                      value={slide.description}
                      onChange={(e) => updateHeroSlide(slide.id, { description: e.target.value })}
                      placeholder="Description"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm h-24 outline-none focus:ring-1 focus:ring-gw-accent-primary"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        value={slide.primaryCta}
                        onChange={(e) => updateHeroSlide(slide.id, { primaryCta: e.target.value })}
                        placeholder="Primary CTA"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                      />
                      <input
                        value={slide.primaryLink}
                        onChange={(e) => updateHeroSlide(slide.id, { primaryLink: e.target.value })}
                        placeholder="Primary Link"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                      />
                      <input
                        value={slide.secondaryCta}
                        onChange={(e) => updateHeroSlide(slide.id, { secondaryCta: e.target.value })}
                        placeholder="Secondary CTA"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                      />
                      <input
                        value={slide.secondaryLink}
                        onChange={(e) => updateHeroSlide(slide.id, { secondaryLink: e.target.value })}
                        placeholder="Secondary Link"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'cta' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['institute', 'engagement', 'speaking'] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setConfig((prev) => ({
                        ...prev,
                        instituteSection: { ...prev.instituteSection, type: key },
                      }))
                    }
                    className={`text-left p-4 rounded-2xl border transition-colors ${
                      activeCtaType === key
                        ? 'border-gw-accent-primary bg-gw-accent-primary/10'
                        : 'border-white/10 bg-white/5 hover:border-gw-accent-primary/40'
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest">{key}</p>
                    <p className="text-sm text-gw-text-secondary mt-2 line-clamp-2">
                      {config.instituteSection[key].title || 'No title set yet'}
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                />
                <input
                  value={activeCtaBlock.title}
                  onChange={(e) => updateCtaBlock(activeCtaType, { title: e.target.value })}
                  placeholder="Title"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                />
                <textarea
                  value={activeCtaBlock.description}
                  onChange={(e) => updateCtaBlock(activeCtaType, { description: e.target.value })}
                  placeholder="Description"
                  className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    value={activeCtaBlock.ctaLink}
                    onChange={(e) => updateCtaBlock(activeCtaType, { ctaLink: e.target.value })}
                    placeholder="CTA link"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                  />
                  <input
                    value={activeCtaBlock.ctaText}
                    onChange={(e) => updateCtaBlock(activeCtaType, { ctaText: e.target.value })}
                    placeholder="CTA text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'featured' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-5">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={config.featuredItems.showProjects}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        featuredItems: { ...prev.featuredItems, showProjects: e.target.checked },
                      }))
                    }
                  />
                  Show Projects
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={config.featuredItems.showConsultancies}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        featuredItems: { ...prev.featuredItems, showConsultancies: e.target.checked },
                      }))
                    }
                  />
                  Show Consultancies
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={config.featuredItems.showVentures}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        featuredItems: { ...prev.featuredItems, showVentures: e.target.checked },
                      }))
                    }
                  />
                  Show Ventures
                </label>
              </div>
              <p className="text-xs text-gw-text-secondary">
                Comma-separated IDs (portfolio catalog wiring can replace this later).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <textarea
                  value={config.featuredItems.selectedProjectIds.join(', ')}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      featuredItems: {
                        ...prev.featuredItems,
                        selectedProjectIds: e.target.value.split(',').map((v) => v.trim()).filter(Boolean),
                      },
                    }))
                  }
                  placeholder="Project IDs"
                  className="w-full h-28 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                />
                <textarea
                  value={config.featuredItems.selectedConsultancyIds.join(', ')}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      featuredItems: {
                        ...prev.featuredItems,
                        selectedConsultancyIds: e.target.value.split(',').map((v) => v.trim()).filter(Boolean),
                      },
                    }))
                  }
                  placeholder="Consultancy IDs"
                  className="w-full h-28 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                />
                <textarea
                  value={config.featuredItems.selectedVentureIds.join(', ')}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      featuredItems: {
                        ...prev.featuredItems,
                        selectedVentureIds: e.target.value.split(',').map((v) => v.trim()).filter(Boolean),
                      },
                    }))
                  }
                  placeholder="Venture IDs"
                  className="w-full h-28 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                />
              </div>
            </div>
          )}

          {activeTab === 'latest-news' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest">Latest News</h3>
                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, latestNewsVisible: !prev.latestNewsVisible }))}
                  className="text-xs font-bold text-gw-text-secondary hover:text-gw-text-primary"
                >
                  {config.latestNewsVisible ? 'Visible' : 'Hidden'}
                </button>
              </div>
              <div className="p-4 rounded-2xl border border-gw-accent-primary/40 bg-gw-accent-primary/5 space-y-3">
                <input
                  value={newNews.title}
                  onChange={(e) => setNewNews((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Title"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                />
                <textarea
                  value={newNews.description}
                  onChange={(e) => setNewNews((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Description"
                  className="w-full h-20 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                />
                <input
                  value={newNews.link}
                  onChange={(e) => setNewNews((prev) => ({ ...prev, link: e.target.value }))}
                  placeholder="Optional Link"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
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
                        <p className="text-sm text-gw-text-secondary mt-1">{item.description}</p>
                        {item.link ? <p className="text-xs mt-2 text-gw-accent-primary">{item.link}</p> : null}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            latestNews: prev.latestNews.filter((news) => news.id !== item.id),
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
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                />
                <input
                  value={newFootprint.item}
                  onChange={(e) => setNewFootprint((prev) => ({ ...prev, item: e.target.value }))}
                  placeholder="Item"
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                />
                <input
                  value={newFootprint.location}
                  onChange={(e) => setNewFootprint((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Location"
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
                />
                <input
                  value={newFootprint.year}
                  onChange={(e) => setNewFootprint((prev) => ({ ...prev, year: e.target.value }))}
                  placeholder="Year"
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gw-accent-primary"
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
                    <p className="text-xs text-gw-text-secondary">{entry.category || '-'}</p>
                    <p className="text-xs text-gw-text-secondary">{entry.location}</p>
                    <p className="text-xs text-gw-text-secondary">{entry.year || '-'}</p>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            globalFootprint: prev.globalFootprint.map((f) =>
                              f.id === entry.id ? { ...f, isActive: !f.isActive } : f,
                            ),
                          }))
                        }
                        className="text-xs font-bold text-gw-text-secondary hover:text-gw-text-primary"
                      >
                        {entry.isActive ? 'On map' : 'Hidden'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            globalFootprint: prev.globalFootprint.filter((f) => f.id !== entry.id),
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

      {isPreviewOpen ? (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm p-4 md:p-8">
          <div className="mx-auto h-full max-w-7xl rounded-2xl border border-white/10 bg-gw-bg-secondary overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <p className="text-sm font-bold uppercase tracking-widest">Home Preview</p>
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
                <button type="button" onClick={closePreview} className="p-2 rounded-lg hover:bg-white/10">
                  <X size={16} />
                </button>
              </div>
            </div>
            <iframe
              ref={previewIframeRef}
              key={previewKey}
              src={`${siteUrl.replace(/\/$/, '')}/?homePreview=1`}
              title="Home preview"
              onLoad={postPreviewConfig}
              className="flex-1 bg-white"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
