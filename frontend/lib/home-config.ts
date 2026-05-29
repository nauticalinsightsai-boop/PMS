'use client';

import { useEffect, useState } from 'react';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import {
  FIELD_KEYS,
  normalizeHomeConfigV1ToV2,
  type HomePageConfigV2,
} from '@pms/site-content';

const HOME_CONFIG_KEY = FIELD_KEYS.HOME_PAGE_CONFIG;
export const HOME_PREVIEW_KEY = 'home_page_preview_config_v1';
const HOME_PREVIEW_MESSAGE = 'pms:home-preview-config';

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

export function useHomePageConfig() {
  const [config, setConfig] = useState<HomePageConfigV2 | null>(null);
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
        setConfig(normalizeHomeConfigV1ToV2(row?.content));
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
  };
}

export type { HomePageConfigV2 };
