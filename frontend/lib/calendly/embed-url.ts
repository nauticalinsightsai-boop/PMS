/**
 * Theme for Calendly iframe query params (`background_color` / `text_color`).
 * Must follow the **app** theme (`<html class="dark">`), not `prefers-color-scheme`:
 * users often pick light UI while the OS is still in dark mode, and we would wrongly
 * style Calendly with dark colors.
 */
import { isLightHexColor, meetsContrast, pickButtonForeground, pickReadableForeground, effectiveTintedSurfaceHex } from '@/lib/channel-landing-pages/contrastUtils';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';
import { resolvePortalTheme } from '@/lib/channel-landing-pages/resolvePortalTheme';
import { resolveChannelIdFromLegacyKey } from '@pms/booking-crm/migrateChannelPages';
import { assertCalendlySchedulingUrl } from '@/lib/calendly/host-allowlist';
import {
  ENGAGEMENT_SERVICE_TO_WEBSITE_TIER,
  getWebsiteCalendlyUrl,
} from '@/lib/calendly/website-events';

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

type SiteCalendlyPalette = {
 background: string;
 text: string;
 primary: string;
 card: string;
 border: string;
};

/** Matches `PmpRoadmapLeadForm` / `--site-dialog-*` in `app/globals.css` (marketing site only). */
export const WEBSITE_MARKETING_CALENDLY_SURFACE = {
 light: {
  surface: '#ffffff',
  border: '#e2e8f0',
  scrim: 'rgba(11, 11, 42, 0.46)',
 },
 dark: {
  surface: '#0f172a',
  border: '#1e293b',
  scrim: 'rgba(15, 23, 42, 0.88)',
 },
} as const;

export function isWebsiteMarketingOnlyCalendlyPath(pathname?: string): boolean {
 return isWebsiteMarketingCalendlyPath(pathname) && !isGoPortalCalendlyPath(pathname);
}

const PRO_CONSULTATION_PORTAL_PATH = /^\/go\/(website|webinar)\/?$/i;

/** `/go/website` and `/go/webinar` — same Calendly scrim as marketing site dialogs. */
export function isProConsultationPortalCalendlyPath(pathname?: string): boolean {
 const route = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');
 return PRO_CONSULTATION_PORTAL_PATH.test(route);
}

/** @deprecated Use isProConsultationPortalCalendlyPath */
export function isGoWebsitePortalCalendlyPath(pathname?: string): boolean {
 return isProConsultationPortalCalendlyPath(pathname);
}

function readWebsiteMarketingCalendlySurface(mode: 'light' | 'dark'): {
 surface: string;
 border: string;
 scrim: string;
} {
 const fallback = WEBSITE_MARKETING_CALENDLY_SURFACE[mode];
 if (typeof document === 'undefined') return fallback;
 const surface = getComputedColorVar('--site-dialog-surface') || fallback.surface;
 const border = getComputedColorVar('--site-dialog-border') || fallback.border;
 /** Scrim follows active Calendly surface mode — not `--site-dialog-scrim` on `<html>` when portal toggles independently. */
 return { surface, border, scrim: fallback.scrim };
}

/** Snapchat `/go/snapchat` light-mode Calendly overlay — brand yellow (#FFFC00), not marketing navy scrim. */
export const SNAPCHAT_PORTAL_CALENDLY_OVERLAY_SCRIM_LIGHT = 'rgba(255, 252, 0, 0.58)';

/** Snapchat `/go/snapchat` dark-mode overlay scrim. */
export const SNAPCHAT_PORTAL_CALENDLY_OVERLAY_SCRIM_DARK = 'rgba(0, 0, 0, 0.82)';

type SnapchatPortalCalendlyTheme = {
 overlayScrim: string;
 closeBg: string;
 closeFg: string;
 embedBackground: string;
 embedText: string;
 embedPrimary: string;
 popupSurface: string;
 popupBorder: string;
};

const SNAPCHAT_PORTAL_CALENDLY: Record<'light' | 'dark', SnapchatPortalCalendlyTheme> = {
 light: {
  overlayScrim: SNAPCHAT_PORTAL_CALENDLY_OVERLAY_SCRIM_LIGHT,
  closeBg: '#000000',
  closeFg: '#FFFC00',
  embedBackground: 'fffc00',
  embedText: '000000',
  embedPrimary: '000000',
  popupSurface: 'rgba(255, 252, 0, 0.98)',
  popupBorder: 'rgba(0, 0, 0, 0.2)',
 },
 dark: {
  overlayScrim: SNAPCHAT_PORTAL_CALENDLY_OVERLAY_SCRIM_DARK,
  closeBg: '#FFFC00',
  closeFg: '#000000',
  embedBackground: '111111',
  embedText: 'ffffff',
  embedPrimary: 'fffc00',
  popupSurface: 'rgba(17, 17, 17, 0.98)',
  popupBorder: 'rgba(255, 252, 0, 0.25)',
 },
};

function isSnapchatPortalCalendlyContext(pathname?: string): boolean {
 const route = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');
 if (route && resolveGoPortalChannelId(route) === 'snapchat') return true;
 if (typeof document !== 'undefined') {
  return getActivePortalRoot()?.getAttribute('data-platform') === 'snapchat';
 }
 return false;
}

function getSnapchatPortalCalendlyTheme(
 pathname?: string,
 mode?: 'light' | 'dark'
): SnapchatPortalCalendlyTheme | null {
 if (!isSnapchatPortalCalendlyContext(pathname)) return null;
 const resolvedMode = mode ?? getCalendlySurfaceMode();
 return SNAPCHAT_PORTAL_CALENDLY[resolvedMode];
}

/** Site-dialog scrim for every Calendly popup (marketing pages and all `/go/*` slugs). */
export function resolveMarketingCalendlyOverlayScrim(mode: 'light' | 'dark'): string {
 return readWebsiteMarketingCalendlySurface(mode).scrim;
}

export function resolveCalendlyOverlayScrimForRoute(
 pathname: string,
 mode: 'light' | 'dark'
): string {
 const snapchat = getSnapchatPortalCalendlyTheme(pathname, mode);
 if (snapchat) return snapchat.overlayScrim;
 return resolveMarketingCalendlyOverlayScrim(mode);
}

function buildMarketingCalendlyPaletteFallback(mode: 'light' | 'dark'): PortalCalendlyPalette {
 const { surface, border } = readWebsiteMarketingCalendlySurface(mode);
 const primary = '#ff4a38';
 return {
  background: mode === 'dark' ? '#07071c' : '#ffffff',
  text: mode === 'dark' ? '#f7f7fa' : '#0b0b2a',
  primary,
  accent: primary,
  link: primary,
  context: primary,
  verified: primary,
  primaryForeground: pickButtonForeground(primary),
  surface,
  border,
 };
}

/** PM Structure marketing shell tokens (`packages/ui` CSS variables). */
export function getCalendlySitePalette(): SiteCalendlyPalette | null {
 if (typeof document === 'undefined') return null;
 const background = getComputedColorVar('--background');
 const text = getComputedColorVar('--foreground');
 const primary =
  getComputedColorVar('--primary') ||
  getComputedColorVar('--color-brand-accent') ||
  getComputedColorVar('--gw-accent-primary');
 const card = getComputedColorVar('--card') || background;
 const border = getComputedColorVar('--border') || card;
 if (!background && !text && !primary) return null;
 return {
  background: background || card || '#ffffff',
  text: text || (getCalendlySurfaceMode() === 'dark' ? '#f7f7fa' : '#0b0b2a'),
  primary: primary || '#ff4a38',
  card: card || background || '#ffffff',
  border,
 };
}

type PortalCalendlyPalette = {
 background: string;
 text: string;
 primary: string;
 accent: string;
 link: string;
 context: string;
 verified: string;
 primaryForeground: string;
 surface: string;
 border: string;
};

export type CalendlyPortalPalette = PortalCalendlyPalette;

function isSolidThemeHex(color: unknown): color is string {
 return typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(color);
}

function solidThemeHex(color: unknown, fallback: string): string {
 if (isSolidThemeHex(color)) return color.toLowerCase();
 if (typeof color === 'string') {
  const normalized = normalizeHexColor(color);
  if (normalized) return normalized;
  const rgb = rgbToHex(color);
  if (rgb) return rgb;
 }
 return normalizeHexColor(fallback) || fallback;
}

function resolveThemeOpaqueSurface(theme: PlatformPortalTheme): string {
 const pageBg = solidThemeHex(theme.background, '#ffffff');
 const surfaceBase = isSolidThemeHex(theme.surface) ? theme.surface : pageBg;
 if (isSolidThemeHex(theme.cardBg)) {
  return pickCalendlyEmbedBackground(theme.cardBg, pageBg);
 }
 if (typeof theme.cardBg === 'string') {
  return pickCalendlyEmbedBackground(
   effectiveTintedSurfaceHex(theme.cardBg, pageBg, surfaceBase),
   pageBg
  );
 }
 return pickCalendlyEmbedBackground(solidThemeHex(theme.surface, pageBg), pageBg);
}

/** Canonical /go/website + marketing-site Calendly palette (matches portal-website shell). */
export function resolveWebsitePortalCalendlyPalette(mode: 'light' | 'dark'): CalendlyPortalPalette {
 return platformPortalThemeToCalendlyPalette(resolvePortalTheme('website', mode));
}

export function isWebsiteMarketingCalendlyPath(pathname?: string): boolean {
 const route = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');
 if (/^\/go\/website\/?$/i.test(route)) return true;
 if (/^\/go\/[^/]+\/?$/i.test(route)) return false;
 return true;
}

/** Slug segment from `/go/{slug}` (legacy type slugs included). */
export function parseGoPortalSlugFromPathname(pathname: string): string | null {
 const match = pathname.match(/^\/go\/([^/?#]+)/i);
 return match?.[1]?.toLowerCase().trim() ?? null;
}

/** Platform channel id for a `/go/{slug}` route (e.g. `threads`, `twitter`). */
export function resolveGoPortalChannelId(pathname: string): string | null {
 const slug = parseGoPortalSlugFromPathname(pathname);
 if (!slug) return null;
 return resolveChannelIdFromLegacyKey(slug) ?? slug;
}

/**
 * Resolved Calendly iframe palette for the active page — marketing site or any `/go/*` slug.
 * Prefer live DOM reads (`getPortalCalendlyPalette`) when on a mounted portal; use this as fallback
 * and for URL theming when the popup opens.
 */
export function resolveCalendlyPaletteForPage(
 pathname?: string,
 mode?: 'light' | 'dark'
): CalendlyPortalPalette | null {
 const route = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');
 if (!route) return null;
 const colorMode = mode ?? getCalendlySurfaceMode();
 if (isWebsiteMarketingOnlyCalendlyPath(route)) {
  return (
   sitePaletteToCalendlyPortalPalette(getCalendlySitePalette(), colorMode) ??
   buildMarketingCalendlyPaletteFallback(colorMode)
  );
 }
 if (PRO_CONSULTATION_PORTAL_PATH.test(route)) {
  return resolveWebsitePortalCalendlyPalette(colorMode);
 }
 const channelId = resolveGoPortalChannelId(route);
 if (!channelId) return null;
 return platformPortalThemeToCalendlyPalette(resolvePortalTheme(channelId, colorMode));
}

function getEffectivePortalCalendlyPalette(pathname?: string, mode?: 'light' | 'dark'): PortalCalendlyPalette | null {
 const route = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');
 const colorMode = mode ?? getCalendlySurfaceMode();

 // Marketing pages (/pmp, /certifications, …): match live `html.dark` CSS vars, not portal theme tokens.
 if (isWebsiteMarketingCalendlyPath(route) && !isGoPortalCalendlyPath(route)) {
  return sitePaletteToCalendlyPortalPalette(getCalendlySitePalette(), colorMode);
 }

 // /go/* portals: resolved palette for the active portal light/dark toggle.
 const resolved = resolveCalendlyPaletteForPage(route, colorMode);
 if (resolved) return resolved;

 return getPortalCalendlyPalette();
}

/** True when pathname is `/go/{slug}` (any channel portal). */
export function isGoPortalCalendlyPath(pathname?: string): boolean {
 const route = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');
 return Boolean(parseGoPortalSlugFromPathname(route));
}

function sitePaletteToCalendlyPortalPalette(
 site: SiteCalendlyPalette | null,
 mode: 'light' | 'dark'
): PortalCalendlyPalette | null {
 const { surface, border } = readWebsiteMarketingCalendlySurface(mode);
 const primary = site?.primary || '#ff4a38';
 return {
  background: site?.background || (mode === 'dark' ? '#07071c' : '#ffffff'),
  text: site?.text || (mode === 'dark' ? '#f7f7fa' : '#0b0b2a'),
  primary,
  accent: primary,
  link: primary,
  context: primary,
  verified: primary,
  primaryForeground: pickButtonForeground(primary),
  surface,
  border,
 };
}

/** Build Calendly palette from resolved portal theme (avoids fragile DOM/CSS var reads). */
export function platformPortalThemeToCalendlyPalette(theme: PlatformPortalTheme): CalendlyPortalPalette {
 const background = solidThemeHex(theme.background, '#ffffff');
 const surface = resolveThemeOpaqueSurface(theme);
 const primary = solidThemeHex(theme.primary, '#0a66c2');
 const link = solidThemeHex(theme.linkColor, primary);
 const context = solidThemeHex(theme.contextColor, link);
 const verified = solidThemeHex(theme.verifiedColor, link);
 const accent = solidThemeHex(theme.accent, link);
 return {
  background,
  text: solidThemeHex(theme.text, '#0f172a'),
  primary,
  accent,
  link,
  context,
  verified,
  primaryForeground: solidThemeHex(theme.primaryForeground, pickButtonForeground(primary)),
  surface,
  border: solidThemeHex(theme.cardBorder, surface),
 };
}

function readPortalCssColor(portalRoot: Element, varName: string): string {
 return getComputedColorVarFromElement(portalRoot, varName);
}

function getPortalCalendlyPalette(): PortalCalendlyPalette | null {
 const portalRoot = getActivePortalRoot();
 if (!portalRoot) return null;
 const background = readPortalCssColor(portalRoot, '--portal-bg');
 const text = readPortalCssColor(portalRoot, '--portal-text');
 const primary = readPortalCssColor(portalRoot, '--portal-primary');
 if (!background && !text && !primary) return null;
 const surface =
  readPortalCssColor(portalRoot, '--portal-card-bg') ||
  readPortalCssColor(portalRoot, '--portal-surface') ||
  background;
 const border = readPortalCssColor(portalRoot, '--portal-card-border') || surface;
 const link = readPortalCssColor(portalRoot, '--portal-link');
 const context = readPortalCssColor(portalRoot, '--portal-context');
 const verified = readPortalCssColor(portalRoot, '--portal-verified');
 const accent =
  readPortalCssColor(portalRoot, '--portal-accent') ||
  link ||
  context ||
  verified ||
  readPortalCssColor(portalRoot, '--portal-recommended-bg') ||
  primary;
 const primaryForeground =
  readPortalCssColor(portalRoot, '--portal-primary-fg') ||
  (primary ? pickButtonForeground(primary) : '');
 return {
  background: background || surface,
  text: text || (getCalendlySurfaceMode() === 'dark' ? '#f4f4f5' : '#0f172a'),
  primary: primary || '#0a66c2',
  accent: accent || primary || '#0a66c2',
  link: link || accent || primary,
  context: context || link || accent || primary,
  verified: verified || link || accent || primary,
  primaryForeground: primaryForeground || (primary ? pickButtonForeground(primary) : '#ffffff'),
  surface: surface || background,
  border,
 };
}

/** Portal × close control: match active theme-toggle pill (primary fill + primary foreground). */
function readResolvedCssColor(value: string): string {
 const hex = normalizeHexColor(value);
 if (hex) return hex;
 return rgbToHex(value) || value;
}

function getActivePortalThemeToggleColors(): { bg: string; fg: string } | null {
 if (typeof document === 'undefined') return null;
 const portalRoot = getActivePortalRoot();
 if (!portalRoot) return null;
 const toggle = portalRoot.querySelector<HTMLElement>(
  '.portal-theme-toggle-btn[aria-pressed="true"]'
 );
 if (!toggle) return null;
 const style = getComputedStyle(toggle);
 const bg = readResolvedCssColor(style.backgroundColor);
 const fg = readResolvedCssColor(style.color);
 if (!bg || !fg || bg === 'transparent') return null;
 return { bg, fg };
}

function buildCloseButtonThemeFromColors(
 bg: string,
 fg: string,
 mode: 'light' | 'dark',
 borderFallback = 'transparent',
 focusFallback = 'rgba(37, 99, 235, 0.45)'
): Pick<
 CalendlyPopupThemeTokens,
 'closeBg' | 'closeFg' | 'closeBorder' | 'closeHoverBg' | 'closeActiveBg' | 'closeFocusRing'
> {
 return {
  closeBg: bg,
  closeFg: fg,
  closeBorder: withAlpha(bg, mode === 'dark' ? 0.42 : 0.32, borderFallback),
  closeHoverBg: adjustHex(bg, mode === 'dark' ? 16 : -8),
  closeActiveBg: adjustHex(bg, mode === 'dark' ? -14 : -22),
  closeFocusRing: withAlpha(bg, mode === 'dark' ? 0.48 : 0.42, focusFallback),
 };
}

/**
 * Close pill colors: match `.portal-theme-toggle-btn[aria-pressed="true"]` on portals,
 * or marketing `--primary` / `--primary-foreground` (same tokens the toggle uses).
 */
export function resolveCalendlyCloseButtonColors(pathname?: string): Pick<
 CalendlyPopupThemeTokens,
 'closeBg' | 'closeFg' | 'closeBorder' | 'closeHoverBg' | 'closeActiveBg' | 'closeFocusRing'
> {
 const mode = getCalendlySurfaceMode();
 const route = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');
 const base = CALENDLY_POPUP_THEME_BASE[mode];

 if (isSnapchatPortalCalendlyContext(route)) {
  const snapchat = getSnapchatPortalCalendlyTheme(route, mode);
  if (snapchat) {
   return buildCloseButtonThemeFromColors(
    snapchat.closeBg,
    snapchat.closeFg,
    mode,
    base.closeBorder,
    base.closeFocusRing
   );
  }
 }

 const toggle = getActivePortalThemeToggleColors();
 if (toggle) {
  return buildCloseButtonThemeFromColors(toggle.bg, toggle.fg, mode, base.closeBorder, base.closeFocusRing);
 }

 if (isWebsiteMarketingCalendlyPath(route) && !isGoPortalCalendlyPath(route)) {
  const site = getCalendlySitePalette();
  if (site?.primary) {
   const fg = getComputedColorVar('--primary-foreground') || pickButtonForeground(site.primary);
   return buildCloseButtonThemeFromColors(site.primary, fg, mode, base.closeBorder, base.closeFocusRing);
  }
  const marketing = resolveCalendlyPaletteForPage(route, mode);
  if (marketing?.primary) {
   return buildCloseButtonThemeFromColors(
    marketing.primary,
    marketing.primaryForeground,
    mode,
    base.closeBorder,
    base.closeFocusRing
   );
  }
 }

 if (isGoPortalCalendlyPath(route)) {
  const portal = resolveCalendlyPaletteForPage(route, mode);
  if (portal?.primary) {
   return buildCloseButtonThemeFromColors(
    portal.primary,
    portal.primaryForeground,
    mode,
    base.closeBorder,
    base.closeFocusRing
   );
  }
 }

 const accent = getActiveAccentOrFallback(mode, route);
 return buildCloseButtonThemeFromColors(
  accent,
  pickButtonForeground(accent),
  mode,
  base.closeBorder,
  base.closeFocusRing
 );
}

function hexForCalendlyParam(hex: string, fallback: string): string {
 const normalized = normalizeHexColor(hex);
 return (normalized || fallback).replace('#', '');
}

function uniqueHexColors(values: string[]): string[] {
 const seen = new Set<string>();
 const out: string[] = [];
 for (const raw of values) {
  const hex = normalizeHexColor(raw);
  if (!hex || seen.has(hex)) continue;
  seen.add(hex);
  out.push(hex);
 }
 return out;
}

export function pickCalendlyEmbedPrimary(backgroundHex: string, candidates: string[], fallbackHex: string): string {
 const bg = normalizeHexColor(backgroundHex) || fallbackHex;
 for (const hex of uniqueHexColors(candidates)) {
  if (hex !== bg && meetsContrast(hex, bg, 3)) return hex;
 }
 const fallback = normalizeHexColor(fallbackHex);
 if (fallback && meetsContrast(fallback, bg, 3)) return fallback;
 return pickReadableForeground(bg) === '#FFFFFF' ? '#2563EB' : '#FF4A38';
}

export function pickCalendlyEmbedText(backgroundHex: string, textHex: string, fallbackHex: string): string {
 const bg = normalizeHexColor(backgroundHex) || fallbackHex;
 const preferred = normalizeHexColor(textHex);
 if (preferred && preferred !== bg && meetsContrast(preferred, bg, 4.5)) return preferred;
 return pickReadableForeground(bg);
}

/** Avoid pure-black Calendly panels; links inherit `primary_color` and vanish on #000000. */
function pickCalendlyEmbedBackground(surfaceHex: string, fallbackHex: string): string {
 const surface = normalizeHexColor(surfaceHex) || normalizeHexColor(fallbackHex) || '#121212';
 if (surface === '#000000') return '#121212';
 return surface;
}

export function embedBgMatchesCalendlyMode(bgHex: string, mode: 'light' | 'dark'): boolean {
 const hex = normalizeHexColor(bgHex);
 if (!hex) return false;
 const light = isLightHexColor(hex);
 return mode === 'light' ? light : !light;
}

function harmonizeEmbedBackgroundForMode(
 candidates: string[],
 mode: 'light' | 'dark',
 brandFallbackHex: string
): string {
 const brandFallback = `#${brandFallbackHex.replace(/^#/, '')}`;
 for (const raw of candidates) {
  const bg = pickCalendlyEmbedBackground(raw, brandFallback);
  if (embedBgMatchesCalendlyMode(bg, mode)) return bg;
 }
 return mode === 'light' ? '#ffffff' : '#121212';
}

function resolvePortalCalendlyEmbedColors(
 portal: PortalCalendlyPalette,
 pathname: string,
 pal: { background: string; text: string; primary: string },
 mode: 'light' | 'dark'
): { background: string; text: string; primary: string } {
 const embedBg = harmonizeEmbedBackgroundForMode(
  [portal.surface, portal.background, `#${pal.background}`],
  mode,
  pal.background
 );
 const preferredText = normalizeHexColor(portal.text);
 let embedText =
  preferredText && preferredText !== embedBg && meetsContrast(preferredText, embedBg, 4.5)
   ? preferredText
   : pickCalendlyEmbedText(embedBg, portal.text, `#${pal.text}`);
 if (mode === 'dark' && !isLightHexColor(embedText)) {
  embedText = pickReadableForeground(embedBg);
 } else if (mode === 'light' && isLightHexColor(embedText) && isLightHexColor(embedBg)) {
  embedText = pickReadableForeground(embedBg);
 }
 const embedPrimary = pickCalendlyEmbedPrimary(
  embedBg,
  [
   portal.link,
   portal.accent,
   portal.context,
   portal.verified,
   portal.primary,
   getCalendlyRouteAccentColor(pathname),
  ],
  `#${pal.primary}`
 );
 return {
  background: hexForCalendlyParam(embedBg, pal.background),
  text: hexForCalendlyParam(embedText, pal.text),
  primary: hexForCalendlyParam(embedPrimary, pal.primary),
 };
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

/** Brand colors for Calendly chrome: portal/CSS tokens before visible CTAs (avoids light `bg-brand-accent` pills). */
function collectBrandAccentCandidates(): string[] {
 const candidates: string[] = [];
 const portalRoot = getActivePortalRoot();
 if (portalRoot) {
  for (const key of [
   '--portal-link',
   '--portal-context',
   '--portal-verified',
   '--portal-accent',
   '--portal-primary',
  ]) {
   const resolved = getComputedColorVarFromElement(portalRoot, key);
   if (resolved) candidates.push(resolved);
  }
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

export function getCalendlyOverlayScrimColor(pathname?: string): string {
 const mode = getCalendlySurfaceMode();
 const snapchat = getSnapchatPortalCalendlyTheme(pathname, mode);
 if (snapchat) return snapchat.overlayScrim;
 const route = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');
 if (route) return resolveCalendlyOverlayScrimForRoute(route, mode);
 return resolveMarketingCalendlyOverlayScrim(mode);
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
  overlayScrim: WEBSITE_MARKETING_CALENDLY_SURFACE.light.scrim,
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
  overlayScrim: WEBSITE_MARKETING_CALENDLY_SURFACE.dark.scrim,
  popupSurface: 'rgba(15, 23, 42, 0.96)',
  popupBorder: 'rgba(30, 41, 59, 0.8)',
  popupShadow: '0 34px 90px -42px rgba(2, 6, 23, 0.92)',
 },
};

/** Per-route accent CSS variable (close control + Calendly `primary_color`). */
const CALENDLY_ROUTE_ACCENT_VARS: Array<{ routePattern: RegExp; cssVar: string }> = [
 { routePattern: /^\/pm-service\/?$/i, cssVar: '--secondary' },
 { routePattern: /^\/pmp(-|$)/i, cssVar: '--primary' },
 { routePattern: /^\/certifications(\/|$)/i, cssVar: '--primary' },
 { routePattern: /^\/membership(\/|$)/i, cssVar: '--primary' },
 { routePattern: /\/(enroll\/success|checkout\/success)\/?$/i, cssVar: '--primary' },
 { routePattern: /^\/community\/?$/i, cssVar: '--secondary' },
 { routePattern: /^\/faq\/?$/i, cssVar: '--primary' },
 { routePattern: /^\/about\/?$/i, cssVar: '--primary' },
 { routePattern: /^\/$/i, cssVar: '--primary' },
];

const CALENDLY_POPUP_THEME_OVERRIDES: Array<{
 routePattern: RegExp;
 light?: CalendlyPopupThemeOverride;
 dark?: CalendlyPopupThemeOverride;
}> = [
 {
  routePattern: /^\/go\/snapchat\/?$/i,
  light: {
   overlayScrim: SNAPCHAT_PORTAL_CALENDLY.light.overlayScrim,
   closeBg: SNAPCHAT_PORTAL_CALENDLY.light.closeBg,
   closeFg: SNAPCHAT_PORTAL_CALENDLY.light.closeFg,
   closeBorder: 'rgba(0, 0, 0, 0.24)',
   closeHoverBg: '#1a1a1a',
   closeActiveBg: '#333333',
   closeFocusRing: 'rgba(0, 0, 0, 0.35)',
   popupSurface: SNAPCHAT_PORTAL_CALENDLY.light.popupSurface,
   popupBorder: SNAPCHAT_PORTAL_CALENDLY.light.popupBorder,
  },
  dark: {
   overlayScrim: SNAPCHAT_PORTAL_CALENDLY.dark.overlayScrim,
   closeBg: SNAPCHAT_PORTAL_CALENDLY.dark.closeBg,
   closeFg: SNAPCHAT_PORTAL_CALENDLY.dark.closeFg,
   closeBorder: 'rgba(255, 252, 0, 0.35)',
   closeHoverBg: '#e6e600',
   closeActiveBg: '#cccc00',
   closeFocusRing: 'rgba(255, 252, 0, 0.45)',
   popupSurface: SNAPCHAT_PORTAL_CALENDLY.dark.popupSurface,
   popupBorder: SNAPCHAT_PORTAL_CALENDLY.dark.popupBorder,
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

function derivePopupThemeFromPortalPalette(
 palette: PortalCalendlyPalette,
 mode: 'light' | 'dark'
): CalendlyPopupThemeOverride {
 return {
  popupSurface: withAlpha(
   palette.surface,
   mode === 'dark' ? 0.96 : 0.98,
   CALENDLY_POPUP_THEME_BASE[mode].popupSurface
  ),
  popupBorder: withAlpha(
   palette.border,
   mode === 'dark' ? 0.55 : 0.35,
   CALENDLY_POPUP_THEME_BASE[mode].popupBorder
  ),
 };
}

function getRoutePopupThemeOverride(pathname: string, mode: 'light' | 'dark'): CalendlyPopupThemeOverride | undefined {
 const match = CALENDLY_POPUP_THEME_OVERRIDES.find((entry) => entry.routePattern.test(pathname));
 if (match) return mode === 'dark' ? match.dark : match.light;

 const channelId = resolveGoPortalChannelId(pathname);
 if (channelId) {
  const palette = platformPortalThemeToCalendlyPalette(resolvePortalTheme(channelId, mode));
  return derivePopupThemeFromPortalPalette(palette, mode);
 }

 if (isWebsiteMarketingCalendlyPath(pathname) && !isGoPortalCalendlyPath(pathname)) {
  const sitePortal = sitePaletteToCalendlyPortalPalette(getCalendlySitePalette(), mode);
  if (sitePortal) return derivePopupThemeFromPortalPalette(sitePortal, mode);
 }

 if (isWebsiteMarketingCalendlyPath(pathname)) {
  return derivePopupThemeFromPortalPalette(resolveWebsitePortalCalendlyPalette(mode), mode);
 }

 return undefined;
}

export function getCalendlyRouteAccentColor(pathname?: string): string {
 if (typeof document === 'undefined') return '';
 const route = pathname ?? window.location.pathname;
 const routeAccent = CALENDLY_ROUTE_ACCENT_VARS.find((entry) => entry.routePattern.test(route));
 if (routeAccent) {
  const fromVar = getComputedColorVar(routeAccent.cssVar);
  if (fromVar) return fromVar;
 }
 for (const raw of collectBrandAccentCandidates()) {
  const accent = normalizeHexColor(raw);
  if (accent && !isLightHexColor(accent)) return accent;
 }
 return '';
}

function getActiveAccentOrFallback(mode: 'light' | 'dark', pathname?: string): string {
 const routeAccent = getCalendlyRouteAccentColor(pathname);
 if (routeAccent) return routeAccent;
 return pickCloseButtonAccent(mode);
}

export function isCalendlyEnrollmentSurfacePath(pathname?: string): boolean {
 const route = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');
 return /\/(enroll\/success|checkout\/success)\/?$/i.test(route);
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
 const route = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');
 const portal = getEffectivePortalCalendlyPalette(route, mode);
 const site = getCalendlySitePalette();
 const derived: CalendlyPopupThemeTokens = {
  ...base,
  ...resolveCalendlyCloseButtonColors(route),
  overlayScrim: getCalendlyOverlayScrimColor(route),
  ...(portal
   ? {
      popupSurface: withAlpha(portal.surface, mode === 'dark' ? 0.96 : 0.98, base.popupSurface),
      popupBorder: withAlpha(portal.border, mode === 'dark' ? 0.55 : 0.35, base.popupBorder),
     }
   : site
     ? {
        popupSurface: withAlpha(site.card, mode === 'dark' ? 0.96 : 0.98, base.popupSurface),
        popupBorder: withAlpha(site.border, mode === 'dark' ? 0.55 : 0.35, base.popupBorder),
       }
     : {}),
 };
 const override = getRoutePopupThemeOverride(route, mode);
 const merged = mergePopupThemeTokens(derived, override);
 return {
  ...merged,
  ...resolveCalendlyCloseButtonColors(route),
  overlayScrim: getCalendlyOverlayScrimColor(route),
 };
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
  text: '0b0b2a',
  primary: 'ff4a38',
 },
 dark: {
  background: '07071c',
  text: 'f7f7fa',
  primary: 'ff4a38',
 },
};

type CalendlyEmbedColorOpts = {
 theme: 'dark' | 'light';
 pathname?: string;
 surface?: 'default' | 'enrollment';
 /** When set (portal schedule CTAs), skip DOM palette reads. */
 portalPalette?: PortalCalendlyPalette | null;
};

/**
 * Calendly iframe `text_color` / `primary_color` follow the popup close pill
 * (`resolveCalendlyCloseButtonColors`) so scheduler chrome matches the × button on every route.
 */
export function syncCalendlyEmbedColorsWithCloseButton(
 colors: { background: string; text: string; primary: string },
 pathname: string,
 theme: 'light' | 'dark',
 pal: { background: string; text: string; primary: string }
): { background: string; text: string; primary: string } {
 if (getSnapchatPortalCalendlyTheme(pathname, theme)) {
  return colors;
 }

 const bgHex =
  normalizeHexColor(`#${colors.background.replace(/^#/, '')}`) || `#${pal.background}`;
 const close = resolveCalendlyCloseButtonColors(pathname);
 const closeFg = normalizeHexColor(close.closeFg);
 const closeBg = normalizeHexColor(close.closeBg);

 let textHex =
  closeFg && closeFg !== bgHex && meetsContrast(closeFg, bgHex, 4.5)
   ? closeFg
   : pickCalendlyEmbedText(bgHex, closeFg || `#${colors.text}`, `#${pal.text}`);

 let primaryHex = normalizeHexColor(`#${colors.primary.replace(/^#/, '')}`) || `#${pal.primary}`;
 if (closeBg && closeBg !== bgHex && meetsContrast(closeBg, bgHex, 3)) {
  primaryHex = closeBg;
 } else if (!meetsContrast(primaryHex, bgHex, 3)) {
  primaryHex = pickCalendlyEmbedPrimary(bgHex, [closeBg || '', primaryHex], `#${pal.primary}`);
 }

 return {
  background: colors.background,
  text: hexForCalendlyParam(textHex, pal.text),
  primary: hexForCalendlyParam(primaryHex, pal.primary),
 };
}

export function finalizeCalendlyEmbedColorParams(
 colors: { background: string; text: string; primary: string },
 theme: 'light' | 'dark',
 pal: { background: string; text: string; primary: string }
): { background: string; text: string; primary: string } {
 const bgHex =
  normalizeHexColor(`#${colors.background.replace(/^#/, '')}`) || `#${pal.background}`;
 let textHex =
  normalizeHexColor(`#${colors.text.replace(/^#/, '')}`) || `#${pal.text}`;
 let primaryHex =
  normalizeHexColor(`#${colors.primary.replace(/^#/, '')}`) || `#${pal.primary}`;

 if (theme === 'dark' && !isLightHexColor(bgHex) && !isLightHexColor(textHex)) {
  textHex = pickReadableForeground(bgHex);
 } else if (theme === 'light' && isLightHexColor(bgHex) && !isLightHexColor(textHex)) {
  textHex = pickReadableForeground(bgHex);
 } else if (!meetsContrast(textHex, bgHex, 4.5)) {
  textHex = pickReadableForeground(bgHex);
 }

 if (!meetsContrast(primaryHex, bgHex, 3)) {
  primaryHex = pickCalendlyEmbedPrimary(bgHex, [primaryHex], `#${pal.primary}`);
 }

 return {
  background: hexForCalendlyParam(bgHex, pal.background),
  text: hexForCalendlyParam(textHex, pal.text),
  primary: hexForCalendlyParam(primaryHex, pal.primary),
 };
}

function finalizeAndSyncCalendlyEmbedColors(
 colors: { background: string; text: string; primary: string },
 pathname: string,
 theme: 'light' | 'dark',
 pal: { background: string; text: string; primary: string }
): { background: string; text: string; primary: string } {
 return syncCalendlyEmbedColorsWithCloseButton(
  finalizeCalendlyEmbedColorParams(colors, theme, pal),
  pathname,
  theme,
  pal
 );
}

function resolveCalendlyEmbedColors(opts: CalendlyEmbedColorOpts): {
 background: string;
 text: string;
 primary: string;
} {
 const theme = opts.theme;
 const pal = CALENDLY_EMBED_BRAND[theme];
 const pathname = opts.pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');

 const snapchat = getSnapchatPortalCalendlyTheme(pathname, theme);
 if (snapchat) {
  return {
   background: snapchat.embedBackground,
   text: snapchat.embedText,
   primary: snapchat.embedPrimary,
  };
 }

 const surface =
  opts.surface ?? (isCalendlyEnrollmentSurfacePath(pathname) ? 'enrollment' : 'default');
 const portal =
  opts.portalPalette ??
  getEffectivePortalCalendlyPalette(pathname, theme);
 const site = getCalendlySitePalette();
 const routeAccent = getCalendlyRouteAccentColor(pathname);
 const accent = normalizeHexColor(routeAccent || getActiveBrandAccentColor());
 const accentParam = accent?.slice(1) ?? pal.primary;

 if (surface === 'enrollment') {
  const marketing = isWebsiteMarketingOnlyCalendlyPath(pathname)
    ? readWebsiteMarketingCalendlySurface(theme)
    : null;
  const enrollmentBg =
    marketing?.surface ?? site?.card ?? (theme === 'dark' ? '0f172a' : 'ffffff');
  return finalizeAndSyncCalendlyEmbedColors(
   {
    background: hexForCalendlyParam(enrollmentBg, pal.background),
    text: hexForCalendlyParam(site?.text ?? '', pal.text),
    primary: accentParam,
   },
   pathname,
   theme,
   pal
  );
 }

 if (portal) {
  return finalizeAndSyncCalendlyEmbedColors(
   resolvePortalCalendlyEmbedColors(portal, pathname, pal, theme),
   pathname,
   theme,
   pal
  );
 }

 if (site) {
  const embedBg = harmonizeEmbedBackgroundForMode(
   [site.card, site.background, `#${pal.background}`],
   theme,
   pal.background
  );
  const embedText = pickCalendlyEmbedText(embedBg, site.text, `#${pal.text}`);
  const embedPrimary = pickCalendlyEmbedPrimary(
   embedBg,
   [routeAccent, getActiveBrandAccentColor(), ...collectBrandAccentCandidates()],
   `#${accentParam}`
  );
  return finalizeAndSyncCalendlyEmbedColors(
   {
    background: hexForCalendlyParam(embedBg, pal.background),
    text: hexForCalendlyParam(embedText, pal.text),
    primary: hexForCalendlyParam(embedPrimary, accentParam),
   },
   pathname,
   theme,
   pal
  );
 }

 return finalizeAndSyncCalendlyEmbedColors(
  {
   background: pal.background,
   text: pal.text,
   primary: accentParam,
  },
  pathname,
  theme,
  pal
 );
}

/** Resolved Calendly iframe query colors for a route (marketing site and `/go/*` slugs). */
export function resolveCalendlyEmbedColorsForPath(
 pathname: string,
 theme: 'light' | 'dark',
 opts: Omit<CalendlyEmbedColorOpts, 'theme' | 'pathname'> = {}
): { background: string; text: string; primary: string } {
 return resolveCalendlyEmbedColors({ theme, pathname, ...opts });
}

/** Strip quotes and allow only calendly.com scheduling URLs. */
export function sanitizeCalendlySchedulingUrl(raw: string): string {
 return assertCalendlySchedulingUrl(raw) ?? '';
}

type CalendlyThemedEmbedOpts = {
 host: string;
 name?: string;
 email?: string;
 theme?: 'dark' | 'light';
 /** Hide Calendly event banner / GDPR chrome for a tighter inline flow. */
 minimalChrome?: boolean;
 /** Match marketing enrollment card surfaces. */
 surface?: 'default' | 'enrollment';
 iframe?: boolean;
};

function buildCalendlyThemedSchedulingUrl(base: string, opts: CalendlyThemedEmbedOpts): string {
 const cleaned = sanitizeCalendlySchedulingUrl(base);
 if (!cleaned) return '';
 try {
  const u = new URL(cleaned);
  if (opts.iframe) {
   u.searchParams.set('embed_domain', opts.host);
   u.searchParams.set('embed_type', 'Inline');
  }
  if (opts.name?.trim()) u.searchParams.set('name', opts.name.trim());
  if (opts.email?.trim()) u.searchParams.set('email', opts.email.trim());
  if (opts.minimalChrome) {
   u.searchParams.set('hide_event_type_details', '1');
   u.searchParams.set('hide_landing_page_details', '1');
   u.searchParams.set('hide_gdpr_banner', '1');
  }
  const theme = opts.theme ?? getCalendlySurfaceMode();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : undefined;
  const colors = resolveCalendlyEmbedColors({
   theme,
   surface: opts.surface,
   pathname,
  });
  u.searchParams.set('background_color', colors.background);
  u.searchParams.set('text_color', colors.text);
  u.searchParams.set('primary_color', colors.primary);
  return u.toString();
 } catch {
  return cleaned;
 }
}

/** Build Calendly `<iframe src>` embed URL: `embed_domain`, `embed_type=Inline`, theme + optional prefill. */
export function buildCalendlyIframeEmbedUrl(
 base: string,
 opts: Omit<CalendlyThemedEmbedOpts, 'iframe'>
): string {
 return buildCalendlyThemedSchedulingUrl(base, { ...opts, iframe: true });
}

/** Build URL for Calendly `initInlineWidget` (official inline embed). */
export function buildCalendlyInlineWidgetUrl(
 base: string,
 opts: Omit<CalendlyThemedEmbedOpts, 'iframe' | 'name' | 'email'>
): string {
 return buildCalendlyThemedSchedulingUrl(base, { ...opts, iframe: false });
}

/**
 * Calendly `initPopupWidget({ url })`: same theme tokens as inline embed, no `embed_type=Inline`
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
  pathname?: string;
  surface?: 'default' | 'enrollment';
  portalPalette?: PortalCalendlyPalette | null;
 }
): string {
 const cleaned = sanitizeCalendlySchedulingUrl(base);
 if (!cleaned) return '';
 try {
  const u = new URL(cleaned);
  u.searchParams.set('embed_domain', opts.host);
  const theme = opts.theme ?? getCalendlySurfaceMode();
  const colors = resolveCalendlyEmbedColors({
   theme,
   pathname: opts.pathname,
   surface: opts.surface,
   portalPalette: opts.portalPalette,
  });
  u.searchParams.set('background_color', colors.background);
  u.searchParams.set('text_color', colors.text);
  u.searchParams.set('primary_color', colors.primary);
  applyCalendlyUtm(u, opts.utm);
  return u.toString();
 } catch {
  return cleaned;
 }
}

/** Re-apply iframe + overlay colors from the current page theme (guards unthemed widget URLs). */
export function rethemeCalendlyWidgetUrl(
 rawUrl: string,
 opts?: {
  theme?: 'dark' | 'light';
  pathname?: string;
  portalPalette?: PortalCalendlyPalette | null;
  surface?: 'default' | 'enrollment';
 }
): string {
 const cleaned = sanitizeCalendlySchedulingUrl(rawUrl);
 if (!cleaned || typeof window === 'undefined') return rawUrl;
 try {
  const u = new URL(cleaned);
  const theme = opts?.theme ?? getCalendlySurfaceMode();
  const pathname = opts?.pathname ?? window.location.pathname;
  const portalPalette =
   opts?.portalPalette ?? getEffectivePortalCalendlyPalette(pathname, theme);
  const colors = resolveCalendlyEmbedColors({
   theme,
   pathname,
   surface: opts?.surface,
   portalPalette,
  });
  u.searchParams.set('background_color', colors.background);
  u.searchParams.set('text_color', colors.text);
  u.searchParams.set('primary_color', colors.primary);
  return u.toString();
 } catch {
  return rawUrl;
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
 * Public scheduling URL per legacy engagement service id.
 * Maps to website manifest events; env overrides still supported.
 */
export function getCalendlySchedulingUrlForService(serviceId: string): string {
 const tier = ENGAGEMENT_SERVICE_TO_WEBSITE_TIER[serviceId];
 if (!tier) return '';

 const manifestDefault = getWebsiteCalendlyUrl(tier);

 if (serviceId === 'guide-download') {
  return resolveCalendlySchedulingUrl(process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL, manifestDefault);
 }
 if (serviceId === 'project-review') {
  return resolveCalendlySchedulingUrl(
   process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL_PROJECT_REVIEW,
   manifestDefault,
  );
 }
 if (serviceId === 'strategy-advisory') {
  return resolveCalendlySchedulingUrl(
   process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL_STRATEGY_ADVISORY,
   manifestDefault,
  );
 }
 if (serviceId === 'consulting') {
  return resolveCalendlySchedulingUrl(
   process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL_PREMIUM_CONSULTING,
   manifestDefault,
  );
 }
 return manifestDefault;
}

/** Home hero + bottom-bar consultation popup (live talk-to-mentor). */
export function getWebsiteHeroConsultationCalendlyUrl(): string {
  return getWebsiteCalendlyUrl('hero');
}