import Link from 'next/link'
import { FOOTER_LEGAL_LINKS } from '@/constants/legal'

type Props = {
  linkColor?: string
  className?: string
}

export default function PortalLegalLinks({ linkColor, className = '' }: Props) {
  return (
    <nav className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-meta ${className}`} aria-label="Legal">
      {FOOTER_LEGAL_LINKS.map((item, i) => (
        <span key={item.href} className="inline-flex items-center gap-3">
          {i > 0 ? <span style={{ color: linkColor }} aria-hidden>·</span> : null}
          <Link
            href={item.href}
            className="hover:opacity-80 transition-opacity"
            style={linkColor ? { color: linkColor } : undefined}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.shortLabel}
          </Link>
        </span>
      ))}
    </nav>
  )
}
