'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  ExternalLink,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  ChevronDown,
  Share2,
  CalendarRange,
  Monitor,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardMode, DashboardMode } from '@/contexts/DashboardModeContext';
import { useTheme } from '@/components/shared/ThemeProvider';
import { DASHBOARD_ROUTES } from '@/constants/dashboardRoutes';
import { cn } from '@/lib/utils';
import { DashboardNavLink } from '@/components/DashboardNavLink';
import { GlassCard } from '@/components/ui/GlassCard';
import { BrandLogo } from '@/components/shared/BrandLogo';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { mode, setMode } = useDashboardMode();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const currentRoutes = DASHBOARD_ROUTES[mode];

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItemClasses = (isActive: boolean) =>
    cn(
      'group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200',
      isActive
        ? 'bg-gw-accent-primary/10 text-gw-accent-primary'
        : 'text-gw-text-secondary hover:bg-white/10 dark:hover:bg-black/20 hover:text-gw-text-primary',
    );

  return (
    <div className="flex h-screen overflow-hidden bg-gw-bg-primary text-gw-text-primary" id="dashboard-root">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-gw-bg-secondary border-r border-white/10 transition-all duration-300 transform lg:translate-x-0 lg:static',
          isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:w-72',
          isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72',
        )}
      >
        <div className="flex items-center justify-between h-[75px] px-6 border-b border-white/5">
          {!isSidebarCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <BrandLogo />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 lg:hidden text-gw-text-secondary hover:text-gw-text-primary"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
          {currentRoutes.map((section) => (
            <div key={section.title} className="space-y-1">
              {!isSidebarCollapsed && (
                <h3 className="px-3 text-xs font-bold text-gw-text-secondary uppercase tracking-widest mb-3">
                  {section.title}
                </h3>
              )}
              {section.items.map((item) => (
                <div key={item.path}>
                  <DashboardNavLink
                    href={item.path}
                    exact={item.path.endsWith('/dashboard')}
                    className={navItemClasses}
                  >
                    <item.icon size={20} className={cn(!isSidebarCollapsed && 'mr-3')} />
                    {!isSidebarCollapsed && <span>{item.name}</span>}
                  </DashboardNavLink>
                  {item.subItems && !isSidebarCollapsed && pathname.startsWith(item.path) && (
                    <div className="ml-9 mt-1 space-y-1">
                      {item.subItems.map((sub) => (
                        <DashboardNavLink
                          key={sub.path}
                          href={sub.path}
                          className={(isActive) =>
                            cn(
                              'flex items-center text-xs py-1.5 px-3 rounded-lg transition-colors',
                              isActive
                                ? 'text-gw-accent-primary'
                                : 'text-gw-text-secondary hover:text-gw-text-primary',
                            )
                          }
                        >
                          {sub.name}
                        </DashboardNavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-gw-text-secondary hover:bg-white/5 transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} className="rotate-90" />}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-[75px] flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-gw-bg-secondary/50 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 lg:hidden text-gw-text-secondary hover:text-gw-text-primary"
            >
              <Menu size={24} />
            </button>
            <Link href="/dashboard" className="lg:hidden flex items-center gap-2 mr-4">
              <BrandLogo />
            </Link>
          </div>

          <div className="hidden md:flex items-center bg-white/5 dark:bg-black/20 p-1 rounded-2xl border border-white/5">
            {[
              { id: 'social', label: 'Social Media', icon: Share2 },
              { id: 'bookings', label: 'Members & Revenue', icon: CalendarRange },
              { id: 'website', label: 'Admin Controls', icon: Monitor },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setMode(t.id as DashboardMode)}
                className={cn(
                  'px-4 py-1.5 text-xs font-semibold rounded-xl transition-all duration-300 flex items-center gap-2',
                  mode === t.id
                    ? 'bg-gw-accent-primary text-white shadow-lg shadow-gw-accent-primary/20'
                    : 'text-gw-text-secondary hover:text-gw-text-primary',
                )}
              >
                <t.icon size={14} />
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <a
              href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3050'}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
            >
              View Site <ExternalLink size={12} />
            </a>

            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-white/10">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold truncate max-w-[120px]">
                  {user?.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-[10px] text-gw-text-secondary uppercase tracking-widest font-bold">
                  {(user?.user_metadata as { role?: string })?.role || 'Administrator'}
                </p>
              </div>
              <div className="relative group">
                <div className="w-10 h-10 rounded-full bg-gw-accent-primary text-white flex items-center justify-center font-bold text-sm premium-shadow">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="absolute right-0 top-full pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
                  <GlassCard variant="raised" className="p-2 w-48">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </GlassCard>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar relative p-4 md:p-8 bg-gw-bg-primary">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>

          <footer className="mt-20 py-8 border-t border-white/5 bg-gw-bg-primary">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <Link href="/dashboard">
                  <BrandLogo size="sm" />
                </Link>
                <div className="flex items-center gap-2 md:gap-8 text-[10px] font-bold uppercase tracking-widest text-gw-text-secondary">
                  <span className="opacity-40">© {new Date().getFullYear()} PMS.OS</span>
                  <div className="flex items-center gap-6">
                    <Link href="/dashboard/site-system/security" className="hover:text-gw-accent-primary transition-colors">
                      Security Audit
                    </Link>
                    <Link href="/dashboard/site-system/settings" className="hover:text-gw-accent-primary transition-colors">
                      Platform Config
                    </Link>
                    <Link href="/dashboard/site-system/analytics" className="hover:text-gw-accent-primary transition-colors">
                      System Logs
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
