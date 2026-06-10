const OPT_OUT_KEY = 'pms-recovery-opt-out-until';
const CONVERTED_KEY = 'pms-lead-converted';
const CENTER_COUNT_KEY = 'pms-recovery-center-count';
const CENTER_PAGE_KEY = 'pms-recovery-center-page';
const BAR_SESSION_COUNT_KEY = 'pms-recovery-bar-session-count';
const BAR_PAGE_ROTATION_KEY = 'pms-recovery-bar-page-rotation';
const LAST_SURFACE_AT_KEY = 'pms-recovery-last-surface-at';
const BAR_PAUSED_UNTIL_KEY = 'pms-recovery-bar-paused-until';
const ENROLL_STARTED_PREFIX = 'pms-enroll-started:';
const PATHWAY_MODAL_TIER_KEY = 'pms-pathway-modal-tier';
const COOKIE_READY_AT_KEY = 'pms-recovery-cookie-ready-at';

const OPT_OUT_MS = 7 * 24 * 60 * 60 * 1000;

function safeSessionGet(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSessionSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* private mode */
  }
}

function safeLocalGet(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode */
  }
}

export function isOptedOut(): boolean {
  const until = safeLocalGet(OPT_OUT_KEY);
  if (!until) return false;
  const ts = Number(until);
  return Number.isFinite(ts) && ts > Date.now();
}

export function setOptOut(days = 7): void {
  safeLocalSet(OPT_OUT_KEY, String(Date.now() + days * 24 * 60 * 60 * 1000));
}

export function isLeadConverted(): boolean {
  return safeSessionGet(CONVERTED_KEY) === '1';
}

export function markLeadConverted(): void {
  safeSessionSet(CONVERTED_KEY, '1');
}

export function getCenterDialogSessionCount(): number {
  return Number(safeSessionGet(CENTER_COUNT_KEY) ?? '0') || 0;
}

export function incrementCenterDialogSessionCount(): void {
  safeSessionSet(CENTER_COUNT_KEY, String(getCenterDialogSessionCount() + 1));
}

export function wasCenterDialogShownOnPage(pagePath: string): boolean {
  return safeSessionGet(CENTER_PAGE_KEY) === pagePath;
}

export function markCenterDialogShownOnPage(pagePath: string): void {
  safeSessionSet(CENTER_PAGE_KEY, pagePath);
}

export function getBarSessionCount(): number {
  return Number(safeSessionGet(BAR_SESSION_COUNT_KEY) ?? '0') || 0;
}

export function incrementBarSessionCount(): void {
  safeSessionSet(BAR_SESSION_COUNT_KEY, String(getBarSessionCount() + 1));
}

export function getBarPageRotation(pagePath: string): number {
  return Number(safeSessionGet(`${BAR_PAGE_ROTATION_KEY}:${pagePath}`) ?? '0') || 0;
}

export function incrementBarPageRotation(pagePath: string): number {
  const next = getBarPageRotation(pagePath) + 1;
  safeSessionSet(`${BAR_PAGE_ROTATION_KEY}:${pagePath}`, String(next));
  return next;
}

export function getLastSurfaceAt(): number {
  return Number(safeSessionGet(LAST_SURFACE_AT_KEY) ?? '0') || 0;
}

export function recordLastSurfaceAt(): void {
  safeSessionSet(LAST_SURFACE_AT_KEY, String(Date.now()));
}

export function pauseBottomBarUntil(ms: number): void {
  safeSessionSet(BAR_PAUSED_UNTIL_KEY, String(Date.now() + ms));
}

export function isBottomBarPaused(): boolean {
  const until = Number(safeSessionGet(BAR_PAUSED_UNTIL_KEY) ?? '0');
  return until > Date.now();
}

export function setEnrollStarted(offeringId: string, tierId: string, siteCertId: string): void {
  safeSessionSet(
    `${ENROLL_STARTED_PREFIX}${offeringId}`,
    JSON.stringify({ offeringId, tierId, siteCertId, at: Date.now() }),
  );
}

export function consumeEnrollStarted(offeringId: string): {
  offeringId: string;
  tierId: string;
  siteCertId: string;
} | null {
  const raw = safeSessionGet(`${ENROLL_STARTED_PREFIX}${offeringId}`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { offeringId: string; tierId: string; siteCertId: string };
    sessionStorage.removeItem(`${ENROLL_STARTED_PREFIX}${offeringId}`);
    return parsed;
  } catch {
    return null;
  }
}

export function findPendingEnrollReturn(): {
  offeringId: string;
  tierId: string;
  siteCertId: string;
} | null {
  if (typeof window === 'undefined') return null;
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key?.startsWith(ENROLL_STARTED_PREFIX)) continue;
      const raw = sessionStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as { offeringId: string; tierId: string; siteCertId: string };
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export function clearAllEnrollStarted(): void {
  if (typeof window === 'undefined') return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(ENROLL_STARTED_PREFIX)) keys.push(key);
    }
    keys.forEach((k) => sessionStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

export function setPathwayModalTierOpened(tierId: string): void {
  safeSessionSet(PATHWAY_MODAL_TIER_KEY, tierId);
}

export function getPathwayModalTierOpened(): string | null {
  return safeSessionGet(PATHWAY_MODAL_TIER_KEY);
}

export function setCookieReadyAt(delayMs: number): void {
  safeSessionSet(COOKIE_READY_AT_KEY, String(Date.now() + delayMs));
}

export function isCookieGateOpen(): boolean {
  const at = Number(safeSessionGet(COOKIE_READY_AT_KEY) ?? '0');
  if (!at) return true;
  return Date.now() >= at;
}

export function markCookieGatePending(): void {
  safeSessionSet(COOKIE_READY_AT_KEY, '0');
}

export { OPT_OUT_MS };
