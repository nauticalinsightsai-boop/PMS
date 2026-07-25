/** Priority direct-answer pages surfaced on /pmp and /pmp-exam-2026 (Phase 11). */
export type PriorityAnswerLink = { href: string; label: string; description?: string };

export const PMP_HUB_PRIORITY_ANSWERS: PriorityAnswerLink[] = [
  {
    href: '/answers/is-the-pmp-exam-changing-in-2026',
    label: 'Is the PMP exam changing in 2026?',
    description: 'What changed in July 2026 and how to verify current PMI guidance.',
  },
  {
    href: '/answers/when-does-the-new-pmp-exam-start',
    label: 'When does the new PMP exam start?',
    description: 'The launch date, current status, and booking checklist.',
  },
  {
    href: '/pmp-after-9-july-2026',
    label: 'How should I prepare for the current PMP exam?',
    description: 'Post-launch study reset and readiness guidance.',
  },
  {
    href: '/answers/should-i-prepare-for-new-pmp-after-9-july-2026',
    label: 'How should I prepare for the current PMP exam?',
    description: 'Current-exam study alignment and readiness guidance.',
  },
  {
    href: '/answers/what-is-pmp-readiness',
    label: 'What is PMP readiness?',
    description: 'Mocks, domain coverage, and situational judgment.',
  },
  {
    href: '/answers/how-to-prepare-for-pmp-in-2026',
    label: 'How to prepare for PMP in 2026',
    description: 'Study plan aligned to the current exam.',
  },
  {
    href: '/answers/is-pm-structure-an-official-pmi-atp',
    label: 'Is PM Structure affiliated with PMI?',
    description: 'Independent platform and ATP compliance answer.',
  },
  {
    href: '/answers/pmp-training-hours-vs-pdus',
    label: 'PMP training hours vs PDUs',
    description: 'Eligibility language and common terminology mistakes.',
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
    label: 'Previous vs current PMP exam',
    description: 'Historical comparison and current preparation implications.',
  },
  {
    href: '/answers/what-are-the-pmp-2026-domain-weights',
    label: 'What are the 2026 domain weights?',
    description: 'Orientation only: verify on PMI.org.',
  },
];
