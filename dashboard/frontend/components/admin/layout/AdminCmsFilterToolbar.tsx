'use client';

import type { ReactNode } from 'react';
import {
  ADMIN_CMS_FILTER_TOOLBAR_ACTIONS_CLASS,
  ADMIN_CMS_FILTER_TOOLBAR_FILTERS_CLASS,
  ADMIN_CMS_FILTER_TOOLBAR_INNER_CLASS,
  ADMIN_CMS_FILTER_TOOLBAR_OUTER_CLASS,
} from '@/components/admin/layout/adminCmsLayoutClasses';

import {
  ADMIN_CMS_FILTER_TOOLBAR_FILTERS_WRAP_CLASS,
  ADMIN_CMS_FILTER_TOOLBAR_INNER_WRAP_CLASS,
} from '@/components/admin/layout/adminCmsLayoutClasses';

export interface AdminCmsFilterToolbarProps {
  filters?: ReactNode;
  actions?: ReactNode;
  /** Full-width row below filters/actions (e.g. channel pills). */
  footer?: ReactNode;
  /** Render footer inline in the top row instead of below. */
  footerInline?: boolean;
  className?: string;
  /** Allow filters and actions to wrap instead of one overflowing row. */
  wrap?: boolean;
}

export function AdminCmsFilterToolbar({
  filters,
  actions,
  footer,
  footerInline,
  className,
  wrap,
}: AdminCmsFilterToolbarProps) {
  const outerClass = className
    ? `${ADMIN_CMS_FILTER_TOOLBAR_OUTER_CLASS} ${className}`
    : ADMIN_CMS_FILTER_TOOLBAR_OUTER_CLASS;

  const innerClass = wrap
    ? ADMIN_CMS_FILTER_TOOLBAR_INNER_WRAP_CLASS
    : footerInline
      ? 'flex flex-nowrap items-center gap-3 min-w-0 whitespace-nowrap'
      : ADMIN_CMS_FILTER_TOOLBAR_INNER_CLASS;
  const filtersClass = wrap
    ? ADMIN_CMS_FILTER_TOOLBAR_FILTERS_WRAP_CLASS
    : ADMIN_CMS_FILTER_TOOLBAR_FILTERS_CLASS;
  const actionsClass = wrap
    ? 'flex flex-wrap items-center gap-2 shrink-0'
    : ADMIN_CMS_FILTER_TOOLBAR_ACTIONS_CLASS;

  return (
    <div className={outerClass}>
      <div className={innerClass}>
        {filters ? <div className={filtersClass}>{filters}</div> : <div />}
        {footerInline && footer ? <div className="flex items-center gap-2 min-w-0 flex-1">{footer}</div> : null}
        {actions ? <div className={`${actionsClass} ml-auto`}>{actions}</div> : null}
      </div>
      {!footerInline && footer ? <div className="mt-3 flex flex-wrap items-center gap-2 w-full min-w-0">{footer}</div> : null}
    </div>
  );
}
