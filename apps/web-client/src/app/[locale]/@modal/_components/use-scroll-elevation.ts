'use client'

import { useEffect, useState, type RefObject } from 'react'

export function useScrollElevation<T extends HTMLElement>(
  ref: RefObject<T | null>,
  threshold = 4,
): boolean {
  const [elevated, setElevated] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setElevated(el.scrollTop > threshold)
    update()
    el.addEventListener('scroll', update, { passive: true })
    return () => el.removeEventListener('scroll', update)
  }, [ref, threshold])
  return elevated
}
