/** Server-rendered compare intro + crawlable pathway links (SSR for crawlers and render-check). */
import Link from 'next/link';

const COMPARE_PATHWAY_LINKS = [
  { href: '/certifications/pmp', label: 'PMP 2026 Readiness Pathway' },
  { href: '/certifications/prince2-practitioner', label: 'PRINCE2 Practitioner' },
  { href: '/certifications/pmi-rmp', label: 'PMI-RMP' },
  { href: '/certifications/lss-yellow', label: 'Lean Six Sigma Yellow Belt' },
  { href: '/certifications/lss-black', label: 'Lean Six Sigma Black Belt' },
] as const;

export function CompareServerHeading() {
  return (
    <header className="sr-only">
      <h1>Compare project management certifications</h1>
      <p>
        Compare PMP, PRINCE2, PMI-RMP, Lean Six Sigma, and other project management certification
        pathways by role fit, intent, difficulty, and next step.
      </p>
      <nav aria-label="Featured certification pathways">
        <ul>
          {COMPARE_PATHWAY_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
