'use client';

import type { ReactNode } from 'react';
import {
  ADMIN_CMS_SHELL_CONTAINER_CLASS,
  ADMIN_CMS_SHELL_ROOT_CLASS,
  ADMIN_CMS_SHELL_SCROLL_CLASS,
} from '@/components/admin/layout/adminCmsLayoutClasses';

export interface AdminCmsEditorShellProps {
  children: ReactNode;
  className?: string;
}

export function AdminCmsEditorShell({ children, className }: AdminCmsEditorShellProps) {
  const rootClass = className ? `${ADMIN_CMS_SHELL_ROOT_CLASS} ${className}` : ADMIN_CMS_SHELL_ROOT_CLASS;

  return (
    <div className={rootClass}>
      <div className={ADMIN_CMS_SHELL_SCROLL_CLASS}>
        <div className={ADMIN_CMS_SHELL_CONTAINER_CLASS}>{children}</div>
      </div>
    </div>
  );
}
