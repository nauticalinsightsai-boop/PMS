/** Server-rendered H1 for /certifications/compare (SSR + accessibility). */

export function CompareServerHeading() {
  return (
    <header className="sr-only">
      <h1>Compare project management certifications</h1>
      <p>
        Compare PMP, PRINCE2, PMI-RMP, Lean Six Sigma, and other project management certification
        pathways by role fit, intent, difficulty, and next step.
      </p>
    </header>
  );
}
