'use client'

import { useEffect, useRef, useState } from 'react'

type UseScrollCondensedOptions = {
  /**
   * Seuil de scroll pour activer le mode condensé (en pixels)
   * @default 50
   */
  threshold?: number

  /**
   * Écart pour éviter le flickering (hysteresis)
   * Active à threshold, désactive à threshold - hysteresis
   * @default 20
   */
  hysteresis?: number

  /**
   * Sélecteur du container de scroll
   * @default '[data-admin-scroll-container]'
   */
  containerSelector?: string
}

type UseScrollCondensedReturn = {
  /**
   * True si on a scrollé au-delà du seuil
   */
  isCondensed: boolean

  /**
   * Valeur du scroll actuel (pour debug)
   */
  scrollY: number
}

/**
 * Hook minimaliste pour détecter le scroll et basculer en mode "condensé"
 *
 * Technique 2025 : Sticky + Scale CSS pur
 *
 * ✅ Ultra simple (< 50 lignes)
 * ✅ Performant (passive listener + RAF)
 * ✅ Hysteresis anti-flicker
 * ✅ Support universel
 *
 * @example
 * ```tsx
 * const { isCondensed } = useScrollCondensed();
 *
 * return (
 *   <div className={cn(
 *     'sticky top-0 transition-all duration-300',
 *     isCondensed && 'scale-90'
 *   )}>
 *     Header
 *   </div>
 * );
 * ```
 */
export function useScrollCondensed(
  options: UseScrollCondensedOptions = {},
): UseScrollCondensedReturn {
  const {
    threshold = 50,
    hysteresis = 20,
    containerSelector = '[data-admin-scroll-container]',
  } = options

  const [isCondensed, setIsCondensed] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const rafId = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const scrollContainer = document.querySelector<HTMLElement>(containerSelector)
    const target = scrollContainer || window

    const handleScroll = () => {
      // Annuler le RAF précédent si pas encore exécuté
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }

      // Batching avec RAF pour performance
      rafId.current = requestAnimationFrame(() => {
        const currentScroll = scrollContainer ? scrollContainer.scrollTop : window.scrollY

        setScrollY(currentScroll)

        // Hysteresis : active à threshold, désactive à threshold - hysteresis
        // Évite le flickering entre les deux états
        setIsCondensed((prev) => {
          if (!prev && currentScroll >= threshold) {
            return true // Active
          }
          if (prev && currentScroll < threshold - hysteresis) {
            return false // Désactive
          }
          return prev // Reste stable dans la zone d'hysteresis
        })
      })
    }

    // Appeler une fois au mount pour état initial
    handleScroll()

    // Passive listener pour performance
    target.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      target.removeEventListener('scroll', handleScroll as EventListener)
    }
  }, [threshold, hysteresis, containerSelector])

  return {
    isCondensed,
    scrollY,
  }
}
