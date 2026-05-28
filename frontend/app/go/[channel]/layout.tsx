import { RegionProvider } from '@/contexts/RegionContext';

export default function GoChannelLayout({ children }: { children: React.ReactNode }) {
  return <RegionProvider portalDefaults>{children}</RegionProvider>;
}
