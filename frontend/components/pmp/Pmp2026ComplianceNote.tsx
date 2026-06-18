import Link from 'next/link';
import {
  PMP_2026_LAST_REVIEWED,
  PMP_2026_PMI_SOURCE_LINKS,
  PMP_2026_SOURCE_NOTE,
} from '@/content/pmp/flagship-t169';

type Pmp2026ComplianceNoteProps = {
  showSourceLinks?: boolean;
  className?: string;
};

export function Pmp2026ComplianceNote({
  showSourceLinks = false,
  className = '',
}: Pmp2026ComplianceNoteProps) {
  return (
    <aside
      className={`rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400 ${className}`}
    >
      <p className="font-semibold text-slate-700 dark:text-slate-300">
        Last reviewed: {PMP_2026_LAST_REVIEWED}
      </p>
      <p className="mt-1 leading-relaxed">{PMP_2026_SOURCE_NOTE}</p>
      {showSourceLinks ? (
        <ul className="mt-3 space-y-1">
          {PMP_2026_PMI_SOURCE_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-purple hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
