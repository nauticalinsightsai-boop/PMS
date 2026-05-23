import { AlertTriangle } from 'lucide-react';
import { LEGAL_DRAFT_NOTICE } from '@/content/legal';

export function LegalDraftBanner() {
  return (
    <div
      role="note"
      className="mb-8 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100"
    >
      <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
      <p className="font-medium leading-relaxed">{LEGAL_DRAFT_NOTICE}</p>
    </div>
  );
}
