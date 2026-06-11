'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  canShowPassiveCenterDialog,
  hasShownIntent,
  initEngagementTracking,
  markIntent,
} from '@/lib/conversion-recovery/engagement-score';
import {
  canShowSurface,
  isExcludedPath,
} from '@/lib/conversion-recovery/anti-annoyance';
import {
  CENTER_DIALOG_BAR_PAUSE_MS,
} from '@/lib/conversion-recovery/bottom-bar-config';
import {
  installCalendlyBookedListener,
  setCalendlyCloseHandler,
} from '@/lib/conversion-recovery/calendly-bridge';
import { isLeadRecoveryEnabled } from '@/lib/conversion-recovery/enabled';
import {
  incrementCenterDialogSessionCount,
  markCenterDialogVariantShownOnPage,
  markLeadConverted,
  pauseBottomBarUntil,
  recordLastSurfaceAt,
  setCookieReadyAt,
  markCookieGatePending,
} from '@/lib/conversion-recovery/session-state';
import { readStoredConsent } from '@/lib/legal/consent';
import type { LeadRecoveryContext } from '@/lib/conversion-recovery/types';
import { enrollReturnVariant, tierIdFromPathwayTier } from '@/lib/conversion-recovery/copy';
import {
  consumeEnrollStarted,
  findPendingEnrollReturn,
} from '@/lib/conversion-recovery/session-state';
import { trackFunnelEvent, FUNNEL_EVENTS, trackGenerateLead } from '@/lib/analytics/funnel';

type LeadRecoveryContextValue = {
  dialogOpen: boolean;
  dialogContext: LeadRecoveryContext | null;
  requestRecovery: (
    ctx: LeadRecoveryContext,
    opts?: {
      requireIntent?: boolean;
      intentRecovery?: boolean;
      bypassPageVariantCap?: boolean;
      bypassSessionCap?: boolean;
    },
  ) => boolean;
  dismissDialog: (reason?: string) => void;
  notifyConverted: () => void;
  centerDialogOpen: boolean;
  barPausedUntil: number;
  setBarPaused: (ms: number) => void;
  cookieGateReady: boolean;
  markFormTouched: () => void;
  servicesNudgeEligible: boolean;
  registerServicesNudge: () => void;
};

const LeadRecoveryReactContext = React.createContext<LeadRecoveryContextValue | null>(null);

export function useLeadRecovery(): LeadRecoveryContextValue {
  const ctx = React.useContext(LeadRecoveryReactContext);
  if (!ctx) {
    throw new Error('useLeadRecovery must be used within LeadRecoveryProvider');
  }
  return ctx;
}

export function useLeadRecoveryOptional(): LeadRecoveryContextValue | null {
  return React.useContext(LeadRecoveryReactContext);
}

const COOKIE_BUFFER_MS = 10_000;

export function LeadRecoveryProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/';
  const enabled = isLeadRecoveryEnabled();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogContext, setDialogContext] = React.useState<LeadRecoveryContext | null>(null);
  const [cookieGateReady, setCookieGateReady] = React.useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = React.useState(false);
  const [barPausedUntil, setBarPausedUntil] = React.useState(0);
  const servicesTimerRef = React.useRef<number | null>(null);
  const servicesNudgeFiredRef = React.useRef(false);
  const prevPathnameRef = React.useRef(pathname);
  const [servicesNudgeEligible, setServicesNudgeEligible] = React.useState(false);

  const requestRecovery = React.useCallback(
    (
      ctx: LeadRecoveryContext,
      opts?: {
        requireIntent?: boolean;
        intentRecovery?: boolean;
        bypassPageVariantCap?: boolean;
        bypassSessionCap?: boolean;
      },
    ) => {
      const pathwayExitRecovery =
        ctx.parentSurface === 'pathway_modal' && ctx.variant.endsWith('_exit');
      if (!enabled || cookieBannerVisible || isExcludedPath(pathname)) return false;
      if (!cookieGateReady && !(pathwayExitRecovery && hasShownIntent())) return false;
      const intentRecovery = opts?.intentRecovery ?? opts?.requireIntent !== false;
      if (
        opts?.requireIntent !== false &&
        !intentRecovery &&
        !hasShownIntent() &&
        !canShowPassiveCenterDialog()
      ) {
        return false;
      }
      const check = canShowSurface('center_dialog', pathname, {
        centerDialogOpen: dialogOpen,
        intentRecovery,
        variant: ctx.variant,
        bypassPageVariantCap: opts?.bypassPageVariantCap,
        bypassSessionCap: opts?.bypassSessionCap,
      });
      if (!check.allowed) {
        if (process.env.NODE_ENV === 'development') {
          console.debug('[lead-recovery] blocked center dialog:', check.reason, ctx.variant);
        }
        return false;
      }
      setDialogContext(ctx);
      setDialogOpen(true);
      incrementCenterDialogSessionCount();
      markCenterDialogVariantShownOnPage(pathname, ctx.variant);
      recordLastSurfaceAt();
      pauseBottomBarUntil(CENTER_DIALOG_BAR_PAUSE_MS);
      setBarPausedUntil(Date.now() + CENTER_DIALOG_BAR_PAUSE_MS);
      trackFunnelEvent(FUNNEL_EVENTS.RECOVERY_SHOWN, {
        variant: ctx.variant,
        page_path: pathname,
        tier_id: ctx.tierId,
        cert_id: ctx.siteCertId,
      });
      trackGenerateLead({
        source: 'lead_recovery',
        variant: ctx.variant,
        page_path: pathname,
        tier_id: ctx.tierId,
        cert_id: ctx.siteCertId,
      });
      return true;
    },
    [cookieBannerVisible, cookieGateReady, dialogOpen, enabled, pathname],
  );

  const dismissDialog = React.useCallback(
    (reason = 'dismiss') => {
      setDialogOpen(false);
      setDialogContext(null);
      trackFunnelEvent(FUNNEL_EVENTS.RECOVERY_DISMISSED, {
        reason,
        page_path: pathname,
      });
      trackGenerateLead({
        source: 'lead_recovery',
        action: 'dismiss',
        reason,
        page_path: pathname,
      });
    },
    [pathname],
  );

  const notifyConverted = React.useCallback(() => {
    markLeadConverted();
    setDialogOpen(false);
    setDialogContext(null);
  }, []);

  const markFormTouched = React.useCallback(() => {
    markIntent();
  }, []);

  const registerServicesNudge = React.useCallback(() => {
    if (servicesNudgeFiredRef.current || pathname !== '/pm-service') return;
    if (servicesTimerRef.current) window.clearTimeout(servicesTimerRef.current);
    servicesTimerRef.current = window.setTimeout(() => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      if (ratio >= 0.7 && !hasShownIntent()) {
        servicesNudgeFiredRef.current = true;
        setServicesNudgeEligible(true);
      }
    }, 60_000);
  }, [pathname]);

  React.useEffect(() => {
    if (isExcludedPath(pathname) && dialogOpen) {
      setDialogOpen(false);
      setDialogContext(null);
    }
  }, [dialogOpen, pathname]);

  React.useEffect(() => {
    if (!enabled) return;
    installCalendlyBookedListener();
    setCalendlyCloseHandler((ctx) => {
      requestRecovery(ctx, { requireIntent: true, intentRecovery: true });
    });
    return initEngagementTracking();
  }, [enabled, requestRecovery]);

  React.useEffect(() => {
    if (!enabled) return;
    const prev = prevPathnameRef.current;
    prevPathnameRef.current = pathname;
    if (!prev.includes('/enroll') || pathname.includes('/enroll')) return;
    const pending = findPendingEnrollReturn();
    if (!pending) return;
    const shown = requestRecovery(
      {
        variant: enrollReturnVariant(pending.tierId),
        siteCertId: pending.siteCertId,
        tierId: tierIdFromPathwayTier(pending.tierId),
        offeringId: pending.offeringId,
        parentSurface: 'enroll',
      },
      { requireIntent: true, intentRecovery: true },
    );
    if (shown) consumeEnrollStarted(pending.offeringId);
  }, [enabled, pathname, requestRecovery]);

  React.useEffect(() => {
    if (!enabled) return;
    const syncCookieGate = () => {
      if (readStoredConsent()) {
        setCookieReadyAt(COOKIE_BUFFER_MS);
        window.setTimeout(() => setCookieGateReady(true), COOKIE_BUFFER_MS);
      } else {
        markCookieGatePending();
        setCookieGateReady(false);
      }
    };
    const onConsentVisible = (e: Event) => {
      const detail = (e as CustomEvent<{ visible?: boolean }>).detail;
      setCookieBannerVisible(Boolean(detail?.visible));
      if (detail?.visible) setCookieGateReady(false);
      else syncCookieGate();
    };
    syncCookieGate();
    window.addEventListener('legal-consent-updated', syncCookieGate);
    window.addEventListener('cookie-consent-visible', onConsentVisible);
    return () => {
      window.removeEventListener('legal-consent-updated', syncCookieGate);
      window.removeEventListener('cookie-consent-visible', onConsentVisible);
    };
  }, [enabled]);

  React.useEffect(() => {
    if (pathname === '/pm-service') registerServicesNudge();
    const onScroll = () => {
      if (pathname !== '/pm-service') return;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= 0.7) registerServicesNudge();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (servicesTimerRef.current) window.clearTimeout(servicesTimerRef.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname, registerServicesNudge]);

  React.useEffect(() => {
    if (servicesNudgeEligible && !dialogOpen) {
      requestRecovery({ variant: 'services_contact_nudge', parentSurface: 'contact' }, { requireIntent: false });
      setServicesNudgeEligible(false);
    }
  }, [servicesNudgeEligible, dialogOpen, requestRecovery]);

  const value = React.useMemo(
    () => ({
      dialogOpen,
      dialogContext,
      requestRecovery,
      dismissDialog,
      notifyConverted,
      centerDialogOpen: dialogOpen,
      barPausedUntil,
      setBarPaused: (ms: number) => {
        pauseBottomBarUntil(ms);
        setBarPausedUntil(Date.now() + ms);
      },
      cookieGateReady,
      markFormTouched,
      servicesNudgeEligible,
      registerServicesNudge,
    }),
    [
      barPausedUntil,
      cookieGateReady,
      dialogContext,
      dialogOpen,
      dismissDialog,
      markFormTouched,
      notifyConverted,
      registerServicesNudge,
      requestRecovery,
      servicesNudgeEligible,
    ],
  );

  return (
    <LeadRecoveryReactContext.Provider value={value}>{children}</LeadRecoveryReactContext.Provider>
  );
}
