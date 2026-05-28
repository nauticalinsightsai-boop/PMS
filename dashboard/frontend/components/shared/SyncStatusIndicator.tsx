import React from 'react';
import { CloudCheck, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SyncStatus = 'synced' | 'syncing' | 'error' | 'pending';

interface SyncStatusIndicatorProps {
  status: SyncStatus;
  lastSynced?: Date;
  onManualSync?: () => void;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  status,
  lastSynced,
  onManualSync,
}) => {
  const configs = {
    synced: { icon: CloudCheck, text: 'Changes Saved', class: 'text-emerald-600 dark:text-emerald-400' },
    syncing: { icon: RefreshCw, text: 'Syncing...', class: 'text-brand-orange animate-spin' },
    error: { icon: AlertCircle, text: 'Sync Error', class: 'text-destructive' },
    pending: { icon: CloudOff, text: 'Unsaved Changes', class: 'text-amber-600 dark:text-amber-400' },
  };

  const config = configs[status];

  return (
    <div className="flex items-center gap-4 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-border">
      <div
        className={cn(
          'flex items-center gap-2 text-label normal-case tracking-wide',
          config.class,
        )}
      >
        <config.icon size={14} className={status === 'syncing' ? 'animate-spin' : ''} />
        {config.text}
      </div>

      {lastSynced && status === 'synced' && (
        <span className="text-xs text-muted-foreground font-medium">
          Last sync: {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}

      {onManualSync && (
        <button
          type="button"
          onClick={onManualSync}
          className="p-1 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
          title="Force Sync"
        >
          <RefreshCw size={12} />
        </button>
      )}
    </div>
  );
};
