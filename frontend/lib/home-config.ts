'use client';

import { useEffect, useState } from 'react';
import { WebsiteDataService } from '@/services/WebsiteDataService';

const HOME_CONFIG_KEY = 'home_page_config';
export const HOME_PREVIEW_KEY = 'home_page_preview_config_v1';
const HOME_PREVIEW_MESSAGE = 'pms:home-preview-config';

export interface HomeHeroSlide {
  id: number;
  visible: boolean;
  heading: string;
  description: string;
  primaryCta: string;
  primaryLink: string;
  secondaryCta: string;
  secondaryLink: string;
}

export interface HomeCtaBlock {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

export interface HomeLatestNewsItem {
  id: string;
  title: string;
  description: string;
  link?: string;
  visible: boolean;
}

export interface HomeFootprintEntry {
  id: string;
  category: string;
  item: string;
  location: string;
  year?: string;
  isActive: boolean;
}

export interface HomePageConfig {
  heroSlides: HomeHeroSlide[];
  instituteSection?: {
    type: 'institute' | 'engagement' | 'speaking';
    institute: HomeCtaBlock;
    engagement: HomeCtaBlock;
    speaking: HomeCtaBlock;
  };
  featuredItems?: {
    showProjects: boolean;
    showConsultancies: boolean;
    showVentures: boolean;
    selectedProjectIds: string[];
    selectedConsultancyIds: string[];
    selectedVentureIds: string[];
  };
  latestNewsVisible?: boolean;
  latestNews?: HomeLatestNewsItem[];
  globalFootprint?: HomeFootprintEntry[];
}

function parseConfig(raw: unknown): HomePageConfig | null {
  if (!raw || typeof raw !== 'object') return null;
  const c = raw as HomePageConfig;
  if (!Array.isArray(c.heroSlides)) return null;
  return c;
}

function readPreviewConfig(): HomePageConfig | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get('homePreview') !== '1') return null;
  try {
    const raw = localStorage.getItem(HOME_PREVIEW_KEY);
    if (!raw) return null;
    return parseConfig(JSON.parse(raw));
  } catch {
    return null;
  }
}

function isPreviewRequest() {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('homePreview') === '1';
}

export function useHomePageConfig() {
  const [config, setConfig] = useState<HomePageConfig | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const preview = readPreviewConfig();
    if (preview) {
      setConfig(preview);
      setIsPreview(true);
      return;
    }

    const load = async () => {
      try {
        const rows = await WebsiteDataService.getData('published');
        const row = rows.find((item) => item.field_key === HOME_CONFIG_KEY);
        setConfig(parseConfig(row?.content));
      } catch (err) {
        console.error('Failed to load home page config', err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!isPreviewRequest()) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== HOME_PREVIEW_MESSAGE) return;
      const nextConfig = parseConfig(event.data.config);
      if (!nextConfig) return;
      setConfig(nextConfig);
      setIsPreview(true);
      try {
        localStorage.setItem(HOME_PREVIEW_KEY, JSON.stringify(nextConfig));
      } catch {
        // Preview still works through postMessage if localStorage is unavailable.
      }
    };

    window.addEventListener('message', handleMessage);
    window.parent?.postMessage({ type: 'pms:home-preview-ready' }, '*');
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const activeSlide =
    config?.heroSlides.find((slide) => slide.visible) ?? config?.heroSlides[0] ?? null;
  const ctaType = config?.instituteSection?.type ?? 'institute';
  const activeCta = config?.instituteSection?.[ctaType] ?? null;
  const latestNews = (config?.latestNews ?? []).filter((item) => item.visible);
  const featuredIds = [
    ...(config?.featuredItems?.selectedProjectIds ?? []),
    ...(config?.featuredItems?.selectedConsultancyIds ?? []),
    ...(config?.featuredItems?.selectedVentureIds ?? []),
  ];
  const activeFootprint = (config?.globalFootprint ?? []).filter((entry) => entry.isActive);

  return {
    config,
    isPreview,
    activeSlide,
    activeCta,
    latestNews,
    featuredIds,
    activeFootprint,
    heroBadge: 'Prepare with structure',
    heroTitle: activeSlide?.heading ?? '',
    heroSubtitle: activeSlide?.description ?? '',
    ctaPrimary: activeSlide?.primaryCta ?? '',
    ctaSecondary: activeSlide?.secondaryCta ?? '',
    ctaPrimaryLink: activeSlide?.primaryLink ?? '/membership',
    ctaSecondaryLink: activeSlide?.secondaryLink ?? '/certifications',
  };
}
