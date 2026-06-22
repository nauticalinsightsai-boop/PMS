'use client';

import * as React from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import { HOME_COPY } from '@/lib/brand-voice';
import { cn } from '@/lib/utils';

const ROTATE_MS = 4000;

type HomeHeroAccentRotatorProps = {
  phrases?: readonly string[];
  className?: string;
};

export function HomeHeroAccentRotator({
  phrases = HOME_COPY.heroTitleAccents,
  className,
}: HomeHeroAccentRotatorProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const list = phrases.length > 0 ? phrases : HOME_COPY.heroTitleAccents;

  React.useEffect(() => {
    if (reduceMotion || list.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % list.length);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [list.length, reduceMotion]);

  const current = list[index] ?? list[0];

  return (
    <LazyMotion features={domAnimation} strict>
    <p
      className={cn(
        'font-heading text-2xl sm:text-3xl md:text-[2rem] font-semibold text-brand-orange mb-6 sm:mb-8 tracking-tight leading-[1.15] text-balance min-h-[1.15em] sm:min-h-[1.2em]',
        className,
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {reduceMotion || list.length <= 1 ? (
        current
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <m.span
            key={current}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="inline-block"
          >
            {current}
          </m.span>
        </AnimatePresence>
      )}
    </p>
    </LazyMotion>
  );
}
