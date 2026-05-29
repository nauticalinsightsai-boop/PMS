'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Crown } from 'lucide-react';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';
import { REGION_COPY } from '@/lib/brand-voice';

const HIDE_MS = 500;

type Props = {
  theme: PlatformPortalTheme;
  membershipPrice?: string | null;
  className?: string;
};

export default function PortalMembershipPopout({ theme, membershipPrice, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const price = membershipPrice?.trim() || 'N/A';

  const show = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setOpen(true);
  }, []);

  const hideSoon = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setOpen(false), HIDE_MS);
  }, []);

  useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  return (
    <div
      className={`relative inline-flex ${className}`.trim()}
      onMouseEnter={show}
      onMouseLeave={hideSoon}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-meta font-medium px-3 py-1.5 transition-opacity hover:opacity-90"
        style={{
          borderRadius: theme.radius,
          border: `1px solid ${theme.cardBorder}`,
          backgroundColor: theme.surfaceMuted,
          color: theme.text,
        }}
        aria-expanded={open}
        aria-haspopup="dialog"
        onFocus={show}
        onBlur={hideSoon}
      >
        <Crown size={14} style={{ color: theme.primary }} aria-hidden />
        Membership
      </button>

      <div
        role="tooltip"
        className={`absolute right-0 top-full z-40 mt-2 w-[min(18rem,calc(100vw-2rem))] p-4 shadow-lg transition-all duration-200 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
        style={{
          borderRadius: theme.radiusLg,
          border: `1px solid ${theme.cardBorder}`,
          backgroundColor: theme.cardBg,
          color: theme.text,
        }}
      >
        <p className="text-meta font-mono uppercase tracking-wider mb-1" style={{ color: theme.textMuted }}>
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
    </div>
  );
}
