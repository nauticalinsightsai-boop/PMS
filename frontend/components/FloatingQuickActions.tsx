'use client';

import * as React from 'react';
import Link from 'next/link';
import { Calendar, MessageCircle, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FLOATING_CORNER_SHOW_AFTER_PX } from '@/lib/floating-corner';
import { PMS_SKOOL_COMMUNITY_JOIN_URL, externalHrefLinkProps } from '@/config/pms-site';
import { openCalendlyThemedPopup } from '@/lib/calendly/open-themed-popup';
import { getWebsiteCalendlyUrl } from '@/lib/calendly/website-events';

const FAB_SIZE_CLASS = 'h-12 w-12';

export function FloatingQuickActions() {
  const [open, setOpen] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReduceMotion(mq.matches);
    syncMotion();
    mq.addEventListener('change', syncMotion);

    const onScroll = () => setVisible(window.scrollY > FLOATING_CORNER_SHOW_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      mq.removeEventListener('change', syncMotion);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  React.useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  React.useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const scheduleCall = () => {
    setOpen(false);
    void openCalendlyThemedPopup(getWebsiteCalendlyUrl('mentor'), {
      funnelLabel: 'fab_schedule_call',
      utm: { utm_source: 'pmstructure', utm_medium: 'fab', utm_campaign: 'talk_to_mentor' },
      channelId: 'website',
      useProxy: true,
    });
  };

  const motionClass = reduceMotion ? 'transition-none' : 'transition-all duration-300 ease-out';

  return (
    <div
      ref={rootRef}
      className={cn(
        'fixed z-40 flex flex-col items-end gap-3',
        'bottom-[calc(max(1.5rem,env(safe-area-inset-bottom))+3.75rem)]',
        'right-[max(1.5rem,env(safe-area-inset-right))]',
        motionClass,
        visible
          ? 'translate-y-0 scale-100 opacity-100 pointer-events-auto'
          : 'translate-y-4 scale-90 opacity-0 pointer-events-none',
      )}
    >
      <div
        className={cn(
          'flex flex-col items-end gap-2 origin-bottom-right',
          motionClass,
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-2 scale-95 opacity-0',
        )}
        role="menu"
        aria-hidden={!open}
      >
        <Link
          href={PMS_SKOOL_COMMUNITY_JOIN_URL}
          {...externalHrefLinkProps(PMS_SKOOL_COMMUNITY_JOIN_URL)}
          role="menuitem"
          onClick={() => setOpen(false)}
          className={cn(
            'inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow-lg',
            'ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-800',
            motionClass,
          )}
        >
          <Users className="h-4 w-4 text-brand-orange" aria-hidden />
          Join Community
        </Link>
        <button
          type="button"
          role="menuitem"
          onClick={scheduleCall}
          className={cn(
            'inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow-lg',
            'ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-800',
            motionClass,
          )}
        >
          <Calendar className="h-4 w-4 text-brand-orange" aria-hidden />
          Schedule a call
        </button>
      </div>

      <button
        type="button"
        aria-label={open ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'flex items-center justify-center rounded-full bg-brand-orange text-white shadow-lg shadow-brand-orange/30',
          FAB_SIZE_CLASS,
          'hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          motionClass,
        )}
      >
        {open ? (
          <X className="h-5 w-5" strokeWidth={2.5} aria-hidden />
        ) : (
          <MessageCircle className="h-5 w-5" strokeWidth={2.5} aria-hidden />
        )}
      </button>
    </div>
  );
}
