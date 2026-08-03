import { describe, expect, it } from 'vitest';
import { formFieldsFromPayload } from './form-submissions';
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

  it('puts modern roadmap taxonomy into Other form answers with human labels and omits contact fields', () => {
    const row = buildHumanSubmissionsRow({
      id: 'modern-roadmap-1',
      created_at: '2026-07-27T08:00:00.000Z',
      source: 'pmp_roadmap_lead',
      subject: 'PMP Qualification Roadmap',
      email: 'modern@example.com',
      payload: {
        fullName: 'Modern Candidate',
        phone: '+44 7700 900999',
        workField: 'construction',
        pmExperience: 'under_2',
        needsObjective: 'eligibility',
        education: 'bachelor_plus',
        trainingStatus: 'completed',
        examTimeline: '3_to_6',
        formVersion: 'p0.6.2-333-authoritative',
      },
    });

    const other = row[21];
    expect(other).toContain('Industry: construction');
    expect(other).toContain('Experience: under_2');
    expect(other).toContain('Need: eligibility');
    expect(other).toContain('Education: bachelor_plus');
    expect(other).toContain('Training: completed');
    expect(other).toContain('Timeline: 3_to_6');
    expect(other).not.toContain('Preferred contact channel');
    expect(other).not.toContain('Preferred contact window');
    expect(other).not.toContain('Contact channel');
    expect(other).not.toContain('Contact window');

    const labels = formFieldsFromPayload({
      workField: 'construction',
      pmExperience: 'under_2',
      needsObjective: 'eligibility',
      education: 'bachelor_plus',
      trainingStatus: 'completed',
      examTimeline: '3_to_6',
    }).map((f) => f.label);
    expect(labels).toEqual([
      'Industry',
      'Experience',
      'Need',
      'Education',
      'Training',
      'Timeline',
    ]);
  });

  it('preserves legacy form_submissions contact and taxonomy values as readable Other answers', () => {
    const legacyPayload = {
      fullName: 'Legacy Candidate',
      phone: '+1 555 0100',
      workField: 'mechanical_electrical',
      needsObjective: 'updated_exam',
      education: 'secondary',
      pmExperience: '5_plus',
      preferredContactChannel: 'whatsapp',
      preferredContactWindow: 'weekday_evening',
      contactChannel: 'instagram',
      contactWindow: 'weekend_morning',
    };

    const row = buildHumanSubmissionsRow({
      id: 'legacy-roadmap-1',
      created_at: '2025-11-01T10:00:00.000Z',
      source: 'pmp_roadmap_lead',
      subject: 'PMP roadmap (legacy)',
      email: 'legacy@example.com',
      payload: {
        ...legacyPayload,
        needsObjective: 'study_plan',
      },
    });

    const other = row[21];
    expect(other).toContain('Industry: mechanical_electrical');
    expect(other).toContain('Need: study_plan');
    expect(other).toContain('Education: secondary');
    expect(other).toContain('Experience: 5_plus');
    expect(other).toContain('Preferred contact channel: whatsapp');
    expect(other).toContain('Preferred contact window: weekday_evening');
    expect(other).toContain('Contact channel: instagram');
    expect(other).toContain('Contact window: weekend_morning');

    // Exact generic values remain readable through formFieldsFromPayload labels.
    const labeled = formFieldsFromPayload(legacyPayload);
    expect(labeled).toEqual(
      expect.arrayContaining([
        { key: 'workField', label: 'Industry', value: 'mechanical_electrical' },
        { key: 'needsObjective', label: 'Need', value: 'updated_exam' },
        { key: 'education', label: 'Education', value: 'secondary' },
        { key: 'pmExperience', label: 'Experience', value: '5_plus' },
        {
          key: 'preferredContactChannel',
          label: 'Preferred contact channel',
          value: 'whatsapp',
        },
        {
          key: 'preferredContactWindow',
          label: 'Preferred contact window',
          value: 'weekday_evening',
        },
        { key: 'contactChannel', label: 'Contact channel', value: 'instagram' },
        { key: 'contactWindow', label: 'Contact window', value: 'weekend_morning' },
      ]),
    );
  });
});
