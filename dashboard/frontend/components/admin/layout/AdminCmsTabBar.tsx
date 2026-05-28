'use client';

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ADMIN_CMS_TAB_BAR_INNER_CLASS,
  ADMIN_CMS_TAB_BAR_OUTER_CLASS,
  ADMIN_CMS_TAB_LIST_CLASS,
  adminCmsTabButtonClass,
} from '@/components/admin/layout/adminCmsLayoutClasses';

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
    (tabItems && onTabChange ? (
      <>
        {tabItems.map((tab) => {
          const Icon = tab.icon;
          const active = activeTabId === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={adminCmsTabButtonClass(active)}
            >
              {Icon ? <Icon size={14} /> : null}
              {tab.label}
            </button>
          );
        })}
      </>
    ) : null);

  return (
    <div className={ADMIN_CMS_TAB_BAR_OUTER_CLASS}>
      <div className={ADMIN_CMS_TAB_BAR_INNER_CLASS}>
        <div className={ADMIN_CMS_TAB_LIST_CLASS}>{tabContent}</div>
        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>
    </div>
  );
}
