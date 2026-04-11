'use client'

import { useCallback, useMemo } from 'react'

type HapticPattern = number | number[]

export const useHaptic = () => {
  const isSupported =
    typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'

  const trigger = useCallback((pattern: HapticPattern) => {
    if (!isSupported) {
      return false
    }

    try {
      return navigator.vibrate(pattern)
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Haptic feedback not supported or blocked', error)
      }
      return false
    }
  }, [isSupported])

  const lightTap = useCallback(() => trigger(15), [trigger])
  const mediumTap = useCallback(() => trigger(30), [trigger])
  const errorBuzz = useCallback(() => trigger([40, 60, 40]), [trigger])
  const heartbeat = useCallback(() => trigger([70, 50, 70]), [trigger])
  const successMagic = useCallback(() => trigger([50, 100, 150]), [trigger])

  return useMemo(
    () => ({
      isSupported,
      trigger,
      lightTap,
      mediumTap,
      errorBuzz,
      heartbeat,
      successMagic,
    }),
    [errorBuzz, heartbeat, isSupported, lightTap, mediumTap, successMagic, trigger],
  )
}
