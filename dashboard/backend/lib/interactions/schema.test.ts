import { describe, expect, it } from 'vitest';
import { publicInteractionBodySchema } from './schema';

describe('public interaction tracking schema', () => {
  it('accepts bounded first/last attribution and landing context', () => {
    const parsed = publicInteractionBodySchema.parse({
      source: 'pmp_roadmap_lead',
      subject: 'Roadmap',
      email: 'person@example.com',
      tracking: {
        consent_analytics: true,
        consent_marketing: true,
        first_utm_source: 'google',
        utm_source: 'linkedin',
        first_gclid: 'first-click',
        gclid: 'last-click',
        landing_page: '/certifications/pmp',
      },
    });

    expect(parsed.tracking).toMatchObject({
      first_utm_source: 'google',
      utm_source: 'linkedin',
      first_gclid: 'first-click',
      gclid: 'last-click',
      landing_page: '/certifications/pmp',
    });
  });

  it('strips unapproved fields from trusted tracking', () => {
    const parsed = publicInteractionBodySchema.parse({
      source: 'pmp_roadmap_lead',
      subject: 'Roadmap',
      email: 'person@example.com',
      tracking: {
        full_name: 'Ada Lovelace',
        phone: '+123456789',
        other_detail: 'private free text',
      },
    });

    expect(parsed.tracking).toEqual({});
  });

  it('accepts new roadmap JSON payload without contact channel and keeps formVersion', () => {
    const parsed = publicInteractionBodySchema.parse({
      source: 'pmp_roadmap_lead',
      subject: 'PMP Qualification Roadmap',
      email: 'aisha@example.com',
      clientSubmissionId: 'lead_roadmap_compat_123456',
      payload: {
        formVersion: 'p0.6.2-333-authoritative',
        workField: 'civil_engineering',
        pmExperience: 'under_2',
        needsObjective: 'check_eligibility',
        education: 'bachelor_plus',
        trainingStatus: 'completed',
        examTimeline: 'exploring',
        fullName: 'Aisha Khan',
      },
    });

    expect(parsed.payload).toMatchObject({
      formVersion: 'p0.6.2-333-authoritative',
      workField: 'civil_engineering',
      pmExperience: 'under_2',
      needsObjective: 'check_eligibility',
      examTimeline: 'exploring',
    });
    expect(parsed.payload).not.toHaveProperty('preferredContactChannel');
    expect(parsed.payload).not.toHaveProperty('preferredContactWindow');
    expect(parsed.payload).not.toHaveProperty('contactChannel');
  });

  it('still accepts legacy Experience and contact preference payload keys', () => {
    const parsed = publicInteractionBodySchema.parse({
      source: 'pmp_roadmap_lead',
      subject: 'Legacy roadmap',
      email: 'legacy@example.com',
      payload: {
        pmExperience: '5_plus',
        preferredContactChannel: 'whatsapp',
        preferredContactWindow: 'weekday_evening',
      },
    });

    expect(parsed.payload).toMatchObject({
      pmExperience: '5_plus',
      preferredContactChannel: 'whatsapp',
      preferredContactWindow: 'weekday_evening',
    });
  });
});
