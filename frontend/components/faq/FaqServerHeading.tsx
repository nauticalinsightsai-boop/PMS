/** Server-rendered H1 for /faq (SSR + accessibility). */

export function FaqServerHeading() {

  return (

    <header className="sr-only">

      <h1>PM Structure FAQ</h1>
      <p>
        Find answers about PM Structure, PMP 2026 readiness, certification-body ownership,
        training-hour guidance, exam fees, membership, and independent preparation support.
      </p>

    </header>

  );

}