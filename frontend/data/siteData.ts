import { 
  FamilyConfig, 
  CertificationSummary, 
  MembershipTier, 
  NewsletterPost, 
  Testimonial, 
  NavLink, 
  FooterSection,
  SiteCTA
} from "../types/site";

export const familyConfigs: Record<string, FamilyConfig> = {
  PMI: {
    id: "PMI",
    name: "PMI® Certifications",
    description: "Independent PMI exam-preparation and structured readiness pathways.",
    accent: "bg-pms-gradient-blue-purple",
    text: "text-brand-purple",
    border: "border-brand-purple/20",
    lightBg: "bg-brand-purple/5",
    gradient: "from-[#2851b9] to-[#bc6ae2]"
  },
  PRINCE2: {
    id: "PRINCE2",
    name: "PRINCE2® / Governance",
    description: "Governance-led methodology preparation for controlled delivery.",
    accent: "bg-pms-gradient-blue-cyan",
    text: "text-brand-cyan",
    border: "border-brand-cyan/30",
    lightBg: "bg-brand-cyan/5",
    gradient: "from-[#0859b3] to-[#57d5e2]"
  },
  SixSigma: {
    id: "SixSigma",
    name: "Lean Six Sigma",
    description: "Process-improvement pathways built on DMAIC and measurable outcomes.",
    accent: "bg-pms-gradient-charcoal",
    text: "text-pms-charcoal",
    border: "border-pms-charcoal/20",
    lightBg: "bg-pms-charcoal/5",
    gradient: "from-[#262a33] to-[#434855]"
  }
};

export const featuredCertifications = [
  { id: "pmp", title: "PMP®", desc: "Flagship PMI readiness pathway with structured ECO coverage and scenario-based preparation.", family: "PMI", color: "#6D28D9" },
  { id: "prince2", title: "PRINCE2®", desc: "Governance-led methodology preparation for controlled delivery through stages and tolerances.", family: "PRINCE2", color: "#0F766E" },
  { id: "lss-green", title: "Lean Six Sigma", desc: "Process-improvement pathway built on DMAIC discipline and measurable operational outcomes.", family: "SixSigma", color: "#15803D" },
];

export const certifications: CertificationSummary[] = [
  // PMI Family
  {
    id: "capm",
    name: "CAPM®",
    familyId: "PMI",
    desc: "Certified Associate in Project Management - Entry level fundamentals.",
    outputValue: "Entry / junior PM signal",
    pricing: {
      Foundation: { duration: "1 wk", price: 250 },
      Professional: { duration: "4 wks", price: 750 },
      Elite: { duration: "6 wks", price: 1100 }
    },
    color: "#22C7F7",
    gradient: "from-[#9BE7FF] to-[#22C7F7]",
    targetAudience: "Early-career PMs, coordinators, graduates, career-changers; 'no experience required.'",
    prerequisites: "Secondary degree + 23 hours of project management education completed before the exam.",
    examFormat: "150 questions; 180 minutes; includes 15 unscored pretest questions (135 scored). Pass score not published (psychometric).",
    registrationSteps: "Create PMI account → enter education + 23 hours → application acceptance → pay → schedule at Pearson VUE or online → up to three attempts in a year.",
    officialFee: "$225 (member) – $300 (full).",
    trainingPriceRange: "~$995–$1,795 for structured prep.",
    learningOutcomes: ["Core PM concepts", "Basic scheduling/cost/risk vocabulary", "Agile fundamentals", "Business analysis basics aligned to CAPM domains"],
    suggestedResources: ["CAPM ECO", "PMI on-demand/instructor-led references", "PMI certification handbook policies"],
    recommendedCTA: "Earn your CAPM — complete the 23 hours, practice with exam-style questions, and schedule with confidence.",
    regionalDemand: "CAPM is positioned as a global foundational credential and is exam-delivered in multiple languages; commonly attractive in early-career markets and outsourcing hubs."
  },
  {
    id: "pmp",
    name: "PMP®",
    familyId: "PMI",
    desc: "Project Management Professional — structured PMI exam-preparation support for experienced project leaders.",
    outputValue: "Core flagship / strongest broad PM value",
    pricing: {
      Foundation: { duration: "2 wks", price: 250 },
      Professional: { duration: "6 wks", price: 1000 },
      Elite: { duration: "12 wks", price: 1500 }
    },
    color: "#6D28D9",
    gradient: "from-[#D8B4FE] to-[#6D28D9]",
    targetAudience: "Project managers leading cross-functional teams; professionals seeking a globally recognized PM credential.",
    prerequisites: "Either: (A) four-year degree + 36 months leading projects (past 8 years) + 35 hours PM education/training (or active CAPM), or (B) secondary diploma + 60 months leading projects + 35 hours education/training (or active CAPM).",
    examFormat: "180 questions; 230 minutes; includes 5 unscored pretest questions; pass score not published (psychometric).",
    registrationSteps: "Check eligibility → complete application → pay/schedule exam via Pearson VUE (center or online) → study → sit exam; up to three attempts in one-year eligibility period.",
    officialFee: "Member price $405; full price $655.",
    trainingPriceRange: "~$500–$3,000 (provider-dependent).",
    learningOutcomes: ["Define/plan work using predictive + hybrid patterns", "Lead teams and stakeholders", "Manage delivery, risk, and quality", "Tailor agile practices", "Align outcomes to business environment"],
    suggestedResources: ["PMP Exam Content Outline (ECO)", "Sample questions", "PMI certification handbook policies"],
    recommendedCTA: "Check eligibility and start your PMP path — build a plan, train to 35+ hours, and book your exam.",
    regionalDemand: "PMP has very large global holder base; PMI highlights top countries including China and Canada (with the US also listed)."
  },
  {
    id: "pmi-acp",
    name: "PMI-ACP®",
    familyId: "PMI",
    desc: "Agile Certified Practitioner - Agile principles and practices.",
    outputValue: "Agile specialist / high practical value",
    pricing: {
      Foundation: { duration: "1 wk", price: 250 },
      Professional: { duration: "4 wks", price: 900 },
      Elite: { duration: "8 wks", price: 1350 }
    },
    color: "#2563EB",
    gradient: "from-[#7DD3FC] to-[#2563EB]",
    targetAudience: "Scrum masters, product owners, agile team leads, PMs in agile/hybrid delivery.",
    prerequisites: "High school diploma or higher; agile experience via one of multiple pathways (e.g., 2 years agile experience, or PMP, etc.); 21 hours of formal agile training.",
    examFormat: "120 questions; 180 minutes; pass score not published (psychometric).",
    registrationSteps: "Confirm eligibility → apply → pay/schedule → study → earn → maintain.",
    officialFee: "$435 (member) – $495 (full).",
    trainingPriceRange: "~$900–$2,000 depending on provider/format.",
    learningOutcomes: ["Agile principles", "Backlog/value delivery", "Team facilitation", "Agile planning/estimation", "Hybrid tailoring and governance"],
    suggestedResources: ["PMI-ACP ECO", "PMI/ATP exam prep pathways", "PMI certification handbook"],
    recommendedCTA: "Prove your agile delivery skills — validate experience, complete 21 hours, and book your PMI-ACP exam.",
    regionalDemand: "Agile credentials tend to be strongest where software/product delivery is high; PMI frames PMI-ACP as a 'gold standard'."
  },
  {
    id: "pmi-rmp",
    name: "PMI-RMP®",
    familyId: "PMI",
    desc: "Risk Management Professional - Advanced risk management.",
    outputValue: "Risk specialist / strong niche value",
    pricing: {
      Foundation: { duration: "1 wk", price: 300 },
      Professional: { duration: "5 wks", price: 1000 },
      Elite: { duration: "8 wks", price: 1450 }
    },
    color: "#A21CAF",
    gradient: "from-[#F0ABFC] to-[#A21CAF]",
    targetAudience: "Risk leads, PMs on complex projects, PMO/portfolio risk professionals.",
    prerequisites: "Secondary diploma + 36 months project risk experience (past 5 years) + 40 hours project risk education.",
    examFormat: "115 questions; 150 minutes; pass score not published (psychometric).",
    registrationSteps: "Check eligibility → complete application → identity verification via Persona → pay/schedule → sit exam.",
    officialFee: "$520 (member) – $670 (full).",
    trainingPriceRange: "~$1,199–$1,695 for bootcamp-style prep.",
    learningOutcomes: ["Risk planning strategy", "Qualitative/quantitative analysis", "Responses and reserves", "Governance/reporting", "Risk integration in schedules/costs"],
    suggestedResources: ["PMI-RMP ECO", "PMI exam prep resources", "PMI certification handbook"],
    recommendedCTA: "Become the risk specialist teams rely on — meet the 40-hour education requirement and validate your risk leadership.",
    regionalDemand: "Best positioned in infrastructure, energy, construction, and regulated sectors where risk governance is explicit."
  },
  {
    id: "pmi-pba",
    name: "PMI-PBA®",
    familyId: "PMI",
    desc: "Professional in Business Analysis.",
    outputValue: "BA + requirements specialist / strong business value",
    pricing: {
      Foundation: { duration: "2 wks", price: 300 },
      Professional: { duration: "6 wks", price: 1050 },
      Elite: { duration: "10 wks", price: 1500 }
    },
    color: "#1D4ED8",
    gradient: "from-[#93C5FD] to-[#1D4ED8]",
    targetAudience: "Business analysts, product/business analysis leads, PMs doing requirements/benefits work.",
    prerequisites: "Multiple sets (A/B/C) based on education, requiring 36–60 months BA experience and 35 contact hours in BA practices.",
    examFormat: "200 questions; 240 minutes; pass score not published (psychometric).",
    registrationSteps: "Check eligibility (choose Set A/B/C) → apply → pay/schedule → up to three attempts/year eligibility.",
    officialFee: "$405 (member) – $555 (full).",
    trainingPriceRange: "~$995 (on-demand) to ~$1,995+ (instructor-led).",
    learningOutcomes: ["Needs assessment", "Requirements elicitation/analysis", "Traceability", "Stakeholder alignment", "Evaluation and value realization"],
    suggestedResources: ["PMI-PBA handbook", "PMI-PBA ECO and domain breakdown", "PMI certification handbook"],
    recommendedCTA: "Formalize your BA leadership — meet the 35 contact hours and prepare with role-based cases.",
    regionalDemand: "Strong in ERP/IT services, banking, and product orgs where BA is a defined role."
  },
  {
    id: "pmi-sp",
    name: "PMI-SP®",
    familyId: "PMI",
    desc: "Scheduling Professional - Advanced scheduling and planning.",
    outputValue: "Precision / planning specialist value",
    pricing: {
      Foundation: { duration: "1 wk", price: 300 },
      Professional: { duration: "5 wks", price: 950 },
      Elite: { duration: "8 wks", price: 1400 }
    },
    color: "#0F766E",
    gradient: "from-[#67E8F9] to-[#0F766E]",
    targetAudience: "Planners/schedulers, controls engineers, PMs in complex schedule-driven environments.",
    prerequisites: "Multiple sets; Set A: secondary degree + 40 months scheduling experience + 40 hours scheduling education; Set B: four-year degree + 24 months experience + 30 hours education.",
    examFormat: "170 questions; 210 minutes; includes 20 unscored pretest questions (150 scored). Pass score not published (psychometric).",
    registrationSteps: "Check eligibility → apply → pay/schedule → sit exam (attempts policy per PMI).",
    officialFee: "$520 (member) – $670 (full).",
    trainingPriceRange: "Examples range from ~$1,275 (live online) to ~$2,975 (classroom).",
    learningOutcomes: ["CPM fundamentals", "Baselines/change control", "Monitoring/forecasting", "Schedule risk interfaces", "Stakeholder reporting"],
    suggestedResources: ["PMI-SP ECO", "PMI reference lists and prep resources", "PMI certification handbook"],
    recommendedCTA: "Own the schedule — meet eligibility, train to the required hours, and master control techniques.",
    regionalDemand: "Especially relevant for construction, EPC, infrastructure megaprojects, and regulated industries."
  },
  {
    id: "pmi-pmocp",
    name: "PMI-PMOCP™",
    familyId: "PMI",
    desc: "PMO Certified Professional - Governance and maturity.",
    outputValue: "Governance / maturity specialist value",
    pricing: {
      Foundation: { duration: "1 wk", price: 350 },
      Professional: { duration: "5 wks", price: 1100 },
      Elite: { duration: "8 wks", price: 1600 }
    },
    color: "#B08968",
    gradient: "from-[#F6E7C1] to-[#B08968]",
    targetAudience: "PMO managers, PMO leads, transformation/portfolio governance professionals.",
    prerequisites: "Secondary degree; 3 years project-related experience within last 8 years OR PMP in good standing; 10 hours of PMO education.",
    examFormat: "120 questions; 165 minutes; pass score not published (psychometric).",
    registrationSteps: "Check eligibility → apply (audit possible) → pay/schedule → sit exam.",
    officialFee: "$475 (member) – $655 (full).",
    trainingPriceRange: "PMI prep course: $160–$200 (10 hours); bootcamp examples ~$999.",
    learningOutcomes: ["PMO operating model", "Strategic alignment", "Performance metrics", "Governance cadence", "Continuous improvement of PMO services"],
    suggestedResources: ["PMI-PMOCP ECO", "PMI prep course (10 hours) and related materials"],
    recommendedCTA: "Design and run a value-driven PMO — hit the 10-hour requirement and prepare for PMI-PMOCP.",
    regionalDemand: "Most marketable where PMO maturity is increasing (enterprise services, finance, large delivery orgs)."
  },
  {
    id: "pmi-cp",
    name: "Construction Professional (PMI-CP)™",
    familyId: "PMI",
    desc: "Construction Professional - Built environment leadership.",
    outputValue: "Built environment / grounded leadership",
    pricing: {
      Foundation: { duration: "2 wks", price: 300 },
      Professional: { duration: "6 wks", price: 1200 },
      Elite: { duration: "10 wks", price: 1800 }
    },
    color: "#9A3412",
    gradient: "from-[#FDBA74] to-[#9A3412]",
    targetAudience: "Construction PMs, site/project controls leaders, built-environment delivery roles.",
    prerequisites: "Complete four required foundational course modules (6–10 hours each) + 3 years on-the-job experience in construction/built environment projects (past 10 years).",
    examFormat: "120 questions; 230 minutes; pass score not published (psychometric).",
    registrationSteps: "Complete modules → check eligibility → apply (document experience/training) → pay/schedule → study/take exam.",
    officialFee: "$399 (member) – $499 (full).",
    trainingPriceRange: "Examples include ~$2,399 for a 56-contact-hour instructor-led package.",
    learningOutcomes: ["Contract planning", "Construction execution controls", "Stakeholder/safety interfaces", "Schedule/cost integration", "Sustainability-aware delivery"],
    suggestedResources: ["PMI-CP ECO", "The four official modules", "PMI certification handbook"],
    recommendedCTA: "Become PMI-CP ready — complete the four modules, validate experience, and master construction delivery.",
    regionalDemand: "Strong where infrastructure/building pipelines are high; PMI positions this around 'future-proof' skills."
  },
  {
    id: "pmi-cpmai",
    name: "Managing AI (PMI-CPMAI)™",
    familyId: "PMI",
    desc: "AI in Project Management - Future-facing leadership.",
    outputValue: "Advanced / future-facing AI leadership",
    pricing: {
      Foundation: { duration: "2 wks", price: 250 },
      Professional: { duration: "4 wks", price: 1200 },
      Elite: { duration: "8 wks", price: 1800 }
    },
    color: "#7C3AED",
    gradient: "from-[#C084FC] to-[#0891B2]",
    targetAudience: "PMs, technologists, data/AI professionals, consultants delivering AI initiatives.",
    prerequisites: "Official page states 'No experience required' (bundle includes a 21-hour exam prep course).",
    examFormat: "120 questions; 160 minutes; pass score not published (psychometric).",
    registrationSteps: "Steps to certification include eligibility/details/scheduling/study/earn (structured per bundle).",
    officialFee: "$699 (member) – $899 (full).",
    trainingPriceRange: "Examples: premium bundles around ~$889; low-cost practice/prep offerings exist.",
    learningOutcomes: ["Scope AI initiatives", "Align AI to business needs", "Govern ethical/measurable outcomes", "Manage DataOps dependencies", "Cross-functional delivery patterns"],
    suggestedResources: ["PMI-CPMAI ECO", "Official 21-hour exam prep course", "PMI certification handbook"],
    recommendedCTA: "Lead AI projects with structure — complete the 21-hour track and prove PMI-CPMAI readiness.",
    regionalDemand: "AI PM demand is cross-region; PMI positions CPMAI as 'tool-agnostic' and structured for scaling AI outcomes."
  },
  {
    id: "gpm-b",
    name: "Green Project Manager – Basic (GPM-b)™",
    familyId: "PMI",
    desc: "Green Project Manager - Sustainable project delivery.",
    outputValue: "Sustainability / green delivery value",
    pricing: {
      Foundation: { duration: "1 wk", price: 250 },
      Professional: { duration: "3 wks", price: 900 },
      Elite: { duration: "6 wks", price: 1300 }
    },
    color: "#15803D",
    gradient: "from-[#86EFAC] to-[#15803D]",
    targetAudience: "PMs adding sustainability capability; professionals needing ethics/sustainability framing within PM work.",
    prerequisites: "Requires qualifying certification/degree (CAPM/PMP/etc.) or qualifying master's degree; bundle fulfills training requirement.",
    examFormat: "75 multiple-choice questions; 90 minutes; pass rules unspecified.",
    registrationSteps: "Buy bundle → confirm eligibility → apply → schedule → take exam.",
    officialFee: "Bundle pricing $399 (member) – $525 (full) (course + exam bundle).",
    trainingPriceRange: "Bundle-based; typical third-party training is unspecified.",
    learningOutcomes: ["Sustainability management plan concepts", "Impacts assessment", "Sustainability-integrated governance and communications", "Ethics-focused delivery language"],
    suggestedResources: ["GPM-b ECO", "Official bundle course materials"],
    recommendedCTA: "Add sustainability to your PM toolkit — confirm eligibility and complete the GPM-b pathway.",
    regionalDemand: "Strong positioning in construction/infrastructure and corporate ESG-driven programs."
  },
  {
    id: "pgmp",
    name: "PgMP®",
    familyId: "PMI",
    desc: "Program Management Professional.",
    outputValue: "Senior leadership / programme-level value",
    pricing: {
      Foundation: { duration: "2 wks", price: 350 },
      Professional: { duration: "8 wks", price: 1500 },
      Elite: { duration: "12 wks", price: 2500 }
    },
    color: "#F97316",
    gradient: "from-[#FDBA74] to-[#F97316]",
    targetAudience: "Senior program managers; PMO leaders responsible for program governance and benefits delivery.",
    prerequisites: "Sets A/B/C based on education; includes project management experience (or PMP) and 36–84 months program management experience. Panel review is part of the pathway.",
    examFormat: "170 questions; 240 minutes; pass score not published (psychometric).",
    registrationSteps: "Eligibility → application → pay → panel review → schedule exam; up to three attempts/year eligibility.",
    officialFee: "$800 (member) – $1,000 (full).",
    trainingPriceRange: "Published ranges ~$800–$2,800 depending on provider/location.",
    learningOutcomes: ["Program strategy alignment", "Governance structures", "Benefits management", "Stakeholder engagement", "Coordination across projects"],
    suggestedResources: ["PgMP ECO", "Sample questions", "PMI certification handbook"],
    recommendedCTA: "Move from projects to programs — validate experience, pass panel review, and lead strategic outcomes.",
    regionalDemand: "Strongest in large enterprises and public-sector/regulated environments with multi-project delivery."
  },
  {
    id: "pfmp",
    name: "PfMP®",
    familyId: "PMI",
    desc: "Portfolio Management Professional.",
    outputValue: "Executive / highest portfolio signal",
    pricing: {
      Foundation: { duration: "2 wks", price: 400 },
      Professional: { duration: "8 wks", price: 1800 },
      Elite: { duration: "12 wks", price: 2800 }
    },
    color: "#991B1B",
    gradient: "from-[#FB923C] to-[#991B1B]",
    targetAudience: "Portfolio managers, PMO directors, strategy execution leaders.",
    prerequisites: "Sets A/B/C include extensive professional and portfolio experience (e.g., Set A: 96 months business experience + 84 months portfolio experience).",
    examFormat: "170 questions; 240 minutes; pass score not published (psychometric).",
    registrationSteps: "Eligibility → application → pay/schedule (panel review typically part of path).",
    officialFee: "$800 (member) – $1,000 (full).",
    trainingPriceRange: "Example bootcamp pricing ~$1,499 (provider example).",
    learningOutcomes: ["Strategic alignment", "Governance", "Portfolio performance", "Portfolio risk", "Communications management"],
    suggestedResources: ["PfMP ECO", "Official reference list", "PMI certification handbook"],
    recommendedCTA: "Lead portfolio decisions with confidence — master governance and performance at the executive level.",
    regionalDemand: "Highest value in mature PMO/portfolio environments; PMI links portfolio maturity to higher program success."
  },

  // PRINCE2 / Governance Family
  {
    id: "prince2",
    name: "PRINCE2® 7 Foundation",
    familyId: "PRINCE2",
    desc: "Projects in Controlled Environments - Process-based method.",
    outputValue: "Core structured methodology value",
    pricing: {
      Foundation: { duration: "1 wk", price: 250 },
      Professional: { duration: "3 wks", price: 1000 },
      Elite: { duration: "6 wks", price: 1500 }
    },
    color: "#0F766E",
    gradient: "from-[#5EEAD4] to-[#0F766E]",
    targetAudience: "PMs, team leads, analysts, coordinators; organizations standardizing project governance language.",
    prerequisites: "None (Foundation-level).",
    examFormat: "60 questions; 60 minutes; closed book; pass mark 60%.",
    registrationSteps: "Purchase exam/bundle → select language → book online proctored exam or via partner → sit exam.",
    officialFee: "Self-study exam bundle options from $701 (US).",
    trainingPriceRange: "Third-party bundles vary; treat as provider-dependent.",
    learningOutcomes: ["PRINCE2 principles/themes/process model", "Roles & governance", "Management stages/controls", "Product-based planning basics"],
    suggestedResources: ["Official PRINCE2 (v7) eBook", "PeopleCert learning kit options", "Official mock exam add-ons"],
    recommendedCTA: "Learn PRINCE2 governance fast — start with Foundation and build a controlled delivery mindset.",
    regionalDemand: "Positioned as globally recognized; uptake is historically strong in the UK and Europe."
  },
  {
    id: "prince2-practitioner",
    name: "PRINCE2® 7 Practitioner",
    familyId: "PRINCE2",
    desc: "Advanced application of the PRINCE2 method.",
    outputValue: "Practitioner-level governance mastery",
    pricing: {
      Foundation: { duration: "1 wk", price: 250 },
      Professional: { duration: "4 wks", price: 1100 },
      Elite: { duration: "8 wks", price: 1700 }
    },
    color: "#0F766E",
    gradient: "from-[#5EEAD4] to-[#0F766E]",
    targetAudience: "Practicing PMs and delivery leads implementing PRINCE2 governance in real projects.",
    prerequisites: "Foundation pass required before progressing to Practitioner.",
    examFormat: "Objective testing; 56 questions worth 70 marks; 150 minutes; open book; pass mark 60%.",
    registrationSteps: "Buy exam bundle → choose language → schedule online proctoring or with partner.",
    officialFee: "Exam bundle options from $778 (US).",
    trainingPriceRange: "Foundation+Practitioner combined training often sits in multi-thousand USD range.",
    learningOutcomes: ["Tailoring PRINCE2 controls", "Management products", "Risk/issues/change integration", "Scenario-based decision-making"],
    suggestedResources: ["Official eBook", "Learning resource kit", "Interactive eLearning", "Mock exam options"],
    recommendedCTA: "Move from theory to application — become PRINCE2 Practitioner-ready with scenario drills.",
    regionalDemand: "Strongest where PRINCE2 is used as an organizational method; strong UK/Europe footprint."
  },
  {
    id: "prince2-agile",
    name: "PRINCE2 Agile® Foundation",
    familyId: "PRINCE2",
    desc: "Structured agile governance value.",
    outputValue: "Structured agile governance value",
    pricing: {
      Foundation: { duration: "1 wk", price: 250 },
      Professional: { duration: "3 wks", price: 1000 },
      Elite: { duration: "6 wks", price: 1500 }
    },
    color: "#0369A1",
    gradient: "from-[#7DD3FC] to-[#14B8A6]",
    targetAudience: "PMs, agile leads, teams operating in hybrid governance environments.",
    prerequisites: "None (Foundation-level).",
    examFormat: "40 questions; 60 minutes; closed book; pass mark 60%.",
    registrationSteps: "Purchase exam bundle → choose language → schedule online proctored exam or via partner network.",
    officialFee: "Exam bundle options from $701 (US).",
    trainingPriceRange: "Provider-dependent (often bundled with exam voucher and official materials).",
    learningOutcomes: ["PRINCE2 governance in agile contexts", "Tailoring controls", "Agile behaviors and delivery", "Integrating roles/ceremonies"],
    suggestedResources: ["Official PRINCE2 Agile eBook", "Learning resource kit", "Interactive eLearning", "Mock exam add-on"],
    recommendedCTA: "Run agile projects with governance — master PRINCE2 Agile Foundation fast.",
    regionalDemand: "Strong where hybrid delivery is common; global adoption by both public and private sectors."
  },
  {
    id: "prince2-agile-practitioner",
    name: "PRINCE2 Agile® Practitioner",
    familyId: "PRINCE2",
    desc: "Advanced application of PRINCE2 Agile.",
    outputValue: "Practitioner-level agile governance mastery",
    pricing: {
      Foundation: { duration: "1 wk", price: 250 },
      Professional: { duration: "4 wks", price: 1100 },
      Elite: { duration: "8 wks", price: 1700 }
    },
    color: "#0369A1",
    gradient: "from-[#7DD3FC] to-[#14B8A6]",
    targetAudience: "PMs and leads delivering agile work under formal governance.",
    prerequisites: "Foundation typically required before Practitioner.",
    examFormat: "50 questions; 150 minutes; open book; pass mark 60%.",
    registrationSteps: "Purchase PeopleCert bundle → choose language → schedule exam.",
    officialFee: "Exam bundle options from $778 (US).",
    trainingPriceRange: "Provider-dependent; commonly sold as bundles.",
    learningOutcomes: ["Tailoring PRINCE2 controls for agile", "Scenario-driven decisions", "Integrating agile planning/metrics"],
    suggestedResources: ["Official eBook", "Learning kit", "Interactive eLearning", "Mock exam options"],
    recommendedCTA: "Prove you can tailor governance for agility — become PRINCE2 Agile Practitioner-ready.",
    regionalDemand: "Strong fit for Europe/UK governance-heavy environments and US enterprise hybrid contexts."
  },
  {
    id: "msp",
    name: "MSP®",
    familyId: "PRINCE2",
    desc: "Managing Successful Programmes.",
    outputValue: "Programme governance / senior value",
    pricing: {
      Foundation: { duration: "5–7 days", price: 350 },
      Professional: { duration: "5–6 weeks", price: 1150 },
      Elite: { duration: "8–10 weeks", price: 1700 }
    },
    color: "#155E75",
    gradient: "from-[#67E8F9] to-[#155E75]"
  },
  {
    id: "mop",
    name: "MoP®",
    familyId: "PRINCE2",
    desc: "Management of Portfolios.",
    outputValue: "Portfolio governance / senior value",
    pricing: {
      Foundation: { duration: "5–7 days", price: 350 },
      Professional: { duration: "5–6 weeks", price: 1150 },
      Elite: { duration: "8–10 weeks", price: 1700 }
    },
    color: "#1E3A8A",
    gradient: "from-[#93C5FD] to-[#1E3A8A]"
  },
  {
    id: "mor",
    name: "M_o_R®",
    familyId: "PRINCE2",
    desc: "Management of Risk.",
    outputValue: "Risk governance / specialist value",
    pricing: {
      Foundation: { duration: "4–5 days", price: 300 },
      Professional: { duration: "4–5 weeks", price: 900 },
      Elite: { duration: "7–8 weeks", price: 1300 }
    },
    color: "#5B21B6",
    gradient: "from-[#C4B5FD] to-[#5B21B6]"
  },
  {
    id: "p3o",
    name: "P3O®",
    familyId: "PRINCE2",
    desc: "Portfolio, Programme and Project Offices.",
    outputValue: "PMO governance / specialist value",
    pricing: {
      Foundation: { duration: "4–5 days", price: 300 },
      Professional: { duration: "4–5 weeks", price: 900 },
      Elite: { duration: "7–8 weeks", price: 1300 }
    },
    color: "#334155",
    gradient: "from-[#94A3B8] to-[#155E75]"
  },

  // Lean Six Sigma Family
  {
    id: "lss-white",
    name: "Six Sigma White Belt",
    familyId: "SixSigma",
    desc: "Awareness-level introduction to Six Sigma language and basic improvement thinking.",
    outputValue: "Entry / awareness value",
    pricing: {
      Foundation: { duration: "4 days", price: 250 },
      Professional: { duration: "2 wks", price: 600 },
      Elite: { duration: "4 wks", price: 900 }
    },
    color: "#DDE3EA",
    gradient: "from-[#F8FAFC] to-[#CBD5E1]",
    targetAudience: "Entire organization awareness; new joiners; cross-functional teams.",
    prerequisites: "None.",
    examFormat: "Unspecified (varies by provider; often completion-based).",
    registrationSteps: "Unspecified (provider-specific).",
    officialFee: "Unspecified.",
    trainingPriceRange: "Unspecified (varies widely; often free/low-cost in the market).",
    learningOutcomes: ["Vocabulary", "Role map", "Basic variation and waste concepts", "How to participate in projects"],
    suggestedResources: ["PM Structure internal primer", "Aligned public BoK overviews"],
    recommendedCTA: "Get Six Sigma fluent — start with an executive-friendly White Belt foundation.",
    regionalDemand: "Useful as corporate enablement across regions; strongest when bundled into Yellow/Green adoption."
  },
  {
    id: "lss-yellow",
    name: "Six Sigma Yellow Belt (CSSYB)",
    familyId: "SixSigma",
    desc: "Foundational Six Sigma credential for supporting improvement projects.",
    outputValue: "Foundational improvement value",
    pricing: {
      Foundation: { duration: "1 wk", price: 250 },
      Professional: { duration: "3 wks", price: 900 },
      Elite: { duration: "6 wks", price: 1200 }
    },
    color: "#CA8A04",
    gradient: "from-[#FACC15] to-[#CA8A04]",
    targetAudience: "Team members supporting projects; professionals new to structured process improvement.",
    prerequisites: "No experience or education requirements (per ASQ).",
    examFormat: "90 questions (80 scored); 2h18m; open book; pass = scaled score 550/750.",
    registrationSteps: "Apply → ASQ review → schedule via Prometric in testing window.",
    officialFee: "Exam fee $434; retake $234; ASQ member saves $100.",
    trainingPriceRange: "ASQ official prep eLearning: list $424 / member $324.",
    learningOutcomes: ["Six Sigma fundamentals", "Basic data collection", "Root-cause tools", "Basics of DMAIC support work", "Team roles"],
    suggestedResources: ["CSSYB Body of Knowledge", "ASQ handbook/study guide", "ASQ practice question bank"],
    recommendedCTA: "Start your Six Sigma journey — build the fundamentals and earn CSSYB readiness.",
    regionalDemand: "ASQ operates globally; the belt ladder is recognized across industries."
  },
  {
    id: "lss-green",
    name: "Six Sigma Green Belt (CSSGB)",
    familyId: "SixSigma",
    desc: "Validates competence to lead smaller improvement projects using DMAIC.",
    outputValue: "Applied improvement / strong practitioner value",
    pricing: {
      Foundation: { duration: "2 wks", price: 250 },
      Professional: { duration: "6 wks", price: 1000 },
      Elite: { duration: "10 wks", price: 1500 }
    },
    color: "#15803D",
    gradient: "from-[#4ADE80] to-[#15803D]",
    targetAudience: "Process improvement leads, operations excellence roles, quality professionals leading projects.",
    prerequisites: "3 years full-time paid work experience in areas of the CSSGB BoK.",
    examFormat: "110 questions (100 scored); 4h18m; open book; pass = scaled score 550/750.",
    registrationSteps: "Apply → ASQ review → schedule with Prometric in testing window.",
    officialFee: "Exam fee $483; retake $283; ASQ member saves $100.",
    trainingPriceRange: "ASQ prep eLearning: list $824 / member $724.",
    learningOutcomes: ["DMAIC execution", "Basic stats/MSA", "Capability and control charts", "Lean waste reduction", "Project chartering and stakeholder updates"],
    suggestedResources: ["CSSGB BoK", "ASQ handbook and study guide", "ASQ question bank"],
    recommendedCTA: "Lead measurable improvements — build Green Belt capability with structured practice.",
    regionalDemand: "Highly transferrable across manufacturing, services, healthcare."
  },
  {
    id: "lss-black",
    name: "Six Sigma Black Belt (CSSBB)",
    familyId: "SixSigma",
    desc: "Advanced credential for leading complex improvement projects and coaching teams.",
    outputValue: "Advanced improvement leadership value",
    pricing: {
      Foundation: { duration: "2 wks", price: 350 },
      Professional: { duration: "8 wks", price: 1300 },
      Elite: { duration: "12 wks", price: 2000 }
    },
    color: "#111827",
    gradient: "from-[#374151] to-[#111827]",
    targetAudience: "Senior improvement leaders; quality/OpEx professionals leading cross-functional projects.",
    prerequisites: "3 years full-time paid work experience + one completed project with signed affidavit.",
    examFormat: "165 questions (150 scored); 4h18m; open book; pass = scaled score 550/750.",
    registrationSteps: "Apply + affidavit documentation → ASQ review → schedule with Prometric.",
    officialFee: "Exam fee $585; retake $385; member saves $100.",
    trainingPriceRange: "ASQ prep eLearning: list $924 / member $824.",
    learningOutcomes: ["Advanced stats/DOE", "Enterprise deployment", "Team dynamics/leadership", "Risk analysis", "Sustaining control plans and benefits"],
    suggestedResources: ["CSSBB BoK", "ASQ handbook + study guide", "ASQ question bank"],
    recommendedCTA: "Lead complex transformations — become ASQ Black Belt-ready with intensive practice.",
    regionalDemand: "Strong in manufacturing/healthcare/finance process excellence."
  },
  {
    id: "lss-master",
    name: "Master Black Belt (CMBB)",
    familyId: "SixSigma",
    desc: "Top-tier credential with portfolio review plus exam and performance-based assessment.",
    outputValue: "Highest / darkest improvement signal",
    pricing: {
      Foundation: { duration: "4 wks", price: 500 },
      Professional: { duration: "10 wks", price: 2000 },
      Elite: { duration: "16 wks", price: 3500 }
    },
    color: "#030712",
    gradient: "from-[#1F2937] to-[#030712]",
    targetAudience: "Senior MBBs / senior CSSBBs with deep enterprise deployment and mentoring experience.",
    prerequisites: "Must hold current ASQ CSSBB and pass portfolio review; 5 years in SSBB/MBB role or 10 projects.",
    examFormat: "110 multiple-choice items + performance-based assessment; 5h20m. Pass = scaled score 550/750.",
    registrationSteps: "Apply → portfolio review (approval required) → register for exam → sit exam.",
    officialFee: "$800 portfolio review + $1,599 exam; retake $1,399.",
    trainingPriceRange: "Not standardized; high-end MBB courses are often several thousand.",
    learningOutcomes: ["Enterprise deployment leadership", "Mentoring/coaching systems", "Advanced analytics strategy", "Portfolio evidence writing", "Governance at scale"],
    suggestedResources: ["Master Black Belt portfolio guide", "CMBB BoK references", "ASQ scoring/recert guidance"],
    recommendedCTA: "Move into enterprise excellence leadership — prepare your portfolio and master the CMBB bar.",
    regionalDemand: "Niche and senior; highest fit for large manufacturing/enterprise orgs."
  },
  {
    id: "lss-champion",
    name: "Six Sigma Champion",
    familyId: "SixSigma",
    desc: "Executive/leadership role focused on selecting projects and sponsoring benefits realization.",
    outputValue: "Executive sponsorship value",
    pricing: {
      Foundation: { duration: "1 wk", price: 350 },
      Professional: { duration: "3 wks", price: 1200 },
      Elite: { duration: "6 wks", price: 1800 }
    },
    color: "#334155",
    gradient: "from-[#475569] to-[#1e293b]",
    targetAudience: "Directors, functional leaders, transformation sponsors, PMO/OpEx sponsors.",
    prerequisites: "Unspecified; typically leadership role.",
    examFormat: "Unspecified (commonly training/assessment-based).",
    registrationSteps: "Unspecified.",
    officialFee: "Unspecified.",
    trainingPriceRange: "Unspecified (provider-dependent; often corporate-only).",
    learningOutcomes: ["Project selection governance", "Benefits tracking", "Coaching cadence", "Barrier removal", "Adoption/standardization strategy"],
    suggestedResources: ["PM Structure champion playbook", "ASQ/IASSC belt role definitions"],
    recommendedCTA: "Sponsor transformation, not just training — become an effective Six Sigma Champion.",
    regionalDemand: "Highly relevant for enterprise transformation programs and consulting-led deployments."
  },
  {
    id: "foundation-direct",
    name: "Foundation Direct Pathway",
    familyId: "FoundationDirect",
    desc: "Foundational vocabulary across PMI, PRINCE2, and Six Sigma — best explored after a pathway consultation to confirm fit.",
    outputValue: "Multi-framework foundation / career bridge",
    pricing: {
      Foundation: { duration: "2 days", price: 150 },
      Professional: { duration: "1 wk", price: 450 },
      Elite: { duration: "2 wks", price: 750 }
    },
    color: "#F97316",
    gradient: "from-brand-orange to-brand-deep",
    targetAudience: "Fresh graduates, career changers, and executives needing a quick PM bridge.",
    learningOutcomes: ["Unified PM vocabulary", "Multi-framework comparison", "Fast-track execution tools", "Career mapping"],
  },
];

export const membershipTiers: MembershipTier[] = [
  {
    name: "Free Tier",
    price: "$0",
    period: "/year",
    description: "Essential resources for project enthusiasts.",
    features: ["Monthly Newsletter", "Basic Study Guides", "Public Community Access", "Public Forums"],
    cta: "Create Free Account",
    variant: "outline"
  },
  {
    name: "Professional",
    price: "$199",
    period: "/year",
    description: "Exam-focused tools, templates, and support for measurable certification readiness.",
    features: ["All Free Features", "Premium Exam Simulator", "Exclusive Weekly Sessions", "Private Slack Community", "AI-Powered CV Maker"],
    cta: "Join Professional",
    variant: "default",
    highlight: true
  },
  {
    name: "Mastery",
    price: "$499",
    period: "/year",
    description: "Mentor-led support for senior professionals who need deeper accountability and readiness review.",
    features: ["All Professional Features", "1-on-1 Mentorship Session", "Priority Support", "Bulk Cert Licenses"],
    cta: "Join Mastery",
    variant: "outline"
  }
];

export const newsletterPosts: NewsletterPost[] = [
  {
    id: "1",
    title: "Preparing for the 2026 PMP Exam Content Outline",
    excerpt: "Everything you need to know about the latest changes to the PMP exam and how to prepare effectively.",
    author: "Robert Vance",
    date: "Oct 12, 2024",
    category: "Exam Prep",
    image: "https://picsum.photos/seed/pmp-exam/800/600",
    readTime: "8 min read"
  },
  {
    id: "2",
    title: "Agile vs. Waterfall: Choosing the Right Framework",
    excerpt: "A deep dive into project methodologies and how to select the best one for your team's specific needs.",
    author: "Elena Gilbert",
    date: "Oct 10, 2024",
    category: "Agile",
    image: "https://picsum.photos/seed/agile/800/600",
    readTime: "6 min read"
  },
  {
    id: "3",
    title: "The Rise of AI in Project Management",
    excerpt: "How artificial intelligence is transforming scheduling, risk assessment, and resource allocation.",
    author: "Marcus Chen",
    date: "Oct 08, 2024",
    category: "Technology",
    image: "https://picsum.photos/seed/ai-pm/800/600",
    readTime: "10 min read"
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    role: "Senior PM at TechCorp",
    company: "Global Tech Solutions",
    content: "The PM Structure PMP pathway gave me a structured study rhythm, weak-area tracking, and mentor-style review. I knew where I stood before exam day — and passed with Above Target in all domains.",
    avatar: "https://i.pravatar.cc/100?u=sarah"
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Agile Coach",
    company: "Innovate Corp",
    content: "The PMI-ACP readiness support focused on scenarios and weak-area revision, not random videos. The practice environment closely matched exam conditions, which built real confidence.",
    avatar: "https://i.pravatar.cc/100?u=michael"
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    role: "Project Coordinator",
    company: "Future Build",
    content: "The Foundation pathway gave me structured vocabulary and a clear study rhythm during my career transition. I could speak with senior PMs with more confidence from week one.",
    avatar: "https://i.pravatar.cc/100?u=elena"
  },
  {
    id: "4",
    name: "James Wilson",
    role: "Operations Director",
    company: "Process Master",
    content: "The Lean Six Sigma Green Belt course was rigorous but very practical. I was able to implement a project at work immediately that saved us over $50k in the first quarter.",
    avatar: "https://i.pravatar.cc/100?u=james"
  }
];

export const mainNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Certifications", href: "/certifications" },
  { label: "Membership", href: "/membership" },
  { label: "Community", href: "/community" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "About", href: "/about" },
];

export const footerSections: FooterSection[] = [
  {
    title: "Certifications",
    links: [
      { label: "PMP® Prep", href: "/certifications/pmp" },
      { label: "CAPM® Prep", href: "/certifications/capm" },
      { label: "Agile (ACP)®", href: "/certifications/pmi-acp" },
      { label: "PRINCE2®", href: "/certifications/prince2" },
      { label: "Compare pathways", href: "/compare" },
    ]
  },
  {
    title: "Community",
    links: [
      { label: "Slack Channel", href: "/community" },
      { label: "Study Circles", href: "/community" },
      { label: "Resource Store", href: "/community?view=store" },
      { label: "Events", href: "/community" },
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy" },
    ]
  }
];

export const heroCTA: SiteCTA = {
  title: "Structured project management capability",
  subtitle: "Choose your pathway. Prepare with measurable readiness.",
  primaryButton: { label: "Book consultation", href: "/contact" },
  secondaryButton: { label: "Check readiness", href: "/certifications" }
};
