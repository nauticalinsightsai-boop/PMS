import type { CertProgramHighlight, CertProgramOffer } from '@/lib/cert-program-offer';
import {
  PMP_PROGRAM_CTA_LABEL,
  PMP_PROGRAM_HIGHLIGHTS,
  PMP_UNTIL_YOU_PASS_HEADLINE,
  PMP_UNTIL_YOU_PASS_SUBLINE,
} from '@/content/pmp/program-offer';

const UNTIL_YOU_PASS = 'Support until you pass';
const FINAL_CTA_SUBTITLE =
  'Share your experience in the form above: or enroll directly when cohort seats are open.';

function offer(
  certName: string,
  subline: string,
  highlights: CertProgramHighlight[],
  headline = UNTIL_YOU_PASS,
): CertProgramOffer {
  return {
    differentiatorHeadline: headline,
    differentiatorSubline: subline,
    ctaLabel: `Get My ${certName} Roadmap & Secure My Seat`,
    finalCtaSubtitle: FINAL_CTA_SUBTITLE,
    highlights,
  };
}

function pmiPack(certName: string, examFocus: string, educationNote: string): CertProgramHighlight[] {
  return [
    {
      id: 'live-training',
      title: 'Expert-Led Live Training',
      description: `Live sessions with recordings covering ${examFocus} and scenario-based application.`,
    },
    {
      id: 'coaching',
      title: 'Coaching & Accountability',
      description:
        'Mentor check-ins and study rhythm support matched to your work schedule and eligibility timeline.',
    },
    {
      id: 'exam-prep',
      title: `${certName} Exam Preparation`,
      description: `Mocks, weak-area tracking, and readiness reviews aligned to the official ${certName} outline.`,
    },
    {
      id: 'roadmap',
      title: `Customized ${certName} Roadmap`,
      description: `Step-by-step plan covering ${educationNote} and your path to booking the exam.`,
    },
    {
      id: 'mastermind',
      title: 'Peer Learning Community',
      description:
        'Cohort peers preparing for the same credential: share questions, cases, and exam tactics.',
    },
    {
      id: 'last-day',
      title: 'Final Sprint Materials',
      description:
        'Condensed revision pack for the last week before your exam sitting.',
    },
  ];
}

function prince2Pack(certName: string, examFocus: string): CertProgramHighlight[] {
  return [
    {
      id: 'live-training',
      title: `${certName} Live Training`,
      description:
        'Principles, themes, and processes taught with recordings: tailored to Foundation or Practitioner level.',
    },
    {
      id: 'governance',
      title: 'Governance & Scenario Coaching',
      description:
        'Apply tolerances, roles, and management products to exam-style objective scenarios.',
    },
    {
      id: 'exam-prep',
      title: examFocus,
      description:
        'Timed objective-testing drills and open-book practice for Practitioner-level confidence.',
    },
    {
      id: 'roadmap',
      title: `Customized ${certName} Roadmap`,
      description:
        'Structured syllabus coverage, mock exams, and booking guidance through to certification.',
    },
    {
      id: 'mastermind',
      title: 'Cohort Study Group',
      description:
        'Work through governance cases with peers targeting the same PRINCE2 credential.',
    },
    {
      id: 'last-day',
      title: 'Exam-Day Revision Pack',
      description:
        'Checklists and rapid-recall notes for the final days before your PeopleCert exam.',
    },
  ];
}

function sixSigmaPack(certName: string, beltFocus: string): CertProgramHighlight[] {
  return [
    {
      id: 'live-training',
      title: `${certName} Workshops`,
      description: `Belt-aligned sessions with tools, templates, and recordings for ${beltFocus}.`,
    },
    {
      id: 'dmaic',
      title: 'DMAIC Project Application',
      description:
        'Practice improvement projects with measurable outcomes: not exam trivia in isolation.',
    },
    {
      id: 'exam-prep',
      title: `${certName} Exam Preparation`,
      description:
        'Question banks, timed practice, and readiness checks aligned to ASQ-style expectations.',
    },
    {
      id: 'roadmap',
      title: `Customized ${certName} Roadmap`,
      description:
        'Study and project evidence plan matched to your experience hours and belt progression.',
    },
    {
      id: 'mastermind',
      title: 'Improvement Community',
      description:
        'Share tool tips, project examples, and exam strategies with peers on the same belt path.',
    },
    {
      id: 'last-day',
      title: 'Comprehensive Last-Day Material',
      description:
        'Formula sheets, concept maps, and exam traps review before test day.',
    },
  ];
}

/** Per-certification programme copy: keyed by site cert id */
export const CERT_PROGRAM_OFFERS: Record<string, CertProgramOffer> = {
  pmp: {
    differentiatorHeadline: PMP_UNTIL_YOU_PASS_HEADLINE,
    differentiatorSubline: PMP_UNTIL_YOU_PASS_SUBLINE,
    ctaLabel: PMP_PROGRAM_CTA_LABEL,
    finalCtaSubtitle: FINAL_CTA_SUBTITLE,
    highlights: PMP_PROGRAM_HIGHLIGHTS,
  },

  capm: offer(
    'CAPM®',
    'Entry-level PM credential with structured support: we guide you through the 23 contact hours, practice, and exam booking.',
    pmiPack(
      'CAPM®',
      'CAPM domain fundamentals and agile basics',
      '23 contact hours of PM education',
    ),
  ),

  'pmi-acp': offer(
    'PMI-ACP®',
    'Agile delivery credential with coaching through the 21 training hours, experience validation, and PMI-ACP exam readiness.',
    pmiPack(
      'PMI-ACP®',
      'agile principles, backlog delivery, and hybrid tailoring',
      '21 hours of formal agile training',
    ),
  ),

  'pmi-rmp': offer(
    'PMI-RMP®',
    'Risk specialist pathway: structured coaching through 40 hours of risk education, qualitative/quantitative practice, and exam day.',
    [
      ...pmiPack('PMI-RMP®', 'risk planning and response strategies', '40 hours of project risk education').slice(
        0,
        3,
      ),
      {
        id: 'roadmap',
        title: 'Customized PMI-RMP® Roadmap',
        description:
          'Eligibility check, 40-hour education plan, and weak-domain focus for infrastructure and complex programmes.',
      },
      {
        id: 'mastermind',
        title: 'Risk Peer Community',
        description:
          'Discuss reserves, governance, and exam scenarios with peers in regulated and megaproject environments.',
      },
      {
        id: 'last-day',
        title: 'Final Sprint Materials',
        description: 'Risk formula and scenario rapid-review pack before your PMI-RMP sitting.',
      },
    ],
  ),

  'pmi-pba': offer(
    'PMI-PBA®',
    'Business analysis leadership: coaching through 35 contact hours, requirements cases, and PMI-PBA exam preparation.',
    pmiPack(
      'PMI-PBA®',
      'needs assessment, elicitation, traceability, and value realization',
      '35 contact hours in business analysis practices',
    ),
  ),

  'pmi-sp': offer(
    'PMI-SP®',
    'Scheduling specialist pathway: master CPM, baselines, and controls with 30–40 hour education support and exam drills.',
    pmiPack(
      'PMI-SP®',
      'CPM, monitoring, forecasting, and schedule risk interfaces',
      'required scheduling education hours for your eligibility set',
    ),
  ),

  'pmi-pmocp': offer(
    'PMI-PMOCP™',
    'PMO governance credential: hit the 10-hour PMO education requirement and prepare for operating-model exam scenarios.',
    pmiPack(
      'PMI-PMOCP™',
      'PMO operating models, metrics, and governance cadence',
      '10 hours of PMO education plus application audit readiness',
    ),
  ),

  'pmi-cp': offer(
    'Construction Professional (PMI-CP)™',
    'Built-environment credential: complete the four official modules, validate experience, and master construction delivery controls.',
    pmiPack(
      'Construction Professional (PMI-CP)™',
      'contract planning, execution controls, and schedule/cost integration',
      'four required foundational course modules',
    ),
  ),

  'pmi-cpmai': offer(
    'Managing AI (PMI-CPMAI)™',
    'AI in project management: structured pathway through the 21-hour prep track, ethical governance, and PMI-CPMAI exam readiness.',
    pmiPack(
      'Managing AI (PMI-CPMAI)™',
      'scoping AI initiatives, DataOps dependencies, and measurable outcomes',
      '21-hour official exam prep course',
    ),
  ),

  'gpm-b': offer(
    'Green Project Manager: Basic (GPM-b)™',
    'Sustainability in PM: confirm eligibility, complete bundle training, and prepare for ethics-focused green delivery scenarios.',
    pmiPack(
      'GPM-b™',
      'sustainability management plans and impacts assessment',
      'GPM-b bundle training and eligibility confirmation',
    ),
  ),

  pgmp: offer(
    'PgMP®',
    'Program management leadership: panel-review preparation, benefits governance coaching, and PgMP exam readiness.',
    pmiPack(
      'PgMP®',
      'program strategy alignment, benefits management, and governance structures',
      'program experience documentation and panel review',
    ),
  ),

  pfmp: offer(
    'PfMP®',
    'Portfolio executive credential: governance, performance, and strategic alignment coaching through PfMP exam preparation.',
    pmiPack(
      'PfMP®',
      'portfolio governance, risk, and strategic alignment',
      'extensive portfolio experience validation',
    ),
  ),

  prince2: offer(
    'PRINCE2® 7 Foundation',
    'Controlled-delivery methodology: learn PRINCE2 principles, themes, and processes with exam-focused Foundation preparation.',
    prince2Pack(
      'PRINCE2® 7 Foundation',
      'Foundation Objective-Testing Drills',
    ),
  ),

  'prince2-practitioner': offer(
    'PRINCE2® 7 Practitioner',
    'Practitioner-level governance: scenario coaching, tailoring practice, and open-book exam preparation.',
    prince2Pack(
      'PRINCE2® 7 Practitioner',
      'Practitioner Scenario & Open-Book Drills',
    ),
  ),

  'prince2-agile': offer(
    'PRINCE2 Agile® Foundation',
    'Hybrid governance: combine agile behaviors with PRINCE2 controls through Foundation-focused live training.',
    prince2Pack(
      'PRINCE2 Agile® Foundation',
      'Agile Foundation Objective-Testing Drills',
    ),
  ),

  'prince2-agile-practitioner': offer(
    'PRINCE2 Agile® Practitioner',
    'Tailor governance for agile delivery. Practitioner scenarios, metrics integration, and open-book exam practice.',
    prince2Pack(
      'PRINCE2 Agile® Practitioner',
      'Agile Practitioner Scenario Drills',
    ),
  ),

  msp: offer(
    'MSP®',
    'Programme governance. MSP principles, themes, and transformation flows with Foundation-to-Practitioner exam support.',
    prince2Pack('MSP®', 'MSP Governance Exam Drills'),
  ),

  mop: offer(
    'MoP®',
    'Portfolio management governance. MoP principles and portfolio decision-making with structured exam preparation.',
    prince2Pack('MoP®', 'MoP Portfolio Exam Drills'),
  ),

  mor: offer(
    'M_o_R®',
    'Enterprise risk governance. M_o_R frameworks, appetite, and response strategies with exam-focused coaching.',
    prince2Pack('M_o_R®', 'M_o_R Risk Governance Exam Drills'),
  ),

  p3o: offer(
    'P3O®',
    'PMO and portfolio office governance. P3O models, functions, and maturity with certification exam support.',
    prince2Pack('P3O®', 'P3O Office Governance Exam Drills'),
  ),

  'lss-white': offer(
    'Six Sigma White Belt',
    'Organization-wide awareness: introduce Six Sigma language, roles, and improvement participation for every team member.',
    sixSigmaPack(
      'Six Sigma White Belt',
      'vocabulary, waste concepts, and project participation basics',
    ),
  ),

  'lss-yellow': offer(
    'Six Sigma Yellow Belt (CSSYB)',
    'Foundational belt: build DMAIC support skills, root-cause tools, and CSSYB exam readiness with ASQ-aligned practice.',
    sixSigmaPack(
      'Six Sigma Yellow Belt',
      'fundamentals, data collection, and team support roles',
    ),
  ),

  'lss-green': offer(
    'Six Sigma Green Belt (CSSGB)',
    'Lead improvement projects. DMAIC execution, basic stats, and CSSGB exam preparation with project evidence support.',
    sixSigmaPack(
      'Six Sigma Green Belt',
      'DMAIC project leadership and capability analysis',
    ),
  ),

  'lss-black': offer(
    'Six Sigma Black Belt (CSSBB)',
    'Advanced improvement leadership. DOE, enterprise deployment, and CSSBB exam prep with affidavit project coaching.',
    sixSigmaPack(
      'Six Sigma Black Belt',
      'advanced stats, enterprise deployment, and cross-functional leadership',
    ),
  ),

  'lss-master': offer(
    'Master Black Belt (CMBB)',
    'Enterprise excellence: portfolio review coaching, mentoring systems, and CMBB exam plus performance assessment prep.',
    sixSigmaPack(
      'Master Black Belt',
      'enterprise deployment leadership and portfolio evidence',
    ),
  ),

  'lss-champion': offer(
    'Six Sigma Champion',
    'Executive sponsorship: project selection governance, benefits tracking, and transformation barrier removal coaching.',
    sixSigmaPack(
      'Six Sigma Champion',
      'sponsor cadence, benefits realization, and adoption strategy',
    ),
  ),

  'foundation-direct': offer(
    'Foundation Direct Pathway',
    'Multi-framework bridge: compare PMI, PRINCE2, and Six Sigma pathways and map the right credential for your career stage.',
    [
      {
        id: 'live-training',
        title: 'Multi-Framework Live Intro',
        description:
          'Fast-paced sessions covering unified PM vocabulary across PMI, PRINCE2, and Six Sigma.',
      },
      {
        id: 'roadmap',
        title: 'Personalized Pathway Map',
        description:
          'Consultation-led recommendation for which certification family fits your experience and goals.',
      },
      {
        id: 'exam-prep',
        title: 'Certification Comparison Labs',
        description:
          'Side-by-side scenarios showing when each framework applies: before you commit to a full pathway.',
      },
      {
        id: 'coaching',
        title: 'Career Bridge Coaching',
        description:
          'Mentor support for graduates and career changers entering structured project roles.',
      },
      {
        id: 'mastermind',
        title: 'Cohort Discovery Group',
        description:
          'Peers exploring PM credentials together: share backgrounds and pathway decisions.',
      },
      {
        id: 'last-day',
        title: 'Next-Step Action Pack',
        description:
          'Clear checklist to move from Foundation Direct into your chosen certification pathway.',
      },
    ],
  ),
};