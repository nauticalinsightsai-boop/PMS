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
  syncedLabel?: string;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  status,
  lastSynced,
  onManualSync,
  errorDetail,
  isManualSyncing = false,
  syncedLabel,
}) => {
  const configs = {
    synced: {
      icon: CloudCheck,
      text: syncedLabel ?? 'Changes saved',
      class: 'text-emerald-600 dark:text-emerald-400',
    },
    syncing: { icon: RefreshCw, text: 'Saving…', class: 'text-brand-orange' },
    error: { icon: AlertCircle, text: 'Save failed', class: 'text-destructive' },
    pending: { icon: CloudOff, text: 'Unsaved changes', class: 'text-amber-600 dark:text-amber-400' },
  };

  const config = configs[status];
  const isBusy = status === 'syncing' || isManualSyncing;
  const StatusIcon = config.icon;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-border">
        <div
          className={cn(
            'flex items-center gap-2 text-label normal-case tracking-wide',
            config.class,
          )}
        >
          {isBusy ? (
            <span
              className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center"
              aria-hidden
            >
              <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-brand-orange/35 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange" />
            </span>
          ) : (
            <StatusIcon size={14} className="shrink-0" aria-hidden />
          )}
          <span>{config.text}</span>
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
            disabled={isBusy}
            className="p-1 hover:bg-muted rounded-lg transition-colors text-muted-foreground disabled:opacity-50"
            title="Reload from server"
          >
            <RefreshCw
              size={12}
              aria-hidden
              className={cn(
                'shrink-0 origin-center',
                isManualSyncing && 'motion-safe:animate-spin [animation-duration:1.25s]',
              )}
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
