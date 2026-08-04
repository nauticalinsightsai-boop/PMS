import Link from 'next/link';
import type { LegalSection } from '@/content/legal/types';
import { cn } from '@/lib/utils';

export function LegalSectionList({
  sections,
  className,
}: {
  sections: LegalSection[];
  className?: string;
}) {
  return (
    <div className={cn('space-y-10', className)}>
      {sections.map((s) => (
        <section key={s.id} id={s.id} className="scroll-mt-28">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
            {s.heading}
          </h2>
          <div className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium whitespace-pre-line">
            {s.body}
          </div>
          {s.links?.length ? (
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2" aria-label={`${s.heading} related policies`}>
              {s.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-semibold text-brand-orange underline decoration-brand-orange/35 underline-offset-4 transition-colors hover:text-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}
