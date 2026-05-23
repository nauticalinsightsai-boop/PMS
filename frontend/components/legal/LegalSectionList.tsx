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
        </section>
      ))}
    </div>
  );
}
