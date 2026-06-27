import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '../shared/ThemeProvider';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className, size = 'md' }) => {
  const { theme } = useTheme();
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs rounded-md',
    md: 'w-4 h-4 text-[8px] rounded-md',
    lg: 'w-12 h-12 text-2xl rounded-2xl',
  };

  const textClasses = {
    sm: 'text-sm',
    md: 'text-[9px]',
    lg: 'text-3xl',
  };

  const subtitleClasses = {
    sm: 'text-[8px]',
    md: 'text-[5px]',
    lg: 'text-[8px]',
  };

  return (
    <div
      className={cn(
        'flex items-center font-black tracking-tighter group select-none',
        size === 'md' ? 'gap-1.5' : 'gap-3',
        className,
      )}
    >
      <div className="relative">
        <div className={cn(
          "cta-consultation flex items-center justify-center text-white shadow-lg shadow-brand-orange/20 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110",
          sizeClasses[size]
        )}>
          <span>P</span>
        </div>
        {/* Ambient Glow in Dark Mode */}
        <div className={cn(
          "absolute inset-0 bg-brand-orange blur-md opacity-0 transition-opacity duration-500 group-hover:opacity-40 rounded-[10px]",
          sizeClasses[size]
        )} />
      </div>
      <div className="flex flex-col -space-y-1">
        <span className={cn("leading-none transition-colors duration-300", textClasses[size])}>
          PMS<span className="text-brand-orange">.OS</span>
        </span>
        {size !== 'sm' && (
          <span
            className={cn(
              'font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60',
              subtitleClasses[size],
            )}
          >
            Certification Platform
          </span>
        )}
      </div>
    </div>
  );
};
