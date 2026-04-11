'use client'

import { useCallback, useMemo } from 'react'

type HapticPattern = number | number[]

export const useHaptic = () => {
  const trigger = useCallback((pattern: HapticPattern) => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern)
      } catch (error) {
        console.warn('Haptic feedback not supported or blocked', error)
      }
    }
  }, [])

  const lightTap = useCallback(() => trigger(15), [trigger])
  const mediumTap = useCallback(() => trigger(30), [trigger])
  const errorBuzz = useCallback(() => trigger([40, 60, 40]), [trigger])
  const heartbeat = useCallback(() => trigger([70, 50, 70]), [trigger])
  const successMagic = useCallback(() => trigger([50, 100, 150]), [trigger])

  return useMemo(
    () => ({
      lightTap,
      mediumTap,
      errorBuzz,
      heartbeat,
      successMagic,
    }),
    [errorBuzz, heartbeat, lightTap, mediumTap, successMagic],
  )
}
