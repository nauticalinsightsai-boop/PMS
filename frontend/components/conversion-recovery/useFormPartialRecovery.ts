'use client';

import * as React from 'react';
import type { LeadRecoveryContext } from '@/lib/conversion-recovery/types';

const DEFAULT_IDLE_MS = 20_000;

export function useFormPartialRecovery(opts: {
  variant: LeadRecoveryContext['variant'];
  isSubmitted: boolean;
  hasPartialData: boolean;
  idleMs?: number;
  extraContext?: Omit<LeadRecoveryContext, 'variant'>;
  onRequestRecovery?: (ctx: LeadRecoveryContext) => void;
}) {
  const { variant, isSubmitted, hasPartialData, extraContext, onRequestRecovery } = opts;
  const idleMs = opts.idleMs ?? DEFAULT_IDLE_MS;
  const touchedRef = React.useRef(false);
  const firedRef = React.useRef(false);
  const idleRef = React.useRef<number | null>(null);

  const markTouched = React.useCallback(() => {
    touchedRef.current = true;
    if (idleRef.current) window.clearTimeout(idleRef.current);
    if (!hasPartialData || isSubmitted || firedRef.current) return;
    idleRef.current = window.setTimeout(() => {
      if (firedRef.current || isSubmitted || !hasPartialData) return;
      firedRef.current = true;
      onRequestRecovery?.({
        variant,
        ...extraContext,
        parentSurface: extraContext?.parentSurface ?? 'roadmap_form',
      });
    }, idleMs);
  }, [extraContext, hasPartialData, idleMs, isSubmitted, onRequestRecovery, variant]);

  React.useEffect(() => {
    return () => {
      if (idleRef.current) window.clearTimeout(idleRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (hasPartialData && touchedRef.current) markTouched();
  }, [hasPartialData, markTouched]);

  return { markTouched };
}
