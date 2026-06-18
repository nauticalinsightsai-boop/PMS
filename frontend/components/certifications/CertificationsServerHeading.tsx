/** Server-rendered H1 for /certifications (SSR + accessibility). */

export function CertificationsServerHeading() {
  return (
    <header className="sr-only">
      <h1>Choose the project management certification pathway that fits your role.</h1>
      <p>
        Compare PMP, PRINCE2, PMI-RMP, Lean Six Sigma, and other project management certification
        pathways with structured guidance from PM Structure.
      </p>
    </header>
  );
}
