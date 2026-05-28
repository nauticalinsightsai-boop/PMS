import Link from 'next/link';

const DEFAULT_LINKS = [
  { href: '/legal/terms', label: 'Terms & Conditions' },
  { href: '/legal/privacy', label: 'Privacy Policy' },
  { href: '/legal/cookies', label: 'Cookie Policy' },
  { href: '/legal/pricing-disclaimers', label: 'Pricing & disclaimers' },
  { href: '/legal/refunds', label: 'Refunds' },
  { href: '/faq', label: 'FAQ' },
];

export function LegalRelatedLinks({
  links = DEFAULT_LINKS,
  className,
}: {
  links?: { href: string; label: string }[];
  className?: string;
}) {
  return (
    <aside
      className={`mt-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-6 ${className ?? ''}`}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Related policies</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-brand-orange hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
