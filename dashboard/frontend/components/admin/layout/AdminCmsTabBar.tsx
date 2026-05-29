'use client';

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ADMIN_CMS_TAB_BAR_INNER_CLASS,
  ADMIN_CMS_TAB_BAR_OUTER_CLASS,
  ADMIN_CMS_TAB_LIST_CLASS,
} from '@/components/admin/layout/adminCmsLayoutClasses';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface AdminCmsTabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

export interface AdminCmsTabBarProps {
  /** Custom tab controls (e.g. WebsiteData with per-tab + buttons). */
  tabs?: ReactNode;
  /** Simple tab strip when `tabs` is omitted. */
  tabItems?: AdminCmsTabItem[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
  trailing?: ReactNode;
}

export function AdminCmsTabBar({ tabs, tabItems, activeTabId, onTabChange, trailing }: AdminCmsTabBarProps) {
  const tabContent =
    tabs ??
    (tabItems && onTabChange && activeTabId ? (
      <Tabs value={activeTabId} onValueChange={onTabChange} className="min-w-0 flex-1">
        <TabsList
          variant="line"
          className={`${ADMIN_CMS_TAB_LIST_CLASS} h-auto w-full justify-start gap-1 bg-transparent p-0`}
        >
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="gap-2 px-3 py-2 text-label data-active:text-brand-orange data-active:font-semibold"
              >
                {Icon ? <Icon size={14} /> : null}
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    ) : null);

  return (
    <div className={ADMIN_CMS_TAB_BAR_OUTER_CLASS}>
      <div className={ADMIN_CMS_TAB_BAR_INNER_CLASS}>
        {tabs ? <div className={ADMIN_CMS_TAB_LIST_CLASS}>{tabContent}</div> : tabContent}
        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>
    </div>
  );
}
