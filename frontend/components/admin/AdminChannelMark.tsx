'use client';

import {
  getChannelMarkPath,
  hasChannelMark,
} from '@pms/booking-crm/channel-landing-pages/channelMarkAssets';
import PlatformChannelIcon from '@/components/admin/PlatformChannelIcon';

export type ChannelMarkPill = {
  backgroundColor: string;
  color?: string;
  borderRadius?: string | number;
  iconSize?: number;
};

type AdminChannelMarkProps = {
  channelId: string;
  fallbackIcon?: string;
  /** Display size: PNG fills this; Lucide pill uses this as the box. */
  size?: number;
  className?: string;
  colorScheme?: 'light' | 'dark';
  /** Lucide-only brand pill. Ignored when a custom PNG mark exists. */
  pill?: ChannelMarkPill;
};

export default function AdminChannelMark({
  channelId,
  fallbackIcon,
  size = 18,
  className = '',
  colorScheme = 'light',
  pill,
}: AdminChannelMarkProps) {
  const customMark = hasChannelMark(channelId);
  const markSrc = customMark ? getChannelMarkPath(channelId, colorScheme) : null;

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
