'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bot, Calendar, Loader2, MessageCircle, Send, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  FLOATING_CORNER_BOTTOM_CLASS,
  FLOATING_CORNER_STACKED_CLASS,
} from '@/lib/floating-corner';
import { useFloatingCornerScrollVisible } from '@/lib/use-floating-corner-scroll';
import {
  getPmsWhatsAppChatUrl,
  getPmsWhatsAppDisplay,
  isWhatsAppConfigured,
  PMS_SKOOL_COMMUNITY_JOIN_URL,
  externalHrefLinkProps,
} from '@/config/pms-site';
import { openCalendlyThemedPopup } from '@/lib/calendly/open-themed-popup';
import { getWebsiteCalendlyUrl } from '@/lib/calendly/website-events';

const GREETING =
  "Hi, I'm the PM Structure assistant. Ask about certification pathways, FAQs, regional pricing, booking a mentor call, or how to enroll.";

const CHAT_FAB_CLASS =
  'flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-white shadow-lg shadow-brand-orange/30 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

function isSupportChatEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SUPPORT_CHAT_ENABLED !== 'false';
}

const CHAT_PANEL_CLASS = 'w-[min(100vw-2rem,22rem)] max-w-full';

export function SupportChatWidget() {
  const scrollFabVisible = useFloatingCornerScrollVisible();
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const whatsappConfigured = isWhatsAppConfigured();

  React.useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: GREETING }]);
    }
  }, [open, messages.length]);

  React.useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    inputRef.current?.focus();
  }, [open, messages, loading]);

  const scheduleCall = () => {
    void openCalendlyThemedPopup(getWebsiteCalendlyUrl('mentor'), {
      funnelLabel: 'support_chat_schedule_call',
      utm: { utm_source: 'pmstructure', utm_medium: 'support_chat', utm_campaign: 'talk_to_mentor' },
    });
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.filter((m) => m.role === 'user' || m.content !== GREETING),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error || 'Request failed');
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || '' }]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  };

  if (!isSupportChatEnabled()) return null;

  return (
    <div
      className={cn(
        'fixed z-[100] flex w-fit max-w-[min(100vw-2rem,22rem)] flex-col items-end gap-3',
        'right-[max(1.5rem,env(safe-area-inset-right))]',
        'transition-[bottom] duration-300 ease-out',
        scrollFabVisible ? FLOATING_CORNER_STACKED_CLASS : FLOATING_CORNER_BOTTOM_CLASS,
      )}
    >
      {open ? (
        <div
          className={cn(
            CHAT_PANEL_CLASS,
            'pointer-events-auto flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900',
            'origin-bottom-right scale-100 opacity-100 transition-all duration-200',
          )}
          role="dialog"
          aria-label="PM Structure support chat"
        >
        <div className="flex items-center justify-between border-b border-slate-200 bg-brand-orange px-4 py-3 text-white dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Bot className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold">PM Structure Assistant</p>
              <p className="text-xs text-white/85">Certification pathways & FAQs</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full p-1 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Close support chat"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="flex flex-nowrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-2 dark:border-slate-700 dark:bg-slate-950/60">
          {whatsappConfigured ? (
            <a
              href={getPmsWhatsAppChatUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full bg-[#25D366] px-2 py-1.5 text-[11px] font-bold leading-tight text-white shadow-sm hover:bg-[#20bd5a]"
            >
              <span className="truncate">WhatsApp</span>
              <span className="sr-only">({getPmsWhatsAppDisplay()})</span>
            </a>
          ) : null}
          <button
            type="button"
            onClick={scheduleCall}
            className="inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full bg-white px-2 py-1.5 text-[11px] font-bold leading-tight text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
          >
            <Calendar className="h-3 w-3 shrink-0 text-brand-orange" aria-hidden />
            <span className="truncate">Schedule a call</span>
          </button>
          <Link
            href={PMS_SKOOL_COMMUNITY_JOIN_URL}
            {...externalHrefLinkProps(PMS_SKOOL_COMMUNITY_JOIN_URL)}
            className="inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full bg-white px-2 py-1.5 text-[11px] font-bold leading-tight text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
          >
            <Users className="h-3 w-3 shrink-0 text-brand-orange" aria-hidden />
            <span className="truncate">Join Community</span>
          </Link>
        </div>

        <div ref={listRef} className="flex max-h-72 flex-col gap-3 overflow-y-auto px-3 py-3">
          {messages.map((msg, index) => (
            <div
              key={`${msg.role}-${index}`}
              className={cn(
                'max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'ml-auto bg-brand-orange text-white'
                  : 'mr-auto bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
              )}
            >
              {msg.content}
            </div>
          ))}
          {loading ? (
            <div className="mr-auto inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Thinking…
            </div>
          ) : null}
        </div>

        {error ? (
          <p className="px-3 pb-1 text-xs text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex items-end gap-2 border-t border-slate-200 px-3 py-3 dark:border-slate-700">
          <textarea
            ref={inputRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about pathways, pricing, FAQs…"
            disabled={loading}
            className="min-h-[2.5rem] flex-1 resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-orange dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={loading || !input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white disabled:opacity-50"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" aria-hidden />
          </button>
        </div>
        </div>
      ) : null}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open assistant chat"
          aria-expanded={false}
          className={CHAT_FAB_CLASS}
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
