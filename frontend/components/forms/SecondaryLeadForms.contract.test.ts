import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const readForm = (name: string) =>
  readFileSync(resolve(process.cwd(), 'components/forms', name), 'utf8');

const hero = readForm('NewsletterHeroSubscribeForm.tsx');
const compactNewsletter = readForm('NewsletterSubscribeForm.tsx');
const community = readForm('CommunityWaitlistForm.tsx');
const pmService = readForm('PmServiceAdvisoryLeadForm.tsx');

const expectBefore = (source: string, first: string, second: string) => {
  expect(source.indexOf(first)).toBeGreaterThanOrEqual(0);
  expect(source.indexOf(second)).toBeGreaterThan(source.indexOf(first));
};

describe('secondary lead form accessibility state machines', () => {
  it('keeps native constraint validation enabled on every form', () => {
    for (const source of [hero, compactNewsletter, community, pmService]) {
      expect(source).not.toMatch(/<form\b[^>]*\bnoValidate\b/);
      expect(source).toContain('required');
    }
  });

  it('targets and focuses the exact Newsletter Hero error or success surface', () => {
    expect(hero).toContain(
      "React.useState<'name' | 'topics' | 'submit' | null>(null)",
    );
    expect(hero).toContain('const nameRef = React.useRef<HTMLInputElement>(null)');
    expect(hero).toContain('const topicsRef = React.useRef<HTMLFieldSetElement>(null)');
    expect(hero).toContain('const errorRef = React.useRef<HTMLParagraphElement>(null)');
    expect(hero).toContain('const successRef = React.useRef<HTMLParagraphElement>(null)');
    expect(hero).toContain("if (errorTarget === 'name') nameRef.current?.focus()");
    expect(hero).toContain("if (errorTarget === 'topics') topicsRef.current?.focus()");
    expect(hero).toContain("if (errorTarget === 'submit') errorRef.current?.focus()");
    expect(hero).toContain('if (submitted) successRef.current?.focus()');
    expect(hero).toContain('id={`${idPrefix}-topics-legend`}');
    expect(hero).toContain('id={`${idPrefix}-form-error`}');
    expect(hero).toContain('id={`${idPrefix}-success`}');
    expect(hero).toMatch(
      /ref=\{topicsRef\}[\s\S]*?tabIndex=\{-1\}[\s\S]*?aria-invalid=\{errorTarget === 'topics' \? true : undefined\}[\s\S]*?aria-describedby=\{errorTarget === 'topics' \? `\$\{idPrefix\}-form-error` : undefined\}/,
    );
    expect(hero).toMatch(
      /ref=\{nameRef\}[\s\S]*?aria-invalid=\{errorTarget === 'name' \? true : undefined\}[\s\S]*?aria-describedby=\{errorTarget === 'name' \? `\$\{idPrefix\}-form-error` : undefined\}/,
    );
    expect(hero).toMatch(/ref=\{errorRef\}[\s\S]*?role="alert"[\s\S]*?tabIndex=\{-1\}/);
    expect(hero).toMatch(
      /ref=\{successRef\}[\s\S]*?role="status"[\s\S]*?aria-live="polite"[\s\S]*?tabIndex=\{-1\}/,
    );
    expect(hero).toContain("next.length > 0 && errorTarget === 'topics'");
    expect(hero).toContain("next.trim() && errorTarget === 'name'");
  });

  it('targets and focuses the exact Community error group, API alert, or success status', () => {
    expect(community).toContain(
      "React.useState<'interests' | 'submit' | null>(null)",
    );
    expect(community).toContain(
      'const interestsRef = React.useRef<HTMLFieldSetElement>(null)',
    );
    expect(community).toContain('const errorRef = React.useRef<HTMLParagraphElement>(null)');
    expect(community).toContain('const successRef = React.useRef<HTMLParagraphElement>(null)');
    expect(community).toContain(
      "if (errorTarget === 'interests') interestsRef.current?.focus()",
    );
    expect(community).toContain(
      "if (errorTarget === 'submit') errorRef.current?.focus()",
    );
    expect(community).toContain('if (done) successRef.current?.focus()');
    expect(community).toContain('id="community-waitlist-interests-legend"');
    expect(community).toContain('id="community-waitlist-form-error"');
    expect(community).toContain('id="community-waitlist-success"');
    expect(community).toMatch(
      /ref=\{interestsRef\}[\s\S]*?tabIndex=\{-1\}[\s\S]*?aria-invalid=\{errorTarget === 'interests' \? true : undefined\}[\s\S]*?aria-describedby=\{errorTarget === 'interests' \? 'community-waitlist-form-error' : undefined\}/,
    );
    expect(community).toMatch(
      /ref=\{errorRef\}[\s\S]*?id="community-waitlist-form-error"[\s\S]*?role="alert"[\s\S]*?tabIndex=\{-1\}/,
    );
    expect(community).toMatch(
      /ref=\{successRef\}[\s\S]*?id="community-waitlist-success"[\s\S]*?role="status"[\s\S]*?aria-live="polite"[\s\S]*?tabIndex=\{-1\}/,
    );
    expect(community).toContain("next.length > 0 && errorTarget === 'interests'");
  });

  it('targets PM Service interest and Other-detail errors without associating unrelated fields', () => {
    expect(pmService).toMatch(
      /React\.useState<\s*'interest' \| 'interest_other' \| 'industry_other' \| 'submit' \| null\s*>\(null\)/,
    );
    expect(pmService).toContain(
      'const interestRef = React.useRef<HTMLFieldSetElement>(null)',
    );
    expect(pmService).toContain(
      'const interestOtherRef = React.useRef<HTMLInputElement>(null)',
    );
    expect(pmService).toContain(
      'const industryOtherRef = React.useRef<HTMLInputElement>(null)',
    );
    expect(pmService).toContain('const errorRef = React.useRef<HTMLParagraphElement>(null)');
    expect(pmService).toContain('const successRef = React.useRef<HTMLParagraphElement>(null)');
    expect(pmService).toContain(
      "if (errorTarget === 'interest') interestRef.current?.focus()",
    );
    expect(pmService).toContain(
      "if (errorTarget === 'interest_other') interestOtherRef.current?.focus()",
    );
    expect(pmService).toContain(
      "if (errorTarget === 'industry_other') industryOtherRef.current?.focus()",
    );
    expect(pmService).toContain("if (errorTarget === 'submit') errorRef.current?.focus()");
    expect(pmService).toContain('if (submitted) successRef.current?.focus()');
    expect(pmService).toContain('id={`${idPrefix}-interest-legend`}');
    expect(pmService).toContain('id={`${idPrefix}-industry-legend`}');
    expect(pmService).toContain('id={`${idPrefix}-interest-other`}');
    expect(pmService).toContain('id={`${idPrefix}-industry-other`}');
    expect(pmService).toContain('id={`${idPrefix}-form-error`}');
    expect(pmService).toContain('id={`${idPrefix}-success`}');
    expect(pmService).toMatch(
      /ref=\{interestRef\}[\s\S]*?tabIndex=\{-1\}[\s\S]*?aria-labelledby=\{`\$\{idPrefix\}-interest-legend`\}[\s\S]*?aria-invalid=\{errorTarget === 'interest' \? true : undefined\}[\s\S]*?aria-describedby=\{errorTarget === 'interest' \? `\$\{idPrefix\}-form-error` : undefined\}/,
    );
    expect(pmService).toMatch(
      /ref=\{interestOtherRef\}[\s\S]*?id=\{`\$\{idPrefix\}-interest-other`\}[\s\S]*?aria-invalid=\{errorTarget === 'interest_other' \? true : undefined\}[\s\S]*?aria-describedby=\{\s*errorTarget === 'interest_other' \? `\$\{idPrefix\}-form-error` : undefined\s*\}/,
    );
    expect(pmService).toMatch(
      /ref=\{industryOtherRef\}[\s\S]*?id=\{`\$\{idPrefix\}-industry-other`\}[\s\S]*?aria-invalid=\{errorTarget === 'industry_other' \? true : undefined\}[\s\S]*?aria-describedby=\{\s*errorTarget === 'industry_other' \? `\$\{idPrefix\}-form-error` : undefined\s*\}/,
    );
    expect(pmService).toMatch(
      /<fieldset[\s\S]*?aria-labelledby=\{`\$\{idPrefix\}-industry-legend`\}[\s\S]*?<legend id=\{`\$\{idPrefix\}-industry-legend`\}/,
    );
    expect(pmService).toMatch(/ref=\{errorRef\}[\s\S]*?role="alert"[\s\S]*?tabIndex=\{-1\}/);
    expect(pmService).toMatch(
      /ref=\{successRef\}[\s\S]*?role="status"[\s\S]*?aria-live="polite"[\s\S]*?tabIndex=\{-1\}/,
    );
    expect(pmService).toContain(
      "errorTarget === 'interest' || errorTarget === 'interest_other'",
    );
    expect(pmService).toContain("next.trim() && errorTarget === 'industry_other'");
    expect(pmService).not.toContain('pushAnalyticsEvent');
    expect(pmService).not.toContain('PMS_EVENTS');
  });

  it('keeps the compact newsletter success focusable and conversion durable-only', () => {
    expect(compactNewsletter).toContain(
      'const successRef = React.useRef<HTMLParagraphElement>(null)',
    );
    expect(compactNewsletter).toContain(
      "if (status === 'done') successRef.current?.focus()",
    );
    expect(compactNewsletter).toMatch(
      /ref=\{successRef\}[\s\S]*?role="status"[\s\S]*?aria-live="polite"[\s\S]*?tabIndex=\{-1\}/,
    );
    expect(compactNewsletter).toContain(
      'if (res.submissionId && !res.idempotentReplay)',
    );
    expectBefore(compactNewsletter, 'if (!trimmed) return', 'submitPublicInteraction({');
  });
});

describe('secondary lead form conversion guards', () => {
  for (const [name, source] of [
    ['NewsletterHeroSubscribeForm.tsx', hero],
    ['NewsletterSubscribeForm.tsx', compactNewsletter],
    ['CommunityWaitlistForm.tsx', community],
  ] as const) {
    it(`${name} requires a persisted, non-replayed submission for a key event`, () => {
      expect(source).toContain('res.submissionId && !res.idempotentReplay');
    });
  }

  it('validates custom groups before any submission or key event', () => {
    expectBefore(hero, 'if (!fullName.trim())', 'submitPublicInteraction({');
    expectBefore(hero, 'if (selectedTopics.length === 0)', 'submitPublicInteraction({');
    expectBefore(community, 'if (selectedInterests.length === 0)', 'submitPublicInteraction({');
    expectBefore(pmService, 'if (!serviceInterest)', 'submitPublicInteraction({');
    expectBefore(
      pmService,
      "if (serviceInterest === 'other' && !serviceInterestOther.trim())",
      'submitPublicInteraction({',
    );
    expectBefore(
      pmService,
      "if (industry === 'other' && !industryOther.trim())",
      'submitPublicInteraction({',
    );
  });
});
