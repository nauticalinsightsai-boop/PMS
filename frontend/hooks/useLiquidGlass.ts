'use client'

import { useEffect, useMemo, useRef } from 'react'

type LiquidGlassOptions = {
 /**
  * How strong the highlight is (0..1). This scales opacity only.
  */
 intensity?: number
 /**
  * Whether to enable the effect. Useful to disable on heavy pages.
  */
 enabled?: boolean
}

type LiquidGlassReturn = {
 ref: React.RefObject<HTMLElement | null>
 onMouseMove: (e: React.MouseEvent<HTMLElement>) => void
 onMouseLeave: () => void
 /**
  * Inline CSS variables used by `.glass-liquid-overlay`.
  */
 style: React.CSSProperties
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

/**
 * useLiquidGlass
 *
 * Tracks cursor position over an element and exposes CSS variables:
 * - --lg-x / --lg-y: cursor position (percent) for radial gradient anchor
 * - --lg-a: opacity multiplier (0..1)
 *
 * The CSS overlay is rendered separately (see `.glass-liquid-overlay` in globals).
 */
export function useLiquidGlass(options: LiquidGlassOptions = {}): LiquidGlassReturn {
 const { intensity = 0.5, enabled = true } = options

 const ref = useRef<HTMLElement>(null)
 const rafRef = useRef<number | null>(null)
 const targetRef = useRef({ x: 50, y: 50 })
 const currentRef = useRef({ x: 50, y: 50 })

 const isTouchDevice = useMemo(() => {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(hover: none)').matches ?? false
 }, [])

 const stop = () => {
  if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
  rafRef.current = null
 }

 const start = () => {
  if (rafRef.current != null) return

  rafRef.current = requestAnimationFrame(function tick() {
   const el = ref.current
   if (!el || !enabled || isTouchDevice) {
    stop()
    return
   }

   // Smooth follow (lerp)
   const ease = 0.12
   currentRef.current.x += (targetRef.current.x - currentRef.current.x) * ease
   currentRef.current.y += (targetRef.current.y - currentRef.current.y) * ease

   el.style.setProperty('--lg-x', `${currentRef.current.x.toFixed(2)}%`)
   el.style.setProperty('--lg-y', `${currentRef.current.y.toFixed(2)}%`)
   el.style.setProperty('--lg-a', String(clamp01(intensity)))

   rafRef.current = requestAnimationFrame(tick)
  })
 }

 useEffect(() => {
  return () => stop()
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [])

 const onMouseMove: LiquidGlassReturn['onMouseMove'] = (e) => {
  if (!enabled || isTouchDevice) return
  const el = ref.current
  if (!el) return

  const rect = el.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100

  targetRef.current.x = clamp01(x / 100) * 100
  targetRef.current.y = clamp01(y / 100) * 100

  // Start RAF only when the user is interacting with this element.
  start()
 }

 const onMouseLeave = () => {
  // Reset to center for next hover and stop RAF to avoid background work.
  targetRef.current.x = 50
  targetRef.current.y = 50

  const el = ref.current
  if (el) {
   el.style.setProperty('--lg-x', '50%')
   el.style.setProperty('--lg-y', '50%')
   el.style.setProperty('--lg-a', String(clamp01(intensity)))
  }

  stop()
 }

 const style = useMemo(
  () =>
   ({
    '--lg-x': '50%',
    '--lg-y': '50%',
    '--lg-a': String(clamp01(intensity)),
   }) as unknown as React.CSSProperties,
  [intensity]
 )

 return { ref, onMouseMove, onMouseLeave, style }
}


