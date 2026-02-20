'use client'

import { Button } from '@make-the-change/core/ui'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { HomePartnerProducer } from './home.types'

type HomePartnersSectionBaseProps = {
  producers: HomePartnerProducer[]
  variant?: 'default' | 'muted'
}

type HomePartnersCarouselProps = HomePartnersSectionBaseProps & {
  mode?: 'carousel'
  title: string
  description: string
}

type HomePartnersEmptyProps = HomePartnersSectionBaseProps & {
  mode: 'empty'
  emptyTitle: string
  emptyDescription: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string | null
}

type HomePartnersSectionProps = HomePartnersCarouselProps | HomePartnersEmptyProps

const AUTO_SCROLL_RESUME_DELAY_MS = 3000
const carouselButtonClassName =
  'absolute top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card/80 text-foreground backdrop-blur-sm transition-all hover:bg-card'

function HomePartnersCarousel({
  producers,
  variant = 'default',
  title,
  description,
}: HomePartnersCarouselProps) {
  const scrollContainerRef = useRef<HTMLUListElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)

  const duplicatedProducers = useMemo(
    () => Array.from({ length: 5 }).flatMap(() => producers),
    [producers],
  )

  const checkScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) {
      return
    }

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth)
  }, [])

  const scroll = useCallback((direction: 'left' | 'right') => {
    setIsAutoScrolling(false)

    const container = scrollContainerRef.current
    if (!container) {
      return
    }

    const scrollAmount = container.clientWidth * 0.8
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })

    setTimeout(() => setIsAutoScrolling(true), AUTO_SCROLL_RESUME_DELAY_MS)
  }, [])

  const autoScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container || !isAutoScrolling) {
      return
    }

    const maxScroll = container.scrollWidth - container.clientWidth
    if (container.scrollLeft >= maxScroll) {
      container.scrollLeft = 0
      return
    }

    container.scrollLeft += 1
  }, [isAutoScrolling])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) {
      return
    }

    checkScrollButtons()
    container.addEventListener('scroll', checkScrollButtons)

    return () => {
      container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [checkScrollButtons])

  useEffect(() => {
    if (!isAutoScrolling) {
      return
    }

    let animationFrameId = 0

    const animate = () => {
      autoScroll()
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [autoScroll, isAutoScrolling])

  return (
    <section className={cn('py-16', variant === 'muted' && 'bg-muted/30')}>
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{description}</p>
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Précédent"
            className={cn(
              carouselButtonClassName,
              'left-0',
              canScrollLeft ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Suivant"
            className={cn(
              carouselButtonClassName,
              'right-0',
              canScrollRight ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <ul
            ref={scrollContainerRef}
            aria-label="Liste des partenaires"
            className="m-0 flex list-none gap-8 overflow-x-auto px-12 py-1 scrollbar-hide scroll-smooth"
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
          >
            {duplicatedProducers.map((producer, index) => (
              <li key={`${producer.id}-${index}`} className="shrink-0">
                <Link
                  href={`/producers/${producer.id}`}
                  className="group block h-32 w-64 cursor-pointer rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card"
                >
                  <div className="flex items-center gap-4 px-6 py-6 text-center">
                    {producer.images.length > 0 ? (
                      <img
                        src={producer.images[0]}
                        alt={producer.name_default}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <span className="text-lg font-bold text-foreground">
                          {producer.name_default.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-foreground transition-transform group-hover:scale-105">
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

export const HomePartnersSection = (props: HomePartnersSectionProps) => {
  if (props.mode === 'empty')
    return (
      <section className={cn('py-16', props.variant === 'muted' && 'bg-muted/30')}>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-border/70 bg-card/60 px-6 py-12 text-center shadow-sm backdrop-blur-sm sm:px-10">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">{props.emptyTitle}</h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {props.emptyDescription}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild className="w-full sm:w-auto">
                <Link href={props.primaryCtaHref}>{props.primaryCtaLabel}</Link>
              </Button>
              {props.secondaryCtaLabel && props.secondaryCtaHref ? (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={props.secondaryCtaHref} target="_blank" rel="noreferrer">
                    {props.secondaryCtaLabel}
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    )

  return (
    <HomePartnersCarousel
      producers={props.producers}
      variant={props.variant}
      title={props.title}
      description={props.description}
    />
  )
}
