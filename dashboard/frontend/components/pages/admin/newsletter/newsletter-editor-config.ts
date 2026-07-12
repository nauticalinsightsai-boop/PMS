export const NEWSLETTER_TONES = [
  'informative',
  'casual',
  'witty',
  'formal',
  'friendly',
  'authoritative',
  'conversational',
] as const;

export type NewsletterTone = (typeof NEWSLETTER_TONES)[number];

export const NEWSLETTER_SEGMENTS = [
  { id: 'all', label: 'All subscribers' },
  { id: 'new', label: 'New welcome' },
  { id: 'premium', label: 'Premium exclusive' },
  { id: 'inactive', label: 'Inactive re-engagement' },
  { id: 'pmp', label: 'PMP candidates' },
  { id: 'enterprise', label: 'Enterprise leaders' },
] as const;

export type NewsletterSegmentId = (typeof NEWSLETTER_SEGMENTS)[number]['id'];

export const NEWSLETTER_TEMPLATES = [
  { id: 'news_roundup', label: 'News Roundup', description: 'Lead story + quick hits + deep link' },
  { id: 'deep_dive', label: 'Deep Dive', description: 'Executive summary with analysis sections' },
  { id: 'tips_tricks', label: 'Tips & Tricks', description: 'Numbered actionable tips' },
  { id: 'spotlight', label: 'Spotlight', description: 'Feature one person, project, or case study' },
  { id: 'upcoming_events', label: 'Upcoming Events', description: 'Dates, agendas, and registration CTAs' },
  { id: 'reader_qa', label: 'Reader Q&A', description: 'Question-and-answer format' },
  { id: 'certification_brief', label: 'Certification Brief', description: 'Exam updates and study guidance' },
] as const;

export type NewsletterTemplateId = (typeof NEWSLETTER_TEMPLATES)[number]['id'];

export const CONTENT_SNIPPETS = [
  {
    id: 'cta',
    label: 'Primary CTA block',
    text: '\n\n---\n**Ready to take the next step?** Book a free pathway review with our mentors.\n[Schedule a call](https://pmstructure.com/certifications)\n---\n',
  },
  {
    id: 'quote',
    label: 'Pull quote',
    text: '\n\n> "The best project leaders treat safety and delivery as one system—not competing priorities."\n> — Sheikh M. Abdullah\n',
  },
  {
    id: 'divider',
    label: 'Section divider',
    text: '\n\n---\n',
  },
  {
    id: 'bullets',
    label: 'Key takeaways',
    text: '\n\n## Key takeaways\n- \n- \n- \n',
  },
  {
    id: 'resources',
    label: 'Resources list',
    text: '\n\n## Further reading\n- [Resource title](https://)\n- [Resource title](https://)\n',
  },
] as const;

const TEMPLATE_SECTIONS: Record<NewsletterTemplateId, string[]> = {
  news_roundup: ['Lead story', 'Quick hits', 'Deep dive', 'What to watch'],
  deep_dive: ['Executive summary', 'Context', 'Analysis', 'Recommendations', 'Next steps'],
  tips_tricks: ['Opening hook', 'Tip 1', 'Tip 2', 'Tip 3', 'Tip 4', 'Wrap-up'],
  spotlight: ['Why this matters', 'The story', 'Lessons learned', 'Apply it this week'],
  upcoming_events: ['Headline event', 'Agenda highlights', 'Who should attend', 'Register'],
  reader_qa: ['This week’s question', 'Short answer', 'Expanded guidance', 'Ask us next'],
  certification_brief: ['Exam snapshot', 'What changed', 'Study focus', 'PM Structure support'],
};

export function buildNewsletterScaffold(options: {
  title: string;
  tone: NewsletterTone;
  template: NewsletterTemplateId;
  segmentLabel: string;
  sectionCount: number;
  rawNotes: string;
  ctaLabel?: string;
  ctaUrl?: string;
  preheader?: string;
}): string {
  const headings =
    TEMPLATE_SECTIONS[options.template]?.slice(0, Math.max(2, Math.min(8, options.sectionCount))) ??
    Array.from({ length: options.sectionCount }, (_, i) => `Section ${i + 1}`);

  const notesBlock = options.rawNotes.trim()
    ? `\n## Source notes\n${options.rawNotes
        .trim()
        .split('\n')
        .map((line) => (line.trim() ? `- ${line.trim().replace(/^-+\s*/, '')}` : ''))
        .filter(Boolean)
        .join('\n')}\n`
    : '';

  const ctaBlock =
    options.ctaLabel?.trim() && options.ctaUrl?.trim()
      ? `\n---\n**${options.ctaLabel.trim()}** → ${options.ctaUrl.trim()}\n---\n`
      : '';

  const templateLabel =
    NEWSLETTER_TEMPLATES.find((item) => item.id === options.template)?.label ?? 'Custom';

  return [
    `# ${options.title || 'Newsletter draft'}`,
    '',
    `_Audience: ${options.segmentLabel} · Tone: ${options.tone} · Template: ${templateLabel}_`,
    options.preheader?.trim() ? `_Inbox preview: ${options.preheader.trim()}_` : '',
    '',
    '## Opening',
    '',
    'Write a strong hook in 2–3 sentences. State the reader outcome upfront.',
    '',
    ...headings.flatMap((heading) => [`## ${heading}`, '', '']),
    notesBlock.trimEnd(),
    ctaBlock.trimEnd(),
  ]
    .filter((line, index, arr) => !(line === '' && arr[index - 1] === ''))
    .join('\n');
}

export function extractContentOutline(content: string): string[] {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('## '))
    .map((line) => line.replace(/^##\s+/, ''));
}
