import * as React from 'react';
import { cn } from '@/lib/utils';

export type RegionFlagCode =
  | 'us'
  | 'uk'
  | 'eu'
  | 'ae'
  | 'sa'
  | 'qa'
  | 'bh'
  | 'kw'
  | 'om'
  | 'pk'
  | 'in';

const FLAG_VIEWBOX = '0 0 32 22';

function FlagSvg({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox={FLAG_VIEWBOX}
      className={cn('h-[22px] w-8 shrink-0 rounded-[4px] border border-black/10 shadow-sm', className)}
      aria-hidden
    >
      {children}
    </svg>
  );
}

const FLAGS: Record<RegionFlagCode, React.ReactNode> = {
  us: (
    <FlagSvg>
      <rect width="32" height="22" fill="#B22234" />
      <rect y="1.69" width="32" height="1.69" fill="#fff" />
      <rect y="5.08" width="32" height="1.69" fill="#fff" />
      <rect y="8.46" width="32" height="1.69" fill="#fff" />
      <rect y="11.85" width="32" height="1.69" fill="#fff" />
      <rect y="15.23" width="32" height="1.69" fill="#fff" />
      <rect y="18.62" width="32" height="1.69" fill="#fff" />
      <rect width="12.8" height="11.85" fill="#3C3B6E" />
    </FlagSvg>
  ),
  uk: (
    <FlagSvg>
      <rect width="32" height="22" fill="#012169" />
      <path d="M0 0l32 22M32 0L0 22" stroke="#fff" strokeWidth="3.2" />
      <path d="M0 0l32 22M32 0L0 22" stroke="#C8102E" strokeWidth="1.6" />
      <path d="M16 0v22M0 11h32" stroke="#fff" strokeWidth="5.2" />
      <path d="M16 0v22M0 11h32" stroke="#C8102E" strokeWidth="3.2" />
    </FlagSvg>
  ),
  eu: (
    <FlagSvg>
      <rect width="32" height="22" fill="#003399" />
      <g fill="#FFCC00" transform="translate(16 11)">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <circle key={deg} cx="0" cy="-6.5" r="1.1" transform={`rotate(${deg})`} />
        ))}
      </g>
    </FlagSvg>
  ),
  ae: (
    <FlagSvg>
      <rect width="32" height="22" fill="#00732F" />
      <rect y="7.33" width="32" height="7.33" fill="#fff" />
      <rect y="14.67" width="32" height="7.33" fill="#000" />
      <rect width="8" height="22" fill="#FF0000" />
    </FlagSvg>
  ),
  sa: (
    <FlagSvg>
      <rect width="32" height="22" fill="#006C35" />
      <text x="16" y="14" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="serif">
        ☪
      </text>
    </FlagSvg>
  ),
  qa: (
    <FlagSvg>
      <rect width="32" height="22" fill="#8D1B3D" />
      <path d="M8 0h2v22H8c-4-2-6-5-6-11s2-9 6-11z" fill="#fff" />
    </FlagSvg>
  ),
  bh: (
    <FlagSvg>
      <rect width="32" height="22" fill="#CE1126" />
      <path d="M8 0h2v22H8c-4-2-6-5-6-11s2-9 6-11z" fill="#fff" />
    </FlagSvg>
  ),
  kw: (
    <FlagSvg>
      <rect width="32" height="7.33" fill="#007A3D" />
      <rect y="7.33" width="32" height="7.33" fill="#fff" />
      <rect y="14.67" width="32" height="7.33" fill="#CE1126" />
      <polygon points="0,0 10,11 0,22" fill="#000" />
    </FlagSvg>
  ),
  om: (
    <FlagSvg>
      <rect width="9" height="22" fill="#CD2E3A" />
      <rect x="9" width="23" height="11" fill="#fff" />
      <rect x="9" y="11" width="23" height="11" fill="#009543" />
    </FlagSvg>
  ),
  pk: (
    <FlagSvg>
      <rect width="32" height="22" fill="#01411C" />
      <rect width="10" height="22" fill="#fff" />
      <circle cx="13" cy="11" r="3.2" fill="#01411C" />
      <circle cx="13.6" cy="11" r="2.6" fill="#fff" />
      <circle cx="14.4" cy="11" r="2" fill="#01411C" />
    </FlagSvg>
  ),
  in: (
    <FlagSvg>
      <rect width="32" height="7.33" fill="#FF9933" />
      <rect y="7.33" width="32" height="7.33" fill="#fff" />
      <rect y="14.67" width="32" height="7.33" fill="#138808" />
      <circle cx="16" cy="11" r="2.2" fill="none" stroke="#000080" strokeWidth="0.5" />
      <circle cx="16" cy="11" r="0.4" fill="#000080" />
    </FlagSvg>
  ),
};

export function RegionFlag({ code, className }: { code: RegionFlagCode; className?: string }) {
  return <span className={cn('inline-flex overflow-hidden', className)}>{FLAGS[code]}</span>;
}
