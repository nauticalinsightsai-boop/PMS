'use client';

import {
  Briefcase,
  Globe,
  Settings,
  Zap,
  type LucideIcon,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  settings: Settings,
  globe: Globe,
  zap: Zap,
};

export function serviceIcon(key: string): LucideIcon {
  return MAP[key] ?? Briefcase;
}
