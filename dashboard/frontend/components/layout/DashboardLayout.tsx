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
  PenLine,
  Newspaper,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { withBasePath, dashboardHref, normalizeDashboardPath } from '@/lib/base-path';
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

const MODE_TABS: Array<{
  id: DashboardMode;
  label: string;
  mobileLabel: string;
  icon: typeof PenLine;
}> = [
  { id: 'admin', label: 'Website', mobileLabel: 'Website', icon: PenLine },
  { id: 'editor', label: 'Newsletter', mobileLabel: 'News', icon: Newspaper },
  { id: 'bookings', label: 'Booking CRM', mobileLabel: 'Booking', icon: CalendarRange },
];

const SIDEBAR_COLLAPSED = 'calc(26px * 1.05 + 0.25rem)';
const SIDEBAR_EXPANDED = '18rem';
const SIDEBAR_ICON_SIZE = 23;

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { mode, setMode } = useDashboardMode();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarHovered, setSidebarHovered] = useState(false);
  const [hoveredMenuPath, setHoveredMenuPath] = useState<string | null>(null);
  const closeSidebarTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();
  const pathname = normalizeDashboardPath(usePathname() ?? '');

  const isSidebarExpanded = isSidebarOpen || isSidebarHovered;
  const currentRoutes = DASHBOARD_ROUTES[mode];
  const contentMaxWidth = 'max-w-7xl';

  useEffect(
    () => () => {
      if (closeSidebarTimeoutRef.current) clearTimeout(closeSidebarTimeoutRef.current);
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
    if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 1024px)').matches) return;
    clearCloseSidebarTimeout();
    setSidebarHovered(true);
  };

  const closeDesktopSidebarWithDelay = () => {
    clearCloseSidebarTimeout();
    closeSidebarTimeoutRef.current = setTimeout(() => {
      setSidebarHovered(false);
      setHoveredMenuPath(null);
    }, 200);
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = withBasePath('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItemClasses = cn(
    'dashboard-nav-item min-h-10',
    isSidebarExpanded
      ? 'px-3 py-2.5 pl-4'
      : 'lg:justify-center lg:px-0 lg:py-2 lg:min-h-10 lg:w-full',
  );

  return (
    <div
      className="flex h-dvh min-h-dvh w-full overflow-hidden bg-background text-foreground"
      id="dashboard-root"
    >
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
          />
        )}
      </AnimatePresence>

      {/* Desktop rail spacer — layout stays thin while sidebar overlays on hover */}
      <div
        className="hidden shrink-0 lg:block"
        style={{ width: SIDEBAR_COLLAPSED }}
        aria-hidden
      />

      <aside
        id="dashboard-sidebar"
        aria-expanded={isSidebarExpanded}
        aria-label="Dashboard navigation"
        onMouseEnter={openDesktopSidebar}
        onMouseLeave={closeDesktopSidebarWithDelay}
        style={
          {
            '--sidebar-width': isSidebarExpanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED,
          } as React.CSSProperties
        }
        className={cn(
          'dashboard-sidebar z-sidebar flex h-dvh min-h-dvh shrink-0 flex-col border-r border-border bg-card',
          'transition-[width,box-shadow] duration-200 ease-out motion-reduce:transition-none',
          'fixed inset-y-0 left-0 max-lg:w-64 max-lg:overflow-hidden',
          isSidebarOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full',
          'lg:fixed lg:translate-x-0',
          isSidebarExpanded
            ? 'lg:overflow-hidden lg:shadow-xl lg:ring-1 lg:ring-border/50'
            : 'lg:overflow-visible',
        )}
        data-expanded={isSidebarExpanded ? 'true' : 'false'}
      >
        <div
          className={cn(
            'flex shrink-0 items-center border-b border-border',
            isSidebarExpanded ? 'h-14 justify-between px-4' : 'h-12 justify-center px-0 lg:h-auto lg:min-h-12 lg:py-2',
          )}
        >
          {isSidebarExpanded ? (
            <Link href={dashboardHref('/dashboard/site-system/home')} className="flex min-w-0 items-center gap-2">
              <BrandLogo />
            </Link>
          ) : (
            <Link
              href={dashboardHref('/dashboard/site-system/home')}
              className="hidden lg:flex items-center justify-center"
              title="Website home editor"
            >
              <span className="cta-consultation flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-md text-[11px] font-black text-white">
                P
              </span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          className={cn(
            'min-h-0 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar',
            isSidebarExpanded ? 'space-y-5 px-3 py-4' : 'space-y-1 px-0 py-2 lg:px-0',
          )}
          aria-label="Main dashboard sections"
        >
          {currentRoutes.map((section) => (
            <div key={section.title} className="space-y-1">
              {isSidebarExpanded ? (
                <h3 className="px-2 pb-1 text-label">{section.title}</h3>
              ) : null}
              {section.items.map((item) => (
                <div
                  key={item.path}
                  className="relative group/menu-item"
                  onMouseEnter={() => {
                    if (item.subItems) setHoveredMenuPath(item.path);
                  }}
                  onMouseLeave={() => {
                    if (item.subItems) setHoveredMenuPath(null);
                  }}
                >
                  <DashboardNavLink
                    href={item.path}
                    exact={item.path === '/dashboard' || item.path.endsWith('/dashboard')}
                    className={navItemClasses}
                    title={!isSidebarExpanded ? item.name : undefined}
                  >
                    <item.icon
                      size={SIDEBAR_ICON_SIZE}
                      className={cn('shrink-0', isSidebarExpanded && 'mr-3')}
                      strokeWidth={2}
                    />
                    {isSidebarExpanded ? (
                      <span className="truncate">{item.name}</span>
                    ) : null}
                  </DashboardNavLink>

                  {item.subItems && isSidebarExpanded && (pathname.startsWith(item.path) || hoveredMenuPath === item.path) ? (
                    <div className="ml-8 mt-0.5 space-y-0.5 border-l border-border pl-2" role="group">
                      {item.subItems.map((sub) => (
                        <DashboardNavLink
                          key={sub.path}
                          href={sub.path}
                          className={(isActive) =>
                            cn(
                              'block rounded-md py-1.5 pl-2 text-xs transition-colors',
                              isActive
                                ? 'font-semibold text-brand-orange'
                                : 'text-muted-foreground hover:text-foreground',
                            )
                          }
                        >
                          {sub.name}
                        </DashboardNavLink>
                      ))}
                    </div>
                  ) : null}

                  {item.subItems && !isSidebarExpanded ? (
                    <div className="pointer-events-none absolute left-full top-0 z-[60] ml-1.5 hidden min-w-52 rounded-lg border border-border bg-popover p-1.5 opacity-0 shadow-lg transition-opacity group-hover/menu-item:pointer-events-auto group-hover/menu-item:opacity-100 group-focus-within/menu-item:pointer-events-auto group-focus-within/menu-item:opacity-100 lg:block">
                      <p className="px-2 py-1.5 text-label">{item.name}</p>
                      {item.subItems.map((sub) => (
                        <DashboardNavLink
                          key={sub.path}
                          href={sub.path}
                          className={(isActive) =>
                            cn(
                              'block rounded-md px-2 py-1.5 text-xs transition-colors',
                              isActive
                                ? 'bg-accent font-semibold text-accent-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                            )
                          }
                        >
                          {sub.name}
                        </DashboardNavLink>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </nav>

        {isSidebarExpanded ? (
          <div className="shrink-0 border-t border-border px-3 py-3 text-[10px] text-muted-foreground">
            PM Structure · Website CMS
          </div>
        ) : null}
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-center border-b border-border bg-background/95 px-4 backdrop-blur-sm md:px-6">
          <div className={cn('flex w-full items-center justify-between gap-3', contentMaxWidth, 'mx-auto')}>
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation menu"
                aria-controls="dashboard-sidebar"
                aria-expanded={isSidebarOpen}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
              >
                <Menu size={22} />
              </button>
              <Link href={dashboardHref('/dashboard/site-system/home')} className="lg:hidden">
                <BrandLogo size="sm" />
              </Link>
            </div>

            <div className="dashboard-segmented max-w-full shrink-0 overflow-x-auto">
              {MODE_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  data-active={mode === t.id}
                  onClick={() => setMode(t.id)}
                  className="dashboard-segmented-btn"
                >
                  <t.icon size={16} className="shrink-0" />
                  <span className="sm:hidden">{t.mobileLabel}</span>
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 md:gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden h-8 gap-1.5 lg:inline-flex"
                render={
                  <a
                    href={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                View site <ExternalLink size={12} />
              </Button>

              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Account menu"
                >
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="border-b border-border px-3 py-2">
                    <p className="truncate text-sm font-medium">{user?.email?.split('@')[0] || 'Admin'}</p>
                    <p className="text-xs text-muted-foreground">Administrator</p>
                  </div>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => void handleLogout()}
                    className="cursor-pointer"
                  >
                    <LogOut size={16} />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="relative flex-1 overflow-y-auto bg-dashboard-canvas scrollbar-thin px-4 py-5 md:px-6 md:py-6">
          <motion.div
            key={pathname}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className={cn('mx-auto w-full motion-reduce:transition-none', contentMaxWidth)}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
