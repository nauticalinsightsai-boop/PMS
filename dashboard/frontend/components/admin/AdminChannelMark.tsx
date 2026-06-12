'use client';

import { useEffect, useState } from 'react';
import {
  getChannelMarkPath,
  hasChannelMark,
} from '@pms/booking-crm/channel-landing-pages/channelMarkAssets';
import PlatformChannelIcon from '@/components/admin/PlatformChannelIcon';
import { useTheme } from '@/components/shared/ThemeProvider';

export type ChannelMarkPill = {
  backgroundColor: string;
  color?: string;
  borderRadius?: string | number;
  iconSize?: number;
};

type AdminChannelMarkProps = {
  channelId: string;
  fallbackIcon?: string;
  size?: number;
  className?: string;
  /** Override dashboard theme (e.g. portal preview). Defaults to active UI scheme. */
  colorScheme?: 'light' | 'dark';
  pill?: ChannelMarkPill;
};

function useDashboardMarkColorScheme(override?: 'light' | 'dark'): 'light' | 'dark' {
  const { theme } = useTheme();
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const read = () =>
      document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setScheme(read());
    const observer = new MutationObserver(() => setScheme(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [theme]);

  return override ?? scheme;
}

export default function AdminChannelMark({
  channelId,
  fallbackIcon,
  size = 18,
  className = '',
  colorScheme,
  pill,
}: AdminChannelMarkProps) {
  const resolvedScheme = useDashboardMarkColorScheme(colorScheme);
  const customMark = hasChannelMark(channelId);
  const markSrc = customMark ? getChannelMarkPath(channelId, resolvedScheme) : null;

  if (markSrc) {
    return (
      <img
        src={markSrc}
        alt=""
        width={size}
        height={size}
        className={`object-contain shrink-0 ${className}`.trim()}
        aria-hidden
      />
    );
  }

  const iconSize = pill?.iconSize ?? size;

  const icon = (
    <PlatformChannelIcon
      name={fallbackIcon}
      size={iconSize}
      className={pill ? undefined : className}
    />
  );

  if (pill) {
    return (
      <div
        className={`flex items-center justify-center shrink-0 ${className}`.trim()}
        style={{
          width: size,
          height: size,
          borderRadius: pill.borderRadius ?? '0.75rem',
          backgroundColor: pill.backgroundColor,
          color: pill.color ?? '#F4F4F5',
        }}
        aria-hidden
      >
        {icon}
      </div>
    );
  }

  return icon;
}
