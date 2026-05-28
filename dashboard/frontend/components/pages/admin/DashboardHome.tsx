'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatChip } from '@/components/ui/stat-chip';
import { Activity, Users, DollarSign, Globe, Star, ArrowUpRight } from 'lucide-react';

const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  trend?: number;
}) => (
  <GlassCard variant="surface" className="p-6 premium-shadow">
    <div className="mb-4 flex items-start justify-between">
      <div className="rounded-2xl bg-brand-orange/10 p-3 text-brand-orange">
        <Icon size={24} />
      </div>
    </div>
    <StatChip
      label={label}
      subtitle={trend !== undefined ? `${trend > 0 ? '+' : ''}${trend}%` : undefined}
      className="mt-2 bg-transparent"
      valueClassName="text-3xl font-bold font-heading"
    >
      {value}
    </StatChip>
  </GlassCard>
);

export const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-section text-3xl md:text-4xl">System Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back. Everything is running smoothly across the platform.
        </p>
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
            <h3 className="text-xl font-bold font-heading flex items-center gap-2">
              <Star className="text-brand-orange" size={20} /> Performance Audit
            </h3>
            <button
              type="button"
              className="text-label normal-case text-brand-orange hover:underline flex items-center gap-1"
            >
              FULL REPORT <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-3xl">
            <p className="text-muted-foreground text-sm italic">Growth chart visualization placeholder</p>
          </div>
        </GlassCard>

        <GlassCard className="p-8" variant="surface">
          <h3 className="text-xl font-bold font-heading mb-6">Recent Interactions</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex gap-4 items-start pb-6 border-b border-border last:border-0 last:pb-0"
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-bold text-xs shrink-0">
                  {['JD', 'MS', 'AK', 'RB'][i - 1]}
                </div>
                <div>
                  <p className="text-sm font-bold">New Booking Request</p>
                  <p className="text-xs text-muted-foreground mt-0.5">2 hours ago from discovery-call</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
