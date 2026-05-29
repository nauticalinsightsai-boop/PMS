'use client';

import { getCmsSaveBlockReason } from '@/lib/cms/save-guard';

export function CmsSaveNotice() {
  const reason = getCmsSaveBlockReason();
  if (!reason) return null;

  return (
    <div
      role="alert"
      className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100"
    >
      <strong className="font-bold">CMS saves disabled — </strong>
      {reason}
    </div>
  );
}
