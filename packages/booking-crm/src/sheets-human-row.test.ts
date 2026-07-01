import { describe, expect, it } from 'vitest';
import { buildHumanSubmissionsRow, isCertificationSheetSubmission } from './sheets-human-row';

describe('buildHumanSubmissionsRow', () => {
  it('writes plain English columns instead of JSON', () => {
    const row = buildHumanSubmissionsRow({
      id: 'abc-123',
      created_at: '2026-06-30T12:00:00.000Z',
      source: 'cert_roadmap_lead',
      subject: 'CAPM roadmap request',
      email: 'Lead@Example.com',
      payload: {
        fullName: 'Jane Doe',
        phone: '+44 7700 900123',
        certName: 'CAPM®',
        pagePath: '/certifications/capm',
        formLabel: 'Roadmap popup',
        message: 'Please call me back',
      },
      metadata: { referrer: 'https://google.com' },
    });

    expect(row).toHaveLength(23);
    expect(row.some((cell) => cell.includes('{'))).toBe(false);
    expect(row[1]).toBe('Certification roadmap');
    expect(row[2]).toBe('lead@example.com');
    expect(row[3]).toBe('Jane Doe');
    expect(row[7]).toBe('CAPM®');
    expect(row[13]).toBe('Please call me back');
    expect(row[22]).toBe('abc-123');
  });

  it('flags certification pathway submissions', () => {
    expect(
      isCertificationSheetSubmission({
        id: '1',
        created_at: '',
        source: 'waitlist',
        subject: 'Waitlist',
        email: 'a@b.com',
        payload: { certName: 'PMP®' },
      }),
    ).toBe(true);
  });
});
