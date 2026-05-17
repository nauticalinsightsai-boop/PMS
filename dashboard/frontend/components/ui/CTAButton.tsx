import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

interface CTAButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-gw-accent-primary text-white hover:bg-gw-accent-secondary premium-shadow shadow-gw-accent-primary/20',
      secondary: 'bg-white/10 dark:bg-black/20 text-gw-text-primary hover:bg-white/20 dark:hover:bg-black/30 border border-white/20 dark:border-white/10',
      ghost: 'bg-transparent text-gw-text-primary hover:bg-white/10 dark:hover:bg-black/10',
      outline: 'bg-transparent border-2 border-gw-accent-primary text-gw-accent-primary hover:bg-gw-accent-primary hover:text-white',
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
          'inline-flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider',
          variants[variant],
          sizes[size],
          className
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
  }
);

CTAButton.displayName = 'CTAButton';
