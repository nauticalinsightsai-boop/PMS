import {
 buildCalendlyPopupWidgetUrl,
 getCalendlyEmbedTheme,
 isGoPortalCalendlyPath,
 platformPortalThemeToCalendlyPalette,
 rethemeCalendlyWidgetUrl,
 resolveCalendlyPaletteForPage,
 type CalendlyPortalPalette,
 type CalendlyUtmParams,
} from '@/lib/calendly/embed-url';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';
import { getWebsiteCalendlyUrl } from '@/lib/calendly/website-events';
import { attachCalendlyPopupEnhancements } from '@/lib/calendly/popup-enhancements';
import { trackBookingClick } from '@/lib/analytics/track-booking-click';
import type { BookingType } from '@/lib/analytics/pms-events';
import { beginCalendlySession } from '@/lib/conversion-recovery/calendly-bridge';
import { markIntent } from '@/lib/conversion-recovery/engagement-score';

type CalendlyGlobal = {
 initPopupWidget: (opts: { url: string }) => void;
 initInlineWidget?: (opts: { url: string; parentElement: HTMLElement }) => void;
 closePopupWidget?: () => void;
 __sh3ikhPatched?: boolean;
};

declare global {
 interface Window {
  Calendly?: CalendlyGlobal;
 }
}

let calendlyScriptPromise: Promise<void> | null = null;

function isCalendlySchedulingUrl(rawUrl: string): boolean {
 try {
  const parsed = new URL(rawUrl);
  return /(^|\.)calendly\.com$/i.test(parsed.hostname);
 } catch {
  return false;
 }
}

function openCalendlyFallbackUrl(url: string): void {
 const popup = window.open(url, '_blank', 'noopener,noreferrer');
 if (popup) return;

 // Popup blockers frequently reject async `window.open`.
 // Same-tab navigation guarantees the booking page still opens.
 window.location.assign(url);
}

function ensureCalendlyWidgetCss(): void {
 if (typeof document === 'undefined') return;
 if (document.querySelector('link[data-calendly-widget-css="true"]')) return;
 const link = document.createElement('link');
 link.rel = 'stylesheet';
 link.href = 'https://assets.calendly.com/assets/external/widget.css';
 link.dataset.calendlyWidgetCss = 'true';
 document.head.appendChild(link);
}

function isCalendlyWidgetReady(): boolean {
 return Boolean(window.Calendly?.initPopupWidget || window.Calendly?.initInlineWidget);
}

function patchCalendlyInitPopupWidget(): void {
 if (!window.Calendly?.initPopupWidget || window.Calendly.__sh3ikhPatched) return;
 const original = window.Calendly.initPopupWidget.bind(window.Calendly);
 window.Calendly.initPopupWidget = (opts) => {
  const url = rethemeCalendlyWidgetUrl(opts.url);
  attachCalendlyPopupEnhancements();
  original({ ...opts, url });
  attachCalendlyPopupEnhancements();
 };
 window.Calendly.__sh3ikhPatched = true;
}

function ensureCalendlyWidgetReadyAndPatched(): void {
 if (isCalendlyWidgetReady()) {
  patchCalendlyInitPopupWidget();
 }
}

/**
 * Load Calendly widget.js (popup + inline). Handles cached scripts where `load` may not fire.
 */
export function loadCalendlyWidget(): Promise<void> {
 if (typeof window === 'undefined') return Promise.resolve();
 if (isCalendlyWidgetReady()) {
  ensureCalendlyWidgetReadyAndPatched();
  return Promise.resolve();
 }
 if (calendlyScriptPromise) return calendlyScriptPromise;

 ensureCalendlyWidgetCss();

 calendlyScriptPromise = new Promise<void>((resolve, reject) => {
  let done = false;
  /** DOM returns `number`; Node typings use `NodeJS.Timeout`: union satisfies both. */
  const timers: {
    pollId?: number | NodeJS.Timeout;
    timeoutId?: number | NodeJS.Timeout;
  } = {};

  const finish = (ok: boolean, err?: Error) => {
   if (done) return;
   if (isCalendlyWidgetReady()) ok = true;
   if (!ok && !err) err = new Error('Calendly widget unavailable');
   done = true;
   if (timers.pollId !== undefined) window.clearInterval(timers.pollId);
   if (timers.timeoutId !== undefined) window.clearTimeout(timers.timeoutId);
   if (ok) resolve();
   else reject(err);
  };

  const check = () => {
   if (isCalendlyWidgetReady()) {
    ensureCalendlyWidgetReadyAndPatched();
    finish(true);
   }
  };

  check();
  timers.pollId = window.setInterval(check, 50);
  timers.timeoutId = window.setTimeout(() => finish(false, new Error('Calendly widget timeout')), 12000);

  const existing =
   document.querySelector<HTMLScriptElement>('script[data-calendly-widget="true"]') ||
   document.querySelector<HTMLScriptElement>('script[src*="assets.calendly.com/assets/external/widget.js"]');

  if (existing) {
   existing.addEventListener('load', check, { once: true });
   existing.addEventListener(
    'error',
    () => finish(false, new Error('Calendly widget failed to load')),
    { once: true }
   );
   return;
  }

  const script = document.createElement('script');
  script.src = 'https://assets.calendly.com/assets/external/widget.js';
  script.async = true;
  script.dataset.calendlyWidget = 'true';
  script.onload = () => {
   script.dataset.loaded = 'true';
   check();
  };
  script.onerror = () => finish(false, new Error('Calendly widget failed to load'));
  document.head.appendChild(script);
 }).finally(() => {
  calendlyScriptPromise = null;
 });

 return calendlyScriptPromise;
}

/** @deprecated Use {@link loadCalendlyWidget} */
export const loadCalendlyPopupWidget = loadCalendlyWidget;

/** Preload widget script (optional) so first click opens faster. */
export function preloadCalendlyPopupWidget(): void {
 void loadCalendlyWidget();
}

function inferCalendlyBookingType(funnelLabel?: string, url?: string): BookingType {
  const hay = `${funnelLabel ?? ''} ${url ?? ''}`.toLowerCase();
  if (hay.includes('pathway') || hay.includes('roadmap') || hay.includes('onboarding')) return 'roadmap_call';
  if (hay.includes('corporate') || hay.includes('channel') || hay.includes('portal') || hay.includes('bottom_bar')) {
    return hay.includes('mentor') || hay.includes('discovery') ? 'mentor_call' : 'corporate_call';
  }
  if (hay.includes('mentor') || hay.includes('discovery') || hay.includes('executive')) return 'mentor_call';
  return 'unknown';
}

function isPmpFunnelLabel(funnelLabel?: string): boolean {
  if (!funnelLabel) return false;
  const lower = funnelLabel.toLowerCase();
  return lower.includes('pathway:pmp') || lower.includes('pmp') || lower.includes('roadmap');
}

/**
 * Open Calendly popup with app light/dark embed colors + shared close/backdrop UX.
 */
export async function openCalendlyThemedPopup(
 rawSchedulingUrl: string,
 opts?: {
  utm?: CalendlyUtmParams;
  funnelLabel?: string;
  theme?: 'dark' | 'light';
  portalTheme?: PlatformPortalTheme;
  portalPalette?: CalendlyPortalPalette;
 }
): Promise<void> {
 const trimmed = rawSchedulingUrl?.trim() || getWebsiteCalendlyUrl('discovery');
 if (!trimmed || typeof window === 'undefined') return;
 if (!isCalendlySchedulingUrl(trimmed)) {
  console.warn('[calendly] Ignoring non-Calendly scheduling URL:', trimmed);
  openCalendlyFallbackUrl(getWebsiteCalendlyUrl('discovery'));
  return;
 }

 const colorMode = opts?.theme ?? getCalendlyEmbedTheme();
 const pathname = window.location.pathname;
 const portalPalette: CalendlyPortalPalette | null | undefined =
  opts?.portalPalette ??
  (opts?.portalTheme
   ? platformPortalThemeToCalendlyPalette(opts.portalTheme)
   : isGoPortalCalendlyPath(pathname)
     ? resolveCalendlyPaletteForPage(pathname, colorMode)
     : undefined);

 const themedPopupUrl = buildCalendlyPopupWidgetUrl(trimmed, {
  host: window.location.host,
  theme: colorMode,
  utm: opts?.utm,
  pathname,
  portalPalette,
 });

 trackBookingClick({
  bookingType: inferCalendlyBookingType(opts?.funnelLabel, trimmed),
  destination: 'calendly',
  ctaText: opts?.funnelLabel,
  includePmpOffer: isPmpFunnelLabel(opts?.funnelLabel),
 });

 markIntent();

 const funnelLabel = opts?.funnelLabel;
 let siteCertId: string | undefined;
 let tierId: string | undefined;
 if (funnelLabel?.startsWith('pathway:')) {
  const parts = funnelLabel.split(':');
  siteCertId = parts[1];
  tierId = parts[2];
 }
 beginCalendlySession({ funnelLabel, siteCertId, tierId });

 try {
  await loadCalendlyWidget();
  ensureCalendlyWidgetReadyAndPatched();
  if (window.Calendly?.initPopupWidget) {
   attachCalendlyPopupEnhancements();
   window.Calendly.initPopupWidget({ url: themedPopupUrl });
   attachCalendlyPopupEnhancements();
   return;
  }
  openCalendlyFallbackUrl(themedPopupUrl);
 } catch (error) {
  console.error('Unable to load Calendly popup widget:', error);
  openCalendlyFallbackUrl(themedPopupUrl);
 }
}