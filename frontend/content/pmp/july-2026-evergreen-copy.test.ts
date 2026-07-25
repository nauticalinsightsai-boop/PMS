import { describe, expect, it } from 'vitest';
import { getAnswerPage } from '@/content/answers/pages';
import { PMP_2026_FAQS } from '@/content/faq/pmp-2026-faqs';
import { getPmpCategoryLabel } from '@/content/faq/pmp-categories';
import { T169_NINETY_DAY_FOCUS } from '@/content/pmp/flagship-t169';
import { getPmpPage, PMP_PAGES } from '@/content/pmp/pages';
import { getPmpService } from '@/content/pmp/services';

describe('post-9-July 2026 evergreen PMP copy', () => {
  it('presents the launched exam as current across active pillar pages', () => {
    const comparison = getPmpPage('pmp-current-vs-new-exam');
    const currentGuide = getPmpPage('pmp-after-9-july-2026');
    const domainWeights = getPmpPage('pmp-new-exam-domain-weighting');

    expect(comparison).toMatchObject({
      title: 'Previous vs current PMP exam (2026 comparison)',
      h1: 'Previous vs current PMP exam: 2026 comparison',
    });
    expect(comparison?.directAnswer).toContain('is now the current exam');
    expect(comparison?.directAnswer).not.toMatch(/will face|new experience applies/i);

    expect(currentGuide).toMatchObject({
      title: 'Current PMP exam preparation guide (July 2026 update)',
      h1: 'Preparing for the current PMP exam',
    });
    expect(domainWeights).toMatchObject({
      title: 'Current PMP exam domain weighting: what to verify',
      h1: 'Current PMP exam domain weighting (verify with PMI)',
    });
  });

  it('removes expired before-or-after routing from active diagnostics and answers', () => {
    const diagnostic = getPmpService('pmp-readiness-diagnostic');
    const scenarioPractice = getPmpService('pmp-scenario-practice');
    const preparation = getAnswerPage('how-to-prepare-for-pmp-in-2026');
    const weights = getAnswerPage('what-are-the-pmp-2026-domain-weights');
    const comparison = getAnswerPage('current-pmp-exam-vs-new-pmp-exam');

    expect(JSON.stringify(diagnostic)).not.toMatch(/before\/after|before 8 July|after 9 July/i);
    expect(scenarioPractice?.directAnswer).not.toMatch(/current and post-July|both .*formats/i);
    expect(preparation?.shortAnswer).not.toMatch(/pre- or post-July/i);
    expect(weights?.shortAnswer).toContain(
      'Current PMP exam (launched 9 July 2026): People 33%, Process 41%, Business Environment 26%',
    );
    expect(comparison).toMatchObject({
      title: 'Previous PMP exam vs current PMP exam',
      whoApplies: 'Current candidates reviewing study material created before July 2026.',
    });
  });

  it('uses current-exam FAQ labels and answers while retaining legacy category ids', () => {
    expect(getPmpCategoryLabel('current-exam-before-july-2026')).toBe(
      'Previous Exam Before 9 July 2026',
    );
    expect(getPmpCategoryLabel('new-exam-from-july-2026')).toBe(
      'Current Exam From 9 July 2026',
    );
    expect(getPmpCategoryLabel('pmp-current-vs-new-exam')).toBe(
      'Previous vs Current PMP Exam',
    );

    const byId = new Map(PMP_2026_FAQS.map((faq) => [faq.id, faq]));
    expect(byId.get('pmp26-gap-02')?.answer).toContain('current ECO');
    expect(byId.get('pmp26-gap-07')?.question).toContain('current PMP exam');
    expect(byId.get('pmp26-gap-13')?.answer).toContain('current exam');
    expect(byId.get('pmp26-gap-13')?.relatedPage).toBe('/pmp-exam-2026');
  });

  it('keeps the active 90-day focus on the current exam instead of an expired choice', () => {
    expect(T169_NINETY_DAY_FOCUS.body).toContain('is now the current exam');
    expect(T169_NINETY_DAY_FOCUS.body).not.toMatch(/whether to sit before|prepare for the updated exam/i);
    expect(T169_NINETY_DAY_FOCUS.bullets.join(' ')).not.toMatch(
      /current or updated PMP exam route/i,
    );
  });

  it('preserves historical pages and points active internal links to the canonical guide', () => {
    const historicalPage = getPmpPage('pmp-before-8-july-2026');
    const historicalAnswer = getAnswerPage('should-i-take-pmp-before-8-july-2026');
    expect(historicalPage?.h1).toContain('(historical)');
    expect(historicalPage?.directAnswer).toContain('previous exam is no longer offered');
    expect(historicalAnswer?.title).toContain('(Historical)');
    expect(historicalAnswer?.shortAnswer).toContain('Historical:');

    const activePages = PMP_PAGES.filter(
      (page) => !['pmp-before-8-july-2026', 'pmp-exam-timeline-2026'].includes(page.slug),
    );
    const activeRelatedHrefs = activePages.flatMap((page) =>
      (page.relatedLinks ?? []).map((link) => link.href),
    );
    expect(activeRelatedHrefs).toContain('/pmp-exam-2026');
    expect(activeRelatedHrefs).not.toContain('/topics/pmp-exam-2026');
  });
});
