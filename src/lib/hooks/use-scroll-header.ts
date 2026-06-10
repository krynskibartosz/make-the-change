'use client'

import { useEffect, useState } from 'react'

/**
 * Hook porté depuis apps/web-client/src/components/layout/use-scroll-header.ts
 * Cache le header quand on scroll vers le bas, le réaffiche vers le haut.
 */
export function useScrollHeader() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollThreshold, setScrollThreshold] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up'
      const threshold = 80

      if (currentScrollY > threshold) {
        if (scrollDirection === 'down' && isVisible) {
          setIsVisible(false)
        } else if (scrollDirection === 'up' && !isVisible) {
          setIsVisible(true)
        }
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
      setScrollThreshold(currentScrollY)
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null
    const throttledHandleScroll = () => {
      if (timeoutId) return
      timeoutId = setTimeout(() => {
        handleScroll()
        timeoutId = null
      }, 16) // ~60fps
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [lastScrollY, isVisible])

  return { isVisible, scrollThreshold }
}
