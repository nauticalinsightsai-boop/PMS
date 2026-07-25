import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const PUBLIC_LEAD_FORMS = [
  '../../components/conversion-recovery/BottomCtaRotator.tsx',
  '../../components/conversion-recovery/LeadRecoveryDialog.tsx',
  '../../components/forms/WaitlistForm.tsx',
  '../../components/forms/ScholarshipReviewForm.tsx',
  '../../components/forms/RegisterNowDialog.tsx',
  '../../components/forms/PmServiceAdvisoryLeadForm.tsx',
  '../../components/channel-landing/ChannelLandingPublicView.tsx',
  '../../components/forms/PmpRoadmapLeadForm.tsx',
  '../../components/forms/NewsletterSubscribeForm.tsx',
  '../../components/forms/NewsletterHeroSubscribeForm.tsx',
  '../../components/forms/MasteryConsultationForm.tsx',
  '../../components/forms/JoinWaitlistDialog.tsx',
  '../../components/forms/CommunityWaitlistForm.tsx',
  '../../components/RegisterModal.tsx',
  '../../components/pages/Contact.tsx',
  '../../components/seo/KeywordLeadPopup.tsx',
] as const;

describe('public lead form conversion boundary', () => {
  it.each(PUBLIC_LEAD_FORMS)('%s uses the shared persisted-interaction API', (relativePath) => {
    const source = readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8');
    expect(source).toContain('submitPublicInteraction(');
    expect(source).not.toMatch(/\btrackGenerateLead\s*\(/);
    expect(source).not.toMatch(/\btrackPmpQualificationFormSubmit\s*\(/);
    expect(source).not.toMatch(/\btrackRoadmapLeadSubmit\s*\(/);
  });

  it('owns generate_lead at the authoritative 201 boundary', () => {
    const submitPublic = readFileSync(
      fileURLToPath(new URL('../interactions/submit-public.ts', import.meta.url)),
      'utf8',
    );
    expect(submitPublic).toContain("res.status === 201");
    expect(submitPublic).toContain('trackPersistedLeadSuccess({');
  });
});
