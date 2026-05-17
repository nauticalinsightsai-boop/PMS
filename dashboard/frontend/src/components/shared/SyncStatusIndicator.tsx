import React from 'react';
import { CloudCheck, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export type SyncStatus = 'synced' | 'syncing' | 'error' | 'pending';

interface SyncStatusIndicatorProps {
  status: SyncStatus;
  lastSynced?: Date;
  onManualSync?: () => void;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({ 
  status, 
  lastSynced, 
  onManualSync 
}) => {
  const configs = {
    synced: { icon: CloudCheck, text: 'Changes Saved', class: 'text-green-500' },
    syncing: { icon: RefreshCw, text: 'Syncing...', class: 'text-gw-accent-primary animate-spin' },
    error: { icon: AlertCircle, text: 'Sync Error', class: 'text-red-500' },
    pending: { icon: CloudOff, text: 'Unsaved Changes', class: 'text-yellow-500' },
  };

  const config = configs[status];

  return (
    <div className="flex items-center gap-4 bg-white/5 dark:bg-black/20 px-4 py-2 rounded-2xl border border-white/5">
      <div className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", config.class)}>
        <config.icon size={14} className={status === 'syncing' ? 'animate-spin' : ''} />
        {config.text}
      </div>
      
      {lastSynced && status === 'synced' && (
        <span className="text-[10px] text-gw-text-secondary font-medium">
          Last sync: {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}

      {onManualSync && (
        <button 
          onClick={onManualSync}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gw-text-secondary"
          title="Force Sync"
        >
          <RefreshCw size={12} />
        </button>
      )}
    </div>
  );
};
