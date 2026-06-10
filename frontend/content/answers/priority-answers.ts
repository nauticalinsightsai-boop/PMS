/** Priority direct-answer pages surfaced on /pmp and /pmp-exam-2026 (Phase 11). */
export type PriorityAnswerLink = { href: string; label: string; description?: string };

export const PMP_HUB_PRIORITY_ANSWERS: PriorityAnswerLink[] = [
  {
    href: '/answers/is-the-pmp-exam-changing-in-2026',
    label: 'Is the PMP exam changing in 2026?',
    description: 'Transition timeline and how to verify official PMI guidance.',
  },
  {
    href: '/answers/when-does-the-new-pmp-exam-start',
    label: 'When does the new PMP exam start?',
    description: 'July 2026 planning anchor and booking checklist.',
  },
  {
    href: '/answers/should-i-take-pmp-before-8-july-2026',
    label: 'Should I take PMP before 8 July 2026?',
    description: 'Pre-transition timing decision guide.',
  },
  {
    href: '/answers/should-i-prepare-for-new-pmp-after-9-july-2026',
    label: 'Should I prepare after 9 July 2026?',
    description: 'Post-transition study window guidance.',
  },
  {
    href: '/answers/what-is-pmp-readiness',
    label: 'What is PMP readiness?',
    description: 'Mocks, domain coverage, and situational judgment.',
  },
  {
    href: '/answers/how-to-prepare-for-pmp-in-2026',
    label: 'How to prepare for PMP in 2026',
    description: 'Study plan aligned to the transition year.',
  },
  {
    href: '/answers/is-pm-structure-an-official-pmi-atp',
    label: 'Is PM Structure affiliated with PMI?',
    description: 'Independent platform and ATP compliance answer.',
  },
  {
    href: '/answers/which-pm-structure-pmp-pathway-should-i-choose',
    label: 'Which PMP pathway should I choose?',
    description: 'Foundation, Professional, and Mastery fit.',
  },
];

export const PMP_EXAM_2026_PRIORITY_ANSWERS: PriorityAnswerLink[] = [
  PMP_HUB_PRIORITY_ANSWERS[0],
  PMP_HUB_PRIORITY_ANSWERS[1],
  PMP_HUB_PRIORITY_ANSWERS[2],
  PMP_HUB_PRIORITY_ANSWERS[3],
  {
    href: '/answers/what-is-the-pmp-business-environment-domain',
    label: 'What is the Business Environment domain?',
    description: 'Benefits, compliance, and organizational context.',
  },
  {
    href: '/answers/what-is-the-pmp-exam-content-outline',
    label: 'What is the PMP exam content outline?',
    description: 'ECO orientation and study mapping.',
  },
  {
    href: '/answers/current-pmp-exam-vs-new-pmp-exam',
    label: 'Current vs new PMP exam',
    description: 'Format comparison before and after July 2026.',
  },
  {
    href: '/answers/what-are-the-pmp-2026-domain-weights',
    label: 'What are the 2026 domain weights?',
    description: 'Orientation only — verify on PMI.org.',
  },
];
