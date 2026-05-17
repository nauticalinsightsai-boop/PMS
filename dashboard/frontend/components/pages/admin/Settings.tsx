'use client';

import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Save } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CTAButton } from '@/components/ui/CTAButton';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black tracking-tight">Platform Configuration</h1>
        <p className="text-gw-text-secondary mt-2">Manage your system preferences and administrative profile.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tab Sidebar */}
        <div className="lg:w-64 shrink-0">
          <GlassCard className="p-2" variant="surface">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                  activeTab === tab.id 
                    ? "bg-gw-accent-primary text-white shadow-lg shadow-gw-accent-primary/20" 
                    : "text-gw-text-secondary hover:bg-white/5 hover:text-gw-text-primary"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </GlassCard>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-8" variant="raised">
                <form className="space-y-8">
                  {activeTab === 'general' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold border-b border-white/5 pb-4">General Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-gw-text-secondary ml-1">Platform Name</label>
                          <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-gw-accent-primary outline-none" defaultValue="PMS.OS" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-gw-text-secondary ml-1">Domain</label>
                          <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-gw-accent-primary outline-none" defaultValue="platform.abdullah.dev" />
                        </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-gw-text-secondary ml-1">Public Description</label>
                         <textarea className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-gw-accent-primary outline-none h-32" defaultValue="Personal platform operating system and brand hub." />
                      </div>
                    </div>
                  )}

                  {activeTab === 'profile' && (
                    <div className="space-y-6">
                       <h3 className="text-xl font-bold border-b border-white/5 pb-4">Admin Profile</h3>
                       <div className="flex items-center gap-6 mb-8">
                         <div className="w-24 h-24 rounded-3xl bg-gw-accent-primary flex items-center justify-center text-3xl font-black text-white premium-shadow">SA</div>
                         <div>
                           <CTAButton variant="secondary" size="sm">Change Avatar</CTAButton>
                           <p className="text-[10px] text-gw-text-secondary mt-2 uppercase font-bold tracking-widest">JPG, PNG or GIF. Max 800KB.</p>
                         </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-gw-text-secondary ml-1">Display Name</label>
                          <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-gw-accent-primary outline-none" defaultValue="Sheikh Abdullah" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-gw-text-secondary ml-1">Professional Title</label>
                          <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-gw-accent-primary outline-none" defaultValue="Founder & CEO" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold border-b border-white/5 pb-4">Communication</h3>
                      <div className="space-y-4">
                        {[
                          { id: 'email_alerts', label: 'Email Notifications', desc: 'Receive daily summary of interactions and revenue.' },
                          { id: 'sms_otp', label: 'SMS Security Codes', desc: 'Required for administrative actions and logins.' },
                          { id: 'system_logs', label: 'System Audit Logs', desc: 'Log every administrative interaction to the database.' },
                        ].map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 transition-colors hover:border-gw-accent-primary/20">
                            <div>
                              <p className="text-sm font-bold">{item.label}</p>
                              <p className="text-xs text-gw-text-secondary mt-1">{item.desc}</p>
                            </div>
                            <div className="w-12 h-6 bg-gw-accent-primary rounded-full relative cursor-pointer shadow-inner">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="space-y-6">
                       <h3 className="text-xl font-bold border-b border-white/5 pb-4">Account Security</h3>
                       <div className="space-y-6">
                          <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
                             <h4 className="flex items-center gap-2 text-yellow-500 text-sm font-bold mb-2">
                               <Shield size={16} /> TWO-FACTOR AUTHENTICATION
                             </h4>
                             <p className="text-xs text-gw-text-secondary leading-relaxed">
                               Your account is currently protected by standard password auth. We recommend enabling SMS or App-based 2FA to prevent unauthorized access to the platform OS.
                             </p>
                             <CTAButton variant="primary" size="sm" className="mt-4 bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20">ENABLE 2FA</CTAButton>
                          </div>

                          <div className="space-y-2">
                             <label className="text-xs font-bold uppercase tracking-widest text-gw-text-secondary ml-1">Current Password</label>
                             <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-gw-accent-primary outline-none" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-gw-text-secondary ml-1">New Password</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-gw-accent-primary outline-none" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-widest text-gw-text-secondary ml-1">Confirm Password</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-gw-accent-primary outline-none" />
                            </div>
                          </div>
                       </div>
                    </div>
                  )}

                  <div className="pt-8 border-t border-white/5 flex justify-end">
                    <CTAButton type="submit">
                      <Save size={18} className="mr-2" /> SAVE CHANGES
                    </CTAButton>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
