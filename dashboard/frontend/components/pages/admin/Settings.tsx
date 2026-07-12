'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings as SettingsIcon, User, Bell, Shield, Save, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CTAButton } from '@/components/ui/CTAButton';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FIELD_KEYS,
  defaultSiteSettings,
  parseSiteSettings,
  type SiteSettings,
} from '@pms/site-content';
import { useSiteDocumentDraft } from '@/hooks/useSiteDocumentDraft';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import { withBasePath } from '@/lib/base-path';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-orange outline-none';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { config, setConfig, setBaseline, isLoading, loadError, updatedAt } =
    useSiteDocumentDraft(FIELD_KEYS.SITE_SETTINGS, defaultSiteSettings, parseSiteSettings);

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const patchGeneral = (patch: Partial<SiteSettings['general']>) => {
    setConfig((c) => ({ ...c, general: { ...c.general, ...patch } }));
  };

  const patchProfile = (patch: Partial<SiteSettings['profile']>) => {
    setConfig((c) => ({ ...c, profile: { ...c.profile, ...patch } }));
  };

  const patchNotifications = (key: keyof SiteSettings['notifications'], value: boolean) => {
    setConfig((c) => ({
      ...c,
      notifications: { ...c.notifications, [key]: value },
    }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    setSaveError(null);
    try {
      await WebsiteDataService.saveDraft(
        FIELD_KEYS.SITE_SETTINGS,
        config as unknown as Record<string, unknown>,
        { publish: true },
      );
      setBaseline(JSON.stringify(config));
      setSaveMessage('Settings saved and published.');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({
    on,
    onToggle,
  }: {
    on: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={cn(
        'relative h-6 w-12 rounded-full shadow-inner transition-colors',
        on ? 'bg-brand-orange' : 'bg-white/20',
      )}
    >
      <span
        className={cn(
          'absolute top-1 h-4 w-4 rounded-full bg-white transition-all',
          on ? 'right-1' : 'left-1',
        )}
      />
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading settings…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black tracking-tight">Platform Configuration</h1>
        <p className="mt-2 text-muted-foreground">
          Manage public platform identity and admin preferences.
          {updatedAt ? (
            <span className="ml-2 text-xs">Last synced: {new Date(updatedAt).toLocaleString()}</span>
          ) : null}
        </p>
        {loadError ? <p className="mt-2 text-sm text-red-400">{loadError}</p> : null}
      </header>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        orientation="vertical"
        className="flex flex-col gap-8 lg:flex-row"
      >
        <div className="shrink-0 lg:w-64">
          <GlassCard className="p-2" variant="surface">
            <TabsList variant="line" className="flex h-auto w-full flex-col gap-1 bg-transparent p-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    'w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-bold data-active:bg-brand-orange data-active:text-white data-active:shadow-lg data-active:shadow-brand-orange/20',
                  )}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </GlassCard>
        </div>

        <div className="flex-1">
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0 outline-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard className="p-8" variant="raised">
                    <form className="space-y-8" onSubmit={handleSave}>
                      {tab.id === 'general' && (
                        <div className="space-y-6">
                          <h3 className="border-b border-white/5 pb-4 text-xl font-bold">
                            General Settings
                          </h3>
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                              <label className="ml-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Platform Name
                              </label>
                              <input
                                type="text"
                                className={inputClass}
                                value={config.general.platformName}
                                onChange={(e) => patchGeneral({ platformName: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="ml-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Domain
                              </label>
                              <input
                                type="text"
                                className={inputClass}
                                value={config.general.domain}
                                onChange={(e) => patchGeneral({ domain: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="ml-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                              Public Description
                            </label>
                            <textarea
                              className={cn(inputClass, 'h-32')}
                              value={config.general.publicDescription}
                              onChange={(e) => patchGeneral({ publicDescription: e.target.value })}
                            />
                          </div>
                        </div>
                      )}

                      {tab.id === 'profile' && (
                        <div className="space-y-6">
                          <h3 className="border-b border-white/5 pb-4 text-xl font-bold">
                            Admin Profile
                          </h3>
                          <div className="mb-8 flex items-center gap-6">
                            <div className="premium-shadow flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-orange text-3xl font-black text-white">
                              {(config.profile.displayName || 'SA')
                                .split(/\s+/)
                                .map((p) => p[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Display name is used in admin UI. Author photos for newsletter are
                              managed under Newsletter → Authors.
                            </p>
                          </div>
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                              <label className="ml-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Display Name
                              </label>
                              <input
                                type="text"
                                className={inputClass}
                                value={config.profile.displayName}
                                onChange={(e) => patchProfile({ displayName: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="ml-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Professional Title
                              </label>
                              <input
                                type="text"
                                className={inputClass}
                                value={config.profile.professionalTitle}
                                onChange={(e) =>
                                  patchProfile({ professionalTitle: e.target.value })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {tab.id === 'notifications' && (
                        <div className="space-y-6">
                          <h3 className="border-b border-white/5 pb-4 text-xl font-bold">
                            Communication
                          </h3>
                          <div className="space-y-4">
                            {(
                              [
                                {
                                  key: 'emailAlerts' as const,
                                  label: 'Email Notifications',
                                  desc: 'Receive daily summary of interactions and revenue.',
                                },
                                {
                                  key: 'smsOtp' as const,
                                  label: 'SMS Security Codes',
                                  desc: 'Required for administrative actions and logins.',
                                },
                                {
                                  key: 'systemLogs' as const,
                                  label: 'System Audit Logs',
                                  desc: 'Log every administrative interaction to the database.',
                                },
                              ] as const
                            ).map((item) => (
                              <div
                                key={item.key}
                                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:border-brand-orange/20"
                              >
                                <div>
                                  <p className="text-sm font-bold">{item.label}</p>
                                  <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                                </div>
                                <Toggle
                                  on={config.notifications[item.key]}
                                  onToggle={() =>
                                    patchNotifications(item.key, !config.notifications[item.key])
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {tab.id === 'security' && (
                        <div className="space-y-6">
                          <h3 className="border-b border-white/5 pb-4 text-xl font-bold">
                            Account Security
                          </h3>
                          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6">
                            <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-yellow-500">
                              <Shield size={16} /> LOGIN &amp; 2FA
                            </h4>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              Password reset, phone OTP, and login security settings live on the
                              dedicated Security page — not in this form.
                            </p>
                            <Link
                              href={withBasePath('/dashboard/site-system/security')}
                              className="mt-4 inline-flex"
                            >
                              <CTAButton type="button" variant="primary" size="sm">
                                Open Security settings
                              </CTAButton>
                            </Link>
                          </div>
                        </div>
                      )}

                      {tab.id !== 'security' ? (
                        <div className="flex items-center justify-end gap-4 border-t border-white/5 pt-8">
                          {saveError ? (
                            <p className="text-sm text-red-400">{saveError}</p>
                          ) : null}
                          {saveMessage ? (
                            <p className="text-sm text-emerald-400">{saveMessage}</p>
                          ) : null}
                          <CTAButton type="submit" disabled={saving}>
                            {saving ? (
                              <Loader2 size={18} className="mr-2 animate-spin" />
                            ) : (
                              <Save size={18} className="mr-2" />
                            )}
                            SAVE CHANGES
                          </CTAButton>
                        </div>
                      ) : null}
                    </form>
                  </GlassCard>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};
