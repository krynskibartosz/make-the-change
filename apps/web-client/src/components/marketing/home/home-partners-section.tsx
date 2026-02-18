'use client'

import { useRef, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@make-the-change/core/ui'
import { cn } from '@/lib/utils'

type Producer = {
  id: string
  name_default: string
  description_default: string
  contact_website?: string
  images: string[]
}

type HomePartnersSectionProps = {
  producers: Producer[]
  variant?: 'default' | 'muted'
}

export function HomePartnersSection({ producers, variant = 'default' }: HomePartnersSectionProps) {
  const scrollContainerRef = useRef<HTMLUListElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)

  // Dupliquer les producteurs pour créer un effet infini
  const duplicatedProducers = [...producers, ...producers, ...producers, ...producers, ...producers]

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      )
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    setIsAutoScrolling(false) // Pause le défilement automatique
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = container.clientWidth * 0.8
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
      // Reprendre le défilement après 3 secondes
      setTimeout(() => setIsAutoScrolling(true), 3000)
    }
  }

  const autoScroll = () => {
    const container = scrollContainerRef.current
    if (container && isAutoScrolling) {
      const scrollAmount = 1 // Vitesse plus visible pour tester
      const currentScroll = container.scrollLeft
      const maxScroll = container.scrollWidth - container.clientWidth

      // Logique simple : si on atteint la fin, revenir au début
      if (currentScroll >= maxScroll) {
        container.scrollLeft = 0
      } else {
        container.scrollLeft += scrollAmount
      }

      // Debug plus fréquent pour voir ce qui se passe
      if (Math.random() < 0.02) {
        console.log('AutoScroll - currentScroll:', currentScroll, 'maxScroll:', maxScroll, 'isAutoScrolling:', isAutoScrolling)
      }
    }
  }

  // Debug temporaire
  console.log('HomePartnersSection - isAutoScrolling:', isAutoScrolling, 'producers length:', producers.length)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      checkScrollButtons()
      container.addEventListener('scroll', checkScrollButtons)
      return () => container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [])

  useEffect(() => {
    let animationFrameId: number

    const animate = () => {
      autoScroll()
      animationFrameId = requestAnimationFrame(animate)
    }

    console.log('useEffect autoScroll - isAutoScrolling:', isAutoScrolling)

    // Démarrer immédiatement si isAutoScrolling est true
    if (isAutoScrolling) {
      console.log('Démarrage de l\'animation')
      animationFrameId = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isAutoScrolling, duplicatedProducers])

  return (
    <section className={cn('py-16', variant === 'muted' && 'bg-muted/30')}>
      <div className="container  mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nos Partenaires
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nous collaborons avec les meilleurs partenaires pour vous offrir des solutions
            innovantes et durables
          </p>
        </div>

        <div className="relative">
          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Précédent"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 hover:bg-card text-foreground border border-border rounded-full transition-all backdrop-blur-sm ${!canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Suivant"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 hover:bg-card text-foreground border border-border rounded-full transition-all backdrop-blur-sm ${!canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Carousel container */}
          <ul
            ref={scrollContainerRef}
            aria-label="Liste des partenaires"
            className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth px-12 m-0 p-0 list-none"
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
          >
            {duplicatedProducers.map((producer: Producer, index: number) => (
              <li
                key={`${producer.id}-${index}`}
                className="flex-shrink-0"
              >
                <Link
                  href={`/producers/${producer.id}`}
                  className="block w-64 h-32 bg-card/50 border border-border rounded-2xl flex items-center justify-center hover:bg-card transition-all duration-300 group cursor-pointer backdrop-blur-sm"
                >
                  <div className="text-center px-6 flex items-center gap-4">
                    {producer.images && producer.images.length > 0 ? (
                      <img
                        src={producer.images[0]}
                        alt={producer.name_default}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <span className="text-foreground text-lg font-bold">
                          {producer.name_default.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="text-left">
                      <h3 className="text-foreground font-bold text-lg group-hover:scale-105 transition-transform">
                        {producer.name_default}
                      </h3>

                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>


      </div>
    </section>
  )
}
