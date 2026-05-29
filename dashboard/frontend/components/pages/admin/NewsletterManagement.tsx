'use client';

import React from 'react';
import { 
  Newspaper, 
  Users, 
  Send, 
  FileText, 
  TrendingUp, 
  Mail, 
  ArrowRight,
  Plus,
  Settings
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CTAButton } from '@/components/ui/CTAButton';
import { motion } from 'motion/react';
import Link from 'next/link';

export const NewsletterManagement: React.FC = () => {
  const stats = [
    { label: 'Total Subscribers', value: '1,284', icon: Users, color: 'text-brand-orange' },
    { label: 'Open Rate', value: '42.8%', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Sent Campaigns', value: '24', icon: Send, color: 'text-blue-500' },
    { label: 'Draft Articles', value: '5', icon: FileText, color: 'text-muted-foreground' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Newsletter Service</h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px] flex items-center gap-2">
            <Mail size={12} className="text-brand-orange" /> Audience Engagement & Marketing
          </p>
        </div>
        <div className="flex items-center gap-3">
           <CTAButton size="sm" variant="outline">
            <Settings size={16} className="mr-2" /> SETTINGS
          </CTAButton>
          <CTAButton size="sm" variant="primary">
            <Plus size={16} className="mr-2" /> NEW CAMPAIGN
          </CTAButton>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <GlassCard variant="surface" className="p-6">
              <div className="flex items-center gap-4">
                <div className={`${stat.color} bg-current/10 p-3 rounded-2xl`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-xl font-black">{stat.value}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Portal Section */}
        <GlassCard className="p-8 border-brand-orange/20 bg-brand-orange/[0.02]">
          <div className="flex items-start justify-between mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center premium-shadow">
              <FileText size={24} />
            </div>
            <Link 
              href="/dashboard/booking-crm/blogs"
              className="text-[10px] font-black uppercase tracking-widest text-brand-orange hover:underline flex items-center gap-2"
            >
              GO TO BLOGS <ArrowRight size={12} />
            </Link>
          </div>
          
          <h2 className="text-2xl font-black mb-4">Blogs & Insights Editor</h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Manage your articles, certification guides, and community insights. All published articles are automatically synced with your next newsletter campaign to keep your audience updated.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <FileText size={18} className="text-muted-foreground group-hover:text-brand-orange transition-colors" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Latest: Certification Strategies 2024</p>
                <p className="text-[10px] text-brand-orange font-black uppercase tracking-widest">Published • 2 days ago</p>
              </div>
            </div>
          </div>

          <Link href="/dashboard/booking-crm/blogs" className="block mt-8">
            <CTAButton className="w-full">
              Open Content Editor <ArrowRight size={18} className="ml-2" />
            </CTAButton>
          </Link>
        </GlassCard>

        {/* Campaign Section */}
        <GlassCard className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/5 text-brand-orange flex items-center justify-center border border-white/10">
              <Mail size={24} />
            </div>
          </div>
          
          <h2 className="text-2xl font-black mb-4">Campaign Management</h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Design and schedule your email campaigns. Use our dynamic templates to showcase your latest certifications and blog posts to your subscribers.
          </p>

          <div className="space-y-4">
            <div className="p-6 rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                <Plus size={24} />
              </div>
              <div>
                <p className="text-sm font-bold">No active campaigns</p>
                <p className="text-xs text-muted-foreground mt-1">Ready to engage your audience? Start by creating your first campaign.</p>
              </div>
              <CTAButton size="sm" variant="outline">CREATE CAMPAIGN</CTAButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
