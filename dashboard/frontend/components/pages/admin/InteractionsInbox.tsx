'use client';

import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { InteractionService, Interaction } from '@/services/InteractionService';
import { GlassCard } from '@/components/ui/GlassCard';
import { CTAButton } from '@/components/ui/CTAButton';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const InteractionsInbox: React.FC = () => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [filter, setFilter] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');

  const fetchInteractions = async () => {
    setIsLoading(true);
    try {
      const { data } = await InteractionService.getInteractions();
      setInteractions(data || []);
    } catch (error) {
      console.error('Error fetching interactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, []);

  const handleRetry = async (id: string) => {
    try {
      await InteractionService.retrySheetsSync(id);
      fetchInteractions();
    } catch (err) {
      alert('Retry failed');
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'synced':
        return <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter"><CheckCircle2 size={10} /> Synced</span>;
      case 'failed':
        return <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter"><AlertCircle size={10} /> Failed</span>;
      case 'pending':
        return <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter"><Clock size={10} /> Pending</span>;
      default:
        return <span className="flex items-center gap-1 text-[10px] font-bold text-gw-text-secondary bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">N/A</span>;
    }
  };

  const filteredInteractions = interactions.filter(i => {
    const matchesSearch = i.email.toLowerCase().includes(filter.toLowerCase()) || 
                          i.subject.toLowerCase().includes(filter.toLowerCase());
    const matchesSource = selectedSource === 'all' || i.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Interaction Inbox</h1>
          <p className="text-gw-text-secondary font-medium uppercase tracking-widest text-[10px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Form Pipeline Monitor
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CTAButton variant="secondary" size="sm" onClick={() => InteractionService.exportCSV()}>
            <Download size={14} className="mr-2" /> EXPORT CSV
          </CTAButton>
          <CTAButton size="sm" onClick={fetchInteractions} isLoading={isLoading}>
            <RefreshCw size={14} className={cn("mr-2", isLoading && "animate-spin")} /> REFRESH
          </CTAButton>
        </div>
      </header>

      <GlassCard className="p-4" variant="surface">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gw-text-secondary" size={18} />
            <input
              type="text"
              placeholder="Search by email or subject..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gw-accent-primary"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={18} className="text-gw-text-secondary ml-2" />
            <select 
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-sm focus:outline-none outline-none cursor-pointer"
            >
              <option value="all">All Sources</option>
              <option value="contact">Contact Form</option>
              <option value="newsletter">Newsletter</option>
              <option value="booking">Bookings</option>
            </select>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
             [1,2,3,4,5].map(i => (
               <div key={i} className="h-24 bg-white/5 animate-pulse rounded-3xl" />
             ))
          ) : filteredInteractions.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
              <Inbox size={48} className="mx-auto text-gw-text-secondary mb-4 opacity-20" />
              <p className="text-gw-text-secondary font-medium">No interactions found matching your criteria.</p>
            </div>
          ) : (
            filteredInteractions.map((interaction) => (
              <motion.div
                key={interaction.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="p-6 hover:bg-white/50 dark:hover:bg-black/30 transition-colors group cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gw-accent-primary/10 text-gw-accent-primary flex items-center justify-center shrink-0">
                        <Inbox size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-sm tracking-tight">{interaction.subject || 'Unknown Subject'}</h3>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gw-accent-primary bg-gw-accent-primary/10 px-2 py-0.5 rounded-md">
                            {interaction.source}
                          </span>
                        </div>
                        <p className="text-xs text-gw-text-secondary font-medium flex items-center gap-2">
                          {interaction.email} • {formatDistanceToNow(new Date(interaction.created_at))} ago
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 justify-between md:justify-end">
                      <div className="text-right flex flex-col items-end gap-1">
                        <p className="text-[10px] font-bold text-gw-text-secondary uppercase tracking-[2px]">Sheets Status</p>
                        {getStatusBadge(interaction.sheets_status)}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {interaction.sheets_status === 'failed' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRetry(interaction.id); }}
                            className="p-2 text-gw-accent-primary hover:bg-gw-accent-primary/10 rounded-xl transition-colors"
                            title="Retry Sheets Sync"
                          >
                            <RefreshCw size={18} />
                          </button>
                        )}
                        <button className="p-2 text-gw-text-secondary hover:text-gw-text-primary rounded-xl transition-colors">
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
