import Link from 'next/link';
import type { RelatedLink } from '@/content/seo/phase-2-page-seo';

type Props = {
  title?: string;
  links: RelatedLink[];
  currentPath?: string;
  className?: string;
};

export function RelatedGuidesLinks({
  title = 'Related PM Structure guides',
  links,
  currentPath,
  className,
}: Props) {
  const visible = links.filter((l) => l.href !== currentPath);
  if (!visible.length) return null;

  return (
    <aside
      className={`mt-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-6 ${className ?? ''}`}
      aria-label={title}
    >
      <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
      <ul className="space-y-2">
        {visible.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-brand-purple hover:underline font-medium">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
