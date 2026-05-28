import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'surface' | 'raised' | 'modal';
  children: React.ReactNode;
  /** X1 compat — ignored on PMS GlassCard */
  hover?: boolean;
  /** X1 compat — ignored on PMS GlassCard */
  liquid?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'surface', children, ...props }, ref) => {
    const variants = {
      surface: 'bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10',
      raised: 'bg-white/60 dark:bg-black/30 backdrop-blur-lg border border-white/30 dark:border-white/15 shadow-xl',
      modal: 'bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/20 shadow-2xl',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'r-card overflow-hidden',
          variants[variant],
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
