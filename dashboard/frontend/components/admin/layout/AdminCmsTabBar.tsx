'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ADMIN_CMS_TAB_BAR_INNER_CLASS,
  ADMIN_CMS_TAB_BAR_OUTER_CLASS,
  ADMIN_CMS_TAB_LIST_CLASS,
} from '@/components/admin/layout/adminCmsLayoutClasses';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface AdminCmsTabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

export interface AdminCmsTabBarProps {
  /** Custom tab controls (e.g. WebsiteData with per-tab + buttons). */
  tabs?: ReactNode;
  /** Simple tab strip when `tabs` is omitted. */
  tabItems?: AdminCmsTabItem[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
  trailing?: ReactNode;
  /** Skip sticky outer chrome when the parent already provides it. */
  bare?: boolean;
  ariaLabel?: string;
}

export function AdminCmsTabBar({
  tabs,
  tabItems,
  activeTabId,
  onTabChange,
  trailing,
  bare,
  ariaLabel = 'Editor sections',
}: AdminCmsTabBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateOverflow = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    setCanScrollLeft(element.scrollLeft > 1);
    setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateOverflow();
    const element = scrollRef.current;
    if (!element) return;
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => observer.disconnect();
  }, [tabItems, tabs, updateOverflow]);

  const scrollTabs = (direction: -1 | 1) => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollBy({
      left: direction * Math.max(160, element.clientWidth * 0.65),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  const tabContent =
    tabs ??
    (tabItems && onTabChange && activeTabId ? (
      <Tabs value={activeTabId} onValueChange={onTabChange} className="min-w-max flex-1">
        <TabsList
          variant="line"
          aria-label={ariaLabel}
          className={`${ADMIN_CMS_TAB_LIST_CLASS} h-auto justify-start gap-1 bg-transparent p-0`}
        >
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="min-h-8 gap-2 px-3 py-2 text-label data-active:text-brand-orange data-active:font-semibold"
              >
                {Icon ? <Icon size={14} aria-hidden /> : null}
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    ) : null);

  const inner = (
    <div className={ADMIN_CMS_TAB_BAR_INNER_CLASS}>
      <div className="relative min-w-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={updateOverflow}
          className="min-w-0 overflow-x-auto scrollbar-hide"
        >
          <div className="relative z-10 min-w-max" role={tabs ? 'group' : undefined} aria-label={tabs ? ariaLabel : undefined}>
            {tabContent}
          </div>
        </div>
        {canScrollLeft ? (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-background via-background/90 to-transparent" />
            <button
              type="button"
              onClick={() => scrollTabs(-1)}
              className="absolute left-0 top-1/2 z-30 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40"
              aria-label="Scroll editor tabs left"
            >
              <ChevronLeft size={16} aria-hidden />
            </button>
          </>
        ) : null}
        {canScrollRight ? (
          <>
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-background via-background/90 to-transparent" />
            <button
              type="button"
              onClick={() => scrollTabs(1)}
              className="absolute right-0 top-1/2 z-30 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40"
              aria-label="Scroll editor tabs right"
            >
              <ChevronRight size={16} aria-hidden />
            </button>
          </>
        ) : null}
      </div>
      {trailing ? <div className="relative z-10 shrink-0">{trailing}</div> : null}
    </div>
  );

  if (bare) return inner;

  return <div className={ADMIN_CMS_TAB_BAR_OUTER_CLASS}>{inner}</div>;
}
