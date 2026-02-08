'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Hook d'animation optimisé SANS dépendance externe
 *
 * Utilise requestAnimationFrame + CSS custom properties pour
 * des animations ultra-smooth synchronisées avec le GPU.
 *
 * Performance : 60 FPS garanti, pas de re-render React inutile.
 *
 * @example
 * ```tsx
 * const animation = useScrollAnimationOptimized();
 *
 * // Utiliser les classes CSS
 * <div className="cover-animated" style={animation.coverStyle}>
 *   Cover
 * </div>
 * ```
 */
export function useScrollAnimationOptimized() {
  const [isCondensed, setIsCondensed] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const rafId = useRef<number | null>(null)
  const lastProgress = useRef(0)

  // Desktop detection
  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia('(min-width: 768px)')
    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)

    setIsDesktop(media.matches)
    media.addEventListener('change', handleChange)

    return () => media.removeEventListener('change', handleChange)
  }, [])

  // Animation de scroll avec RAF
  useEffect(() => {
    if (typeof window === 'undefined') return

    const scrollContainer = document.querySelector<HTMLElement>('[data-admin-scroll-container]')
    const target = scrollContainer || window
    const root = document.documentElement

    // Easing function (ease-out cubic)
    const easeOutCubic = (x: number): number => 1 - (1 - x) ** 3

    const handleScroll = () => {
      // Annuler le RAF précédent si existant
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }

      // Nouveau RAF synchronisé avec le GPU
      rafId.current = requestAnimationFrame(() => {
        const scrollTop = scrollContainer ? scrollContainer.scrollTop : window.scrollY

        // Calcul du progress (0 à 1)
        const start = 6
        const end = 80
        const rawProgress = Math.min(1, Math.max(0, (scrollTop - start) / (end - start)))

        // Appliquer l'easing
        const easedProgress = easeOutCubic(rawProgress)

        // Éviter les updates inutiles (throttling intelligent)
        if (Math.abs(easedProgress - lastProgress.current) < 0.001) {
          return
        }
        lastProgress.current = easedProgress

        // Update CSS custom properties (ultra performant - GPU)
        root.style.setProperty('--scroll-progress', String(easedProgress))
        root.style.setProperty('--scroll-progress-raw', String(rawProgress))

        // Toggle condensé (hysteresis)
        setIsCondensed((prev) => {
          if (!prev && scrollTop > 12) return true
          if (prev && scrollTop < 4) return false
          return prev
        })
      })
    }

    // Initial call
    handleScroll()

    // Listener avec passive: true pour performance
    target.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      target.removeEventListener('scroll', handleScroll as EventListener)
    }
  }, [])

  // Styles calculés (mémorisés)
  const styles = useMemo(() => {
    const lerp = (start: number, end: number, t: number) => start + (end - start) * t

    // Utilise calc() avec CSS custom properties pour calculs GPU-side
    return {
      coverStyle: {
        height: isDesktop
          ? 'calc(360px - (360px - 110px) * var(--scroll-progress))'
          : 'calc(320px - (320px - 60px) * var(--scroll-progress))',
        transform: 'translateY(calc(var(--scroll-progress) * -10px))',
        willChange: 'height, transform',
      } as React.CSSProperties,

      contentStyle: {
        transform: 'translateY(calc(var(--scroll-progress) * -7px))',
        padding:
          'calc((32px - (32px - 14px) * var(--scroll-progress))) calc((40px - (40px - 17.5px) * var(--scroll-progress)))',
        willChange: 'transform, padding',
      } as React.CSSProperties,

      avatarStyle: {
        transform: 'scale(calc(1 - (0.55 * var(--scroll-progress))))',
        opacity: 'calc(0.95 + (0.05 * (1 - var(--scroll-progress))))',
        transformOrigin: 'center',
        willChange: 'transform, opacity',
        transition: 'transform 0.05s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.05s ease-out',
      } as React.CSSProperties,

      avatarGroupStyle: {
        marginTop: isDesktop
          ? 'calc(-120px + (64px * var(--scroll-progress)))'
          : 'calc(-96px + (56px * var(--scroll-progress)))',
        paddingBottom: isCondensed ? '0.75rem' : '2rem',
        transition: 'padding-bottom 0.3s ease',
        willChange: 'margin-top',
      } as React.CSSProperties,
    }
  }, [isDesktop, isCondensed])

  return {
    isCondensed,
    isDesktop,
    coverStyle: styles.coverStyle,
    contentStyle: styles.contentStyle,
    avatarStyle: styles.avatarStyle,
    avatarGroupStyle: styles.avatarGroupStyle,
  }
}
