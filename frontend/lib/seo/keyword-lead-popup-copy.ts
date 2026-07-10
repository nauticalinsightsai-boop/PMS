import type { KeywordIntent } from '@/content/seo/keyword-redirect-map';

export type KeywordLeadPopupCopy = {
  headline: string;
  body: string;
  submitLabel: string;
  whatsappLabel: string;
  scheduleLabel: string;
  whatsappMessage: string;
};

export function resolveKeywordLeadPopupCopy(input: {
  intent?: KeywordIntent | string;
  keyword?: string;
}): KeywordLeadPopupCopy {
  const keyword = input.keyword?.trim() || 'your certification pathway';
  const intent = input.intent ?? 'Commercial';

  if (intent.startsWith('B2B')) {
    return {
      headline: 'Talk to a mentor about corporate training',
      body: `Share a few details and we will help plan workshops or cohort training related to ${keyword}.`,
      submitLabel: 'Send details',
      whatsappLabel: 'WhatsApp a mentor',
      scheduleLabel: 'Schedule a meeting',
      whatsappMessage: `Hi PM Structure, I am interested in corporate / workshop support for: ${keyword}.`,
    };
  }

  if (intent === 'Lead Magnet') {
    return {
      headline: 'Get mock-exam guidance from a mentor',
      body: 'Leave your details, message a mentor on WhatsApp, or book a short planning call.',
      submitLabel: 'Send details',
      whatsappLabel: 'WhatsApp a mentor',
      scheduleLabel: 'Schedule a meeting',
      whatsappMessage: `Hi PM Structure, I want help with PMP mock exam / practice questions (${keyword}).`,
    };
  }

  if (intent === 'Informational') {
    return {
      headline: 'Get clarity from a mentor',
      body: `Ask about ${keyword} — send details, WhatsApp a mentor, or schedule a meeting.`,
      submitLabel: 'Send details',
      whatsappLabel: 'WhatsApp a mentor',
      scheduleLabel: 'Schedule a meeting',
      whatsappMessage: `Hi PM Structure, I have a question about: ${keyword}.`,
    };
  }

  if (intent === 'Commercial Investigation') {
    return {
      headline: 'Ask about fees, costs, and next steps',
      body: `Get a clear answer on ${keyword} from a mentor — form, WhatsApp, or a booked call.`,
      submitLabel: 'Send details',
      whatsappLabel: 'WhatsApp a mentor',
      scheduleLabel: 'Schedule a meeting',
      whatsappMessage: `Hi PM Structure, I want clarity on fees/costs for: ${keyword}.`,
    };
  }

  if (intent === 'Transactional' || intent === 'Commercial + Transactional') {
    return {
      headline: 'Ready to start? Talk to a mentor',
      body: `Share your details for ${keyword}, or message us on WhatsApp / book a meeting.`,
      submitLabel: 'Send details',
      whatsappLabel: 'WhatsApp a mentor',
      scheduleLabel: 'Schedule a meeting',
      whatsappMessage: `Hi PM Structure, I want to enrol / start training for: ${keyword}.`,
    };
  }

  return {
    headline: 'Talk to a mentor',
    body: `Add your details for ${keyword}, WhatsApp a mentor, or schedule a meeting.`,
    submitLabel: 'Send details',
    whatsappLabel: 'WhatsApp a mentor',
    scheduleLabel: 'Schedule a meeting',
    whatsappMessage: `Hi PM Structure, I am interested in: ${keyword}.`,
  };
}
