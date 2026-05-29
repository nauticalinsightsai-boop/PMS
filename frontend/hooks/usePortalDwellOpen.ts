'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const DEFAULT_DWELL_MS = 600

type Options = {
  dwellMs?: number
}

/**
 * Hover-to-open with dwell close; click pins open until outside click.
 */
export function usePortalDwellOpen({ dwellMs = DEFAULT_DWELL_MS }: Options = {}) {
  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => {
      if (!pinned) setOpen(false)
    }, dwellMs)
  }, [clearCloseTimer, dwellMs, pinned])

  const onPointerEnter = useCallback(() => {
    clearCloseTimer()
    setOpen(true)
  }, [clearCloseTimer])

  const onPointerLeave = useCallback(() => {
    if (!pinned) scheduleClose()
  }, [pinned, scheduleClose])

  const onToggleClick = useCallback(() => {
    setPinned((p) => {
      const next = !p
      setOpen(next)
      if (!next) clearCloseTimer()
      return next
    })
  }, [clearCloseTimer])

  useEffect(() => {
    if (!open || !pinned) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setPinned(false)
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, pinned])

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer])

  return {
    open,
    pinned,
    rootRef,
    onPointerEnter,
    onPointerLeave,
    onToggleClick,
    setOpen,
    setPinned,
  }
}
