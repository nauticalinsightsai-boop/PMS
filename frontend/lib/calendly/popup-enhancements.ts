import {
 getCalendlyPopupThemeTokens,
} from '@/lib/calendly/embed-url';
import { notifyCalendlyClosed } from '@/lib/conversion-recovery/calendly-bridge';

/**
 * Calendly's default popup close control can be hard to see (asset URL is relative to the host).
 * Ensures backdrop click and a visible × close the widget via Calendly's API.
 */
const CLOSE_BTN_SIZE = 44;
const IFRAME_SCROLLBAR_GUTTER_PX = 10;
const HIDDEN_SCROLLBAR_CLASS = 'sh3ikh-calendly-scroll-host';
const HIDDEN_SCROLLBAR_STYLE_ID = 'sh3ikh-calendly-hidden-scrollbar-style';
const CALENDLY_OVERLAY_THEME_CLASS = 'sh3ikh-calendly-overlay';
const CALENDLY_SCRIM_VAR = '--sh3ikh-calendly-scrim';

type StyleSnapshot = {
 value: string;
 priority: string;
};

function snapshotStyle(el: HTMLElement, property: string): StyleSnapshot {
 return {
  value: el.style.getPropertyValue(property),
  priority: el.style.getPropertyPriority(property),
 };
}

function restoreStyle(el: HTMLElement, property: string, snapshot: StyleSnapshot): void {
 if (snapshot.value) {
  el.style.setProperty(property, snapshot.value, snapshot.priority);
 } else {
  el.style.removeProperty(property);
 }
}

function closeCalendlyPopup(): void {
 window.Calendly?.closePopupWidget?.();
}

function ensureHiddenScrollbarStyles(): void {
 if (typeof document === 'undefined') return;
 if (document.getElementById(HIDDEN_SCROLLBAR_STYLE_ID)) return;

 const style = document.createElement('style');
 style.id = HIDDEN_SCROLLBAR_STYLE_ID;
 style.textContent = `
  .${HIDDEN_SCROLLBAR_CLASS} {
   scrollbar-width: none;
   -ms-overflow-style: none;
  }
  .${HIDDEN_SCROLLBAR_CLASS}::-webkit-scrollbar {
   width: 0 !important;
   height: 0 !important;
   display: none !important;
  }
  /* Calendly host shell: hide scrollbars on the panel wrapping the iframe (not inside cross-origin iframe). */
  .calendly-overlay .calendly-popup-content {
   scrollbar-width: none !important;
   -ms-overflow-style: none !important;
  }
  .calendly-overlay .calendly-popup-content::-webkit-scrollbar {
   width: 0 !important;
   height: 0 !important;
   display: none !important;
  }
  .calendly-overlay .calendly-popup,
  .calendly-overlay .calendly-popup-content {
   border: 0 !important;
   outline: 0 !important;
   box-shadow: none !important;
  }
  .calendly-overlay {
   z-index: 2147483645 !important;
  }
  /*
   * Scrim via ::before — never set background-color on .calendly-overlay inline.
   * Calendly copies overlay inline bg onto .calendly-close-overlay, doubling the dim layer
   * and washing out iframe text in dark mode.
   */
  .calendly-overlay.${CALENDLY_OVERLAY_THEME_CLASS} {
   background: transparent !important;
   background-color: transparent !important;
   display: flex !important;
   align-items: center !important;
   justify-content: center !important;
   padding: 1rem !important;
   box-sizing: border-box !important;
  }
  .calendly-overlay.${CALENDLY_OVERLAY_THEME_CLASS}::before {
   content: '';
   position: fixed;
   inset: 0;
   z-index: 0;
   background: var(${CALENDLY_SCRIM_VAR}, rgba(0, 0, 0, 0.65));
   pointer-events: none;
  }
  .calendly-overlay.${CALENDLY_OVERLAY_THEME_CLASS} .calendly-close-overlay,
  .calendly-overlay .calendly-close-overlay {
   display: none !important;
   opacity: 0 !important;
   visibility: hidden !important;
   pointer-events: none !important;
   background: none !important;
   background-color: transparent !important;
  }
  /* Hide Calendly native close icon; custom close button is injected by this module. */
  .calendly-overlay.${CALENDLY_OVERLAY_THEME_CLASS} .calendly-popup,
  .calendly-overlay .calendly-popup {
   z-index: 2 !important;
   position: relative !important;
   top: auto !important;
   left: auto !important;
   right: auto !important;
   bottom: auto !important;
   transform: none !important;
   margin: 0 !important;
   flex-shrink: 0 !important;
  }
  /* Hide Calendly native close icon; custom close button is injected by this module. */
  .calendly-overlay .calendly-popup-close {
   display: none !important;
   opacity: 0 !important;
   pointer-events: none !important;
  }
 `;
 document.head.appendChild(style);
}

/** Inject Calendly popup host overrides early (portal pages preload on mount). */
export function preloadCalendlyPopupHostStyles(): void {
 ensureHiddenScrollbarStyles();
}

function enforceOuterScrollLock(overlay: HTMLElement): void {
 const html = document.documentElement;
 const body = document.body;

 html.style.setProperty('overflow', 'hidden', 'important');
 html.style.setProperty('overflow-x', 'hidden', 'important');
 html.style.setProperty('overflow-y', 'hidden', 'important');
 html.style.setProperty('overscroll-behavior', 'none', 'important');
 html.style.setProperty('height', '100%', 'important');

 body.style.setProperty('overflow', 'hidden', 'important');
 body.style.setProperty('overflow-x', 'hidden', 'important');
 body.style.setProperty('overflow-y', 'hidden', 'important');
 body.style.setProperty('overscroll-behavior', 'none', 'important');
 body.style.setProperty('height', '100%', 'important');

 overlay.style.setProperty('position', 'fixed', 'important');
 overlay.style.setProperty('z-index', '2147483645', 'important');
 overlay.style.setProperty('inset', '0', 'important');
 overlay.style.setProperty('overflow', 'hidden', 'important');
 overlay.style.setProperty('overflow-x', 'hidden', 'important');
 overlay.style.setProperty('overflow-y', 'hidden', 'important');
 overlay.style.setProperty('overscroll-behavior', 'contain', 'important');
 overlay.style.setProperty('height', '100dvh', 'important');
 overlay.style.setProperty('display', 'flex', 'important');
 overlay.style.setProperty('align-items', 'center', 'important');
 overlay.style.setProperty('justify-content', 'center', 'important');
 overlay.style.setProperty('padding', '1rem', 'important');
 overlay.style.setProperty('box-sizing', 'border-box', 'important');
}

function findPopupScrollContainer(popup: HTMLElement): HTMLElement | null {
 const selectors = [
  '.calendly-popup-content',
  '.calendly-popup-content > div',
  '.calendly-inline-widget',
  '[data-container="booking-flow"]',
  '[data-container="event-form"]',
  '[role="main"]',
 ];

 for (const selector of selectors) {
  const node = popup.querySelector<HTMLElement>(selector);
  if (node && node !== popup) return node;
 }

 const iframe = popup.querySelector<HTMLIFrameElement>('iframe');
 if (iframe?.parentElement && iframe.parentElement instanceof HTMLElement) {
  return iframe.parentElement;
 }

 return null;
}

/** Calendly paints this layer from embed background_color; remove it — overlay handles backdrop clicks. */
function neutralizeCloseOverlayLayer(el: HTMLElement): void {
 el.dataset.sh3ikhCalendlyScrimNeutralized = 'true';
 el.style.setProperty('display', 'none', 'important');
 el.style.setProperty('opacity', '0', 'important');
 el.style.setProperty('visibility', 'hidden', 'important');
 el.style.setProperty('background-color', 'transparent', 'important');
 el.style.setProperty('background', 'none', 'important');
 el.style.setProperty('pointer-events', 'none', 'important');
 if (el.isConnected) {
  el.remove();
 }
}

function bindCloseOverlayScrimGuard(overlay: HTMLElement): () => void {
 const observers: MutationObserver[] = [];
 let rafId = 0;

 const scrubCloseOverlays = () => {
  overlay.querySelectorAll<HTMLElement>('.calendly-close-overlay').forEach(neutralizeCloseOverlayLayer);
 };

 const watchCloseOverlay = (el: HTMLElement) => {
  if (el.dataset.sh3ikhCalendlyCloseOverlayGuard === 'true') return;
  el.dataset.sh3ikhCalendlyCloseOverlayGuard = 'true';
  neutralizeCloseOverlayLayer(el);
  const mo = new MutationObserver(() => neutralizeCloseOverlayLayer(el));
  mo.observe(el, { attributes: true, attributeFilter: ['style'] });
  observers.push(mo);
 };

 const tick = () => {
  if (!document.body.contains(overlay)) return;
  scrubCloseOverlays();
  rafId = window.requestAnimationFrame(tick);
 };

 overlay.querySelectorAll<HTMLElement>('.calendly-close-overlay').forEach(watchCloseOverlay);

 const rootMo = new MutationObserver(() => {
  overlay.querySelectorAll<HTMLElement>('.calendly-close-overlay').forEach(watchCloseOverlay);
  scrubCloseOverlays();
 });
 rootMo.observe(overlay, { childList: true, subtree: true });
 observers.push(rootMo);

 rafId = window.requestAnimationFrame(tick);

 return () => {
  window.cancelAnimationFrame(rafId);
  observers.forEach((mo) => mo.disconnect());
 };
}

function applyOverlayBackdropTheme(overlay: HTMLElement, scrim: string): void {
 overlay.classList.add(CALENDLY_OVERLAY_THEME_CLASS);
 overlay.style.setProperty(CALENDLY_SCRIM_VAR, scrim);
 overlay.style.setProperty('background-color', 'transparent', 'important');
 overlay.style.setProperty('background', 'transparent', 'important');
 overlay.querySelectorAll<HTMLElement>('.calendly-close-overlay').forEach(neutralizeCloseOverlayLayer);
}

function applyCloseButtonTheme(
 btn: HTMLButtonElement,
 popupTheme: ReturnType<typeof getCalendlyPopupThemeTokens>,
 backgroundColor = popupTheme.closeBg,
): void {
 btn.style.border = `1px solid ${popupTheme.closeBorder}`;
 btn.style.backgroundColor = backgroundColor;
 btn.style.color = popupTheme.closeFg;
 btn.style.boxShadow = popupTheme.closeShadow;
}

function enforcePopupContainment(overlay: HTMLElement): void {
 const popup = overlay.querySelector<HTMLElement>('.calendly-popup');
 if (!popup) return;
 ensureHiddenScrollbarStyles();

 const popupContent = overlay.querySelector<HTMLElement>('.calendly-popup-content');

 popup.style.setProperty('box-sizing', 'border-box', 'important');
 popup.style.setProperty('margin', '0', 'important');
 popup.style.setProperty('position', 'relative', 'important');
 popup.style.setProperty('top', 'auto', 'important');
 popup.style.setProperty('left', 'auto', 'important');
 popup.style.setProperty('right', 'auto', 'important');
 popup.style.setProperty('bottom', 'auto', 'important');
 popup.style.setProperty('transform', 'none', 'important');
 popup.style.setProperty('max-width', 'calc(100vw - 2rem)', 'important');
 /**
  * Keep Calendly shell close to the actual booking content width
  * (reduces side gutters seen around the panel in desktop light/dark).
  */
 popup.style.setProperty('width', 'min(680px, calc(100vw - 2rem))', 'important');
 popup.style.setProperty('max-height', 'min(720px, calc(100dvh - 2rem))', 'important');
 popup.style.setProperty('height', 'min(720px, calc(100dvh - 2rem))', 'important');
 popup.style.setProperty('display', 'flex', 'important');
 popup.style.setProperty('flex-direction', 'column', 'important');
 popup.style.setProperty('min-height', '0', 'important');
 popup.style.setProperty('overflow-x', 'hidden', 'important');
 popup.style.setProperty('overflow-y', 'hidden', 'important');
 popup.style.setProperty('overflow', 'hidden', 'important');
 popup.style.setProperty('overscroll-behavior', 'contain', 'important');
 /**
  * Keep only Calendly's inner card visible; remove host shell visuals.
  */
 popup.style.setProperty('background', 'transparent', 'important');
 popup.style.setProperty('border', '0', 'important');
 popup.style.setProperty('box-shadow', 'none', 'important');

 if (popupContent) {
  popupContent.style.setProperty('padding', '0', 'important');
  popupContent.style.setProperty('margin', '0', 'important');
  popupContent.style.setProperty('background', 'transparent', 'important');
  popupContent.style.setProperty('border', '0', 'important');
  popupContent.style.setProperty('box-shadow', 'none', 'important');
 }

 const scrollContainer = findPopupScrollContainer(popup);
 if (scrollContainer) {
  scrollContainer.classList.add(HIDDEN_SCROLLBAR_CLASS);
  scrollContainer.style.setProperty('flex', '1 1 auto', 'important');
  scrollContainer.style.setProperty('min-height', '0', 'important');
  scrollContainer.style.setProperty('max-height', '100%', 'important');
  /* Host scroll surface duplicates the iframe’s own scrollbar: keep layout, drop outer bar. */
  scrollContainer.style.setProperty('overflow-y', 'hidden', 'important');
  scrollContainer.style.setProperty('overflow-x', 'hidden', 'important');
  scrollContainer.style.setProperty('overscroll-behavior', 'contain', 'important');
 }

 popup.querySelectorAll<HTMLElement>('iframe').forEach((iframe) => {
  /**
   * Calendly renders the booking flow in a cross-origin iframe, so host CSS
   * cannot directly style its native scrollbar. Clip the iframe's right gutter
   * and compensate width so content layout remains unchanged while the bar is hidden.
   */
  iframe.style.setProperty(
   'width',
   `calc(100% + ${IFRAME_SCROLLBAR_GUTTER_PX}px)`,
   'important'
  );
  iframe.style.setProperty('max-width', 'none', 'important');
  iframe.style.setProperty('height', '100%', 'important');
  iframe.style.setProperty('display', 'block', 'important');
  iframe.style.setProperty('min-height', '0', 'important');
  iframe.style.setProperty('background', 'transparent', 'important');
  iframe.style.setProperty('border', '0', 'important');
  iframe.style.setProperty('outline', 'none', 'important');
  iframe.style.setProperty('box-shadow', 'none', 'important');
  iframe.style.removeProperty('margin-right');
  iframe.style.setProperty('transform', `translateX(${Math.round(IFRAME_SCROLLBAR_GUTTER_PX / 2)}px)`, 'important');
  iframe.style.removeProperty('clip-path');
 });
}

function bindOverlay(overlay: HTMLElement): void {
 if (overlay.dataset.sh3ikhCalendlyUi === 'true') return;
 overlay.dataset.sh3ikhCalendlyUi = 'true';

 const readPopupTheme = () => getCalendlyPopupThemeTokens(window.location.pathname);
 let popupTheme = readPopupTheme();

 const html = document.documentElement;
 const body = document.body;

 const trackedStyles: Array<{ el: HTMLElement; property: string; snapshot: StyleSnapshot }> = [
  { el: overlay, property: 'background-color', snapshot: snapshotStyle(overlay, 'background-color') },
  { el: overlay, property: 'background', snapshot: snapshotStyle(overlay, 'background') },
  { el: overlay, property: CALENDLY_SCRIM_VAR, snapshot: snapshotStyle(overlay, CALENDLY_SCRIM_VAR) },
  { el: overlay, property: 'position', snapshot: snapshotStyle(overlay, 'position') },
  { el: overlay, property: 'inset', snapshot: snapshotStyle(overlay, 'inset') },
  { el: overlay, property: 'overflow', snapshot: snapshotStyle(overlay, 'overflow') },
 { el: overlay, property: 'overflow-x', snapshot: snapshotStyle(overlay, 'overflow-x') },
 { el: overlay, property: 'overflow-y', snapshot: snapshotStyle(overlay, 'overflow-y') },
  { el: overlay, property: 'overscroll-behavior', snapshot: snapshotStyle(overlay, 'overscroll-behavior') },
  { el: overlay, property: 'height', snapshot: snapshotStyle(overlay, 'height') },
  { el: html, property: 'overflow', snapshot: snapshotStyle(html, 'overflow') },
 { el: html, property: 'overflow-x', snapshot: snapshotStyle(html, 'overflow-x') },
 { el: html, property: 'overflow-y', snapshot: snapshotStyle(html, 'overflow-y') },
  { el: html, property: 'overscroll-behavior', snapshot: snapshotStyle(html, 'overscroll-behavior') },
  { el: html, property: 'height', snapshot: snapshotStyle(html, 'height') },
  { el: body, property: 'overflow', snapshot: snapshotStyle(body, 'overflow') },
 { el: body, property: 'overflow-x', snapshot: snapshotStyle(body, 'overflow-x') },
 { el: body, property: 'overflow-y', snapshot: snapshotStyle(body, 'overflow-y') },
  { el: body, property: 'overscroll-behavior', snapshot: snapshotStyle(body, 'overscroll-behavior') },
  { el: body, property: 'height', snapshot: snapshotStyle(body, 'height') },
 ];

 const btn = document.createElement('button');
 btn.type = 'button';
 btn.setAttribute('aria-label', 'Close scheduling popup');
 btn.dataset.sh3ikhCalendlyClose = 'true';
 /** Fixed on `body` + max z-index: Calendly’s overlay uses `overflow:hidden`, which clips absolutely positioned siblings drawn above the popup. */
 btn.style.cssText = [
  'position:fixed',
  'z-index:2147483646',
  'width:' + CLOSE_BTN_SIZE + 'px',
  'height:' + CLOSE_BTN_SIZE + 'px',
  'border-radius:9999px',
  'font-size:24px',
  'line-height:1',
  'font-weight:300',
  'cursor:pointer',
  'display:flex',
  'align-items:center',
  'justify-content:center',
  'pointer-events:auto',
  'transition:transform 140ms ease, background-color 140ms ease, box-shadow 160ms ease',
  'outline:none',
 ].join(';');
 applyCloseButtonTheme(btn, popupTheme);

 const enforceContainment = () => {
  popupTheme = readPopupTheme();
  applyOverlayBackdropTheme(overlay, popupTheme.overlayScrim);
  applyCloseButtonTheme(btn, popupTheme);
  enforceOuterScrollLock(overlay);
  enforcePopupContainment(overlay);
 };

 const onOverlayClick = (e: MouseEvent) => {
  const target = e.target as Node | null;
  if (!target) return;
  const popup = overlay.querySelector('.calendly-popup');
  if (popup?.contains(target)) return;
  closeCalendlyPopup();
 };
 overlay.addEventListener('click', onOverlayClick);

 const glyph = document.createElement('span');
 glyph.setAttribute('aria-hidden', 'true');
 glyph.textContent = '×';
 glyph.style.marginTop = '-2px';
 btn.appendChild(glyph);

 /** Top-right of the Calendly modal card (inset), viewport coordinates: not above it (avoids overlay clip). */
 const positionCloseBtn = () => {
  const popupEl = overlay.querySelector('.calendly-popup') as HTMLElement | null;
  if (!popupEl) return;
  enforceContainment();
  const pr = popupEl.getBoundingClientRect();
  const inset = 12;
  const top = Math.max(8, pr.top + inset);
  const right = Math.max(8, window.innerWidth - pr.right + inset);
  btn.style.top = `${top}px`;
  btn.style.right = `${right}px`;
  btn.style.left = 'auto';
  btn.style.bottom = 'auto';
 };

 const onBtnClick = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  closeCalendlyPopup();
 };
 const onBtnMouseEnter = () => {
  const theme = readPopupTheme();
  applyCloseButtonTheme(btn, theme, theme.closeHoverBg);
 };
 const onBtnMouseLeave = () => {
  const theme = readPopupTheme();
  applyCloseButtonTheme(btn, theme);
  btn.style.transform = 'translateY(0)';
 };
 const onBtnMouseDown = () => {
  const theme = readPopupTheme();
  applyCloseButtonTheme(btn, theme, theme.closeActiveBg);
  btn.style.transform = 'translateY(0.5px)';
 };
 const onBtnMouseUp = () => {
  const theme = readPopupTheme();
  applyCloseButtonTheme(btn, theme, theme.closeHoverBg);
  btn.style.transform = 'translateY(0)';
 };
 const onBtnFocus = () => {
  const theme = readPopupTheme();
  btn.style.boxShadow = `${theme.closeShadow}, 0 0 0 3px ${theme.closeFocusRing}`;
 };
 const onBtnBlur = () => {
  btn.style.boxShadow = readPopupTheme().closeShadow;
 };
 btn.addEventListener('click', onBtnClick);
 btn.addEventListener('mouseenter', onBtnMouseEnter);
 btn.addEventListener('mouseleave', onBtnMouseLeave);
 btn.addEventListener('mousedown', onBtnMouseDown);
 btn.addEventListener('mouseup', onBtnMouseUp);
 btn.addEventListener('focus', onBtnFocus);
 btn.addEventListener('blur', onBtnBlur);
 document.body.appendChild(btn);
 positionCloseBtn();

 let ro: ResizeObserver | null = null;
 const attachResizeObserver = () => {
  const popupEl = overlay.querySelector('.calendly-popup');
  if (!popupEl || ro) return;
  ro = new ResizeObserver(() => positionCloseBtn());
  ro.observe(popupEl);
 };

 attachResizeObserver();
 enforceContainment();
 const pollPopup = window.setInterval(() => {
  enforceContainment();
  positionCloseBtn();
  const p = overlay.querySelector('.calendly-popup');
  if (p) {
   attachResizeObserver();
   positionCloseBtn();
  }
 }, 80);

 window.addEventListener('resize', positionCloseBtn);
 requestAnimationFrame(() => {
  enforceContainment();
  positionCloseBtn();
  requestAnimationFrame(positionCloseBtn);
 });

 let observerTicking = false;
 const popupContentObserver = new MutationObserver(() => {
  if (observerTicking) return;
  observerTicking = true;
  requestAnimationFrame(() => {
   observerTicking = false;
   enforceContainment();
   positionCloseBtn();
  });
 });
 popupContentObserver.observe(overlay, {
  childList: true,
  subtree: true,
 });

 const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
   e.preventDefault();
   closeCalendlyPopup();
  }
 };
 document.addEventListener('keydown', onKeydown, true);

 const unbindCloseOverlayScrimGuard = bindCloseOverlayScrimGuard(overlay);

 const themeObserver = new MutationObserver(() => {
  enforceContainment();
  positionCloseBtn();
 });
 themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class'],
 });
 const portalRoot = document.querySelector('.portal-root');
 if (portalRoot) {
  themeObserver.observe(portalRoot, {
   attributes: true,
   attributeFilter: ['data-color-mode', 'style'],
  });
  const themeToggle = portalRoot.querySelector('.portal-theme-toggle');
  if (themeToggle) {
   themeObserver.observe(themeToggle, {
    attributes: true,
    subtree: true,
    attributeFilter: ['aria-pressed', 'style'],
   });
  }
 }

 const cleanup = () => {
  window.clearInterval(pollPopup);
  window.removeEventListener('resize', positionCloseBtn);
  overlay.removeEventListener('click', onOverlayClick);
  btn.removeEventListener('click', onBtnClick);
  btn.removeEventListener('mouseenter', onBtnMouseEnter);
  btn.removeEventListener('mouseleave', onBtnMouseLeave);
  btn.removeEventListener('mousedown', onBtnMouseDown);
  btn.removeEventListener('mouseup', onBtnMouseUp);
  btn.removeEventListener('focus', onBtnFocus);
  btn.removeEventListener('blur', onBtnBlur);
  document.removeEventListener('keydown', onKeydown, true);
  themeObserver.disconnect();
  unbindCloseOverlayScrimGuard();
  ro?.disconnect();
  popupContentObserver.disconnect();
  btn.remove();
  overlay.classList.remove(CALENDLY_OVERLAY_THEME_CLASS);
  trackedStyles.forEach(({ el, property, snapshot }) => restoreStyle(el, property, snapshot));
  delete overlay.dataset.sh3ikhCalendlyUi;
  window.setTimeout(() => notifyCalendlyClosed(), 400);
 };

 const mo = new MutationObserver(() => {
  if (!document.body.contains(overlay)) {
   cleanup();
   mo.disconnect();
  }
 });
 mo.observe(document.body, { childList: true, subtree: true });
}

/**
 * Run after `Calendly.initPopupWidget`: overlay mounts asynchronously.
 */
export function attachCalendlyPopupEnhancements(): void {
 if (typeof window === 'undefined' || typeof document === 'undefined') return;

 const existing = document.querySelector<HTMLElement>('.calendly-overlay');
 if (existing) {
  bindOverlay(existing);
  return;
 }

 let attempts = 0;
 const id = window.setInterval(() => {
  attempts += 1;
  const overlay = document.querySelector<HTMLElement>('.calendly-overlay');
  if (overlay) {
   window.clearInterval(id);
   bindOverlay(overlay);
  } else if (attempts > 120) {
   window.clearInterval(id);
  }
 }, 50);
}