import { LucideIcon } from "lucide-react";

export type FamilyId = "PMI" | "PRINCE2" | "SixSigma" | "FoundationDirect";

export interface FamilyConfig {
  id: FamilyId;
  name: string;
  description: string;
  accent: string;
  text: string;
  border: string;
  lightBg: string;
  gradient: string;
}

export interface TierPricing {
  duration: string;
  price: number;
}

export interface CertificationSummary {
  id: string;
  name: string;
  familyId: FamilyId;
  desc: string;
  outputValue: string;
  pricing: {
    Foundation: TierPricing;
    Professional: TierPricing;
    Elite: TierPricing;
  };
  color?: string;
  gradient?: string;
  
  // Detailed fields from dossier
  targetAudience?: string;
  prerequisites?: string;
  examFormat?: string;
  registrationSteps?: string;
  officialFee?: string;
  trainingPriceRange?: string;
  learningOutcomes?: string[];
  suggestedResources?: string[];
  recommendedCTA?: string;
  regionalDemand?: string;
}

export type TierLevel = "Foundation" | "Professional" | "Elite";

export interface PathwayTier {
  level: TierLevel;
  title: string;
  duration: string;
  details: string;
  price: string;
  membershipPrice: string;
  deliveryMode: string;
  outcomes: string[];
  ctaText: string;
  isPopular?: boolean;
}

export interface MembershipTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  variant: "default" | "outline";
  highlight?: boolean;
}

export interface NewsletterPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: NavLink[];
}

export interface SiteCTA {
  title: string;
  subtitle: string;
  primaryButton: { label: string; href: string };
  secondaryButton?: { label: string; href: string };
}
