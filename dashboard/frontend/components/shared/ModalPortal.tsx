'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalPortalProps = { children: ReactNode }

/**
 * Renders modal overlays as children of document.body so z-modal stacks above
 * fixed headers and is not clipped by parent stacking contexts.
 */
export function ModalPortal({ children }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return createPortal(children, document.body)
}
