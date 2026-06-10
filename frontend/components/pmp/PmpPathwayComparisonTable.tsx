import Link from 'next/link';

type Row = {
  label: string;
  href: string;
  summary: string;
};

const ROWS: Row[] = [
  {
    label: 'Foundation',
    href: '/pmp-foundation',
    summary: 'Core ECO orientation, baseline practice, study planning',
  },
  {
    label: 'Professional',
    href: '/pmp-professional',
    summary: 'Structured readiness, scenario practice, timed mocks',
  },
  {
    label: 'Mastery',
    href: '/pmp-mastery',
    summary: 'Intensive mocks, weak-area remediation, exam-week discipline',
  },
  {
    label: 'Readiness diagnostic',
    href: '/pmp-readiness-diagnostic',
    summary: 'Pathway and timing recommendation before enrollment',
  },
  {
    label: 'Scenario practice',
    href: '/pmp-scenario-practice',
    summary: 'Situational judgment drills across ECO themes',
  },
  {
    label: 'Mock exams',
    href: '/pmp-mock-exam',
    summary: 'Timed full-length practice and review cadence',
  },
];

export function PmpPathwayComparisonTable({ highlight }: { highlight?: string }) {
  return (
    <div className="overflow-x-auto mb-10">
      <table className="w-full text-sm border-collapse border border-slate-200 dark:border-slate-800">
        <caption className="sr-only">PMP pathway and support options comparison</caption>
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900">
            <th scope="col" className="text-left p-3 border border-slate-200 dark:border-slate-800 font-semibold">
              Option
            </th>
            <th scope="col" className="text-left p-3 border border-slate-200 dark:border-slate-800 font-semibold">
              Best for
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr
              key={row.href}
              className={
                highlight === row.href
                  ? 'bg-brand-orange/5'
                  : undefined
              }
            >
              <th
                scope="row"
                className="p-3 border border-slate-200 dark:border-slate-800 font-medium text-left"
              >
                <Link href={row.href} className="text-brand-orange hover:underline">
                  {row.label}
                </Link>
              </th>
              <td className="p-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                {row.summary}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
