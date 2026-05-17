import React from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Activity, Users, DollarSign, Globe, Star, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

const StatCard = ({ icon: Icon, label, value, trend }: any) => (
  <GlassCard variant="surface" className="p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-2xl bg-gw-accent-primary/10 text-gw-accent-primary">
        <Icon size={24} />
      </div>
      {trend && (
        <span className={cn(
          "text-[10px] font-bold px-2 py-1 rounded-full",
          trend > 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        )}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-gw-text-secondary text-xs font-bold uppercase tracking-widest">{label}</p>
    <h3 className="text-3xl font-black mt-1">{value}</h3>
  </GlassCard>
);

import { cn } from '../../lib/utils';

export const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black tracking-tight">System Overview</h1>
        <p className="text-gw-text-secondary mt-2">Welcome back. Everything is running smoothly across the platform.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Activity} label="Active Sessions" value="1,284" trend={12.5} />
        <StatCard icon={Users} label="Total Members" value="482" trend={3.2} />
        <StatCard icon={DollarSign} label="Monthly Revenue" value="$4,829" trend={-1.5} />
        <StatCard icon={Globe} label="Geo Reach" value="42" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 p-8" variant="raised">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Star className="text-gw-accent-primary" size={20} /> Performance Audit
            </h3>
            <button className="text-xs font-bold text-gw-accent-primary hover:underline flex items-center gap-1">
              FULL REPORT <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/10 rounded-3xl">
            <p className="text-gw-text-secondary text-sm italic">Growth chart visualization placeholder</p>
          </div>
        </GlassCard>

        <GlassCard className="p-8" variant="surface">
           <h3 className="text-xl font-bold mb-6">Recent Interactions</h3>
           <div className="space-y-6">
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="flex gap-4 items-start pb-6 border-b border-white/5 last:border-0 last:pb-0">
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-xs shrink-0">
                   {['JD', 'MS', 'AK', 'RB'][i-1]}
                 </div>
                 <div>
                   <p className="text-sm font-bold">New Booking Request</p>
                   <p className="text-xs text-gw-text-secondary mt-0.5">2 hours ago from discovery-call</p>
                 </div>
               </div>
             ))}
           </div>
        </GlassCard>
      </div>
    </div>
  );
};
