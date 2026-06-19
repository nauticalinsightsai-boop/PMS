'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import {
  PMP_EXAM_2026_FOOTER_LINKS,
  PMP_EXAM_2026_FOOTER_SUMMARY,
} from '@/content/pmp/footer-exam-2026-nav';
import { PMP_PACKAGE_TIER_POSITIONING } from '@/content/pmp/program-offer';
import { REGION_COPY } from '@/lib/brand-voice';
import { cn } from '@/lib/utils';

const PMP_TIER_KEYS = ['foundation', 'professional', 'mastery'] as const;

export function FooterPmpExam2026Nav() {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (rootRef.current && target && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between gap-2 border-0 bg-transparent p-0 text-left outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-brand-orange/50"
        onClick={() => setOpen((expanded) => !expanded)}
        aria-expanded={open}
      >
        <Link
          href="/pmp-exam-2026"
          className="font-semibold text-brand-purple/90 transition-colors hover:text-brand-orange"
          onClick={(e) => e.stopPropagation()}
        >
          PMP Exam 2026
        </Link>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform duration-300 dark:text-slate-400',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          className={cn(
            'absolute bottom-full left-0 z-[100] mb-2 w-[min(100vw-2rem,22rem)] rounded-xl border border-brand-purple/15',
            'bg-white p-3 shadow-xl dark:border-slate-700/60 dark:bg-slate-900',
          )}
        >
          <p className="mb-2 text-xs leading-snug text-carbon/90 dark:text-slate-300">
            {PMP_EXAM_2026_FOOTER_SUMMARY}
          </p>
          <p className="mb-2 text-[11px] leading-snug text-carbon/80 dark:text-slate-400">
            Choose the tier that matches your experience and career goals.
          </p>
          <ul className="mb-3 space-y-2 border-b border-slate-100 pb-3 dark:border-slate-700">
            {PMP_TIER_KEYS.map((tierKey) => {
              const tier = PMP_PACKAGE_TIER_POSITIONING[tierKey];
              return (
                <li key={tierKey} className="text-[11px] leading-snug text-carbon dark:text-slate-300">
                  <span className="font-semibold text-obsidian dark:text-white">{tier.title}:</span>{' '}
                  {tier.positioning}
                </li>
              );
            })}
          </ul>
          <p className="mb-3 text-[11px] leading-snug text-carbon/90 dark:text-slate-400">
            {PMP_PACKAGE_TIER_POSITIONING.fallback}{' '}
            <Link href="/faq" className="font-semibold text-brand-orange hover:underline">
              Compare tiers in FAQ
            </Link>
          </p>
          <ul className="flex flex-col gap-1.5 text-xs font-medium text-carbon dark:text-slate-300">
            {PMP_EXAM_2026_FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block leading-snug transition-colors hover:text-brand-orange"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-slate-100 pt-3 text-[11px] leading-snug text-carbon/90 dark:border-slate-700 dark:text-slate-400">
            {REGION_COPY.pricingSelector}{' '}
            {REGION_COPY.compliance}
          </p>
        </div>
      ) : null}
    </div>
  );
}
