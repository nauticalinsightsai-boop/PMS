/**
 * Theme for Calendly iframe query params (`background_color` / `text_color`).
 * Must follow the **app** theme (`<html class="dark">`), not `prefers-color-scheme`:
 * users often pick light UI while the OS is still in dark mode, and we would wrongly
 * style Calendly with dark colors.
 */
export function getCalendlyEmbedTheme(): 'dark' | 'light' {
 return getCalendlySurfaceMode();
}

/**
 * Calendly widget overlay × (see popup-enhancements): swapped GW accent vs raw theme so the
 * pill matches user contrast expectations. Sync with `app/globals.css` `--gw-accent-primary`
 * (light `#0071E3`, dark `#004B8E`).
 */
export const CALENDLY_OVERLAY_CLOSE_BG_HTML_LIGHT = '#0071E3';
export const CALENDLY_OVERLAY_CLOSE_BG_HTML_DARK = '#0071E3';

function isValidHexColor(value: string): boolean {
 return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

function normalizeHexColor(value: string): string {
 const trimmed = value.trim();
 if (!isValidHexColor(trimmed)) return '';
 if (trimmed.length === 4) {
  const [hash, r, g, b] = trimmed;
  return `${hash}${r}${r}${g}${g}${b}${b}`.toLowerCase();
 }
 return trimmed.toLowerCase();
}

function rgbToHex(value: string): string {
 const match = value.match(
  /^rgba?\(\s*([01]?\d?\d|2[0-4]\d|25[0-5])\s*,\s*([01]?\d?\d|2[0-4]\d|25[0-5])\s*,\s*([01]?\d?\d|2[0-4]\d|25[0-5])(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i
 );
 if (!match) return '';
 const [, r, g, b] = match;
 return `#${Number(r).toString(16).padStart(2, '0')}${Number(g).toString(16).padStart(2, '0')}${Number(
  b
 )
  .toString(16)
  .padStart(2, '0')}`.toLowerCase();
}

function getComputedColorVar(varName: string): string {
 if (typeof document === 'undefined') return '';
 const root = document.documentElement;
 const raw = getComputedStyle(root).getPropertyValue(varName).trim();
 if (!raw) return '';
 const hex = normalizeHexColor(raw);
 if (hex) return hex;
 return rgbToHex(raw);
}

function getComputedColorVarFromElement(el: Element, varName: string): string {
 const raw = getComputedStyle(el).getPropertyValue(varName).trim();
 if (!raw) return '';
 const hex = normalizeHexColor(raw);
 if (hex) return hex;
 return rgbToHex(raw);
}

function getActivePortalRoot(): HTMLElement | null {
 if (typeof document === 'undefined') return null;
 const roots = Array.from(document.querySelectorAll<HTMLElement>('.portal-root'));
 if (!roots.length) return null;
 const visible = roots.find((el) => el.offsetParent !== null);
 return visible ?? roots[0] ?? null;
}

type PortalCalendlyPalette = {
 background: string;
 text: string;
 primary: string;
 surface: string;
 border: string;
};

function getPortalCalendlyPalette(): PortalCalendlyPalette | null {
 const portalRoot = getActivePortalRoot();
 if (!portalRoot) return null;
 const background = getComputedColorVarFromElement(portalRoot, '--portal-bg');
 const text = getComputedColorVarFromElement(portalRoot, '--portal-text');
 const primary = getComputedColorVarFromElement(portalRoot, '--portal-primary');
 if (!background && !text && !primary) return null;
 const surface =
  getComputedColorVarFromElement(portalRoot, '--portal-card-bg') ||
  getComputedColorVarFromElement(portalRoot, '--portal-surface') ||
  background;
 const border = getComputedColorVarFromElement(portalRoot, '--portal-card-border') || surface;
 return {
  background: background || surface,
  text: text || (getCalendlySurfaceMode() === 'dark' ? 'f4f4f5' : '0f172a'),
  primary: primary || '0a66c2',
  surface: surface || background,
  border,
 };
}

function hexForCalendlyParam(hex: string, fallback: string): string {
 const normalized = normalizeHexColor(hex);
 return (normalized || fallback).replace('#', '');
}

function getVisibleAccentElement(): HTMLElement | null {
 if (typeof document === 'undefined') return null;
 const candidates = Array.from(
  document.querySelectorAll<HTMLElement>(
   'a.bg-brand-accent,button.bg-brand-accent,[role="button"].bg-brand-accent,.r-btn-primary.bg-brand-accent'
  )
 );
 if (!candidates.length) return null;
 return candidates.find((el) => el.offsetParent !== null) ?? candidates[0] ?? null;
}

export function getCalendlySurfaceMode(): 'dark' | 'light' {
 if (typeof document === 'undefined') return 'light';
 const portalRoot = getActivePortalRoot();
 const portalMode = portalRoot?.getAttribute('data-color-mode');
 if (portalMode === 'dark' || portalMode === 'light') return portalMode;
 return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/** Brand colors for Calendly chrome — portal/CSS tokens before visible CTAs (avoids light `bg-brand-accent` pills). */
function collectBrandAccentCandidates(): string[] {
 const candidates: string[] = [];
 const portalRoot = getActivePortalRoot();
 if (portalRoot) {
  const portalPrimary = getComputedColorVarFromElement(portalRoot, '--portal-primary');
  if (portalPrimary) candidates.push(portalPrimary);
 }
 for (const key of [
  '--color-accent',
  '--gw-accent-primary',
  '--brand-accent',
  '--color-brand-accent',
  '--accent-primary',
 ]) {
  const resolved = getComputedColorVar(key);
  if (resolved) candidates.push(resolved);
 }
 const accentEl = getVisibleAccentElement();
 if (accentEl) {
  const ctaHex = rgbToHex(getComputedStyle(accentEl).backgroundColor);
  if (ctaHex) candidates.push(ctaHex);
 }
 return candidates;
}

function getActiveBrandAccentColor(): string {
 return collectBrandAccentCandidates()[0] ?? '';
}

function pickCloseButtonAccent(mode: 'light' | 'dark'): string {
 for (const raw of collectBrandAccentCandidates()) {
  const accent = normalizeHexColor(raw);
  if (accent && !isLightHexColor(accent)) return accent;
 }
 return CALENDLY_POPUP_THEME_BASE[mode].closeBg;
}

export function getCalendlyOverlayCloseButtonColors(): { background: string; color: string } {
 if (typeof document === 'undefined') {
  return { background: CALENDLY_OVERLAY_CLOSE_BG_HTML_LIGHT, color: '#ffffff' };
 }
 const mode = getCalendlySurfaceMode();
 const background = pickCloseButtonAccent(mode);
 return {
  background,
  color: pickButtonForeground(background),
 };
}

export function getCalendlyOverlayScrimColor(): string {
 if (typeof document === 'undefined') return 'rgba(0, 0, 0, 0.65)';
 const portal = getPortalCalendlyPalette();
 if (portal?.background) {
  return withAlpha(portal.background, getCalendlySurfaceMode() === 'dark' ? 0.88 : 0.45, 'rgba(0, 0, 0, 0.65)');
 }
 const isDark = getCalendlySurfaceMode() === 'dark';
 return isDark ? 'rgba(2, 6, 23, 0.84)' : 'rgba(15, 23, 42, 0.42)';
}

export type CalendlyPopupThemeTokens = {
 closeBg: string;
 closeFg: string;
 closeBorder: string;
 closeHoverBg: string;
 closeActiveBg: string;
 closeShadow: string;
 closeFocusRing: string;
 overlayScrim: string;
 popupSurface: string;
 popupBorder: string;
 popupShadow: string;
};

type CalendlyPopupThemeOverride = Partial<CalendlyPopupThemeTokens>;

const CALENDLY_POPUP_THEME_BASE: Record<'light' | 'dark', CalendlyPopupThemeTokens> = {
 light: {
  closeBg: '#003366',
  closeFg: '#f4f4f5',
  closeBorder: 'rgba(0, 51, 102, 0.32)',
  closeHoverBg: '#002b5e',
  closeActiveBg: '#002244',
  closeShadow: '0 20px 40px -20px rgba(2, 6, 23, 0.45)',
  closeFocusRing: 'rgba(37, 99, 235, 0.45)',
  overlayScrim: 'rgba(15, 23, 42, 0.46)',
  popupSurface: 'rgba(255, 255, 255, 0.98)',
  popupBorder: 'rgba(148, 163, 184, 0.35)',
  popupShadow: '0 30px 80px -38px rgba(15, 23, 42, 0.45)',
 },
 dark: {
  closeBg: '#1d4ed8',
  closeFg: '#f8fafc',
  closeBorder: 'rgba(148, 163, 184, 0.42)',
  closeHoverBg: '#2563eb',
  closeActiveBg: '#1e40af',
  closeShadow: '0 20px 44px -20px rgba(2, 6, 23, 0.8)',
  closeFocusRing: 'rgba(96, 165, 250, 0.5)',
  overlayScrim: 'rgba(2, 6, 23, 0.84)',
  popupSurface: 'rgba(2, 6, 23, 0.96)',
  popupBorder: 'rgba(51, 65, 85, 0.8)',
  popupShadow: '0 34px 90px -42px rgba(2, 6, 23, 0.92)',
 },
};

const CALENDLY_POPUP_THEME_OVERRIDES: Array<{
 routePattern: RegExp;
 light?: CalendlyPopupThemeOverride;
 dark?: CalendlyPopupThemeOverride;
}> = [
 // Keep WhatsApp portal close control slightly brighter for better harmony with green-led artwork.
 {
  routePattern: /^\/go\/whatsapp\/?$/i,
  light: {
   closeBg: '#0f8f58',
   closeHoverBg: '#0b7a4b',
   closeActiveBg: '#09653f',
   closeFocusRing: 'rgba(16, 185, 129, 0.45)',
  },
  dark: {
   closeBg: '#16a34a',
   closeHoverBg: '#22c55e',
   closeActiveBg: '#15803d',
   closeFocusRing: 'rgba(52, 211, 153, 0.5)',
  },
 },
];

function mergePopupThemeTokens(
 base: CalendlyPopupThemeTokens,
 override?: CalendlyPopupThemeOverride
): CalendlyPopupThemeTokens {
 if (!override) return base;
 return { ...base, ...override };
}

function getRoutePopupThemeOverride(pathname: string, mode: 'light' | 'dark'): CalendlyPopupThemeOverride | undefined {
 const match = CALENDLY_POPUP_THEME_OVERRIDES.find((entry) => entry.routePattern.test(pathname));
 if (!match) return undefined;
 return mode === 'dark' ? match.dark : match.light;
}

function getActiveAccentOrFallback(mode: 'light' | 'dark'): string {
 return pickCloseButtonAccent(mode);
}

function hexToRgbComponents(hex: string): [number, number, number] | null {
 const normalized = normalizeHexColor(hex);
 if (!normalized) return null;
 const r = Number.parseInt(normalized.slice(1, 3), 16);
 const g = Number.parseInt(normalized.slice(3, 5), 16);
 const b = Number.parseInt(normalized.slice(5, 7), 16);
 return [r, g, b];
}

function withAlpha(hex: string, alpha: number, fallback: string): string {
 const rgb = hexToRgbComponents(hex);
 if (!rgb) return fallback;
 const [r, g, b] = rgb;
 return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function adjustHex(hex: string, delta: number): string {
 const rgb = hexToRgbComponents(hex);
 if (!rgb) return hex;
 const [r, g, b] = rgb;
 const clamp = (value: number) => Math.max(0, Math.min(255, value));
 return `#${clamp(r + delta).toString(16).padStart(2, '0')}${clamp(g + delta)
  .toString(16)
  .padStart(2, '0')}${clamp(b + delta).toString(16).padStart(2, '0')}`;
}

export function getCalendlyPopupThemeTokens(pathname?: string): CalendlyPopupThemeTokens {
 const mode = getCalendlySurfaceMode();
 const base = CALENDLY_POPUP_THEME_BASE[mode];
 const accent = getActiveAccentOrFallback(mode);
 const portal = getPortalCalendlyPalette();
 const derived: CalendlyPopupThemeTokens = {
  ...base,
  closeBg: accent,
  /** Always contrast-safe on `closeBg` (avoid black × from unrelated CTA computed color). */
  closeFg: pickButtonForeground(accent),
  closeHoverBg: adjustHex(accent, mode === 'dark' ? 16 : -8),
  closeActiveBg: adjustHex(accent, mode === 'dark' ? -14 : -22),
  closeBorder: withAlpha(accent, mode === 'dark' ? 0.42 : 0.32, base.closeBorder),
  closeFocusRing: withAlpha(accent, mode === 'dark' ? 0.48 : 0.42, base.closeFocusRing),
  overlayScrim: getCalendlyOverlayScrimColor(),
  ...(portal
   ? {
      popupSurface: withAlpha(portal.surface, mode === 'dark' ? 0.96 : 0.98, base.popupSurface),
      popupBorder: withAlpha(portal.border, mode === 'dark' ? 0.55 : 0.35, base.popupBorder),
     }
   : {}),
 };
 const route = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');
 const override = getRoutePopupThemeOverride(route, mode);
 return mergePopupThemeTokens(derived, override);
}

/**
 * Hex colors for Calendly iframe query params (no `#`).
 * Keep in sync with **`.calendly-dashboard-home-skin`** in `app/globals.css` (dashboard Home CMS).
 */
const CALENDLY_EMBED_BRAND: Record<
 'dark' | 'light',
 { background: string; text: string; primary: string }
> = {
 light: {
  background: 'ffffff',
  text: '0f172a',
  primary: '003366',
 },
 dark: {
  background: '020617',
  text: 'f1f5f9',
  primary: '1d4ed8',
 },
};

import { isLightHexColor, pickButtonForeground } from '@/lib/channel-landing-pages/contrastUtils';
import { assertCalendlySchedulingUrl } from '@/lib/calendly/host-allowlist';
import { CALENDLY_DEFAULT_SCHEDULING_URLS } from '@/lib/calendly/scheduling-urls';

/** Strip quotes and allow only calendly.com scheduling URLs. */
export function sanitizeCalendlySchedulingUrl(raw: string): string {
 return assertCalendlySchedulingUrl(raw) ?? '';
}

/** Build Calendly `<iframe src>` embed URL: `embed_domain`, `embed_type=Inline`, theme + optional prefill. */
export function buildCalendlyIframeEmbedUrl(
 base: string,
 opts: {
  host: string;
  name?: string;
  email?: string;
  theme?: 'dark' | 'light';
 }
): string {
 const cleaned = sanitizeCalendlySchedulingUrl(base);
 if (!cleaned) return '';
 try {
  const u = new URL(cleaned);
  u.searchParams.set('embed_domain', opts.host);
  u.searchParams.set('embed_type', 'Inline');
  if (opts.name?.trim()) u.searchParams.set('name', opts.name.trim());
  if (opts.email?.trim()) u.searchParams.set('email', opts.email.trim());
  const theme = opts.theme ?? getCalendlySurfaceMode();
  const pal = CALENDLY_EMBED_BRAND[theme];
  const portal = getPortalCalendlyPalette();
  u.searchParams.set(
   'background_color',
   portal ? hexForCalendlyParam(portal.background, pal.background) : pal.background
  );
  u.searchParams.set(
   'text_color',
   portal ? hexForCalendlyParam(portal.text, pal.text) : pal.text
  );
  u.searchParams.set(
   'primary_color',
   portal ? hexForCalendlyParam(portal.primary, pal.primary) : pal.primary
  );
  return u.toString();
 } catch {
  return cleaned;
 }
}

/**
 * Calendly `initPopupWidget({ url })` — same theme tokens as inline embed, no `embed_type=Inline`
 * (popup uses its own chrome; colors still apply to the scheduler inside).
 */
export type CalendlyUtmParams = {
 utm_source?: string;
 utm_medium?: string;
 utm_campaign?: string;
 utm_content?: string;
};

function applyCalendlyUtm(u: URL, utm?: CalendlyUtmParams): void {
 if (!utm) return;
 if (utm.utm_source?.trim()) u.searchParams.set('utm_source', utm.utm_source.trim());
 if (utm.utm_medium?.trim()) u.searchParams.set('utm_medium', utm.utm_medium.trim());
 if (utm.utm_campaign?.trim()) u.searchParams.set('utm_campaign', utm.utm_campaign.trim());
 if (utm.utm_content?.trim()) u.searchParams.set('utm_content', utm.utm_content.trim());
}

export function buildCalendlyPopupWidgetUrl(
 base: string,
 opts: {
  host: string;
  theme?: 'dark' | 'light';
  utm?: CalendlyUtmParams;
 }
): string {
 const cleaned = sanitizeCalendlySchedulingUrl(base);
 if (!cleaned) return '';
 try {
  const u = new URL(cleaned);
  u.searchParams.set('embed_domain', opts.host);
  const theme = opts.theme ?? getCalendlySurfaceMode();
  const pal = CALENDLY_EMBED_BRAND[theme];
  const portal = getPortalCalendlyPalette();
  const accent = normalizeHexColor(getActiveBrandAccentColor());
  const popupPrimary = portal
   ? hexForCalendlyParam(portal.primary, pal.primary)
   : accent
     ? accent.slice(1)
     : pal.primary;
  u.searchParams.set(
   'background_color',
   portal ? hexForCalendlyParam(portal.background, pal.background) : pal.background
  );
  u.searchParams.set(
   'text_color',
   portal ? hexForCalendlyParam(portal.text, pal.text) : pal.text
  );
  u.searchParams.set('primary_color', popupPrimary);
  applyCalendlyUtm(u, opts.utm);
  return u.toString();
 } catch {
  return cleaned;
 }
}

/** Engagement “solo Calendly” modals: iframe only, no multi-step booking form. */
const CALENDLY_SOLO_MODAL_SERVICE_IDS = new Set([
 'guide-download',
 'project-review',
 'strategy-advisory',
 'consulting',
]);

export function isCalendlySoloModalService(serviceId: string): boolean {
 return CALENDLY_SOLO_MODAL_SERVICE_IDS.has(serviceId);
}

function resolveCalendlySchedulingUrl(
 envValue: string | undefined,
 fallback: string
): string {
 const fromEnv = sanitizeCalendlySchedulingUrl(envValue?.trim() || '');
 if (fromEnv) return fromEnv;
 return sanitizeCalendlySchedulingUrl(fallback);
}

/**
 * Public scheduling URL per service (browser links). `NEXT_PUBLIC_*` overrides defaults in
 * {@link CALENDLY_DEFAULT_SCHEDULING_URLS} (same events as Home hero where applicable).
 */
export function getCalendlySchedulingUrlForService(serviceId: string): string {
 if (serviceId === 'guide-download') {
  return resolveCalendlySchedulingUrl(
   process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL,
   CALENDLY_DEFAULT_SCHEDULING_URLS.guideDownload
  );
 }
 if (serviceId === 'project-review') {
  return resolveCalendlySchedulingUrl(
   process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL_PROJECT_REVIEW,
   CALENDLY_DEFAULT_SCHEDULING_URLS.projectReview
  );
 }
 if (serviceId === 'strategy-advisory') {
  return resolveCalendlySchedulingUrl(
   process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL_STRATEGY_ADVISORY,
   CALENDLY_DEFAULT_SCHEDULING_URLS.strategyAdvisory
  );
 }
 if (serviceId === 'consulting') {
  return resolveCalendlySchedulingUrl(
   process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL_PREMIUM_CONSULTING,
   CALENDLY_DEFAULT_SCHEDULING_URLS.premiumConsulting
  );
 }
 return '';
}
