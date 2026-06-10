import Link from 'next/link';
import type { PriorityAnswerLink } from '@/content/answers/priority-answers';

export function PmpPriorityAnswers({
  links,
  heading = 'Priority direct answers',
}: {
  links: PriorityAnswerLink[];
  heading?: string;
}) {
  if (!links.length) return null;
  return (
    <section className="mb-10" aria-labelledby="pmp-priority-answers-heading">
      <h2 id="pmp-priority-answers-heading" className="text-xl font-bold mb-4">
        {heading}
      </h2>
      <ul className="grid sm:grid-cols-2 gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-colors"
            >
              <span className="font-semibold text-brand-purple hover:underline">{link.label}</span>
              {link.description ? (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{link.description}</p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-sm text-slate-500 mt-3">
        <Link href="/answers" className="text-brand-purple hover:underline">
          Browse all answer pages
        </Link>
        {' · '}
        <Link href="/pmp-faq" className="text-brand-purple hover:underline">
          PMP FAQ library
        </Link>
      </p>
    </section>
  );
}
