import { PortalRegionShell } from '@/app/go/[channel]/PortalRegionShell';

export default function GoChannelLayout({ children }: { children: React.ReactNode }) {
  return <PortalRegionShell>{children}</PortalRegionShell>;
}
