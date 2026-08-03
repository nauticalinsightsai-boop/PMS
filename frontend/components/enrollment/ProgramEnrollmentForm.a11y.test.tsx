import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('./ProgramEnrollmentForm.tsx', import.meta.url), 'utf8');

describe('ProgramEnrollmentForm delivery selector accessibility contract', () => {
  it('uses a visible fieldset legend and two pressed-state buttons', () => {
    expect(source).toContain('<fieldset className="border-t border-border');
    expect(source).toContain('<legend className="text-label text-brand-orange mb-3">Delivery option</legend>');
    expect(source).toContain('aria-pressed={isSelfPaced}');
    expect(source).toContain('aria-pressed={isMentorLed}');
    expect(source.match(/aria-pressed=/g)).toHaveLength(2);
  });

  it('preserves native activation, disabled exposure, and default self-paced behavior', () => {
    expect(source).toContain("if (tierId === 'professional') return 'self_paced'");
    expect(source).toContain("onClick={() => setPaymentMode('self_paced')}");
    expect(source).toContain("onClick={() => setPaymentMode('mentor_led')}");
    expect(source).toContain('disabled={!selfPacedPrices.active}');
    expect(source).toContain('type="button"');
  });

  it('provides an explicit visible focus treatment without invoking checkout', () => {
    expect(source.match(/focus-visible:ring-2 focus-visible:ring-brand-orange/g)).toHaveLength(2);
    const selector = source.slice(source.indexOf('<fieldset'), source.indexOf('</fieldset>') + 11);
    expect(selector).not.toMatch(/fetch\(|Stripe|checkout|analytics|submit/i);
  });
});
