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

import { motion } from 'framer-motion'

function HomePartnersCarousel({
  producers,
  variant = 'default',
  title,
  description,
}: HomePartnersCarouselProps) {
  // On crée une liste très longue pour s'assurer que l'écran est rempli et que l'animation boucle de manière fluide
  const duplicatedProducers = useMemo(
    () => Array.from({ length: 15 }).flatMap(() => producers),
    [producers],
  )

  return (
    <section className={cn('py-16 md:py-24 overflow-hidden', variant === 'muted' ? 'bg-muted/30' : 'bg-background')}>
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="mb-12 text-left">
          <h2 className="mb-4 text-3xl font-bold text-foreground dark:text-white md:text-4xl">{title}</h2>
          <p className="max-w-2xl text-lg text-muted-foreground dark:text-white/70">{description}</p>
        </div>
      </div>

      <div className="relative flex w-full flex-col overflow-hidden py-4">
        {/* Masques de fondu sur les bords pour l'effet d'apparition/disparition du marquee */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-background via-background/80 to-transparent" />

        <motion.ul
          className="flex w-max items-center py-6"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 40 }}
          whileHover={{ animationPlayState: 'paused' }}
        >
          {/* On duplique le contenu 2 fois pour un loop parfait de 0% à 50% */}
          {[...duplicatedProducers, ...duplicatedProducers].map((producer, index) => (
            <li key={`${producer.id}-${index}`} className="flex items-center justify-center px-8">
              <Link
                href={`/producers/${producer.id}`}
                className="whitespace-nowrap text-xl font-black uppercase tracking-widest text-muted-foreground/40 transition-colors duration-300 hover:text-foreground dark:text-muted-foreground/30 dark:hover:text-white md:text-2xl"
              >
                {producer.name_default}
              </Link>
            </li>
          ))}
        </motion.ul>
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
      title={props.title}
      description={props.description}
      {...(props.variant !== undefined ? { variant: props.variant } : {})}
    />
  )
}
