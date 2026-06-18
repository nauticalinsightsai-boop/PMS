import Link from 'next/link';
import { getCertComplianceNote } from '@/content/t176-claims';

type CertComplianceNoteProps = {
  certId: string;
  familyId: string;
  className?: string;
};

export function CertComplianceNote({ certId, familyId, className = '' }: CertComplianceNoteProps) {
  const note = getCertComplianceNote(certId, familyId);
  if (!note) return null;

  return (
    <aside
      className={`rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400 ${className}`}
    >
      {note.alert ? (
        <p className="mb-3 font-medium leading-relaxed text-slate-700 dark:text-slate-300">{note.alert}</p>
      ) : null}
      <p className="leading-relaxed">{note.body}</p>
      <p className="mt-3">
        <Link
          href="/legal/pricing-disclaimers#independent-platform"
          className="font-medium text-brand-purple hover:underline"
        >
          Independent platform notice
        </Link>
      </p>
    </aside>
  );
}
