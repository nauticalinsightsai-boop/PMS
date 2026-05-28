'use client'

import React from 'react';
import { useLiquidGlass } from '@/hooks/useLiquidGlass';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
 elevation?: 'surface' | 'raised' | 'modal';
 hover?: boolean;
 liquid?: boolean;
 liquidIntensity?: number;
}

/**
 * GlassCard - Frosted glass morphism card component
 * 
 * Uses design tokens for glass surface effects:
 * - Glass background (--glass-bg-light/dark)
 * - Glass blur (--glass-blur)
 * - Elevation shadows (--shadow-surface/raised/modal)
 * - Consistent radius via .r-card (--r-card token)
 * 
 * NO visible borders - uses elevation shadows only
 * Dark mode uses light shadows for visibility
 */
const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(({ 
 elevation = 'raised', 
 className = '', 
 children,
 hover = true,
 liquid = true,
 liquidIntensity = 0.85,
 onMouseMove: onMouseMoveProp,
 onMouseLeave: onMouseLeaveProp,
 style: styleProp,
 ...rest
}, forwardedRef) => {
 const shadowClass = {
  surface: 'shadow-surface',
  raised: 'shadow-raised',
  modal: 'shadow-modal',
 }[elevation];

 const hoverClass = hover 
  ? 'hover-lift hover-scale hover-glow' 
  : '';

 const { ref: liquidRef, onMouseMove, onMouseLeave, style } = useLiquidGlass({
  enabled: liquid,
  intensity: liquidIntensity,
 });

 // Merge forwarded ref with liquid glass ref
 const mergedRef = (node: HTMLDivElement | null) => {
  // Set liquid glass ref (it's a RefObject)
  if (liquidRef) {
   (liquidRef as React.MutableRefObject<HTMLElement | null>).current = node;
  }
  
  // Set forwarded ref
  if (typeof forwardedRef === 'function') {
   forwardedRef(node);
  } else if (forwardedRef) {
   forwardedRef.current = node;
  }
 };

 const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
  onMouseMoveProp?.(e);
  onMouseMove(e as unknown as React.MouseEvent<HTMLElement>);
 };

 const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = (e) => {
  onMouseLeaveProp?.(e);
  onMouseLeave();
 };

 const mergedStyle = { ...(styleProp || {}), ...(style || {}) } as React.CSSProperties;

 return (
  <div 
   className={`
    glass-surface 
    ${liquid ? 'glass-liquid' : ''}
    ${shadowClass} 
    r-card
    ${hoverClass}
    w-full
    ${className}
   `.trim().replace(/\s+/g, ' ')}
   ref={mergedRef}
   onMouseMove={handleMouseMove}
   onMouseLeave={handleMouseLeave}
   style={mergedStyle}
   {...rest}
  >
   {liquid && <div className="glass-liquid-overlay w-full" aria-hidden="true" />}
   {children}
  </div>
 );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;
