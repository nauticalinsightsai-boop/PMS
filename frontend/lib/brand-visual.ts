/**
 * PM Structure brand visual system — aligned with PM_STRUCTURE_BRAND_VISUAL_SYSTEM.md
 * Logo/icon gradients (user-specified) + approved PMS palette.
 */

/** Full wordmark PNGs — `frontend/public/brand/` */
export const BRAND_LOGO = {
  light: '/brand/pms-logo-light.png',
  dark: '/brand/pms-logo-dark.png',
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
  /** Blue–purple (logo) */
  bluePurpleStart: '#2851b9',
  bluePurpleEnd: '#bc6ae2',
  /** Blue–cyan (logo, vertical) */
  blueCyanStart: '#0859b3',
  blueCyanEnd: '#57d5e2',
  /** Cover / hero */
  coverStart: '#696FF7',
  coverEnd: '#EF67CA',
} as const;

/** CSS `linear-gradient(...)` values — use with style or utility classes */
export const PMS_GRADIENTS = {
  /** Logo orange-red — 90° */
  orangeRed: `linear-gradient(90deg, ${PMS_COLORS.orangeStart} 0%, ${PMS_COLORS.orangeEnd} 100%)`,
  /** Logo blue–purple — 90° */
  bluePurple: `linear-gradient(90deg, ${PMS_COLORS.bluePurpleStart} 0%, ${PMS_COLORS.bluePurpleEnd} 100%)`,
  /** Logo blue–cyan — 180° */
  blueCyan: `linear-gradient(180deg, ${PMS_COLORS.blueCyanStart} 0%, ${PMS_COLORS.blueCyanEnd} 100%)`,
  /** Cover / campaign hero */
  cover: `linear-gradient(90deg, ${PMS_COLORS.coverStart} 0%, ${PMS_COLORS.coverEnd} 100%)`,
  /** Governance / professional anchor */
  charcoal: `linear-gradient(180deg, ${PMS_COLORS.charcoal} 0%, ${PMS_COLORS.charcoalMid} 100%)`,
} as const;

export type PmsGradientKey = keyof typeof PMS_GRADIENTS;

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
