import React from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../shared/ThemeProvider';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className, size = 'md' }) => {
  const { theme } = useTheme();
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs rounded-md',
    md: 'w-9 h-9 text-lg rounded-[10px]',
    lg: 'w-12 h-12 text-2xl rounded-2xl',
  };

  const textClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn("flex items-center gap-3 font-black tracking-tighter group select-none", className)}>
      <div className="relative">
        <div className={cn(
          "bg-gw-accent-primary flex items-center justify-center text-white shadow-lg shadow-gw-accent-primary/20 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110",
          sizeClasses[size]
        )}>
          <span>P</span>
        </div>
        {/* Ambient Glow in Dark Mode */}
        <div className={cn(
          "absolute inset-0 bg-gw-accent-primary blur-md opacity-0 transition-opacity duration-500 group-hover:opacity-40 rounded-[10px]",
          sizeClasses[size]
        )} />
      </div>
      <div className="flex flex-col -space-y-1">
        <span className={cn("leading-none transition-colors duration-300", textClasses[size])}>
          PMS<span className="text-gw-accent-primary">.OS</span>
        </span>
        {size !== 'sm' && (
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gw-text-secondary opacity-60">
            Certification Platform
          </span>
        )}
      </div>
    </div>
  );
};
