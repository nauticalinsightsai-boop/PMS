/**
 * Same-origin proxied Calendly popup host.
 * One card only (no outer chrome shell). Close sits on the card’s top-right,
 * matching Calendly’s own popup — not a second box or a viewport-corner control.
 */
import {
  getCalendlyPopupThemeTokens,
  resolveCalendlyCloseButtonColors,
} from '@/lib/calendly/embed-url';

const OVERLAY_ID = 'pms-calendly-proxy-overlay';

/** Match Calendly’s typical popup proportions (narrow column, tall viewport). */
const PANEL_MAX_WIDTH_PX = 620;
const PANEL_MAX_HEIGHT_PX = 900;
const CLOSE_BTN_SIZE = 44;
const CLOSE_INSET_PX = 12;

export function closeProxiedCalendlyPopup(): void {
  document.getElementById(OVERLAY_ID)?.remove();
  document.documentElement.style.removeProperty('overflow');
}

function extractCalendlyEventUrl(proxyUrl: string): string {
  try {
    return new URL(proxyUrl, window.location.origin).searchParams.get('url') || '';
  } catch {
    return '';
  }
}

async function openOfficialCalendlyPopup(calendlyUrl: string): Promise<void> {
  const { openDirectCalendlyPopupWidget } = await import('@/lib/calendly/open-themed-popup');
  await openDirectCalendlyPopupWidget(calendlyUrl);
}

export function openProxiedCalendlyPopup(proxyUrl: string, pathname?: string): void {
  if (typeof document === 'undefined') return;
  closeProxiedCalendlyPopup();

  const route = pathname ?? window.location.pathname;
  const tokens = getCalendlyPopupThemeTokens(route);
  const closeColors = resolveCalendlyCloseButtonColors(route);
  const calendlyEventUrl = extractCalendlyEventUrl(proxyUrl);

  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Schedule');
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '999999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    boxSizing: 'border-box',
    background: tokens.overlayScrim,
  });

  /**
   * Transparent size host only — Calendly’s own page is the visible card.
   * Border/shadow/surface here created the “extra box” around the iframe.
   */
  const panel = document.createElement('div');
  Object.assign(panel.style, {
    position: 'relative',
    width: `min(100%, ${PANEL_MAX_WIDTH_PX}px)`,
    height: `min(92vh, ${PANEL_MAX_HEIGHT_PX}px)`,
    maxHeight: '92vh',
    borderRadius: '8px',
    overflow: 'hidden',
    background: 'transparent',
    border: '0',
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'column',
  });

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '×';
  Object.assign(closeBtn.style, {
    position: 'absolute',
    top: `${CLOSE_INSET_PX}px`,
    right: `${CLOSE_INSET_PX}px`,
    zIndex: '3',
    width: `${CLOSE_BTN_SIZE}px`,
    height: `${CLOSE_BTN_SIZE}px`,
    borderRadius: '999px',
    border: `1px solid ${closeColors.closeBorder}`,
    background: closeColors.closeBg,
    color: closeColors.closeFg,
    fontSize: '28px',
    lineHeight: '1',
    cursor: 'pointer',
    boxShadow: tokens.closeShadow,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
  });
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeProxiedCalendlyPopup();
  });

  const iframe = document.createElement('iframe');
  iframe.src = proxyUrl;
  iframe.title = 'Calendly scheduling';
  iframe.allow = 'payment *';
  iframe.setAttribute('scrolling', 'yes');
  Object.assign(iframe.style, {
    width: '100%',
    height: '100%',
    flex: '1 1 auto',
    border: '0',
    borderRadius: '8px',
    background: 'transparent',
    overflow: 'auto',
  });

  let fellBack = false;
  let retried = false;
  const fallbackToOfficial = () => {
    if (fellBack || !calendlyEventUrl) return;
    fellBack = true;
    console.warn(
      '[calendly] Proxy unavailable — falling back to official widget (slot/form CSS degraded)',
    );
    closeProxiedCalendlyPopup();
    void openOfficialCalendlyPopup(calendlyEventUrl);
  };

  const retryOrFallback = () => {
    if (fellBack) return;
    if (!retried) {
      retried = true;
      // One proxy retry before official fallback (C8)
      iframe.src = '';
      requestAnimationFrame(() => {
        if (!fellBack) iframe.src = proxyUrl;
      });
      return;
    }
    fallbackToOfficial();
  };

  iframe.addEventListener('load', () => {
    try {
      const doc = iframe.contentDocument;
      if (!doc) return;
      const err =
        doc.body?.getAttribute('data-pms-calendly-proxy-error') === '1' ||
        /Upstream Calendly unavailable|Couldn.t load the scheduler/i.test(doc.body?.innerText || '');
      if (err) retryOrFallback();
    } catch {
      // ignore
    }
  });

  const onMessage = (event: MessageEvent) => {
    if (event.data?.type === 'pms-calendly-proxy-error') {
      window.removeEventListener('message', onMessage);
      retryOrFallback();
    }
  };
  window.addEventListener('message', onMessage);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeProxiedCalendlyPopup();
  });
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeProxiedCalendlyPopup();
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('message', onMessage);
    }
  };
  window.addEventListener('keydown', onKey);

  panel.appendChild(iframe);
  panel.appendChild(closeBtn);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
  document.documentElement.style.overflow = 'hidden';
}
