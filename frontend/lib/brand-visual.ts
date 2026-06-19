/**
 * PM Structure brand visual system: aligned with PM_STRUCTURE_BRAND_VISUAL_SYSTEM.md
 * Logo/icon gradients (user-specified) + approved PMS palette.
 */

import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

/** Family default gradients: keep in sync with `familyConfigs` in siteData. */
const FAMILY_GRADIENT_CLASSES: Record<string, string> = {
  PMI: 'bg-gradient-to-r from-[#2851b9] to-[#bc6ae2]',
  PRINCE2: 'bg-gradient-to-r from-[#0859b3] to-[#57d5e2]',
  SixSigma: 'bg-gradient-to-r from-[#262a33] to-[#434855]',
};

/** Full wordmark PNGs: `frontend/public/brand/` */
export const BRAND_LOGO_ASSET_VERSION = '4';

export const BRAND_LOGO = {
  light: `/brand/pms-logo-light.png?v=${BRAND_LOGO_ASSET_VERSION}`,
  dark: `/brand/pms-logo-dark.png?v=${BRAND_LOGO_ASSET_VERSION}`,
} as const;

/** Bump when replacing brand icon assets so Next/Image cache busts. */
export const BRAND_ICON_ASSET_VERSION = '6';

/** Square app icon for compact UI marks (forms, cards, portal hero). WebP primary; PNG fallback. */
export const BRAND_ICON = {
  light: `/brand/pms-icon.webp?v=${BRAND_ICON_ASSET_VERSION}`,
  dark: `/brand/pms-icon-dark.webp?v=${BRAND_ICON_ASSET_VERSION}`,
  lightPng: `/brand/pms-icon.png?v=${BRAND_ICON_ASSET_VERSION}`,
  darkPng: `/brand/pms-icon-dark.png?v=${BRAND_ICON_ASSET_VERSION}`,
} as const;

/** Issuing-body marks on certification / family cards */
export const BRAND_CERT_LOGOS = {
  PMI: '/brand/pmi-logo.png',
  PRINCE2: '/brand/prince2-logo.svg',
  SixSigma: '/brand/sixsigma-logo.svg',
} as const;

export const PMS_COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  navy: '#0B0B2A',
  navyDark: '#07071C',
  navyViolet: '#0F0E38',
  charcoal: '#262A33',
  charcoalMid: '#434855',
  surface: '#F7F7FA',
  divider: '#E6E7EF',
  /** CTA / accent anchor (orange gradient start) */
  orangeStart: '#ff4a38',
  orangeEnd: '#ff884a',
  /** Blue-purple (logo) */
  bluePurpleStart: '#2851b9',
  bluePurpleEnd: '#bc6ae2',
  /** Blue-cyan (logo, vertical) */
  blueCyanStart: '#0859b3',
  blueCyanEnd: '#57d5e2',
  /** Cover / hero */
  coverStart: '#696FF7',
  coverEnd: '#EF67CA',
} as const;

/** CSS `linear-gradient(...)` values: use with style or utility classes */
export const PMS_GRADIENTS = {
  /** Logo orange-red: 90° */
  orangeRed: `linear-gradient(90deg, ${PMS_COLORS.orangeStart} 0%, ${PMS_COLORS.orangeEnd} 100%)`,
  /** Logo blue-purple: 90° */
  bluePurple: `linear-gradient(90deg, ${PMS_COLORS.bluePurpleStart} 0%, ${PMS_COLORS.bluePurpleEnd} 100%)`,
  /** Logo blue-cyan: 180° */
  blueCyan: `linear-gradient(180deg, ${PMS_COLORS.blueCyanStart} 0%, ${PMS_COLORS.blueCyanEnd} 100%)`,
  /** Cover / campaign hero */
  cover: `linear-gradient(90deg, ${PMS_COLORS.coverStart} 0%, ${PMS_COLORS.coverEnd} 100%)`,
  /** Governance / professional anchor */
  charcoal: `linear-gradient(180deg, ${PMS_COLORS.charcoal} 0%, ${PMS_COLORS.charcoalMid} 100%)`,
} as const;

export type PmsGradientKey = keyof typeof PMS_GRADIENTS;

/** Shared marketing-page hero H1 scale (home, certifications hub, pathway detail). */
export const MARKETING_HERO_H1_CLASS =
  'font-heading text-4xl font-bold tracking-tight leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl text-slate-900 dark:text-white';

/** Certification family → dominant pathway visual gradient */
export function familyGradientKey(familyId: string): PmsGradientKey {
  switch (familyId) {
    case 'PMI':
      return 'bluePurple';
    case 'PRINCE2':
      return 'blueCyan';
    case 'SixSigma':
      return 'charcoal';
    default:
      return 'orangeRed';
  }
}

export function getFamilyGradient(familyId: string): string {
  return PMS_GRADIENTS[familyGradientKey(familyId)];
}

/** Tailwind gradient classes for a cert (per-cert `gradient` in siteData, else family default). */
export function getCertGradientClassName(cert: {
  gradient?: string;
  familyId: string;
}): string | undefined {
  const gradient = cert.gradient?.trim();
  if (gradient) return cn('bg-gradient-to-r', gradient);
  const family = FAMILY_GRADIENT_CLASSES[cert.familyId];
  if (family) return family;
  return undefined;
}

/** Pathway card / visual header background: cert-specific when defined. */
export function getCertHeaderBackground(cert: {
  gradient?: string;
  familyId: string;
}): { className?: string; style?: CSSProperties } {
  const className = getCertGradientClassName(cert);
  if (className) return { className };
  return { style: { background: getFamilyGradient(cert.familyId) } };
}