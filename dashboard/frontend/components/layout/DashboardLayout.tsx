'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Menu,
  X,
  ExternalLink,
  Sun,
  Moon,
  LogOut,
  CalendarRange,
  Monitor,
  Newspaper,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardMode, DashboardMode } from '@/contexts/DashboardModeContext';
import { useTheme } from '@/components/shared/ThemeProvider';
import { DASHBOARD_ROUTES } from '@/constants/dashboardRoutes';
import { cn } from '@/lib/utils';
import { DashboardNavLink } from '@/components/DashboardNavLink';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { mode, setMode } = useDashboardMode();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarHovered, setSidebarHovered] = useState(false);
  const [hoveredMenuPath, setHoveredMenuPath] = useState<string | null>(null);
  const closeSidebarTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  const isSidebarExpanded = isSidebarOpen || isSidebarHovered;
  const currentRoutes = DASHBOARD_ROUTES[mode];
  const collapseDelayMs = 180;

  useEffect(
    () => () => {
      if (closeSidebarTimeoutRef.current) {
        clearTimeout(closeSidebarTimeoutRef.current);
      }
    },
    [],
  );

  const clearCloseSidebarTimeout = () => {
    if (closeSidebarTimeoutRef.current) {
      clearTimeout(closeSidebarTimeoutRef.current);
      closeSidebarTimeoutRef.current = null;
    }
  };

  const openDesktopSidebar = () => {
    if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 1024px)').matches) {
      return;
    }
    clearCloseSidebarTimeout();
    setSidebarHovered(true);
  };

  const closeDesktopSidebarWithDelay = () => {
    clearCloseSidebarTimeout();
    closeSidebarTimeoutRef.current = setTimeout(() => {
      setSidebarHovered(false);
      setHoveredMenuPath(null);
    }, collapseDelayMs);
  };

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
      'group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 motion-reduce:duration-0 motion-reduce:transform-none',
      !isSidebarExpanded && 'lg:justify-center lg:px-2',
      isActive
        ? 'bg-brand-orange/10 text-brand-orange font-semibold border-l-2 border-brand-orange'
        : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground',
    );

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground" id="dashboard-root">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          />
        )}
      </AnimatePresence>

      <aside
        id="dashboard-sidebar"
        aria-expanded={isSidebarExpanded}
        aria-label="Dashboard navigation"
        onMouseEnter={openDesktopSidebar}
        onMouseLeave={closeDesktopSidebarWithDelay}
        onFocusCapture={openDesktopSidebar}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            closeDesktopSidebarWithDelay();
          }
        }}
        className={cn(
          'fixed inset-y-0 left-0 z-sidebar flex flex-col bg-background/95 backdrop-blur-md border-r border-border',
          'transition-[width,transform] duration-300 ease-out motion-reduce:transition-none lg:translate-x-0 lg:static',
          isSidebarExpanded ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-[4.5rem]',
        )}
      >
        <div
          className={cn(
            'flex items-center h-[75px] border-b border-border shrink-0',
            isSidebarExpanded ? 'justify-between px-6' : 'justify-center px-2 lg:px-2',
          )}
        >
          {isSidebarExpanded ? (
            <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
              <BrandLogo />
            </Link>
          ) : (
            <Link href="/dashboard" className="hidden lg:flex items-center justify-center" title="Dashboard">
              <BrandLogo size="sm" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 lg:hidden text-muted-foreground hover:text-foreground"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-2 lg:px-2 space-y-8 no-scrollbar"
          aria-label="Main dashboard sections"
        >
          {currentRoutes.map((section) => (
            <div key={section.title} className="space-y-1">
              {isSidebarExpanded && <h3 className="px-3 text-label mb-3">{section.title}</h3>}
              {section.items.map((item) => (
                <div
                  key={item.path}
                  className="relative group/menu-item"
                  onMouseEnter={() => item.subItems && setHoveredMenuPath(item.path)}
                  onMouseLeave={() => item.subItems && setHoveredMenuPath(null)}
                >
                  <DashboardNavLink
                    href={item.path}
                    exact={item.path === '/dashboard' || item.path.endsWith('/dashboard')}
                    className={navItemClasses}
                    title={!isSidebarExpanded ? item.name : undefined}
                  >
                    <item.icon size={20} className={cn('shrink-0', isSidebarExpanded && 'mr-3')} />
                    <span
                      className={cn(
                        'truncate transition-all duration-200 motion-reduce:transition-none',
                        isSidebarExpanded
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-1 lg:sr-only lg:absolute',
                      )}
                    >
                      {item.name}
                    </span>
                  </DashboardNavLink>
                  {item.subItems &&
                    isSidebarExpanded &&
                    (pathname.startsWith(item.path) || hoveredMenuPath === item.path) && (
                      <div
                        className="ml-9 mt-1 space-y-1"
                        role="group"
                        aria-expanded={pathname.startsWith(item.path) || hoveredMenuPath === item.path}
                      >
                        {item.subItems.map((sub) => (
                          <DashboardNavLink
                            key={sub.path}
                            href={sub.path}
                            className={(isActive) =>
                              cn(
                                'flex items-center text-xs py-1.5 px-3 rounded-lg transition-colors motion-reduce:transition-none',
                                isActive
                                  ? 'text-brand-orange font-semibold'
                                  : 'text-muted-foreground hover:text-foreground',
                              )
                            }
                          >
                            {sub.name}
                          </DashboardNavLink>
                        ))}
                      </div>
                    )}
                  {item.subItems && !isSidebarExpanded && (
                    <div className="pointer-events-none absolute left-full top-0 z-50 ml-3 hidden min-w-56 rounded-xl border border-border bg-popover p-2 opacity-0 shadow-xl transition-all duration-200 group-hover/menu-item:pointer-events-auto group-hover/menu-item:opacity-100 group-focus-within/menu-item:pointer-events-auto group-focus-within/menu-item:opacity-100 motion-reduce:transition-none lg:block">
                      <p className="px-2 py-1 text-label">{item.name}</p>
                      <div className="mt-1 space-y-1">
                        {item.subItems.map((sub) => (
                          <DashboardNavLink
                            key={sub.path}
                            href={sub.path}
                            className={(isActive) =>
                              cn(
                                'flex items-center rounded-lg px-2.5 py-2 text-xs transition-colors motion-reduce:transition-none',
                                isActive
                                  ? 'text-brand-orange bg-brand-orange/10 font-semibold'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80',
                              )
                            }
                          >
                            {sub.name}
                          </DashboardNavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-[75px] flex items-center justify-between px-4 md:px-8 border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              aria-controls="dashboard-sidebar"
              aria-expanded={isSidebarOpen}
              className="p-2 lg:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu size={24} />
            </button>
            <Link href="/dashboard" className="lg:hidden flex items-center gap-2 mr-4">
              <BrandLogo />
            </Link>
          </div>

          <div className="flex items-center bg-muted/50 p-1 rounded-2xl border border-border max-w-full overflow-x-auto">
            {[
              { id: 'publisher', label: 'Publisher', icon: Newspaper },
              { id: 'bookings', label: 'Booking CRM', icon: CalendarRange },
              { id: 'website', label: 'Admin Controls', icon: Monitor },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setMode(t.id as DashboardMode)}
                className={cn(
                  'px-4 py-1.5 text-xs font-semibold rounded-xl transition-all duration-300 flex items-center gap-2',
                  mode === t.id
                    ? 'cta-consultation text-white shadow-lg shadow-brand-orange/20'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <t.icon size={14} className="shrink-0" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="brandOutline"
              size="sm"
              className="hidden lg:inline-flex gap-2"
              render={
                <a
                  href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              View Site <ExternalLink size={12} />
            </Button>

            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl border border-border bg-background hover:bg-muted transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-border">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold truncate max-w-[120px]">
                  {user?.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-label">
                  {(user?.user_metadata as { role?: string })?.role || 'Administrator'}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex h-10 w-10 items-center justify-center rounded-full cta-consultation text-sm font-bold text-white premium-shadow outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Account menu"
                >
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => void handleLogout()}
                    className="cursor-pointer"
                  >
                    <LogOut size={16} />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin relative p-4 md:p-8 bg-shell-gradient">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="max-w-7xl mx-auto motion-reduce:transition-none"
          >
            {children}
          </motion.div>

          <footer className="mt-20 py-8 border-t border-border bg-transparent">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <Link href="/dashboard">
                  <BrandLogo size="sm" />
                </Link>
                <div className="flex items-center gap-2 md:gap-8 text-label text-muted-foreground">
                  <span className="opacity-60 normal-case tracking-normal font-medium">
                    © {new Date().getFullYear()} PMS.OS
                  </span>
                  <div className="flex items-center gap-6">
                    <Link href="/dashboard/site-system/security" className="hover:text-brand-orange transition-colors">
                      Security Audit
                    </Link>
                    <Link href="/dashboard/site-system/settings" className="hover:text-brand-orange transition-colors">
                      Platform Config
                    </Link>
                    <Link href="/dashboard/site-system/analytics" className="hover:text-brand-orange transition-colors">
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
