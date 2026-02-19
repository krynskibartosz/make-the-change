'use client'

import { useEffect, useState } from 'react'

export function useScrollHeader() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollThreshold, setScrollThreshold] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Déterminer la direction du scroll
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up'

      // Seuil pour déclencher l'animation (100px)
      const threshold = 100

      if (currentScrollY > threshold) {
        // Si on scroll vers le bas et le header est visible, le cacher
        if (scrollDirection === 'down' && isVisible) {
          setIsVisible(false)
        }
        // Si on scroll vers le haut et le header est caché, l'afficher
        else if (scrollDirection === 'up' && !isVisible) {
          setIsVisible(true)
        }
      } else {
        // Si on est en haut de la page, toujours afficher le header
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
      setScrollThreshold(currentScrollY)
    }

    // Ajouter l'écouteur d'événement avec throttling pour optimiser les performances
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
