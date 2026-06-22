/**
 * T-022 Phase Two keyword + metadata map (internal planning source for implementation).
 * Do not expose this module as a public route. No invented keyword volume/difficulty.
 */

export type RelatedLink = {
  href: string;
  label: string;
};

export type PageSeoConfig = {
  route: string;
  pageRole: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  searchIntent?: string;
  funnelStage?: string;
  title: string;
  description: string;
  h1?: string;
  canonicalPath: string;
  regionFocus?: string[];
  relatedLinks?: RelatedLink[];
};

export type RelatedLinkBlock = {
  title: string;
  links: RelatedLink[];
};

const pmpCommercial: RelatedLink = {
  href: '/certifications/pmp',
  label: 'PMP 2026 Readiness Pathway',
};

const compareCerts: RelatedLink = {
  href: '/certifications/compare',
  label: 'Compare Project Management Certifications',
};

const topicHub: RelatedLink = {
  href: '/topics/pmp-exam-2026',
  label: 'PMP Exam 2026 Guide',
};

const faqLink: RelatedLink = {
  href: '/faq',
  label: 'PM Structure FAQ',
};

export const PHASE_2_PAGE_SEO: Record<string, PageSeoConfig> = {
  '/': {
    route: '/',
    pageRole: 'Homepage',
    primaryKeyword: 'project management certification pathways',
    secondaryKeywords: [
      'PM Structure',
      'PMP 2026 readiness',
      'project management exam prep',
      'certification roadmap',
    ],
    searchIntent: 'Brand + commercial investigation',
    funnelStage: 'Conversion',
    title: 'PM Structure | PMP 2026 Readiness & Project Certification Pathways',
    description:
      'Prepare for the PMP 2026 exam change with structured roadmap support, eligibility guidance, study planning, mock tracking, and independent certification pathway guidance.',
    h1: 'Project management guidance',
    canonicalPath: '/',
    regionFocus: ['Global'],
    relatedLinks: [
      pmpCommercial,
      { href: '/certifications', label: 'Project Management Certification Pathways' },
      compareCerts,
      faqLink,
      { href: '/community', label: 'PM Structure Learning Community' },
      { href: '/membership', label: 'PM Structure Membership' },
      { href: '/pm-service', label: 'Project Management Advisory Services' },
      { href: '/answers', label: 'PMP and certification answers' },
      { href: '/topics', label: 'Project management topic guides' },
      { href: '/topics/pmp-exam-2026', label: 'PMP Exam 2026 Guide' },
      { href: '/pmp-exam-2026', label: 'PMP exam 2026 deep guide' },
    ],
  },
  '/certifications': {
    route: '/certifications',
    pageRole: 'Certification hub',
    primaryKeyword: 'project management certifications',
    secondaryKeywords: [
      'PMP certification',
      'PRINCE2 certification',
      'PMI-RMP',
      'Lean Six Sigma',
      'certification pathways',
    ],
    searchIntent: 'Commercial investigation',
    funnelStage: 'Consideration',
    title: 'Project Management Certification Pathways | PM Structure',
    description:
      'Compare PMP, PRINCE2, PMI-RMP, Lean Six Sigma, and other project management certification pathways with structured guidance from PM Structure.',
    h1: 'Choose the project management certification pathway that fits your role.',
    canonicalPath: '/certifications',
    regionFocus: ['Global'],
    relatedLinks: [pmpCommercial, compareCerts],
  },
  '/certifications/pmp': {
    route: '/certifications/pmp',
    pageRole: 'Main PMP commercial page',
    primaryKeyword: 'PMP 2026 readiness pathway',
    secondaryKeywords: [
      'PMP exam 2026',
      'updated PMP exam',
      'PMP study plan',
      'PMP eligibility',
      'PMP roadmap',
    ],
    searchIntent: 'Commercial',
    funnelStage: 'Conversion',
    title: 'PMP 2026 Readiness Pathway | PM Structure',
    description:
      'Prepare for the PMP 2026 exam transition with a structured readiness pathway, roadmap support, and practical project-management guidance.',
    h1: 'PMP 2026 Readiness Pathway',
    canonicalPath: '/certifications/pmp',
    regionFocus: ['GCC', 'South Asia'],
  },
  '/answers/is-the-pmp-exam-changing-in-2026': {
    route: '/answers/is-the-pmp-exam-changing-in-2026',
    pageRole: 'Direct answer',
    primaryKeyword: 'is the PMP exam changing in 2026',
    secondaryKeywords: ['PMP exam change 2026', 'PMP new exam date', 'PMP exam July 2026'],
    searchIntent: 'Informational',
    funnelStage: 'Awareness',
    title: 'Is the PMP Exam Changing in 2026? | PM Structure',
    description:
      'Yes. The PMP exam changes in July 2026. Learn what the change means, whether to prepare for the current or updated exam, and how to plan your PMP route.',
    h1: 'Is the PMP exam changing in 2026?',
    canonicalPath: '/answers/is-the-pmp-exam-changing-in-2026',
    regionFocus: ['Global'],
  },
  '/topics/pmp-exam-2026': {
    route: '/topics/pmp-exam-2026',
    pageRole: 'Topic hub',
    primaryKeyword: 'PMP exam 2026',
    secondaryKeywords: ['PMP 2026 changes', 'updated PMP domains', 'PMP 2026 preparation'],
    searchIntent: 'Informational / hub',
    funnelStage: 'Awareness + consideration',
    title: 'PMP Exam 2026 Topic Hub | Timeline & Preparation | PM Structure',
    description:
      'Explore PMP exam 2026 updates, readiness guidance, answer pages, and practical next steps for planning your PMP pathway.',
    h1: 'PMP Exam 2026 Guide',
    canonicalPath: '/topics/pmp-exam-2026',
    regionFocus: ['Global'],
  },
  '/pmp-exam-2026': {
    route: '/pmp-exam-2026',
    pageRole: 'Deep PMP 2026 cluster guide',
    primaryKeyword: 'PMP exam 2026 deep guide',
    secondaryKeywords: [
      'PMP 2026 readiness',
      'current vs updated PMP exam',
      'PMP domain weights 2026',
      'PMP eligibility training hours',
    ],
    searchIntent: 'Informational / deep guide',
    funnelStage: 'Consideration',
    title: 'PMP Exam 2026 Deep Guide | Readiness & Domains | PM Structure',
    description:
      'Deep PMP exam 2026 readiness guide: current vs updated exam routes, domain weights, eligibility, study steps, and independent preparation support from PM Structure.',
    h1: 'PMP Exam 2026: deep readiness guide',
    canonicalPath: '/pmp-exam-2026',
    regionFocus: ['Global'],
    relatedLinks: [
      pmpCommercial,
      { href: '/pmp-2026-pathway', label: 'PMP 2026 readiness pathway' },
      topicHub,
      { href: '/answers/is-the-pmp-exam-changing-in-2026', label: 'Is the PMP exam changing in 2026?' },
      faqLink,
    ],
  },
  '/pmp-2026-pathway': {
    route: '/pmp-2026-pathway',
    pageRole: 'PMP 2026 commercial pathway',
    primaryKeyword: 'PMP 2026 pathway roadmap',
    secondaryKeywords: [
      'PMP roadmap steps',
      'PMP 90 day focus',
      'PMP for engineers',
      'PMP mock tracking',
    ],
    searchIntent: 'Commercial investigation',
    funnelStage: 'Consideration',
    title: 'PMP 2026 Readiness Pathway | PM Structure',
    description:
      'Structured PMP 2026 readiness pathway: 90-day focus, roadmap steps, tier options, engineer FAQs, mock tracking, and trust expectations from PM Structure.',
    h1: 'PMP 2026 readiness pathway',
    canonicalPath: '/pmp-2026-pathway',
    regionFocus: ['Global'],
    relatedLinks: [
      pmpCommercial,
      { href: '/pmp-exam-2026', label: 'PMP exam 2026 deep guide' },
      topicHub,
      faqLink,
    ],
  },
  '/pmp-readiness-diagnostic': {
    route: '/pmp-readiness-diagnostic',
    pageRole: 'PMP readiness diagnostic',
    primaryKeyword: 'PMP readiness diagnostic',
    secondaryKeywords: ['PMP pathway fit', 'PMP exam timing', 'before July 2026 PMP'],
    searchIntent: 'Commercial investigation',
    funnelStage: 'Consideration',
    title: 'PMP Readiness Diagnostic | PM Structure',
    description:
      'Structured PMP readiness diagnostic: pathway fit, exam timing before or after July 2026, study capacity, and recommended Foundation, Professional, or Mastery pathway.',
    h1: 'PMP readiness diagnostic',
    canonicalPath: '/pmp-readiness-diagnostic',
    regionFocus: ['Global'],
    relatedLinks: [pmpCommercial, { href: '/pmp-exam-2026', label: 'PMP exam 2026 deep guide' }],
  },
  '/faq': {
    route: '/faq',
    pageRole: 'FAQ / trust page',
    primaryKeyword: 'PM Structure FAQ',
    secondaryKeywords: [
      'PMP training hours',
      'PM Structure PMI affiliation',
      'PMP pass guarantee',
      'exam fee included',
    ],
    searchIntent: 'Trust',
    funnelStage: 'Trust',
    title: 'PM Structure FAQ | PMP, Certification Prep & Readiness Support',
    description:
      'Find answers about PM Structure, PMP 2026 readiness, certification-body ownership, training-hour guidance, exam fees, membership, and independent preparation support.',
    h1: 'PM Structure FAQ',
    canonicalPath: '/faq',
    regionFocus: ['Global'],
    relatedLinks: [pmpCommercial, compareCerts, { href: '/legal/terms', label: 'Terms & Conditions' }],
  },
  '/certifications/compare': {
    route: '/certifications/compare',
    pageRole: 'Comparison page',
    primaryKeyword: 'compare project management certifications',
    secondaryKeywords: [
      'PMP vs PRINCE2',
      'PMP vs PMI-RMP',
      'PMP vs Six Sigma',
      'which certification should I choose',
    ],
    searchIntent: 'Commercial investigation',
    funnelStage: 'Consideration',
    title: 'Compare Project Management Certifications | PMP, PRINCE2, PMI-RMP & Six Sigma',
    description:
      'Compare PMP, PRINCE2, PMI-RMP, Lean Six Sigma, and other project management certification pathways by role fit, intent, difficulty, and next step.',
    h1: 'Compare project management certifications',
    canonicalPath: '/certifications/compare',
    regionFocus: ['Global'],
  },
  '/certifications/pmi-rmp': {
    route: '/certifications/pmi-rmp',
    pageRole: 'Secondary certification page',
    primaryKeyword: 'PMI-RMP exam preparation',
    secondaryKeywords: [
      'PMI risk management certification',
      'PMI-RMP pathway',
      'risk management certification',
    ],
    searchIntent: 'Commercial investigation',
    funnelStage: 'Waitlist / secondary',
    title: 'PMI-RMP Exam Preparation Pathway | PM Structure',
    description:
      'Explore the PMI-RMP risk management pathway with independent study support, readiness guidance, and comparison support from PM Structure.',
    h1: 'PMI-RMP Risk Management Pathway',
    canonicalPath: '/certifications/pmi-rmp',
    regionFocus: ['Global'],
  },
  '/certifications/prince2-practitioner': {
    route: '/certifications/prince2-practitioner',
    pageRole: 'Secondary certification page',
    primaryKeyword: 'PRINCE2 Practitioner preparation',
    secondaryKeywords: ['PRINCE2 Foundation vs Practitioner', 'PRINCE2 certification pathway'],
    searchIntent: 'Commercial investigation',
    funnelStage: 'Waitlist / secondary',
    title: 'PRINCE2 Practitioner Preparation Pathway | PM Structure',
    description:
      'Explore PRINCE2 Practitioner preparation with independent pathway guidance, study support, and certification comparison from PM Structure.',
    h1: 'PRINCE2 Practitioner Pathway',
    canonicalPath: '/certifications/prince2-practitioner',
    regionFocus: ['Global'],
  },
  '/certifications/lss-yellow': {
    route: '/certifications/lss-yellow',
    pageRole: 'Secondary certification page',
    primaryKeyword: 'Lean Six Sigma Yellow Belt preparation',
    secondaryKeywords: ['LSS Yellow Belt', 'process improvement certification', 'Six Sigma basics'],
    searchIntent: 'Commercial investigation',
    funnelStage: 'Waitlist / secondary',
    title: 'Lean Six Sigma Yellow Belt Preparation | PM Structure',
    description:
      'Explore Lean Six Sigma Yellow Belt preparation with process-improvement learning, independent study support, and pathway guidance.',
    h1: 'Lean Six Sigma Yellow Belt Pathway',
    canonicalPath: '/certifications/lss-yellow',
    regionFocus: ['Global'],
  },
  '/certifications/lss-black': {
    route: '/certifications/lss-black',
    pageRole: 'Secondary certification page',
    primaryKeyword: 'Lean Six Sigma Black Belt preparation',
    secondaryKeywords: [
      'LSS Black Belt',
      'Six Sigma project leadership',
      'process improvement leadership',
    ],
    searchIntent: 'Commercial investigation',
    funnelStage: 'Waitlist / secondary',
    title: 'Lean Six Sigma Black Belt Preparation | PM Structure',
    description:
      'Explore Lean Six Sigma Black Belt preparation with process-improvement structure, independent study support, and pathway guidance.',
    h1: 'Lean Six Sigma Black Belt Pathway',
    canonicalPath: '/certifications/lss-black',
    regionFocus: ['Global'],
  },
  '/membership': {
    route: '/membership',
    pageRole: 'Membership page',
    primaryKeyword: 'project management learning membership',
    secondaryKeywords: ['PMP resources', 'certification community', 'study support membership'],
    searchIntent: 'Commercial investigation',
    funnelStage: 'Support / retention',
    title: 'Project Management Learning Membership | PM Structure',
    description:
      'Use PM Structure membership as a support layer for preparation resources, community access where available, and structured learning support.',
    h1: 'Project Management Learning Membership',
    canonicalPath: '/membership',
    regionFocus: ['Global'],
    relatedLinks: [pmpCommercial],
  },
  '/community': {
    route: '/community',
    pageRole: 'Community page',
    primaryKeyword: 'project management learning community',
    secondaryKeywords: [
      'PMP study community',
      'certification support community',
      'project management community',
    ],
    searchIntent: 'Commercial investigation',
    funnelStage: 'Support / retention',
    title: 'Project Management Learning Community | PM Structure',
    description:
      'Join a structured project management learning community for preparation support, accountability, and certification pathway discussion where available.',
    h1: 'Project Management Learning Community',
    canonicalPath: '/community',
    regionFocus: ['Global'],
    relatedLinks: [{ href: '/certifications/pmp', label: 'PMP 2026 preparation support' }],
  },
  '/newsletter': {
    route: '/newsletter',
    pageRole: 'Newsletter page',
    primaryKeyword: 'project management newsletter',
    secondaryKeywords: [
      'PMP updates',
      'project management certification updates',
      'PMP 2026 newsletter',
    ],
    searchIntent: 'Informational / retention',
    funnelStage: 'Awareness + retention',
    title: 'Project Management Certification Newsletter | PM Structure',
    description:
      'Get project management certification updates, PMP 2026 readiness insights, and structured preparation guidance from PM Structure.',
    h1: 'Project Management Newsletter',
    canonicalPath: '/newsletter',
    regionFocus: ['Global'],
    relatedLinks: [pmpCommercial],
  },
  '/pm-service': {
    route: '/pm-service',
    pageRole: 'Services page',
    primaryKeyword: 'project management advisory services',
    secondaryKeywords: ['PMO governance', 'corporate PMP training', 'project delivery support'],
    searchIntent: 'B2B commercial',
    funnelStage: 'B2B',
    title: 'Project Management Advisory Services | PM Structure',
    description:
      'Explore PM Structure advisory services for PMO governance, project delivery support, corporate PMP readiness, and project management capability building.',
    h1: 'Project Management Advisory Services',
    canonicalPath: '/pm-service',
    regionFocus: ['GCC', 'South Asia'],
    relatedLinks: [{ href: '/certifications/pmp', label: 'PMP 2026 team readiness' }],
  },
  '/legal/terms': {
    route: '/legal/terms',
    pageRole: 'Legal / trust',
    primaryKeyword: 'PM Structure terms and conditions',
    searchIntent: 'Trust',
    funnelStage: 'Trust',
    title: 'Terms & Conditions | PM Structure',
    description:
      'Read PM Structure terms and conditions for certification preparation services, platform use, and learner responsibilities.',
    canonicalPath: '/legal/terms',
    regionFocus: ['Global'],
  },
  '/legal/privacy': {
    route: '/legal/privacy',
    pageRole: 'Legal / trust',
    primaryKeyword: 'PM Structure privacy policy',
    searchIntent: 'Trust',
    funnelStage: 'Trust',
    title: 'Privacy Policy | PM Structure',
    description:
      'Read how PM Structure collects, uses, and protects personal data for certification preparation and platform services.',
    canonicalPath: '/legal/privacy',
    regionFocus: ['Global'],
  },
};

export const PHASE_2_RELATED_BLOCKS: Record<string, RelatedLinkBlock> = {
  '/certifications/pmp': {
    title: 'Plan your PMP 2026 route',
    links: [
      {
        href: '/answers/is-the-pmp-exam-changing-in-2026',
        label: 'PMP exam change in 2026',
      },
      { href: '/topics/pmp-exam-2026', label: 'PMP exam 2026 topic hub' },
      { href: '/faq', label: 'PMP eligibility and training-hour FAQ' },
      compareCerts,
    ],
  },
  '/answers/is-the-pmp-exam-changing-in-2026': {
    title: 'Next steps for PMP 2026 candidates',
    links: [
      pmpCommercial,
      topicHub,
      faqLink,
    ],
  },
  '/topics/pmp-exam-2026': {
    title: 'PMP 2026 preparation links',
    links: [
      pmpCommercial,
      {
        href: '/answers/is-the-pmp-exam-changing-in-2026',
        label: 'Is the PMP Exam Changing in 2026?',
      },
      compareCerts,
      faqLink,
    ],
  },
  '/certifications/compare': {
    title: 'Compare your next certification route',
    links: [
      pmpCommercial,
      { href: '/certifications/prince2-practitioner', label: 'PRINCE2 Practitioner pathway' },
      { href: '/certifications/pmi-rmp', label: 'PMI-RMP risk management pathway' },
      { href: '/certifications/lss-yellow', label: 'Lean Six Sigma Yellow Belt pathway' },
      { href: '/certifications/lss-black', label: 'Lean Six Sigma Black Belt pathway' },
    ],
  },
  '/certifications': {
    title: 'Start with a certification pathway',
    links: [
      pmpCommercial,
      compareCerts,
      { href: '/certifications/pmi-rmp', label: 'PMI-RMP Risk Management Pathway' },
      { href: '/certifications/pgmp', label: 'PgMP Program Management Pathway' },
      { href: '/certifications/prince2-practitioner', label: 'PRINCE2 Practitioner Pathway' },
      { href: '/certifications/lss-yellow', label: 'Lean Six Sigma Yellow Belt Pathway' },
      { href: '/certifications/lss-black', label: 'Lean Six Sigma Black Belt Pathway' },
    ],
  },
};

export const PHASE_2_PRIORITY_ROUTES = Object.keys(PHASE_2_PAGE_SEO);

export function getPhase2Seo(path: string): PageSeoConfig | undefined {
  const normalized = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
  return PHASE_2_PAGE_SEO[normalized];
}

export function getPhase2RelatedBlock(path: string): RelatedLinkBlock | undefined {
  const normalized = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
  return PHASE_2_RELATED_BLOCKS[normalized];
}

/** Skip appending `| PM Structure` when the title already carries the brand. */
export function titleNeedsNoSuffix(title: string): boolean {
  if (title.includes('| PM Structure')) return true;
  if (title.startsWith('PM Structure')) return true;
  return false;
}
