export type RecoverySurface = 'center_dialog' | 'bottom_bar';

export type RecoveryTierId = 'foundation' | 'professional' | 'mastery' | 'unknown';

export type LeadRecoveryVariant =
  | 'home_roadmap_partial'
  | 'home_insights_partial'
  | 'home_calendly_fast'
  | 'home_calendly_explored'
  | 'home_register_exit'
  | 'home_tool_calendly_bounce'
  | 'cert_roadmap_partial'
  | 'nav_register_partial'
  | 'register_modal_partial'
  | 'pathway_foundation_exit'
  | 'pathway_professional_exit'
  | 'pathway_mastery_exit'
  | 'pathway_tier_unknown_exit'
  | 'pathway_foundation_calendly_fast'
  | 'pathway_foundation_calendly_explored'
  | 'pathway_professional_calendly_fast'
  | 'pathway_professional_calendly_explored'
  | 'pathway_mastery_calendly_fast'
  | 'pathway_mastery_calendly_explored'
  | 'pathway_foundation_enroll_return'
  | 'pathway_professional_enroll_return'
  | 'pathway_mastery_enroll_return'
  | 'enroll_partial'
  | 'contact_partial'
  | 'scholarship_partial'
  | 'waitlist_partial'
  | 'mastery_form_partial'
  | 'channel_landing_partial'
  | 'channel_portal_partial'
  | 'channel_calendly_bounce'
  | 'services_contact_nudge'
  | 'bottom_bar_r1'
  | 'bottom_bar_r2'
  | 'bottom_bar_r3'
  | 'bottom_bar_r4';

export type LeadRecoveryContext = {
  variant: LeadRecoveryVariant;
  siteCertId?: string;
  certName?: string;
  tierId?: RecoveryTierId;
  offeringId?: string;
  channelId?: string;
  parentSurface?: 'calendly' | 'pathway_modal' | 'roadmap_form' | 'register_modal' | 'enroll' | 'contact' | 'channel';
  preferredTier?: RecoveryTierId;
};

export type RecoveryCopy = {
  headline: string;
  body: string;
  submitLabel: string;
  showTierPills?: boolean;
};

export type BottomBarAction =
  | { type: 'calendly_hero' }
  | { type: 'link'; href: string; label: string }
  | { type: 'register_modal' }
  | { type: 'micro_form' }
  | { type: 'scroll'; anchor: string; label: string };

export type BottomBarRotation = {
  id: string;
  headline: string;
  body: string;
  primary: BottomBarAction;
  secondary?: BottomBarAction;
  dismissLabel: string;
  variant: LeadRecoveryVariant;
};

export type BottomBarPageGroup =
  | 'marketing_default'
  | 'home'
  | 'cert_detail'
  | 'pmp_seo'
  | 'services'
  | 'community'
  | 'membership'
  | 'content'
  | 'excluded';
