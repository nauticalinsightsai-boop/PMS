import { describe, expect, it } from 'vitest';
import { formFieldsFromPayload } from './form-submissions';

describe('form submission context fields', () => {
  it('does not present first- or last-touch attribution as user-entered fields', () => {
    expect(
      formFieldsFromPayload({
        first_utm_source: 'google',
        first_utm_medium: 'cpc',
        first_utm_campaign: 'launch',
        first_utm_term: 'pmp',
        first_utm_content: 'hero',
        utm_source: 'linkedin',
        utm_medium: 'paid_social',
        utm_campaign: 'retarget',
        utm_term: 'project management',
        utm_content: 'video',
        first_gclid: 'first-click',
        gclid: 'last-click',
        channelKey: 'linkedin',
        landingSlug: 'linkedin',
        fullName: 'Ada Lovelace',
      }),
    ).toEqual([
      {
        key: 'fullName',
        label: 'Full name',
        value: 'Ada Lovelace',
      },
    ]);
  });

  it('displays new roadmap taxonomy fields without removed contact channel', () => {
    const rows = formFieldsFromPayload({
      formId: 'pmp_qualification_roadmap',
      formVersion: 'p0.6.2-333-authoritative',
      fullName: 'Aisha Khan',
      workField: 'civil_engineering',
      pmExperience: 'under_2',
      needsObjective: 'check_eligibility',
      education: 'bachelor_plus',
      trainingStatus: 'completed',
      examTimeline: '3_to_6',
      qualificationOutcome: 'likely_ready',
    });
    expect(rows).toEqual(
      expect.arrayContaining([
        { key: 'fullName', label: 'Full name', value: 'Aisha Khan' },
        { key: 'workField', label: 'Industry', value: 'civil_engineering' },
        { key: 'pmExperience', label: 'Experience', value: 'under_2' },
        { key: 'needsObjective', label: 'Need', value: 'check_eligibility' },
        { key: 'examTimeline', label: 'Timeline', value: '3_to_6' },
      ]),
    );
    expect(rows.map((row) => row.key)).not.toContain('preferredContactChannel');
    expect(rows.map((row) => row.key)).not.toContain('preferredContactWindow');
    expect(rows.map((row) => row.key)).not.toContain('contactChannel');
    expect(rows.map((row) => row.key)).not.toContain('formVersion');
  });

  it('preserves historical Experience and contact preference fields for dashboard reads', () => {
    const rows = formFieldsFromPayload({
      formVersion: 'legacy',
      pmExperience: '5_plus',
      preferredContactChannel: 'whatsapp',
      preferredContactWindow: 'weekday_evening',
      contactChannel: 'instagram',
      pmExperienceOther: 'Independent consulting',
    });
    expect(rows).toEqual(
      expect.arrayContaining([
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
        {
          key: 'pmExperienceOther',
          label: 'Experience (other)',
          value: 'Independent consulting',
        },
      ]),
    );
  });
});
