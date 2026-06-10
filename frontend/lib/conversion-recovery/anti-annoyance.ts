import type { RecoverySurface } from './types';
import {
  getBarPageRotation,
  getBarSessionCount,
  getCenterDialogSessionCount,
  getLastSurfaceAt,
  isBottomBarPaused,
  isCookieGateOpen,
  isLeadConverted,
  isOptedOut,
  wasCenterDialogShownOnPage,
} from './session-state';

const EXCLUDED_PREFIXES = ['/checkout', '/admin', '/login'];
const COOLDOWN_MS = 90_000;
const MAX_CENTER_SESSION = 2;
const MAX_BAR_PAGE_ROTATIONS = 4;
const MAX_BAR_SESSION = 8;

export function isExcludedPath(pathname: string): boolean {
  if (pathname === '/contact') return false;
  if (pathname.startsWith('/certifications/') && pathname.endsWith('/enroll/success')) return true;
  return EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function isContactPage(pathname: string): boolean {
  return pathname === '/contact' || pathname.startsWith('/contact?');
}

export function isCalendlyOverlayOpen(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(document.querySelector('.calendly-overlay'));
}

export type CanShowResult = { allowed: true } | { allowed: false; reason: string };

export function canShowSurface(
  surface: RecoverySurface,
  pagePath: string,
  opts?: { centerDialogOpen?: boolean; barRotation?: boolean },
): CanShowResult {
  if (isOptedOut()) return { allowed: false, reason: 'opt_out' };
  if (isLeadConverted()) return { allowed: false, reason: 'converted' };
  if (!isCookieGateOpen()) return { allowed: false, reason: 'cookie_gate' };
  if (isExcludedPath(pagePath)) return { allowed: false, reason: 'excluded_path' };
  if (isCalendlyOverlayOpen()) return { allowed: false, reason: 'calendly_open' };

  const skipCooldown = surface === 'bottom_bar' && opts?.barRotation === true;
  const lastAt = getLastSurfaceAt();
  if (!skipCooldown && lastAt && Date.now() - lastAt < COOLDOWN_MS) {
    return { allowed: false, reason: 'cooldown' };
  }

  if (surface === 'center_dialog') {
    if (opts?.centerDialogOpen) return { allowed: false, reason: 'dialog_open' };
    if (getCenterDialogSessionCount() >= MAX_CENTER_SESSION) {
      return { allowed: false, reason: 'center_session_cap' };
    }
    if (wasCenterDialogShownOnPage(pagePath)) {
      return { allowed: false, reason: 'center_page_cap' };
    }
    return { allowed: true };
  }

  if (surface === 'bottom_bar') {
    if (isContactPage(pagePath)) return { allowed: false, reason: 'contact_page' };
    if (isBottomBarPaused()) return { allowed: false, reason: 'bar_paused' };
    if (getBarPageRotation(pagePath) >= MAX_BAR_PAGE_ROTATIONS) {
      return { allowed: false, reason: 'bar_page_cap' };
    }
    if (getBarSessionCount() >= MAX_BAR_SESSION) {
      return { allowed: false, reason: 'bar_session_cap' };
    }
    if (opts?.centerDialogOpen) return { allowed: false, reason: 'dialog_open' };
    return { allowed: true };
  }

  return { allowed: true };
}
