'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from './utils';

export interface CTAButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'brandOutline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'cta-consultation shadow-lg shadow-brand-orange/20 premium-shadow',
      secondary:
        'bg-white/10 dark:bg-black/20 text-foreground hover:bg-white/20 dark:hover:bg-black/30 border border-white/20 dark:border-white/10',
      ghost: 'bg-transparent text-foreground hover:bg-white/10 dark:hover:bg-black/10',
      outline:
        'bg-transparent border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white',
      brandOutline:
        'bg-transparent border-2 border-brand-orange/40 text-brand-orange hover:bg-brand-orange/10',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-medium',
      md: 'px-6 py-2.5 text-sm font-semibold',
      lg: 'px-8 py-4 text-base font-bold',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 uppercase tracking-wider',
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children as React.ReactNode}
      </motion.button>
    );
  },
);

CTAButton.displayName = 'CTAButton';
