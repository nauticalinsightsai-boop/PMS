/**
 * Packet B - unique SEO + decision-role copy for the eight exact-description
 * certification pages. Facts limited to repository-supported pathway framing;
 * no invented eligibility, fees, dates, or accreditation claims.
 */
export type PacketBCertDifferentiation = {
  id: string;
  path: string;
  title: string;
  h1: string;
  description: string;
  /** Unique hero/intro prose used as detailHeroSubtitle. */
  intro: string;
  /** Extra unique main-content paragraphs (dossier-friendly). */
  decisionCopy: string[];
  related: ReadonlyArray<{ href: string; label: string }>;
};

export const PACKET_B_CERT_IDS = [
  'prince2-agile',
  'prince2-agile-practitioner',
  'msp',
  'mop',
  'mor',
  'lss-green',
  'lss-master',
  'lss-champion',
] as const;

export type PacketBCertId = (typeof PACKET_B_CERT_IDS)[number];

export const PACKET_B_CERT_DIFFERENTIATION: Record<PacketBCertId, PacketBCertDifferentiation> = {
  'prince2-agile': {
    id: 'prince2-agile',
    path: '/certifications/prince2-agile',
    title: 'PRINCE2 Agile Foundation Pathway | PM Structure',
    h1: 'PRINCE2 Agile Foundation Pathway',
    description:
      'PRINCE2 Agile Foundation overview for hybrid delivery teams: governance in agile contexts, pathway comparison, and independent prep support from PM Structure.',
    intro:
      'PRINCE2 Agile Foundation is the broad entry pathway for professionals who need PRINCE2-style governance language inside agile and hybrid delivery environments. Use this page to decide whether Foundation-level orientation is the right first step before Practitioner application work.',
    decisionCopy: [
      'This pathway is for project managers, agile leads, and team members operating where formal controls and agile ceremonies must coexist. It differs from classic PRINCE2 Foundation by focusing on hybrid governance behaviours rather than process-method depth alone.',
      'Compared with PRINCE2 Agile Practitioner, Foundation emphasises orientation and shared vocabulary. Practitioner emphasises scenario-driven tailoring once Foundation concepts are in place.',
      'Next step: compare adjacent PRINCE2 family pathways, then choose Foundation if you need a shared hybrid-governance baseline before deeper application practice. Always verify exam rules with the awarding body before booking.',
    ],
    related: [
      { href: '/certifications/prince2-agile-practitioner', label: 'PRINCE2 Agile Practitioner pathway' },
      { href: '/certifications/prince2-practitioner', label: 'PRINCE2 Practitioner pathway' },
      { href: '/certifications/compare', label: 'Compare certification pathways' },
      { href: '/certifications', label: 'All certification pathways' },
    ],
  },
  'prince2-agile-practitioner': {
    id: 'prince2-agile-practitioner',
    path: '/certifications/prince2-agile-practitioner',
    title: 'PRINCE2 Agile Practitioner Pathway | PM Structure',
    h1: 'PRINCE2 Agile Practitioner Pathway',
    description:
      'PRINCE2 Agile Practitioner pathway for applying hybrid governance in real delivery scenarios, with comparison links and independent preparation support.',
    intro:
      'PRINCE2 Agile Practitioner is the application-level pathway for professionals who already understand Foundation concepts and need to practise tailoring controls, metrics, and decisions in agile delivery contexts.',
    decisionCopy: [
      'This pathway serves project managers and leads who deliver agile work under formal governance expectations. It is not an introductory overview; it assumes you can move from definitions into scenario decisions.',
      'It differs from PRINCE2 Agile Foundation by emphasising practitioner application and from classic PRINCE2 Practitioner by keeping the agile/hybrid delivery lens central.',
      'Next step: confirm Foundation readiness, compare with classic PRINCE2 Practitioner if your organisation is method-first rather than hybrid-first, and verify awarding-body prerequisites before scheduling an exam.',
    ],
    related: [
      { href: '/certifications/prince2-agile', label: 'PRINCE2 Agile Foundation pathway' },
      { href: '/certifications/prince2-practitioner', label: 'PRINCE2 Practitioner pathway' },
      { href: '/certifications/compare', label: 'Compare certification pathways' },
      { href: '/certifications', label: 'All certification pathways' },
    ],
  },
  msp: {
    id: 'msp',
    path: '/certifications/msp',
    title: 'MSP Programme Management Pathway | PM Structure',
    h1: 'MSP Programme Management Pathway',
    description:
      'MSP (Managing Successful Programmes) pathway for programme governance and multi-project change, with family comparison and independent study support.',
    intro:
      'MSP is the programme-management pathway in the PRINCE2-family catalogue: it focuses on coordinating related projects to deliver organisational outcomes, not on single-project controls alone.',
    decisionCopy: [
      'Choose MSP when your decision role sits above individual projects: benefits realisation, tranche planning, and programme governance across a change portfolio.',
      'It differs from MoP (portfolio selection and balance) and from M_o_R (risk frameworks). MSP is about running programmes of change; MoP is about choosing and prioritising the right investment set; M_o_R is about risk management practice.',
      'Next step: compare MSP with MoP if your bottleneck is investment selection rather than programme delivery, and confirm official syllabus and exam options with the awarding body before enrolling.',
    ],
    related: [
      { href: '/certifications/mop', label: 'MoP portfolio management pathway' },
      { href: '/certifications/mor', label: 'M_o_R risk management pathway' },
      { href: '/certifications/compare', label: 'Compare certification pathways' },
      { href: '/certifications', label: 'All certification pathways' },
    ],
  },
  mop: {
    id: 'mop',
    path: '/certifications/mop',
    title: 'MoP Portfolio Management Pathway | PM Structure',
    h1: 'MoP Portfolio Management Pathway',
    description:
      'MoP (Management of Portfolios) pathway for portfolio prioritisation and investment balance, with comparison to MSP/M_o_R and independent prep support.',
    intro:
      'MoP is the portfolio-management pathway: it helps organisations decide which initiatives deserve investment, how to balance the portfolio, and how to oversee delivery at the investment level.',
    decisionCopy: [
      'This pathway fits PMO leaders, portfolio analysts, and senior sponsors who own prioritisation and benefits tracking across many initiatives.',
      'Unlike MSP, MoP is not primarily about running a single programme of related projects. Unlike M_o_R, it is not a dedicated risk method. MoP answers “what should we invest in?” rather than “how do we run this programme?” or “how do we manage risk?”',
      'Next step: if your pain is programme delivery mechanics, compare MSP; if risk governance is the gap, compare M_o_R. Verify official MoP materials and exam routes with the awarding body.',
    ],
    related: [
      { href: '/certifications/msp', label: 'MSP programme management pathway' },
      { href: '/certifications/mor', label: 'M_o_R risk management pathway' },
      { href: '/certifications/compare', label: 'Compare certification pathways' },
      { href: '/certifications', label: 'All certification pathways' },
    ],
  },
  mor: {
    id: 'mor',
    path: '/certifications/mor',
    title: 'M_o_R Risk Management Pathway | PM Structure',
    h1: 'M_o_R Risk Management Pathway',
    description:
      'M_o_R (Management of Risk) pathway for organisational risk practice, distinct from MSP programme and MoP portfolio routes, with independent prep support.',
    intro:
      'M_o_R is the risk-management pathway in this family: it concentrates on embedding risk identification, assessment, and response practice across projects, programmes, and operations.',
    decisionCopy: [
      'Select M_o_R when your primary gap is risk governance capability rather than programme delivery (MSP) or portfolio selection (MoP).',
      'It differs from PMI-RMP and other PMI risk credentials by sitting in the PRINCE2-family methods set used heavily in UK/Europe governance contexts. Do not treat the labels as interchangeable without checking your employer’s preferred framework.',
      'Next step: compare with MSP/MoP if your role is broader PMO leadership, and confirm the current M_o_R syllabus and exam options with the awarding body before you commit study time.',
    ],
    related: [
      { href: '/certifications/msp', label: 'MSP programme management pathway' },
      { href: '/certifications/mop', label: 'MoP portfolio management pathway' },
      { href: '/certifications/pmi-rmp', label: 'PMI-RMP risk pathway' },
      { href: '/certifications/compare', label: 'Compare certification pathways' },
    ],
  },
  'lss-green': {
    id: 'lss-green',
    path: '/certifications/lss-green',
    title: 'Six Sigma Green Belt Pathway | PM Structure',
    h1: 'Six Sigma Green Belt (CSSGB) Pathway',
    description:
      'Six Sigma Green Belt pathway for leading smaller DMAIC improvement projects, with belt-ladder comparison and independent preparation support from PM Structure.',
    intro:
      'Six Sigma Green Belt (CSSGB) is the practitioner-level process-improvement pathway for professionals who lead smaller DMAIC projects and apply core statistical and lean tools.',
    decisionCopy: [
      'This pathway is for operations, quality, and improvement leads who own project-sized problems rather than enterprise deployment alone.',
      'It differs from Yellow Belt (fundamentals/support) and Black Belt (complex cross-functional leadership). Master Black Belt is a later coaching/system-leadership step; Champion is a sponsorship role, not a substitute Green Belt.',
      'Next step: if you are still learning vocabulary, compare Yellow Belt; if you already lead complex multi-workstream improvements, compare Black Belt. Confirm ASQ (or your chosen body) prerequisites and exam windows before applying.',
    ],
    related: [
      { href: '/certifications/lss-yellow', label: 'Six Sigma Yellow Belt pathway' },
      { href: '/certifications/lss-black', label: 'Six Sigma Black Belt pathway' },
      { href: '/certifications/lss-champion', label: 'Six Sigma Champion pathway' },
      { href: '/certifications/compare', label: 'Compare certification pathways' },
    ],
  },
  'lss-master': {
    id: 'lss-master',
    path: '/certifications/lss-master',
    title: 'Master Black Belt (CMBB) Pathway | PM Structure',
    h1: 'Master Black Belt (CMBB) Pathway',
    description:
      'Master Black Belt pathway for enterprise coaching and system-level improvement leadership, distinct from Green/Black practitioner routes, with independent prep support.',
    intro:
      'Master Black Belt (CMBB) is the advanced coaching and system-leadership pathway for senior improvement leaders who mentor belts, shape deployment systems, and evidence a portfolio of outcomes.',
    decisionCopy: [
      'Use this pathway when your role is enterprise excellence leadership rather than leading a single DMAIC project as a Green or Black Belt.',
      'Registry-supported framing: portfolio review plus exam/performance assessment distinguishes CMBB from CSSGB/CSSBB practitioner routes. Champion remains a sponsorship path, not an MBB substitute.',
      'Next step: confirm you already meet the Black Belt and portfolio evidence expectations in the official body guidance, then compare Champion if your gap is sponsorship rather than technical coaching depth.',
    ],
    related: [
      { href: '/certifications/lss-black', label: 'Six Sigma Black Belt pathway' },
      { href: '/certifications/lss-green', label: 'Six Sigma Green Belt pathway' },
      { href: '/certifications/lss-champion', label: 'Six Sigma Champion pathway' },
      { href: '/certifications/compare', label: 'Compare certification pathways' },
    ],
  },
  'lss-champion': {
    id: 'lss-champion',
    path: '/certifications/lss-champion',
    title: 'Six Sigma Champion Pathway | PM Structure',
    h1: 'Six Sigma Champion Pathway',
    description:
      'Six Sigma Champion pathway for sponsors who select projects and enable benefits realisation, distinct from Green/Black practitioner belts, with independent guidance.',
    intro:
      'Six Sigma Champion is the sponsor and organisational-enablement pathway: it focuses on selecting the right projects, removing barriers, and sustaining benefits rather than running DMAIC toolwork day to day.',
    decisionCopy: [
      'This pathway fits directors, functional leaders, and transformation sponsors who govern improvement portfolios and coaching cadence.',
      'It differs from Green Belt and Black Belt practitioner credentials and from Master Black Belt technical coaching depth. Champions enable; belts execute and coach technically.',
      'Next step: if you need hands-on DMAIC capability, compare Green or Black Belt. If you need enterprise coaching systems, compare Master Black Belt. Confirm provider expectations because Champion offerings are often organisational rather than a single public exam format.',
    ],
    related: [
      { href: '/certifications/lss-green', label: 'Six Sigma Green Belt pathway' },
      { href: '/certifications/lss-black', label: 'Six Sigma Black Belt pathway' },
      { href: '/certifications/lss-master', label: 'Master Black Belt pathway' },
      { href: '/certifications/compare', label: 'Compare certification pathways' },
    ],
  },
};

export function getPacketBCertDifferentiation(id: string): PacketBCertDifferentiation | undefined {
  return PACKET_B_CERT_DIFFERENTIATION[id as PacketBCertId];
}

export function packetBUniqueWordCount(entry: PacketBCertDifferentiation): number {
  const text = [entry.title, entry.h1, entry.description, entry.intro, ...entry.decisionCopy].join(' ');
  return text
    .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}
