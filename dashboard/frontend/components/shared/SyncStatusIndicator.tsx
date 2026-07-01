'use client';

import React from 'react';
import { CloudCheck, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SyncStatus = 'synced' | 'syncing' | 'error' | 'pending';

interface SyncStatusIndicatorProps {
  status: SyncStatus;
  lastSynced?: Date;
  onManualSync?: () => void;
  errorDetail?: string | null;
  isManualSyncing?: boolean;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  status,
  lastSynced,
  onManualSync,
  errorDetail,
  isManualSyncing = false,
}) => {
  const configs = {
    synced: { icon: CloudCheck, text: 'Changes saved', class: 'text-emerald-600 dark:text-emerald-400' },
    syncing: { icon: RefreshCw, text: 'Saving…', class: 'text-brand-orange' },
    error: { icon: AlertCircle, text: 'Save failed', class: 'text-destructive' },
    pending: { icon: CloudOff, text: 'Unsaved changes', class: 'text-amber-600 dark:text-amber-400' },
  };

  const config = configs[status];
  const showSpin = status === 'syncing' || isManualSyncing;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-border">
        <div
          className={cn(
            'flex items-center gap-2 text-label normal-case tracking-wide',
            config.class,
          )}
        >
          <config.icon
            size={14}
            className={cn(showSpin && 'motion-safe:animate-spin [animation-duration:1.25s]')}
          />
          {config.text}
        </div>

        {lastSynced && status === 'synced' && (
          <span className="text-xs text-muted-foreground font-medium">
            {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}

        {onManualSync && (
          <button
            type="button"
            onClick={onManualSync}
            disabled={showSpin}
            className="p-1 hover:bg-muted rounded-lg transition-colors text-muted-foreground disabled:opacity-50"
            title="Reload from server"
          >
            <RefreshCw
              size={12}
              className={cn(isManualSyncing && 'motion-safe:animate-spin [animation-duration:1.25s]')}
            />
          </button>
        )}
      </div>
      {status === 'error' && errorDetail ? (
        <p className="text-xs text-destructive max-w-md px-1">{errorDetail}</p>
      ) : null}
    </div>
  );
};
