'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { FaqEntry } from '@/content/faq';
import { resolveFaqFullAnswer } from '@/content/faq';

export function FaqAccordionList({ items }: { items: FaqEntry[] }) {
  return (
    <Accordion
      {...({ type: 'single', collapsible: true } as React.ComponentProps<typeof Accordion>)}
      className="w-full space-y-4"
    >
      {items.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={faq.id}
          id={faq.id}
          className="bg-white dark:bg-slate-900 px-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm scroll-mt-24"
        >
          <AccordionTrigger className="text-left font-bold min-h-11 py-6 hover:text-brand-purple hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-slate-600 dark:text-slate-400 pb-6 leading-relaxed prose prose-sm dark:prose-invert max-w-none">
            <FaqAnswer text={resolveFaqFullAnswer(faq)} />
            {faq.relatedAnswerSlug ? (
              <p className="mt-4 text-sm not-prose">
                <Link
                  href={`/answers/${faq.relatedAnswerSlug}`}
                  className="text-brand-purple font-semibold hover:underline"
                >
                  Read the full direct answer →
                </Link>
              </p>
            ) : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** Parses lead paragraph, bullet lines (•), and [text](url) links. */
export function FaqAnswer({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);
  return (
    <div className="space-y-3">
      {blocks.map((block, bi) => {
        const lines = block.split('\n').filter((l) => l.length > 0);
        const bullets = lines.filter((l) => l.trimStart().startsWith('•'));
        const nonBullets = lines.filter((l) => !l.trimStart().startsWith('•'));
        return (
          <div key={bi}>
            {nonBullets.map((line, i) => (
              <p key={i} className={i > 0 ? 'mt-2' : undefined}>
                <FaqInline text={line} />
              </p>
            ))}
            {bullets.length > 0 ? (
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {bullets.map((line, i) => (
                  <li key={i}>
                    <FaqInline text={line.replace(/^•\s*/, '')} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function FaqInline({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (m) {
          const href = m[2];
          const internal = href.startsWith('/');
          return internal ? (
            <Link key={i} href={href} className="text-brand-orange font-bold hover:underline">
              {m[1]}
            </Link>
          ) : (
            <a key={i} href={href} className="text-brand-orange font-bold hover:underline">
              {m[1]}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
