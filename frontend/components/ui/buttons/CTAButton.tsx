'use client'

import React from 'react';

export interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
 size?: 'sm' | 'md' | 'lg';
 noHoverEffect?: boolean;
 className?: string;
 children: React.ReactNode;
}

/**
 * CTAButton - Call-to-action button component
 * 
 * Uses design tokens:
 * - Brand colors (--color-accent, --color-text, etc.)
 * - Elevation shadows (--shadow-surface/raised/modal)
 * - Border radius: .r-btn-primary (primary), .r-btn-secondary (secondary/ghost/glass)
 * 
 * NO permanent outlines - only accessible focus ring on focus
 */
const CTAButton: React.FC<CTAButtonProps> = ({ 
 variant = 'primary',
 size = 'md',
 noHoverEffect = false,
 className = '',
 children,
 ...props
}) => {
 const variantClasses = {
  primary: noHoverEffect
   ? 'bg-brand-accent active:brightness-95 shadow-none hover:shadow-none active:shadow-surface font-medium'
   : 'bg-brand-accent !text-white hover:!text-white active:!text-white active:brightness-95 shadow-raised hover:shadow-modal active:shadow-surface font-medium',
  secondary: 'bg-brand-subtle !text-slate-900 dark:!text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:!text-black dark:hover:!text-black active:bg-neutral-200 dark:active:bg-neutral-700 shadow-surface hover:shadow-raised active:shadow-surface font-medium',
  ghost: 'bg-transparent !text-slate-900 dark:!text-white hover:bg-brand-subtle active:bg-brand-subtle/80 font-medium',
  glass: 'bg-white/70 dark:bg-slate-800/45 backdrop-blur-md !text-slate-900 dark:!text-white shadow-surface hover:shadow-raised active:shadow-surface hover:bg-white/85 dark:hover:bg-slate-800/60 active:bg-white/95 dark:active:bg-slate-800/70 font-medium',
 };

 const sizeClasses = {
  sm: 'px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2.5 text-[11px] sm:text-label',
  md: 'px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 lg:px-10 lg:py-3.5 text-[11px] sm:text-label',
  lg: 'px-5 py-2.5 sm:px-8 sm:py-3 md:px-10 md:py-3.5 lg:px-12 lg:py-4 text-[11px] sm:text-label',
 };

 const radiusClass = variant === 'primary' ? 'r-btn-primary' : 'r-btn-secondary';
 const baseClasses = `
  flex items-center justify-center gap-3
  ${noHoverEffect ? 'transition-none' : 'transition-smooth'}
  ${noHoverEffect ? 'hover:scale-100' : 'hover:scale-105'}
  active:scale-95
  border-0
  focus:outline-none 
  focus:ring-2 
  focus:ring-brand-accent 
  focus:ring-offset-2 
  focus:ring-offset-brand-surface
  disabled:opacity-50 
  disabled:cursor-not-allowed
  group
 `;
 const finalClassName = `${baseClasses} ${radiusClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim().replace(/\s+/g, ' ');

 return (
  <button
   {...props}
   className={finalClassName}
   style={props.style}
  >
    {React.Children.map(children, (child) => {
     // If child is an icon (SVG), add hover color and animation
     if (React.isValidElement(child) && child.type && typeof child.type !== 'string') {
      const childType = child.type as { displayName?: string; name?: string };
      const childProps = child.props as {
        className?: string;
        style?: React.CSSProperties;
        'data-lucide'?: string;
      };
      const isIcon =
        childType.displayName ||
        childType.name ||
        (childProps.className?.includes('lucide') || childProps['data-lucide']);
      
      if (isIcon) {
       return React.cloneElement(
        child as React.ReactElement<{ className?: string; style?: React.CSSProperties }>,
        {
          className: `${childProps.className || ''} text-current`.trim(),
          style: {
            ...(childProps.style || {}),
            stroke: 'currentColor',
            fill: 'none',
          },
        },
       );
      }
     }
     return child;
    })}
   </button>
 );
};

export default CTAButton;

