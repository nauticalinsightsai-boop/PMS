import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { defaultFaqPageConfig } from '@pms/site-content';
import { FaqPageJsonLd } from '@/components/seo/FaqPageJsonLd';
import { PmpPageJsonLd } from '@/components/seo/PmpPageJsonLd';
import {
  getFaqsForPmpSurface,
  getFaqsForSchemaByPath,
  getVisibleFaqPageEntries,
} from '@/content/faq';
import { getPmpPage } from '@/content/pmp/pages';
import type { PmpPageContent } from '@/content/pmp/types';

(globalThis as typeof globalThis & { React: typeof React }).React = React;

function normalizedQuestion(question: string): string {
  return question.trim().replace(/\s+/g, ' ').toLowerCase();
}

function expectUniqueQuestions(questions: string[]) {
  const normalized = questions.map(normalizedQuestion);
  expect(new Set(normalized).size).toBe(normalized.length);
}

function faqPageObjects(markup: string): Record<string, unknown>[] {
  const scripts = [...markup.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
  const objects: Record<string, unknown>[] = [];

  function visit(value: unknown) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    const record = value as Record<string, unknown>;
    if (record['@type'] === 'FAQPage') objects.push(record);
    Object.values(record).forEach(visit);
  }

  for (const script of scripts) visit(JSON.parse(script[1]));
  return objects;
}

function visiblePmpQuestions(page: PmpPageContent): string[] {
  const inline = (page.faqs ?? []).map((faq) => faq.question);
  const related =
    page.path === '/pmp-exam-2026'
      ? []
      : getFaqsForPmpSurface(page.path, undefined, 5).map((faq) => faq.question);
  return [...inline, ...related];
}

describe('FAQ single-source rendering', () => {
  it('deduplicates the authoritative /faq list and lets a CMS entry override a repeated question', () => {
    const baseConfig = defaultFaqPageConfig();
    const baseEntries = getVisibleFaqPageEntries(baseConfig);
    expectUniqueQuestions(baseEntries.map((faq) => faq.question));

    const repeatedQuestion = baseEntries[0].question;
    const config = {
      ...baseConfig,
      items: [
        {
          id: 'authoritative-override',
          question: repeatedQuestion,
          answer: 'CMS-authored answer.',
          visible: true,
          sortOrder: 0,
        },
      ],
    };
    const entries = getVisibleFaqPageEntries(config);
    const matches = entries.filter(
      (faq) => normalizedQuestion(faq.question) === normalizedQuestion(repeatedQuestion),
    );

    expect(matches).toHaveLength(1);
    expect(matches[0].answer).toBe('CMS-authored answer.');
    expectUniqueQuestions(entries.map((faq) => faq.question));
  });

  it('builds /faq visible data and FAQPage schema from the same deduplicated selector', () => {
    const config = defaultFaqPageConfig();
    const visibleQuestions = getVisibleFaqPageEntries(config)
      .filter((faq) => faq.status !== 'draft' && faq.status !== 'planned' && faq.schemaEligible !== false)
      .map((faq) => faq.question);
    const schemaQuestions = getFaqsForSchemaByPath('/faq', config).map(
      (faq) => faq.question,
    );

    expect(schemaQuestions).toEqual(visibleQuestions);
    expectUniqueQuestions(schemaQuestions);

    const objects = faqPageObjects(
      renderToStaticMarkup(<FaqPageJsonLd faqConfig={config} />),
    );
    expect(objects).toHaveLength(1);
  });

  it.each(['pmp-exam-2026', 'pmp-after-9-july-2026'])(
    'keeps visible and schema questions unique on /%s',
    (slug) => {
      const page = getPmpPage(slug);
      expect(page).toBeDefined();
      const visibleQuestions = visiblePmpQuestions(page!);
      expectUniqueQuestions(visibleQuestions);

      const objects = faqPageObjects(
        renderToStaticMarkup(<PmpPageJsonLd page={page!} />),
      );
      expect(objects).toHaveLength(1);
      const mainEntity = objects[0].mainEntity as Array<Record<string, unknown>>;
      const schemaQuestions = mainEntity.map((entry) => String(entry.name));
      expect(schemaQuestions).toEqual(visibleQuestions);
      expectUniqueQuestions(schemaQuestions);
    },
  );

  it('keeps the retired topic route redirected to the canonical PMP exam guide', () => {
    const nextConfig = readFileSync('next.config.ts', 'utf8');
    expect(nextConfig).toContain("source: '/topics/pmp-exam-2026'");
    expect(nextConfig).toContain("destination: '/pmp-exam-2026'");
  });
});
