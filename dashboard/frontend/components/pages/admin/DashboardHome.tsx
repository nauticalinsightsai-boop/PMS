'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  FileText,
  Layers,
  Rocket,
  RefreshCw,
  Pencil,
  Plus,
  Settings,
  Globe,
  Newspaper,
  Award,
  Users,
  Loader2,
} from 'lucide-react';
import { FIELD_KEYS } from '@pms/site-content';
import { Button } from '@/components/ui/button';
import { NavLinkButton } from '@/components/ui/nav-link-button';
import { CTAButton } from '@/components/ui/CTAButton';
import { PUBLIC_SITE_PAGES } from '@/constants/publicSitePages';
import { WebsiteDataService, type WebsiteData } from '@/services/WebsiteDataService';
import { cn } from '@/lib/utils';

const CMS_FIELD_META: Record<string, { label: string; path: string }> = {
  [FIELD_KEYS.HOME_PAGE_CONFIG]: { label: 'Home', path: '/dashboard/site-system/home' },
  [FIELD_KEYS.CERTIFICATIONS_HUB_CONFIG]: {
    label: 'Certifications',
    path: '/dashboard/site-system/pages/certifications',
  },
  [FIELD_KEYS.CERTIFICATIONS_REGISTRY]: {
    label: 'Certifications Registry',
    path: '/dashboard/site-system/pages/certifications',
  },
  [FIELD_KEYS.SERVICES_PAGE_CONFIG]: {
    label: 'Services',
    path: '/dashboard/site-system/pages/pm-service',
  },
  [FIELD_KEYS.STORE_CATALOG]: { label: 'Resource Store', path: '/dashboard/site-system/pages/store' },
  [FIELD_KEYS.COMMUNITY_PAGE_CONFIG]: {
    label: 'Community',
    path: '/dashboard/site-system/pages/community',
  },
  [FIELD_KEYS.MEMBERSHIP_PAGE_CONFIG]: {
    label: 'Membership',
    path: '/dashboard/site-system/pages/membership',
  },
  [FIELD_KEYS.ABOUT_PAGE_CONFIG]: { label: 'About', path: '/dashboard/site-system/pages/about' },
  [FIELD_KEYS.NEWSLETTER_HUB_CONFIG]: {
    label: 'Newsletter',
    path: '/dashboard/booking-crm/newsletter',
  },
  [FIELD_KEYS.GLOBAL_CONTENT]: {
    label: 'Global Content',
    path: '/dashboard/site-system/website-data',
  },
  [FIELD_KEYS.SITE_SETTINGS]: { label: 'Site Settings', path: '/dashboard/site-system/settings' },
};

function fieldLabel(fieldKey: string): string {
  return CMS_FIELD_META[fieldKey]?.label ?? fieldKey.replace(/_/g, ' ');
}

function fieldEditorPath(fieldKey: string): string {
  return CMS_FIELD_META[fieldKey]?.path ?? '/dashboard/site-system/website-data';
}

function OverviewStatCard({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string | number;
  delta?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {delta ? <p className="text-xs text-muted-foreground">{delta}</p> : null}
        </div>
        <div className="rounded-xl bg-muted p-3 text-muted-foreground shrink-0">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export const DashboardHome: React.FC = () => {
  const [rows, setRows] = useState<WebsiteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!WebsiteDataService.isConfigured()) {
      setRows([]);
      setLoadError(
        'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file, then restart the dev server.',
      );
      return;
    }

    const data = await WebsiteDataService.getData('draft');
    setRows(data);
    setLoadError(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadData();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Could not load dashboard overview.';
        setLoadError(message);
        setRows([]);
        console.error('Failed to load dashboard overview:', message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadData]);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not refresh dashboard overview.';
      setLoadError(message);
      console.error('Failed to refresh dashboard overview:', message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const stats = useMemo(() => {
    const published = rows.filter((row) => row.is_published).length;
    const drafts = rows.length - published;
    const thisMonth = rows.filter((row) => {
      const updated = new Date(row.updated_at);
      const now = new Date();
      return updated.getMonth() === now.getMonth() && updated.getFullYear() === now.getFullYear();
    }).length;

    return {
      totalPages: PUBLIC_SITE_PAGES.length,
      cmsDocuments: rows.length,
      published,
      drafts,
      updatedThisMonth: thisMonth,
    };
  }, [rows]);

  const recentUpdates = useMemo(
    () =>
      [...rows]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5),
    [rows],
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-heading">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Welcome to your dashboard. Here&apos;s an overview of your content.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => void refresh()}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={cn(isRefreshing && 'animate-spin')} />
            Refresh
          </Button>
          <CTAButton
            size="sm"
            variant="primary"
            className="gap-2 normal-case tracking-normal"
            onClick={() => window.open(siteUrl, '_blank', 'noopener,noreferrer')}
          >
            <Rocket size={16} />
            Deploy Now
          </CTAButton>
        </div>
      </div>

      {loadError ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-foreground">
          <p className="font-medium">CMS data unavailable</p>
          <p className="mt-1 text-muted-foreground">{loadError}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewStatCard
          icon={Globe}
          label="Website Pages"
          value={isLoading ? '—' : stats.totalPages}
          delta={`${stats.updatedThisMonth} updated this month`}
        />
        <OverviewStatCard
          icon={Layers}
          label="CMS Documents"
          value={isLoading ? '—' : stats.cmsDocuments}
          delta={`${stats.drafts} draft${stats.drafts === 1 ? '' : 's'} pending`}
        />
        <OverviewStatCard
          icon={FileText}
          label="Published Live"
          value={isLoading ? '—' : stats.published}
          delta="Live on marketing site"
        />
        <OverviewStatCard
          icon={Users}
          label="Content Modules"
          value={isLoading ? '—' : Object.keys(CMS_FIELD_META).length}
          delta="Managed page configs"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold font-heading">Recent Content Updates</h2>
            <Link
              href="/dashboard/site-system/website-data"
              className="text-xs font-semibold text-brand-orange hover:underline"
            >
              View all
            </Link>
          </div>

          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center text-muted-foreground">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : recentUpdates.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 text-center">
              <p className="text-sm font-medium text-foreground">No CMS documents yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Run site content migration or edit a page to populate this list.
              </p>
              <NavLinkButton href="/dashboard/migrate" variant="brandOutline" size="sm" className="mt-4">
                Open migration
              </NavLinkButton>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recentUpdates.map((row) => (
                <li key={row.id ?? row.field_key} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {fieldLabel(row.field_key)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {format(new Date(row.updated_at), 'dd/MM/yyyy')}
                      {row.is_published ? ' · Published' : ' · Draft'}
                    </p>
                  </div>
                  <NavLinkButton
                    href={fieldEditorPath(row.field_key)}
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${fieldLabel(row.field_key)}`}
                  >
                    <Pencil size={16} />
                  </NavLinkButton>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold font-heading">Quick Actions</h2>
          <div className="space-y-3">
            <NavLinkButton
              href="/dashboard/site-system/home"
              variant="outline"
              size="lg"
              className="h-12 w-full justify-start gap-3 rounded-xl text-sm font-semibold"
            >
              <Plus size={18} />
              Edit Home Page
            </NavLinkButton>
            <NavLinkButton
              href="/dashboard/site-system/pages/certifications"
              variant="outline"
              size="lg"
              className="h-12 w-full justify-start gap-3 rounded-xl text-sm font-semibold"
            >
              <Award size={18} />
              Manage Certifications
            </NavLinkButton>
            <NavLinkButton
              href="/dashboard/booking-crm/newsletter"
              variant="outline"
              size="lg"
              className="h-12 w-full justify-start gap-3 rounded-xl text-sm font-semibold"
            >
              <Newspaper size={18} />
              Newsletter & Blogs
            </NavLinkButton>
            <NavLinkButton
              href="/dashboard/site-system/settings"
              variant="outline"
              size="lg"
              className="h-12 w-full justify-start gap-3 rounded-xl text-sm font-semibold"
            >
              <Settings size={18} />
              Platform Settings
            </NavLinkButton>
          </div>
        </section>
      </div>
    </div>
  );
};
