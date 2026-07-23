import type { KeywordIntent } from '@/content/seo/keyword-redirect-map';
import type { KeywordH1MetaRow } from '@/content/seo/keyword-h1-meta';

export type KeywordLeadPopupCopy = {
  headline: string;
  body: string;
  submitLabel: string;
  whatsappLabel: string;
  scheduleLabel: string;
  whatsappMessage: string;
};

function resolveSubmitLabel(cta: string | undefined, fallback: string): string {
  const trimmed = cta?.trim();
  if (!trimmed) return fallback;
  // Multi-channel CTAs stay as form "Send details"; keep WhatsApp on its own button.
  if (/whatsapp/i.test(trimmed) || /\+/.test(trimmed) || /\//.test(trimmed)) {
    return fallback;
  }
  return trimmed.length <= 40 ? trimmed : fallback;
}

export function resolveKeywordLeadPopupCopy(input: {
  intent?: KeywordIntent | string;
  keyword?: string;
  h1Meta?: Pick<KeywordH1MetaRow, 'h1' | 'metaDescription' | 'cta' | 'primaryKeyword'>;
}): KeywordLeadPopupCopy {
  const keyword =
    input.h1Meta?.primaryKeyword?.trim() ||
    input.keyword?.trim() ||
    'your certification pathway';
  const intent = input.intent ?? 'Commercial';
  const sheetH1 = input.h1Meta?.h1?.trim();
  const sheetMeta = input.h1Meta?.metaDescription?.trim();
  const sheetCta = input.h1Meta?.cta?.trim();

  let base: KeywordLeadPopupCopy;

  if (intent.startsWith('B2B')) {
    base = {
      headline: 'Talk to a mentor about corporate training',
      body: `Share a few details and we will help plan workshops or cohort training related to ${keyword}.`,
      submitLabel: 'Send details',
      whatsappLabel: 'WhatsApp a mentor',
      scheduleLabel: 'Schedule a meeting',
      whatsappMessage: `Hi PM Structure, I am interested in corporate / workshop support for: ${keyword}.`,
    };
  } else if (intent === 'Lead Magnet') {
    base = {
      headline: 'Get mock-exam guidance from a mentor',
      body: 'Leave your details, message a mentor on WhatsApp, or book a short planning call.',
      submitLabel: 'Send details',
      whatsappLabel: 'WhatsApp a mentor',
      scheduleLabel: 'Schedule a meeting',
      whatsappMessage: `Hi PM Structure, I want help with PMP mock exam / practice questions (${keyword}).`,
    };
  } else if (intent === 'Informational') {
    base = {
      headline: 'Get clarity from a mentor',
      body: `Ask about ${keyword}: send details, WhatsApp a mentor, or schedule a meeting.`,
      submitLabel: 'Send details',
      whatsappLabel: 'WhatsApp a mentor',
      scheduleLabel: 'Schedule a meeting',
      whatsappMessage: `Hi PM Structure, I have a question about: ${keyword}.`,
    };
  } else if (intent === 'Commercial Investigation') {
    base = {
      headline: 'Ask about fees, costs, and next steps',
      body: `Get a clear answer on ${keyword} from a mentor: form, WhatsApp, or a booked call.`,
      submitLabel: 'Send details',
      whatsappLabel: 'WhatsApp a mentor',
      scheduleLabel: 'Schedule a meeting',
      whatsappMessage: `Hi PM Structure, I want clarity on fees/costs for: ${keyword}.`,
    };
  } else if (intent === 'Transactional' || intent === 'Commercial + Transactional') {
    base = {
      headline: 'Ready to start? Talk to a mentor',
      body: `Share your details for ${keyword}, or message us on WhatsApp / book a meeting.`,
      submitLabel: 'Send details',
      whatsappLabel: 'WhatsApp a mentor',
      scheduleLabel: 'Schedule a meeting',
      whatsappMessage: `Hi PM Structure, I want to enrol / start training for: ${keyword}.`,
    };
  } else {
    base = {
      headline: 'Talk to a mentor',
      body: `Add your details for ${keyword}, WhatsApp a mentor, or schedule a meeting.`,
      submitLabel: 'Send details',
      whatsappLabel: 'WhatsApp a mentor',
      scheduleLabel: 'Schedule a meeting',
      whatsappMessage: `Hi PM Structure, I am interested in: ${keyword}.`,
    };
  }

  return {
    ...base,
    headline: sheetH1 || base.headline,
    body: sheetMeta || base.body,
    submitLabel: resolveSubmitLabel(sheetCta, base.submitLabel),
    whatsappMessage: `Hi PM Structure, I am interested in: ${keyword}.`,
  };
}
