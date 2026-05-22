'use client';

import { useEffect, useState } from 'react';
import { WebsiteDataService } from '@/services/WebsiteDataService';

const HOME_CONFIG_KEY = 'home_page_config';
export const HOME_PREVIEW_KEY = 'home_page_preview_config_v1';

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

export interface HomePageConfig {
  heroSlides: HomeHeroSlide[];
  latestNewsVisible?: boolean;
  latestNews?: Array<{ id: string; title: string; description: string; link?: string; visible: boolean }>;
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

  const activeSlide =
    config?.heroSlides.find((slide) => slide.visible) ?? config?.heroSlides[0] ?? null;

  return {
    config,
    isPreview,
    activeSlide,
    heroBadge: 'The Future of Project Leadership',
    heroTitle: activeSlide?.heading ?? '',
    heroSubtitle: activeSlide?.description ?? '',
    ctaPrimary: activeSlide?.primaryCta ?? '',
    ctaSecondary: activeSlide?.secondaryCta ?? '',
    ctaPrimaryLink: activeSlide?.primaryLink ?? '/membership',
    ctaSecondaryLink: activeSlide?.secondaryLink ?? '/certifications',
  };
}
