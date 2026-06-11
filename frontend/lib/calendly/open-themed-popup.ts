import {
 buildCalendlyPopupWidgetUrl,
 getCalendlyEmbedTheme,
 type CalendlyUtmParams,
} from '@/lib/calendly/embed-url';
import { getWebsiteCalendlyUrl } from '@/lib/calendly/website-events';
import { attachCalendlyPopupEnhancements } from '@/lib/calendly/popup-enhancements';
import { FUNNEL_EVENTS, trackFunnelEvent } from '@/lib/analytics/funnel';
import { beginCalendlySession } from '@/lib/conversion-recovery/calendly-bridge';
import { markIntent } from '@/lib/conversion-recovery/engagement-score';

type CalendlyGlobal = {
 initPopupWidget: (opts: { url: string }) => void;
 initInlineWidget?: (opts: { url: string; parentElement: HTMLElement }) => void;
 closePopupWidget?: () => void;
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

/**
 * Load Calendly widget.js (popup + inline). Handles cached scripts where `load` may not fire.
 */
export function loadCalendlyWidget(): Promise<void> {
 if (typeof window === 'undefined') return Promise.resolve();
 if (isCalendlyWidgetReady()) return Promise.resolve();
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
   if (isCalendlyWidgetReady()) finish(true);
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

/**
 * Open Calendly popup with app light/dark embed colors + shared close/backdrop UX.
 */
export async function openCalendlyThemedPopup(
 rawSchedulingUrl: string,
 opts?: { utm?: CalendlyUtmParams; funnelLabel?: string }
): Promise<void> {
 const trimmed = rawSchedulingUrl?.trim() || getWebsiteCalendlyUrl('hero');
 if (!trimmed || typeof window === 'undefined') return;
 if (!isCalendlySchedulingUrl(trimmed)) {
  console.warn('[calendly] Ignoring non-Calendly scheduling URL:', trimmed);
  openCalendlyFallbackUrl(getWebsiteCalendlyUrl('hero'));
  return;
 }

 const themedPopupUrl = buildCalendlyPopupWidgetUrl(trimmed, {
  host: window.location.host,
  theme: getCalendlyEmbedTheme(),
  utm: opts?.utm,
 });

 trackFunnelEvent(FUNNEL_EVENTS.CTA_CLICK, {
  cta_type: 'calendly_popup',
  link_url: trimmed,
  funnel_stage: 'interest',
  ...(opts?.funnelLabel ? { label: opts.funnelLabel } : {}),
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
  if (window.Calendly?.initPopupWidget) {
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