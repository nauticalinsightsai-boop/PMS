'use client';

import type { ReactNode } from 'react';
import {
  ADMIN_CMS_TAB_BAR_INNER_CLASS,
  ADMIN_CMS_TAB_BAR_OUTER_CLASS,
  ADMIN_CMS_TAB_LIST_CLASS,
} from '@/components/admin/layout/adminCmsLayoutClasses';

export interface AdminCmsPageHeaderProps {
  title: string;
  leading?: ReactNode;
  trailing?: ReactNode;
}

/** Sticky page title bar — same chrome as {@link AdminCmsTabBar} (58px row, bottom border). */
export function AdminCmsPageHeader({ title, leading, trailing }: AdminCmsPageHeaderProps) {
  return (
    <div className={ADMIN_CMS_TAB_BAR_OUTER_CLASS}>
      <div className={ADMIN_CMS_TAB_BAR_INNER_CLASS}>
        <div className={`${ADMIN_CMS_TAB_LIST_CLASS} min-h-[58px]`}>
          {leading}
          <span className="px-3 py-2 text-label text-gw-accent-primary whitespace-nowrap">{title}</span>
        </div>
        {trailing ? (
          <div className="flex items-center justify-center gap-3 shrink-0 h-[58px]">
            {trailing}
          </div>
        ) : null}
      </div>
    </div>
  );
}
