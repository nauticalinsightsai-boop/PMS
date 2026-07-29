'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type HomeSectionTabItem<T extends string> = {
  id: T;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number }>;
};

type HomeSectionTabStripProps<T extends string> = {
  items: HomeSectionTabItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
};

const INSTRUCTION_ID = 'home-section-tabs-instructions';

export function homeSectionTabId(id: string) {
  return `home-section-tab-${id}`;
}

export function homeSectionPanelId(id: string) {
  return `home-section-panel-${id}`;
}

export function HomeSectionTabStrip<T extends string>({
  items,
  value,
  onValueChange,
}: HomeSectionTabStripProps<T>) {
  const scrollportRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<T, HTMLButtonElement>());
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const updateBoundaries = useCallback(() => {
    const scrollport = scrollportRef.current;
    if (!scrollport) return;

    const maxScrollLeft = Math.max(0, scrollport.scrollWidth - scrollport.clientWidth);
    const overflow = maxScrollLeft > 1;
    setHasOverflow(overflow);
    setCanScrollPrevious(overflow && scrollport.scrollLeft > 1);
    setCanScrollNext(overflow && scrollport.scrollLeft < maxScrollLeft - 1);
  }, []);

  const revealTab = useCallback(
    (id: T) => {
      tabRefs.current.get(id)?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    },
    [prefersReducedMotion],
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const scrollport = scrollportRef.current;
    if (!scrollport) return;

    updateBoundaries();
    const resizeObserver = new ResizeObserver(updateBoundaries);
    resizeObserver.observe(scrollport);
    const content = scrollport.firstElementChild;
    if (content) resizeObserver.observe(content);

    scrollport.addEventListener('scroll', updateBoundaries, { passive: true });
    return () => {
      resizeObserver.disconnect();
      scrollport.removeEventListener('scroll', updateBoundaries);
    };
  }, [items, updateBoundaries]);

  useEffect(() => {
    revealTab(value);
    const frame = window.requestAnimationFrame(updateBoundaries);
    return () => window.cancelAnimationFrame(frame);
  }, [revealTab, updateBoundaries, value]);

  const focusTab = (index: number) => {
    const next = items[(index + items.length) % items.length];
    if (!next) return;
    revealTab(next.id);
    tabRefs.current.get(next.id)?.focus({ preventScroll: true });
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusTab(index + 1);
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusTab(index - 1);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      focusTab(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusTab(items.length - 1);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const item = items[index];
      if (item) onValueChange(item.id);
    }
  };

  const scrollSections = (direction: -1 | 1) => {
    const scrollport = scrollportRef.current;
    if (!scrollport) return;
    const page = Math.max(1, scrollport.clientWidth - 48);
    scrollport.scrollBy({
      left: direction * page,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <div className="flex min-w-0 items-center gap-2" data-home-section-navigation>
      <p id={INSTRUCTION_ID} className="sr-only">
        Use Left and Right Arrow to move between section tabs. Press Enter or Space to open a section.
      </p>

      {hasOverflow ? (
        <button
          type="button"
          aria-label="Show previous homepage sections"
          disabled={!canScrollPrevious}
          onClick={() => scrollSections(-1)}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-background text-foreground transition-colors hover:bg-brand-orange/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft aria-hidden="true" size={16} />
        </button>
      ) : null}

      <div className="relative min-w-0 flex-1">
        {canScrollPrevious ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-1 left-0 top-1 z-10 w-4 bg-gradient-to-r from-background to-transparent"
          />
        ) : null}
        <div
          ref={scrollportRef}
          role="tablist"
          aria-label="Homepage sections"
          aria-orientation="horizontal"
          aria-describedby={INSTRUCTION_ID}
          className="min-w-0 overflow-x-auto px-1 py-1 no-scrollbar"
          data-home-section-scrollport
        >
          <div className="flex w-max min-w-full items-center gap-1">
            {items.map((item, index) => {
              const Icon = item.icon;
              const selected = item.id === value;
              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    if (node) tabRefs.current.set(item.id, node);
                    else tabRefs.current.delete(item.id);
                  }}
                  id={homeSectionTabId(item.id)}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={homeSectionPanelId(item.id)}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => onValueChange(item.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={cn(
                    'relative inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2',
                    selected
                      ? 'bg-brand-orange/15 text-brand-orange after:absolute after:inset-x-3 after:-bottom-1 after:h-0.5 after:bg-brand-orange'
                      : 'text-muted-foreground hover:bg-brand-purple/10 hover:text-foreground',
                  )}
                >
                  <Icon aria-hidden="true" size={14} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
        {canScrollNext ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-1 right-0 top-1 z-10 w-4 bg-gradient-to-l from-background to-transparent"
          />
        ) : null}
      </div>

      {hasOverflow ? (
        <button
          type="button"
          aria-label="Show next homepage sections"
          disabled={!canScrollNext}
          onClick={() => scrollSections(1)}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-background text-foreground transition-colors hover:bg-brand-orange/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight aria-hidden="true" size={16} />
        </button>
      ) : null}
    </div>
  );
}
