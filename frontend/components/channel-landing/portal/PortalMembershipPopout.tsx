'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { Crown } from 'lucide-react';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';
import { portalSpacing } from '@/lib/channel-landing-pages/portalSpacing';
import { REGION_COPY } from '@/lib/brand-voice';

const HIDE_MS = 500;

type Props = {
  theme: PlatformPortalTheme;
  membershipPrice?: string | null;
  className?: string;
  /** `chip` matches prep/tuition MetaChip sizing in pathway detail rows. */
  variant?: 'button' | 'chip';
  /**
   * `overlay` (default): absolute popover for header utilities.
   * `inline`: pathway cards — trigger stays a meta chip; open panel is a separate
   * full-width in-flow grid row (`contents` + `col-span-full`), never absolute.
   */
  placement?: 'overlay' | 'inline';
};

export default function PortalMembershipPopout({
  theme,
  membershipPrice,
  className = '',
  variant = 'button',
  placement = 'overlay',
}: Props) {
  const [open, setOpen] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const panelId = `portal-membership-panel-${reactId.replace(/:/g, '')}`;
  const labelId = `portal-membership-label-${reactId.replace(/:/g, '')}`;
  const price = membershipPrice?.trim() || 'N/A';
  const isChip = variant === 'chip';
  const isInline = placement === 'inline';

  const clearHide = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  const show = useCallback(() => {
    clearHide();
    setOpen(true);
  }, [clearHide]);

  const hideSoon = useCallback(() => {
    clearHide();
    hideTimer.current = setTimeout(() => setOpen(false), HIDE_MS);
  }, [clearHide]);

  const close = useCallback(() => {
    clearHide();
    setOpen(false);
  }, [clearHide]);

  const toggle = useCallback(() => {
    clearHide();
    setOpen((prev) => !prev);
  }, [clearHide]);

  useEffect(
    () => () => {
      clearHide();
    },
    [clearHide],
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      close();
      triggerRef.current?.focus();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (event.target instanceof Node && !root.contains(event.target)) {
        close();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, close]);

  const shellStyle = {
    borderRadius: theme.radius,
    border: `1px solid ${theme.cardBorder}`,
    backgroundColor: theme.surfaceMuted,
    color: theme.text,
  };

  return (
    <div
      ref={rootRef}
      className={`${isInline ? 'contents' : 'relative'} ${
        !isInline && isChip ? 'flex w-full min-w-0 sm:flex-1 sm:basis-0 self-stretch' : ''
      } ${!isInline && !isChip ? 'inline-flex' : ''} ${className}`.trim()}
      onMouseEnter={isInline ? undefined : show}
      onMouseLeave={isInline ? undefined : hideSoon}
    >
      <button
        ref={triggerRef}
        type="button"
        className={
          isChip
            ? `${portalSpacing.metaChip} w-full ${isInline ? '' : 'h-full'} min-h-11 transition-opacity hover:opacity-90`
            : 'inline-flex min-h-11 items-center gap-1.5 text-meta font-medium px-3 py-1.5 transition-opacity hover:opacity-90'
        }
        style={shellStyle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
      >
        {isChip ? (
          <>
            <span
              className="text-[9px] font-mono uppercase tracking-[0.14em]"
              style={{ color: theme.textMuted }}
            >
              Membership
            </span>
            <span
              className={`${portalSpacing.detailValue} inline-flex items-center gap-1`}
              style={{ color: theme.text }}
            >
              <Crown size={12} style={{ color: theme.primary }} aria-hidden />
              {price}
            </span>
          </>
        ) : (
          <>
            <Crown size={14} style={{ color: theme.primary }} aria-hidden />
            Membership
          </>
        )}
      </button>

      {open ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={labelId}
          className={
            isInline
              ? 'col-span-full relative z-10 w-full min-w-0 p-4'
              : 'absolute right-0 top-full z-40 mt-2 w-[min(18rem,calc(100vw-2rem))] p-4 shadow-lg'
          }
          style={{
            borderRadius: theme.radiusLg,
            border: `1px solid ${theme.cardBorder}`,
            backgroundColor: theme.cardBg,
            color: theme.text,
            ...(isInline ? { position: 'relative' as const } : null),
          }}
          onMouseEnter={isInline ? undefined : show}
          onMouseLeave={isInline ? undefined : hideSoon}
        >
          <p
            id={labelId}
            className="text-meta font-mono uppercase tracking-wider mb-1"
            style={{ color: theme.textMuted }}
          >
            {REGION_COPY.membershipChipLabel}
          </p>
          <p className="text-body-sm font-semibold tabular-nums mb-2" style={{ color: theme.primary }}>
            {price}
          </p>
          <p className="text-meta leading-relaxed mb-3" style={{ color: theme.textMuted }}>
            {REGION_COPY.membershipDiscountNote}
          </p>
          <Link
            href="/membership"
            className="text-meta font-semibold underline-offset-2 hover:underline"
            style={{ color: theme.primary }}
          >
            View membership details →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
