'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from './utils';

export interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'surface' | 'raised' | 'modal' | 'flat';
  /** Skip entrance animation (preferred in admin dashboards). */
  animateEntry?: boolean;
  children: React.ReactNode;
  hover?: boolean;
  liquid?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'surface', animateEntry = true, children, hover, liquid, ...props }, ref) => {
    // Legacy callers still declare these visual flags. Consume them here so they never reach the DOM.
    void hover;
    void liquid;
    const variants = {
      surface:
        'bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10',
      raised:
        'bg-white/60 dark:bg-black/30 backdrop-blur-lg border border-white/30 dark:border-white/15 shadow-xl',
      modal:
        'bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/20 shadow-2xl',
      flat: 'bg-card border border-border shadow-sm',
    };

    return (
      <motion.div
        ref={ref}
        className={cn('r-card overflow-hidden', variants[variant], className)}
        initial={animateEntry ? { opacity: 0, y: 10 } : false}
        animate={animateEntry ? { opacity: 1, y: 0 } : undefined}
        transition={animateEntry ? { duration: 0.4, ease: 'easeOut' } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

GlassCard.displayName = 'GlassCard';
