export interface NewsletterArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  /** Article body paragraphs */
  body: string[];
}

export const newsletterArticles: NewsletterArticle[] = [
  {
    slug: '2026-pmp-exam-changes',
    title: "The 2026 PMP® Exam: What's Really Changing?",
    excerpt:
      'A deep dive into the new Exam Content Outline (ECO) and how it impacts your study strategy for the coming year.',
    category: 'Exam Strategies',
    date: 'Oct 12, 2025',
    author: 'Dr. Robert Chen',
    readTime: '8 min read',
    image: 'https://picsum.photos/seed/pmp/800/600',
    body: [
      'PMI’s latest Exam Content Outline shifts emphasis toward hybrid delivery, stakeholder engagement, and value-driven decision-making. If you prepared under the previous ECO, you do not need to start from zero—but you should remap your study plan to the new task domains.',
      'We recommend anchoring weekly study blocks to official task statements, then validating weak areas with timed mocks. Structure matters more than volume: three focused sessions often outperform scattered evening reading.',
      'For 2026 candidates, prioritize situational judgment over memorizing inputs/outputs. The exam rewards practitioners who can select the best next action under constraints—exactly how real projects run.',
    ],
  },
  {
    slug: 'hybrid-methodologies-enterprise',
    title: 'Mastering Hybrid Methodologies in Enterprise Projects',
    excerpt:
      "Why the 'Waterfall vs Agile' debate is dead, and how the most successful PMOs are blending both for maximum efficiency.",
    category: 'Agile',
    date: 'Oct 10, 2025',
    author: 'Sarah Jenkins',
    readTime: '12 min read',
    image: 'https://picsum.photos/seed/agile/800/600',
    body: [
      'Enterprise PMOs are no longer choosing a single religion. Governance gates from predictive methods coexist with iterative delivery teams, especially where compliance and speed both matter.',
      'A practical hybrid model defines which decisions are fixed per phase (budget envelopes, regulatory checkpoints) and which are negotiated each sprint (scope slices, team capacity).',
      'Leaders who succeed document the rules of engagement upfront. That clarity reduces thrash when executives ask for “just one more waterfall report” while teams run two-week cycles.',
    ],
  },
  {
    slug: 'risk-beyond-probability-matrix',
    title: "Risk Management: Beyond the Probability Matrix",
    excerpt:
      "Advanced techniques for identifying 'Black Swan' events in complex infrastructure projects.",
    category: 'Risk',
    date: 'Oct 08, 2025',
    author: 'Marcus Thorne',
    readTime: '10 min read',
    image: 'https://picsum.photos/seed/risk/800/600',
    body: [
      'Heat maps are useful for communication, but they rarely capture dependency chains that amplify small failures. Start with interface risks between vendors, regulators, and internal ops.',
      'Pre-mortems and scenario trees help teams articulate low-probability, high-impact events without being dismissed as pessimism. The goal is prepared response, not paralysis.',
      'Reserve capacity—schedule, budget, and decision bandwidth—is the bridge between identification and resilience. Track reserves explicitly so they are not silently consumed.',
    ],
  },
  {
    slug: 'ai-augmented-project-manager',
    title: 'The Rise of the AI-Augmented Project Manager',
    excerpt:
      'How generative AI is transforming risk assessment, resource allocation, and stakeholder communication.',
    category: 'Career Growth',
    date: 'Oct 05, 2025',
    author: 'Elena Rodriguez',
    readTime: '15 min read',
    image: 'https://picsum.photos/seed/ai/800/600',
    body: [
      'AI assistants accelerate drafting status reports, summarizing RAID logs, and generating what-if scenarios—but the PM still owns judgment, ethics, and stakeholder trust.',
      'Start with low-risk workflows: meeting notes, comms templates, and backlog refinement prompts. Validate outputs against your standards before they reach executives.',
      'The competitive edge in 2026 is not “using AI” but integrating it into disciplined routines: weekly planning, readiness reviews, and lessons-learned capture.',
    ],
  },
  {
    slug: 'prince2-7th-edition-practitioner',
    title: "PRINCE2® 7th Edition: A Practitioner's Perspective",
    excerpt:
      "Key takeaways from the latest update to the world's most popular project management methodology.",
    category: 'PRINCE2',
    date: 'Oct 02, 2025',
    author: 'James Wilson',
    readTime: '7 min read',
    image: 'https://picsum.photos/seed/prince/800/600',
    body: [
      'The seventh edition sharpens language around sustainability, data, and people—without abandoning the principles/themes/process spine practitioners already know.',
      'If you certified on earlier versions, focus gap study on tailoring guidance and modern governance patterns rather than re-memorizing the entire manual.',
      'PRINCE2 remains strongest where accountability and stage boundaries are non-negotiable. Pair it with agile delivery teams through clear interface roles.',
    ],
  },
  {
    slug: 'building-high-performance-pmo',
    title: 'Building a High-Performance PMO from Scratch',
    excerpt:
      'A step-by-step guide to establishing governance, standards, and value delivery in a growing organization.',
    category: 'PMO',
    date: 'Sep 28, 2025',
    author: 'Linda Wu',
    readTime: '20 min read',
    image: 'https://picsum.photos/seed/pmo/800/600',
    body: [
      'A PMO earns credibility by solving one painful executive problem first—portfolio visibility, resource conflicts, or benefits tracking—not by publishing templates nobody uses.',
      'Phase the rollout: charter and success metrics, then minimum viable standards, then tooling. Each phase should ship a visible win within a quarter.',
      'Measure the PMO like a product: cycle time for decisions, forecast accuracy, and satisfaction from project managers in the field.',
    ],
  },
];

export function getNewsletterArticle(slug: string): NewsletterArticle | undefined {
  return newsletterArticles.find((a) => a.slug === slug);
}

export function getNewsletterArticleHref(article: Pick<NewsletterArticle, 'slug'>): string {
  return `/newsletter/${article.slug}`;
}
