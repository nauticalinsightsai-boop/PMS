import { describe, expect, it } from 'vitest';
import {
  sanitizeInteractionPayload,
  sanitizeTrustedInteractionTracking,
} from './payload-sanitize';

describe('trusted interaction tracking boundary', () => {
  it('lets the dedicated trusted channel overwrite form-controlled collisions', () => {
    const formPayload = sanitizeInteractionPayload({
      consent_marketing: true,
      fbclid: 'form-controlled-click',
      ga_client_id: 'form-controlled-client',
    });
    const trusted = sanitizeTrustedInteractionTracking({
      consent_analytics: false,
      consent_marketing: false,
      fbclid: 'unconsented-click',
      ga_client_id: 'unconsented-client',
    });

    expect({ ...formPayload, ...trusted }).toEqual({
      consent_marketing: false,
      consent_analytics: false,
    });
  });

  it('retains consented identifiers from the dedicated channel', () => {
    expect(
      sanitizeTrustedInteractionTracking({
        consent_analytics: true,
        consent_marketing: true,
        ga_client_id: '123.456',
        first_gclid: 'first-google-click',
        gclid: 'last-google-click',
        fbclid: 'fb-click',
      }),
    ).toMatchObject({
      consent_analytics: true,
      consent_marketing: true,
      ga_client_id: '123.456',
      first_gclid: 'first-google-click',
      gclid: 'last-google-click',
      fbclid: 'fb-click',
    });
  });

  it('retains first/last UTMs and landing page independently of consent', () => {
    expect(
      sanitizeTrustedInteractionTracking({
        consent_analytics: false,
        consent_marketing: false,
        first_utm_source: 'google',
        utm_source: 'linkedin',
        first_utm_campaign: 'launch',
        utm_campaign: 'retarget',
        landing_page: '/certifications/pmp',
        first_gclid: 'blocked-first-click',
        gclid: 'blocked-last-click',
      }),
    ).toEqual({
      consent_analytics: false,
      consent_marketing: false,
      landing_page: '/certifications/pmp',
      first_utm_source: 'google',
      utm_source: 'linkedin',
      first_utm_campaign: 'launch',
      utm_campaign: 'retarget',
    });
  });

  it('blocks trusted tracking collisions from the form-controlled payload', () => {
    expect(
      sanitizeInteractionPayload({
        first_utm_source: 'spoofed',
        utm_source: 'spoofed',
        first_gclid: 'spoofed',
      }),
    ).toEqual({});
  });
});

describe('PMP roadmap payload sanitization compatibility', () => {
  it('keeps new Industry/Experience/Need taxonomy and Other details as strings', () => {
    expect(
      sanitizeInteractionPayload({
        formVersion: 'p0.6.2-333-authoritative',
        workField: 'other',
        workFieldOther: 'Aviation',
        pmExperience: 'under_2',
        needsObjective: 'guidance',
        education: 'bachelor_plus',
        trainingStatus: 'completed',
        examTimeline: '3_to_6',
        qualificationOutcome: 'needs_verification',
      }),
    ).toMatchObject({
      formVersion: 'p0.6.2-333-authoritative',
      workField: 'other',
      workFieldOther: 'Aviation',
      pmExperience: 'under_2',
      needsObjective: 'guidance',
      examTimeline: '3_to_6',
    });
  });

  it('preserves legacy contact preference keys for historical reads without inventing them', () => {
    const legacy = sanitizeInteractionPayload({
      pmExperience: '5_plus',
      preferredContactChannel: 'whatsapp',
      preferredContactWindow: 'weekday_evening',
      contactChannel: 'instagram',
    });
    expect(legacy).toMatchObject({
      pmExperience: '5_plus',
      preferredContactChannel: 'whatsapp',
      preferredContactWindow: 'weekday_evening',
      contactChannel: 'instagram',
    });

    const modern = sanitizeInteractionPayload({
      workField: 'civil_engineering',
      pmExperience: '2_to_5',
      needsObjective: 'prepare_exam',
    });
    expect(modern).not.toHaveProperty('preferredContactChannel');
    expect(modern).not.toHaveProperty('preferredContactWindow');
    expect(modern).not.toHaveProperty('contactChannel');
  });
});
