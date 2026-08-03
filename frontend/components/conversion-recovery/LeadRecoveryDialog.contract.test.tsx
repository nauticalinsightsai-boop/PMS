import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./LeadRecoveryDialog.tsx', import.meta.url), 'utf8');
const initialForm = source.slice(source.indexOf('<form onSubmit={handleSubmit}>'));
const initialFooter = initialForm.slice(
  initialForm.indexOf('<DialogFooter'),
  initialForm.indexOf('</DialogFooter>'),
);
const successState = source.slice(source.indexOf('{submitted ? ('), source.indexOf(") : (", source.indexOf('{submitted ? (')));

describe('LeadRecoveryDialog conversion-recovery contract', () => {
  it('keeps the initial dialog to its single branded submit CTA', () => {
    expect(initialFooter).toContain('<DialogFooter className="flex-col gap-2 sm:flex-col">');
    expect(initialFooter).toContain('type="submit" variant="brand"');
    expect(initialFooter.match(/<Button\b/g)).toHaveLength(1);
    expect(initialForm).not.toContain('No thanks');
    expect(initialForm).not.toContain('Schedule a call instead');
    expect(initialForm).not.toContain('copy.showScheduleCall');
  });

  it('offers scheduling only after a successful lead submission', () => {
    expect(successState).toContain('Schedule a call instead');
    expect(successState).toContain('variant="outline"');
    expect(successState).toContain('onClick={handleScheduleCall}');
    expect(successState).not.toContain('copy.showScheduleCall');
  });

  it('focuses the client validation target before presenting an error', () => {
    expect(source).toContain('const nameRef = React.useRef<HTMLInputElement>(null)');
    expect(source).toContain('const phoneRef = React.useRef<HTMLInputElement>(null)');
    expect(source).toContain('ref={nameRef}');
    expect(source).toContain('ref={phoneRef}');

    const nameValidation = source.match(
      /if \(!fullName\.trim\(\)\) \{\s+setError\('Please enter your name and mobile number\.'\);\s+setErrorSource\('client'\);\s+nameRef\.current\?\.focus\(\);\s+return;/,
    )?.[0] ?? '';
    const phoneValidation = source.match(
      /if \(!phone\.trim\(\)\) \{\s+setError\('Please enter your name and mobile number\.'\);\s+setErrorSource\('client'\);\s+phoneRef\.current\?\.focus\(\);\s+return;/,
    )?.[0] ?? '';
    expect(nameValidation).not.toBe('');
    expect(phoneValidation).not.toBe('');
  });

  it('focuses a programmatically focusable alert only for server failures without clearing input', () => {
    expect(source).toContain("const [errorSource, setErrorSource] = React.useState<'client' | 'server' | null>(null)");
    expect(source).toContain('const errorRef = React.useRef<HTMLParagraphElement>(null)');
    expect(source).toContain("if (errorSource === 'server' && error) errorRef.current?.focus()");
    expect(source).not.toContain('if (error) errorRef.current?.focus()');
    expect(source).toContain('ref={errorRef}');
    expect(source).toContain('role="alert"');
    expect(source).toContain('tabIndex={-1}');

    const asyncFailure = source.match(
      /} else \{\s+setError\(res\.error \?\? 'Submission failed\. Try again\.'\);\s+setErrorSource\('server'\);\s+}/,
    )?.[0] ?? '';
    expect(asyncFailure).toContain("setError(res.error ?? 'Submission failed. Try again.')");
    expect(asyncFailure).not.toMatch(/set(?:FullName|Phone|Email|PreferredTier|Honeypot)\(/);
  });
});
