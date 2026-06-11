import type { LeadRecoveryContext, LeadRecoveryVariant, RecoveryCopy, RecoveryTierId } from './types';

const DEFAULT_SUBMIT = 'Send my details';

function tierLabel(tierId?: RecoveryTierId): string {
  if (tierId === 'foundation') return 'Foundation';
  if (tierId === 'professional') return 'Professional';
  if (tierId === 'mastery') return 'Mastery';
  return 'pathway';
}

function certLabel(ctx: LeadRecoveryContext): string {
  return ctx.certName ?? ctx.siteCertId?.toUpperCase() ?? 'your certification';
}

function pathwayEnrollReturnCopy(tierId: RecoveryTierId, ctx: LeadRecoveryContext): RecoveryCopy {
  const cert = certLabel(ctx);
  const tier = tierLabel(tierId);
  if (tierId === 'foundation') {
    return {
      headline: 'Questions before you enroll?',
      body: `Foundation is digital and self-paced. Tell us your timeline for ${cert}: we'll help you start with structure.`,
      submitLabel: 'Talk to us first',
    };
  }
  if (tierId === 'professional') {
    return {
      headline: 'Reserve without paying yet?',
      body: `Tell us your start date for ${cert} ${tier}: we'll confirm seat availability.`,
      submitLabel: 'Hold my place',
    };
  }
  return {
    headline: 'Mastery enrollment follows a conversation',
    body: `Share your details: we'll outline readiness review and next steps for ${cert} ${tier}.`,
    submitLabel: 'Request mentor follow-up',
  };
}

function pathwayCalendlyCopy(tierId: RecoveryTierId, explored: boolean): RecoveryCopy {
  const tier = tierLabel(tierId);
  if (!explored) {
    if (tierId === 'foundation') {
      return {
        headline: 'Prefer we call you first?',
        body: "Skip the calendar: we'll map your Foundation pathway and reply within 24 hours.",
        submitLabel: 'Request callback',
      };
    }
    if (tierId === 'professional') {
      return {
        headline: 'Stop overthinking',
        body: "Schedule a mentor call later: for now, leave WhatsApp and we'll reach out in 24 hours.",
        submitLabel: 'Request callback',
      };
    }
    return {
      headline: "Mastery isn't a quick click",
      body: "Leave your details: we'll schedule the right mentor conversation for you.",
      submitLabel: 'Request callback',
    };
  }
  if (tierId === 'foundation') {
    return {
      headline: 'Still deciding on Foundation?',
      body: "Share your details: we'll answer questions before you enroll.",
      submitLabel: DEFAULT_SUBMIT,
    };
  }
  if (tierId === 'professional') {
    return {
      headline: 'Need help choosing a cohort?',
      body: 'You looked at scheduling: we can hold a seat while you decide. Share your details.',
      submitLabel: DEFAULT_SUBMIT,
    };
  }
  return {
    headline: "Didn't find a time that works?",
    body: `We'll follow up with ${tier} mentor options: no calendar needed right now.`,
    submitLabel: DEFAULT_SUBMIT,
  };
}

function pathwayExitCopy(tierId: RecoveryTierId, ctx: LeadRecoveryContext): RecoveryCopy {
  const cert = certLabel(ctx);
  if (tierId === 'foundation') {
    return {
      headline: 'Not ready to enroll in Foundation?',
      body: `Leave your name and WhatsApp: we'll confirm eligibility and send a structured ${cert} study plan.`,
      submitLabel: 'Get my Foundation roadmap',
    };
  }
  if (tierId === 'professional') {
    return {
      headline: 'Comparing Professional?',
      body: `Blended live weekends + LMS. Leave your details: we'll recommend whether Professional fits your schedule.`,
      submitLabel: DEFAULT_SUBMIT,
    };
  }
  if (tierId === 'mastery') {
    return {
      headline: 'Mastery starts with a conversation',
      body: `Leave name + WhatsApp: a mentor will outline readiness review and next steps for ${cert}.`,
      submitLabel: 'Request mentor follow-up',
    };
  }
  return {
    headline: 'Which tier fits you?',
    body: "Foundation, Professional, or Mastery: tell us your preference and we'll recommend the right next step.",
    submitLabel: DEFAULT_SUBMIT,
    showTierPills: true,
  };
}

const VARIANT_COPY: Partial<Record<LeadRecoveryVariant, (ctx: LeadRecoveryContext) => RecoveryCopy>> = {
  home_roadmap_partial: () => ({
    headline: 'Almost there',
    body: "Name + WhatsApp is enough: we'll map your PM certification roadmap for you.",
    submitLabel: 'Submit quick details',
  }),
  home_insights_partial: () => ({
    headline: 'Almost there',
    body: "Share name and WhatsApp: we'll map your certification roadmap within 24 hours.",
    submitLabel: 'Submit quick details',
  }),
  home_calendly_fast: () => ({
    headline: 'Prefer we reach out first?',
    body: "Stop overthinking: leave your details and we'll map your pathway within 24 hours.",
    submitLabel: 'Request callback',
  }),
  home_calendly_explored: () => ({
    headline: 'Still deciding?',
    body: "Leave your details: we'll follow up with a roadmap. No calendar needed.",
    submitLabel: DEFAULT_SUBMIT,
  }),
  home_register_exit: () => ({
    headline: 'Talk to a mentor instead?',
    body: "Leave name + WhatsApp: we'll match you to the right certification pathway.",
    submitLabel: DEFAULT_SUBMIT,
  }),
  home_tool_calendly_bounce: () => ({
    headline: 'Want help choosing a tool?',
    body: "Leave your details: we'll recommend the right next step for your prep.",
    submitLabel: DEFAULT_SUBMIT,
  }),
  cert_roadmap_partial: (ctx) => ({
    headline: 'Almost done',
    body: `Name + WhatsApp is enough: we'll map your ${certLabel(ctx)} roadmap.`,
    submitLabel: 'Submit quick details',
  }),
  nav_register_partial: () => ({
    headline: 'Quick question before you go?',
    body: 'Leave name + WhatsApp: a mentor will follow up within 24 hours.',
    submitLabel: DEFAULT_SUBMIT,
  }),
  register_modal_partial: () => ({
    headline: 'Can we reach out instead?',
    body: "Just name + WhatsApp: we'll map your pathway and reply within 24 hours.",
    submitLabel: DEFAULT_SUBMIT,
  }),
  enroll_partial: (ctx) => ({
    headline: 'Questions before checkout?',
    body: `Tell us what's holding you back on ${certLabel(ctx)} enrollment: we'll help before you pay.`,
    submitLabel: 'Get help first',
  }),
  contact_partial: () => ({
    headline: 'Leave your details',
    body: "We'll finish your message and get back to you within 24 hours.",
    submitLabel: DEFAULT_SUBMIT,
  }),
  scholarship_partial: () => ({
    headline: 'Continue your scholarship request',
    body: "Leave email or WhatsApp: we'll follow up on regional pricing eligibility.",
    submitLabel: DEFAULT_SUBMIT,
  }),
  waitlist_partial: () => ({
    headline: 'Join the waitlist faster',
    body: "Leave your email: we'll add you and notify you when seats open.",
    submitLabel: 'Join waitlist',
  }),
  mastery_form_partial: () => ({
    headline: 'Continue your Mastery request',
    body: "Just name + WhatsApp: we'll complete the consultation request for you.",
    submitLabel: DEFAULT_SUBMIT,
  }),
  channel_landing_partial: () => ({
    headline: 'Leave your details',
    body: "We'll follow up on your channel request within 24 hours.",
    submitLabel: DEFAULT_SUBMIT,
  }),
  channel_portal_partial: () => ({
    headline: 'Leave your details',
    body: "We'll follow up on your portal mentor call request within 24 hours.",
    submitLabel: DEFAULT_SUBMIT,
  }),
  channel_calendly_bounce: () => ({
    headline: "Didn't schedule a time?",
    body: "Leave name + WhatsApp: we'll reach out to schedule for you.",
    submitLabel: DEFAULT_SUBMIT,
  }),
  services_contact_nudge: () => ({
    headline: 'Exploring PM services?',
    body: "Leave your details: we'll recommend the right engagement for your team.",
    submitLabel: 'Request follow-up',
  }),
  bottom_bar_r1: () => ({
    headline: 'Plan your certification pathway',
    body: 'Prepare with structure: talk to a mentor or map your roadmap.',
    submitLabel: DEFAULT_SUBMIT,
  }),
  bottom_bar_r2: () => ({
    headline: 'PMP 2026 is changing',
    body: 'Check readiness or get a structured study plan before exam day.',
    submitLabel: DEFAULT_SUBMIT,
  }),
  bottom_bar_r3: () => ({
    headline: 'Join 1,284+ professionals',
    body: "Don't study in isolation: connect with the PM Structure network.",
    submitLabel: DEFAULT_SUBMIT,
  }),
  bottom_bar_r4: () => ({
    headline: 'Map your roadmap in 24 hours',
    body: "Leave WhatsApp: we'll follow up with a structured certification plan.",
    submitLabel: DEFAULT_SUBMIT,
  }),
};

export function resolveRecoveryCopy(ctx: LeadRecoveryContext): RecoveryCopy {
  const { variant, tierId } = ctx;

  if (variant.startsWith('pathway_') && variant.includes('_calendly_')) {
    const explored = variant.endsWith('_explored');
    const tier: RecoveryTierId =
      variant.includes('_foundation_') ? 'foundation'
      : variant.includes('_professional_') ? 'professional'
      : 'mastery';
    return pathwayCalendlyCopy(tier, explored);
  }

  if (variant.startsWith('pathway_') && variant.endsWith('_enroll_return')) {
    const tier: RecoveryTierId =
      variant.includes('_foundation_') ? 'foundation'
      : variant.includes('_professional_') ? 'professional'
      : 'mastery';
    return pathwayEnrollReturnCopy(tier, ctx);
  }

  if (variant === 'pathway_foundation_exit') return pathwayExitCopy('foundation', ctx);
  if (variant === 'pathway_professional_exit') return pathwayExitCopy('professional', ctx);
  if (variant === 'pathway_mastery_exit') return pathwayExitCopy('mastery', ctx);
  if (variant === 'pathway_tier_unknown_exit') return pathwayExitCopy('unknown', ctx);

  const fn = VARIANT_COPY[variant];
  if (fn) return fn(ctx);

  return {
    headline: 'Leave your details',
    body: "We'll map your pathway and reply within 24 hours.",
    submitLabel: DEFAULT_SUBMIT,
  };
}

export function tierIdFromPathwayTier(tierId: string): RecoveryTierId {
  if (tierId === 'foundation') return 'foundation';
  if (tierId === 'professional') return 'professional';
  if (tierId === 'mastery' || tierId.startsWith('mastery')) return 'mastery';
  return 'unknown';
}

export function enrollReturnVariant(tierId: string): LeadRecoveryVariant {
  const t = tierIdFromPathwayTier(tierId);
  if (t === 'foundation') return 'pathway_foundation_enroll_return';
  if (t === 'professional') return 'pathway_professional_enroll_return';
  return 'pathway_mastery_enroll_return';
}

export function pathwayExitVariant(tierId: string): LeadRecoveryVariant {
  const t = tierIdFromPathwayTier(tierId);
  if (t === 'foundation') return 'pathway_foundation_exit';
  if (t === 'professional') return 'pathway_professional_exit';
  if (t === 'mastery') return 'pathway_mastery_exit';
  return 'pathway_tier_unknown_exit';
}

export function pathwayCalendlyVariant(tierId: string, explored: boolean): LeadRecoveryVariant {
  const t = tierIdFromPathwayTier(tierId);
  const suffix = explored ? 'explored' : 'fast';
  if (t === 'foundation') return `pathway_foundation_calendly_${suffix}` as LeadRecoveryVariant;
  if (t === 'professional') return `pathway_professional_calendly_${suffix}` as LeadRecoveryVariant;
  return `pathway_mastery_calendly_${suffix}` as LeadRecoveryVariant;
}

export function homeCalendlyVariant(explored: boolean): LeadRecoveryVariant {
  return explored ? 'home_calendly_explored' : 'home_calendly_fast';
}