'use client';

import { useCallback, useEffect, useState } from 'react';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import {
  FIELD_KEYS,
  normalizeHomeConfigV1ToV2,
  resolveHomeHeroForm,
  type HomePageConfigV2,
} from '@pms/site-content';
import { useWebsiteDataRealtime } from '@/hooks/useWebsiteDataRealtime';
import { isSupabaseConfigured } from '@/lib/supabase';

const HOME_CONFIG_KEY = FIELD_KEYS.HOME_PAGE_CONFIG;
export const HOME_PREVIEW_KEY = 'home_page_preview_config_v1';
const HOME_PREVIEW_MESSAGE = 'pms:home-preview-config';

function formatLoadError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function readPreviewConfig(): HomePageConfigV2 | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get('homePreview') !== '1') return null;
  try {
    const raw = localStorage.getItem(HOME_PREVIEW_KEY);
    if (!raw) return null;
    return normalizeHomeConfigV1ToV2(JSON.parse(raw));
  } catch {
    return null;
  }
}

function isPreviewRequest() {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('homePreview') === '1';
}

export function useHomePageConfig(initialConfig?: HomePageConfigV2 | null) {
  const [config, setConfig] = useState<HomePageConfigV2 | null>(initialConfig ?? null);
  const [isPreview, setIsPreview] = useState(() =>
    typeof window !== 'undefined' ? isPreviewRequest() : false,
  );

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    try {
      WebsiteDataService.invalidatePublishedCache([HOME_CONFIG_KEY]);
      const row = await WebsiteDataService.getPublishedByFieldKey(HOME_CONFIG_KEY);
      setConfig(normalizeHomeConfigV1ToV2(row?.content));
    } catch (err) {
      console.error('Failed to load home page config:', formatLoadError(err));
    }
  }, []);

  useEffect(() => {
    const preview = readPreviewConfig();
    if (preview) {
      setConfig(preview);
      setIsPreview(true);
      return;
    }

    if (initialConfig) {
      setConfig(initialConfig);
      return;
    }

    void refresh();
  }, [initialConfig, refresh]);

  useWebsiteDataRealtime(HOME_CONFIG_KEY, refresh, !isPreview && isSupabaseConfigured());

  useEffect(() => {
    if (!isPreviewRequest()) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== HOME_PREVIEW_MESSAGE) return;
      const nextConfig = normalizeHomeConfigV1ToV2(event.data.config);
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
  const featuredCertIds = config?.featuredPathways?.certIds ?? [];
  const activeFootprint = (config?.globalFootprint ?? []).filter((entry) => entry.isActive);
  const visibleTestimonials = (config?.testimonials ?? []).filter((t) => t.visible);
  const sections = config?.sections;

  return {
    config,
    isPreview,
    activeSlide,
    activeCta,
    latestNews,
    featuredCertIds,
    activeFootprint,
    visibleTestimonials,
    sections,
    stats: config?.stats,
    featuredPathways: config?.featuredPathways,
    programFamilies: config?.programFamilies ?? [],
    membership: config?.membership,
    insightsBand: config?.insightsBand,
    heroBadge: 'Prepare with structure',
    heroTitle: activeSlide?.heading ?? '',
    heroSubtitle: activeSlide?.description ?? '',
    ctaPrimary: activeSlide?.primaryCta ?? '',
    ctaSecondary: activeSlide?.secondaryCta ?? '',
    primaryAction: activeSlide?.primaryAction ?? 'register_modal',
    ctaPrimaryLink: activeSlide?.primaryLink ?? '/contact?topic=consultation',
    ctaSecondaryLink: activeSlide?.secondaryLink ?? '/certifications',
    heroForm: resolveHomeHeroForm(config?.heroForm),
  };
}

export type { HomePageConfigV2 };
