import { CERT_PROGRAM_OFFERS } from '@/content/cert-program-offers';

/** Lead-form anchor on certification detail hero sections */
export const CERT_ROADMAP_FORM_ANCHOR = 'cert-roadmap-form';

export type CertProgramHighlight = {
  id: string;
  title: string;
  description: string;
};

export type CertProgramOffer = {
  differentiatorHeadline: string;
  differentiatorSubline: string;
  ctaLabel: string;
  finalCtaSubtitle: string;
  highlights: readonly CertProgramHighlight[];
};

const UNTIL_YOU_PASS_HEADLINE = 'Support until you pass';

function untilYouPassSubline(certName: string): string {
  return `Structured coaching, accountability, and exam readiness — we stay with you through your ${certName} journey, not just until checkout.`;
}

function roadmapCtaLabel(certName: string): string {
  return `Get My ${certName} Roadmap & Secure My Seat`;
}

/** Short label for roadmap CTAs on narrow viewports (full cert name stays on sm+). */
export const ROADMAP_CTA_LABEL_MOBILE = 'Get my roadmap & seat';

const FINAL_CTA_SUBTITLE =
  'Share your experience in the form above — or enroll directly when cohort seats are open.';

function familyHighlights(certName: string, familyId: string): CertProgramHighlight[] {
  if (familyId === 'PRINCE2') {
    return [
      {
        id: 'live-training',
        title: `${certName} Live Training`,
        description: 'Governance concepts with recordings tailored to your certification level.',
      },
      {
        id: 'governance',
        title: 'Governance & Scenario Coaching',
        description: 'Exam scenarios with mentor feedback on controlled-delivery decisions.',
      },
      {
        id: 'exam-prep',
        title: `${certName} Exam Drills`,
        description: 'Objective-testing and practitioner practice for exam confidence.',
      },
      {
        id: 'roadmap',
        title: `Customized ${certName} Roadmap`,
        description: 'Syllabus coverage through mocks and exam booking.',
      },
      {
        id: 'mastermind',
        title: 'Cohort Study Group',
        description: 'Peers preparing for the same governance credential.',
      },
      {
        id: 'last-day',
        title: 'Exam-Day Revision Pack',
        description: 'Final checklists before your certification exam.',
      },
    ];
  }

  if (familyId === 'SixSigma') {
    return [
      {
        id: 'live-training',
        title: `${certName} Workshops`,
        description: 'Belt-aligned tools, templates, and session recordings.',
      },
      {
        id: 'dmaic',
        title: 'DMAIC Project Application',
        description: 'Measurable improvement projects alongside exam preparation.',
      },
      {
        id: 'exam-prep',
        title: `${certName} Exam Preparation`,
        description: 'Practice questions aligned to belt-level expectations.',
      },
      {
        id: 'roadmap',
        title: `Customized ${certName} Roadmap`,
        description: 'Study and experience evidence plan for your belt path.',
      },
      {
        id: 'mastermind',
        title: 'Improvement Community',
        description: 'Peer support for tools, projects, and exam strategy.',
      },
      {
        id: 'last-day',
        title: 'Comprehensive Last-Day Material',
        description: 'Final review before test day.',
      },
    ];
  }

  return [
    {
      id: 'live-training',
      title: 'Expert-Led Live Training',
      description: 'Live sessions with recordings structured for your exam syllabus.',
    },
    {
      id: 'coaching',
      title: 'Coaching & Accountability',
      description: 'Mentor check-ins tailored to your study schedule.',
    },
    {
      id: 'exam-prep',
      title: `${certName} Exam Preparation`,
      description: 'Mocks and readiness reviews aligned to official outlines.',
    },
    {
      id: 'roadmap',
      title: `Customized ${certName} Roadmap`,
      description: 'Step-by-step plan mapped to eligibility and timeline.',
    },
    {
      id: 'mastermind',
      title: 'Peer Learning Community',
      description: 'Cohort collaboration through exam day.',
    },
    {
      id: 'last-day',
      title: 'Final Sprint Materials',
      description: 'Focused revision before your exam.',
    },
  ];
}

function fallbackOffer(certName: string, familyId: string): CertProgramOffer {
  return {
    differentiatorHeadline: UNTIL_YOU_PASS_HEADLINE,
    differentiatorSubline: untilYouPassSubline(certName),
    ctaLabel: roadmapCtaLabel(certName),
    finalCtaSubtitle: FINAL_CTA_SUBTITLE,
    highlights: familyHighlights(certName, familyId),
  };
}

/** Programme offer copy + highlight cards for certification detail pages */
export function getCertProgramOffer(
  certId: string,
  certName: string,
  familyId: string,
): CertProgramOffer {
  const configured = CERT_PROGRAM_OFFERS[certId];
  if (configured) return configured;
  return fallbackOffer(certName, familyId);
}
