'use client'

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CTAButton } from '@/components/ui/CTAButton';

interface EmptyStateProps {
 icon?: LucideIcon | React.ReactNode;
 title: string;
 description?: string;
 action?: {
  label: string;
  onClick: () => void;
 };
 secondaryAction?: {
  label: string;
  onClick: () => void;
 };
 className?: string;
}

/**
 * EmptyState - Component for displaying empty states
 * 
 * Used when lists, tables, or content areas are empty.
 * Provides a consistent empty state UI with optional actions.
 * 
 * Usage:
 * <EmptyState
 *  icon={FileText}
 *  title="No posts found"
 *  description="Create your first post to get started."
 *  action={{ label: "Create Post", onClick: handleCreate }}
 * />
 */
const EmptyState: React.FC<EmptyStateProps> = ({
 icon: Icon,
 title,
 description,
 action,
 secondaryAction,
 className = '',
}) => {
 const renderIcon = () => {
  if (!Icon) return null;
  
  if (React.isValidElement(Icon)) {
   return <div className="mb-4">{Icon}</div>;
  }
  
  const IconComponent = Icon as LucideIcon;
  return (
   <div className="w-16 h-16 bg-brand-subtle dark:bg-brand-subtle/50 rounded-full flex items-center justify-center mx-auto mb-4">
    <IconComponent className="w-8 h-8 text-brand-muted" />
   </div>
  );
 };

 return (
  <GlassCard variant="surface" className={`text-center py-12 px-6 ${className}`}>
   {renderIcon()}
   <h3 className="text-h3 text-brand-text mb-2">{title}</h3>
   {description && (
    <p className="text-body text-brand-muted mb-6 max-w-md mx-auto">
     {description}
    </p>
   )}
   {(action || secondaryAction) && (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
     {action && (
      <CTAButton onClick={action.onClick} variant="primary">
       {action.label}
      </CTAButton>
     )}
     {secondaryAction && (
      <CTAButton onClick={secondaryAction.onClick} variant="secondary">
       {secondaryAction.label}
      </CTAButton>
     )}
    </div>
   )}
  </GlassCard>
 );
};

export default EmptyState;




