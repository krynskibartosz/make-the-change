'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { HomePartnerProducer } from './home.types'

type HomeEcosystemSectionProps = {
  producers: HomePartnerProducer[]
  variant?: 'default' | 'muted'
}

const fallbackActors = ['Terra ONG', 'Bee Collective', 'Roots Local', 'Eco Makers', 'Agri Commons']

export function HomeEcosystemSection({ producers, variant = 'default' }: HomeEcosystemSectionProps) {
  const t = useTranslations('home_v2')
  const [isPaused, setIsPaused] = useState(false)

  const actors = useMemo(() => {
    if (producers.length > 0) {
      return producers.map((producer) => ({
        id: producer.id,
        name: producer.name_default,
        image: producer.images[0] || null,
      }))
    }

    return fallbackActors.map((name) => ({ id: name, name, image: null }))
  }, [producers])

  const trackItems = [...actors, ...actors]

  return (
    <section className={variant === 'muted' ? 'bg-muted/30 py-16 md:py-20' : 'bg-background py-16 md:py-20'}>
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12">
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">{t('ecosystem.title')}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
          {t('ecosystem.subtitle')}
        </p>
      </div>

      <div
        className="relative mt-8 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onPointerDown={() => setIsPaused(true)}
        onPointerUp={() => setIsPaused(false)}
        onPointerCancel={() => setIsPaused(false)}
      >
        <ul
          className="m-0 flex list-none items-center gap-8 p-0 pr-8 ecosystem-marquee"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {trackItems.map((actor, index) => {
            const isValidImage = actor.image && actor.image.trim() !== ''

            return (
              <li
                key={`${actor.id}-${index}`}
                className="flex items-center justify-center px-8"
              >
                {isValidImage ? (
                  <img
                    src={actor.image || ''}
                    alt={actor.name || ''}
                    loading="lazy"
                    className="max-h-12 max-w-[160px] object-contain opacity-40 grayscale filter transition-all duration-300 dark:opacity-30"
                  />
                ) : (
                  <span className="whitespace-nowrap text-xl font-black uppercase tracking-widest text-muted-foreground/40 dark:text-muted-foreground/30 md:text-2xl">
                    {actor.name}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

