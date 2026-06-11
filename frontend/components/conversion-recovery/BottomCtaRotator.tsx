'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrackedConversionLink } from '@/components/analytics/TrackedConversionLink';
import { cn } from '@/lib/utils';
import { useLeadRecovery } from '@/components/conversion-recovery/LeadRecoveryProvider';
import {
  BOTTOM_BAR_FIRST_DELAY_MS,
  BOTTOM_BAR_ROTATION_DELAY_MS,
  getRotationsForPath,
} from '@/lib/conversion-recovery/bottom-bar-config';
import { canShowSurface, isExcludedPath } from '@/lib/conversion-recovery/anti-annoyance';
import { isLeadRecoveryEnabled } from '@/lib/conversion-recovery/enabled';
import {
  incrementBarPageRotation,
  incrementBarSessionCount,
  getBarPageRotation,
  recordLastSurfaceAt,
  setOptOut,
} from '@/lib/conversion-recovery/session-state';
import type { BottomBarAction, BottomBarRotation } from '@/lib/conversion-recovery/types';
import { openCalendlyThemedPopup } from '@/lib/calendly/open-themed-popup';
import { getWebsiteHeroConsultationCalendlyUrl } from '@/lib/calendly/embed-url';
import { getWebsiteCalendlyUrl } from '@/lib/calendly/website-events';
import { trackFunnelEvent, FUNNEL_EVENTS, trackGenerateLead } from '@/lib/analytics/funnel';
import { CONVERSION_EVENTS } from '@/lib/analytics/conversion-events';
import { markIntent, canAccelerateBottomBarMicroForm } from '@/lib/conversion-recovery/engagement-score';
import { Input } from '@/components/ui/input';
import { submitPublicInteraction } from '@/lib/interactions/submit-public';
import { useRegion } from '@/contexts/RegionContext';

function actionLabel(action: BottomBarAction, rotation: BottomBarRotation): string {
  if (action.type === 'calendly_hero' || action.type === 'register_modal') return 'Talk to Mentor';
  if (action.type === 'calendly') return action.label ?? 'Talk to Mentor';
  if (action.type === 'micro_form') return 'Leave my details';
  if (action.type === 'link') return action.label;
  if (action.type === 'scroll') return action.label;
  return 'Continue';
}

function openBottomBarCalendly(action: BottomBarAction): void {
  if (action.type === 'calendly') {
    void openCalendlyThemedPopup(getWebsiteCalendlyUrl(action.tier), {
      funnelLabel: `bottom_bar_calendly_${action.tier}`,
      utm: { utm_source: 'pmstructure', utm_medium: 'bottom_bar', utm_campaign: action.tier },
    });
    return;
  }
  void openCalendlyThemedPopup(getWebsiteHeroConsultationCalendlyUrl(), {
    funnelLabel: 'bottom_bar_calendly',
    utm: { utm_source: 'pmstructure', utm_medium: 'bottom_bar', utm_campaign: 'recovery' },
  });
}

export function BottomCtaRotator() {
  const enabled = isLeadRecoveryEnabled();
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const { regionId } = useRegion();
  const { centerDialogOpen, cookieGateReady, requestRecovery, notifyConverted, setBarPaused } =
    useLeadRecovery();

  const [open, setOpen] = React.useState(false);
  const [rotationIndex, setRotationIndex] = React.useState(0);
  const [showInlineForm, setShowInlineForm] = React.useState(false);
  const [inlineEmail, setInlineEmail] = React.useState('');
  const [inlinePhone, setInlinePhone] = React.useState('');
  const [inlineName, setInlineName] = React.useState('');
  const timerRef = React.useRef<number | null>(null);

  const rotations = React.useMemo(() => getRotationsForPath(pathname), [pathname]);
  const rotation = rotations[rotationIndex] ?? null;

  const scheduleShow = React.useCallback(
    (delayMs: number, opts?: { barRotation?: boolean }) => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        if (!cookieGateReady || centerDialogOpen) return;
        const check = canShowSurface('bottom_bar', pathname, {
          centerDialogOpen,
          barRotation: opts?.barRotation,
        });
        if (!check.allowed) return;
        const idx = getBarPageRotation(pathname);
        if (idx >= rotations.length) return;
        const useAcceleratedMicroForm =
          idx === 0 && canAccelerateBottomBarMicroForm() && rotations.length >= 4;
        const displayIdx = useAcceleratedMicroForm ? rotations.length - 1 : idx;
        const nextRotation = rotations[displayIdx];
        setRotationIndex(displayIdx);
        setShowInlineForm(nextRotation?.primary.type === 'micro_form');
        setOpen(true);
        incrementBarSessionCount();
        recordLastSurfaceAt();
        trackFunnelEvent(FUNNEL_EVENTS.BOTTOM_BAR_SHOWN, {
          rotation: idx + 1,
          page_path: pathname,
          variant: nextRotation?.variant,
          accelerated: useAcceleratedMicroForm,
        });
        trackGenerateLead({
          source: 'lead_recovery',
          surface: 'bottom_bar',
          rotation: idx + 1,
          variant: nextRotation?.variant,
          page_path: pathname,
        });
      }, delayMs);
    },
    [centerDialogOpen, cookieGateReady, pathname, rotations],
  );

  React.useEffect(() => {
    if (!enabled || isExcludedPath(pathname) || rotations.length === 0) {
      setOpen(false);
      return;
    }
    setRotationIndex(getBarPageRotation(pathname));
    setShowInlineForm(false);
    scheduleShow(BOTTOM_BAR_FIRST_DELAY_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [enabled, pathname, rotations.length, scheduleShow]);

  const dismiss = React.useCallback(
    (optOut = false) => {
      setOpen(false);
      setShowInlineForm(false);
      if (optOut) setOptOut(7);
      const next = incrementBarPageRotation(pathname);
      setRotationIndex(next);
      trackFunnelEvent(FUNNEL_EVENTS.BOTTOM_BAR_DISMISSED, {
        rotation: next,
        page_path: pathname,
        opt_out: optOut,
      });
      if (next < rotations.length) {
        trackFunnelEvent(FUNNEL_EVENTS.BOTTOM_BAR_ROTATION, {
          from_rotation: next,
          to_rotation: next + 1,
          page_path: pathname,
        });
        scheduleShow(BOTTOM_BAR_ROTATION_DELAY_MS, { barRotation: true });
      }
    },
    [pathname, rotations.length, scheduleShow],
  );

  const runPrimaryAction = async (action: BottomBarAction) => {
    markIntent();
    dismiss(false);
    if (action.type === 'calendly_hero' || action.type === 'register_modal' || action.type === 'calendly') {
      openBottomBarCalendly(action);
      return;
    }
    if (action.type === 'link') {
      router.push(action.href);
      return;
    }
    if (action.type === 'scroll') {
      const el = document.getElementById(action.anchor);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (action.type === 'micro_form') {
      setOpen(true);
      setShowInlineForm(true);
      return;
    }
  };

  const submitInlineForm = async () => {
    if (!inlineName.trim() || !inlinePhone.trim()) return;
    const res = await submitPublicInteraction({
      source: 'lead_recovery',
      subject: 'Lead recovery: bottom bar micro form',
      email: inlineEmail.trim() || 'noreply@pmstructure.com',
      formContext: {
        formId: 'lead_recovery',
        formLabel: 'Bottom bar micro form',
        pagePath: pathname,
        regionId,
        placement: rotation?.variant ?? 'bottom_bar_r4',
      },
      payload: {
        fullName: inlineName.trim(),
        whatsapp: inlinePhone.trim(),
        email: inlineEmail.trim() || undefined,
        variant: rotation?.variant ?? 'bottom_bar_r4',
      },
    });
    if (res.ok) {
      notifyConverted();
      trackGenerateLead({
        source: 'lead_recovery',
        surface: 'bottom_bar',
        variant: rotation?.variant ?? 'bottom_bar_r4',
        page_path: pathname,
      });
      dismiss(false);
      setBarPaused(60_000);
    }
  };

  if (!enabled || !open || !rotation || isExcludedPath(pathname)) return null;

  const primary = rotation.primary;
  const secondary = rotation.secondary;
  const isLastRotation = rotationIndex >= rotations.length - 1;

  return (
    <div
      role="complementary"
      aria-label="Get started with exam prep"
      className={cn(
        'fixed inset-x-0 bottom-0 z-[85] pointer-events-auto',
        'border-t border-white/40 dark:border-white/10',
        'bg-white/55 dark:bg-slate-950/55',
        'backdrop-blur-2xl backdrop-saturate-150',
        'shadow-[0_-12px_40px_rgba(15,23,42,0.12)] dark:shadow-[0_-12px_40px_rgba(0,0,0,0.45)]',
        'pb-[max(0.75rem,env(safe-area-inset-bottom))]',
        'animate-in slide-in-from-bottom-4 fade-in duration-300',
      )}
    >
      <div className="container relative mx-auto px-4 py-4 sm:px-6 sm:py-5">
        <button
          type="button"
          onClick={() => dismiss(false)}
          className="absolute top-3 right-3 sm:top-4 sm:right-6 rounded-md p-1.5 text-slate-500 hover:bg-white/40 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8 pr-10">
          <div className="min-w-0 max-w-3xl">
            <p className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
              {rotation.headline}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300/90 leading-relaxed">{rotation.body}</p>
          </div>

          {showInlineForm || primary.type === 'micro_form' ? (
            <div className="flex w-full flex-col gap-2 sm:max-w-md">
              <Input placeholder="Full name" value={inlineName} onChange={(e) => setInlineName(e.target.value)} className="h-11" />
              <Input placeholder="WhatsApp" value={inlinePhone} onChange={(e) => setInlinePhone(e.target.value)} className="h-11" />
              <Input placeholder="Email (optional)" value={inlineEmail} onChange={(e) => setInlineEmail(e.target.value)} className="h-11" />
              <Button type="button" variant="brand" className="w-full font-bold" onClick={() => void submitInlineForm()}>
                Send my details
              </Button>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:shrink-0 lg:w-auto lg:min-w-[22rem]">
              {primary.type === 'link' ? (
                <TrackedConversionLink
                  href={primary.href}
                  event={
                    primary.href.includes('diagnostic')
                      ? CONVERSION_EVENTS.CLICK_PMP_DIAGNOSTIC
                      : CONVERSION_EVENTS.CONSULTATION_BOOK
                  }
                  className="flex-1 sm:min-w-[11rem]"
                  onClick={() => {
                    markIntent();
                    dismiss(false);
                  }}
                >
                  <Button variant="brand" className="w-full font-bold shadow-md shadow-brand-orange/20">
                    {actionLabel(primary, rotation)}
                  </Button>
                </TrackedConversionLink>
              ) : primary.type === 'register_modal' ||
                primary.type === 'calendly_hero' ||
                primary.type === 'calendly' ? (
                <Button
                  type="button"
                  variant="brand"
                  className="w-full flex-1 font-bold sm:min-w-[11rem]"
                  onClick={() => {
                    markIntent();
                    dismiss(false);
                    openBottomBarCalendly(primary);
                  }}
                >
                  {actionLabel(primary, rotation)}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="brand"
                  className="w-full flex-1 font-bold sm:min-w-[11rem]"
                  onClick={() => void runPrimaryAction(primary)}
                >
                  {actionLabel(primary, rotation)}
                </Button>
              )}
              {secondary ? (
                secondary.type === 'register_modal' ||
                secondary.type === 'calendly_hero' ||
                secondary.type === 'calendly' ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex-1 font-bold border-slate-300/80 bg-white/50 dark:border-slate-600 dark:bg-slate-900/40 sm:min-w-[11rem]"
                    onClick={() => {
                      markIntent();
                      dismiss(false);
                      openBottomBarCalendly(secondary);
                    }}
                  >
                    {actionLabel(secondary, rotation)}
                  </Button>
                ) : secondary.type === 'link' ? (
                  <Link href={secondary.href} className="flex-1 sm:min-w-[11rem]" onClick={() => dismiss(false)}>
                    <Button
                      variant="outline"
                      className="w-full font-bold border-slate-300/80 bg-white/50 dark:border-slate-600 dark:bg-slate-900/40"
                    >
                      {actionLabel(secondary, rotation)}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex-1 font-bold"
                    onClick={() => void runPrimaryAction(secondary)}
                  >
                    {actionLabel(secondary, rotation)}
                  </Button>
                )
              ) : null}
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-end pr-10">
          <button
            type="button"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            onClick={() => dismiss(isLastRotation)}
          >
            {rotation.dismissLabel}
          </button>
        </div>
      </div>
    </div>
  );
}