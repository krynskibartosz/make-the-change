import { useEffect, type RefObject } from 'react'

interface UseHeroParallaxOptions {
  maxOffset?: number
  scrollRange?: number
}

export function useHeroParallax<T extends HTMLElement>(
  imageRef: RefObject<T | null>,
  { maxOffset = 24, scrollRange = 260 }: UseHeroParallaxOptions = {},
) {
  useEffect(() => {
    const image = imageRef.current
    if (!image) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const scrollContainer = image.closest('[data-modal-scroll-root]') as HTMLElement | null
    if (!scrollContainer) return

    image.style.willChange = 'transform'

    let rafId: number | null = null

    const handleScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const progress = Math.min(scrollContainer.scrollTop / scrollRange, 1)
        image.style.transform = `translateY(${-(maxOffset * progress)}px)`
      })
    }

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
      image.style.willChange = ''
      image.style.transform = ''
    }
  }, [imageRef, maxOffset, scrollRange])
}
