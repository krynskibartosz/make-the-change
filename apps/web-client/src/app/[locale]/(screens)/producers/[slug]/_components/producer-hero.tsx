'use client'

import { useRef } from 'react'
import type {
  EditorialIdentity,
  ProducerLocation,
  VisualAssets,
} from '@/app/[locale]/(site)/producers/_features/mock-producers'
import { getRandomProducerImage } from '@/lib/placeholder-images'
import { getCountryFlag, resolveCountryCode } from '@/lib/location'
import { useHeroParallax } from '@/hooks/use-hero-parallax'
import { producerTypography as typo } from './producer-typography'

function getLocationFlag(countryName?: string): string {
  if (!countryName) return ''
  const base = (countryName.split(' · ')[0] ?? '').split(',')[0]?.trim() ?? ''
  const iso = resolveCountryCode(base)
  return iso ? getCountryFlag(iso) : ''
}

type ProducerHeroProps = {
  name: string
  tagline?: string
  partnerType?: string
  locations?: ProducerLocation
  images: string[]
  visualAssets?: VisualAssets
  editorialIdentity?: EditorialIdentity
  trustLine?: string
}

export function ProducerHero({
  name,
  tagline,
  partnerType,
  locations,
  images,
  visualAssets,
  editorialIdentity,
  trustLine,
}: ProducerHeroProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  useHeroParallax(imageRef)

  const coverImage = visualAssets?.hero || images[0] || getRandomProducerImage(name.length)
  const portraitImage =
    visualAssets?.portrait || images[1] || images[0] || getRandomProducerImage(name.length + 1)

  const displayTagline = editorialIdentity?.tagline || tagline
  const emotionalStatement = editorialIdentity?.emotionalStatement
  const displayPartnerType = editorialIdentity?.partnerType || partnerType

  const fieldLocation = locations?.fieldDetail
    ? `${locations.field} · ${locations.fieldDetail}`
    : locations?.field

  const europeanLocation = locations?.europeanDetail
    ? `${locations.european} · ${locations.europeanDetail}`
    : locations?.european

  const showEuropean = europeanLocation && locations?.european !== locations?.field

  return (
    <div className="relative">
      {/* ── Cover Image ── */}
      <div className="relative w-full overflow-hidden bg-[#1A1F26]" style={{ height: 'clamp(280px, 45vw, 420px)' }}>
        <img
          ref={imageRef}
          src={coverImage}
          alt={name}
          loading="eager"
          className="absolute inset-x-0 -top-6 h-[calc(100%+48px)] w-full object-cover"
        />
        {/* Gradient renforcé : lisibilité du titre sur toutes les images */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B0F15] to-transparent" />
      </div>

      {/* ── Identity Header ── */}
      <div className="relative px-4">
        {/* Portrait 72px — identification visuelle claire */}
        <div className="absolute -top-[36px] left-4 z-10 h-[72px] w-[72px] rounded-full border border-white/[0.08] bg-transparent shadow-[0_6px_24px_rgba(0,0,0,0.35)]">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white/[0.04]">
            <img
              src={portraitImage}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="h-12" />

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className={typo.heroTitle}>{editorialIdentity?.shortName || name}</h1>

            {displayTagline && <p className={`mt-1.5 ${typo.heroSubtitle}`}>{displayTagline}</p>}

            {emotionalStatement && (
              <p className={`mt-2.5 ${typo.heroStatement}`}>{emotionalStatement}</p>
            )}

            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              {fieldLocation && (
                <span className={`inline-flex items-center gap-1 ${typo.heroMeta}`}>
                  {getLocationFlag(locations?.field) && (
                    <span>{getLocationFlag(locations?.field)}</span>
                  )}
                  <span>{fieldLocation}</span>
                </span>
              )}
              {showEuropean && (
                <span className={`inline-flex items-center gap-1 ${typo.heroMetaMuted}`}>
                  {getLocationFlag(locations?.european) && (
                    <span>{getLocationFlag(locations?.european)}</span>
                  )}
                  <span>{europeanLocation}</span>
                </span>
              )}
            </div>

            {trustLine && <p className={`mt-2 ${typo.heroTrust}`}>{trustLine}</p>}

            {displayPartnerType && (
              <p className={`mt-1 ${typo.heroPartnerType}`}>{displayPartnerType}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
