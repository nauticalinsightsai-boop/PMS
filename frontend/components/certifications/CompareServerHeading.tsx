/** Server-rendered compare intro + crawlable pathway links (SSR for crawlers and render-check). */
import Link from 'next/link';
import { DEFAULT_COMPARE_CERT_IDS } from '@/lib/compare-certifications';
import { certifications } from '@/data/certification-index';

const COMPARE_PATHWAY_LINKS = [
  { href: '/certifications/pmp', label: 'PMP 2026 Readiness Pathway' },
  { href: '/certifications/prince2-practitioner', label: 'PRINCE2 Practitioner' },
  { href: '/certifications/pmi-rmp', label: 'PMI-RMP' },
  { href: '/certifications/lss-yellow', label: 'Lean Six Sigma Yellow Belt' },
  { href: '/certifications/lss-black', label: 'Lean Six Sigma Black Belt' },
] as const;

export function CompareServerHeading() {
  const defaultCerts = DEFAULT_COMPARE_CERT_IDS.map((id) =>
    certifications.find((c) => c.id === id),
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <header className="container relative z-10 mx-auto max-w-4xl px-4 py-12 md:py-16">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
        Compare PMP, PRINCE2, and project management certifications
      </h1>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
          Compare PMP, PRINCE2, PMI-RMP, Lean Six Sigma, and other project management certification
          pathways by role fit, intent, difficulty, and next step. Use the interactive matrix below
          to review tier options, prep time, and regional tuition side-by-side.
        </p>

        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4 mt-8">
          Default comparison: {defaultCerts.map((c) => c.name).join(', ')}
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
          By default, the comparison matrix shows {defaultCerts[0]?.name}, {defaultCerts[1]?.name}, and {defaultCerts[2]?.name}.
          You can pick up to three pathways from any mix below:
        </p>

        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 mt-6">
          Comparison criteria
        </h3>
        <ul className="list-disc pl-6 space-y-2 text-base text-slate-600 dark:text-slate-400 font-medium">
          <li><strong>Primary value:</strong> What credential signal or capability the pathway builds</li>
          <li><strong>Target audience:</strong> Role fit and experience prerequisites</li>
          <li><strong>Foundation, Professional, and Mastery pathways:</strong> Tier options to match weekly study capacity</li>
          <li><strong>Exam format:</strong> Question count, duration, and delivery method</li>
          <li><strong>Prerequisites:</strong> Experience hours and formal training requirements</li>
          <li><strong>Official exam fee:</strong> Certification body charges (excludes PM Structure preparation fees)</li>
          <li><strong>Career guidance:</strong> Recommended next steps after certification</li>
        </ul>

        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 mt-6">
          Decision guidance
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
          If you are preparing for the PMP exam (live since 9 July 2026), start with the{' '}
          <Link href="/certifications/pmp" className="font-bold text-brand-orange hover:underline">
            PMP 2026 Readiness Pathway
          </Link>
          , then add other pathways for side-by-side review. If you need help choosing which certification
          fits your role and timeline, our{' '}
          <Link href="/pm-service" className="font-bold text-brand-orange hover:underline">
            certification experts
          </Link>{' '}
          can help you map out a personalized professional development plan.
        </p>

        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 mt-6">
          Featured certification pathways
        </h3>
        <ul className="list-none space-y-2">
          {COMPARE_PATHWAY_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="inline-flex items-center text-base font-bold text-brand-orange hover:underline"
              >
                {label} →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
