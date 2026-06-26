'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalPortalProps = { children: ReactNode }

/**
 * Renders modal overlays inside the dashboard shell (`#dashboard-root`) so that
 * dashboard-scoped styles (`.dashboard-input`, `.text-label`, theme tokens, dark
 * mode) apply to the modal content. The overlay itself is `position: fixed`, so it
 * still stacks above fixed headers and escapes parent overflow clipping.
 * Falls back to `document.body` if the shell is not mounted.
 */
export function ModalPortal({ children }: ModalPortalProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setContainer(document.getElementById('dashboard-root') ?? document.body)
  }, [])

  if (!container) return null
  return createPortal(children, container)
}
